"""RAG policy engine: grounds answers and recommendations in hospital SOPs.

Retrieval: SOP markdown files are split into sections, embedded as TF-IDF vectors
(unigrams + bigrams) and stored in an in-memory vector index; queries are matched by
cosine similarity. Generation: if ANTHROPIC_API_KEY is set, Claude writes a grounded
answer from the retrieved passages only; otherwise (or on any API failure) an
extractive answer is assembled from the best-matching sentences - the fail-safe path.
"""
import os
import re

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

from .config import SOP_DIR

LLM_MODEL = os.environ.get("INTELLICARE_LLM_MODEL", "claude-opus-5")
SYSTEM_PROMPT = (
    "You are the policy assistant inside IntelliCare, a hospital operations decision-support system. "
    "Answer using ONLY the SOP excerpts provided. Cite the SOP id in square brackets after each claim, "
    "e.g. [SOP-STF-02]. If the excerpts do not answer the question, say so plainly. "
    "You support operational decisions (beds, staff, equipment, scheduling); you do not give clinical "
    "diagnosis or treatment advice. Keep answers under 150 words."
)

# Hospital-domain query expansion: bridges abbreviations and everyday wording to SOP vocabulary.
SYNONYMS = {
    "icu": "intensive care unit critical care", "ed": "emergency department", "er": "emergency department",
    "opd": "outpatient", "ward": "general ward", "down": "unavailable failure", "crash": "unavailable failure",
    "outage": "unavailable failure", "fails": "failure unavailable", "broken": "failure unavailable",
    "ratio": "ratios minimum", "staff": "nurse staffing", "nurses": "nurse staffing", "full": "occupancy capacity",
    "overflow": "surge capacity", "extra": "surge flexible", "vent": "ventilator", "ventilators": "ventilator",
    "noshow": "no-show", "missed": "no-show", "wait": "waiting time", "delay": "waiting time",
"approve": "approval human-in-the-loop", "ai": "recommendations advisory",
}


def expand_query(query: str) -> str:
    words = re.findall(r"[a-z\-]+", query.lower())
    return query + " " + " ".join(SYNONYMS[w] for w in words if w in SYNONYMS)


class PolicyEngine:
    def __init__(self, sop_dir=SOP_DIR):
        self.chunks = []
        for path in sorted(sop_dir.glob("*.md")):
            text = path.read_text()
            title = text.splitlines()[0].lstrip("# ").strip()
            sop_id = title.split(":")[0]
            for section in re.split(r"\n(?=## )", text)[1:]:
                heading, _, body = section.partition("\n")
                self.chunks.append({"sop_id": sop_id, "title": title, "section": heading.lstrip("# ").strip(),
                                    "text": body.strip()})
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)
        self.index = self.vectorizer.fit_transform(
            [f"{c['title']} {c['section']} {c['text']}" for c in self.chunks])
        self._client = None
        if os.environ.get("ANTHROPIC_API_KEY"):
            try:
                import anthropic
                self._client = anthropic.Anthropic()
            except Exception:
                self._client = None

    @property
    def llm_enabled(self) -> bool:
        return self._client is not None

    def retrieve(self, query: str, k: int = 3) -> list[dict]:
        q = self.vectorizer.transform([expand_query(query)])
        scores = (self.index @ q.T).toarray().ravel()
        top = np.argsort(scores)[::-1][:k]
        return [{**self.chunks[i], "score": round(float(scores[i]), 3)} for i in top if scores[i] > 0]

    # ---------------------------------------------------------------- generation
    def _extractive(self, query: str, passages: list[dict]) -> str:
        terms = set(self.vectorizer.build_analyzer()(expand_query(query)))
        scored = []
        for p in passages:
            for sent in re.split(r"(?<=[.!?])\s+|\n", p["text"]):
                sent = sent.strip()
                if len(sent) < 25:
                    continue
                overlap = len(terms & set(self.vectorizer.build_analyzer()(sent)))
                scored.append((overlap + p["score"], sent, p["sop_id"]))
        scored.sort(key=lambda x: -x[0])
        picked, seen = [], set()
        for _, sent, sop in scored:
            if sent not in seen:
                picked.append(f"{sent} [{sop}]")
                seen.add(sent)
            if len(picked) == 3:
                break
        return " ".join(picked) if picked else "No relevant hospital policy was found for this question."

    def _llm(self, query: str, passages: list[dict]) -> str | None:
        import anthropic
        context = "\n\n".join(f"[{p['sop_id']}] {p['title']} - {p['section']}\n{p['text']}" for p in passages)
        try:
            response = self._client.beta.messages.create(
                model=LLM_MODEL,
                max_tokens=2000,
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",  # server-side re-run on another model if the request is declined
                output_config={"effort": "low"},  # short grounded answers don't need deep reasoning
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": f"SOP excerpts:\n{context}\n\nQuestion: {query}"}],
            )
        except (anthropic.APIConnectionError, anthropic.RateLimitError, anthropic.APIStatusError):
            return None
        if response.stop_reason == "refusal":
            return None
        text = "".join(b.text for b in response.content if b.type == "text").strip()
        return text or None

    def answer(self, question: str) -> dict:
        passages = self.retrieve(question)
        text, mode = None, "EXTRACTIVE_FALLBACK"
        if passages and self.llm_enabled:
            text = self._llm(question, passages)
            mode = "LLM" if text else "EXTRACTIVE_FALLBACK"
        if text is None:
            text = self._extractive(question, passages)
        return {"question": question, "answer": text, "mode": mode, "citations": [
            {"sop_id": p["sop_id"], "title": p["title"], "section": p["section"], "excerpt": p["text"][:300],
             "score": p["score"]} for p in passages]}

    def explain(self, rec: dict) -> dict:
        """Attach the governing SOP to an optimizer recommendation (no LLM call: fast and deterministic)."""
        query = f"{rec['action']} {rec['reason']} {rec['type'].lower()} {rec['unit'].lower()}"
        if rec["unit"] == "ICU" and rec["type"] == "BEDS":
            query += " convert step-down beds ICU-capable escalation"
        passages = self.retrieve(query, k=2)
        return {
            "justification": self._extractive(query, passages),
            "citations": [{"sop_id": p["sop_id"], "title": p["title"], "section": p["section"]} for p in passages],
        }

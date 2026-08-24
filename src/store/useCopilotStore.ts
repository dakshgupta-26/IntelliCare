import { create } from 'zustand';
import { 
  CopilotMessage, 
  CopilotThread, 
  ContextScope, 
  ThinkingStage, 
  CopilotToast, 
  CopilotBookmark,
  TourStep
} from '../types/copilot';
import { COPILOT_TOUR_STEPS } from '../data/copilotKnowledge';
import { generateCopilotAnswer } from '../services/copilotEngine';

interface CopilotState {
  // Window UI State
  isOpen: boolean;
  isExpanded: boolean;
  isVoiceMode: boolean;
  isSidebarOpen: boolean;
  isBookmarksOpen: boolean;
  soundFxEnabled: boolean;
  unreadCount: number;

  // Tour & Spotlight State
  isTourActive: boolean;
  tourStepIndex: number;
  tourSteps: TourStep[];

  // Conversation & Multi-Thread State
  activeThreadId: string;
  threads: CopilotThread[];
  activeThinkingStage: ThinkingStage;
  isStreaming: boolean;
  abortController: AbortController | null;

  // Context & Scoping
  contextScope: ContextScope;

  // Notifications & Bookmarks
  toasts: CopilotToast[];
  bookmarks: CopilotBookmark[];

  // Actions
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  toggleExpanded: () => void;
  toggleVoiceMode: (open?: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setBookmarksOpen: (open: boolean) => void;
  toggleSoundFx: () => void;
  markAsRead: () => void;

  // Tour Actions
  startTour: (stepIndex?: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;

  // Message & Streaming Actions
  sendMessage: (prompt: string) => Promise<void>;
  cancelStreaming: () => void;
  regenerateMessage: (messageId?: string) => Promise<void>;
  toggleLikeMessage: (messageId: string, liked: boolean) => void;

  // Thread Management Actions
  createNewThread: (initialPrompt?: string) => string;
  switchThread: (id: string) => void;
  renameThread: (id: string, title: string) => void;
  deleteThread: (id: string) => void;
  pinThread: (id: string) => void;
  clearChat: () => void;
  exportThread: (threadId?: string, format?: 'markdown' | 'json') => string;

  // Bookmark & Notification Actions
  toggleBookmark: (message: CopilotMessage) => void;
  removeBookmark: (bookmarkId: string) => void;
  addToast: (toast: Omit<CopilotToast, 'id' | 'timestamp'>) => void;
  dismissToast: (id: string) => void;

  // Context Scoping Actions
  setContextScope: (scope: Partial<ContextScope>) => void;
}

const INITIAL_MESSAGE: CopilotMessage = {
  id: 'msg-welcome-01',
  sender: 'assistant',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  text: `👋 **Hi! I'm IntelliCare AI Copilot.**

I am your proactive clinical operations assistant for **IntelliCare**. I can explain demand forecasting, mathematical optimization, operational RAG protocols, system architecture, or simulate capacity surges.

How can I assist your operational decisions today?`,
  suggestedFollowUps: [
    'Explain IntelliCare overview & novelty',
    'How does forecasting predict ICU surges?',
    'Explain MILP optimization & OR-Tools',
    'Give me a guided platform tour'
  ]
};

const INITIAL_THREAD: CopilotThread = {
  id: 'thread-default-01',
  title: 'Hospital Operational Intelligence',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  pinned: true,
  messages: [INITIAL_MESSAGE]
};

const DEFAULT_CONTEXT_SCOPE: ContextScope = {
  page: '/',
  pageTitle: 'Platform Overview',
  department: 'Emergency & ICU',
  resource: 'Beds & Nursing Staff',
  hospital: 'IntelliCare Metro Medical',
  userRole: 'HOSPITAL_ADMIN'
};

export const useCopilotStore = create<CopilotState>((set, get) => ({
  isOpen: false,
  isExpanded: false,
  isVoiceMode: false,
  isSidebarOpen: false,
  isBookmarksOpen: false,
  soundFxEnabled: true,
  unreadCount: 1,

  isTourActive: false,
  tourStepIndex: 0,
  tourSteps: COPILOT_TOUR_STEPS,

  activeThreadId: INITIAL_THREAD.id,
  threads: [INITIAL_THREAD],
  activeThinkingStage: null,
  isStreaming: false,
  abortController: null,

  contextScope: DEFAULT_CONTEXT_SCOPE,
  toasts: [],
  bookmarks: [],

  setOpen: (open) => {
    set({ isOpen: open });
    if (open) {
      set({ unreadCount: 0 });
    }
  },

  toggleOpen: () => {
    const next = !get().isOpen;
    set({ isOpen: next });
    if (next) {
      set({ unreadCount: 0 });
    }
  },

  toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
  toggleVoiceMode: (open) => set((s) => ({ isVoiceMode: open !== undefined ? open : !s.isVoiceMode })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setBookmarksOpen: (open) => set({ isBookmarksOpen: open }),
  toggleSoundFx: () => set((s) => ({ soundFxEnabled: !s.soundFxEnabled })),
  markAsRead: () => set({ unreadCount: 0 }),

  // --------------------------------------------------------------------------
  // Guided Tour
  // --------------------------------------------------------------------------
  startTour: (stepIndex = 0) => {
    set({
      isTourActive: true,
      tourStepIndex: stepIndex,
      isOpen: false // minimize chat window during tour spotlight
    });
  },

  nextTourStep: () => {
    const { tourStepIndex, tourSteps } = get();
    if (tourStepIndex < tourSteps.length - 1) {
      set({ tourStepIndex: tourStepIndex + 1 });
    } else {
      set({ isTourActive: false, tourStepIndex: 0 });
    }
  },

  prevTourStep: () => {
    const { tourStepIndex } = get();
    if (tourStepIndex > 0) {
      set({ tourStepIndex: tourStepIndex - 1 });
    }
  },

  endTour: () => {
    set({ isTourActive: false, tourStepIndex: 0 });
  },

  // --------------------------------------------------------------------------
  // Messaging & Token Streaming
  // --------------------------------------------------------------------------
  sendMessage: async (prompt: string) => {
    if (!prompt.trim()) return;

    const { activeThreadId, threads, contextScope } = get();
    const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];

    const userMessage: CopilotMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: prompt.trim()
    };

    const updatedThreads = threads.map((t) => {
      if (t.id === currentThread.id) {
        return {
          ...t,
          title: t.messages.length === 1 && t.title.startsWith('Hospital') ? prompt.slice(0, 32) + '...' : t.title,
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, userMessage]
        };
      }
      return t;
    });

    set({
      threads: updatedThreads,
      isStreaming: true,
      activeThinkingStage: 'TELEMETRY'
    });

    // Abort controller for cancellation
    const controller = new AbortController();
    set({ abortController: controller });

    try {
      // 1. Generate structured response from domain reasoning engine
      const result = generateCopilotAnswer(prompt, contextScope);

      // 2. Cycle thinking stages
      for (const stage of result.thinkingStages) {
        if (controller.signal.aborted) return;
        set({ activeThinkingStage: stage });
        await new Promise((r) => setTimeout(r, 260));
      }

      // 3. Prepare placeholder assistant message
      const assistantMessageId = `asst-msg-${Date.now()}`;
      const assistantMessage: CopilotMessage = {
        id: assistantMessageId,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: '',
        cards: result.cards,
        citations: result.citations,
        suggestedFollowUps: result.suggestedFollowUps,
        isStreaming: true
      };

      set((s) => ({
        activeThinkingStage: null,
        threads: s.threads.map((t) =>
          t.id === currentThread.id
            ? { ...t, messages: [...t.messages, assistantMessage] }
            : t
        )
      }));

      // 4. Stream tokens character by character / token by token
      const fullText = result.text;
      const chunkSize = 4;
      for (let i = 0; i < fullText.length; i += chunkSize) {
        if (controller.signal.aborted) break;

        const currentSlice = fullText.slice(0, i + chunkSize);
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === currentThread.id
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.id === assistantMessageId ? { ...m, text: currentSlice } : m
                  )
                }
              : t
          )
        }));

        // Dynamic natural streaming delay
        await new Promise((r) => setTimeout(r, 14));
      }

      // 5. Finalize message streaming state
      set((s) => ({
        isStreaming: false,
        abortController: null,
        activeThinkingStage: null,
        threads: s.threads.map((t) =>
          t.id === currentThread.id
            ? {
                ...t,
                messages: t.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, text: fullText, isStreaming: false }
                    : m
                )
              }
            : t
        )
      }));

      // 6. Handle action triggers if returned (e.g. launch tour or spotlight)
      if (result.actionTrigger) {
        if (result.actionTrigger.type === 'TOUR') {
          setTimeout(() => {
            get().startTour(0);
          }, 800);
        } else if (result.actionTrigger.type === 'SPOTLIGHT' && result.actionTrigger.target) {
          const el = document.getElementById(result.actionTrigger.target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    } catch (err) {
      console.error('Error in Copilot streaming:', err);
      set({ isStreaming: false, activeThinkingStage: null, abortController: null });
    }
  },

  cancelStreaming: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({ isStreaming: false, activeThinkingStage: null, abortController: null });
  },

  regenerateMessage: async (messageId?: string) => {
    const { activeThreadId, threads } = get();
    const thread = threads.find((t) => t.id === activeThreadId);
    if (!thread || thread.messages.length < 2) return;

    let targetUserPrompt = '';
    if (messageId) {
      const idx = thread.messages.findIndex((m) => m.id === messageId);
      if (idx > 0 && thread.messages[idx - 1].sender === 'user') {
        targetUserPrompt = thread.messages[idx - 1].text;
      }
    } else {
      const lastUser = [...thread.messages].reverse().find((m) => m.sender === 'user');
      if (lastUser) targetUserPrompt = lastUser.text;
    }

    if (targetUserPrompt) {
      await get().sendMessage(targetUserPrompt);
    }
  },

  toggleLikeMessage: (messageId, liked) => {
    set((s) => ({
      threads: s.threads.map((t) => ({
        ...t,
        messages: t.messages.map((m) =>
          m.id === messageId ? { ...m, liked: m.liked === liked ? null : liked } : m
        )
      }))
    }));
  },

  // --------------------------------------------------------------------------
  // Thread Management
  // --------------------------------------------------------------------------
  createNewThread: (initialPrompt) => {
    const newId = `thread-${Date.now()}`;
    const newThread: CopilotThread = {
      id: newId,
      title: initialPrompt ? initialPrompt.slice(0, 28) + '...' : 'New Operations Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [INITIAL_MESSAGE]
    };

    set((s) => ({
      threads: [newThread, ...s.threads],
      activeThreadId: newId,
      isSidebarOpen: false
    }));

    if (initialPrompt) {
      get().sendMessage(initialPrompt);
    }

    return newId;
  },

  switchThread: (id) => {
    set({ activeThreadId: id, isSidebarOpen: false });
  },

  renameThread: (id, title) => {
    set((s) => ({
      threads: s.threads.map((t) => (t.id === id ? { ...t, title } : t))
    }));
  },

  deleteThread: (id) => {
    const { threads, activeThreadId } = get();
    if (threads.length <= 1) return;

    const remaining = threads.filter((t) => t.id !== id);
    const nextActive = activeThreadId === id ? remaining[0].id : activeThreadId;

    set({ threads: remaining, activeThreadId: nextActive });
  },

  pinThread: (id) => {
    set((s) => ({
      threads: s.threads.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    }));
  },

  clearChat: () => {
    const { activeThreadId } = get();
    set((s) => ({
      threads: s.threads.map((t) =>
        t.id === activeThreadId ? { ...t, messages: [INITIAL_MESSAGE] } : t
      )
    }));
  },

  exportThread: (threadId, format = 'markdown') => {
    const { threads, activeThreadId } = get();
    const id = threadId || activeThreadId;
    const thread = threads.find((t) => t.id === id);
    if (!thread) return '';

    if (format === 'json') {
      return JSON.stringify(thread, null, 2);
    }

    // Markdown export
    let md = `# IntelliCare AI Copilot Session: ${thread.title}\n\n`;
    md += `*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;

    thread.messages.forEach((m) => {
      const sender = m.sender === 'user' ? '👤 **User**' : '🤖 **IntelliCare AI Copilot**';
      md += `### ${sender} (${m.timestamp})\n\n${m.text}\n\n`;
      if (m.citations && m.citations.length > 0) {
        md += `**Grounded Sources:**\n`;
        m.citations.forEach((c) => {
          md += `- [${c.documentCode}] ${c.documentTitle} (${c.section}) — Confidence: ${(c.confidenceScore * 100).toFixed(1)}%\n`;
        });
        md += `\n`;
      }
      md += `---\n\n`;
    });

    return md;
  },

  // --------------------------------------------------------------------------
  // Bookmarks & Notifications
  // --------------------------------------------------------------------------
  toggleBookmark: (message) => {
    const { bookmarks } = get();
    const existing = bookmarks.find((b) => b.messageId === message.id);

    if (existing) {
      set((s) => ({
        bookmarks: s.bookmarks.filter((b) => b.id !== existing.id)
      }));
    } else {
      const newBookmark: CopilotBookmark = {
        id: `bm-${Date.now()}`,
        messageId: message.id,
        title: message.text.slice(0, 48) + '...',
        text: message.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      set((s) => ({ bookmarks: [newBookmark, ...s.bookmarks] }));
    }
  },

  removeBookmark: (bookmarkId) => {
    set((s) => ({
      bookmarks: s.bookmarks.filter((b) => b.id !== bookmarkId)
    }));
  },

  addToast: (toast) => {
    const newToast: CopilotToast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((s) => ({
      toasts: [newToast, ...s.toasts],
      unreadCount: s.unreadCount + 1
    }));
  },

  dismissToast: (id) => {
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id)
    }));
  },

  // --------------------------------------------------------------------------
  // Context Scoping
  // --------------------------------------------------------------------------
  setContextScope: (scope) => {
    set((s) => ({
      contextScope: { ...s.contextScope, ...scope }
    }));
  }
}));

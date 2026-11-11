import sys
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
bg = Image.new("RGBA", im.size, "white"); bg.alpha_composite(im); im = bg.convert("RGB")
F = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 13)
FB = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14, index=1)
def c(b): return im.crop(b)
def arrow(d, x0, y, x1):
    d.line([(x0, y), (x1 - 2, y)], fill="black", width=2)
    d.polygon([(x1, y), (x1 - 9, y - 5), (x1 - 9, y + 5)], fill="black")
def hstack(parts, gap=40, title=None, arrows=()):
    h = max(p.height for p in parts); top = 30 if title else 0
    w = sum(p.width for p in parts) + gap * (len(parts) - 1) + 20
    canvas = Image.new("RGB", (w, h + top + 20), "white"); d = ImageDraw.Draw(canvas)
    if title: d.text((w // 2, 14), title, fill="black", font=FB, anchor="mm")
    x = 10; xs = []
    for p in parts:
        canvas.paste(p, (x, top + 10 + (h - p.height) // 2)); xs.append((x, x + p.width)); x += p.width + gap
    for i in arrows:
        arrow(d, xs[i][1] + 4, top + 10 + h // 2, xs[i + 1][0] - 4)
    return canvas
def vstack(parts, gap=20):
    w = max(p.width for p in parts); h = sum(p.height for p in parts) + gap * (len(parts) - 1)
    canvas = Image.new("RGB", (w, h), "white"); y = 0
    for p in parts: canvas.paste(p, ((w - p.width) // 2, y)); y += p.height + gap
    return canvas
def save(img, name, k=2):
    img = img.resize((img.width * k, img.height * k), Image.LANCZOS); img.save(f"{out}/{name}.png", dpi=(300, 300)); print(name, img.size)
save(hstack([c((950,18,1265,148)), c((1053,175,1162,293)), c((1048,325,1167,533))], arrows=(0, 1)), "fig1_access")
save(c((18,158,642,514)), "fig2_ingestion")
save(vstack([c((290,550,1522,575)).crop((0,0,1232,25)) if False else hstack([c((295,575,905,630))], title=None),
             c((905,575,1515,630))], gap=8), "fig3_backend_raw")
be = vstack([c((295,575,905,630)), c((905,575,1515,630))], gap=10)
bx = Image.new("RGB", (be.width + 20, be.height + 50), (243, 240, 255)); d = ImageDraw.Draw(bx)
d.text((bx.width // 2, 18), "BACKEND MICROSERVICES", fill="black", font=FB, anchor="mm"); bx.paste(be, (10, 38))
save(bx, "fig3_backend")
save(hstack([c((535,703,642,982)), c((660,700,870,980)), c((708,997,824,1238))], gap=50, title="AI/ML & OPTIMIZATION TIER", arrows=(1,)), "fig4_aiml")
save(c((455,1265,950,1403)), "fig5a_persistence")
save(c((522,20,938,142)), "fig5b_crosscutting")

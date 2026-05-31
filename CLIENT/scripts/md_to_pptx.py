import re
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Pt, Inches
except Exception as e:
    raise SystemExit("This script requires python-pptx. Install with: python -m pip install python-pptx")

ROOT = Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "presentation_snippets.md"
OUT_PPTX = ROOT / "presentation_snippets.pptx"

if not MD_PATH.exists():
    raise SystemExit(f"Markdown file not found: {MD_PATH}")

text = MD_PATH.read_text(encoding="utf-8")

# Find all sections that start with '## ' (section title) and capture title + body
pattern = re.compile(r"^##\s+([^\n]+)\n(.*?)(?=\n##\s+|\Z)", re.S | re.M)
matches = list(pattern.finditer(text))

prs = Presentation()
# set slide size (optional) - keep default

def add_section_slide(title, body):
    # Extract a short description (first paragraph not code)
    body_text = body.strip()
    # remove leading separators
    body_text = re.sub(r"^---+\s*", "", body_text)

    # extract code blocks
    code_blocks = re.findall(r"```(?:[a-zA-Z0-9_-]+)?\n(.*?)```", body_text, re.S)

    # extract highlights (lines starting with 'הדגשים' or paragraph after code)
    highlights = []
    m = re.search(r"הדגשים[:\s\-]*([\s\S]*?)(?:\n\n|$)", body_text)
    if m:
        highlights.append(m.group(1).strip())

    # fallback: first paragraph as notes
    if not highlights:
        para = re.split(r"\n\n+", body_text)[0]
        # remove code fences if present
        para = re.sub(r"```.*?```", "", para, flags=re.S).strip()
        if para:
            highlights.append(para)

    # create slide
    blank_slide_layout = prs.slide_layouts[6] if len(prs.slide_layouts) > 6 else prs.slide_layouts[5]
    slide = prs.slides.add_slide(blank_slide_layout)

    # Title box
    left = Inches(0.4)
    top = Inches(0.2)
    width = Inches(9)
    height = Inches(0.6)
    title_box = slide.shapes.add_textbox(left, top, width, height)
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(28)

    # Code/content box
    left = Inches(0.4)
    top = Inches(1.1)
    width = Inches(9)
    height = Inches(4.2)
    content_box = slide.shapes.add_textbox(left, top, width, height)
    ctf = content_box.text_frame
    ctf.word_wrap = True

    if code_blocks:
        for i, code in enumerate(code_blocks):
            para = ctf.add_paragraph() if i > 0 or ctf.paragraphs[0].text else ctf.paragraphs[0]
            # trim leading/trailing newlines
            code_text = code.strip("\n")
            # limit long code blocks to avoid overflow (keep first 40 lines)
            lines = code_text.splitlines()
            if len(lines) > 60:
                code_text = "\n".join(lines[:60]) + "\n... (truncated)"
            para.text = code_text
            para.font.name = 'Consolas'
            para.font.size = Pt(12)
    else:
        # if no code, place a short body
        para = ctf.paragraphs[0]
        s = re.sub(r"\n\s*", " ", body_text)
        para.text = s[:1500]
        para.font.size = Pt(14)

    # Notes
    notes = slide.notes_slide.notes_text_frame
    notes_text = "\n\n".join(h.strip() for h in highlights if h)
    if not notes_text:
        notes_text = ""
    notes.text = notes_text


for m in matches:
    title = m.group(1).strip()
    body = m.group(2).strip()
    add_section_slide(title, body)

# add a small final slide
slide = prs.slides.add_slide(prs.slide_layouts[1] if len(prs.slide_layouts) > 1 else prs.slide_layouts[5])
slide.shapes.title.text = "הערות וסיכום"
if slide.placeholders:
    try:
        slide.placeholders[1].text = "קבצי קוד מוצגים כדי להדגים עקרונות: Authentication, Service layer, UI דינמי, FormData והעלאת תמונה."
    except Exception:
        pass

prs.save(str(OUT_PPTX))
print(f"Created PPTX: {OUT_PPTX}")

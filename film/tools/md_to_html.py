"""Render a demo Markdown file into a styled Arabic RTL page for screen capture."""
import sys
from pathlib import Path

import markdown

FONTS = Path(__file__).resolve().parent.parent / "engine" / "fonts"
CSS = f"""
@font-face{{font-family:Tajawal;src:url({(FONTS/'tajawal-arabic-400-normal.woff2').as_uri()})}}
@font-face{{font-family:Tajawal;font-weight:700;src:url({(FONTS/'tajawal-arabic-700-normal.woff2').as_uri()})}}
@font-face{{font-family:JB;src:url({(FONTS/'jetbrains-mono-latin-400-normal.woff2').as_uri()})}}
@font-face{{font-family:SG;src:url({(FONTS/'space-grotesk-latin-500-normal.woff2').as_uri()})}}
body{{margin:0;background:#0b0d12;color:#e6ebf7;font:17px/1.75 Tajawal,SG,sans-serif;direction:rtl}}
.doc{{max-width:1180px;margin:0 auto;padding:34px 40px 60px}}
.bar{{display:flex;gap:10px;align-items:center;color:#8a96b3;font:14px JB,monospace;direction:ltr;
  border-bottom:1px solid #222a3a;padding:12px 40px;background:#10141d}}
.bar i{{width:11px;height:11px;border-radius:50%;background:#2a3346;display:inline-block}}
h1{{font-size:30px;line-height:1.3;margin:6px 0 14px}}h2{{font-size:21px;color:#7dd3fc;margin:26px 0 10px}}
table{{border-collapse:collapse;width:100%;font-size:15px;margin:6px 0}}
th,td{{border:1px solid #232b3c;padding:7px 10px;text-align:start;vertical-align:top}}th{{background:#141a26;color:#9fb0d3}}
code,pre{{font-family:JB,monospace;direction:ltr;unicode-bidi:embed}}pre{{background:#10141d;border:1px solid #232b3c;border-radius:10px;padding:12px 16px;text-align:left;font-size:14px}}
code{{background:#141a26;padding:1px 6px;border-radius:5px;font-size:.9em}}
blockquote{{margin:10px 0;padding:10px 16px;border-inline-start:3px solid #22d3ee;background:#0f1622;color:#c9d6f0}}
a{{color:#38bdf8}}strong{{color:#fff}}hr{{border:0;border-top:1px solid #232b3c;margin:24px 0}}
"""


def render(src: Path, out: Path, label: str):
    text = src.read_text(encoding="utf-8")
    if text.startswith("---"):  # show YAML front matter as a code block
        _, fm, body = text.split("---", 2)
        text = f"```\n---{fm}---\n```\n{body}"
    body = markdown.markdown(text, extensions=["tables", "fenced_code"])
    out.write_text(f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head>'
                   f'<body><div class="bar"><i></i><i></i><i></i><span>{label}</span></div>'
                   f'<div class="doc">{body}</div></body></html>', encoding="utf-8")


if __name__ == "__main__":
    render(Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3])

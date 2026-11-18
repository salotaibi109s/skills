"""Render the first rows of the synthetic workbook as a spreadsheet-like page for capture."""
import sys
from pathlib import Path

import pandas as pd

src, out = Path(sys.argv[1]), Path(sys.argv[2])
df = pd.read_excel(src).head(22)
fonts = (Path(__file__).resolve().parent.parent / "engine" / "fonts").as_uri()
cols = "".join(f"<th>{c}</th>" for c in df.columns)
letters = "".join(f"<th class='l'>{chr(65 + i)}</th>" for i in range(len(df.columns)))
rows = ""
for i, r in df.iterrows():
    cells = "".join(f"<td>{'' if pd.isna(v) else (str(v)[:10] if 'التاريخ' in c else v)}</td>" for c, v in r.items())
    rows += f"<tr><th class='n'>{i + 2}</th>{cells}</tr>"
out.write_text(f"""<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
@font-face{{font-family:Tajawal;src:url({fonts}/tajawal-arabic-500-normal.woff2)}}
@font-face{{font-family:SG;src:url({fonts}/space-grotesk-latin-400-normal.woff2)}}
body{{margin:0;background:#0e1118;color:#dfe6f5;font:14px Tajawal,SG,sans-serif}}
.top{{padding:12px 18px;background:#121725;border-bottom:1px solid #263047;font:13px SG,monospace;color:#8fa0c4;direction:ltr}}
table{{border-collapse:collapse;width:100%}}th,td{{border:1px solid #232c40;padding:6px 9px;white-space:nowrap}}
th{{background:#161c2b;color:#a9b8da;font-weight:500}}th.l,th.n{{color:#5f6d8e;font:12px SG}}td{{font-variant-numeric:tabular-nums}}
</style></head><body><div class="top">operations_2026_synthetic.xlsx — 5,000 rows · sheet: العمليات</div>
<table><tr><th></th>{letters}</tr><tr><th class='n'>1</th>{cols}</tr>{rows}</table></body></html>""", encoding="utf-8")

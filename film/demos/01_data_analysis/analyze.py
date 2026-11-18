"""Analyse the synthetic operations workbook and write analysis.json + report.html.

This is the actual analysis shown in Scene 02 of the film. Every number on
screen comes from this script's output; nothing is typed in by hand.
"""
import json
from pathlib import Path

import pandas as pd

HERE = Path(__file__).parent
df = pd.read_excel(HERE / "operations_2026_synthetic.xlsx")
df["التاريخ"] = pd.to_datetime(df["التاريخ"])
df["late"] = df["متأخرة"].eq("نعم")
df["month"] = df["التاريخ"].dt.month
df["overrun"] = df["المدة الفعلية (ساعة)"] - df["المدة المخططة (ساعة)"]
AR_MONTHS = {1: "يناير", 2: "فبراير", 3: "مارس", 4: "أبريل", 5: "مايو", 6: "يونيو",
             7: "يوليو", 8: "أغسطس", 9: "سبتمبر"}
AR_DAYS = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]

n = len(df)
late = df[df["late"]]
overall = df["late"].mean()

by_dept = (df.groupby("القسم").agg(ops=("late", "size"), late_rate=("late", "mean"),
                                   sat=("رضا العميل (1-5)", "mean"))
           .sort_values("late_rate"))
by_city = df.groupby("المدينة")["late"].mean().sort_values(ascending=False)
by_month = df.groupby("month")["late"].mean()

causes = late["سبب التأخير"].fillna("").replace("", pd.NA).dropna().value_counts()
top5 = causes.head(5)

# Anomaly scan: every (city, month) cell with >= 40 ops, z-score of its delay rate
cell = df.groupby(["المدينة", "month"])["late"].agg(["mean", "size"]).reset_index()
cell = cell[cell["size"] >= 40]
cell["z"] = (cell["mean"] - cell["mean"].mean()) / cell["mean"].std()
anom = cell.sort_values("z", ascending=False).head(3)
a0 = anom.iloc[0]
a0_rows = df[(df["المدينة"] == a0["المدينة"]) & (df["month"] == a0["month"]) & df["late"]]
a0_cause = a0_rows["سبب التأخير"].replace("", pd.NA).dropna().value_counts()

# Weekday scan per department
cs = df[df["القسم"] == "خدمة العملاء"]
cs_day = cs.groupby(cs["التاريخ"].dt.weekday)["late"].mean()
worst_day = int(cs_day.idxmax())

missing_sat = int(df["رضا العميل (1-5)"].isna().sum())
late_no_cause = int((late["سبب التأخير"].fillna("") == "").sum())

best = by_dept.index[0]
result = {
    "rows": n,
    "late_count": int(df["late"].sum()),
    "late_rate": round(overall * 100, 1),
    "avg_overrun_late_hours": round(late["overrun"].mean(), 1),
    "best_department": {"name": best, "late_rate": round(by_dept.loc[best, "late_rate"] * 100, 1),
                        "sat": round(by_dept.loc[best, "sat"], 2)},
    "departments": [{"name": k, "ops": int(v.ops), "late_rate": round(v.late_rate * 100, 1),
                     "sat": round(v.sat, 2)} for k, v in by_dept.iterrows()],
    "cities": [{"name": k, "late_rate": round(v * 100, 1)} for k, v in by_city.items()],
    "months": [{"name": AR_MONTHS[k], "late_rate": round(v * 100, 1)} for k, v in by_month.items()],
    "top_causes": [{"name": k, "count": int(v), "share": round(v / causes.sum() * 100, 1)}
                   for k, v in top5.items()],
    "anomalies": [{"city": r["المدينة"], "month": AR_MONTHS[int(r["month"])],
                   "late_rate": round(r["mean"] * 100, 1), "ops": int(r["size"]),
                   "z": round(r["z"], 2)} for _, r in anom.iterrows()],
    "top_anomaly_cause": {"name": a0_cause.index[0],
                          "share": round(a0_cause.iloc[0] / a0_cause.sum() * 100, 1)},
    "cs_worst_day": {"day": AR_DAYS[worst_day], "late_rate": round(cs_day.max() * 100, 1),
                     "other_days": round(cs_day.drop(worst_day).mean() * 100, 1)},
    "data_quality": {"missing_satisfaction": missing_sat, "late_without_cause": late_no_cause},
}
(HERE / "analysis.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------- report.html (Arabic, RTL, inline SVG charts) ----------
def hbars(items, key, label, unit="%", w=520, color="#38bdf8", hi=None):
    bh, gap = 30, 12
    mx = max(i[key] for i in items) or 1
    h = len(items) * (bh + gap)
    out = [f'<svg viewBox="0 0 {w} {h}" width="100%" role="img">']
    for k, it in enumerate(items):
        y = k * (bh + gap)
        bw = (w - 190) * it[key] / mx
        c = "#f59e0b" if hi and it[label] == hi else color
        out.append(f'<text x="{w-4}" y="{y+bh*0.68}" text-anchor="end" class="lbl">{it[label]}</text>')
        out.append(f'<rect x="{w-130-bw}" y="{y}" width="{bw}" height="{bh}" rx="6" fill="{c}"/>')
        out.append(f'<text x="{w-138-bw}" y="{y+bh*0.68}" text-anchor="end" class="val">{it[key]}{unit}</text>')
    out.append("</svg>")
    return "".join(out)


def line(items, key, w=560, h=220):
    mx = max(i[key] for i in items) * 1.15
    step = (w - 40) / (len(items) - 1)
    pts = [(w - 20 - k * step, h - 40 - (h - 70) * it[key] / mx) for k, it in enumerate(items)]
    path = " ".join(f"{'M' if k == 0 else 'L'}{x:.1f},{y:.1f}" for k, (x, y) in enumerate(pts))
    out = [f'<svg viewBox="0 0 {w} {h}" width="100%" role="img">',
           f'<path d="{path}" fill="none" stroke="#22d3ee" stroke-width="3"/>']
    for (x, y), it in zip(pts, items):
        c = "#f59e0b" if it[key] == max(i[key] for i in items) else "#22d3ee"
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="{c}"/>')
        out.append(f'<text x="{x:.1f}" y="{y-12:.1f}" text-anchor="middle" class="val">{it[key]}%</text>')
        out.append(f'<text x="{x:.1f}" y="{h-12}" text-anchor="middle" class="lbl">{it["name"]}</text>')
    out.append("</svg>")
    return "".join(out)


R = result
a = R["anomalies"][0]
html = f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<title>تحليل العمليات 2026</title>
<style>
@font-face{{font-family:Tajawal;src:url(../../engine/fonts/tajawal-arabic-400-normal.woff2)}}
@font-face{{font-family:Tajawal;font-weight:700;src:url(../../engine/fonts/tajawal-arabic-700-normal.woff2)}}
@font-face{{font-family:SG;src:url(../../engine/fonts/space-grotesk-latin-500-normal.woff2)}}
:root{{--bg:#0b0d12;--card:#141824;--line:#232a3b;--ink:#e8eefc;--mut:#8a96b3;--cy:#22d3ee;--bl:#3b82f6;--or:#f59e0b;--pu:#7c3aed}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font-family:Tajawal,SG,sans-serif;padding:32px}}
h1{{font-size:30px;margin:0 0 4px}}.sub{{color:var(--mut);margin-bottom:22px}}
.kpis{{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}}
.kpi{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}}
.kpi b{{display:block;font-size:30px;font-family:SG,Tajawal;color:var(--cy)}}.kpi span{{color:var(--mut);font-size:14px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:14px}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}}
.card h2{{font-size:18px;margin:0 0 12px}}.lbl{{fill:#c7d2ec;font:14px Tajawal}}.val{{fill:#e8eefc;font:600 13px SG,Tajawal}}
ol,ul{{margin:0;padding-inline-start:20px;line-height:1.9}}.warn{{border-color:#5b4513;background:#1c1710}}
.tag{{display:inline-block;font-size:12px;padding:2px 8px;border-radius:99px;background:#1e293b;color:var(--mut);margin-inline-start:6px}}
</style></head><body>
<h1>الملخص التنفيذي — تحليل {R['rows']:,} عملية <span class="tag">بيانات تجريبية مصطنعة</span></h1>
<div class="sub">الفترة: يناير – سبتمبر 2026 · المصدر: operations_2026_synthetic.xlsx</div>
<div class="kpis">
 <div class="kpi"><b>{R['rows']:,}</b><span>عملية محللة</span></div>
 <div class="kpi"><b>{R['late_rate']}%</b><span>نسبة التأخير العامة</span></div>
 <div class="kpi"><b>+{R['avg_overrun_late_hours']} س</b><span>متوسط التجاوز في العمليات المتأخرة</span></div>
 <div class="kpi"><b>{R['best_department']['name']}</b><span>الأعلى أداءً ({R['best_department']['late_rate']}% تأخير)</span></div>
</div>
<div class="grid">
 <div class="card"><h2>أعلى خمسة أسباب للتأخير</h2>{hbars(R['top_causes'], 'share', 'name')}</div>
 <div class="card"><h2>نسبة التأخير حسب القسم</h2>{hbars(R['departments'], 'late_rate', 'name', color='#3b82f6')}</div>
 <div class="card"><h2>نسبة التأخير الشهرية</h2>{line(R['months'], 'late_rate')}</div>
 <div class="card"><h2>اتجاهات غير طبيعية</h2><ol>
  <li><b>{a['city']} — {a['month']}</b>: نسبة تأخير {a['late_rate']}% (انحراف z = {a['z']}) والسبب الغالب «{R['top_anomaly_cause']['name']}» بنسبة {R['top_anomaly_cause']['share']}%.</li>
  <li><b>خدمة العملاء يوم {R['cs_worst_day']['day']}</b>: تأخير {R['cs_worst_day']['late_rate']}% مقابل {R['cs_worst_day']['other_days']}% في بقية الأيام.</li>
 <li><b>{R['anomalies'][1]['city']} — {R['anomalies'][1]['month']}</b>: {R['anomalies'][1]['late_rate']}% لكن العينة صغيرة ({R['anomalies'][1]['ops']} عملية) — تحتاج تحققاً قبل الحكم.</li>
 </ol></div>
 <div class="card"><h2>التوصيات</h2><ol>
  <li>مخزون احتياطي وتنبيه مبكر لمستودعات {a['city']} قبل مواسم الذروة.</li>
  <li>تعزيز مناوبات خدمة العملاء يوم {R['cs_worst_day']['day']}.</li>
  <li>اتفاقيات مستوى خدمة مع الموردين تتضمن غرامات تأخير.</li>
  <li>جعل حقل «سبب التأخير» إلزامياً في النظام.</li></ol></div>
 <div class="card warn"><h2>افتراضات وبيانات ناقصة</h2><ul>
  <li>{R['data_quality']['late_without_cause']} عملية متأخرة بلا سبب مسجل — استُبعدت من ترتيب الأسباب.</li>
  <li>{R['data_quality']['missing_satisfaction']} سجلاً بلا تقييم رضا — استُبعدت من المتوسطات.</li>
  <li>اعتُبرت العملية متأخرة وفق عمود «متأخرة» كما ورد في الملف.</li>
  <li>الاتجاهات ارتباطية وليست سببية؛ راجع الحسابات قبل القرارات المهمة.</li></ul></div>
</div></body></html>"""
(HERE / "report.html").write_text(html, encoding="utf-8")
print(json.dumps(result, ensure_ascii=False, indent=1))

"""Generate a SYNTHETIC, non-confidential operations dataset (5,000 rows).

All names, numbers and events are invented for the film demo. A fixed seed makes
the file reproducible, so the analysis shown on screen can be re-run by anyone.
"""
import random
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

random.seed(2026)
HERE = Path(__file__).parent

DEPTS = {  # department: (base delay probability, mean planned hours)
    "التوصيل": (0.22, 30),
    "المستودعات": (0.18, 20),
    "خدمة العملاء": (0.12, 6),
    "المشتريات": (0.20, 48),
    "الصيانة": (0.25, 24),
}
CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "أبها"]
CITY_W = [0.32, 0.24, 0.16, 0.12, 0.09, 0.07]
CAUSES = ["نقص المخزون", "تأخر المورد", "ازدحام الطلبات", "خطأ في البيانات",
          "عطل في النظام", "نقص الموظفين", "عنوان غير دقيق"]
CAUSE_W = [0.14, 0.18, 0.20, 0.12, 0.10, 0.14, 0.12]
SERVICES = ["طلب عادي", "طلب مستعجل", "إرجاع", "تركيب", "استبدال"]

start = date(2026, 1, 1)
rows = []
for i in range(5000):
    d = start + timedelta(days=random.randint(0, 272))  # Jan-Sep 2026
    dept = random.choice(list(DEPTS))
    city = random.choices(CITIES, CITY_W)[0]
    p_delay, planned_mean = DEPTS[dept]
    planned = max(1, round(random.gauss(planned_mean, planned_mean * 0.25), 1))
    cause = None
    # Planted anomaly 1: stock shortage spike in Jeddah warehouses/delivery in July 2026
    if city == "جدة" and d.month == 7 and dept in ("المستودعات", "التوصيل"):
        p_delay = 0.62
    # Planted anomaly 2: weekend (Fri) staffing gaps in customer service
    if dept == "خدمة العملاء" and d.weekday() == 4:
        p_delay = 0.35
    delayed = random.random() < p_delay
    if delayed:
        if city == "جدة" and d.month == 7 and dept in ("المستودعات", "التوصيل"):
            cause = random.choices(["نقص المخزون", "تأخر المورد"], [0.75, 0.25])[0]
        elif dept == "خدمة العملاء" and d.weekday() == 4:
            cause = random.choices(["نقص الموظفين", "ازدحام الطلبات"], [0.7, 0.3])[0]
        else:
            cause = random.choices(CAUSES, CAUSE_W)[0]
        actual = round(planned * random.uniform(1.25, 2.6), 1)
    else:
        actual = round(planned * random.uniform(0.7, 1.05), 1)
    sat = random.choice([4, 5, 5, 4, 3]) if not delayed else random.choice([1, 2, 2, 3, 3, 4])
    rows.append({
        "رقم العملية": f"OP-{10000 + i}",
        "التاريخ": d,
        "القسم": dept,
        "المدينة": city,
        "نوع الخدمة": random.choice(SERVICES),
        "المدة المخططة (ساعة)": planned,
        "المدة الفعلية (ساعة)": actual,
        "متأخرة": "نعم" if delayed else "لا",
        "سبب التأخير": cause or "",
        "رضا العميل (1-5)": sat,
    })

df = pd.DataFrame(rows).sort_values("التاريخ").reset_index(drop=True)
# Realistic gaps: ~1.5% missing satisfaction, ~3% of delayed rows have no cause recorded
miss = df.sample(frac=0.015, random_state=7).index
df.loc[miss, "رضا العميل (1-5)"] = None
delayed_idx = df[df["متأخرة"] == "نعم"].sample(frac=0.03, random_state=9).index
df.loc[delayed_idx, "سبب التأخير"] = ""
out = HERE / "operations_2026_synthetic.xlsx"
df.to_excel(out, index=False, sheet_name="العمليات")
print(f"wrote {out} with {len(df)} rows")

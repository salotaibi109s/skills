"""HTTP server with Arabic RTL pages: login, dashboard, orders, customers.

Run:  python3 -m app.server   (http://127.0.0.1:8765, demo login admin / demo1234)
"""
import html
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from .auth import Sessions
from .store import STATUSES, OrderError, Store

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap');
:root{--bg:#0d1017;--card:#151a25;--line:#262e40;--ink:#e8edf8;--mut:#8f9bb6;--ac:#3b82f6;--cy:#22d3ee;--or:#f59e0b;--ok:#34d399;--bad:#f87171}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Tajawal,system-ui,sans-serif;direction:rtl}
nav{display:flex;gap:18px;align-items:center;padding:14px 28px;border-bottom:1px solid var(--line);background:#10141d}
nav b{font-size:20px;margin-inline-end:auto}nav a{color:var(--mut);text-decoration:none}nav a.on{color:var(--ink)}
main{padding:26px 28px;max-width:1100px;margin:auto}h1{margin:0 0 18px}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}.kpi b{font-size:30px;display:block}.kpi span{color:var(--mut)}
table{width:100%;border-collapse:collapse;background:var(--card);border-radius:14px;overflow:hidden}
th,td{padding:11px 14px;border-bottom:1px solid var(--line);text-align:start}th{color:var(--mut);font-weight:400}
.st{padding:2px 10px;border-radius:99px;font-size:13px;border:1px solid}
.s0{color:var(--cy)}.s1{color:var(--or)}.s2{color:var(--ac)}.s3{color:var(--ok)}.s4{color:var(--bad)}
form.inline{display:flex;gap:6px}select,input,button{font:inherit;background:#0f131c;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:6px 10px}
button{background:var(--ac);border:0;color:#fff;cursor:pointer}
.login{max-width:380px;margin:12vh auto;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:30px;display:grid;gap:12px}
.err{color:var(--bad)}.bar{display:flex;gap:4px;height:10px;border-radius:99px;overflow:hidden;margin:8px 0 22px}
"""


def page(title, body, user=None, active=""):
    nav = ""
    if user:
        links = [("/", "لوحة التحكم"), ("/orders", "الطلبات"), ("/customers", "العملاء")]
        nav = "<nav><b>متجر — إدارة الطلبات</b>" + "".join(
            f'<a href="{h}" class="{"on" if h == active else ""}">{t}</a>' for h, t in links
        ) + f'<a href="/logout">خروج ({html.escape(user)})</a></nav>'
    return (f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">'
            f"<title>{title}</title><style>{CSS}</style></head><body>{nav}<main>{body}</main></body></html>")


def badge(status):
    return f'<span class="st s{STATUSES.index(status)}">{status}</span>'


class App:
    def __init__(self, store: Store):
        self.store, self.sessions = store, Sessions()

    def handler(self):
        app = self

        class H(BaseHTTPRequestHandler):
            def log_message(self, *a):
                pass

            def _user(self):
                c = cookies.SimpleCookie(self.headers.get("Cookie", ""))
                return app.sessions.user(c["sid"].value if "sid" in c else None)

            def _send(self, code, body="", headers=None):
                self.send_response(code)
                for k, v in (headers or {}).items():
                    self.send_header(k, v)
                data = body.encode()
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)

            def _redirect(self, to, extra=None):
                self._send(303, "", {"Location": to, **(extra or {})})

            def _form(self):
                n = int(self.headers.get("Content-Length", 0))
                return {k: v[0] for k, v in parse_qs(self.rfile.read(n).decode()).items()}

            def do_GET(self):
                path = urlparse(self.path).path
                user = self._user()
                if path == "/login":
                    return self._send(200, app.login_page())
                if not user:
                    return self._redirect("/login")
                if path == "/logout":
                    c = cookies.SimpleCookie(self.headers.get("Cookie", ""))
                    app.sessions.destroy(c["sid"].value if "sid" in c else None)
                    return self._redirect("/login", {"Set-Cookie": "sid=; Max-Age=0; Path=/"})
                routes = {"/": app.dashboard_page, "/orders": app.orders_page,
                          "/customers": app.customers_page}
                if path in routes:
                    return self._send(200, routes[path](user))
                self._send(404, page("غير موجود", "<h1>الصفحة غير موجودة</h1>", user))

            def do_POST(self):
                path = urlparse(self.path).path
                f = self._form()
                if path == "/login":
                    if app.store.check_login(f.get("username", ""), f.get("password", "")):
                        tok = app.sessions.create(f["username"])
                        return self._redirect("/", {"Set-Cookie": f"sid={tok}; HttpOnly; SameSite=Lax; Path=/"})
                    return self._send(401, app.login_page("اسم المستخدم أو كلمة المرور غير صحيحة"))
                user = self._user()
                if not user:
                    return self._redirect("/login")
                try:
                    if path == "/orders/status":
                        app.store.set_status(int(f["id"]), f["status"])
                        return self._redirect("/orders")
                    if path == "/customers":
                        app.store.add_customer(f.get("name", ""), f.get("phone", ""), f.get("city", ""))
                        return self._redirect("/customers")
                except OrderError as e:
                    return self._send(400, page("خطأ", f'<h1>تعذر التنفيذ</h1><p class="err">{html.escape(str(e))}</p>'
                                                       '<a href="/orders">رجوع</a>', user))
                self._send(404, "")

        return H

    def login_page(self, error=""):
        err = f'<div class="err">{error}</div>' if error else ""
        return page("تسجيل الدخول", f"""<form class="login" method="post" action="/login">
          <h1>تسجيل الدخول</h1>{err}
          <input name="username" placeholder="اسم المستخدم" required>
          <input name="password" type="password" placeholder="كلمة المرور" required>
          <button>دخول</button></form>""")

    def dashboard_page(self, user):
        d = self.store.dashboard()
        colors = ["#22d3ee", "#f59e0b", "#3b82f6", "#34d399", "#f87171"]
        total = d["total_orders"] or 1
        bar = "".join(f'<i style="flex:{n / total};background:{colors[i]}" title="{s}"></i>'
                      for i, (s, n) in enumerate(d["by_status"].items()) if n)
        legend = " · ".join(f"{badge(s)} {n}" for s, n in d["by_status"].items())
        recent = "".join(f"<tr><td>#{o['id']}</td><td>{html.escape(o['customer'])}</td>"
                         f"<td>{o['total']:.2f} ر.س</td><td>{badge(o['status'])}</td></tr>"
                         for o in self.store.orders()[:5])
        return page("لوحة التحكم", f"""<h1>لوحة التحكم</h1>
          <div class="kpis"><div class="kpi"><b>{d['total_orders']}</b><span>إجمالي الطلبات</span></div>
          <div class="kpi"><b>{d['by_status']['قيد التجهيز']}</b><span>قيد التجهيز</span></div>
          <div class="kpi"><b>{d['revenue']:,.0f} ر.س</b><span>الإيراد (بدون الملغي)</span></div>
          <div class="kpi"><b>{d['customers']}</b><span>العملاء</span></div></div>
          <div>{legend}</div><div class="bar">{bar}</div>
          <h2>أحدث الطلبات</h2><table><tr><th>الطلب</th><th>العميل</th><th>القيمة</th><th>الحالة</th></tr>{recent}</table>""",
                    user, "/")

    def orders_page(self, user):
        rows = ""
        for o in self.store.orders():
            opts = "".join(f"<option {'selected' if s == o['status'] else ''}>{s}</option>" for s in STATUSES)
            rows += (f"<tr><td>#{o['id']}</td><td>{html.escape(o['customer'])}</td><td>{o['total']:.2f} ر.س</td>"
                     f"<td>{badge(o['status'])}</td><td><form class='inline' method='post' action='/orders/status'>"
                     f"<input type='hidden' name='id' value='{o['id']}'><select name='status'>{opts}</select>"
                     f"<button>تحديث</button></form></td></tr>")
        return page("الطلبات", f"<h1>تتبع الطلبات</h1><table><tr><th>الطلب</th><th>العميل</th><th>القيمة</th>"
                               f"<th>الحالة</th><th>تغيير الحالة</th></tr>{rows}</table>", user, "/orders")

    def customers_page(self, user):
        rows = "".join(f"<tr><td>{html.escape(c['name'])}</td><td>{html.escape(c['city'] or '')}</td>"
                       f"<td>{c['orders']}</td></tr>" for c in self.store.customers())
        return page("العملاء", f"""<h1>إدارة العملاء</h1>
          <form class="inline" method="post" action="/customers" style="margin-bottom:14px">
          <input name="name" placeholder="اسم العميل" required><input name="phone" placeholder="الجوال">
          <input name="city" placeholder="المدينة"><button>إضافة عميل</button></form>
          <table><tr><th>العميل</th><th>المدينة</th><th>عدد الطلبات</th></tr>{rows}</table>""", user, "/customers")


def demo_store() -> Store:
    s = Store()
    s.add_user("admin", "demo1234")
    people = [("نورة العتيبي", "الرياض"), ("فهد القحطاني", "جدة"), ("سارة الشهري", "أبها"),
              ("عبدالله الدوسري", "الدمام"), ("ريم الحربي", "المدينة المنورة")]
    ids = [s.add_customer(n, "05XXXXXXXX", c) for n, c in people]
    plan = [(0, 420, ["قيد التجهيز"]), (1, 1250, ["قيد التجهيز", "تم الشحن"]),
            (2, 89.5, []), (3, 640, ["قيد التجهيز", "تم الشحن", "تم التسليم"]),
            (4, 310, ["ملغي"]), (0, 975, ["قيد التجهيز", "تم الشحن", "تم التسليم"]),
            (1, 150, []), (3, 2200, ["قيد التجهيز"])]
    for ci, total, steps in plan:
        oid = s.create_order(ids[ci], total)
        for st in steps:
            s.set_status(oid, st)
    return s


def serve(port=8765):
    srv = ThreadingHTTPServer(("127.0.0.1", port), App(demo_store()).handler())
    print(f"http://127.0.0.1:{port}  (admin / demo1234)")
    srv.serve_forever()


if __name__ == "__main__":
    serve()

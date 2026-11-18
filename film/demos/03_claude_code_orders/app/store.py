"""Data layer and business rules for the orders system (SQLite, stdlib only)."""
import sqlite3
from datetime import datetime, timezone

from .auth import hash_password, verify_password

STATUSES = ["جديد", "قيد التجهيز", "تم الشحن", "تم التسليم", "ملغي"]

# Allowed transitions: forward one step at a time; cancel only before shipping.
TRANSITIONS = {
    "جديد": {"قيد التجهيز", "ملغي"},
    "قيد التجهيز": {"تم الشحن", "ملغي"},
    "تم الشحن": {"تم التسليم"},
    "تم التسليم": set(),
    "ملغي": set(),
}

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT, city TEXT);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id),
  total REAL NOT NULL CHECK (total >= 0), status TEXT NOT NULL DEFAULT 'جديد',
  created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS order_history (
  order_id INTEGER NOT NULL REFERENCES orders(id), status TEXT NOT NULL, at TEXT NOT NULL);
"""


class OrderError(ValueError):
    pass


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Store:
    def __init__(self, path: str = ":memory:"):
        self.db = sqlite3.connect(path, check_same_thread=False)
        self.db.row_factory = sqlite3.Row
        self.db.executescript(SCHEMA)

    # --- users ---
    def add_user(self, username: str, password: str) -> None:
        self.db.execute("INSERT INTO users VALUES (?, ?)", (username, hash_password(password)))
        self.db.commit()

    def check_login(self, username: str, password: str) -> bool:
        row = self.db.execute("SELECT password FROM users WHERE username=?", (username,)).fetchone()
        return bool(row) and verify_password(password, row["password"])

    # --- customers ---
    def add_customer(self, name: str, phone: str = "", city: str = "") -> int:
        if not name.strip():
            raise OrderError("اسم العميل مطلوب")
        cur = self.db.execute("INSERT INTO customers (name, phone, city) VALUES (?,?,?)",
                              (name.strip(), phone, city))
        self.db.commit()
        return cur.lastrowid

    def customers(self) -> list[dict]:
        rows = self.db.execute("""SELECT c.*, COUNT(o.id) AS orders FROM customers c
                                  LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id ORDER BY c.id""")
        return [dict(r) for r in rows]

    # --- orders ---
    def create_order(self, customer_id: int, total: float) -> int:
        if not self.db.execute("SELECT 1 FROM customers WHERE id=?", (customer_id,)).fetchone():
            raise OrderError("العميل غير موجود")
        if total < 0:
            raise OrderError("قيمة الطلب لا يمكن أن تكون سالبة")
        cur = self.db.execute("INSERT INTO orders (customer_id, total, created_at) VALUES (?,?,?)",
                              (customer_id, total, now()))
        self.db.execute("INSERT INTO order_history VALUES (?,?,?)", (cur.lastrowid, "جديد", now()))
        self.db.commit()
        return cur.lastrowid

    def order(self, order_id: int) -> dict:
        row = self.db.execute("""SELECT o.*, c.name AS customer FROM orders o
                                 JOIN customers c ON c.id=o.customer_id WHERE o.id=?""", (order_id,)).fetchone()
        if not row:
            raise OrderError("الطلب غير موجود")
        return dict(row)

    def orders(self) -> list[dict]:
        rows = self.db.execute("""SELECT o.*, c.name AS customer FROM orders o
                                  JOIN customers c ON c.id=o.customer_id ORDER BY o.id DESC""")
        return [dict(r) for r in rows]

    def set_status(self, order_id: int, status: str) -> None:
        if status not in STATUSES:
            raise OrderError("حالة غير معروفة")
        current = self.order(order_id)["status"]
        if status not in TRANSITIONS[current]:
            raise OrderError(f"لا يمكن نقل الطلب من «{current}» إلى «{status}»")
        self.db.execute("UPDATE orders SET status=? WHERE id=?", (status, order_id))
        self.db.execute("INSERT INTO order_history VALUES (?,?,?)", (order_id, status, now()))
        self.db.commit()

    def history(self, order_id: int) -> list[dict]:
        rows = self.db.execute("SELECT status, at FROM order_history WHERE order_id=? ORDER BY rowid",
                               (order_id,))
        return [dict(r) for r in rows]

    def dashboard(self) -> dict:
        by_status = {s: 0 for s in STATUSES}
        for r in self.db.execute("SELECT status, COUNT(*) n FROM orders GROUP BY status"):
            by_status[r["status"]] = r["n"]
        revenue = self.db.execute(
            "SELECT COALESCE(SUM(total),0) FROM orders WHERE status!='ملغي'").fetchone()[0]
        return {"total_orders": sum(by_status.values()), "by_status": by_status,
                "revenue": round(revenue, 2), "customers": len(self.customers())}

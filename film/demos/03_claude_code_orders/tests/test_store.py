import unittest

from app.store import OrderError, Store


class StoreTests(unittest.TestCase):
    def setUp(self):
        self.s = Store()
        self.c = self.s.add_customer("نورة العتيبي", "0500000001", "الرياض")

    def test_create_order_starts_new(self):
        oid = self.s.create_order(self.c, 250)
        self.assertEqual(self.s.order(oid)["status"], "جديد")

    def test_rejects_unknown_customer_and_negative_total(self):
        with self.assertRaises(OrderError):
            self.s.create_order(999, 10)
        with self.assertRaises(OrderError):
            self.s.create_order(self.c, -5)

    def test_customer_name_required(self):
        with self.assertRaises(OrderError):
            self.s.add_customer("   ")

    def test_dashboard_counts_and_revenue_excludes_cancelled(self):
        a = self.s.create_order(self.c, 100)
        self.s.create_order(self.c, 300)
        self.s.set_status(a, "ملغي")
        d = self.s.dashboard()
        self.assertEqual(d["total_orders"], 2)
        self.assertEqual(d["by_status"]["ملغي"], 1)
        self.assertEqual(d["revenue"], 300)

    def test_customers_list_counts_orders(self):
        self.s.create_order(self.c, 50)
        self.s.create_order(self.c, 70)
        self.assertEqual(self.s.customers()[0]["orders"], 2)


class AuthTests(unittest.TestCase):
    def test_login(self):
        s = Store()
        s.add_user("admin", "S3cure!pass")
        self.assertTrue(s.check_login("admin", "S3cure!pass"))
        self.assertFalse(s.check_login("admin", "wrong"))
        self.assertFalse(s.check_login("ghost", "S3cure!pass"))

    def test_password_not_stored_in_plain_text(self):
        s = Store()
        s.add_user("admin", "S3cure!pass")
        stored = s.db.execute("SELECT password FROM users").fetchone()[0]
        self.assertNotIn("S3cure!pass", stored)


if __name__ == "__main__":
    unittest.main()

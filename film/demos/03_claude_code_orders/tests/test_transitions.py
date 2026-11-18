import unittest

from app.store import OrderError, Store


class TransitionTests(unittest.TestCase):
    def setUp(self):
        self.s = Store()
        self.oid = self.s.create_order(self.s.add_customer("فهد"), 120)

    def test_cannot_skip_to_delivered(self):
        with self.assertRaises(OrderError):
            self.s.set_status(self.oid, "تم التسليم")

    def test_cannot_cancel_after_shipping(self):
        self.s.set_status(self.oid, "قيد التجهيز")
        self.s.set_status(self.oid, "تم الشحن")
        with self.assertRaises(OrderError):
            self.s.set_status(self.oid, "ملغي")

    def test_history_is_recorded(self):
        self.s.set_status(self.oid, "قيد التجهيز")
        self.s.set_status(self.oid, "تم الشحن")
        steps = [h["status"] for h in self.s.history(self.oid)]
        self.assertEqual(steps, ["جديد", "قيد التجهيز", "تم الشحن"])

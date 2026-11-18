import threading
import unittest
import urllib.error
import urllib.parse
import urllib.request
from http.cookiejar import CookieJar
from http.server import ThreadingHTTPServer

from app.server import App, demo_store


class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.srv = ThreadingHTTPServer(("127.0.0.1", 0), App(demo_store()).handler())
        cls.base = f"http://127.0.0.1:{cls.srv.server_address[1]}"
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()

    def client(self):
        return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))

    def post(self, op, path, **data):
        return op.open(self.base + path, urllib.parse.urlencode(data).encode())

    def test_dashboard_requires_login(self):
        r = self.client().open(self.base + "/")
        self.assertTrue(r.url.endswith("/login"))

    def test_wrong_password_rejected(self):
        with self.assertRaises(urllib.error.HTTPError) as e:
            self.post(self.client(), "/login", username="admin", password="nope")
        self.assertEqual(e.exception.code, 401)

    def test_login_then_dashboard(self):
        op = self.client()
        r = self.post(op, "/login", username="admin", password="demo1234")
        body = r.read().decode()
        self.assertIn("لوحة التحكم", body)
        self.assertIn("إجمالي الطلبات", body)


if __name__ == "__main__":
    unittest.main()

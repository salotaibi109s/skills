"""Password hashing (PBKDF2-SHA256) and in-memory sessions."""
import hashlib
import hmac
import secrets

ITERATIONS = 200_000


def hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, ITERATIONS)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    salt_hex, digest_hex = stored.split("$", 1)
    candidate = hash_password(password, bytes.fromhex(salt_hex)).split("$", 1)[1]
    return hmac.compare_digest(candidate, digest_hex)


class Sessions:
    def __init__(self):
        self._by_token: dict[str, str] = {}

    def create(self, username: str) -> str:
        token = secrets.token_urlsafe(24)
        self._by_token[token] = username
        return token

    def user(self, token: str | None) -> str | None:
        return self._by_token.get(token or "")

    def destroy(self, token: str | None) -> None:
        self._by_token.pop(token or "", None)

// Offline support: the app shell is cached on first visit; fonts are cached as they load.
const CACHE = "oud-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// Network first (so updates arrive), falling back to the cache when offline.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const cacheable = url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});

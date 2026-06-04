const CACHE = "poe2-liquid-v4";

const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "sprites/exalted-orb.png",
  "sprites/diluted-liquid-ire.png",
  "sprites/diluted-liquid-guilt.png",
  "sprites/diluted-liquid-greed.png",
  "sprites/liquid-paranoia.png",
  "sprites/liquid-envy.png",
  "sprites/liquid-disgust.png",
  "sprites/liquid-despair.png",
  "sprites/concentrated-liquid-fear.png",
  "sprites/concentrated-liquid-suffering.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first, falling back to network (and caching the result).
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match("index.html"));
    })
  );
});

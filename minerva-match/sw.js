const CACHE_NAME = "minerva-match-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./res/logo.png",
  "./res/nice.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        const copy = response.clone();
        if (response.ok && shouldCache(request)) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

function shouldCache(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin && /\.(?:html|png|jpg|jpeg|webp|gif|css|js)$/i.test(url.pathname);
}

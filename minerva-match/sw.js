const CACHE_NAME = "minerva-match-v5";
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

  if (isPageRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

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

function isPageRequest(request) {
  return request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
}

function shouldCache(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin && /\.(?:html|png|jpg|jpeg|webp|gif|css|js)$/i.test(url.pathname);
}

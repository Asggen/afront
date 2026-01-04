const CACHE_NAME = "offline-asggen";
const OFFLINE_URL = "/offline.html";
const OFFLINE_FAVICON = "/favicon.ico";
const OFFLINE_WOFF2 = "/fonts/sf-pro-text-bold.woff2";
const OFFLINE_WOFF = "/fonts/sf-pro-text-bold.woff";
const OFFLINE_TTF = "/fonts/sf-pro-text-bold.ttf";

// Cache assets during the install event
self.addEventListener("install", (event) => {
  console.log("Installing Service Worker");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          OFFLINE_URL,
          OFFLINE_FAVICON,
          OFFLINE_WOFF2,
          OFFLINE_WOFF,
          OFFLINE_TTF,
        ]);
      })
      .then(() => {
        console.log("Cache Added");
      })
      .catch((error) => {
        console.log("Error adding Cache", error);
      })
  );
});

self.addEventListener("fetch", (event) => {
  // Check if the request is for the favicon.ico
  if (
    event.request.url.includes("favicon.ico") ||
    event.request.url.includes("fonts")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          // Cache the newly fetched asset
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        });
      })
    );
    return;
  }

  // Handle other fetch events
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch((error) => {
        if (!navigator.onLine) {
          return caches.open(CACHE_NAME).then((cache) => {
            return cache.match(OFFLINE_URL);
          });
        } else {
          throw error;
        }
      })
    );
  }
});

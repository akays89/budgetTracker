const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "db.js",
    "index.js",
    "manifest.webmanifest",
    "service-worker.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "styles.css"
];


const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// installation event listener
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            console.log("Your files were pre-cached successfully!");
            cache
                .addAll(FILES_TO_CACHE)
                .then((result) => {
                    console.log("result of add all", result);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        })
    );
    self.skipWaiting();
});

// activation event listener
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("removing old cache data", key);
                        return caches.delete(key);
                    }
                })
        );
    })
);
    self.clients.claim();
});

// fetch event listener
self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches
            .open(DATA_CACHE_NAME)
            .then((cache) => {
                return fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch((error) => {
                    return cache.match(event.request);
                });
            })
            .catch((error) => console.log(error))
        );
        return;
    }
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
                return response || fetch(event.request);
            });
        })
    );
});
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

const CACHE_NAME = "dartforge-v2";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Installation und Dateien speichern
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_FILES);
        })
    );

    self.skipWaiting();
});

// Alte Versionen entfernen
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) =>
                        name.startsWith("dartforge-") &&
                        name !== CACHE_NAME
                    )
                    .map((name) => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});

// Dateien laden
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(event.request).then((response) => {
                if (!response || !response.ok) {
                    throw new Error("Datei konnte nicht geladen werden");
                }

                return response;
            }).catch(() => {
                if (event.request.mode === "navigate") {
                    return caches.match("./index.html");
                }

                return new Response("Offline nicht verfügbar", {
                    status: 503,
                    statusText: "Service Unavailable"
                });
            });
        })
    );
});

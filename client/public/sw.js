const CACHE_NAME = 'edusphere-v3';

self.addEventListener('install', (e) => {
    // Force the new service worker to take over immediately
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Clean up old caches (v1, v2, etc.) to ensure stale API responses (like /auth/me) are removed
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // CRITICAL: Do NOT intercept API requests. 
    // Let the browser handle them naturally to support POST, CORS, and Auth Cookies correctly.
    if (url.pathname.startsWith('/api')) {
        return;
    }

    // For other assets, pass them through but catch errors
    e.respondWith(
        fetch(e.request).catch(() => {
            return Response.error();
        })
    );
});
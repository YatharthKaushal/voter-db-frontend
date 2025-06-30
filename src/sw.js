import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkOnly, NetworkFirst, CacheFirst } from "workbox-strategies";
import { BackgroundSyncPlugin } from "workbox-background-sync";

// Inject build-time precache manifest
precacheAndRoute(self.__WB_MANIFEST);

// Background Sync Plugin
const bgSyncPlugin = new BackgroundSyncPlugin("voter-queue", {
  maxRetentionTime: 24 * 60, // Retry up to 24 hours
});

// Sync failed POSTs to /api/voters
registerRoute(
  ({ url, request }) =>
    url.href === "http://localhost:8000/api/voters" &&
    request.method === "POST",
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);

// Other routes
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({ cacheName: "pages", networkTimeoutSeconds: 5 })
);

registerRoute(
  ({ request, url }) =>
    url.origin === self.location.origin && request.destination === "image",
  new CacheFirst({ cacheName: "images" })
);

registerRoute(
  ({ url }) => url.href === "http://localhost:8000/api/voters",
  new NetworkFirst({ cacheName: "api-fetch-voters", networkTimeoutSeconds: 10 })
);

// Add offline fallback route for navigation requests
offlineFallback({
  pageFallback: "/offline.html",
});

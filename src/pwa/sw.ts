/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

declare const self: ServiceWorkerGlobalScope

type BackgroundSyncEvent = ExtendableEvent & {
  tag: string
  waitUntil: (promise: Promise<unknown>) => void
}

type NotificationClickEvent = ExtendableEvent & {
  action: string
  notification: Notification
  waitUntil: (promise: Promise<unknown>) => void
}

// Precache and route static assets
precacheAndRoute(self.__WB_MANIFEST)

// Clean up outdated caches
cleanupOutdatedCaches()

// Cache API responses with stale-while-revalidate strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  })
)

// Cache images with cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
)

// Cache fonts with cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
)

// Cache study materials with network-first strategy
registerRoute(
  ({ url }) => url.pathname.includes('/materials/'),
  new NetworkFirst({
    cacheName: 'materials-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
      }),
    ],
  })
)

// Handle offline fallback
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  })
)

// Background sync for offline actions
self.addEventListener('sync', (event: Event) => {
  const syncEvent = event as BackgroundSyncEvent
  if (syncEvent.tag === 'background-sync') {
    syncEvent.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Implement background sync logic here
  // This could include syncing user data, sending analytics, etc.
  console.log('Background sync triggered')
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/icon-192x192.png',
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.png',
        },
      ],
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks

self.addEventListener('notificationclick', (event: Event) => {
  const clickEvent = event as NotificationClickEvent
  clickEvent.notification.close()

  if (clickEvent.action === 'explore') {
    clickEvent.waitUntil(
      self.clients.openWindow('/dashboard')
    )
  } else if (clickEvent.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    clickEvent.waitUntil(
      self.clients.openWindow('/')
    )
  }
})

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

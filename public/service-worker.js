importScripts("https://progressier.app/d1YRu9dGZ3sSjIKB6Xrk/sw.js");

self.addEventListener('install', (event) => {
  console.log('Service Worker installed')
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('push', (event) => {
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon.png',
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})

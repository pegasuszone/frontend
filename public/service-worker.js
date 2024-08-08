self.addEventListener('install', (event) => {
  console.log('Service Worker installed')
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
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

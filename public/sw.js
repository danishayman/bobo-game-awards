// Service Worker for caching images and API responses
const CACHE_NAME = 'bobo-game-awards-v1'
const IMAGE_CACHE_NAME = 'bobo-images-v1'

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/login',
  '/vote',
  '/logo.webp',
  '/salute.webp'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests and external images
  if (url.origin !== self.location.origin && !url.hostname.includes('images.igdb.com')) {
    return
  }

  // Enhanced cache strategy for images (especially IGDB images)
  if (request.destination === 'image' || url.hostname.includes('images.igdb.com') || url.pathname.includes('/_next/image')) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            // Return cached image immediately
            return response
          }

          return fetch(request).then((fetchResponse) => {
            // Only cache successful responses and limit cache size
            if (fetchResponse.status === 200 && fetchResponse.headers.get('content-length') < 2000000) { // 2MB limit
              // Clone before caching
              const responseClone = fetchResponse.clone()
              
              // Cache with size management
              cache.keys().then(keys => {
                if (keys.length > 100) { // Limit to 100 images
                  cache.delete(keys[0]) // Remove oldest
                }
                cache.put(request, responseClone)
              })
            }
            return fetchResponse
          }).catch(() => {
            // Return a fallback placeholder image
            return new Response(
              `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1a1a"/>
                <text x="50%" y="50%" text-anchor="middle" fill="#666" font-size="14">Image</text>
              </svg>`,
              { 
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml' }
              }
            )
          })
        })
      })
    )
    return
  }

  // Cache strategy for API calls
  if (url.pathname.startsWith('/api/')) {
    // For voting data, use network-first with cache fallback
    if (url.pathname.includes('/voting-data')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            return caches.match(request)
          })
      )
      return
    }

    // For other API calls, use network-first
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request)
      })
    )
    return
  }

  // Default: network-first for other requests
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request)
    })
  )
})

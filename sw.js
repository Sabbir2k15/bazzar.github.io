const CACHE_NAME = 'bazare-talika-cache-v3';
const urlsToCache = [
  './',
  './index.html'
];

// সার্ভিস ওয়ার্কার ইনস্টল করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// নেটওয়ার্ক থেকে ডেটা আনার চেষ্টা করা
self.addEventListener('fetch', event => {
  event.respondWith(
    // প্রথমে নেটওয়ার্ক থেকে আনার চেষ্টা করা হবে
    fetch(event.request).catch(() => {
      // যদি নেটওয়ার্ক ফেইল করে, তাহলে ক্যাশ থেকে দেখানো হবে
      return caches.match(event.request);
    })
  );
});

// পুরনো ক্যাশ ডিলিট করা
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


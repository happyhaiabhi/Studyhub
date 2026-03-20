// StudyHub Service Worker — enables offline + PWA install
const CACHE = 'studyhub-v1';
const CORE_FILES = [
  '/Studyhub/studyhub.html',
  '/Studyhub/constitution_master.html',
  '/Studyhub/bihar_bpsc_master.html',
  '/Studyhub/GeoMasterTest_Complete.html',
  '/Studyhub/bihar-district-explorer.html',
  '/Studyhub/manifest.json',
];

// Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(CORE_FILES).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, then network
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

/* KART CRASH service worker — offline support (solo). Bump CACHE to force update. */
const CACHE = 'kartcrash-v14';
const CORE = [
  './', 'index.html', 'manifest.json',
  'icon-180.png', 'icon-192.png', 'icon-512.png',
  'rc-car.glb', 'pup-white.glb', 'pup-black.glb',
  'obs-tire.glb', 'obs-barrel.glb', 'obs-ramp.glb', 'arena-pup.glb',
  'vendor/three.module.js', 'vendor/peerjs.min.js',
  'vendor/addons/loaders/GLTFLoader.js',
  'vendor/addons/utils/BufferGeometryUtils.js',
  'vendor/addons/environments/RoomEnvironment.js',
  'fonts/russo-one-latin-400-normal.woff2',
  'fonts/rajdhani-latin-400-normal.woff2',
  'fonts/rajdhani-latin-500-normal.woff2',
  'fonts/rajdhani-latin-600-normal.woff2',
  'fonts/rajdhani-latin-700-normal.woff2',
  'fonts/space-mono-latin-400-normal.woff2',
  'fonts/space-mono-latin-700-normal.woff2'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // cross-origin (PeerJS broker, etc.) -> jaringan langsung

  // navigasi: coba jaringan, fallback ke index.html cache (biar bisa buka offline)
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }

  // aset: cache-first, lalu jaringan (dan simpan)
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
      return res;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});

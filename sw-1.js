// Service worker minimal : permet l'installation et un secours hors ligne pour les fichiers de l'application.
// Les appels à la base de données (autre domaine) ne sont jamais mis en cache.
// "no-cache" : on vérifie toujours auprès du serveur qu'une nouvelle version n'est pas disponible.
const CACHE = 'rhbox-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request))
  );
});

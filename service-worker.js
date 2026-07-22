// Service Worker - Special Dog-Special Cat
// Proporciona funcionalidad offline y mejora de rendimiento

const CACHE_NAME = 'special-dog-cat-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/utilities.css',
  '/script.js',
  '/manifest.json',
  '/config.json',
  '/favicon.ico'
];

// ==========================================
// INSTALACIÓN DEL SERVICE WORKER
// ==========================================
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Abierto el cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Error en instalación', error);
      })
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// ==========================================
// ACTIVACIÓN DEL SERVICE WORKER
// ==========================================
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Controlar clientes inmediatamente
  self.clients.claim();
});

// ==========================================
// MANEJO DE PETICIONES (FETCH)
// ==========================================

// Estrategia: Cache first, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Recursos estáticos: Cache first
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirstStrategy(request));
  }
  // Documentos HTML: Network first
  else if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request));
  }
  // API/JSON: Network first
  else if (request.url.includes('.json') || request.url.includes('api')) {
    event.respondWith(networkFirstStrategy(request));
  }
  // Otros: Stale while revalidate
  else {
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// ==========================================
// ESTRATEGIAS DE CACHE
// ==========================================

/**
 * Cache First Strategy
 * Intenta obtener del cache primero, luego de la red
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('SW: Cache hit para', request.url);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    // Guardar en cache si es éxitoso
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('SW: Error en fetch', request.url, error);
    return getCacheOrOfflinePage();
  }
}

/**
 * Network First Strategy
 * Intenta obtener de la red primero, fallback a cache
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    // Guardar en cache si es éxitoso
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('SW: Network fallback, usando cache para', request.url);
    
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    return getCacheOrOfflinePage();
  }
}

/**
 * Stale While Revalidate Strategy
 * Devuelve cache mientras actualiza en background
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.error('SW: Error en revalidación', error);
    });
  
  return cached || fetchPromise;
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Determinar si es un asset estático
 */
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot'];
  return staticExtensions.some(ext => url.endsWith(ext));
}

/**
 * Obtener página offline o fallback
 */
async function getCacheOrOfflinePage() {
  const cache = await caches.open(CACHE_NAME);
  const offlinePage = await cache.match('/index.html');
  
  if (offlinePage) {
    return offlinePage;
  }
  
  // Crear respuesta offline simple
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Sin conexión</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #F9F6F2;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          color: #2C2C2C;
        }
        .offline-container {
          text-align: center;
          padding: 2rem;
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 2rem;
          margin: 1rem 0;
        }
        p {
          font-size: 1.1rem;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1>Sin conexión</h1>
        <p>Parece que no tienes conexión a internet.</p>
        <p>Por favor, verifica tu conexión e intenta nuevamente.</p>
      </div>
    </body>
    </html>`,
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html'
      })
    }
  );
}

// ==========================================
// MANEJO DE MENSAJES
// ==========================================
self.addEventListener('message', event => {
  console.log('SW: Mensaje recibido', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('SW: Cache limpiado');
      event.ports[0].postMessage({ success: true });
    });
  }
});

// ==========================================
// NOTIFICACIONES PUSH (Opcional)
// ==========================================
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const options = {
    body: event.data.text(),
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%238B5A3C" width="192" height="192"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120" fill="white">🐕🐱</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23D97757" width="192" height="192"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120" fill="white">S</text></svg>',
    tag: 'special-dog-cat',
    requireInteraction: false
  };
  
  event.waitUntil(
    self.registration.showNotification('Special Dog-Special Cat', options)
  );
});

// ==========================================
// CLICK EN NOTIFICACIÓN
// ==========================================
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Si la app ya está abierta, traerla al frente
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Si no, abrir una nueva ventana
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// ==========================================
// SINCRONIZACIÓN EN BACKGROUND (Opcional)
// ==========================================
self.addEventListener('sync', event => {
  if (event.tag === 'sync-products') {
    event.waitUntil(syncProducts());
  }
});

async function syncProducts() {
  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put('/config.json', response);
      console.log('SW: Productos sincronizados');
    }
  } catch (error) {
    console.error('SW: Error en sincronización', error);
  }
}

// ==========================================
// LOG DE ESTADO
// ==========================================
console.log('Service Worker cargado: special-dog-cat-v1');

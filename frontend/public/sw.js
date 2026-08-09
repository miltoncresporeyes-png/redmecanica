// Service Worker Premium para RedMecánica PWA
// Optimizado para rendimiento UX/UI premium y experiencia offline fluida

const VERSION = 'v3.4';
const CACHE_NAME = `redmecanica-${VERSION}`;
const API_CACHE_NAME = `redmecanica-api-${VERSION}`;

// Precache crítico - páginas y recursos esenciales para UX premium
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/offline.html'
];

// Rutas de API para network-first con stale-while-revalidate
const API_ROUTES = [
  '/api/services',
  '/api/providers',
  '/api/categories',
  '/api/search',
  '/api/user'
];

// Expiración de cache por tipo de contenido (en ms)
const CACHE_EXPIRY = {
  STATIC: 30 * 24 * 60 * 60 * 1000, // 30 días
  DYNAMIC: 7 * 24 * 60 * 60 * 1000, // 7 días
  API: 5 * 60 * 1000, // 5 minutos
  IMAGES: 24 * 60 * 60 * 1000 // 1 día
};

// Performance tracking
const PERFORMANCE_METRICS = {
  cacheHit: 0,
  cacheMiss: 0,
  networkHit: 0,
  offlineFallback: 0
};

// Estrategia de cache premium: Stale-While-Revalidate
async function staleWhileRevalidate(request, cacheName, expiryTime, event) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Verificar si el cache está expirado
  const isExpired = cached && cached.headers.has('sw-cache-timestamp') && 
    Date.now() - parseInt(cached.headers.get('sw-cache-timestamp')) > expiryTime;
  
  // Respuesta de cache (stale) inmediata
  const staleResponse = isExpired ? null : cached;
  
  // Revalidación en background
  const revalidate = fetch(request).then(async (response) => {
    if (response.ok) {
      const clonedResponse = response.clone();
      const headers = new Headers(response.headers);
      headers.set('sw-cache-timestamp', Date.now().toString());
      
      const cachedResponse = new Response(await response.blob(), {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse);
      trackMetric('networkHit');
    }
    return response;
  }).catch(() => {});
  
  // Retornar stale mientras se revalida
  if (staleResponse) {
    event.waitUntil(revalidate);
    trackMetric('cacheHit');
    return staleResponse;
  }
  
  // Si no hay cache, esperar la revalidación
  try {
    const response = await revalidate;
    trackMetric('networkHit');
    return response || await cache.match(request) || fetch(request);
  } catch (error) {
    // Fallback para contenido estático
    trackMetric('cacheMiss');
    return cached || new Response('Offline', { status: 503 });
  }
}

// Métricas de performance
function trackMetric(type) {
  PERFORMANCE_METRICS[type]++;
  
  // Reportar métricas cada 100 interacciones
  const total = Object.values(PERFORMANCE_METRICS).reduce((a, b) => a + b, 0);
  if (total % 100 === 0) {
    console.log('[SW] Performance Metrics:', PERFORMANCE_METRICS);
  }
}

// Install event - cache static assets con logging avanzado
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  const startTime = Date.now();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Caching static assets');
      
      // Cachear en batches para mejor performance
      const batchSize = 10;
      for (let i = 0; i < STATIC_ASSETS.length; i += batchSize) {
        const batch = STATIC_ASSETS.slice(i, i + batchSize);
        try {
          await cache.addAll(batch);
          console.log(`[SW] Cached batch ${Math.floor(i/batchSize) + 1}:`, batch);
        } catch (err) {
          console.warn(`[SW] Failed to cache batch ${Math.floor(i/batchSize) + 1}:`, err);
        }
      }
      
      console.log(`[SW] Installation completed in ${Date.now() - startTime}ms`);
    })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches con manejo inteligente
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  const startTime = Date.now();
  
  event.waitUntil(
    caches.keys().then(async (cacheNames) => {
      const oldCaches = cacheNames.filter((name) => 
        name.startsWith('redmecanica-') && name !== CACHE_NAME && name !== API_CACHE_NAME
      );
      
      console.log('[SW] Found old caches:', oldCaches);
      
      // Limpiar caches antiguos
      await Promise.all(
        oldCaches.map(async (name) => {
          console.log('[SW] Deleting old cache:', name);
          await caches.delete(name);
          
          // Limpiar también entries individuales expiradas
          if (name.includes('api')) {
            const cache = await caches.open(name);
            const requests = await cache.keys();
            const now = Date.now();
            
            const expiredRequests = requests.filter(async (request) => {
              const response = await cache.match(request);
              if (response && response.headers.has('sw-cache-timestamp')) {
                const timestamp = parseInt(response.headers.get('sw-cache-timestamp'));
                return now - timestamp > CACHE_EXPIRY.API;
              }
              return false;
            });
            
            if (expiredRequests.length > 0) {
              console.log(`[SW] Found ${expiredRequests.length} expired API entries in ${name}`);
            }
          }
          
          return true;
        })
      );
      
      console.log(`[SW] Activation completed in ${Date.now() - startTime}ms`);
    })
  );
  
  // Take control of all clients
  self.clients.claim();
  
  // Inicializar background sync después de activación
  scheduleBackgroundTasks();
});

// Tareas en background con Workbox-like behavior
function scheduleBackgroundTasks() {
  console.log('[SW] Scheduling background tasks...');
  
  // Actualizar cache cada 24 horas
  const UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
  
  setInterval(() => {
    console.log('[SW] Running background cache update...');
    updateCriticalAssets();
  }, UPDATE_INTERVAL);
  
  // Precache rutas frecuentemente visitadas
  setTimeout(() => {
    precachePopularRoutes();
  }, 30 * 1000); // 30 segundos después del activation
}

// Actualizar assets críticos en background
async function updateCriticalAssets() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const criticalAssets = STATIC_ASSETS.filter(asset => 
      asset.includes('.') && !asset.includes('.html')
    );
    
    // Actualizar solo si hay cambios (HEAD request)
    for (const asset of criticalAssets) {
      try {
        const headResponse = await fetch(asset, { method: 'HEAD' });
        const cachedResponse = await cache.match(asset);
        
        if (cachedResponse && headResponse) {
          const cachedSize = cachedResponse.headers.get('content-length');
          const newSize = headResponse.headers.get('content-length');
          
          if (cachedSize !== newSize || !cachedResponse.headers.has('sw-cache-timestamp')) {
            console.log(`[SW] Updating stale asset: ${asset}`);
            const response = await fetch(asset);
            if (response.ok) {
              await cache.put(asset, response);
            }
          }
        }
      } catch (err) {
        console.warn(`[SW] Failed to update asset ${asset}:`, err);
      }
    }
  } catch (error) {
    console.error('[SW] Background update failed:', error);
  }
}

// Precache rutas populares basadas en analytics
async function precachePopularRoutes() {
  const popularRoutes = [
    '/dashboard',
    '/services',
    '/profile',
    '/settings'
  ];
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedRoutes = await Promise.all(
      popularRoutes.map(async (route) => {
        const cached = await cache.match(route);
        return cached ? null : route;
      })
    );
    
    const routesToCache = cachedRoutes.filter(Boolean);
    
    if (routesToCache.length > 0) {
      console.log('[SW] Precaching popular routes:', routesToCache);
      
      // Cachear en background sin bloquear
      routesToCache.forEach(route => {
        fetch(route).then(async (response) => {
          if (response.ok) {
            const headers = new Headers(response.headers);
            headers.set('sw-cache-timestamp', Date.now().toString());
            
            const cachedResponse = new Response(await response.blob(), {
              status: response.status,
              statusText: response.statusText,
              headers: headers
            });
            
            await cache.put(route, cachedResponse);
            console.log(`[SW] Successfully precached: ${route}`);
          }
        }).catch(() => {});
      });
    }
  } catch (error) {
    console.error('[SW] Precaching failed:', error);
  }
}

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;
  
  // Bypasear peticiones del entorno de desarrollo (Vite, HMR, código fuente)
  if (url.searchParams.has('t') || url.pathname.startsWith('/@') || url.pathname.includes('node_modules') || url.pathname.startsWith('/src/')) {
    return;
  }
  
  // Rutas API - Estrategia optimizada
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(apiStrategy(request, event));
    return;
  }
  
  // Imágenes - Estrategia optimizada
  if (request.destination === 'image' || isImage(url.pathname)) {
    event.respondWith(imageStrategy(request, event));
    return;
  }
  
  // Fuentes - Estrategia cache-first extendida
  if (request.destination === 'font' || isFont(url.pathname)) {
    event.respondWith(fontStrategy(request, event));
    return;
  }
  
  // Assets estáticos (CSS, JS, etc)
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, event));
    return;
  }
  
  // Navegaciones - Network first con revalidación
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request, event));
    return;
  }
  
  // Default: Network with cache fallback
  event.respondWith(networkWithCacheFallback(request, event));
});

// Cache First strategy con stale-while-revalidate para assets estáticos
async function cacheFirst(request, event) {
  return staleWhileRevalidate(request, CACHE_NAME, CACHE_EXPIRY.STATIC, event);
}

// Network First strategy para API y navegaciones con stale-while-revalidate
async function networkFirst(request, event) {
  const cache = await caches.open(API_CACHE_NAME);
  const cached = await cache.match(request);
  
  const revalidate = fetch(request).then(async (response) => {
    if (response.ok) {
      const clonedResponse = response.clone();
      const headers = new Headers(response.headers);
      headers.set('sw-cache-timestamp', Date.now().toString());
      
      const cachedResponse = new Response(await response.blob(), {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse);
      trackMetric('networkHit');
    }
    return response;
  }).catch((error) => {
    trackMetric('cacheMiss');
    throw error;
  });
  
  // Si hay cached, usarlo mientras se revalida
  if (cached) {
    event.waitUntil(revalidate.catch(() => {}));
    trackMetric('cacheHit');
    return cached;
  }
  
  // Si no hay cache, esperar la respuesta de red
  return revalidate;
}

// Network with cache fallback
async function networkWithCacheFallback(request, event) {
  try {
    const response = await fetch(request);
    trackMetric('networkHit');
    return response;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) {
      trackMetric('cacheHit');
      return cached;
    }
    trackMetric('cacheMiss');
    return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Utility functions para detectar tipos de recursos
function isImage(pathname) {
  return pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/i);
}

function isFont(pathname) {
  return pathname.match(/\.(woff|woff2|ttf|eot|otf)$/i);
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  const isAsset = url.pathname.match(/\.(js|css|ico)$/) ||
    request.destination === 'style' ||
    request.destination === 'script';
  return isAsset;
}

// Estrategia optimizada para imágenes
async function imageStrategy(request, event) {
  const url = new URL(request.url);
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Verificar si es una imagen grande (no icono/favicon)
  const isLargeImage = !url.pathname.includes('icon') && 
                       !url.pathname.includes('logo') &&
                       !url.pathname.includes('favicon');
  
  // Para imágenes grandes, usar cache-first con revalidación background
  if (isLargeImage && cached) {
    // Revalidar en background sin bloquear
    fetch(request).then(async (response) => {
      if (response.ok) {
        const headers = new Headers(response.headers);
        headers.set('sw-cache-timestamp', Date.now().toString());
        
        const cachedResponse = new Response(await response.blob(), {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
        
        await cache.put(request, cachedResponse);
      }
    }).catch(() => {});
    
    trackMetric('cacheHit');
    return cached;
  }
  
  // Para iconos y logos, usar stale-while-revalidate
  return staleWhileRevalidate(request, CACHE_NAME, CACHE_EXPIRY.IMAGES, event);
}

// Estrategia optimizada para fuentes
async function fontStrategy(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Las fuentes cambian muy raramente, priorizar cache máxima
  if (cached) {
    trackMetric('cacheHit');
    return cached;
  }
  
  // Si no está en cache, obtener y cachear por mucho tiempo
  try {
    const response = await fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set('sw-cache-timestamp', Date.now().toString());
      
      const cachedResponse = new Response(await response.clone().blob(), {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse);
      trackMetric('networkHit');
    }
    return response;
  } catch (error) {
    trackMetric('cacheMiss');
    throw error;
  }
}

// Estrategia optimizada para APIs
async function apiStrategy(request, event) {
  const url = new URL(request.url);
  const cache = await caches.open(API_CACHE_NAME);
  const cached = await cache.match(request);
  
  // API de búsqueda: muy corta duración (1 minuto)
  if (url.pathname.includes('/api/search')) {
    const isExpired = cached && cached.headers.has('sw-cache-timestamp') && 
      Date.now() - parseInt(cached.headers.get('sw-cache-timestamp')) > 60 * 1000;
    
    const revalidate = fetch(request).then(async (response) => {
      if (response.ok) {
        const headers = new Headers(response.headers);
        headers.set('sw-cache-timestamp', Date.now().toString());
        
        const cachedResponse = new Response(await response.blob(), {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
        
        await cache.put(request, cachedResponse);
      }
      return response;
    }).catch(() => {});
    
    if (cached && !isExpired) {
      event.waitUntil(revalidate);
      return cached;
    }
    
    return revalidate;
  }
  
  // Otras APIs: usar stale-while-revalidate con expiración de 5 minutos
  return staleWhileRevalidate(request, API_CACHE_NAME, CACHE_EXPIRY.API, event);
}

// Estrategia de navegación con offline HTML premium
async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    // A valid HTTP response (including a 4xx/5xx page) must be returned to
    // the browser instead of being treated as an unavailable network.
    return networkResponse;
  } catch (error) {
    // Intentar devolver página del cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay cache, devolver offline page premium
    try {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    } catch (e) {}
    
    // Último fallback: página offline inline
    return new Response(generateOfflinePage(), {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Generar página offline premium inline
function generateOfflinePage() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sin conexión - RedMecánica</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    
    .offline-container {
      max-width: 500px;
      padding: 2rem;
    }
    
    .offline-icon {
      width: 96px;
      height: 96px;
      margin: 0 auto 2rem;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    }
    
    .offline-icon svg {
      width: 48px;
      height: 48px;
      color: #6366f1;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.05); opacity: 1; }
    }
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      color: #94a3b8;
    }
    
    .retry-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .retry-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
    }
    
    .retry-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .status {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(30, 41, 59, 0.5);
      border-radius: 0.75rem;
      font-size: 0.875rem;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="offline-container">
    <div class="offline-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M3 3l18 18M8.5 8.5c-.83.83-1.5 2.1-1.5 3.5 0 2.76 2.24 5 5 5 1.4 0 2.67-.67 3.5-1.5M18 18a9 9 0 01-12-12 9 9 0 0112 12z"/>
      </svg>
    </div>
    
    <h1>Sin conexión</h1>
    <p>Parece que no tienes conexión a internet.
       Revisa tu red o intenta nuevamente.</p>
    
    <button class="retry-button" onclick="checkConnection()">
      <span id="button-text">Reintentar</span>
      <div class="spinner" id="spinner" style="display: none;"></div>
    </button>
    
    <div class="status" id="status">
      Última verificación: <span id="timestamp">Ahora</span>
    </div>
  </div>
  
  <script>
    function checkConnection() {
      const button = document.querySelector('.retry-button');
      const buttonText = document.getElementById('button-text');
      const spinner = document.getElementById('spinner');
      const status = document.getElementById('status');
      
      button.disabled = true;
      buttonText.textContent = 'Verificando...';
      spinner.style.display = 'block';
      
      // Intentar recargar la página
      setTimeout(() => {
        if (navigator.onLine) {
          window.location.reload();
        } else {
          button.disabled = false;
          buttonText.innerHTML = 'Reintentar';
          spinner.style.display = 'none';
          document.getElementById('timestamp').textContent = new Date().toLocaleTimeString('es-CL');
          
          status.innerHTML = 
            '✕ Sin conexión | Última verificación: <span id="timestamp">' + 
            new Date().toLocaleTimeString('es-CL') + '</span>';
        }
      }, 2000);
    }
    
    // Actualizar estado cada 30 segundos
    setInterval(() => {
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 30000);
    
    // Mostrar hora actual
    document.getElementById('timestamp').textContent = new Date().toLocaleTimeString('es-CL');
  </script>
</body>
</html>
`.trim();
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncFormSubmissions());
  }
});

async function syncFormSubmissions() {
  // Implementation for syncing offline form data
  console.log('[SW] Syncing offline form submissions...');
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action buttons
    console.log('[SW] Notification action:', event.action);
  }
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

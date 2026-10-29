/* Apprentice Cafe fresh-baking alerts — service worker */
const API = "https://uzfaottkxdunmmimajey.supabase.co/functions/v1/fresh/";
const DEFAULT_URL = "https://apprentice-cafe.square.site/s/order";

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = { title: 'Apprentice Cafe', body: event.data ? event.data.text() : '' }; }
  const scope = self.registration.scope;
  const title = data.title || 'Fresh out of the oven';
  const options = {
    body: data.body || '',
    icon: scope + 'icon-192.png',
    badge: scope + 'badge-96.png',
    tag: data.tag || 'fresh',
    renotify: true,
    requireInteraction: false,
    vibrate: [120, 60, 120],
    timestamp: Date.now(),
    data: { url: data.url || DEFAULT_URL },
    actions: [{ action: 'order', title: 'Order now' }]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || DEFAULT_URL;
  event.waitUntil(self.clients.openWindow(url));
});

// If the push service rotates the subscription, re-subscribe and tell the server.
self.addEventListener('pushsubscriptionchange', (event) => {
  const oldSub = event.oldSubscription;
  event.waitUntil((async () => {
    try {
      const res = await fetch(API + 'api/vapid'); const { key } = await res.json();
      const pad = '='.repeat((4 - key.length % 4) % 4); const raw = atob((key + pad).replace(/-/g, '+').replace(/_/g, '/'));
      const appKey = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i++) appKey[i] = raw.charCodeAt(i);
      const sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appKey });
      await fetch(API + 'api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ subscription: sub.toJSON(), replaces: oldSub ? oldSub.endpoint : null }) });
    } catch (_) { /* best effort */ }
  })());
});

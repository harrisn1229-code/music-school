/* Music School service worker — keeps the whole app on the device so it opens with no connection.

   FILES is written by build.py: every file of the app and a short hash of its contents. Each
   file is cached under "<path>?v=<hash>", so:
     * an update downloads only the files whose contents changed (the 114 book pages, the fonts
       and the PDF reader are fetched once, ever);
     * a new version is only switched to once ALL of its files are saved — a half-downloaded
       update can never be served.
   The app opens from this cache every time. A new build is picked up in the background and is
   what opens the NEXT time. Only the cache named below is ever touched, so other apps on the
   same site (Music, Barline) keep theirs.

   The reader's own added files (books, charts, sleeves) are NOT here — they live in IndexedDB,
   which this worker never reads or clears. */
const FILES = /*{{FILES}}*/{};
const BUILD = "{{STAMP}}";
const CACHE = "music-school-app";
const ROOT = new URL("./", self.location.href);

const hrefFor = (path) => new URL(path.split("/").map(encodeURIComponent).join("/"), ROOT).href;
const keyFor = (path) => hrefFor(path) + "?v=" + FILES[path];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const have = new Set((await cache.keys()).map((r) => r.url));
    const todo = Object.keys(FILES).filter((p) => !have.has(keyFor(p)));
    for (let i = 0; i < todo.length; i += 8) {
      await Promise.all(todo.slice(i, i + 8).map(async (p) => {
        // "reload": GitHub Pages lets the browser keep a file for 10 minutes; an update must not
        // be built out of stale copies.
        const res = await fetch(new Request(hrefFor(p), { cache: "reload" }));
        if (!res.ok) throw new Error(p + " — " + res.status);
        await cache.put(keyFor(p), res);
      }));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const keep = new Set(Object.keys(FILES).map(keyFor));
    for (const r of await cache.keys()) if (!keep.has(r.url)) await cache.delete(r);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  let path;
  try { path = decodeURIComponent(url.pathname.slice(ROOT.pathname.length)); } catch (e) { return; }
  if (path === "" || (request.mode === "navigate" && !FILES[path])) path = "index.html";
  if (!FILES[path]) return;                 // not part of the app: leave it to the network
  event.respondWith(
    caches.open(CACHE)
      .then((cache) => cache.match(keyFor(path)))
      .then((hit) => hit || fetch(request))
  );
});

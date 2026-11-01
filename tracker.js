/*!
 * Лёгкий счётчик просмотров (≈1 КБ). Без cookie, без сторонних сервисов.
 * Подключение:
 *   <script defer src="/tracker.js"
 *           data-endpoint="https://target1000.pythonanywhere.com/stats/collect"></script>
 * Необязательные атрибуты: data-respect-dnt="true" — не считать при включённом Do Not Track.
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var endpoint = script && script.getAttribute("data-endpoint");
  if (!endpoint) return;

  // Не считать локальную разработку, file:// и предзагрузку страницы браузером.
  var host = location.hostname;
  if (location.protocol === "file:" || host === "localhost" || host === "127.0.0.1") return;
  if (document.visibilityState === "prerender") return;
  if (script.getAttribute("data-respect-dnt") === "true" &&
      (navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true)) return;

  // Анонимный случайный ID браузера (в localStorage) — отличает посетителей за одним IP.
  function visitorId() {
    try {
      var key = "_vid", id = localStorage.getItem(key);
      if (!id) {
        id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
           : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
               var r = Math.random() * 16 | 0;
               return (c === "x" ? r : (r & 3 | 8)).toString(16);
             });
        localStorage.setItem(key, id);
      }
      return id;
    } catch (e) { return ""; }
  }

  var payload = JSON.stringify({
    p: location.href.split("#")[0],
    r: document.referrer || "",
    t: (document.title || "").slice(0, 200),
    v: visitorId(),
    sw: screen.width,
    sh: screen.height,
    l: navigator.language || ""
  });

  // text/plain — «простой» CORS-запрос: без preflight, быстрее и надёжнее.
  try {
    if (navigator.sendBeacon &&
        navigator.sendBeacon(endpoint, new Blob([payload], { type: "text/plain;charset=UTF-8" }))) return;
  } catch (e) { /* падаем в fetch */ }

  if (window.fetch) {
    fetch(endpoint, {
      method: "POST", body: payload, keepalive: true, mode: "cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" }
    }).catch(function () {});
  }
})();

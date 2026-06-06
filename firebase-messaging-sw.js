/* Kept only for backward compatibility: older installs may still have this
   file registered as their service worker. It now simply loads the unified
   sw.js so there is a single source of truth (caching + FCM) and no two
   service workers fighting over the same scope. */
importScripts('./sw.js');

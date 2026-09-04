// Node 18 (used by the AL2023 build image) has no global `crypto`; some deps (e.g. serialize-javascript@7)
// call crypto.getRandomValues() directly. Polyfill it from node:crypto's webcrypto before they load.
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto;
}

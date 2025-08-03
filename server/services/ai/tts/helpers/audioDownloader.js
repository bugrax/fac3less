'use strict';
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (t, e, r, o) {
        void 0 === o && (o = r);
        let n = Object.getOwnPropertyDescriptor(e, r);
        ((n &&
            !('get' in n ? !e.__esModule : n.writable || n.configurable)) ||
            (n = {
              enumerable: !0,
              get() {
                return e[r];
              }
            }),
        Object.defineProperty(t, o, n));
      }
      : function (t, e, r, o) {
        (void 0 === o && (o = r), (t[o] = e[r]));
      }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (t, e) {
        Object.defineProperty(t, 'default', { enumerable: !0, value: e });
      }
      : function (t, e) {
        t.default = e;
      }),
  __importStar =
    (this && this.__importStar) ||
    (function () {
      let ownKeys = function (t) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (t) {
              const e = [];
              for (const r in t) {
                Object.prototype.hasOwnProperty.call(t, r) && (e[e.length] = r);
              }
              return e;
            }),
          ownKeys(t)
        );
      };
      return function (t) {
        if (t && t.__esModule) {
          return t;
        }
        const e = {};
        if (null != t) {
          for (let r = ownKeys(t), o = 0; o < r.length; o++) {
            'default' !== r[o] && __createBinding(e, t, r[o]);
          }
        }
        return (__setModuleDefault(e, t), e);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.downloadAudio = downloadAudio));
const https = __importStar(require('https')),
  http = __importStar(require('http')),
  logger_1 = require('../../../../utils/logger');
async function downloadAudio(t) {
  return new Promise((e, r) => {
    const o = [];
    ('https:' === new URL(t).protocol ? https : http)
      .get(t, t => {
        if (301 === t.statusCode || 302 === t.statusCode) {
          const o = t.headers.location;
          if (o) {
            return void downloadAudio(o).then(e).catch(r);
          }
        }
        200 === t.statusCode
          ? (t.on('data', t => {
            o.push(t);
          }),
          t.on('end', () => {
            e(Buffer.concat(o));
          }),
          t.on('error', r))
          : r(new Error(`Failed to download audio: ${t.statusCode}`));
      })
      .on('error', t => {
        (logger_1.logger.error('[MinimaxTTS] Download error:', t), r(t));
      });
  });
}

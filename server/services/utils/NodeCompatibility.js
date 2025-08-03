'use strict';
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (t, e, r, i) {
        void 0 === i && (i = r);
        let s = Object.getOwnPropertyDescriptor(e, r);
        ((s &&
            !('get' in s ? !e.__esModule : s.writable || s.configurable)) ||
            (s = {
              enumerable: !0,
              get() {
                return e[r];
              }
            }),
        Object.defineProperty(t, i, s));
      }
      : function (t, e, r, i) {
        (void 0 === i && (i = r), (t[i] = e[r]));
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
          for (let r = ownKeys(t), i = 0; i < r.length; i++) {
            'default' !== r[i] && __createBinding(e, t, r[i]);
          }
        }
        return (__setModuleDefault(e, t), e);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.NodeCompatibility = void 0));
const fs_1 = require('fs'),
  path = __importStar(require('path'));
class NodeCompatibility {
  static async rm(t, e = {}) {
    try {
      if (fs_1.promises.rm) {
        return void (await fs_1.promises.rm(t, e));
      }
      if (e.recursive) {
        await this.rmRecursive(t, e.force || !1);
      } else {
        try {
          (await fs_1.promises.stat(t)).isDirectory()
            ? await fs_1.promises.rmdir(t)
            : await fs_1.promises.unlink(t);
        } catch (t) {
          if (!e.force) {
            throw t;
          }
        }
      }
    } catch (t) {
      if (!e.force) {
        throw t;
      }
    }
  }
  static async rmRecursive(t, e) {
    try {
      if ((await fs_1.promises.stat(t)).isDirectory()) {
        const r = await fs_1.promises.readdir(t);
        for (const i of r) {
          const r = path.join(t, i);
          await this.rmRecursive(r, e);
        }
        await fs_1.promises.rmdir(t);
      } else {
        await fs_1.promises.unlink(t);
      }
    } catch (t) {
      if (!e) {
        throw t;
      }
    }
  }
  static get hasNativeRm() {
    return 'function' === typeof fs_1.promises.rm;
  }
  static get nodeVersion() {
    return process.version;
  }
  static get supportsNativeRm() {
    const t = process.version.match(/^v(\d+)\.(\d+)\.(\d+)/);
    if (!t) {
      return !1;
    }
    const [, e, r, i] = t.map(Number);
    return e > 14 || (14 === e && r > 14) || (14 === e && 14 === r && i >= 0);
  }
}
exports.NodeCompatibility = NodeCompatibility;

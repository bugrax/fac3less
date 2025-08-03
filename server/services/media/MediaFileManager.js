'use strict';
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, r, t, i) {
        void 0 === i && (i = t);
        let a = Object.getOwnPropertyDescriptor(r, t);
        ((a &&
            !('get' in a ? !r.__esModule : a.writable || a.configurable)) ||
            (a = {
              enumerable: !0,
              get() {
                return r[t];
              }
            }),
        Object.defineProperty(e, i, a));
      }
      : function (e, r, t, i) {
        (void 0 === i && (i = t), (e[i] = r[t]));
      }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (e, r) {
        Object.defineProperty(e, 'default', { enumerable: !0, value: r });
      }
      : function (e, r) {
        e.default = r;
      }),
  __importStar =
    (this && this.__importStar) ||
    (function () {
      let ownKeys = function (e) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (e) {
              const r = [];
              for (const t in e) {
                Object.prototype.hasOwnProperty.call(e, t) && (r[r.length] = t);
              }
              return r;
            }),
          ownKeys(e)
        );
      };
      return function (e) {
        if (e && e.__esModule) {
          return e;
        }
        const r = {};
        if (null != e) {
          for (let t = ownKeys(e), i = 0; i < t.length; i++) {
            'default' !== t[i] && __createBinding(r, e, t[i]);
          }
        }
        return (__setModuleDefault(r, e), r);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.MediaFileManager = void 0));
const fs_1 = require('fs'),
  path = __importStar(require('path')),
  fs_2 = require('fs'),
  promises_1 = require('stream/promises'),
  logger_1 = require('../../utils/logger'),
  NodeCompatibility_1 = require('../utils/NodeCompatibility');
class MediaFileManager {
  async downloadFile(e, r, t) {
    if (!e.startsWith('http://') && !e.startsWith('https://')) {
      return e;
    }
    const i = path.join(r, t);
    try {
      const r = await fetch(e);
      if (!r.ok) {
        throw new Error(`Failed to download file: ${r.statusText}`);
      }
      if (!r.body) {
        throw new Error('Response body is null');
      }
      const t = (0, fs_2.createWriteStream)(i),
        a = r.body.getReader(),
        o = new (
          await Promise.resolve().then(() => __importStar(require('stream')))
        ).Readable({
          async read() {
            const { done: e, value: r } = await a.read();
            e ? this.push(null) : this.push(Buffer.from(r));
          }
        });
      return (
        await (0, promises_1.pipeline)(o, t),
        logger_1.logger.debug(
          `[MediaFileManager] Streamed download complete: ${i}`
        ),
        i
      );
    } catch (r) {
      throw (
        logger_1.logger.error(`[MediaFileManager] Failed to download ${e}:`, r),
        r
      );
    }
  }
  async downloadFiles(e, r, t) {
    const i = e.map((e, i) => {
      const a = e.endsWith('.mp3') ? 'mp3' : 'mp4',
        o = `${t}_${i + 1}.${a}`;
      return this.downloadFile(e, r, o);
    });
    try {
      return await Promise.all(i);
    } catch (e) {
      throw (
        logger_1.logger.error(
          '[MediaFileManager] Failed to download files:',
          e
        ),
        e
      );
    }
  }
  async createTempDirectory(e, r) {
    const t = `${r}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      i = path.join(e, t);
    return (await fs_1.promises.mkdir(i, { recursive: !0 }), i);
  }
  async cleanupDirectory(e) {
    try {
      (await NodeCompatibility_1.NodeCompatibility.rm(e, {
        recursive: !0,
        force: !0
      }),
      logger_1.logger.debug(`[MediaFileManager] Cleaned up directory: ${e}`));
    } catch (r) {
      logger_1.logger.warn(
        `[MediaFileManager] Failed to cleanup directory ${e}:`,
        r
      );
    }
  }
  async ensureDirectory(e) {
    await fs_1.promises.mkdir(e, { recursive: !0 });
  }
  async writeFile(e, r) {
    await fs_1.promises.writeFile(e, r);
  }
  async readFile(e) {
    return await fs_1.promises.readFile(e);
  }
  async fileExists(e) {
    try {
      return (await fs_1.promises.access(e), !0);
    } catch {
      return !1;
    }
  }
  async getFileStats(e) {
    return await fs_1.promises.stat(e);
  }
  async moveFile(e, r) {
    await fs_1.promises.rename(e, r);
  }
  async deleteFile(e) {
    await fs_1.promises.unlink(e);
  }
  async createConcatListFile(e, r) {
    const t = e.map(e => `file '${path.resolve(e)}'`).join('\n');
    await this.writeFile(r, t);
  }
  resolvePath(e, r) {
    return path.isAbsolute(e) ? e : path.join(r || process.cwd(), e);
  }
}
exports.MediaFileManager = MediaFileManager;

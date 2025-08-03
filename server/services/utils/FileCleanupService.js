'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, r, i) {
          void 0 === i && (i = r);
          var a = Object.getOwnPropertyDescriptor(t, r);
          ((a &&
            !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
            (a = {
              enumerable: !0,
              get: function () {
                return t[r];
              },
            }),
            Object.defineProperty(e, i, a));
        }
      : function (e, t, r, i) {
          (void 0 === i && (i = r), (e[i] = t[r]));
        }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (e, t) {
          Object.defineProperty(e, 'default', { enumerable: !0, value: t });
        }
      : function (e, t) {
          e.default = t;
        }),
  __importStar =
    (this && this.__importStar) ||
    (function () {
      var ownKeys = function (e) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (e) {
              var t = [];
              for (var r in e)
                Object.prototype.hasOwnProperty.call(e, r) && (t[t.length] = r);
              return t;
            }),
          ownKeys(e)
        );
      };
      return function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var r = ownKeys(e), i = 0; i < r.length; i++)
            'default' !== r[i] && __createBinding(t, e, r[i]);
        return (__setModuleDefault(t, e), t);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.FileCleanupService = void 0));
const fs_1 = require('fs'),
  path = __importStar(require('path')),
  logger_1 = require('../../utils/logger');
class FileCleanupService {
  static instance;
  cleanupIntervals = new Map();
  defaultConfig = { maxFiles: 30, checkInterval: 6e4 };
  directoryConfigs = { './output/audio': { maxFiles: 35, checkInterval: 6e4 } };
  constructor() {}
  static getInstance() {
    return (
      FileCleanupService.instance ||
        (FileCleanupService.instance = new FileCleanupService()),
      FileCleanupService.instance
    );
  }
  async initialize() {
    for (const [e, config] of Object.entries(this.directoryConfigs))
      (await this.ensureDirectoryExists(e), this.startCleanupTimer(e, config));
  }
  async ensureDirectoryExists(e) {
    try {
      await fs_1.promises.access(e);
    } catch {
      await fs_1.promises.mkdir(e, { recursive: !0 });
    }
  }
  startCleanupTimer(e, config) {
    const t = setInterval(async () => {
      await this.cleanupDirectory(e, config.maxFiles);
    }, config.checkInterval);
    (this.cleanupIntervals.set(e, t),
      this.cleanupDirectory(e, config.maxFiles).catch(t =>
        logger_1.logger.error(
          `[FileCleanupService] Initial cleanup failed for ${e}:`,
          t
        )
      ));
  }
  async cleanupDirectory(e, t) {
    try {
      const r = await this.getFilesWithStats(e);
      if (r.length <= t) return;
      r.sort((e, t) => e.stats.mtimeMs - t.stats.mtimeMs);
      const i = r.slice(0, r.length - t);
      for (const e of i)
        try {
          await fs_1.promises.unlink(e.path);
        } catch (t) {
          logger_1.logger.error(
            `[FileCleanupService] Failed to delete file ${e.path}:`,
            t
          );
        }
    } catch (t) {
      logger_1.logger.error(
        `[FileCleanupService] Cleanup failed for directory ${e}:`,
        t
      );
    }
  }
  async getFilesWithStats(e) {
    const t = await fs_1.promises.readdir(e),
      r = [];
    for (const i of t) {
      const t = path.join(e, i);
      try {
        const e = await fs_1.promises.stat(t);
        e.isFile() && r.push({ path: t, stats: e });
      } catch (e) {
        logger_1.logger.warn(
          `[FileCleanupService] Failed to stat file ${t}:`,
          e
        );
      }
    }
    return r;
  }
  async triggerCleanup(e) {
    const config = this.directoryConfigs[e] || this.defaultConfig;
    await this.cleanupDirectory(e, config.maxFiles);
  }
  updateConfig(e, config) {
    const t = this.directoryConfigs[e] || this.defaultConfig;
    this.directoryConfigs[e] = { ...t, ...config };
    const r = this.cleanupIntervals.get(e);
    (r && clearInterval(r),
      this.startCleanupTimer(e, this.directoryConfigs[e]));
  }
  stop() {
    for (const [, e] of this.cleanupIntervals.entries()) clearInterval(e);
    this.cleanupIntervals.clear();
  }
}
exports.FileCleanupService = FileCleanupService;

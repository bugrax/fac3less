'use strict';
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, r, t, s) {
        void 0 === s && (s = t);
        let i = Object.getOwnPropertyDescriptor(r, t);
        ((i &&
            !('get' in i ? !r.__esModule : i.writable || i.configurable)) ||
            (i = {
              enumerable: !0,
              get() {
                return r[t];
              }
            }),
        Object.defineProperty(e, s, i));
      }
      : function (e, r, t, s) {
        (void 0 === s && (s = t), (e[s] = r[t]));
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
          for (let t = ownKeys(e), s = 0; s < t.length; s++) {
            'default' !== t[s] && __createBinding(r, e, t[s]);
          }
        }
        return (__setModuleDefault(r, e), r);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.WhisperSTTService = void 0));
const child_process_1 = require('child_process'),
  fs_1 = require('fs'),
  path = __importStar(require('path'));
class WhisperSTTService {
  constructor() {}
  async checkWhisperInstallation() {
    if (!(await this.isWhisperInstalled())) {
      throw new Error(
        'Whisper STT service requires openai-whisper to be installed'
      );
    }
  }
  async extractWordLevelTimestamps(e) {
    if ((await this.checkWhisperInstallation(), !(await this.fileExists(e)))) {
      throw new Error(`Audio file not found: ${e}`);
    }
    const r = path.dirname(e),
      t = path.basename(e, path.extname(e)),
      s = path.join(r, `${t}_whisper.json`);
    try {
      await this.runWhisperCommand(e, r);
      const t = await this.parseWhisperOutput(s);
      return (await fs_1.promises.unlink(s).catch(() => {}), t);
    } catch (e) {
      const r = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to extract timestamps: ${r}`);
    }
  }
  async runWhisperCommand(e, r) {
    return new Promise((t, s) => {
      const i = [
          e,
          '--model',
          'base',
          '--output_format',
          'json',
          '--word_timestamps',
          'True',
          '--output_dir',
          r,
          '--language',
          'en',
          '--verbose',
          'False'
        ],
        process = (0, child_process_1.spawn)('whisper', i, {
          stdio: ['ignore', 'pipe', 'pipe']
        });
      let n = '';
      (process.stderr?.on('data', e => {
        n += e.toString();
      }),
      process.on('close', e => {
        0 === e ? t() : s(new Error(`Whisper failed with code ${e}: ${n}`));
      }),
      process.on('error', e => {
        s(new Error(`Failed to start Whisper: ${e.message}`));
      }),
      setTimeout(() => {
        (process.kill(),
        s(new Error('Whisper STT timeout after 60 seconds')));
      }, 6e4));
    });
  }
  async parseWhisperOutput(e) {
    try {
      const r = await fs_1.promises.readFile(e, 'utf-8'),
        t = JSON.parse(r),
        s = [];
      if (t.segments) {
        for (const e of t.segments) {
          if (e.words && Array.isArray(e.words)) {
            for (const r of e.words) {
              s.push({
                word: r.word?.trim() || '',
                start: r.start || 0,
                end: r.end || 0,
                confidence: r.confidence || void 0
              });
            }
          }
        }
      }
      return {
        text: t.text || '',
        language: t.language || 'en',
        duration: t.duration || 0,
        words: s,
        segments: t.segments || []
      };
    } catch (e) {
      const r = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to parse Whisper output: ${r}`);
    }
  }
  async fileExists(e) {
    try {
      return (await fs_1.promises.access(e), !0);
    } catch {
      return !1;
    }
  }
  async testWhisperInstallation() {
    return await this.isWhisperInstalled();
  }
  async isWhisperInstalled() {
    return new Promise(e => {
      const process = (0, child_process_1.spawn)('whisper', ['--help'], {
        stdio: ['ignore', 'ignore', 'ignore']
      });
      (process.on('close', r => {
        e(0 === r);
      }),
      process.on('error', () => {
        e(!1);
      }),
      setTimeout(() => {
        (process.kill(), e(!1));
      }, 5e3));
    });
  }
}
exports.WhisperSTTService = WhisperSTTService;

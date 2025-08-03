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
    })(),
  __importDefault =
    (this && this.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ReplicateWhisperService = void 0));
const replicate_1 = __importDefault(require('replicate')),
  fs_1 = require('fs'),
  path = __importStar(require('path'));
class ReplicateWhisperService {
  replicate;
  constructor() {
    if (!process.env.REPLICATE_API_TOKEN)
      throw new Error(
        'REPLICATE_API_TOKEN is required for Replicate Whisper service'
      );
    this.replicate = new replicate_1.default({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  async extractWordLevelTimestamps(e) {
    try {
      const t = await this.prepareAudioForReplicate(e),
        r = await this.replicate.run(
          'vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c',
          {
            input: {
              task: 'transcribe',
              audio: t,
              language: 'None',
              timestamp: 'chunk',
              batch_size: 64,
              diarise_audio: !1,
            },
          }
        );
      return (
        console.error(
          '🎤 [WHISPER_DEBUG] Raw incredibly-fast-whisper output:',
          JSON.stringify(r, null, 2)
        ),
        this.parseReplicateOutput(r)
      );
    } catch (e) {
      const t = e instanceof Error ? e.message : String(e);
      throw new Error(`Replicate Whisper STT failed: ${t}`);
    }
  }
  async prepareAudioForReplicate(e) {
    try {
      const t = await fs_1.promises.readFile(e),
        r = path.extname(e).toLowerCase(),
        i =
          '.wav' === r
            ? 'audio/wav'
            : '.mp3' === r
              ? 'audio/mpeg'
              : '.m4a' === r
                ? 'audio/mp4'
                : 'audio/wav',
        a = t.toString('base64');
      return `data:${i};base64,${a}`;
    } catch (e) {
      throw new Error(
        `Failed to prepare audio file for Replicate: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }
  parseReplicateOutput(e) {
    const t = [],
      r = [];
    if (e && 'object' == typeof e) {
      const i = e;
      if (i.segments)
        for (const e of i.segments) {
          const i = e;
          if (
            (r.push({
              id: i.id || 0,
              seek: i.seek || 0,
              start: i.start || 0,
              end: i.end || 0,
              text: i.text || '',
              words: [],
            }),
            i.words && Array.isArray(i.words))
          )
            for (const e of i.words) {
              const r = e;
              t.push({
                word: r.word?.trim() || '',
                start: r.start || 0,
                end: r.end || 0,
                confidence: r.probability || void 0,
              });
            }
        }
      if (0 === t.length && i.text) {
        const e = i.text.trim(),
          r = i.duration || 10,
          a = e.split(/\s+/),
          n = r / a.length;
        a.forEach((e, r) => {
          const i = r * n,
            a = (r + 1) * n;
          t.push({ word: e, start: i, end: a, confidence: 0.5 });
        });
      }
      return {
        text: i.text || '',
        language: i.language || 'en',
        duration: i.duration || 0,
        words: t,
        segments: r,
      };
    }
    return { text: '', language: 'en', duration: 0, words: t, segments: r };
  }
  async testService() {
    try {
      return !!process.env.REPLICATE_API_TOKEN;
    } catch {
      return !1;
    }
  }
}
exports.ReplicateWhisperService = ReplicateWhisperService;

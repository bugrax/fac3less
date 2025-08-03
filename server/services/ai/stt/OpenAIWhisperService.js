'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, r, n) {
          void 0 === n && (n = r);
          var i = Object.getOwnPropertyDescriptor(t, r);
          ((i &&
            !('get' in i ? !t.__esModule : i.writable || i.configurable)) ||
            (i = {
              enumerable: !0,
              get: function () {
                return t[r];
              },
            }),
            Object.defineProperty(e, n, i));
        }
      : function (e, t, r, n) {
          (void 0 === n && (n = r), (e[n] = t[r]));
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
          for (var r = ownKeys(e), n = 0; n < r.length; n++)
            'default' !== r[n] && __createBinding(t, e, r[n]);
        return (__setModuleDefault(t, e), t);
      };
    })(),
  __importDefault =
    (this && this.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.OpenAIWhisperService = void 0));
const replicate_1 = __importDefault(require('replicate')),
  fs = __importStar(require('fs')),
  path = __importStar(require('path'));
class OpenAIWhisperService {
  openai;
  constructor() {
    if (!process.env.REPLICATE_API_TOKEN)
      throw new Error('REPLICATE_API_TOKEN is required for Whisper service');
    
    // Replicate üzerinden Whisper kullan
    this.replicate = new replicate_1.default({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  async extractWordLevelTimestamps(e) {
    try {
      const t = await this.prepareAudioForReplicate(e),
        r = await this.replicate.run(
          'openai/whisper:8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e',
          {
            input: {
              task: 'transcribe',
              audio: t,
              language: 'auto',
              // openai/whisper modelinde word-level timestamp default olarak gelir
              batch_size: 64,
              diarise_audio: false,
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
      const t = await fs.promises.readFile(e),
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
exports.OpenAIWhisperService = OpenAIWhisperService;

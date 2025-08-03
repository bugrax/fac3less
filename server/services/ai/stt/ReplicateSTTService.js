'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ReplicateSTTService = void 0));
const replicate_1 = __importDefault(require('replicate')),
  fs_1 = require('fs');
class ReplicateSTTService {
  replicate;
  modelVersion =
    'vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c';
  constructor() {
    if (!process.env.REPLICATE_API_TOKEN)
      throw new Error('REPLICATE_API_TOKEN environment variable is required');
    this.replicate = new replicate_1.default({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  async extractWordLevelTimestamps(e) {
    try {
      await this.validateAudioFile(e);
      const t = await this.prepareAudioForReplicate(e),
        r = await this.runWhisperSTT(t);
      return this.parseSTTOutput(r);
    } catch (e) {
      const t = e instanceof Error ? e.message : String(e);
      throw new Error(`STT processing failed: ${t}`);
    }
  }
  async testConnection() {
    try {
      return !!process.env.REPLICATE_API_TOKEN;
    } catch {
      return !1;
    }
  }
  async validateAudioFile(e) {
    try {
      const t = await fs_1.promises.stat(e);
      if (!t.isFile()) throw new Error(`Path is not a file: ${e}`);
      if (0 === t.size) throw new Error(`Audio file is empty: ${e}`);
      if (t.size > 26214400)
        throw new Error(`Audio file too large (max 25MB): ${e}`);
    } catch (t) {
      if ('ENOENT' === t.code) throw new Error(`Audio file not found: ${e}`);
      throw t;
    }
  }
  async prepareAudioForReplicate(e) {
    try {
      const t = (await fs_1.promises.readFile(e)).toString('base64'),
        r = e.toLowerCase().split('.').pop();
      return `data:${this.getMimeType(r || '')};base64,${t}`;
    } catch (e) {
      throw new Error(
        `Failed to prepare audio file: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }
  getMimeType(e) {
    return (
      {
        wav: 'audio/wav',
        mp3: 'audio/mpeg',
        mp4: 'audio/mp4',
        flac: 'audio/flac',
        ogg: 'audio/ogg',
        webm: 'audio/webm',
      }[e] || 'audio/wav'
    );
  }
  async runWhisperSTT(e) {
    try {
      return await this.replicate.run(this.modelVersion, {
        input: {
          task: 'transcribe',
          audio: e,
          language: 'None',
          timestamp: 'word',
          batch_size: 64,
          diarise_audio: !1,
        },
      });
    } catch (e) {
      throw new Error(
        `Replicate STT API failed: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }
  parseSTTOutput(e) {
    const t = [],
      r = [];
    if (e && 'object' == typeof e) {
      if (
        (e.chunks &&
          Array.isArray(e.chunks) &&
          e.chunks.forEach((e, i) => {
            const a = e,
              o = [];
            if (
              a.timestamp &&
              Array.isArray(a.timestamp) &&
              a.timestamp.length >= 2
            ) {
              const [e, r] = a.timestamp,
                i = a.text?.trim() || '';
              if (i) {
                const s = {
                  word: i,
                  start: e || 0,
                  end: r || e || 0,
                  confidence: a.confidence || void 0,
                };
                (t.push(s), o.push(s));
              }
            }
            o.length > 0 &&
              r.push({
                id: i,
                start: o[0].start,
                end: o[o.length - 1].end,
                text: o.map(e => e.word).join(' '),
                words: o,
              });
          }),
        0 === t.length && e.text)
      ) {
        const r = e.text.trim(),
          i = this.estimateAudioDuration(r);
        t.push(...this.createEstimatedWordTimings(r, i));
      }
      return {
        text: e.text || t.map(e => e.word).join(' '),
        language: e.language || 'en',
        duration: this.calculateTotalDuration(t),
        words: t,
        segments: r,
      };
    }
    throw new Error('Invalid STT output format');
  }
  estimateAudioDuration(e) {
    return (e.split(/\s+/).length / 150) * 60;
  }
  createEstimatedWordTimings(e, t) {
    const r = e.split(/\s+/).filter(e => e.length > 0),
      i = t / r.length;
    return r.map((e, t) => ({
      word: e,
      start: t * i,
      end: (t + 1) * i,
      confidence: 0.5,
    }));
  }
  calculateTotalDuration(e) {
    return 0 === e.length ? 0 : Math.max(...e.map(e => e.end));
  }
}
exports.ReplicateSTTService = ReplicateSTTService;

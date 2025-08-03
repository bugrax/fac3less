'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, i, r) {
          void 0 === r && (r = i);
          var a = Object.getOwnPropertyDescriptor(t, i);
          ((a &&
            !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
            (a = {
              enumerable: !0,
              get: function () {
                return t[i];
              },
            }),
            Object.defineProperty(e, r, a));
        }
      : function (e, t, i, r) {
          (void 0 === r && (r = i), (e[r] = t[i]));
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
              for (var i in e)
                Object.prototype.hasOwnProperty.call(e, i) && (t[t.length] = i);
              return t;
            }),
          ownKeys(e)
        );
      };
      return function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var i = ownKeys(e), r = 0; r < i.length; r++)
            'default' !== i[r] && __createBinding(t, e, i[r]);
        return (__setModuleDefault(t, e), t);
      };
    })(),
  __importDefault =
    (this && this.__importDefault) ||
    function (e) {
      return e && e.__esModule ? e : { default: e };
    };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.MinimaxTTSClient = exports.MINIMAX_VOICES = void 0));
const replicate_1 = __importDefault(require('replicate')),
  uuid_1 = require('uuid'),
  fs = __importStar(require('fs')),
  path = __importStar(require('path')),
  audioDownloader_1 = require('./helpers/audioDownloader'),
  predictionHandler_1 = require('./helpers/predictionHandler'),
  logger_1 = require('../../../utils/logger');
exports.MINIMAX_VOICES = {
  Wise_Woman: 'Wise Woman - Mature female voice',
  Friendly_Person: 'Friendly Person - Warm neutral voice',
  Inspirational_girl: 'Inspirational Girl - Uplifting female voice',
  Deep_Voice_Man: 'Deep Voice Man - Deep male voice',
  Calm_Woman: 'Calm Woman - Soothing female voice',
  Casual_Guy: 'Casual Guy - Relaxed male voice',
  Lively_Girl: 'Lively Girl - Energetic female voice',
  Patient_Man: 'Patient Man - Steady male voice',
  Young_Knight: 'Young Knight - Heroic male voice',
  Determined_Man: 'Determined Man - Strong male voice',
  Lovely_Girl: 'Lovely Girl - Sweet female voice',
  Decent_Boy: 'Decent Boy - Pleasant male voice',
  Imposing_Manner: 'Imposing Manner - Authoritative voice',
  Elegant_Man: 'Elegant Man - Refined male voice',
  Abbess: 'Abbess - Wise female voice',
  Sweet_Girl_2: 'Sweet Girl 2 - Gentle female voice',
  Exuberant_Girl: 'Exuberant Girl - Enthusiastic female voice',
};
class MinimaxTTSClient {
  replicate;
  outputDir;
  debugMode;
  constructor(config) {
    const e = config?.apiKey ?? process.env.REPLICATE_API_TOKEN;
    if (((this.debugMode = 'true' === process.env.MINIMAX_DEBUG), !e))
      throw new Error('REPLICATE_API_TOKEN is required for MiniMax TTS');
    ((this.replicate = new replicate_1.default({ auth: e })),
      (this.outputDir = process.env.AUDIO_OUTPUT_DIR ?? './output/audio'),
      fs.existsSync(this.outputDir) ||
        fs.mkdirSync(this.outputDir, { recursive: !0 }));
  }
  async textToSpeech(e) {
    const t = [1e3, 2e3, 4e3];
    for (let i = 0; i < 3; i++)
      try {
        (this.logGenerationStart(e, i), this.validateVoice(e.voice_id));
        const t = {
            text: e.text,
            voice_id: e.voice_id,
            pitch: Math.round(e.pitch ?? 0),
            speed: e.speed ?? 1,
            volume: e.volume ?? 1,
            emotion: e.emotion ?? 'neutral',
            bitrate: e.bitrate ?? 128e3,
            channel: e.channel ?? 'mono',
            sample_rate: e.sample_rate ?? 32e3,
            language_boost: e.language_boost ?? 'English',
            english_normalization: e.english_normalization ?? !0,
          },
          r = await this.replicate.run('minimax/speech-02-hd', { input: t });
        let a;
        a =
          'object' == typeof r && null !== r && 'url' in r
            ? r.url()
            : (0, predictionHandler_1.extractAudioUrl)(r);
        const o = await (0, audioDownloader_1.downloadAudio)(a),
          n = this.calculateDuration(e.text, e.speed);
        return this.createSuccessResult(
          o,
          n,
          e.sample_rate ?? 32e3,
          'stereo' === e.channel ? 2 : 1
        );
      } catch (r) {
        if (
          (logger_1.logger.error(
            `[MinimaxTTS] TTS generation failed on attempt ${i + 1}:`,
            r
          ),
          2 === i)
        ) {
          const t =
            r instanceof Error
              ? r.message
              : 'Failed to generate speech with MiniMax TTS';
          return (
            await this.saveFailedTextSample(e.text, t),
            { success: !1, error: t }
          );
        }
        await new Promise(e => setTimeout(e, t[i]));
      }
    return {
      success: !1,
      error: 'Failed to generate speech after all retries',
    };
  }
  async saveAudioToFile(e, t) {
    const i = t || `tts_${(0, uuid_1.v4)()}.wav`,
      r = path.join(this.outputDir, i);
    return (await fs.promises.writeFile(r, e), r);
  }
  async saveFailedTextSample(e, t) {
    if (this.debugMode)
      try {
        const i = path.join(this.outputDir, 'debug');
        await fs.promises.mkdir(i, { recursive: !0 });
        const r = `failed_minimax_tts_${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
          a = path.join(i, r),
          o = {
            timestamp: new Date().toISOString(),
            text: e,
            textLength: e.length,
            wordCount: e.split(/\s+/).length,
            error: t,
            specialChars: e.match(/[^a-zA-Z0-9\s.,!?'"]/g) || [],
          };
        await fs.promises.writeFile(a, JSON.stringify(o, null, 2));
      } catch (t) {
        logger_1.logger.error(
          '[MinimaxTTS DEBUG] Failed to save debug sample:',
          t
        );
      }
  }
  getAvailableVoices() {
    return exports.MINIMAX_VOICES;
  }
  logGenerationStart(e, t) {
    this.debugMode &&
      logger_1.logger.info(
        `[MinimaxTTS] Starting generation attempt ${t + 1} for voice: ${e.voice_id}`
      );
  }
  validateVoice(e) {
    if (!exports.MINIMAX_VOICES[e])
      throw new Error(
        `Invalid voice: ${e}. Available voices: ${Object.keys(exports.MINIMAX_VOICES).join(', ')}`
      );
  }
  calculateDuration(e, t) {
    return (e.split(/\s+/).length / (150 * (t ?? 1))) * 60;
  }
  createSuccessResult(e, t, i, r) {
    return {
      success: !0,
      data: {
        audio: e,
        duration: t,
        format: 'wav',
        sampleRate: i,
        channels: r,
      },
    };
  }
}
exports.MinimaxTTSClient = MinimaxTTSClient;

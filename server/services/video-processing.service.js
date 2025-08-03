'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (t, e, i, r) {
          void 0 === r && (r = i);
          var a = Object.getOwnPropertyDescriptor(e, i);
          ((a &&
            !('get' in a ? !e.__esModule : a.writable || a.configurable)) ||
            (a = {
              enumerable: !0,
              get: function () {
                return e[i];
              },
            }),
            Object.defineProperty(t, r, a));
        }
      : function (t, e, i, r) {
          (void 0 === r && (r = i), (t[r] = e[i]));
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
      var ownKeys = function (t) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (t) {
              var e = [];
              for (var i in t)
                Object.prototype.hasOwnProperty.call(t, i) && (e[e.length] = i);
              return e;
            }),
          ownKeys(t)
        );
      };
      return function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (null != t)
          for (var i = ownKeys(t), r = 0; r < i.length; r++)
            'default' !== i[r] && __createBinding(e, t, i[r]);
        return (__setModuleDefault(e, t), e);
      };
    })(),
  __importDefault =
    (this && this.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VideoProcessingService = void 0));
const path = __importStar(require('path')),
  fs = __importStar(require('fs/promises')),
  axios_1 = __importDefault(require('axios')),
  child_process_1 = require('child_process'),
  util_1 = require('util'),
  ffmpeg_service_1 = require('./ffmpeg.service'),
  logger_1 = require('../utils/logger');
class VideoProcessingService {
  ffmpeg;
  outputDir;
  constructor() {
    ((this.ffmpeg = new ffmpeg_service_1.FFmpegService()),
      (this.outputDir = path.join(process.cwd(), 'output')));
  }
  async initialize() {
    await this.ensureOutputDir();
  }
  async ensureOutputDir() {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: !0 });
    }
  }
  async processWorkflow(t, e, i, r = {}) {
    const a = Date.now(),
      o = path.join(this.outputDir, `workflow_${a}`);
    await fs.mkdir(o, { recursive: !0 });
    try {
      const n = [
          ...(await this.createVideosFromImages(t, o)),
          ...e.map(t => ({ path: t.url || '', duration: t.duration || 0 })),
        ],
        s = path.join(o, 'concatenated.mp4');
      await this.ffmpeg.concatenateVideos(n, s, r.transition);
      let u = s;
      if (i.length > 0) {
        const t = path.join(o, 'with_narration.mp4');
        u = await this.addNarrationTracks(u, i, t);
      }
      if (r.backgroundAudio) {
        const t = path.join(o, 'with_background_audio.mp4');
        u = await this.ffmpeg.addAudioTrack(
          u,
          {
            path: r.backgroundAudio.path,
            volume: r.backgroundAudio.volume || 0.2,
          },
          t,
          !0
        );
      }
      if (r.captions) {
        const t = path.join(o, 'with_captions.mp4');
        u = await this.ffmpeg.addSubtitles(u, r.captions, t, !0);
      }
      if (r.watermark) {
        const t = path.join(o, 'with_watermark.mp4');
        u = await this.ffmpeg.addWatermark(
          u,
          r.watermark.path,
          t,
          r.watermark.position || 'bottomright'
        );
      }
      const c = path.join(this.outputDir, `video_${a}.mp4`);
      r.outputFormat
        ? await this.ffmpeg.encodeVideo(u, c, r.outputFormat)
        : await fs.copyFile(u, c);
      const p = await this.ffmpeg.getVideoDuration(c),
        f = await fs.stat(c);
      return (
        await this.cleanupWorkDir(o),
        { path: c, duration: p, size: f.size }
      );
    } catch (t) {
      throw (await this.cleanupWorkDir(o), t);
    }
  }
  async createVideosFromImages(t, e) {
    const i = [];
    for (let r = 0; r < t.length; r++) {
      const a = path.join(e, `image_video_${r}.mp4`),
        o = 5,
        n = await this.ensureLocalFile(t[r].url, e, `image_${r}.jpg`);
      (await this.ffmpeg.createVideoFromImages([n], a, o),
        i.push({ path: a, duration: o }));
    }
    return i;
  }
  async addNarrationTracks(t, e, i) {
    if (1 === e.length) {
      const r = await this.ensureLocalFile(
        e[0].url,
        path.dirname(i),
        'narration.mp3'
      );
      return await this.ffmpeg.addAudioTrack(t, { path: r }, i, !1);
    }
    return (
      logger_1.logger.warn('Multiple narration tracks not fully implemented'),
      t
    );
  }
  async ensureLocalFile(t, e, i) {
    if (!t.startsWith('http')) return t;
    const r = path.join(e, i),
      a = await axios_1.default.get(t, { responseType: 'stream' }),
      o = (
        await Promise.resolve().then(() => __importStar(require('fs')))
      ).createWriteStream(r);
    return (
      a.data.pipe(o),
      new Promise((t, e) => {
        (o.on('finish', () => t(r)), o.on('error', e));
      })
    );
  }
  async cleanupWorkDir(t) {
    try {
      const e = await fs.readdir(t);
      for (const i of e) await fs.unlink(path.join(t, i));
      await fs.rmdir(t);
    } catch (t) {
      logger_1.logger.error('Cleanup error:', t);
    }
  }
  async generatePreview(t, e = 5) {
    const i = path.join(
      this.outputDir,
      `preview_${path.basename(t, '.mp4')}.jpg`
    );
    return (await this.ffmpeg.extractFrame(t, e, i), i);
  }
  async splitVideoIntoChunks(t, e = 30) {
    const i = await this.ffmpeg.getVideoDuration(t),
      r = [];
    for (let a = 0; a < i; a += e) {
      const i = path.join(this.outputDir, `chunk_${a}_${path.basename(t)}`),
        o = (0, util_1.promisify)(child_process_1.exec);
      (await o(`ffmpeg -i "${t}" -ss ${a} -t ${e} -c copy "${i}" -y`),
        r.push(i));
    }
    return r;
  }
}
exports.VideoProcessingService = VideoProcessingService;

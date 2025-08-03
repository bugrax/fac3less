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
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.FFmpegService = void 0));
const child_process_1 = require('child_process'),
  util_1 = require('util'),
  fs = __importStar(require('fs/promises')),
  path = __importStar(require('path')),
  logger_1 = require('../utils/logger'),
  execPromise = (0, util_1.promisify)(child_process_1.exec);
class FFmpegService {
  tempDir;
  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
  }
  async initialize() {
    await this.ensureTempDir();
  }
  async ensureTempDir() {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: !0 });
    }
  }
  async checkFFmpeg() {
    try {
      return (await execPromise('ffmpeg -version'), !0);
    } catch {
      throw new Error('FFmpeg is not installed or not in PATH');
    }
  }
  async concatenateVideos(e, t, i) {
    if ((await this.checkFFmpeg(), !i)) {
      const i = path.join(this.tempDir, `concat_${Date.now()}.txt`),
        r = e.map(e => `file '${e.path}'`).join('\n');
      await fs.writeFile(i, r);
      const a = `ffmpeg -loglevel error -f concat -safe 0 -i "${i}" -c copy "${t}" -y`;
      return (await execPromise(a), await fs.unlink(i), t);
    }
    return 2 === e.length
      ? this.crossfadeTwo(e[0], e[1], t, i)
      : this.concatenateWithTransitions(e, t, i);
  }
  async crossfadeTwo(e, t, i, r) {
    const a = e.duration - r.duration,
      o = `ffmpeg -i "${e.path}" -i "${t.path}" -filter_complex "[0:v][1:v]xfade=transition=${r.type}:duration=${r.duration}:offset=${a}[outv];[0:a][1:a]acrossfade=duration=${r.duration}[outa]" -map [outv] -map [outa] "${i}" -y`;
    return (await execPromise(o), i);
  }
  async concatenateWithTransitions(e, t, i) {
    let r = '',
      a = '0:v',
      o = '0:a';
    for (let t = 1; t < e.length; t++) {
      const s =
        e.slice(0, t).reduce((e, t) => e + t.duration, 0) - t * i.duration;
      ((r += `[${a}][${t}:v]xfade=transition=${i.type}:duration=${i.duration}:offset=${s}[v${t}];`),
        (r += `[${o}][${t}:a]acrossfade=duration=${i.duration}[a${t}];`),
        (a = `v${t}`),
        (o = `a${t}`));
    }
    const s = `ffmpeg ${e.map(e => `-i "${e.path}"`).join(' ')} -filter_complex "${r}" -map [${a}] -map [${o}] "${t}" -y`;
    return (await execPromise(s), t);
  }
  async addAudioTrack(e, t, i, r = !0) {
    await this.checkFFmpeg();
    const a = t.volume || 0.3;
    let o = '';
    o = r
      ? `-filter_complex "[1:a]volume=${a}[bg];[0:a][bg]amix=inputs=2:duration=first[outa]" -map 0:v -map [outa]`
      : '-map 0:v -map 1:a';
    const s = `ffmpeg -i "${e}" -i "${t.path}" ${o} -c:v copy "${i}" -y`;
    return (await execPromise(s), i);
  }
  async addSubtitles(e, t, i, r = !0) {
    if ((await this.checkFFmpeg(), r)) {
      const r = t.style || '',
        a = r ? `:force_style='${r}'` : '',
        o = `ffmpeg -i "${e}" -vf "subtitles='${t.path}'${a}" -c:a copy "${i}" -y`;
      await execPromise(o);
    } else {
      const r = `ffmpeg -i "${e}" -i "${t.path}" -c copy -c:s mov_text "${i}" -y`;
      await execPromise(r);
    }
    return i;
  }
  async generateSubtitlesFromAudio(e, t) {
    throw new Error(
      'Speech-to-text service not implemented. Use external service like Whisper or AssemblyAI'
    );
  }
  async encodeVideo(e, t, i = {}) {
    await this.checkFFmpeg();
    const {
      codec: r = 'libx264',
      bitrate: a = '2M',
      resolution: o,
      fps: s,
    } = i;
    let n = `ffmpeg -i "${e}"`;
    return (
      o && (n += ` -vf scale=${o}`),
      s && (n += ` -r ${s}`),
      (n += ` -c:v ${r} -b:v ${a} -c:a aac -preset medium "${t}" -y`),
      await execPromise(n),
      t
    );
  }
  async extractFrame(e, t, i) {
    await this.checkFFmpeg();
    const r = `ffmpeg -ss ${t} -i "${e}" -vframes 1 "${i}" -y`;
    return (await execPromise(r), i);
  }
  async getVideoDuration(e) {
    await this.checkFFmpeg();
    const t = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${e}"`,
      { stdout: i } = await execPromise(t);
    return parseFloat(i.trim());
  }
  async getVideoMetadata(videoPath) {
    if (!videoPath || '' === videoPath.trim())
      throw new Error(
        `Invalid video path for getVideoMetadata: videoPath="${videoPath}"`
      );
    await this.checkFFmpeg();
    const command = `ffprobe -v error -print_format json -show_format -show_streams "${videoPath}"`,
      { stdout: stdout } = await execPromise(command),
      info = JSON.parse(stdout),
      videoStream = info.streams.find(e => 'video' === e.codec_type),
      duration = parseFloat(info.format.duration || '0');
    return {
      duration: duration,
      width: videoStream?.width || 1280,
      height: videoStream?.height || 720,
      fps: videoStream?.r_frame_rate ? eval(videoStream.r_frame_rate) : 30,
    };
  }
  async addWatermark(e, t, i, r = 'bottomright') {
    await this.checkFFmpeg();
    const a = `ffmpeg -i "${e}" -i "${t}" -filter_complex "overlay=${{ topleft: '10:10', topright: 'W-w-10:10', bottomleft: '10:H-h-10', bottomright: 'W-w-10:H-h-10' }[r]}" -c:a copy "${i}" -y`;
    return (await execPromise(a), i);
  }
  async createVideoFromImages(e, t, i = 5, r) {
    await this.checkFFmpeg();
    const a = [];
    for (let t = 0; t < e.length; t++) {
      const r = path.join(this.tempDir, `img_video_${t}_${Date.now()}.mp4`),
        o = `ffmpeg -loop 1 -i "${e[t]}" -c:v libx264 -t ${i} -pix_fmt yuv420p "${r}" -y`;
      (await execPromise(o), a.push({ path: r, duration: i }));
    }
    const o = await this.concatenateVideos(a, t, r);
    for (const e of a) await fs.unlink(e.path);
    return o;
  }
  async cleanup() {
    try {
      const e = await fs.readdir(this.tempDir);
      for (const t of e) await fs.unlink(path.join(this.tempDir, t));
    } catch (e) {
      logger_1.logger.error('Cleanup error:', e);
    }
  }
}
exports.FFmpegService = FFmpegService;

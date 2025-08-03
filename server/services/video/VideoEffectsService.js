'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, i, o) {
          void 0 === o && (o = i);
          var r = Object.getOwnPropertyDescriptor(t, i);
          ((r &&
            !('get' in r ? !t.__esModule : r.writable || r.configurable)) ||
            (r = {
              enumerable: !0,
              get: function () {
                return t[i];
              },
            }),
            Object.defineProperty(e, o, r));
        }
      : function (e, t, i, o) {
          (void 0 === o && (o = i), (e[o] = t[i]));
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
          for (var i = ownKeys(e), o = 0; o < i.length; o++)
            'default' !== i[o] && __createBinding(t, e, i[o]);
        return (__setModuleDefault(t, e), t);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VideoEffectsService = void 0));
const child_process_1 = require('child_process'),
  util_1 = require('util'),
  path = __importStar(require('path')),
  MediaAnalyzer_1 = require('../media/MediaAnalyzer'),
  MediaFileManager_1 = require('../media/MediaFileManager'),
  FFmpegCommandBuilder_1 = require('../ffmpeg/FFmpegCommandBuilder'),
  logger_1 = require('../../utils/logger'),
  execPromise = (0, util_1.promisify)(child_process_1.exec);
class VideoEffectsService {
  mediaAnalyzer;
  fileManager;
  constructor(e, t) {
    ((this.mediaAnalyzer = e || new MediaAnalyzer_1.MediaAnalyzer()),
      (this.fileManager = t || new MediaFileManager_1.MediaFileManager()));
  }
  async applyWhipZoom(e) {
    const { videoPath: t, outputPath: i, zoomDuration: o, zoomType: r } = e;
    logger_1.logger.info('[VideoEffectsService] Applying whip zoom to video');
    const n = await this.mediaAnalyzer.probeMedia(t),
      a = n.streams.find(e => 'video' === e.codec_type),
      s = n.streams.find(e => 'audio' === e.codec_type);
    if (!a) throw new Error('No video stream found');
    const d = a.width || 1280,
      g = a.height || 720,
      c = this.parseFps(a.r_frame_rate || '24/1'),
      l = await this.mediaAnalyzer.getMediaDuration(t),
      u = FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildZoomCommand({
        inputPath: t,
        outputPath: i,
        zoomDuration: o,
        zoomType: r,
        width: d,
        height: g,
        fps: c,
        videoDuration: l,
        hasAudio: !!s,
      });
    try {
      (logger_1.logger.info(
        `[VideoEffectsService] Applying zoom effect to ${l}s video`
      ),
        await execPromise(u));
      const e = await this.mediaAnalyzer.getMediaDuration(i);
      return (
        logger_1.logger.debug(
          `[VideoEffectsService] Zoom applied - Input: ${l.toFixed(2)}s, Output: ${e.toFixed(2)}s`
        ),
        Math.abs(e - l) > 0.5 &&
          logger_1.logger.warn(
            `[VideoEffectsService] Duration mismatch after zoom: expected ${l}s, got ${e}s`
          ),
        i
      );
    } catch (e) {
      return (
        logger_1.logger.error(
          '[VideoEffectsService] Failed to apply zoom effect:',
          e
        ),
        logger_1.logger.error(`[VideoEffectsService] FFmpeg command was: ${u}`),
        t
      );
    }
  }
  async addIntroSound(e) {
    const {
      videoPath: t,
      introSoundPath: i,
      outputPath: o,
      soundVolume: r,
    } = e;
    logger_1.logger.info('[VideoEffectsService] Adding intro sound to video');
    const n = this.fileManager.resolvePath(i);
    if (!(await this.fileManager.fileExists(n)))
      return (
        logger_1.logger.warn(
          `[VideoEffectsService] Intro sound file not found at ${n}, skipping`
        ),
        t
      );
    logger_1.logger.debug(
      `[VideoEffectsService] Intro sound file found at ${n}`
    );
    const a =
      FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildIntroSoundCommand({
        videoPath: t,
        introSoundPath: n,
        outputPath: o,
        soundVolume: r,
      });
    try {
      return (
        await execPromise(a),
        logger_1.logger.debug(
          `[VideoEffectsService] Intro sound added to ${o}`
        ),
        o
      );
    } catch (e) {
      return (
        logger_1.logger.error(
          '[VideoEffectsService] Failed to add intro sound:',
          e
        ),
        logger_1.logger.error(`[VideoEffectsService] FFmpeg command was: ${a}`),
        t
      );
    }
  }
  async concatenateWithTransitions(e, t) {
    const {
      segmentPaths: i,
      transitionSoundPath: o,
      soundVolume: r,
      tempDir: n,
    } = e;
    logger_1.logger.info(
      `[VideoEffectsService] Concatenating ${i.length} segments with transition sounds`
    );
    const a = this.fileManager.resolvePath(o);
    if (!(await this.fileManager.fileExists(a)))
      return (
        logger_1.logger.warn(
          `[VideoEffectsService] Transition sound file not found at ${a}, falling back to regular concatenation`
        ),
        t(i, n)
      );
    logger_1.logger.debug(
      `[VideoEffectsService] Transition sound file found at ${a}`
    );
    const s = [];
    let d = 0;
    for (let e = 0; e < i.length - 1; e++) {
      const t = await this.mediaAnalyzer.getMediaDuration(i[e]);
      ((d += t),
        s.push(d),
        logger_1.logger.debug(
          `[VideoEffectsService] Segment ${e + 1}: duration=${t.toFixed(3)}s, transition at ${d.toFixed(3)}s`
        ));
    }
    const g = await this.mediaAnalyzer.getMediaDuration(i[i.length - 1]);
    (logger_1.logger.debug(
      `[VideoEffectsService] Segment ${i.length}: duration=${g.toFixed(3)}s (no transition after)`
    ),
      logger_1.logger.info(
        `[VideoEffectsService] Transition points: ${s.map(e => e.toFixed(3) + 's').join(', ')}`
      ));
    const c = d + g;
    logger_1.logger.debug(
      `[VideoEffectsService] Total expected duration: ${c.toFixed(3)}s`
    );
    const l = path.join(n, 'concat_with_transitions.txt');
    await this.fileManager.createConcatListFile(i, l);
    const u = path.join(n, 'concatenated_with_transitions.mp4'),
      f = FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildTransitionCommand({
        concatListPath: l,
        transitionSoundPath: a,
        outputPath: u,
        transitionTimestamps: s,
        soundVolume: r,
      });
    try {
      (logger_1.logger.debug(
        '[VideoEffectsService] Running concatenation with transitions'
      ),
        await execPromise(f));
      const e = await this.mediaAnalyzer.getMediaDuration(u);
      return (
        logger_1.logger.info(
          `[VideoEffectsService] Concatenation with transitions complete. Duration: ${e.toFixed(2)}s`
        ),
        await this.fileManager.deleteFile(l),
        u
      );
    } catch (e) {
      return (
        logger_1.logger.error(
          '[VideoEffectsService] Concatenation with transitions failed:',
          e
        ),
        logger_1.logger.warn(
          '[VideoEffectsService] Falling back to regular concatenation'
        ),
        t(i, n)
      );
    }
  }
  parseFps(e) {
    if (e.includes('/')) {
      const [t, i] = e.split('/').map(Number);
      return i > 0 ? t / i : 30;
    }
    return parseFloat(e) || 30;
  }
}
exports.VideoEffectsService = VideoEffectsService;

'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, i, t, o) {
          void 0 === o && (o = t);
          var r = Object.getOwnPropertyDescriptor(i, t);
          ((r &&
            !('get' in r ? !i.__esModule : r.writable || r.configurable)) ||
            (r = {
              enumerable: !0,
              get: function () {
                return i[t];
              },
            }),
            Object.defineProperty(e, o, r));
        }
      : function (e, i, t, o) {
          (void 0 === o && (o = t), (e[o] = i[t]));
        }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (e, i) {
          Object.defineProperty(e, 'default', { enumerable: !0, value: i });
        }
      : function (e, i) {
          e.default = i;
        }),
  __importStar =
    (this && this.__importStar) ||
    (function () {
      var ownKeys = function (e) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (e) {
              var i = [];
              for (var t in e)
                Object.prototype.hasOwnProperty.call(e, t) && (i[i.length] = t);
              return i;
            }),
          ownKeys(e)
        );
      };
      return function (e) {
        if (e && e.__esModule) return e;
        var i = {};
        if (null != e)
          for (var t = ownKeys(e), o = 0; o < t.length; o++)
            'default' !== t[o] && __createBinding(i, e, t[o]);
        return (__setModuleDefault(i, e), i);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.AudioVideoSyncService = void 0));
const child_process_1 = require('child_process'),
  util_1 = require('util'),
  path = __importStar(require('path')),
  MediaAnalyzer_1 = require('../media/MediaAnalyzer'),
  MediaFileManager_1 = require('../media/MediaFileManager'),
  FFmpegCommandBuilder_1 = require('../ffmpeg/FFmpegCommandBuilder'),
  logger_1 = require('../../utils/logger'),
  execPromise = (0, util_1.promisify)(child_process_1.exec);
class AudioVideoSyncService {
  mediaAnalyzer;
  fileManager;
  constructor(e, i) {
    ((this.mediaAnalyzer = e || new MediaAnalyzer_1.MediaAnalyzer()),
      (this.fileManager = i || new MediaFileManager_1.MediaFileManager()));
  }
  async smartAudioVideoSync(e, i, t) {
    logger_1.logger.info(
      '[AudioVideoSyncService] Starting smart audio-video sync'
    );
    const o = [],
      r = [];
    for (const i of e) {
      const e = await this.mediaAnalyzer.getMediaDuration(i);
      o.push({ path: i, duration: e });
    }
    for (const e of i) {
      const i = await this.mediaAnalyzer.getMediaDuration(e);
      r.push({ path: e, duration: i });
    }
    (logger_1.logger.debug(
      `[AudioVideoSyncService] Audio durations: ${o.map(e => e.duration.toFixed(2)).join(', ')}`
    ),
      logger_1.logger.debug(
        `[AudioVideoSyncService] Video durations: ${r.map(e => e.duration.toFixed(2)).join(', ')}`
      ));
    const a = this.createSyncStrategy(o, r),
      n = [];
    for (let e = 0; e < a.length; e++) {
      const i = a[e],
        o = path.join(t, `synced_segment_${e}.mp4`);
      (1 === i.videoClips.length
        ? await this.processSimpleSegment(i, o)
        : await this.processComplexSegment(i, o, t, e),
        n.push(o),
        logger_1.logger.debug(
          `[AudioVideoSyncService] Segment ${e + 1} processed`
        ));
    }
    return { processedPaths: n, syncSegments: a };
  }
  createSyncStrategy(e, i) {
    logger_1.logger.debug('[AudioVideoSyncService] Creating sync strategy');
    const t = [];
    for (let o = 0; o < e.length; o++) {
      const r = e[o],
        a = o % i.length,
        n = i[a],
        d = {
          audioPath: r.path,
          audioDuration: r.duration,
          videoClips: [
            {
              videoPath: n.path,
              startTime: 0,
              duration: r.duration,
              originalIndex: a,
            },
          ],
        };
      (t.push(d),
        logger_1.logger.debug(
          `[AudioVideoSyncService] Audio ${o + 1} (${r.duration.toFixed(2)}s) → Video ${a + 1} (full segment)`
        ));
    }
    return t;
  }
  async processSimpleSegment(e, i) {
    const t = e.videoClips[0],
      o = FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildSyncCommand({
        audioPath: e.audioPath,
        videoPath: t.videoPath,
        outputPath: i,
        startTime: t.startTime,
        audioDuration: e.audioDuration,
      });
    (logger_1.logger.debug(
      `[AudioVideoSyncService] Processing simple segment: audio=${e.audioDuration.toFixed(2)}s, video_clip=${t.duration.toFixed(2)}s`
    ),
      await execPromise(o));
  }
  async processComplexSegment(e, i, t, o) {
    const r = [];
    for (let i = 0; i < e.videoClips.length; i++) {
      const a = e.videoClips[i],
        n = path.join(t, `seg${o}_clip${i}.mp4`),
        d = FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildVideoClipCommand(
          a.videoPath,
          n,
          a.startTime,
          a.duration
        );
      (await execPromise(d), r.push(n));
    }
    const a = path.join(t, `seg${o}_concat.txt`);
    await this.fileManager.createConcatListFile(r, a);
    const n =
      FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildComplexSegmentCommand({
        videoClipPaths: r,
        concatListPath: a,
        audioPath: e.audioPath,
        outputPath: i,
        audioDuration: e.audioDuration,
      });
    await execPromise(n);
    for (const e of r) await this.fileManager.deleteFile(e);
    await this.fileManager.deleteFile(a);
  }
  calculateAdjustedTranscripts(e, i) {
    const t = [];
    let o = 0;
    e.length !== i.length &&
      logger_1.logger.warn(
        `[AudioVideoSyncService] Transcript/segment count mismatch: ${e.length} transcripts, ${i.length} segments`
      );
    for (let r = 0; r < e.length; r++) {
      const a = r < i.length ? i[r] : null,
        n = o + (a ? a.audioDuration : 5);
      (t.push({ text: e[r], startTime: o, endTime: n, originalIndex: r }),
        (o = n));
    }
    return t;
  }
}
exports.AudioVideoSyncService = AudioVideoSyncService;

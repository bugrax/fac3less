'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.MediaAnalyzer = void 0));
const child_process_1 = require('child_process'),
  util_1 = require('util'),
  ffmpeg_service_1 = require('../ffmpeg.service'),
  FFmpegCommandBuilder_1 = require('../ffmpeg/FFmpegCommandBuilder'),
  logger_1 = require('../../utils/logger'),
  execPromise = (0, util_1.promisify)(child_process_1.exec);
class MediaAnalyzer {
  ffmpegService;
  constructor(e) {
    this.ffmpegService = e || new ffmpeg_service_1.FFmpegService();
  }
  async getMediaDuration(e) {
    try {
      return await this.ffmpegService.getVideoDuration(e);
    } catch {
      try {
        const r =
            FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildDurationProbeCommand(
              e
            ),
          { stdout: t } = await execPromise(r),
          a = parseFloat(t.trim());
        if (isNaN(a))
          throw (
            logger_1.logger.error(
              `[MediaAnalyzer] Invalid duration for ${e}: ${t}`
            ),
            new Error(`Could not determine duration for ${e}`)
          );
        return a;
      } catch (r) {
        throw (
          logger_1.logger.error(
            `[MediaAnalyzer] Failed to get duration for ${e}:`,
            r
          ),
          r
        );
      }
    }
  }
  async getVideoMetadata(e) {
    if (!e || '' === e.trim())
      throw new Error(
        `Invalid file path for getVideoMetadata: filePath="${e}"`
      );
    try {
      return await this.ffmpegService.getVideoMetadata(e);
    } catch {
      const r =
          FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildMetadataProbeCommand(
            e
          ),
        { stdout: t } = await execPromise(r),
        a = JSON.parse(t),
        i = a.streams.find(e => 'video' === e.codec_type);
      return {
        duration: parseFloat(a.format.duration || '0'),
        width: i?.width || 1280,
        height: i?.height || 720,
        fps: this.parseFps(i?.r_frame_rate || '30/1'),
      };
    }
  }
  async probeMedia(e) {
    const r = FFmpegCommandBuilder_1.FFmpegCommandBuilder.buildProbeCommand(e),
      { stdout: t } = await execPromise(r);
    return JSON.parse(t);
  }
  async getVideoStreamInfo(e) {
    return (await this.probeMedia(e)).streams.find(
      e => 'video' === e.codec_type
    );
  }
  async getAudioStreamInfo(e) {
    return (await this.probeMedia(e)).streams.find(
      e => 'audio' === e.codec_type
    );
  }
  async hasVideoStream(e) {
    return (await this.probeMedia(e)).streams.some(
      e => 'video' === e.codec_type
    );
  }
  async hasAudioStream(e) {
    return (await this.probeMedia(e)).streams.some(
      e => 'audio' === e.codec_type
    );
  }
  parseFps(e) {
    if (e.includes('/')) {
      const [r, t] = e.split('/').map(Number);
      return t > 0 ? r / t : 30;
    }
    return parseFloat(e) || 30;
  }
  async getMultipleMediaDurations(e) {
    return Promise.all(e.map(e => this.getMediaDuration(e)));
  }
  async analyzeCompatibility(e) {
    const r = [];
    if (0 === e.length) return { compatible: !0, issues: r };
    try {
      const t = (await Promise.all(e.map(e => this.probeMedia(e))))
        .map(e => e.streams.find(e => 'video' === e.codec_type))
        .filter(Boolean);
      if (t.length > 0) {
        const e = t[0],
          a = e?.width,
          i = e?.height,
          o = e?.r_frame_rate;
        t.forEach((e, t) => {
          ((e?.width === a && e?.height === i) ||
            r.push(
              `File ${t + 1} has different resolution: ${e?.width}x${e?.height} vs ${a}x${i}`
            ),
            e?.r_frame_rate !== o &&
              r.push(
                `File ${t + 1} has different framerate: ${e?.r_frame_rate} vs ${o}`
              ));
        });
      }
      return { compatible: 0 === r.length, issues: r };
    } catch (e) {
      return (
        logger_1.logger.error(
          '[MediaAnalyzer] Compatibility analysis failed:',
          e
        ),
        { compatible: !1, issues: ['Failed to analyze media files'] }
      );
    }
  }
}
exports.MediaAnalyzer = MediaAnalyzer;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VideoParametersBuilder = void 0));
const logger_1 = require('../../../../utils/logger');
class VideoParametersBuilder {
  static DEFAULT_MODEL = 'bytedance/seedance-1-lite';
  static DEFAULT_MODE = 'standard';
  static DEFAULT_FPS = 24;
  static DEFAULT_VIDEO_PROMPT =
    'subtle motion, gentle movement, smooth animation, cinematic quality';
  static VALID_ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'];
  static build(e) {
    const t = e.model || this.DEFAULT_MODEL;
    logger_1.logger.info(
      `[VideoParametersBuilder] Using video model: ${t} (from input: ${e.model})`
    );
    return {
      model: t,
      mode: e.mode || this.DEFAULT_MODE,
      resolution: this.getResolution(t, e.resolution),
      aspectRatio: this.validateAspectRatio(e.aspectRatio),
      fps: e.fps || this.DEFAULT_FPS,
      videoPrompt: e.videoPrompt || this.DEFAULT_VIDEO_PROMPT,
    };
  }
  static getResolution(e, t) {
    return e.includes('lite') ? t || '720p' : t || '1920x1080';
  }
  static validateAspectRatio(e) {
    const t = e || '16:9';
    return this.VALID_ASPECT_RATIOS.includes(t)
      ? t
      : (logger_1.logger.warn(
          `[VideoParametersBuilder] Invalid aspect ratio "${t}", defaulting to 16:9`
        ),
        '16:9');
  }
  static parseResolution(e) {
    if (e.includes('x')) {
      const [t, i] = e.split('x').map(e => parseInt(e));
      return { width: t, height: i };
    }
    switch (e) {
      case '480p':
        return { width: 854, height: 480 };
      case '720p':
        return { width: 1280, height: 720 };
      default:
        return { width: 1920, height: 1080 };
    }
  }
}
exports.VideoParametersBuilder = VideoParametersBuilder;

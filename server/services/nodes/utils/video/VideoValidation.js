'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.VideoValidation = void 0));
const logger_1 = require('../../../../utils/logger'),
  testMedia_1 = require('../../../../../config/testMedia');
class VideoValidation {
  static validateVideoClient(e) {
    if (!e) {
      throw new Error(
        'Video client not initialized. Check API token configuration.'
      );
    }
  }
  static validateImageInputs(e) {
    if (!e || 0 === e.length) {
      throw new Error('Images are required for video generation');
    }
  }
  static validateImageUrl(e) {
    if ((0, testMedia_1.isTestMode)()) {
      return;
    }
    if (!e.image.path || '' === e.image.path) {
      throw new Error(`Image path is empty for section ${e.sectionId}`);
    }
    if (
      !(
        e.image.path.startsWith('http://') ||
        e.image.path.startsWith('https://')
      )
    ) {
      throw (
        logger_1.logger.error(
          `[VideoValidation] Image path is not a valid URL for section ${e.sectionId}: "${e.image.path}"`
        ),
        new Error(
          `Invalid image URL for section ${e.sectionId}: ${e.image.path}`
        )
      );
    }
  }
  static validateNodeInput(e) {
    if (!e.images || !Array.isArray(e.images)) {
      return 'Images array is required for video generation';
    }
    if (0 === e.images.length) {
      return 'At least one image is required';
    }
    for (let i = 0; i < e.images.length; i++) {
      const t = e.images[i];
      if (!t.sectionId || !t.image || !t.duration) {
        return `Image at index ${i} is missing required fields (sectionId, image, duration)`;
      }
    }
    return !e.mode ||
      ['standard', 'pro'].includes(e.mode) ||
      (0, testMedia_1.isTestMode)()
      ? e.fps && (e.fps < 1 || e.fps > 120)
        ? 'FPS must be between 1 and 120'
        : null
      : 'Mode must be either "standard" or "pro"';
  }
}
exports.VideoValidation = VideoValidation;

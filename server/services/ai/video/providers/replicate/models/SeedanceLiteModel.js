'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.SeedanceLiteModel = void 0));
const BaseReplicateModel_1 = require('./BaseReplicateModel');
class SeedanceLiteModel extends BaseReplicateModel_1.BaseReplicateModel {
  constructor(replicate) {
    super(replicate, 'bytedance/seedance-1-lite');
  }
  async generate(e) {
    return this.generateVideo(e, '720p', '9:16');
  }
  validateOptions(e) {
    return e.startImage
      ? e.prompt && 0 !== e.prompt.trim().length
        ? e.duration && (e.duration < 1 || e.duration > 10)
          ? 'Duration must be between 1 and 10 seconds'
          : e.resolution && !['480p', '720p'].includes(e.resolution)
            ? 'Resolution must be one of: 480p, 720p'
            : e.aspectRatio &&
                !['1:1', '16:9', '9:16', '4:3', '3:4'].includes(e.aspectRatio)
              ? 'Aspect ratio must be one of: 1:1, 16:9, 9:16, 4:3, 3:4'
              : null
        : 'Prompt is required for Seedance Lite'
      : 'Start image is required for Seedance Lite';
  }
  getRequiredFields() {
    return ['prompt', 'startImage'];
  }
}
exports.SeedanceLiteModel = SeedanceLiteModel;

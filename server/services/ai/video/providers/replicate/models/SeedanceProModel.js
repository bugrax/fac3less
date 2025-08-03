'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.SeedanceProModel = void 0));
const BaseReplicateModel_1 = require('./BaseReplicateModel');
class SeedanceProModel extends BaseReplicateModel_1.BaseReplicateModel {
  constructor(replicate) {
    super(replicate, 'bytedance/seedance-1-pro');
  }
  async generate(e) {
    const t = { ...e, resolution: '1080p' };
    return this.generateVideo(t, '1080p', '9:16');
  }
  validateOptions(e) {
    return e.startImage
      ? e.prompt && 0 !== e.prompt.trim().length
        ? e.duration && (e.duration < 1 || e.duration > 10)
          ? 'Duration must be between 1 and 10 seconds'
          : e.resolution && !['480p', '1080p'].includes(e.resolution)
            ? 'Resolution must be one of: 480p, 1080p'
            : e.aspectRatio &&
                !['1:1', '16:9', '9:16', '4:3', '3:4'].includes(e.aspectRatio)
              ? 'Aspect ratio must be one of: 1:1, 16:9, 9:16, 4:3, 3:4'
              : null
        : 'Prompt is required for Seedance Pro'
      : 'Start image is required for Seedance Pro';
  }
  getRequiredFields() {
    return ['prompt', 'startImage'];
  }
}
exports.SeedanceProModel = SeedanceProModel;

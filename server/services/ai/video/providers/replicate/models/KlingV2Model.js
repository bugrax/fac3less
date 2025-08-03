'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.KlingV2Model = void 0));
const BaseReplicateModel_1 = require('./BaseReplicateModel'),
  logger_1 = require('../../../../../../utils/logger');
class KlingV2Model extends BaseReplicateModel_1.BaseReplicateModel {
  constructor(replicate) {
    super(replicate, 'kwaivgi/kling-v2.1');
  }
  async generate(e) {
    const t = this.validateOptions(e);
    if (t) {
      return { success: !1, error: t };
    }
    try {
      const t = {
        mode: e.mode || 'standard',
        prompt: e.prompt,
        duration: e.duration || 5,
        negative_prompt: e.negativePrompt || ''
      };
      e.startImage && (t.start_image = e.startImage);
      const r = await this.createPrediction(t);
      return {
        success: !0,
        data: {
          id: r.id,
          status: this.mapPredictionStatus(r.status),
          duration: e.duration,
          progress: 0,
          estimatedCompletionTime: new Date(Date.now() + 12e4)
        },
        metadata: {
          model: this.modelId,
          mode: e.mode || 'standard',
          hasStartImage: !!e.startImage,
          predictionId: r.id
        }
      };
    } catch (t) {
      return (
        logger_1.logger.error('Kling v2.1 video generation failed', {
          error: t instanceof Error ? t.message : String(t),
          stack: t instanceof Error ? t.stack : void 0,
          modelId: this.modelId,
          options: {
            prompt: e.prompt,
            duration: e.duration,
            mode: e.mode,
            hasStartImage: !!e.startImage
          }
        }),
        {
          success: !1,
          error: t instanceof Error ? t.message : 'Failed to generate video'
        }
      );
    }
  }
  validateOptions(e) {
    return e.prompt && 0 !== e.prompt.trim().length
      ? e.duration && (e.duration < 1 || e.duration > 10)
        ? 'Duration must be between 1 and 10 seconds'
        : e.mode && !['standard', 'pro'].includes(e.mode)
          ? 'Mode must be either "standard" or "pro"'
          : null
      : 'Prompt is required for Kling v2.1';
  }
  getRequiredFields() {
    return ['prompt'];
  }
}
exports.KlingV2Model = KlingV2Model;

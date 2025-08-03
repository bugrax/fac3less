'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.BaseReplicateImageModel = void 0));
const types_1 = require('../types'),
  logger_1 = require('../../../../../../utils/logger');
class BaseReplicateImageModel extends types_1.BaseReplicateImageModel {
  async submitImageJob(e) {
    this.validateOptions(e);
    const t = this.buildModelInput(e);
    try {
      const e = await this.createPrediction(t);
      return {
        id: e.id,
        status: this.mapPredictionStatus(e.status),
        progress: 0,
        estimatedCompletionTime: new Date(Date.now() + 3e4)
      };
    } catch (e) {
      const r = this.config.name;
      throw (
        logger_1.logger.error(`Failed to submit ${r} image job`, {
          error: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack : void 0,
          modelId: this.modelId,
          input: t
        }),
        new Error(
          `Failed to submit image job: ${e instanceof Error ? e.message : String(e)}`
        )
      );
    }
  }
  async checkJobStatus(e) {
    try {
      const t = await this.getPrediction(e),
        r = {
          id: t.id,
          status: this.mapPredictionStatus(t.status),
          progress: t.logs ? this.extractProgress(t.logs) : 0
        };
      return (
        'succeeded' === t.status && t.output
          ? (r.url = await this.extractImageUrl(t.output))
          : 'failed' === t.status &&
            (r.error =
              'string' === typeof t.error
                ? t.error
                : 'Image generation failed'),
        r
      );
    } catch (t) {
      throw (
        logger_1.logger.error(
          `Failed to check job status for ${this.config.name}`,
          {
            error: t instanceof Error ? t.message : String(t),
            stack: t instanceof Error ? t.stack : void 0,
            jobId: e
          }
        ),
        new Error(
          `Failed to check job status: ${t instanceof Error ? t.message : String(t)}`
        )
      );
    }
  }
  mapPredictionStatus(e) {
    switch (e) {
    case 'starting':
    case 'pending':
      return 'pending';
    case 'processing':
    default:
      return 'processing';
    case 'succeeded':
      return 'completed';
    case 'failed':
    case 'canceled':
      return 'failed';
    }
  }
  extractProgress(e) {
    const t = e.match(/(\d+)%/);
    return t ? parseInt(t[1]) : 0;
  }
  async extractImageUrl(e) {
    if (Array.isArray(e) && e.length > 0) {
      return e[0];
    }
    if ('string' === typeof e) {
      return e;
    }
    throw new Error('Unexpected output format from Replicate');
  }
}
exports.BaseReplicateImageModel = BaseReplicateImageModel;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.BaseReplicateModel = void 0));
const logger_1 = require('../../../../../../utils/logger');
class BaseReplicateModel {
  replicate;
  modelId;
  constructor(replicate, modelId) {
    ((this.replicate = replicate), (this.modelId = modelId));
  }
  async createPrediction(e) {
    try {
      return await this.replicate.predictions.create({
        model: this.modelId,
        input: e,
      });
    } catch (e) {
      if (
        (logger_1.logger.error(
          '[BaseReplicateModel] Failed to create prediction:',
          e
        ),
        e instanceof Error && e.message.includes('401'))
      )
        throw new Error(
          'Authentication failed. Please check your REPLICATE_API_TOKEN environment variable.'
        );
      throw new Error(
        `Failed to create prediction: ${e instanceof Error ? e.message : 'Unknown error'}`
      );
    }
  }
  async getPrediction(e) {
    try {
      return await this.replicate.predictions.get(e);
    } catch (e) {
      throw new Error(
        `Failed to get prediction status: ${e instanceof Error ? e.message : 'Unknown error'}`
      );
    }
  }
  createJobId() {
    return `replicate_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  async checkStatus(e) {
    try {
      const t = await this.getPrediction(e),
        r = {
          id: t.id,
          status: this.mapPredictionStatus(t.status),
          progress: t.logs ? this.extractProgress(t.logs) : 0,
        };
      if ('succeeded' === t.status && t.output) {
        let e;
        const s = t.output;
        if (s && 'function' == typeof s.url) e = s.url();
        else if ('string' == typeof s) e = s;
        else {
          if (!(Array.isArray(s) && s.length > 0))
            throw new Error('Unexpected output format from Replicate');
          e = s[0];
        }
        r.videoUrl = e;
      } else
        'failed' === t.status &&
          (r.error = t.error || 'Video generation failed');
      return {
        success: !0,
        data: r,
        metadata: { predictionId: t.id, logs: t.logs },
      };
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to check status',
      };
    }
  }
  mapPredictionStatus(e) {
    switch (e) {
      case 'starting':
      case 'pending':
      default:
        return 'pending';
      case 'processing':
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
    return t ? parseInt(t[1], 10) : 50;
  }
  async generateVideo(e, t, r) {
    const s = this.validateOptions(e);
    if (s) return { success: !1, error: s };
    try {
      const s = {
          fps: e.fps ?? 24,
          image: e.startImage,
          prompt: e.prompt,
          duration: Math.max(5, e.duration ?? 5),
          resolution: e.resolution ?? t,
          aspect_ratio: e.aspectRatio ?? r,
          camera_fixed: e.cameraFixed ?? !1,
        },
        a = await this.createPrediction(s);
      return 'failed' === a.status || a.error
        ? (logger_1.logger.error(
            `[${this.modelId}] Prediction failed immediately:`,
            { error: a.error, logs: a.logs }
          ),
          { success: !1, error: a.error || 'Prediction failed immediately' })
        : {
            success: !0,
            data: {
              id: a.id,
              status: this.mapPredictionStatus(a.status),
              duration: e.duration,
              progress: 0,
              estimatedCompletionTime: new Date(Date.now() + 12e4),
            },
            metadata: {
              model: this.modelId,
              resolution: e.resolution ?? t,
              aspectRatio: e.aspectRatio ?? r,
              fps: e.fps ?? 24,
              predictionId: a.id,
            },
          };
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to generate video',
      };
    }
  }
}
exports.BaseReplicateModel = BaseReplicateModel;

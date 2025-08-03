'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ReplicateClient = void 0));
const replicate_1 = __importDefault(require('replicate')),
  VideoService_1 = require('../../VideoService'),
  ReplicateModels_1 = require('./ReplicateModels'),
  ReplicatePricing_1 = require('./ReplicatePricing'),
  models_1 = require('./models/index'),
  logger_1 = require('../../../../../utils/logger');
class ReplicateClient extends VideoService_1.VideoService {
  replicate;
  models;
  constructor(config) {
    (super('Replicate', config),
      (this.replicate = new replicate_1.default({
        auth: config.apiKey || process.env.REPLICATE_API_TOKEN,
      })),
      (this.models = new Map()),
      this.models.set(
        'kwaivgi/kling-v2.1',
        new models_1.KlingV2Model(this.replicate)
      ),
      this.models.set(
        'bytedance/seedance-1-pro',
        new models_1.SeedanceProModel(this.replicate)
      ),
      this.models.set(
        'bytedance/seedance-1-lite',
        new models_1.SeedanceLiteModel(this.replicate)
      ));
  }
  validateConfig() {
    return (
      !(!this.config.apiKey && !process.env.REPLICATE_API_TOKEN) ||
      (logger_1.logger.error('Replicate API token not configured'), !1)
    );
  }
  async generateVideo(e) {
    if (!this.validateConfig())
      return (
        logger_1.logger.error('[ReplicateClient] API token validation failed'),
        { success: !1, error: 'Replicate API token not configured' }
      );
    const t = this.models.get(e.model);
    if (!t) return { success: !1, error: `Model ${e.model} not supported` };
    try {
      const r = await t.generate(e);
      if (r.success && r.data) {
        const t = this.estimateCost(e.duration, e.model, { mode: e.mode });
        return {
          ...r,
          metadata: { ...r.metadata, provider: 'Replicate', cost: t },
        };
      }
      return r;
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to generate video',
      };
    }
  }
  async checkStatus(e) {
    try {
      const modelId = this.extractModelFromJobId(e),
        t = modelId ? this.models.get(modelId) : null;
      if (!t) {
        for (const [, t] of this.models) {
          const r = await t.checkStatus(e);
          if (r.success && r.data)
            return {
              success: !0,
              data: {
                id: e,
                status: r.data.status || 'processing',
                progress: r.data.progress || 0,
                videoUrl: r.data.videoUrl || void 0,
                error: r.data.error || void 0,
              },
            };
        }
        return {
          success: !1,
          error: 'Could not find prediction with given ID',
        };
      }
      const r = await t.checkStatus(e);
      return r.success && r.data
        ? {
            success: !0,
            data: {
              id: e,
              status: r.data.status,
              progress: r.data.progress,
              videoUrl: r.data.videoUrl,
              error: r.data.error,
            },
          }
        : r;
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to check status',
      };
    }
  }
  extractModelFromJobId(e) {
    return null;
  }
  async listModels() {
    return {
      success: !0,
      data: (0, ReplicateModels_1.getAllModels)(),
      metadata: {
        provider: 'Replicate',
        count: (0, ReplicateModels_1.getAllModels)().length,
      },
    };
  }
  estimateCost(e, t, r) {
    let s;
    if (r && 'object' == typeof r && 'mode' in r) {
      const e = r.mode;
      ('standard' !== e && 'pro' !== e) || (s = e);
    }
    return (0, ReplicatePricing_1.calculateVideoCost)(e, t, s);
  }
}
exports.ReplicateClient = ReplicateClient;

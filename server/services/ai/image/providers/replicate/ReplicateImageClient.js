'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ReplicateImageClient = void 0));
const replicate_1 = __importDefault(require('replicate')),
  ai_1 = require('../../../../../../config/ai/index'),
  SeedreamModel_1 = require('./models/SeedreamModel'),
  FluxModel_1 = require('./models/FluxModel'),
  ImagenModel_1 = require('./models/ImagenModel'),
  logger_1 = require('../../../../../utils/logger');
class ReplicateImageClient {
  replicate;
  models;
  constructor() {
    const e = ai_1.replicateConfig.apiToken || process.env.REPLICATE_API_TOKEN;
    (e
      ? (this.replicate = new replicate_1.default({
          auth: e,
          userAgent: 'video-gen/1.0.0',
        }))
      : (logger_1.logger.warn(
          'REPLICATE_API_TOKEN not configured. Image generation will use mock data.'
        ),
        (this.replicate = null)),
      (this.models = new Map([
        ['seedream-3', new SeedreamModel_1.SeedreamModel(this.replicate)],
        ['flux-dev-lora', new FluxModel_1.FluxModel(this.replicate)],
        ['imagen-4', new ImagenModel_1.ImagenModel(this.replicate)],
      ])));
  }
  async generateImage(e, t) {
    if (!this.replicate)
      throw new Error(
        'Replicate client not initialized. Please set REPLICATE_API_TOKEN or use mock mode.'
      );
    const o = this.models.get(e);
    if (!o) throw new Error(`Model ${e} not found`);
    try {
      return await o.generateImage(t);
    } catch (t) {
      throw (logger_1.logger.error(`Image generation failed with ${e}:`, t), t);
    }
  }
  async generateImages(e, t, o) {
    const r = [];
    for (const i of t) {
      const a = await this.generateImage(e, { ...o, prompt: i });
      (r.push(a),
        r.length < t.length && (await new Promise(e => setTimeout(e, 1e3))));
    }
    return r;
  }
  getAvailableModels() {
    const e = [];
    return (
      this.models.forEach((t, o) => {
        e.push({ id: o, config: t.getConfig() });
      }),
      e
    );
  }
  getModelConfig(e) {
    const t = this.models.get(e);
    if (!t) throw new Error(`Model ${e} not found`);
    return t.getConfig();
  }
  calculateTotalCost(e, t) {
    const o = this.models.get(e);
    if (!o) throw new Error(`Model ${e} not found`);
    return o.getConfig().costPerImage * t;
  }
  async submitImageJob(e, t) {
    if (!this.replicate)
      throw new Error(
        'Replicate client not initialized. Please set REPLICATE_API_TOKEN or use mock mode.'
      );
    const o = this.models.get(e);
    if (!o) throw new Error(`Model ${e} not found`);
    try {
      return await o.submitImageJob(t);
    } catch (t) {
      throw (
        logger_1.logger.error(`Image job submission failed with ${e}:`, t),
        t
      );
    }
  }
  async checkJobStatus(e, t) {
    if (!this.replicate)
      throw new Error(
        'Replicate client not initialized. Please set REPLICATE_API_TOKEN or use mock mode.'
      );
    const o = this.models.get(e);
    if (!o) throw new Error(`Model ${e} not found`);
    try {
      return await o.checkJobStatus(t);
    } catch (e) {
      throw (logger_1.logger.error('Failed to check job status:', e), e);
    }
  }
}
exports.ReplicateImageClient = ReplicateImageClient;

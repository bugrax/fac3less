'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.BaseReplicateImageModel = void 0));
const logger_1 = require('../../../../../utils/logger');
class BaseReplicateImageModel {
  getConfig() {
    return this.config;
  }
  async createPrediction(e) {
    return this.retryWithRateLimit(async () => {
      const t = this.replicate;
      return await t.predictions.create({ version: this.modelId, input: e });
    }, 'create prediction');
  }
  async retryWithRateLimit(e, t, r = 3) {
    let i = new Error(`Failed to ${t}: Maximum retries exceeded`);
    for (let o = 1; o <= r; o++) {
      try {
        return await e();
      } catch (e) {
        i = e instanceof Error ? e : new Error(String(e));
        const s = e;
        if (429 === s?.status || (s?.message && s.message.includes('429'))) {
          const i = s?.retry_after || 10;
          if (
            (logger_1.logger.warn(
              `Rate limit hit during ${t}, attempt ${o}/${r}`,
              {
                retryAfter: i,
                error: e instanceof Error ? e.message : 'Unknown error',
                modelId: this.modelId
              }
            ),
            o < r)
          ) {
            await new Promise(e => setTimeout(e, 1e3 * i));
            continue;
          }
        }
        throw (
          logger_1.logger.error(`Failed to ${t}`, {
            error: e instanceof Error ? e.message : 'Unknown error',
            stack: e instanceof Error ? e.stack : void 0,
            modelId: this.modelId,
            attempt: o
          }),
          new Error(
            `Failed to ${t}: ${e instanceof Error ? e.message : 'Unknown error'}`
          )
        );
      }
    }
    throw i;
  }
  async getPrediction(e) {
    return this.retryWithRateLimit(async () => {
      const t = this.replicate;
      return await t.predictions.get(e);
    }, 'get prediction status');
  }
  validateOptions(e) {
    if (!e.prompt || 0 === e.prompt.trim().length) {
      throw new Error('Prompt is required');
    }
    if (
      e.width &&
      (e.width < this.config.minWidth || e.width > this.config.maxWidth)
    ) {
      throw new Error(
        `Width must be between ${this.config.minWidth} and ${this.config.maxWidth}`
      );
    }
    if (
      e.height &&
      (e.height < this.config.minHeight || e.height > this.config.maxHeight)
    ) {
      throw new Error(
        `Height must be between ${this.config.minHeight} and ${this.config.maxHeight}`
      );
    }
    if (
      e.aspectRatio &&
      !this.config.supportedAspectRatios.includes(e.aspectRatio)
    ) {
      throw new Error(
        `Aspect ratio ${e.aspectRatio} not supported. Supported: ${this.config.supportedAspectRatios.join(', ')}`
      );
    }
  }
}
exports.BaseReplicateImageModel = BaseReplicateImageModel;

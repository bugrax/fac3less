'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.SeedreamModel = void 0));
const BaseReplicateImageModel_1 = require('./BaseReplicateImageModel'),
  logger_1 = require('../../../../../../utils/logger');
class SeedreamModel extends BaseReplicateImageModel_1.BaseReplicateImageModel {
  modelId =
    'bytedance/seedream-3:e97385a576173b08a6a87546457582b01f65bf29a4dc00f1191e884894e0bc73';
  replicate;
  config = {
    id: 'seedream-3',
    name: 'Seedream 3',
    description:
      'High-quality photorealistic image generation with excellent prompt adherence',
    minWidth: 512,
    maxWidth: 2048,
    minHeight: 512,
    maxHeight: 2048,
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    supportedFormats: ['png', 'webp', 'jpeg'],
    costPerImage: 0.012,
    defaultOptions: { guidanceScale: 2.5, outputFormat: 'webp' },
  };
  constructor(replicate) {
    (super(), (this.replicate = replicate));
  }
  async generateImage(e) {
    this.validateOptions(e);
    const t = Date.now(),
      a = {
        prompt: e.prompt,
        size: 'regular',
        width: e.width || 1024,
        height: e.height || 1024,
        aspect_ratio: e.aspectRatio || '1:1',
        guidance_scale:
          e.guidanceScale || this.config.defaultOptions.guidanceScale,
        seed: e.seed,
      };
    try {
      const r = await this.replicate.run(this.modelId, { input: a }),
        i = r instanceof ReadableStream ? await this.streamToUrl(r) : String(r),
        o = (Date.now() - t) / 1e3;
      return {
        url: i,
        format: e.outputFormat || 'webp',
        width: a.width,
        height: a.height,
        model: this.config.name,
        cost: this.config.costPerImage,
        generationTime: o,
      };
    } catch (t) {
      throw (
        logger_1.logger.error('Seedream image generation failed', {
          error: t instanceof Error ? t.message : String(t),
          stack: t instanceof Error ? t.stack : void 0,
          modelId: this.modelId,
          options: {
            prompt: e.prompt,
            width: e.width,
            height: e.height,
            aspectRatio: e.aspectRatio,
          },
        }),
        new Error(
          `Seedream generation failed: ${t instanceof Error ? t.message : String(t)}`
        )
      );
    }
  }
  buildModelInput(e) {
    return {
      prompt: e.prompt,
      size: 'regular',
      width: e.width || 1024,
      height: e.height || 1024,
      aspect_ratio: e.aspectRatio || '1:1',
      guidance_scale:
        e.guidanceScale || this.config.defaultOptions.guidanceScale,
      seed: e.seed,
    };
  }
  async streamToUrl(e) {
    try {
      const t = e.getReader(),
        a = [];
      for (;;) {
        const { done: e, value: r } = await t.read();
        if (e) break;
        a.push(r);
      }
      const r = new Blob(a);
      return URL.createObjectURL(r);
    } catch (e) {
      throw (
        logger_1.logger.error(
          'Failed to convert stream to URL in SeedreamModel',
          {
            error: e instanceof Error ? e.message : String(e),
            stack: e instanceof Error ? e.stack : void 0,
          }
        ),
        new Error(
          `Stream conversion failed: ${e instanceof Error ? e.message : String(e)}`
        )
      );
    }
  }
}
exports.SeedreamModel = SeedreamModel;

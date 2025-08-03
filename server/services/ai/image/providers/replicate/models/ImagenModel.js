'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ImagenModel = void 0));
const BaseReplicateImageModel_1 = require('./BaseReplicateImageModel'),
  logger_1 = require('../../../../../../utils/logger');
class ImagenModel extends BaseReplicateImageModel_1.BaseReplicateImageModel {
  modelId = 'google/imagen-4';
  config = {
    id: 'imagen-4',
    name: 'Google Imagen 4',
    description:
      "Google's latest state-of-the-art text-to-image model with enhanced quality and safety features",
    minWidth: 512,
    maxWidth: 2048,
    minHeight: 512,
    maxHeight: 2048,
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'],
    supportedFormats: ['png', 'jpg'],
    costPerImage: 0.018,
    defaultOptions: { outputFormat: 'jpg', safetyFilter: !0 },
  };
  replicate;
  constructor(replicate) {
    (super(), (this.replicate = replicate));
  }
  async generateImage(e) {
    this.validateOptions(e);
    const t = Date.now();
    let r = e.outputFormat || 'jpg';
    ('webp' !== r && 'jpeg' !== r) || (r = 'jpg');
    const o = {
      prompt: e.prompt,
      aspect_ratio: e.aspectRatio || '1:1',
      output_format: r,
      safety_filter_level:
        !1 === e.safetyFilter ? 'block_none' : 'block_medium_and_above',
      seed: e.seed,
    };
    try {
      const r = await this.replicate.run(this.modelId, { input: o });
      let a;
      a =
        r && 'object' == typeof r && 'url' in r && 'function' == typeof r.url
          ? r.url()
          : r instanceof ReadableStream
            ? await this.streamToUrl(r)
            : String(r);
      const i = (Date.now() - t) / 1e3,
        [n, s] = this.calculateDimensions(e.aspectRatio || '1:1');
      return {
        url: a,
        format: e.outputFormat || 'png',
        width: n,
        height: s,
        model: this.config.name,
        cost: this.config.costPerImage,
        generationTime: i,
      };
    } catch (t) {
      throw (
        logger_1.logger.error('Imagen image generation failed', {
          error: t instanceof Error ? t.message : String(t),
          stack: t instanceof Error ? t.stack : void 0,
          modelId: this.modelId,
          options: {
            prompt: e.prompt,
            aspectRatio: e.aspectRatio,
            safetyFilter: e.safetyFilter,
          },
        }),
        new Error(
          `Imagen generation failed: ${t instanceof Error ? t.message : String(t)}`
        )
      );
    }
  }
  calculateDimensions(e) {
    return (
      {
        '1:1': [1024, 1024],
        '16:9': [1536, 864],
        '9:16': [864, 1536],
        '4:3': [1024, 768],
        '3:4': [768, 1024],
        '3:2': [1536, 1024],
        '2:3': [1024, 1536],
      }[e] || [1024, 1024]
    );
  }
  async streamToUrl(e) {
    try {
      const t = e.getReader(),
        r = [];
      for (;;) {
        const { done: e, value: o } = await t.read();
        if (e) break;
        r.push(o);
      }
      const o = new Blob(r);
      return URL.createObjectURL(o);
    } catch (e) {
      throw (
        logger_1.logger.error(
          'Failed to convert stream to URL in ImagenModel',
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
  buildModelInput(e) {
    let t = e.outputFormat || 'jpg';
    return (
      ('webp' !== t && 'jpeg' !== t) || (t = 'jpg'),
      {
        prompt: e.prompt,
        aspect_ratio: e.aspectRatio || '1:1',
        output_format: t,
        safety_filter_level:
          !1 === e.safetyFilter ? 'block_none' : 'block_medium_and_above',
        seed: e.seed,
      }
    );
  }
  async extractImageUrl(e) {
    if (e && 'object' == typeof e && 'url' in e && 'function' == typeof e.url)
      return e.url();
    if (e instanceof ReadableStream) return await this.streamToUrl(e);
    if ('string' == typeof e) return e;
    if (Array.isArray(e) && e.length > 0) return e[0];
    throw new Error('Unexpected output format from Replicate');
  }
}
exports.ImagenModel = ImagenModel;

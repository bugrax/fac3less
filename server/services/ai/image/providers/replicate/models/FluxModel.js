'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.FluxModel = void 0));
const BaseReplicateImageModel_1 = require('./BaseReplicateImageModel'),
  logger_1 = require('../../../../../../utils/logger');
class FluxModel extends BaseReplicateImageModel_1.BaseReplicateImageModel {
  modelId =
    'black-forest-labs/flux-dev-lora:ae0d7d645446924cf1871e3ca8796e8318f72465d2b5af9323a835df93bf0917';
  config = {
    id: 'flux-dev-lora',
    name: 'Flux Dev LoRA',
    description:
      'Advanced image generation with LoRA support for custom styles and concepts',
    minWidth: 256,
    maxWidth: 1920,
    minHeight: 256,
    maxHeight: 1920,
    supportedAspectRatios: [
      '1:1',
      '16:9',
      '9:16',
      '4:3',
      '3:4',
      '21:9',
      '9:21',
    ],
    supportedFormats: ['webp', 'png', 'jpeg'],
    costPerImage: 0.025,
    defaultOptions: {
      guidanceScale: 3,
      numInferenceSteps: 28,
      outputFormat: 'webp',
    },
  };
  replicate;
  constructor(replicate) {
    (super(), (this.replicate = replicate));
  }
  async generateImage(e) {
    this.validateOptions(e);
    const t = Date.now(),
      r = {
        prompt: e.prompt,
        go_fast: !0,
        guidance: e.guidanceScale ?? this.config.defaultOptions.guidanceScale,
        lora_scale: e.loraScale ?? 1,
        megapixels: '1',
        num_outputs: 1,
        aspect_ratio: e.aspectRatio ?? '1:1',
        lora_weights: e.loraWeights,
        output_format: e.outputFormat ?? 'webp',
        output_quality: 80,
        prompt_strength: 0.8,
        num_inference_steps:
          e.numInferenceSteps ?? this.config.defaultOptions.numInferenceSteps,
        seed: e.seed,
      };
    try {
      const a = await this.replicate.run(this.modelId, { input: r });
      let o;
      o = Array.isArray(a)
        ? a[0] instanceof ReadableStream
          ? await this.streamToUrl(a[0])
          : a[0].toString()
        : a instanceof ReadableStream
          ? await this.streamToUrl(a)
          : String(a);
      const s = (Date.now() - t) / 1e3,
        [i, n] = this.calculateDimensions(e.aspectRatio ?? '1:1');
      return {
        url: o,
        format: e.outputFormat ?? 'webp',
        width: i,
        height: n,
        model: this.config.name,
        cost: this.config.costPerImage,
        generationTime: s,
      };
    } catch (t) {
      throw (
        logger_1.logger.error('Flux image generation failed', {
          error: t instanceof Error ? t.message : String(t),
          stack: t instanceof Error ? t.stack : void 0,
          modelId: this.modelId,
          options: {
            prompt: e.prompt,
            aspectRatio: e.aspectRatio,
            outputFormat: e.outputFormat,
          },
        }),
        new Error(
          `Flux generation failed: ${t instanceof Error ? t.message : String(t)}`
        )
      );
    }
  }
  calculateDimensions(e) {
    return (
      {
        '1:1': [1024, 1024],
        '16:9': [1920, 1080],
        '9:16': [1080, 1920],
        '4:3': [1024, 768],
        '3:4': [768, 1024],
        '21:9': [1920, 823],
        '9:21': [823, 1920],
      }[e] || [1024, 1024]
    );
  }
  async streamToUrl(e) {
    try {
      const t = e.getReader(),
        r = [];
      for (;;) {
        const { done: e, value: a } = await t.read();
        if (e) break;
        r.push(a);
      }
      const a = new Blob(r);
      return URL.createObjectURL(a);
    } catch (e) {
      throw (
        logger_1.logger.error('Failed to convert stream to URL', {
          error: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack : void 0,
        }),
        new Error(
          `Stream conversion failed: ${e instanceof Error ? e.message : String(e)}`
        )
      );
    }
  }
  buildModelInput(e) {
    return {
      prompt: e.prompt,
      go_fast: !0,
      guidance: e.guidanceScale ?? this.config.defaultOptions.guidanceScale,
      lora_scale: e.loraScale ?? 1,
      megapixels: '1',
      num_outputs: 1,
      aspect_ratio: e.aspectRatio ?? '1:1',
      lora_weights: e.loraWeights,
      output_format: e.outputFormat ?? 'webp',
      output_quality: 80,
      prompt_strength: 0.8,
      num_inference_steps:
        e.numInferenceSteps ?? this.config.defaultOptions.numInferenceSteps,
      seed: e.seed,
    };
  }
  async extractImageUrl(e) {
    if (Array.isArray(e) && e.length > 0)
      return 'object' == typeof e[0] && null !== e[0] && 'readable' in e[0]
        ? await this.streamToUrl(e[0])
        : e[0].toString();
    if ('object' == typeof e && null !== e && 'readable' in e)
      return await this.streamToUrl(e);
    if ('string' == typeof e) return e;
    throw new Error('Unexpected output format from Replicate');
  }
}
exports.FluxModel = FluxModel;

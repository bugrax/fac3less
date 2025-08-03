'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ImageGenerationNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  ReplicateImageClient_1 = require('../../ai/image/providers/replicate/ReplicateImageClient'),
  testMedia_1 = require('../../../../config/testMedia'),
  logger_1 = require('../../../utils/logger');
class ImageGenerationNode extends BaseNode_1.BaseNode {
  replicateClient = null;
  constructor(config) {
    (super({ ...config, type: 'image_generation' }),
      (this.replicateClient =
        new ReplicateImageClient_1.ReplicateImageClient()));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'imagePrompts',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of image prompt objects from ImagePromptNode',
          required: !0,
        },
        {
          name: 'model',
          type: DataTypes_1.DataType.TEXT,
          description:
            'Image generation model (seedream-3, flux-dev-lora, imagen-4)',
          required: !1,
          defaultValue: 'seedream-3',
        },
        {
          name: 'aspectRatio',
          type: DataTypes_1.DataType.TEXT,
          description: 'Aspect ratio for generated images',
          required: !1,
          defaultValue: '16:9',
        },
        {
          name: 'guidanceScale',
          type: DataTypes_1.DataType.NUMBER,
          description: 'How strongly to follow the prompt (1-20)',
          required: !1,
          defaultValue: 7.5,
        },
        {
          name: 'numInferenceSteps',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Number of inference steps',
          required: !1,
          defaultValue: 50,
        },
        {
          name: 'outputFormat',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output image format (png, webp, jpeg)',
          required: !1,
          defaultValue: 'webp',
        },
        {
          name: 'loraWeights',
          type: DataTypes_1.DataType.TEXT,
          description: 'LoRA weights URL',
          required: !1,
        },
        {
          name: 'loraScale',
          type: DataTypes_1.DataType.NUMBER,
          description: 'LoRA scale factor',
          required: !1,
          defaultValue: 1,
        },
        {
          name: 'safetyFilter',
          type: DataTypes_1.DataType.BOOLEAN,
          description: 'Enable safety filter',
          required: !1,
          defaultValue: !0,
        },
      ],
      outputs: [
        {
          name: 'images',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of generated images with metadata',
        },
        {
          name: 'totalCost',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Total cost of image generation',
        },
      ],
    };
  }
  async execute(e, t) {
    try {
      if (!e.imagePrompts || 0 === e.imagePrompts.length)
        throw new Error('Image prompts are required');
      this.updateProgress(10);
      const t = e.model ?? 'seedream-3',
        a = e.aspectRatio ?? '16:9',
        o = e.outputFormat ?? 'webp';
      if ((0, testMedia_1.isTestMode)()) {
        logger_1.logger.info(
          '[ImageGenerationNode] TEST MODE - Returning mock images'
        );
        const t = e.imagePrompts.map((e, t) => {
          const [r, i] = '16:9' === a ? [1920, 1080] : [1080, 1920];
          return {
            sectionId: e.sectionId,
            image: {
              path: `https://via.placeholder.com/${r}x${i}?text=Test+Image+${t + 1}`,
              mimeType: `image/${o}`,
              size: 1e5,
              width: r,
              height: i,
              format: o,
              metadata: {
                sectionId: e.sectionId,
                model: 'test-mode',
                prompt: e.prompt,
              },
            },
            prompt: e.prompt,
            duration: e.duration,
          };
        });
        return (
          this.updateProgress(100),
          {
            success: !0,
            data: { images: t, totalCost: 0 },
            metadata: {
              nodeId: this.config.id,
              model: 'test-mode',
              imageCount: t.length,
              aspectRatio: a,
            },
          }
        );
      }
      const r = await this.submitImageJobs(e.imagePrompts, t, a, o, e),
        { images: i, totalCost: s } = await this.pollForImageCompletion(
          r,
          a,
          o,
          t
        );
      return (
        this.updateProgress(100),
        logger_1.logger.info(
          `🖼️ [ImageGenerationNode] Completed with model ${t}:`,
          {
            imagesCount: i.length,
            totalCost: s,
            images: i.map((e, t) => ({
              index: t,
              sectionId: e.sectionId,
              hasImage: !!e.image,
              imagePath: e.image?.path,
              imageFormat: e.image?.format,
              imageDimensions: e.image
                ? `${e.image.width}x${e.image.height}`
                : 'unknown',
            })),
          }
        ),
        {
          success: !0,
          data: { images: i, totalCost: s },
          metadata: {
            nodeId: this.config.id,
            model: t,
            imageCount: i.length,
            aspectRatio: a,
          },
        }
      );
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to generate images',
      };
    }
  }
  async submitImageJobs(e, t, a, o, r) {
    const i = [],
      s = 20 / e.length;
    for (let n = 0; n < e.length; n++) {
      const m = e[n];
      try {
        const e = {
          prompt: m.prompt,
          aspectRatio: a,
          guidanceScale: r.guidanceScale,
          numInferenceSteps: r.numInferenceSteps,
          outputFormat: o,
          loraWeights: r.loraWeights,
          loraScale: r.loraScale,
          safetyFilter: r.safetyFilter,
        };
        if (!this.replicateClient)
          throw new Error(
            'ReplicateClient not initialized. Check API token configuration.'
          );
        const p = await this.replicateClient.submitImageJob(t, e);
        (logger_1.logger.debug(
          `[ImageGenerationNode] Submitted job for section ${m.sectionId}:`,
          { jobId: p.id, status: p.status, model: t }
        ),
          i.push({
            sectionId: m.sectionId,
            jobId: p.id,
            promptData: m,
            modelType: t,
          }),
          this.updateProgress(10 + (n + 1) * s));
      } catch (e) {
        throw (
          logger_1.logger.error(
            `[ImageGenerationNode] Failed to submit job for section ${m.sectionId}:`,
            e
          ),
          e
        );
      }
    }
    return i;
  }
  async pollForImageCompletion(e, t, a, o) {
    const r = [];
    let i = 0;
    const s = Date.now(),
      n = new Map(),
      m = [...e];
    for (; m.length > 0 && Date.now() - s < 18e4; ) {
      const s = [];
      for (const e of m) {
        const m = await this.processJobStatus(e, t, a, o, n);
        if (m.completed && m.imageData)
          (r.push(m.imageData), (i += m.cost || 0));
        else {
          if (!m.retry) throw new Error(m.error ?? 'Image generation failed');
          s.push(e);
        }
      }
      const p = 30 + (r.length / e.length) * 60;
      (this.updateProgress(p),
        (m.length = 0),
        m.push(...s),
        m.length > 0 && (await new Promise(e => setTimeout(e, 3e3))));
    }
    if (m.length > 0)
      throw new Error(`Image generation timed out for ${m.length} images`);
    return { images: r, totalCost: i };
  }
  async processJobStatus(e, t, a, o, r) {
    try {
      logger_1.logger.debug(
        `[ImageGenerationNode] Checking job status for ${e.jobId} (model: ${e.modelType})`
      );
      const r = await this.replicateClient?.checkJobStatus(
        e.modelType,
        e.jobId
      );
      if (
        (logger_1.logger.debug(
          `[ImageGenerationNode] Job ${e.jobId} status result:`,
          { status: r?.status, hasUrl: !!r?.url, modelType: e.modelType }
        ),
        !r)
      )
        return { completed: !1, retry: !0 };
      if ('completed' === r.status && r.url) {
        const i = this.getDimensionsFromAspectRatio(t),
          s = {
            path: r.url,
            mimeType: `image/${a}`,
            size: 0,
            width: i.width,
            height: i.height,
            format: a,
            metadata: {
              prompt: e.promptData.prompt,
              negativePrompt: e.promptData.negativePrompt,
              model: o,
              sectionId: e.promptData.sectionId,
            },
          };
        return {
          completed: !0,
          retry: !1,
          imageData: {
            sectionId: e.promptData.sectionId,
            image: s,
            prompt: e.promptData.prompt,
            duration: e.promptData.duration,
          },
          cost: this.replicateClient?.calculateTotalCost(e.modelType, 1) ?? 0,
        };
      }
      return 'failed' === r.status
        ? (logger_1.logger.error(
            `[ImageGenerationNode] Image generation failed for section ${e.sectionId}: ${r.error}`
          ),
          {
            completed: !1,
            retry: !1,
            error: r.error ?? 'Image generation failed',
          })
        : { completed: !1, retry: !0 };
    } catch (t) {
      logger_1.logger.error(
        `[ImageGenerationNode] Error checking status for job ${e.jobId}:`,
        t
      );
      const a = r.get(e.jobId) ?? 0;
      return a < 3
        ? (r.set(e.jobId, a + 1), { completed: !1, retry: !0 })
        : {
            completed: !1,
            retry: !1,
            error: `Failed to check image status after 3 retries: ${t instanceof Error ? t.message : 'Unknown error'}`,
          };
    }
  }
  getDimensionsFromAspectRatio(e) {
    const t = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1024, height: 1024 },
      '4:3': { width: 1024, height: 768 },
      '3:4': { width: 768, height: 1024 },
    };
    return t[e] || t['16:9'];
  }
  validateCustom(e) {
    const t = e;
    if (!t.imagePrompts || !Array.isArray(t.imagePrompts))
      return 'Image prompts array is required';
    if (0 === t.imagePrompts.length)
      return 'At least one image prompt is required';
    for (let e = 0; e < t.imagePrompts.length; e++) {
      const a = t.imagePrompts[e];
      if (!a.prompt || !a.sectionId)
        return `Image prompt at index ${e} is missing required fields (prompt, sectionId)`;
    }
    if (t.model) {
      const e = ['seedream-3', 'flux-dev-lora', 'imagen-4'];
      if (!e.includes(t.model))
        return `Invalid model. Must be one of: ${e.join(', ')}`;
    }
    if (t.outputFormat) {
      const e = ['png', 'webp', 'jpeg'];
      if (!e.includes(t.outputFormat) && !(0, testMedia_1.isTestMode)())
        return `Invalid output format. Must be one of: ${e.join(', ')}`;
    }
    return null;
  }
}
exports.ImageGenerationNode = ImageGenerationNode;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VideoGenerationNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  ReplicateClient_1 = require('../../ai/video/providers/replicate/ReplicateClient'),
  ai_1 = require('../../../../config/ai/index'),
  logger_1 = require('../../../utils/logger'),
  fs_1 = require('fs'),
  VideoParameters_1 = require('../utils/video/VideoParameters'),
  VideoResultBuilder_1 = require('../utils/video/VideoResultBuilder'),
  VideoValidation_1 = require('../utils/video/VideoValidation'),
  VideoJobManager_1 = require('../utils/video/VideoJobManager'),
  testMedia_1 = require('../../../../config/testMedia');
class VideoGenerationNode extends BaseNode_1.BaseNode {
  jobManager = null;
  outputDir;
  currentInput;
  constructor(config) {
    super({ ...config, type: 'video_generation' });
    const e = ai_1.replicateConfig.apiToken || process.env.REPLICATE_API_TOKEN;
    logger_1.logger.debug(
      '[VideoGenerationNode] Initializing with API token: ' +
        (e ? e.substring(0, 10) + '...' : 'NOT FOUND')
    );
    const t = new ReplicateClient_1.ReplicateClient({ apiKey: e || void 0 });
    ((this.jobManager = new VideoJobManager_1.VideoJobManager(t)),
      (this.outputDir = process.env.VIDEO_OUTPUT_DIR || './output/videos'));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'images',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of generated images with metadata',
          required: !0,
        },
        {
          name: 'model',
          type: DataTypes_1.DataType.TEXT,
          description: 'Video generation model',
          required: !1,
          defaultValue: 'bytedance/seedance-1-lite',
        },
        {
          name: 'mode',
          type: DataTypes_1.DataType.TEXT,
          description: 'Generation mode (standard or pro)',
          required: !1,
          defaultValue: 'standard',
        },
        {
          name: 'resolution',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output video resolution',
          required: !1,
          defaultValue: '1920x1080',
        },
        {
          name: 'aspectRatio',
          type: DataTypes_1.DataType.TEXT,
          description: 'Video aspect ratio',
          required: !1,
          defaultValue: '16:9',
        },
        {
          name: 'fps',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Frames per second',
          required: !1,
          defaultValue: 24,
        },
        {
          name: 'outputPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Custom output path for videos',
          required: !1,
        },
        {
          name: 'videoPrompt',
          type: DataTypes_1.DataType.TEXT,
          description: 'Universal prompt for video generation motion',
          required: !1,
          defaultValue:
            'subtle motion, gentle movement, smooth animation, cinematic quality',
        },
        {
          name: 'visualStyle',
          type: DataTypes_1.DataType.TEXT,
          description: 'Visual style for motion adaptation',
          required: !1,
        },
      ],
      outputs: [
        {
          name: 'videos',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of generated video segments',
        },
        {
          name: 'totalDuration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Total duration of all videos in seconds',
        },
        {
          name: 'totalCost',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Total cost of video generation',
        },
      ],
    };
  }
  async execute(e, t) {
    logger_1.logger.debug(
      '🚨🚨🚨 [VideoGenerationNode] EXECUTE CALLED! 🚨🚨🚨'
    );
    try {
      if (
        ((this.currentInput = e),
        this.logInputDetails(e),
        VideoValidation_1.VideoValidation.validateImageInputs(e.images),
        logger_1.logger.info(
          `[VideoGenerationNode] Processing ${e.images.length} images into videos`
        ),
        logger_1.logger.debug('[VideoGenerationNode] Image details:', {
          count: e.images.length,
          images: e.images.map((e, t) => ({
            index: t,
            sectionId: e.sectionId,
            hasImage: !!e.image,
            imagePath: e.image?.path,
            duration: e.duration,
          })),
        }),
        this.updateProgress(10),
        (0, testMedia_1.isTestMode)())
      ) {
        logger_1.logger.info(
          '[VideoGenerationNode] TEST MODE - Returning mock videos'
        );
        const t = e.images.map(e => {
            const t = (0, testMedia_1.getNextTestFile)('video');
            return {
              sectionId: e.sectionId,
              video: {
                path: t,
                mimeType: 'video/mp4',
                size: 1e6,
                duration: e.duration,
                width: 1920,
                height: 1080,
                fps: 24,
                format: 'mp4',
                metadata: {
                  sectionId: e.sectionId,
                  model: 'test-mode',
                  resolution: '1920x1080',
                },
              },
              duration: e.duration,
              status: 'completed',
            };
          }),
          o = t.reduce((e, t) => e + t.duration, 0);
        return (
          this.updateProgress(100),
          {
            success: !0,
            data: { videos: t, totalDuration: o, totalCost: 0 },
            metadata: {
              nodeId: this.config.id,
              model: 'test-mode',
              successCount: t.length,
              failureCount: 0,
            },
          }
        );
      }
      (0, testMedia_1.isTestMode)() ||
        (await fs_1.promises.mkdir(this.outputDir, { recursive: !0 }));
      const o = VideoParameters_1.VideoParametersBuilder.build(e),
        i = [];
      let a = 0;
      const s = await this.submitAllJobs(e.images, o, i);
      ((a = s.totalCost),
        s.jobs.length > 0 && (await this.pollForCompletion(s.jobs, i, o, t)),
        this.handleTimedOutJobs(s.jobs, i, o));
      const r = i.reduce((e, t) => e + t.duration, 0),
        n = i.filter(e => 'completed' === e.status).length,
        d = i.filter(e => 'failed' === e.status).length;
      return (
        this.updateProgress(100),
        {
          success: !0,
          data: { videos: i, totalDuration: r, totalCost: a },
          metadata: {
            nodeId: this.config.id,
            model: o.model,
            successCount: n,
            failureCount: d,
          },
        }
      );
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to generate videos',
      };
    }
  }
  logInputDetails(e) {
    (logger_1.logger.debug('🎬 [VideoGenerationNode] Received input:', {
      hasImages: !!e.images,
      imagesLength: e.images?.length,
      model: e.model,
      inputKeys: Object.keys(e),
    }),
      e.images &&
        logger_1.logger.debug(
          '🎬 [VideoGenerationNode] Image details:',
          e.images.map((e, t) => ({
            index: t,
            sectionId: e.sectionId,
            hasImage: !!e.image,
            imagePath: e.image?.path,
            imageKeys: e.image ? Object.keys(e.image) : [],
            duration: e.duration,
          }))
        ));
  }
  async submitAllJobs(e, t, o) {
    const i = [];
    let a = 0;
    logger_1.logger.debug(
      '[VideoGenerationNode] Phase 1: Submitting video generation jobs...'
    );
    const s = 20 / e.length;
    for (let r = 0; r < e.length; r++) {
      const n = e[r];
      logger_1.logger.debug(
        `[VideoGenerationNode] Submitting job ${r + 1}/${e.length} for section ${n.sectionId}`
      );
      try {
        const e = 0 === r,
          s = await this.jobManager.submitJob(
            n,
            t,
            e,
            this.currentInput?.visualStyle
          );
        s
          ? (i.push({ sectionId: n.sectionId, jobId: s.jobId, imageData: n }),
            (a += s.cost))
          : o.push(
              VideoResultBuilder_1.VideoResultBuilder.createFailedResult(
                n.sectionId,
                n,
                t.resolution,
                t.fps,
                'Failed to submit video generation job'
              )
            );
      } catch (e) {
        (logger_1.logger.error(
          `[VideoGenerationNode] Failed to submit job for section ${n.sectionId}:`,
          e
        ),
          o.push(
            VideoResultBuilder_1.VideoResultBuilder.createFailedResult(
              n.sectionId,
              n,
              t.resolution,
              t.fps,
              e instanceof Error ? e.message : 'Unknown error'
            )
          ));
      }
      this.updateProgress(10 + (r + 1) * s);
    }
    return { jobs: i, totalCost: a };
  }
  async pollForCompletion(e, t, o, i) {
    logger_1.logger.debug(
      '[VideoGenerationNode] Phase 2: Polling for video completion...',
      {
        jobsCount: e.length,
        jobs: e.map(e => ({ sectionId: e.sectionId, jobId: e.jobId })),
      }
    );
    const a = Date.now();
    for (
      await this.waitBeforePolling();
      e.length > 0 &&
      Date.now() - a < 6e5 &&
      !this.handleCancellation(i, e, t, o);

    ) {
      const i = await this.processJobBatch(e, t, o);
      (this.updatePollingProgress(t, i, 30, 60),
        (e.length = 0),
        e.push(...i),
        e.length > 0 &&
          (logger_1.logger.debug(
            `[VideoGenerationNode] Waiting for ${e.length} videos to complete...`
          ),
          await new Promise(e => setTimeout(e, 5e3))));
    }
  }
  async waitBeforePolling() {
    const e = 'test' === process.env.NODE_ENV ? 0 : 3e3;
    e > 0 &&
      (logger_1.logger.debug(
        `[VideoGenerationNode] Waiting ${e / 1e3} seconds before starting to poll...`
      ),
      await new Promise(t => setTimeout(t, e)));
  }
  handleCancellation(e, t, o, i) {
    if (e.signal?.aborted) {
      logger_1.logger.info(
        '[VideoGenerationNode] Polling cancelled for workflow'
      );
      for (const e of t)
        o.push(
          VideoResultBuilder_1.VideoResultBuilder.createFailedResult(
            e.sectionId,
            e.imageData,
            i.resolution,
            i.fps,
            'Video generation cancelled'
          )
        );
      return !0;
    }
    return !1;
  }
  async processJobBatch(e, t, o) {
    const i = [];
    for (const a of e) {
      const e = await this.jobManager.checkJobStatus(a);
      await this.handleJobStatus(a, e, t, o, i);
    }
    return i;
  }
  async handleJobStatus(e, t, o, i, a) {
    if ('completed' === t) {
      const t = await this.jobManager.getVideoUrl(e.jobId);
      t &&
        o.push(
          VideoResultBuilder_1.VideoResultBuilder.createSuccessfulResult(
            e.sectionId,
            e.imageData,
            t,
            i
          )
        );
    } else
      'failed' === t
        ? o.push(
            VideoResultBuilder_1.VideoResultBuilder.createFailedResult(
              e.sectionId,
              e.imageData,
              i.resolution,
              i.fps,
              'Video generation failed'
            )
          )
        : 'processing' === t
          ? a.push(e)
          : o.push(
              VideoResultBuilder_1.VideoResultBuilder.createFailedResult(
                e.sectionId,
                e.imageData,
                i.resolution,
                i.fps,
                'Failed to check video status after 3 retries'
              )
            );
  }
  updatePollingProgress(e, t, o, i) {
    const a = o + (e.length / (e.length + t.length)) * i;
    this.updateProgress(a);
  }
  handleTimedOutJobs(e, t, o) {
    for (const i of e)
      t.push(
        VideoResultBuilder_1.VideoResultBuilder.createFailedResult(
          i.sectionId,
          i.imageData,
          o.resolution,
          o.fps,
          'Video generation timed out'
        )
      );
  }
  validateCustom(e) {
    return VideoValidation_1.VideoValidation.validateNodeInput(e);
  }
  async cleanup() {
    try {
      (this.jobManager && this.jobManager.clearRetries(),
        await super.cleanup());
    } catch (e) {
      logger_1.logger.error(
        `Failed to cleanup VideoGenerationNode ${this.config.id}:`,
        e
      );
    }
  }
}
exports.VideoGenerationNode = VideoGenerationNode;

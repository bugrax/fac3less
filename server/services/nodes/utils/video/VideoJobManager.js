'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VideoJobManager = void 0));
const VideoValidation_1 = require('./VideoValidation'),
  VideoPromptEnhancer_1 = require('./VideoPromptEnhancer'),
  logger_1 = require('../../../../utils/logger'),
  testMedia_1 = require('../../../../../config/testMedia');
class VideoJobManager {
  videoClient;
  jobRetries = new Map();
  constructor(e) {
    this.videoClient = e;
  }
  async submitJob(e, o, t = !1, i) {
    const r = e.sectionId;
    let a = 0;
    for (; a < 3; ) {
      try {
        if ((0, testMedia_1.isTestMode)())
          return (
            logger_1.logger.info(
              `[VideoJobManager] TEST MODE - Using predefined video for section ${r}`
            ),
            { jobId: `test-job-${r}`, cost: 0 }
          );
        if (a > 0) {
          const e = 1e3 * Math.pow(2, a - 1);
          (logger_1.logger.info(
            `[VideoJobManager] Retrying job submission for section ${r}, attempt ${a + 1}/3, waiting ${e}ms`
          ),
            await new Promise(o => setTimeout(o, e)));
        }
        (logger_1.logger.debug(
          `[VideoJobManager] Image data for section ${r}:`,
          {
            path: e.image.path,
            hasPath: !!e.image.path,
            mimeType: e.image.mimeType,
            width: e.image.width,
            height: e.image.height,
          }
        ),
          VideoValidation_1.VideoValidation.validateImageUrl(e),
          VideoValidation_1.VideoValidation.validateVideoClient(
            this.videoClient
          ));
        const s = VideoPromptEnhancer_1.VideoPromptEnhancer.enhance(
          o.videoPrompt,
          t,
          e,
          i
        );
        (t &&
          logger_1.logger.info(
            '[VideoJobManager] 🎯 Using enhanced hook motion for first video:',
            {
              sectionId: r,
              originalPrompt: o.videoPrompt.substring(0, 50) + '...',
              enhancedPrompt: s.substring(0, 100) + '...',
              visualStyle: i,
            }
          ),
          logger_1.logger.info(
            '[VideoJobManager] Submitting video generation job:',
            {
              model: o.model,
              sectionId: r,
              imagePath: e.image.path,
              duration: e.duration,
              resolution: o.resolution,
              aspectRatio: o.aspectRatio,
              attempt: a + 1,
            }
          ));
        const d = await this.videoClient.generateVideo({
          model: o.model,
          prompt: s,
          duration: e.duration,
          startImage: e.image.path,
          mode: o.mode,
          resolution: o.resolution,
          aspectRatio: o.aspectRatio,
        });
        if (
          (logger_1.logger.info(
            `[VideoJobManager] generateVideo API response for section ${r}:`,
            {
              success: d.success,
              hasData: !!d.data,
              jobId: d.data?.id,
              status: d.data?.status,
              error: d.error,
              metadata: d.metadata,
              attempt: a + 1,
            }
          ),
          d.success && d.data)
        )
          return (
            logger_1.logger.debug(
              '[VideoJobManager] Job submitted successfully:',
              {
                sectionId: r,
                jobId: d.data.id,
                status: d.data.status,
                cost: d.metadata?.cost,
              }
            ),
            { jobId: d.data.id, cost: d.metadata?.cost || 0 }
          );
        if (
          (logger_1.logger.error(
            `[VideoJobManager] Job submission FAILED for section ${r}, attempt ${a + 1}/3:`,
            { error: d.error, fullResult: d }
          ),
          2 === a)
        )
          return null;
      } catch (e) {
        if (
          (logger_1.logger.error(
            `[VideoJobManager] Exception during job submission for section ${r}, attempt ${a + 1}/3:`,
            e
          ),
          2 === a)
        )
          throw e;
      }
      a++;
    }
    return null;
  }
  async checkJobStatus(e) {
    try {
      if ((0, testMedia_1.isTestMode)() && e.jobId.startsWith('test-job-'))
        return (
          logger_1.logger.info(
            `[VideoJobManager] TEST MODE - Returning test video for job ${e.jobId}`
          ),
          'completed'
        );
      const o = await this.videoClient.checkStatus(e.jobId);
      if (
        (logger_1.logger.debug(
          `[VideoJobManager] checkStatus response for job ${e.jobId}:`,
          {
            success: o.success,
            hasData: !!o.data,
            status: o.data?.status,
            hasVideoUrl: !!o.data?.videoUrl,
            videoUrl: o.data?.videoUrl,
            progress: o.data?.progress,
            error: o.data?.error || o.error,
          }
        ),
        o.success && o.data)
      ) {
        const t = o.data;
        return 'completed' === t.status && t.videoUrl
          ? (logger_1.logger.debug(
              `[VideoJobManager] Video completed for section ${e.sectionId}:`,
              { videoUrl: t.videoUrl, jobId: e.jobId }
            ),
            'completed')
          : 'failed' === t.status
            ? 'failed'
            : (logger_1.logger.debug(
                `[VideoJobManager] Job ${e.jobId} status: ${t.status}, progress: ${t.progress}%`
              ),
              'processing');
      }
      {
        const o = this.jobRetries.get(e.jobId) || 0;
        return o < 3
          ? (this.jobRetries.set(e.jobId, o + 1),
            logger_1.logger.warn(
              `[VideoJobManager] Status check failed for job ${e.jobId}, retry ${o + 1}/3`
            ),
            'processing')
          : 'failed';
      }
    } catch (o) {
      logger_1.logger.error(
        `[VideoJobManager] Error checking status for job ${e.jobId}:`,
        o
      );
      const t = this.jobRetries.get(e.jobId) || 0;
      return t < 3
        ? (this.jobRetries.set(e.jobId, t + 1), 'processing')
        : 'failed';
    }
  }
  async getVideoUrl(e) {
    if ((0, testMedia_1.isTestMode)() && e.startsWith('test-job-')) {
      const e = (0, testMedia_1.getNextTestFile)('video');
      return (
        logger_1.logger.info(
          `[VideoJobManager] TEST MODE - Using test video: ${e}`
        ),
        e
      );
    }
    const o = await this.videoClient.checkStatus(e);
    return o.success && o.data?.videoUrl ? o.data.videoUrl : null;
  }
  clearRetries() {
    this.jobRetries.clear();
  }
}
exports.VideoJobManager = VideoJobManager;

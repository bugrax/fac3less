'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.generationService = void 0));
const openrouter_service_1 = require('./openrouter.service'),
  logger_1 = require('../server/utils/logger');
class GenerationService {
  generations = new Map();
  async generateVideo(e) {
    const t = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      r = {
        id: t,
        status: 'pending',
        createdAt: new Date(),
        request: e,
        progress: 0,
        estimatedCompletionTime: new Date(Date.now() + 3e5),
      };
    return (this.generations.set(t, r), this.simulateProcessing(t), r);
  }
  async getGenerationStatus(e) {
    return this.generations.get(e) || null;
  }
  async simulateProcessing(e) {
    const t = this.generations.get(e);
    if (t)
      try {
        ((t.status = 'processing'),
          (t.progress = 10),
          (t.currentStep = 'Initializing...'),
          (t.progress = 25),
          (t.currentStep = 'Generating script...'));
        const r = await openrouter_service_1.openRouterService.generateScript({
          topic: t.request.prompt,
          duration: t.request.duration || 60,
          style: t.request.style || 'educational',
          additionalContext: t.request.settings?.context,
        });
        ((t.script = r),
          (t.progress = 40),
          (t.currentStep = 'Script generated successfully'));
        const s = [
          { progress: 50, step: 'Creating audio narration...' },
          { progress: 65, step: 'Generating visual assets...' },
          { progress: 80, step: 'Composing video scenes...' },
          { progress: 90, step: 'Adding captions and effects...' },
          { progress: 95, step: 'Finalizing video...' },
        ];
        for (const e of s)
          (await new Promise(e => setTimeout(e, 1500)),
            (t.progress = e.progress),
            (t.currentStep = e.step));
        ((t.status = 'completed'),
          (t.progress = 100),
          (t.currentStep = 'Video generation complete!'),
          (t.resultUrl = `/mock/videos/${e}.mp4`));
      } catch (r) {
        (logger_1.logger.error('Video generation failed', {
          generationId: e,
          error: r instanceof Error ? r.message : 'Unknown error',
          stack: r instanceof Error ? r.stack : void 0,
          request: {
            prompt: t.request.prompt,
            model: t.request.model,
            duration: t.request.duration,
            style: t.request.style,
          },
        }),
          (t.status = 'failed'),
          (t.error = r instanceof Error ? r.message : 'Unknown error occurred'),
          (t.currentStep = 'Generation failed'));
      }
  }
  async estimateGeneration(e) {
    const t = e.duration || 60;
    return { cost: 0.1 + (t / 60) * 0.5, duration: 2 * t };
  }
  async cleanupCompletedJob(e) {
    const t = this.generations.get(e);
    t && 'completed' === t.status && this.generations.delete(e);
  }
  cleanupOldJobs() {
    const e = Date.now();
    for (const [t, r] of this.generations.entries())
      if ('completed' === r.status || 'failed' === r.status) {
        e - r.createdAt.getTime() > 36e5 && this.generations.delete(t);
      }
  }
}
exports.generationService = new GenerationService();

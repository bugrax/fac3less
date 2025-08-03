'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ProgressTracker = void 0));
const workflow_sse_routes_1 = require('../../../api/routes/workflow.sse.routes'),
  logger_1 = require('../../../utils/logger');
class ProgressTracker {
  progressUpdateQueue = [];
  progressUpdateTimer = null;
  batchInterval = 50;
  createLightweightOutput(e, t) {
    if (t.includes('image') && 'images' in e) {
      const t = {
        images: e.images.map(e => ({
          sectionId: e.sectionId,
          image: { path: e.image.path },
          prompt: e.prompt ? e.prompt.substring(0, 100) : '',
          duration: e.duration,
        })),
      };
      return ('imageCount' in e && (t.imageCount = e.imageCount), t);
    }
    if (t.includes('video') && 'videos' in e) {
      const t = {
        videos: e.videos.map(e => ({
          sectionId: e.sectionId,
          video: e.video ? { path: e.video.path } : null,
          prompt: e.prompt ? e.prompt.substring(0, 100) : '',
          duration: e.duration,
          status: e.status,
        })),
      };
      return ('videoCount' in e && (t.videoCount = e.videoCount), t);
    }
    if (t.includes('audio') && 'audioFiles' in e) {
      const t = { audioFiles: e.audioFiles.map(e => ({ path: e.path })) };
      return ('audioCount' in e && (t.audioCount = e.audioCount), t);
    }
    if (t.includes('editing') && 'editedVideo' in e) {
      return { editedVideo: { path: e.editedVideo.path } };
    }
    if ('string' == typeof e) {
      const t = e;
      return t.length > 1e3 ? t.substring(0, 1e3) + '...' : t;
    }
    if (e && 'object' == typeof e && 'script' in e) {
      const t = e;
      return {
        ...t,
        script:
          'string' == typeof t.script && t.script.length > 1e3
            ? t.script.substring(0, 1e3) + '...'
            : t.script,
      };
    }
    return e;
  }
  updateOverallProgress(e, t) {
    const o = Array.from(e.nodeStatuses.values()).reduce(
      (e, t) => e + t.progress,
      0
    );
    ((e.progress = o / e.nodeStatuses.size),
      logger_1.logger.debug(
        '[WorkflowExecutor] updateOverallProgress called:',
        {
          executionId: e.executionId,
          overallProgress: e.progress.toFixed(1),
          nodeCount: e.nodeStatuses.size,
          hasOnProgress: !!t.onProgress,
        }
      ),
      t.onProgress && t.onProgress(e.executionId, e.progress, e.nodeStatuses));
  }
  sendProgressUpdate(e, t, o) {
    this.batchProgressUpdate({
      executionId: e,
      progress: t,
      nodeStatuses: o,
      timestamp: Date.now(),
    });
  }
  batchProgressUpdate(e) {
    (this.progressUpdateQueue.push(e),
      this.progressUpdateTimer ||
        (this.progressUpdateTimer = setTimeout(() => {
          (this.flushProgressUpdates(), (this.progressUpdateTimer = null));
        }, this.batchInterval)));
  }
  flushProgressUpdates() {
    if (0 === this.progressUpdateQueue.length) return;
    const e = new Map();
    for (const t of this.progressUpdateQueue) {
      const o = e.get(t.executionId);
      (!o || t.timestamp > o.timestamp) && e.set(t.executionId, t);
    }
    for (const t of e.values()) {
      const e = new Map();
      for (const [o, s] of t.nodeStatuses)
        e.set(o, {
          nodeId: s.nodeId,
          state: s.state,
          progress: s.progress,
          startTime: s.startTime,
          endTime: s.endTime,
          result: s.result,
          error: s.error,
        });
      (0, workflow_sse_routes_1.sendProgressUpdate)(
        t.executionId,
        t.progress,
        e
      );
    }
    this.progressUpdateQueue = [];
  }
  flushProgressUpdatesForTesting() {
    (this.progressUpdateTimer &&
      (clearTimeout(this.progressUpdateTimer),
      (this.progressUpdateTimer = null)),
      this.flushProgressUpdates());
  }
  sendExecutionComplete(e, t, o, s) {
    'completed' === t && s
      ? (0, workflow_sse_routes_1.sendExecutionComplete)(e, {
          status: 'completed',
          nodeResults: Array.from(s.entries()).map(([e, t]) => ({
            nodeId: e,
            success: t.success,
            error: t.error,
            metadata: t.metadata,
          })),
        })
      : (0, workflow_sse_routes_1.sendExecutionComplete)(e, {
          status: t,
          error: o,
        });
  }
  sendNodeOutput(e, t, o, s) {
    const r = this.determineOutputType(o);
    if (
      (logger_1.logger.debug(
        `[WORKFLOW] Node ${t} completed - type: ${o}, outputType: ${r}`
      ),
      r && s)
    ) {
      const i = this.createLightweightOutput(s, o);
      if (o.includes('image') && 'images' in s) {
        const e = s.images;
        logger_1.logger.debug(
          `🖼️ [WORKFLOW] Image generation output for ${t}:`,
          {
            imagesCount: e?.length || 0,
            allImageUrls: e?.map(e => {
              const t = e.image;
              return t?.path;
            }),
          }
        );
      } else if (o.includes('video') && 'videos' in s) {
        const e = s.videos;
        logger_1.logger.debug(
          `🎬 [WORKFLOW] Video generation output for ${t}:`,
          {
            videosCount: e?.length || 0,
            completedCount:
              e?.filter(e => 'completed' === e.status)?.length || 0,
          }
        );
      } else if (o.includes('audio') && 'audioFiles' in s) {
        const e = s.audioFiles;
        logger_1.logger.debug(
          `🔊 [WORKFLOW] Audio generation output for ${t}:`,
          { audioCount: e?.length || 0 }
        );
      }
      (logger_1.logger.debug(
        `[WORKFLOW] Sending lightweight node output for ${t}, type: ${r}`
      ),
        (0, workflow_sse_routes_1.sendNodeOutput)(e, t, r, i, 0));
    } else
      logger_1.logger.debug(
        `[WORKFLOW] Not sending output for ${t} - outputType: ${r}, hasData: ${!!s}`
      );
  }
  determineOutputType(e) {
    const t = {
      script: 'text',
      script_generation: 'text',
      script_generator: 'text',
      imagePrompt: 'text',
      image_prompt: 'text',
      imageGeneration: 'image',
      image_generation: 'image',
      videoGeneration: 'video',
      video_generation: 'video',
      audioGeneration: 'audio',
      audio_generation: 'audio',
      background_audio_generation: 'audio',
      captionGeneration: 'text',
      caption_generation: 'text',
      editing: 'video',
      video_editing: 'video',
      userPrompt: '',
      final_output: '',
    }[e];
    return void 0 !== t ? t : null;
  }
}
exports.ProgressTracker = ProgressTracker;

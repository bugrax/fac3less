'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ExecutionStrategies = void 0));
const nodes_1 = require('../../nodes/index'),
  logger_1 = require('../../../utils/logger'),
  MemoryProfiler_1 = require('../../utils/MemoryProfiler');
class ExecutionStrategies {
  nodeIOManager;
  progressTracker;
  dependencyLevelCache = new Map();
  memoryProfiler = MemoryProfiler_1.MemoryProfiler.getInstance();
  constructor(e, t) {
    ((this.nodeIOManager = e), (this.progressTracker = t));
  }
  isLargeMediaType(e) {
    return [
      'imageGeneration',
      'image_generation',
      'videoGeneration',
      'video_generation',
      'audioGeneration',
      'audio_generation',
      'background_audio_generation',
    ].includes(e);
  }
  createCompactOutput(e, t) {
    if (t.includes('image') && 'images' in e) {
      const t = {
        images: e.images.map(e => ({
          sectionId: e.sectionId,
          image: {
            path: e.image.path,
            format: e.image.format || 'jpeg',
            resolution: e.image.resolution || '1024x1024',
            ...(e.image.metadata && { metadata: e.image.metadata }),
          },
          prompt: e.prompt || '',
          duration: e.duration,
        })),
      };
      return (
        Object.keys(e).forEach(r => {
          (('images' !== r && 'object' != typeof e[r]) ||
            'transcripts' === r) &&
            (t[r] = e[r]);
        }),
        t
      );
    }
    if (t.includes('video') && 'videos' in e) {
      const t = {
        videos: e.videos.map(e => ({
          sectionId: e.sectionId,
          video: {
            path: e.video.path,
            duration: e.video.duration || e.duration || 0,
            format: e.video.format || 'mp4',
            resolution: e.video.resolution || '720p',
            ...(e.video.metadata && { metadata: e.video.metadata }),
          },
          prompt: e.prompt || '',
          duration: e.duration,
          status: e.status,
        })),
      };
      return (
        Object.keys(e).forEach(r => {
          'videos' === r ||
            ('object' == typeof e[r] && 'transcripts' !== r) ||
            (t[r] = e[r]);
        }),
        t
      );
    }
    if (t.includes('audio') && 'audioFiles' in e) {
      const t = {
        audioFiles: e.audioFiles.map(e => ({
          path: e.path,
          duration: e.duration || 0,
          format: e.format || 'mp3',
          sampleRate: e.sampleRate || 44100,
          ...(e.metadata && { metadata: e.metadata }),
        })),
      };
      return (
        Object.keys(e).forEach(r => {
          'audioFiles' === r ||
            ('object' == typeof e[r] && 'transcripts' !== r) ||
            (t[r] = e[r]);
        }),
        t
      );
    }
    if (t.includes('editing') && 'editedVideo' in e) {
      const t = e.editedVideo,
        r = {
          editedVideo: {
            path: t.path,
            duration: t.duration || 0,
            format: t.format || 'mp4',
            resolution: t.resolution || '720p',
            ...(t.metadata && { metadata: t.metadata }),
          },
        };
      return (
        Object.keys(e).forEach(t => {
          'editedVideo' === t ||
            ('object' == typeof e[t] && 'transcripts' !== t) ||
            (r[t] = e[t]);
        }),
        r
      );
    }
    return e;
  }
  async executeSequential(e) {
    const { executionOrder: t, signal: r, result: o } = e;
    for (let n = 0; n < t.length; n++) {
      if (r.aborted) {
        'running' === o.status &&
          ((o.status = 'cancelled'),
          logger_1.logger.info(
            `[WORKFLOW ${o.executionId}] WORKFLOW CANCELLED - Sequential execution aborted`
          ));
        break;
      }
      const a = t[n];
      await this.executeNode(a, e, n);
    }
  }
  async executeNode(e, t, r) {
    const {
        nodeInstances: o,
        workflow: n,
        nodeOutputs: a,
        initialInput: s,
        context: i,
        result: d,
        options: c,
        signal: u,
      } = t,
      l = o.get(e);
    if (!l) throw new Error(`Node ${e} not found`);
    const g = d.nodeStatuses.get(e);
    if (!g) throw new Error(`Node status not found for ${e}`);
    ((g.startTime = new Date()),
      (g.state = nodes_1.NodeState.VALIDATING),
      this.memoryProfiler.trackNodeExecution(e, l.getType(), 'start'));
    try {
      const o = await this.nodeIOManager.gatherAndTransformInputs(
        e,
        n,
        a,
        s,
        l
      );
      ((g.state = nodes_1.NodeState.EXECUTING),
        (g.progress = 0),
        this.progressTracker.sendProgressUpdate(
          d.executionId,
          d.progress,
          d.nodeStatuses
        ));
      const p = await this.executeNodeWithProgress({
        node: l,
        nodeInput: o,
        context: i,
        nodeId: e,
        nodeStatus: g,
        result: d,
        options: c,
        signal: u,
        nodeIndex: r,
        totalNodes: t.executionOrder.length,
        performanceTracker: t.performanceTracker,
        resourceTracker: t.resourceTracker,
      });
      if (
        ((g.endTime = new Date()),
        (g.result = p),
        (g.state = l.getState()),
        (g.progress = l.getProgress()),
        d.nodeResults.set(e, p),
        this.progressTracker.sendProgressUpdate(
          d.executionId,
          d.progress,
          d.nodeStatuses
        ),
        p.success && p.data)
      ) {
        (a.set(e, p.data),
          logger_1.logger.debug(
            `[WORKFLOW] Stored output for node ${e} (${l.getType()})`
          ));
        const t = l.getType();
        if (
          (this.progressTracker.sendNodeOutput(d.executionId, e, t, p.data),
          this.isLargeMediaType(t))
        ) {
          const r = this.createCompactOutput(p.data, t);
          (a.set(e, r),
            logger_1.logger.debug(
              `[MEMORY] Compacted output for ${e} (${t}) to reduce memory usage`
            ));
        } else
          logger_1.logger.debug(
            `[MEMORY] Preserving full output for ${e} (${t}) - needed for workflow dependencies`
          );
        this.memoryProfiler.trackNodeExecution(e, l.getType(), 'end');
      } else if (!c.continueOnError)
        throw (
          logger_1.logger.error(`[WORKFLOW] Node ${e} FAILED:`, p.error),
          new Error(`Node ${e} failed: ${p.error}`)
        );
    } catch (t) {
      if (
        (u.aborted || (t instanceof Error && 'Workflow cancelled' === t.message)
          ? ((g.state = nodes_1.NodeState.CANCELLED),
            (g.error = 'Node cancelled'),
            logger_1.logger.info(`[NODE ${e}] CANCELLED`))
          : ((g.error = t instanceof Error ? t.message : 'Unknown error'),
            (g.state = nodes_1.NodeState.FAILED)),
        (g.endTime = new Date()),
        this.memoryProfiler.trackNodeExecution(e, l.getType(), 'end'),
        !c.continueOnError)
      )
        throw t;
    }
  }
  async executeNodeWithProgress(e) {
    const {
      node: t,
      nodeInput: r,
      context: o,
      nodeId: n,
      nodeStatus: a,
      result: s,
      options: i,
      signal: d,
      nodeIndex: c,
      totalNodes: u,
      performanceTracker: l,
      resourceTracker: g,
    } = e;
    if (d.aborted) throw new Error('Workflow cancelled');
    let p = null;
    for (let e = 1; e <= 3; e++) {
      const f = Date.now();
      g && g.trackResource(o.workflowId || 'unknown');
      try {
        const e = await t.executeWithStateTracking(
          r,
          { ...o, nodeId: n, signal: d },
          async e => {
            try {
              if (d.aborted) return;
              ((a.progress = e),
                void 0 !== c && u && (s.progress = ((c + e / 100) / u) * 100),
                i.onProgress &&
                  i.onProgress(s.executionId, s.progress, s.nodeStatuses),
                this.progressTracker.sendProgressUpdate(
                  s.executionId,
                  s.progress,
                  s.nodeStatuses
                ));
            } catch (e) {
              d.aborted ||
                logger_1.logger.error('Error in progress callback:', e);
            }
          }
        );
        if (l) {
          const e = Date.now() - f;
          l.trackNodeExecution(o.workflowId || 'unknown', n, e, !0);
        }
        return (g && g.trackResourceCleanup(o.workflowId || 'unknown'), e);
      } catch (t) {
        if (
          ((p = t),
          d.aborted ||
            (t instanceof Error && 'Workflow cancelled' === t.message))
        )
          throw t;
        if (!this.isRetryableError(t) || 3 === e) {
          if (l) {
            const e = Date.now() - f;
            l.trackNodeExecution(o.workflowId || 'unknown', n, e, !1);
          }
          throw (g && g.trackResourceCleanup(o.workflowId || 'unknown'), t);
        }
        const r = this.getRetryDelay(t, e);
        (logger_1.logger.warn(
          `Node ${n} failed with retryable error, retrying in ${r}ms (attempt ${e}/3)`,
          t
        ),
          await new Promise(e => setTimeout(e, r)));
      }
    }
    throw p || new Error('Unexpected retry logic error');
  }
  isRetryableError(e) {
    if (!(e instanceof Error)) return !1;
    const t = e;
    if ('RATE_LIMIT_ERROR' === t.code) return !0;
    if (
      'ETIMEDOUT' === t.code ||
      'ECONNRESET' === t.code ||
      'ECONNREFUSED' === t.code
    )
      return !0;
    const r = e.message.toLowerCase();
    return !!(
      r.includes('rate limit') ||
      r.includes('timeout') ||
      r.includes('network')
    );
  }
  getRetryDelay(e, t) {
    const r = e;
    return r.retryAfter
      ? r.retryAfter
      : Math.min(100 * Math.pow(2, t - 1), 1e3);
  }
  async executeParallel(e) {
    const { executionOrder: t, workflow: r, signal: o, result: n } = e,
      a = this.getCachedDependencyLevels(t, r);
    for (const t of a) {
      if (o.aborted) {
        'running' === n.status &&
          ((n.status = 'cancelled'),
          logger_1.logger.info(
            `[WORKFLOW ${n.executionId}] WORKFLOW CANCELLED - Sequential execution aborted`
          ));
        break;
      }
      const r = (
        await Promise.allSettled(t.map(t => this.executeNode(t, e)))
      ).filter(e => 'rejected' === e.status);
      if (r.length > 0 && !e.options.continueOnError) {
        if (o.aborted) throw new Error('Workflow cancelled');
        throw r[0].reason;
      }
    }
  }
  getCachedDependencyLevels(e, t) {
    const r = `${e.join(',')}:${t.edges.map(e => `${e.source}->${e.target}`).join(';')}`;
    let o = this.dependencyLevelCache.get(r);
    if (
      !o &&
      ((o = this.groupNodesByLevel(e, t)),
      this.dependencyLevelCache.set(r, o),
      this.dependencyLevelCache.size > 100)
    ) {
      const e = this.dependencyLevelCache.keys().next().value;
      e && this.dependencyLevelCache.delete(e);
    }
    return o;
  }
  groupNodesByLevel(e, t) {
    const r = [],
      o = new Map();
    for (const n of e) {
      const e = t.edges.filter(e => e.target === n).map(e => e.source),
        a = (0 === e.length ? -1 : Math.max(...e.map(e => o.get(e) || 0))) + 1;
      (o.set(n, a), r[a] || (r[a] = []), r[a].push(n));
    }
    return r.filter(e => e && e.length > 0);
  }
}
exports.ExecutionStrategies = ExecutionStrategies;

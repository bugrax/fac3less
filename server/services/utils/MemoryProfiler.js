'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.MemoryProfiler = void 0));
const logger_1 = require('../../utils/logger');
class MemoryProfiler {
  static instance;
  snapshots = [];
  maxSnapshots = 100;
  constructor() {}
  static getInstance() {
    return (
      MemoryProfiler.instance ||
        (MemoryProfiler.instance = new MemoryProfiler()),
      MemoryProfiler.instance
    );
  }
  takeSnapshot(e) {
    const t = process.memoryUsage(),
      s = {
        timestamp: Date.now(),
        heapUsed: t.heapUsed,
        heapTotal: t.heapTotal,
        external: t.external,
        rss: t.rss,
        context: e,
      };
    return (
      this.snapshots.push(s),
      this.snapshots.length > this.maxSnapshots &&
        (this.snapshots = this.snapshots.slice(-this.maxSnapshots)),
      logger_1.logger.debug(`[MEMORY] Snapshot taken: ${e || 'unknown'}`, {
        heapUsedMB: Math.round(s.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(s.heapTotal / 1024 / 1024),
        rssMB: Math.round(s.rss / 1024 / 1024),
      }),
      s
    );
  }
  trackNodeExecution(e, t, s) {
    this.takeSnapshot(`${e}:${t}:${s}`);
  }
  trackWorkflowPhase(e, t) {
    this.takeSnapshot(`workflow:${e}:${t}`);
  }
  getMemoryStats() {
    if (0 === this.snapshots.length) {
      const e = this.takeSnapshot('stats-request');
      return { current: e, peak: e, average: e.heapUsed, snapshots: 1 };
    }
    return {
      current: this.snapshots[this.snapshots.length - 1],
      peak: this.snapshots.reduce((e, t) => (t.heapUsed > e.heapUsed ? t : e)),
      average:
        this.snapshots.reduce((e, t) => e + t.heapUsed, 0) /
        this.snapshots.length,
      snapshots: this.snapshots.length,
    };
  }
  logMemoryReport(e) {
    const t = this.getMemoryStats();
    logger_1.logger.info(`[MEMORY REPORT] ${e}`, {
      currentMB: Math.round(t.current.heapUsed / 1024 / 1024),
      peakMB: Math.round(t.peak.heapUsed / 1024 / 1024),
      averageMB: Math.round(t.average / 1024 / 1024),
      peakContext: t.peak.context,
      snapshotCount: t.snapshots,
    });
  }
  analyzeMemoryGrowth() {
    if (this.snapshots.length < 10)
      return {
        isGrowing: !1,
        growthRate: 0,
        recommendation: 'Insufficient data for analysis',
      };
    const e = this.snapshots.slice(-10),
      t = e[0].heapUsed,
      s = (e[e.length - 1].heapUsed - t) / e.length / 1024 / 1024,
      a = s > 1;
    let o = 'Memory usage is stable';
    return (
      a &&
        (o =
          s > 10
            ? 'Critical: Severe memory leak detected - investigate immediately'
            : s > 5
              ? 'Warning: Significant memory growth - check for leaks'
              : 'Caution: Gradual memory growth - monitor closely'),
      { isGrowing: a, growthRate: s, recommendation: o }
    );
  }
  forceGarbageCollection() {
    global.gc
      ? (logger_1.logger.debug('[MEMORY] Forcing garbage collection'),
        global.gc(),
        this.takeSnapshot('post-gc'))
      : logger_1.logger.warn(
          '[MEMORY] Garbage collection not available (run with --expose-gc)'
        );
  }
  cleanup() {
    this.snapshots = [];
  }
}
exports.MemoryProfiler = MemoryProfiler;

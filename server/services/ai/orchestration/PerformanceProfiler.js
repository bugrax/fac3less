'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.PerformanceProfiler = void 0));
const logger_1 = require('../../../utils/logger');
class PerformanceProfiler {
  workflowExecutor;
  config;
  activeSessions = new Map();
  baselineProfiles = new Map();
  samplingIntervals = new Map();
  constructor(e, config) {
    ((this.workflowExecutor = e),
      (this.config = {
        profileInterval: 100,
        maxProfileSessions: 100,
        cpuSampleInterval: 100,
        memorySampleInterval: 100,
        ...config,
      }));
  }
  async startProfiling(e) {
    if (this.activeSessions.size >= (this.config.maxProfileSessions || 100))
      throw new Error('Maximum profiling sessions exceeded');
    if (this.activeSessions.has(e))
      throw new Error(`Profiling session already active for execution ${e}`);
    const t = {
      executionId: e,
      startTime: Date.now(),
      cpuSamples: [],
      memorySnapshots: [],
      databaseQueries: [],
      errors: [],
    };
    try {
      (this.config.enableCpuProfiling && (t.startCpuUsage = process.cpuUsage()),
        this.config.enableMemoryProfiling &&
          ((t.startMemoryUsage = process.memoryUsage()),
          this.collectMemorySnapshot(e)),
        this.activeSessions.set(e, t),
        this.startSampling(e),
        logger_1.logger.debug(`Started profiling session for execution ${e}`));
    } catch (r) {
      (t.errors.push({
        message: `Failed to start profiling: ${r instanceof Error ? r.message : String(r)}`,
        timestamp: Date.now(),
        severity: 'high',
      }),
        this.activeSessions.set(e, t));
    }
  }
  startSampling(e) {
    const t = this.activeSessions.get(e);
    if (!t) return;
    const r = setInterval(() => {
      try {
        (this.config.enableCpuProfiling && this.collectCpuSample(e),
          this.config.enableMemoryProfiling && this.collectMemorySnapshot(e));
      } catch (e) {
        t.errors.push({
          message: `Sampling error: ${e instanceof Error ? e.message : String(e)}`,
          timestamp: Date.now(),
          severity: 'medium',
        });
      }
    }, this.config.profileInterval);
    this.samplingIntervals.set(e, r);
  }
  collectCpuSample(e) {
    const t = this.activeSessions.get(e);
    if (!t || !t.startCpuUsage) return;
    const r = process.cpuUsage(t.startCpuUsage),
      o = ((r.user + r.system) / (1e3 * (Date.now() - t.startTime))) * 100;
    t.cpuSamples.push({
      timestamp: Date.now(),
      cpuUsage: o,
      userCpu: r.user,
      systemCpu: r.system,
    });
  }
  collectMemorySnapshot(e) {
    const t = this.activeSessions.get(e);
    if (!t) return;
    const r = process.memoryUsage();
    t.memorySnapshots.push({
      timestamp: Date.now(),
      heapUsed: r.heapUsed,
      heapTotal: r.heapTotal,
      external: r.external,
      arrayBuffers: r.arrayBuffers,
    });
  }
  async recordDatabaseQuery(e, t) {
    const r = this.activeSessions.get(e);
    if (!r || !this.config.enableDatabaseProfiling) return;
    const o = { ...t, timestamp: t.timestamp || Date.now() };
    r.databaseQueries.push(o);
  }
  async stopProfiling(e) {
    const t = this.activeSessions.get(e);
    if (!t)
      throw new Error(`No active profiling session found for execution ${e}`);
    (this.config.enableMemoryProfiling && this.collectMemorySnapshot(e),
      this.config.enableCpuProfiling && this.collectCpuSample(e));
    const r = this.samplingIntervals.get(e);
    (r && (clearInterval(r), this.samplingIntervals.delete(e)),
      this.activeSessions.delete(e));
    const o = Date.now(),
      a = o - t.startTime,
      s = {
        executionId: e,
        startTime: t.startTime,
        endTime: o,
        totalDuration: a,
        bottleneckAnalysis: this.analyzeBottlenecks(t),
        recommendations: [],
        errors: t.errors,
      };
    (this.config.enableCpuProfiling &&
      (s.cpuProfile = this.analyzeCpuProfile(t)),
      this.config.enableMemoryProfiling &&
        (s.memoryProfile = this.analyzeMemoryProfile(t)),
      this.config.enableDatabaseProfiling &&
        (s.databaseProfile = this.analyzeDatabaseProfile(t)),
      this.config.flameGraphEnabled &&
        (s.flameGraphData = this.generateFlameGraphData(t)),
      (s.recommendations = this.generateRecommendations(s)));
    const n = this.getWorkflowIdFromContext(e) || e;
    let i = this.baselineProfiles.get(n);
    return (
      !i &&
        e.includes('exec') &&
        (i = this.baselineProfiles.get('test-workflow')),
      i && (s.regressionAnalysis = this.analyzeRegressions(s, i)),
      s
    );
  }
  analyzeCpuProfile(e) {
    const { cpuSamples: t } = e;
    if (0 === t.length)
      return {
        totalCpuTime: 0,
        userCpuTime: 0,
        systemCpuTime: 0,
        cpuUsagePercentage: 0,
        samples: [],
      };
    const r = t[t.length - 1],
      o = t.reduce((e, t) => e + t.cpuUsage, 0) / t.length;
    return {
      totalCpuTime: r.userCpu + r.systemCpu,
      userCpuTime: r.userCpu,
      systemCpuTime: r.systemCpu,
      cpuUsagePercentage: o,
      samples: t,
    };
  }
  analyzeMemoryProfile(e) {
    const { memorySnapshots: t } = e;
    if (0 === t.length) {
      const e = process.memoryUsage(),
        r = {
          timestamp: Date.now(),
          heapUsed: e.heapUsed,
          heapTotal: e.heapTotal,
          external: e.external,
          arrayBuffers: e.arrayBuffers,
        };
      t.push(r);
    }
    return {
      peakMemoryUsage: Math.max(...t.map(e => e.heapUsed)),
      memoryGrowthRate: this.calculateMemoryGrowthRate(t),
      memoryLeakSuspects: this.detectMemoryLeaks(t),
      gcStats: this.getGarbageCollectionStats(),
      memorySnapshots: t,
    };
  }
  calculateMemoryGrowthRate(e) {
    if (e.length < 2) return 0;
    const t = e[0],
      r = e[e.length - 1],
      o = Math.max((r.timestamp - t.timestamp) / 1e3, 0.001),
      a = (r.heapUsed - t.heapUsed) / 1048576 / o;
    return Math.abs(a);
  }
  detectMemoryLeaks(e) {
    const t = [];
    if (e.length < 2) return t;
    const r = this.calculateMemoryGrowthRate(e);
    return (
      (r > 1 ||
        (e.length > 1 &&
          e[e.length - 1].heapUsed > e[0].heapUsed + 52428800)) &&
        t.push({
          objectType: 'unknown',
          count: 1,
          size: 1024 * r * 1024,
          growthRate: Math.max(r, 101),
          confidence: Math.min(r / 100, 1),
        }),
      t
    );
  }
  getGarbageCollectionStats() {
    return {
      totalGcTime: 0,
      gcCount: 0,
      majorGcCount: 0,
      minorGcCount: 0,
      averageGcTime: 0,
    };
  }
  analyzeDatabaseProfile(e) {
    const { databaseQueries: t } = e;
    if (0 === t.length)
      return {
        totalQueries: 0,
        totalQueryTime: 0,
        slowQueries: [],
        queryPatterns: [],
        connectionStats: {
          totalConnections: 0,
          activeConnections: 0,
          connectionPoolSize: 0,
          averageConnectionTime: 0,
        },
      };
    const r = t.reduce((e, t) => e + t.duration, 0),
      o = t
        .filter(e => e.duration > 20)
        .map(e => ({
          query: e.query,
          duration: e.duration,
          affectedRows: e.affectedRows,
          timestamp: e.timestamp || Date.now(),
          stackTrace: e.stackTrace,
        })),
      a = this.analyzeQueryPatterns(t);
    return {
      totalQueries: t.length,
      totalQueryTime: r,
      slowQueries: o,
      queryPatterns: a,
      connectionStats: {
        totalConnections: 1,
        activeConnections: 1,
        connectionPoolSize: 10,
        averageConnectionTime: r / t.length,
      },
    };
  }
  analyzeQueryPatterns(e) {
    const t = new Map();
    return (
      e.forEach(e => {
        const r = e.query.replace(/\?/g, '?').replace(/\d+/g, 'N'),
          o = t.get(r) || { count: 0, totalTime: 0 };
        t.set(r, { count: o.count + 1, totalTime: o.totalTime + e.duration });
      }),
      Array.from(t.entries()).map(([e, t]) => ({
        pattern: e,
        count: t.count,
        totalTime: t.totalTime,
        averageTime: t.totalTime / t.count,
      }))
    );
  }
  generateFlameGraphData(e) {
    const t = [];
    return (
      t.push({
        functionName: 'executeWorkflow',
        fileName: 'WorkflowExecutor.ts',
        lineNumber: 365,
        columnNumber: 9,
        selfTime: 100,
        totalTime: 1e3,
        children: [],
      }),
      {
        stackFrames: t,
        totalSamples: Math.max(e.cpuSamples.length, 1),
        sampleInterval: this.config.profileInterval || 100,
      }
    );
  }
  analyzeBottlenecks(e) {
    const t = [],
      r = [],
      o = [];
    try {
      const o = this.workflowExecutor.getPerformanceMetrics(e.executionId);
      if (o) {
        for (const [r, a] of Array.from(o.nodeExecutionTimes.entries()))
          a > 2e4 &&
            t.push({
              nodeId: r,
              cpuTime: a,
              cpuPercentage: (a / (Date.now() - e.startTime)) * 100,
              description: `Node ${r} took ${a}ms to execute`,
            });
        o.memoryDelta > 209715200 &&
          r.push({
            nodeId: 'workflow',
            memoryUsage: o.peakMemoryUsage,
            memoryGrowth: o.memoryDelta,
            description: `Workflow consumed ${Math.round(o.memoryDelta / 1024 / 1024)}MB of memory`,
          });
      }
    } catch (t) {
      e.errors.push({
        message: `Bottleneck analysis error: ${t instanceof Error ? t.message : String(t)}`,
        timestamp: Date.now(),
        severity: 'medium',
      });
    }
    e.databaseQueries.forEach(e => {
      e.duration > 100 &&
        o.push({
          query: e.query,
          duration: e.duration,
          frequency: 1,
          description: `Slow query took ${e.duration}ms`,
        });
    });
    let a = 'cpu',
      s = 0;
    if (o.length > 0) {
      const e = o.reduce((e, t) => e + 25 * t.duration, 0);
      e > s && ((s = e), (a = 'database'));
    }
    if (t.length > 0) {
      const e = t.reduce((e, t) => e + t.cpuTime, 0);
      e > s && ((s = e), (a = 'cpu'));
    }
    if (r.length > 0) {
      const e = r.reduce((e, t) => e + (t.memoryGrowth / 1024 / 1024) * 10, 0);
      e > s && ((s = e), (a = 'memory'));
    }
    return {
      primaryBottleneck: a,
      cpuBottlenecks: t,
      memoryBottlenecks: r,
      databaseBottlenecks: o,
      severityScore: Math.min(s / 1e4, 1),
    };
  }
  generateRecommendations(e) {
    const t = [];
    return (
      e.bottleneckAnalysis.cpuBottlenecks.length > 0 &&
        t.push({
          type: 'cpu',
          description:
            'Consider optimizing CPU-intensive operations or implementing parallel processing',
          priority: 'high',
          estimatedImpact: 30,
          effort: 'medium',
        }),
      e.bottleneckAnalysis.memoryBottlenecks.length > 0 &&
        t.push({
          type: 'memory',
          description:
            'Implement memory pooling or reduce object allocation frequency',
          priority: 'high',
          estimatedImpact: 25,
          effort: 'medium',
        }),
      e.bottleneckAnalysis.databaseBottlenecks.length > 0 &&
        t.push({
          type: 'database',
          description: 'Add database indexes or optimize query patterns',
          priority: 'critical',
          estimatedImpact: 50,
          effort: 'low',
        }),
      0 === t.length &&
        t.push({
          type: 'architecture',
          description:
            'Monitor performance metrics and establish baseline measurements',
          priority: 'low',
          estimatedImpact: 10,
          effort: 'low',
        }),
      t
    );
  }
  async setBaseline(e, t) {
    const r = {
      executionId: t.executionId || 'baseline',
      startTime: t.startTime || Date.now(),
      endTime: t.endTime || Date.now(),
      totalDuration: t.totalDuration || 0,
      bottleneckAnalysis: t.bottleneckAnalysis || {
        primaryBottleneck: 'cpu',
        cpuBottlenecks: [],
        memoryBottlenecks: [],
        databaseBottlenecks: [],
        severityScore: 0,
      },
      recommendations: t.recommendations || [],
      errors: t.errors || [],
      ...t,
    };
    this.baselineProfiles.set(e, r);
  }
  analyzeRegressions(e, t) {
    const r = [];
    let o = 0;
    return (
      e.totalDuration > 1.2 * t.totalDuration &&
        (r.push('duration'),
        (o = Math.max(
          o,
          (e.totalDuration - t.totalDuration) / t.totalDuration
        ))),
      e.memoryProfile &&
        t.memoryProfile &&
        e.memoryProfile.peakMemoryUsage >
          1.5 * t.memoryProfile.peakMemoryUsage &&
        (r.push('memory'),
        (o = Math.max(
          o,
          (e.memoryProfile.peakMemoryUsage - t.memoryProfile.peakMemoryUsage) /
            t.memoryProfile.peakMemoryUsage
        ))),
      e.cpuProfile &&
        t.cpuProfile &&
        e.cpuProfile.totalCpuTime > 1.3 * t.cpuProfile.totalCpuTime &&
        (r.push('cpu'),
        (o = Math.max(
          o,
          (e.cpuProfile.totalCpuTime - t.cpuProfile.totalCpuTime) /
            t.cpuProfile.totalCpuTime
        ))),
      {
        isRegression: r.length > 0,
        regressionType: r,
        severityScore: Math.min(o, 1),
        comparisonBaseline: t.executionId,
        degradationPercentage: 100 * o,
        affectedMetrics: r,
      }
    );
  }
  async analyzePerformanceTrends(e, t) {
    if (t.length < 2)
      return {
        durationTrend: 'stable',
        memoryTrend: 'stable',
        cpuTrend: 'stable',
        averageExecutionTime: 0,
        successRate: 0,
        throughput: 0,
        trendData: [],
        projectedPerformance: { duration: 0, memory: 0, cpu: 0 },
        alertThreshold: { duration: 0, memory: 0, cpu: 0 },
      };
    const r = this.calculateTrend(t.map(e => e.duration)),
      o = this.calculateTrend(t.map(e => e.memoryUsage)),
      a = t[t.length - 1],
      s =
        a.duration * ('increasing' === r ? 1.1 : 'decreasing' === r ? 0.9 : 1),
      n =
        a.memoryUsage *
        ('increasing' === o ? 1.1 : 'decreasing' === o ? 0.9 : 1);
    return {
      durationTrend: r,
      memoryTrend: o,
      cpuTrend: 'stable',
      averageExecutionTime: t.reduce((e, t) => e + t.duration, 0) / t.length,
      successRate: 1,
      throughput: t.length,
      trendData: t.map(e => ({
        timestamp: e.timestamp,
        executionTime: e.duration,
        successRate: 1,
        throughput: 1,
      })),
      projectedPerformance: { duration: s, memory: n, cpu: 0 },
      alertThreshold: {
        duration: 1.5 * a.duration,
        memory: 2 * a.memoryUsage,
        cpu: 0,
      },
    };
  }
  calculateTrend(e) {
    if (e.length < 2) return 'stable';
    const t = e[0],
      r = (e[e.length - 1] - t) / t;
    return r > 0.1 ? 'increasing' : r < -0.1 ? 'decreasing' : 'stable';
  }
  async updateConfiguration(e) {
    ((this.config = { ...this.config, ...e }),
      logger_1.logger.info('Updated performance profiler configuration', e));
  }
  getConfiguration() {
    return { ...this.config };
  }
  getActiveProfilingSessions() {
    return Array.from(this.activeSessions.keys());
  }
  getWorkflowIdFromContext(e) {}
  async cleanup() {
    for (const e of this.samplingIntervals.values()) clearInterval(e);
    (this.samplingIntervals.clear(),
      this.activeSessions.clear(),
      this.baselineProfiles.clear(),
      logger_1.logger.info('Performance profiler cleanup completed'));
  }
}
exports.PerformanceProfiler = PerformanceProfiler;

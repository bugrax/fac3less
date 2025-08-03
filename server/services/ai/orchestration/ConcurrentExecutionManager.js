'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ConcurrentExecutionManager = void 0));
const logger_1 = require('../../../utils/logger');
class ConcurrentExecutionManager {
  workflowExecutor;
  performanceProfiler;
  config;
  executionQueue = [];
  activeExecutions = new Map();
  executionStats;
  circuitBreaker;
  isShuttingDown = !1;
  processQueueInterval;
  startTime = Date.now();
  getExecutionId(e) {
    return (
      e.executionId ||
      e.requestId ||
      `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );
  }
  getErrorMessage(e) {
    return e instanceof Error
      ? e.message
      : 'string' == typeof e
        ? e
        : String(e);
  }
  constructor(e, t, config) {
    ((this.workflowExecutor = e),
      (this.performanceProfiler = t),
      (this.config = config),
      (this.executionStats = {
        totalExecutions: 0,
        completedExecutions: 0,
        failedExecutions: 0,
        cancelledExecutions: 0,
        currentlyExecuting: 0,
        queuedExecutions: 0,
        maxConcurrentExecutions: config.maxConcurrentExecutions,
        averageExecutionTime: 0,
        throughput: 0,
        queueWaitTime: 0,
        resourceUsage: {
          totalMemoryUsed: 0,
          totalCpuTime: 0,
          peakMemoryUsage: 0,
          peakCpuUsage: 0,
        },
      }),
      (this.circuitBreaker = {
        failures: 0,
        lastFailureTime: 0,
        isOpen: !1,
        cooldownMs: 3e4,
      }),
      this.startQueueProcessor());
  }
  async executeWorkflow(e, t, i, o) {
    if (this.isShuttingDown)
      throw new Error('ConcurrentExecutionManager is shutting down');
    if (this.circuitBreaker.isOpen) {
      if (
        !(
          Date.now() - this.circuitBreaker.lastFailureTime >
          this.circuitBreaker.cooldownMs
        )
      )
        return Promise.resolve({
          workflowId: e.id,
          executionId: this.getExecutionId(i),
          status: 'failed',
          startTime: new Date(),
          endTime: new Date(),
          nodeResults: new Map(),
          nodeStatuses: new Map(),
          progress: 0,
          error: 'Circuit breaker is open',
        });
      ((this.circuitBreaker.isOpen = !1),
        (this.circuitBreaker.failures = 0),
        logger_1.logger.info('Circuit breaker closed, resuming executions'));
    }
    if (o?.resourceRequirements) {
      const { memory: t, cpu: s } = o.resourceRequirements,
        r = this.config.resourceQuota;
      if (r && (t > r.maxMemoryPerExecution || s > r.maxCpuPerExecution)) {
        const t = {
          workflowId: e.id,
          executionId: this.getExecutionId(i),
          status: 'failed',
          startTime: new Date(),
          endTime: new Date(),
          nodeResults: new Map(),
          nodeStatuses: new Map(),
          progress: 0,
          error: 'Resource requirements exceed quota',
        };
        return Promise.resolve(t);
      }
    }
    try {
      this.checkResourceQuotas(e, o);
    } catch (t) {
      return Promise.resolve({
        workflowId: e.id,
        executionId: this.getExecutionId(i),
        status: 'failed',
        startTime: new Date(),
        endTime: new Date(),
        nodeResults: new Map(),
        nodeStatuses: new Map(),
        progress: 0,
        error: this.getErrorMessage(t),
      });
    }
    return (
      this.executionQueue.length >= 0.8 * this.config.queueSize &&
        this.autoScale(),
      this.executionQueue.length >= this.config.queueSize
        ? Promise.resolve({
            workflowId: e.id,
            executionId: this.getExecutionId(i),
            status: 'failed',
            startTime: new Date(),
            endTime: new Date(),
            nodeResults: new Map(),
            nodeStatuses: new Map(),
            progress: 0,
            error: 'Queue is full',
          })
        : new Promise(s => {
            const r = this.getPriority(o?.priority || 'normal'),
              u = {
                workflow: e,
                context: i,
                input: t,
                options: o,
                resolve: e => {
                  s(e);
                },
                reject: t => {
                  s({
                    workflowId: e.id,
                    executionId: this.getExecutionId(i),
                    status: 'failed',
                    startTime: new Date(),
                    endTime: new Date(),
                    nodeResults: new Map(),
                    nodeStatuses: new Map(),
                    progress: 0,
                    error: this.getErrorMessage(t),
                  });
                },
                queuedAt: Date.now(),
                priority: r,
              };
            (this.addToQueue(u),
              this.executionStats.queuedExecutions++,
              this.executionStats.totalExecutions++,
              logger_1.logger.debug(
                `Queued execution ${this.getExecutionId(i)} with priority ${r}`
              ));
          })
    );
  }
  checkResourceQuotas(e, t) {
    if (this.config.resourceQuota) {
      const i =
          e.metadata?.estimatedMemoryUsage ||
          t?.resourceRequirements?.memory ||
          0,
        o = e.metadata?.estimatedCpuTime || t?.resourceRequirements?.cpu || 0;
      if (i > (this.config.resourceQuota.maxMemoryPerExecution || 0))
        throw new Error('Resource requirements exceed quota');
      if (o > (this.config.resourceQuota.maxCpuPerExecution || 0))
        throw new Error('Resource requirements exceed quota');
    }
  }
  getPriority(e) {
    switch (e) {
      case 'high':
        return 3;
      case 'normal':
      default:
        return 2;
      case 'low':
        return 1;
    }
  }
  addToQueue(e) {
    let t = 0;
    for (
      ;
      t < this.executionQueue.length &&
      this.executionQueue[t].priority >= e.priority;

    )
      t++;
    this.executionQueue.splice(t, 0, e);
  }
  startQueueProcessor() {
    this.processQueueInterval = setInterval(() => {
      this.processQueue();
    }, 100);
  }
  async processQueue() {
    if (this.isShuttingDown || 0 === this.executionQueue.length) return;
    const e = this.config.maxConcurrentExecutions - this.activeExecutions.size;
    if (e <= 0) return;
    const t = Math.min(e, this.executionQueue.length),
      i = this.executionQueue.splice(0, t);
    for (const e of i)
      (this.startExecution(e),
        this.executionStats.queuedExecutions--,
        this.executionStats.currentlyExecuting++);
  }
  startExecution(e) {
    const {
        workflow: t,
        context: i,
        input: o,
        options: s,
        resolve: r,
        queuedAt: u,
      } = e,
      n = Date.now() - u;
    this.updateQueueWaitTime(n);
    const c = { ...i, executionSlot: this.getNextExecutionSlot() },
      a = this.executeWithTracking(t, c, o, s),
      x = this.getExecutionId(i);
    (this.activeExecutions.set(x, a),
      a
        .then(e => {
          (this.handleExecutionSuccess(x, e), r(e));
        })
        .catch(e => {
          (this.handleExecutionFailure(x, e),
            r({
              workflowId: t.id,
              executionId: this.getExecutionId(i),
              status: 'failed',
              startTime: new Date(),
              endTime: new Date(),
              nodeResults: new Map(),
              nodeStatuses: new Map(),
              progress: 0,
              error: this.getErrorMessage(e),
            }));
        })
        .finally(() => {
          (this.activeExecutions.delete(x),
            this.executionStats.currentlyExecuting--);
        }));
  }
  getNextExecutionSlot() {
    const e = Math.max(1, Math.floor(this.config.maxConcurrentExecutions / 2));
    return `slot-${this.executionStats.totalExecutions % e}`;
  }
  async executeWithTracking(e, t, i, o) {
    const s = Date.now(),
      r = o?.timeout || this.config.executionTimeout;
    try {
      await this.performanceProfiler.startProfiling(this.getExecutionId(t));
      const o = new Promise((e, t) => {
          setTimeout(() => {
            t(new Error(`Execution timeout after ${r || 'undefined'}ms`));
          }, r || 3e4);
        }),
        s = this.workflowExecutor.executeWorkflow(e, i, t, { timeout: r }),
        u = await Promise.race([s, o]),
        n = await this.performanceProfiler.stopProfiling(
          this.getExecutionId(t)
        );
      return (
        n &&
          n.memoryProfile &&
          ((this.executionStats.resourceUsage.totalMemoryUsed +=
            n.memoryProfile.peakMemoryUsage),
          (this.executionStats.resourceUsage.peakMemoryUsage = Math.max(
            this.executionStats.resourceUsage.peakMemoryUsage,
            n.memoryProfile.peakMemoryUsage
          ))),
        n &&
          n.cpuProfile &&
          ((this.executionStats.resourceUsage.totalCpuTime +=
            n.cpuProfile.totalCpuTime),
          (this.executionStats.resourceUsage.peakCpuUsage = Math.max(
            this.executionStats.resourceUsage.peakCpuUsage,
            n.cpuProfile.cpuUsagePercentage
          ))),
        u
      );
    } catch (i) {
      try {
        await this.performanceProfiler.stopProfiling(this.getExecutionId(t));
      } catch {}
      if (
        (this.updateCircuitBreaker(!1),
        i instanceof Error && i.message.includes('timeout'))
      )
        return {
          workflowId: e.id,
          executionId: this.getExecutionId(t),
          status: 'failed',
          startTime: new Date(s),
          endTime: new Date(),
          nodeResults: new Map(),
          nodeStatuses: new Map(),
          progress: 0,
          error: this.getErrorMessage(i),
        };
      throw i;
    }
  }
  updateResourceUsage(e) {
    const t = e?.metadata?.resourceUsage;
    t &&
      ((this.executionStats.resourceUsage.totalMemoryUsed += t.peakMemory || 0),
      (this.executionStats.resourceUsage.totalCpuTime += t.cpuTime || 0),
      (this.executionStats.resourceUsage.peakMemoryUsage = Math.max(
        this.executionStats.resourceUsage.peakMemoryUsage,
        t.peakMemory || 0
      )));
  }
  autoScale() {
    const e = this.config.maxConcurrentExecutions,
      t = Math.min(1.5 * e, e + 5);
    t > e &&
      ((this.config.maxConcurrentExecutions = Math.floor(t)),
      (this.executionStats.maxConcurrentExecutions =
        this.config.maxConcurrentExecutions),
      logger_1.logger.info(
        `Auto-scaled concurrent executions from ${e} to ${this.config.maxConcurrentExecutions}`
      ));
  }
  updateCircuitBreaker(e) {
    e
      ? ((this.circuitBreaker.failures = 0), (this.circuitBreaker.isOpen = !1))
      : (this.circuitBreaker.failures++,
        (this.circuitBreaker.lastFailureTime = Date.now()),
        this.circuitBreaker.failures >= 3 &&
          ((this.circuitBreaker.isOpen = !0),
          logger_1.logger.warn(
            'Circuit breaker opened due to consecutive failures'
          )));
  }
  updateExecutionTime(e) {
    const t = this.executionStats.completedExecutions;
    if (0 === t) this.executionStats.averageExecutionTime = e;
    else {
      const i = this.executionStats.averageExecutionTime * t;
      this.executionStats.averageExecutionTime = (i + e) / (t + 1);
    }
  }
  updateQueueWaitTime(e) {
    const t =
      this.executionStats.queueWaitTime * this.executionStats.totalExecutions;
    this.executionStats.queueWaitTime =
      (t + e) / (this.executionStats.totalExecutions + 1);
  }
  handleExecutionSuccess(e, t) {
    if (t && 'failed' === t.status)
      (this.executionStats.failedExecutions++,
        this.updateCircuitBreaker(!1),
        logger_1.logger.error(`Execution ${e} failed: ${t.error}`));
    else {
      if (
        (this.executionStats.completedExecutions++,
        this.updateCircuitBreaker(!0),
        this.updateResourceUsage(t),
        t.startTime && t.endTime)
      ) {
        const e = t.endTime.getTime() - t.startTime.getTime();
        e > 0 && this.updateExecutionTime(e);
      }
      logger_1.logger.debug(`Execution ${e} completed successfully`);
    }
  }
  handleExecutionFailure(e, t) {
    (this.executionStats.failedExecutions++,
      this.updateCircuitBreaker(!1),
      logger_1.logger.error(`Execution ${e} failed:`, t));
  }
  async cancelExecution(e) {
    const t = this.executionQueue.findIndex(
      t => this.getExecutionId(t.context) === e
    );
    if (-1 !== t) {
      return (
        this.executionQueue
          .splice(t, 1)[0]
          .reject(new Error('Execution cancelled')),
        this.executionStats.queuedExecutions--,
        this.executionStats.cancelledExecutions++,
        !0
      );
    }
    if (this.activeExecutions.has(e)) {
      const t = await this.workflowExecutor.cancelExecution(e);
      return (t && this.executionStats.cancelledExecutions++, t);
    }
    return !1;
  }
  async cancelAllExecutions() {
    let e = 0;
    const t = this.executionQueue.splice(0);
    for (const i of t) (i.reject(new Error('Execution cancelled')), e++);
    this.executionStats.queuedExecutions = 0;
    const i = Array.from(this.activeExecutions.keys());
    for (const t of i) {
      (await this.workflowExecutor.cancelExecution(t)) && e++;
    }
    return ((this.executionStats.cancelledExecutions += e), e);
  }
  async getStatistics() {
    const e = this.executionStats.completedExecutions,
      t = Math.max(1e3, Date.now() - this.startTime);
    return (
      (this.executionStats.throughput = e / (t / 6e4)),
      { ...this.executionStats }
    );
  }
  async getExecutionStatistics() {
    return this.getStatistics();
  }
  async updateConfiguration(e) {
    if (void 0 !== e.maxConcurrentExecutions && e.maxConcurrentExecutions <= 0)
      throw new Error(
        'Invalid configuration: maxConcurrentExecutions must be positive'
      );
    if (void 0 !== e.queueSize && e.queueSize <= 0)
      throw new Error('Invalid configuration: queueSize must be positive');
    ((this.config = { ...this.config, ...e }),
      (this.executionStats.maxConcurrentExecutions =
        this.config.maxConcurrentExecutions),
      logger_1.logger.info('Updated concurrent execution configuration', e));
  }
  getConfiguration() {
    return { ...this.config };
  }
  async cleanup() {
    for (
      this.isShuttingDown = !0,
        this.processQueueInterval && clearInterval(this.processQueueInterval);
      this.activeExecutions.size > 0;

    )
      await new Promise(e => setTimeout(e, 100));
    const e = await this.cancelAllExecutions();
    (this.activeExecutions.clear(),
      (this.executionQueue.length = 0),
      (this.executionStats = {
        totalExecutions: 0,
        completedExecutions: 0,
        failedExecutions: 0,
        cancelledExecutions: 0,
        currentlyExecuting: 0,
        queuedExecutions: 0,
        maxConcurrentExecutions: this.config.maxConcurrentExecutions,
        averageExecutionTime: 0,
        throughput: 0,
        queueWaitTime: 0,
        resourceUsage: {
          totalMemoryUsed: 0,
          totalCpuTime: 0,
          peakMemoryUsage: 0,
          peakCpuUsage: 0,
        },
      }),
      global.gc && 'test' === process.env.NODE_ENV && global.gc(),
      logger_1.logger.info(`Cleanup complete, cancelled ${e} executions`));
  }
  async shutdown() {
    await this.cleanup();
  }
}
exports.ConcurrentExecutionManager = ConcurrentExecutionManager;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.WorkflowExecutor = void 0));
const nodes_1 = require('../../nodes/index'),
  WorkflowValidator_1 = require('./WorkflowValidator'),
  ProgressTracker_1 = require('./ProgressTracker'),
  NodeIOManager_1 = require('./NodeIOManager'),
  ExecutionStrategies_1 = require('./ExecutionStrategies'),
  ExecutionManager_1 = require('./ExecutionManager'),
  logger_1 = require('../../../utils/logger'),
  AlertSystem_1 = require('./AlertSystem'),
  MemoryProfiler_1 = require('../../utils/MemoryProfiler');
class ResourceTracker {
  resourceMetrics = new Map();
  resourceCounts = new Map();
  startTracking(e) {
    (this.resourceMetrics.set(e, {
      executionId: e,
      totalResources: 0,
      cleanedResources: 0,
      leakedResources: 0,
      startTime: Date.now(),
    }),
      this.resourceCounts.set(e, 0));
  }
  trackResource(e) {
    const r = this.resourceMetrics.get(e);
    if (!r) return;
    r.totalResources++;
    const t = this.resourceCounts.get(e) || 0;
    this.resourceCounts.set(e, t + 1);
  }
  trackResourceCleanup(e) {
    const r = this.resourceMetrics.get(e);
    if (!r) return;
    r.cleanedResources++;
    const t = this.resourceCounts.get(e) || 0;
    this.resourceCounts.set(e, Math.max(0, t - 1));
  }
  finishTracking(e) {
    const r = this.resourceMetrics.get(e);
    if (!r) return;
    r.endTime = Date.now();
    const t = this.resourceCounts.get(e) || 0;
    return (
      (r.leakedResources = t),
      logger_1.logger.info(
        `[RESOURCE_TRACKER] Execution ${e} resource summary:`,
        {
          totalResources: r.totalResources,
          cleanedResources: r.cleanedResources,
          leakedResources: r.leakedResources,
          duration: r.endTime - r.startTime,
        }
      ),
      r
    );
  }
  getResourceMetrics(e) {
    return this.resourceMetrics.get(e);
  }
  getCurrentResourceCount(e) {
    return this.resourceCounts.get(e) || 0;
  }
  cleanup(e) {
    (this.resourceMetrics.delete(e), this.resourceCounts.delete(e));
  }
}
class PerformanceTracker {
  metrics = new Map();
  startTracking(e, r) {
    const t = process.memoryUsage().heapUsed;
    this.metrics.set(e, {
      executionId: e,
      startTime: Date.now(),
      nodeCount: r,
      successfulNodes: 0,
      failedNodes: 0,
      averageNodeTime: 0,
      peakMemoryUsage: t,
      initialMemoryUsage: t,
      memoryDelta: 0,
      nodeExecutionTimes: new Map(),
      nodePerformanceProblems: [],
    });
  }
  trackNodeExecution(e, r, t, o) {
    const s = this.metrics.get(e);
    if (!s) return;
    (s.nodeExecutionTimes.set(r, t),
      o ? s.successfulNodes++ : s.failedNodes++,
      t > 3e4 &&
        s.nodePerformanceProblems.push(`Node ${r} took ${t}ms (>30s)`));
    const a = Array.from(s.nodeExecutionTimes.values()).reduce(
      (e, r) => e + r,
      0
    );
    s.averageNodeTime = a / s.nodeExecutionTimes.size;
    const n = process.memoryUsage().heapUsed;
    (n > s.peakMemoryUsage && (s.peakMemoryUsage = n),
      n > 2 * s.initialMemoryUsage &&
        s.nodePerformanceProblems.push(
          `Memory usage doubled during node ${r} execution`
        ));
  }
  finishTracking(e, r) {
    const t = this.metrics.get(e);
    if (t)
      return (
        (t.endTime = Date.now()),
        (t.totalDuration = t.endTime - t.startTime),
        (t.memoryDelta = t.peakMemoryUsage - t.initialMemoryUsage),
        (t.resourceMetrics = r),
        logger_1.logger.info(`[PERFORMANCE] Execution ${e} completed:`, {
          duration: t.totalDuration,
          nodes: t.nodeCount,
          success: t.successfulNodes,
          failed: t.failedNodes,
          avgNodeTime: Math.round(t.averageNodeTime),
          memoryDelta: Math.round(t.memoryDelta / 1024 / 1024) + 'MB',
          problems: t.nodePerformanceProblems,
          resourceLeaks: r?.leakedResources || 0,
        }),
        t
      );
  }
  getMetrics(e) {
    return this.metrics.get(e);
  }
  cleanup(e) {
    this.metrics.delete(e);
  }
}
class WorkflowExecutor {
  registry;
  validator;
  progressTracker;
  nodeIOManager;
  executionStrategies;
  executionManager;
  performanceTracker;
  resourceTracker;
  alertSystem;
  memoryProfiler = MemoryProfiler_1.MemoryProfiler.getInstance();
  workflowTimeout = 3e5;
  constructor() {
    ((this.registry = nodes_1.NodeRegistry.getInstance()),
      (this.validator = new WorkflowValidator_1.WorkflowValidator()),
      (this.progressTracker = new ProgressTracker_1.ProgressTracker()),
      (this.nodeIOManager = new NodeIOManager_1.NodeIOManager()),
      (this.executionStrategies = new ExecutionStrategies_1.ExecutionStrategies(
        this.nodeIOManager,
        this.progressTracker
      )),
      (this.executionManager = new ExecutionManager_1.ExecutionManager(
        this.progressTracker
      )),
      (this.performanceTracker = new PerformanceTracker()),
      (this.resourceTracker = new ResourceTracker()),
      (this.alertSystem = new AlertSystem_1.AlertSystem({
        onAlert: e => {
          logger_1.logger.warn(
            `[WORKFLOW_ALERT] ${e.level.toUpperCase()}: ${e.message}`,
            {
              alertId: e.id,
              executionId: e.executionId,
              type: e.type,
              timestamp: e.timestamp,
              metadata: e.metadata,
            }
          );
        },
      })));
  }
  async executeWorkflowAsync(e, r, t, o = {}) {
    this.executeWorkflow(e, r, t, o).catch(e => {
      logger_1.logger.error('Background workflow execution error:', e);
    });
  }
  async executeWorkflow(e, r, t, o = {}) {
    const s =
      o.executionId ||
      `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.memoryProfiler.trackWorkflowPhase(s, 'start');
    const a = new AbortController(),
      n = {
        workflowId: e.id,
        executionId: s,
        status: 'pending',
        startTime: new Date(),
        nodeResults: new Map(),
        nodeStatuses: new Map(),
        progress: 0,
      };
    let c;
    (this.executionManager.createExecution(s, n),
      this.executionManager.registerActiveExecution(s, a),
      this.performanceTracker.startTracking(s, e.nodes.length),
      this.resourceTracker.startTracking(s));
    let i = !1;
    if (o.timeout || this.workflowTimeout) {
      const e = o.timeout || this.workflowTimeout;
      c = setTimeout(() => {
        (logger_1.logger.warn(`Workflow ${s} timed out after ${e}ms`),
          (i = !0),
          (n.status = 'failed'),
          (n.error = 'Workflow execution timed out'),
          a.abort());
      }, e);
    }
    try {
      ((n.status = 'running'), this.validator.validateWorkflow(e));
      const c = this.executionManager.getNodeInstances(s);
      for (const r of e.nodes) {
        try {
          const e = this.registry.createNode({
            id: r.id,
            type: r.type,
            label: r.label,
            parameters: r.parameters,
          });
          c.set(r.id, e);
        } catch (e) {
          logger_1.logger.error(
            `[WORKFLOW] Failed to create node ${r.id} of type ${r.type}:`,
            e
          );
          const t = e instanceof Error ? e.message : String(e);
          throw new Error(
            `Cannot create node ${r.id}: ${t}. Available types: ${Array.from(this.registry.getNodeTypes()).join(', ')}`
          );
        }
        n.nodeStatuses.set(r.id, {
          nodeId: r.id,
          state: nodes_1.NodeState.IDLE,
          progress: 0,
        });
      }
      const u = this.validator.buildExecutionOrder(e),
        l = {
          executionOrder: u,
          workflow: e,
          nodeInstances: c,
          nodeOutputs: new Map(),
          initialInput: r,
          context: t,
          result: n,
          options: o,
          signal: a.signal,
          performanceTracker: this.performanceTracker,
          resourceTracker: this.resourceTracker,
        };
      if (
        (o.onProgress && o.onProgress(s, 0, n.nodeStatuses),
        o.parallel
          ? await this.executionStrategies.executeParallel(l)
          : await this.executionStrategies.executeSequential(l),
        !a.signal.aborted && !i)
      ) {
        const r = Array.from(n.nodeStatuses.values()).every(
            e => e.state === nodes_1.NodeState.COMPLETED
          ),
          t = n.nodeResults.size === e.nodes.length,
          a = Array.from(n.nodeStatuses.values()).every(e => !e.error);
        (logger_1.logger.debug('Workflow completion validation:', {
          allNodesCompleted: r,
          allResultsPresent: t,
          noNodeErrors: a,
          nodeResultsCount: n.nodeResults.size,
          expectedNodes: e.nodes.length,
        }),
          r && t && a
            ? ((n.status = 'completed'),
              (n.progress = 100),
              o.onProgress && o.onProgress(s, 100, n.nodeStatuses),
              this.progressTracker.sendExecutionComplete(
                s,
                'completed',
                void 0,
                n.nodeResults
              ))
            : ((n.status = 'failed'),
              (n.error =
                "Workflow incomplete: some nodes failed or didn't complete"),
              this.progressTracker.sendExecutionComplete(
                s,
                'failed',
                n.error,
                n.nodeResults
              )));
      }
      n.endTime = new Date();
      const g = this.resourceTracker.finishTracking(s),
        d = this.performanceTracker.finishTracking(s, g);
      d &&
        ((n.metadata = { ...n.metadata, performanceMetrics: d }),
        this.alertSystem.checkPerformanceMetrics(d));
    } catch (e) {
      const r = (e instanceof Error ? e.message : String(e))
        .toLowerCase()
        .includes('workflow cancelled');
      if (i || (!r && !a.signal.aborted)) {
        if (!i) {
          logger_1.logger.error(`[WORKFLOW ${s}] Failed with error:`, e);
          const r = e instanceof Error ? e.message : 'Unknown error';
          (r.toLowerCase().includes('memory') &&
            logger_1.logger.error(
              `[WORKFLOW ${s}] Memory exhaustion detected`,
              { error: r, executionId: s }
            ),
            e instanceof Error &&
              (logger_1.logger.error('Error stack:', e.stack),
              logger_1.logger.error('Error details:', {
                message: e.message,
                name: e.name,
                nodeId: e.nodeId,
                executionId: s,
              })),
            (n.status = 'failed'),
            (n.error = r));
        }
      } else
        (logger_1.logger.info(`[WORKFLOW ${s}] WORKFLOW CANCELLED`),
          (n.status = 'cancelled'),
          (n.error = n.error || 'Workflow cancelled by user'));
      ((n.endTime = new Date()),
        this.memoryProfiler.trackWorkflowPhase(s, 'end'),
        this.memoryProfiler.logMemoryReport(`Workflow ${s} completion`));
      const t = this.resourceTracker.finishTracking(s),
        o = this.performanceTracker.finishTracking(s, t);
      (o &&
        ((n.metadata = { ...n.metadata, performanceMetrics: o }),
        this.alertSystem.checkPerformanceMetrics(o)),
        this.progressTracker.sendExecutionComplete(s, n.status, n.error));
    } finally {
      (c && clearTimeout(c),
        await this.cleanupNodeResources(s),
        this.executionManager.cleanupExecution(s),
        this.performanceTracker.cleanup(s),
        this.resourceTracker.cleanup(s),
        this.memoryProfiler.trackWorkflowPhase(s, 'cleanup'),
        this.memoryProfiler.logMemoryReport(`Workflow ${s} cleanup completed`),
        global.gc && 'test' === process.env.NODE_ENV && global.gc());
    }
    return n;
  }
  getExecutionResult(e) {
    return this.executionManager.getExecutionResult(e);
  }
  cancelExecution(e) {
    return this.executionManager.cancelExecution(e);
  }
  getExecutionStatus(e) {
    return this.executionManager.getExecutionStatus(e);
  }
  getActiveExecutions() {
    return this.executionManager.getActiveExecutions();
  }
  getPerformanceMetrics(e) {
    return this.performanceTracker.getMetrics(e);
  }
  trackNodePerformance(e, r, t, o) {
    this.performanceTracker.trackNodeExecution(e, r, t, o);
  }
  getAlertSystem() {
    return this.alertSystem;
  }
  getResourceTracker() {
    return this.resourceTracker;
  }
  getResourceMetrics(e) {
    return this.resourceTracker.getResourceMetrics(e);
  }
  trackResource(e) {
    this.resourceTracker.trackResource(e);
  }
  trackResourceCleanup(e) {
    this.resourceTracker.trackResourceCleanup(e);
  }
  async cleanupNodeResources(e) {
    const r = this.executionManager.getNodeInstances(e);
    if (!r) return;
    const t = [];
    for (const [e, o] of r)
      t.push(
        o.cleanup().catch(r => {
          logger_1.logger.error(`Failed to cleanup node ${e}:`, r);
        })
      );
    await Promise.all(t);
    for (const [e] of r) this.registry.removeNode(e);
    r.clear();
  }
}
exports.WorkflowExecutor = WorkflowExecutor;

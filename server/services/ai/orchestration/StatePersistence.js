'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.StatePersistence = void 0));
const logger_1 = require('../../../utils/logger'),
  nodes_1 = require('../../nodes/index');
class StatePersistence {
  stateCache = new Map();
  cacheAccessTime = new Map();
  lockMap = new Map();
  maxCacheSize = 1e3;
  constructor() {}
  evictOldestCacheEntry() {
    if (this.stateCache.size < this.maxCacheSize) return;
    let e = null,
      t = Date.now();
    for (const [s, a] of this.cacheAccessTime.entries())
      a < t && ((t = a), (e = s));
    e &&
      (this.stateCache.delete(e),
      this.cacheAccessTime.delete(e),
      logger_1.logger.debug(
        `[StatePersistence] Evicted oldest cache entry: ${e}`
      ));
  }
  updateCacheAccess(e) {
    this.cacheAccessTime.set(e, Date.now());
  }
  async withLock(e, t) {
    const s = this.lockMap.get(e);
    s && (await s);
    const a = (async () => {
      try {
        return await t();
      } finally {
        this.lockMap.delete(e);
      }
    })();
    return (
      this.lockMap.set(
        e,
        a.then(
          () => {},
          () => {}
        )
      ),
      await a
    );
  }
  async saveWorkflowState(e, t) {
    if (!e.executionId) throw new Error('Invalid execution ID');
    return this.withLock(e.executionId, async () => {
      const s = {
        executionId: e.executionId,
        workflowId: e.workflowId,
        status: e.status,
        startTime: e.startTime,
        endTime: e.endTime,
        progress: e.progress,
        nodeStatuses: e.nodeStatuses,
        metadata: e.metadata,
        error: e.error,
        saveTime: t || new Date(),
      };
      (await this.writeStateToStorage(s),
        logger_1.logger.debug(
          `Saved workflow state for execution ${e.executionId}`
        ));
    });
  }
  async updateWorkflowState(e, t) {
    return this.withLock(e, async () => {
      const s = await this.getWorkflowState(e);
      if (!s) throw new Error(`Workflow state not found for execution ${e}`);
      const a = {
        ...s,
        ...t,
        lastUpdateTime: new Date(),
        saveTime: new Date(),
      };
      (this.evictOldestCacheEntry(),
        this.stateCache.set(e, a),
        this.updateCacheAccess(e),
        logger_1.logger.debug(`Updated workflow state for execution ${e}`));
    });
  }
  async getWorkflowState(e) {
    const t = this.stateCache.get(e) || null;
    return (t && this.updateCacheAccess(e), t);
  }
  async recoverWorkflowState(e) {
    const t = await this.getWorkflowState(e);
    if (!t) return null;
    try {
      if (t.metadata?.corrupted)
        return {
          executionId: e,
          canResume: !1,
          completedNodes: [],
          pendingNodes: [],
          lastKnownProgress: 0,
          error: `State corrupted: ${t.metadata.rawData || 'Unknown corruption'}`,
        };
      const s = [],
        a = [];
      let r;
      for (const [e, o] of Array.from(t.nodeStatuses.entries()))
        o.state === nodes_1.NodeState.COMPLETED
          ? s.push(e)
          : (o.state !== nodes_1.NodeState.EXECUTING &&
              o.state !== nodes_1.NodeState.IDLE) ||
            (a.push(e),
            r || o.state !== nodes_1.NodeState.EXECUTING || (r = e));
      const o = 'running' === t.status || 'pending' === t.status;
      return {
        executionId: e,
        canResume: o,
        completedNodes: s,
        pendingNodes: a,
        resumeFromNode: r,
        failureReason:
          'failed' === t.status && t.error ? String(t.error) : void 0,
        lastKnownProgress: t.progress,
      };
    } catch (t) {
      return {
        executionId: e,
        canResume: !1,
        completedNodes: [],
        pendingNodes: [],
        lastKnownProgress: 0,
        error: `State corrupted: ${t instanceof Error ? t.message : 'Unknown error'}`,
      };
    }
  }
  async getActiveExecutions() {
    return Array.from(this.stateCache.values()).filter(
      e => 'running' === e.status
    );
  }
  async getWorkflowStates(e) {
    return Array.from(this.stateCache.values()).filter(t => t.workflowId === e);
  }
  async getWorkflowStatesByStatus(e) {
    return Array.from(this.stateCache.values()).filter(t => t.status === e);
  }
  async getExecutionStatistics() {
    const e = Array.from(this.stateCache.values()),
      t = {
        total: e.length,
        completed: 0,
        running: 0,
        failed: 0,
        cancelled: 0,
        totalExecutionTime: 0,
      };
    let s = 0,
      a = 0;
    for (const r of e) {
      switch (r.status) {
        case 'completed':
          t.completed++;
          break;
        case 'running':
          t.running++;
          break;
        case 'failed':
          t.failed++;
          break;
        case 'cancelled':
          t.cancelled++;
      }
      if (r.endTime) {
        ((s += r.endTime.getTime() - r.startTime.getTime()), a++);
      }
    }
    return (
      (t.totalExecutionTime = s),
      (t.averageExecutionTime = a > 0 ? s / a : 0),
      t
    );
  }
  async cleanupOldStates(e) {
    const t = new Date(Date.now() - e);
    let s = 0;
    const a = [];
    for (const [e, s] of Array.from(this.stateCache.entries()))
      s.saveTime < t && a.push(e);
    for (const e of a) (this.stateCache.delete(e), s++);
    return s;
  }
  async saveRawState(e, t) {
    const s = {
      executionId: e,
      workflowId: 'corrupted',
      status: 'failed',
      startTime: new Date(),
      progress: 0,
      nodeStatuses: new Map(),
      saveTime: new Date(Date.now() - 72e5),
      metadata: { corrupted: !0, rawData: t },
    };
    (this.evictOldestCacheEntry(),
      this.stateCache.set(e, s),
      this.updateCacheAccess(e));
  }
  async writeStateToStorage(e) {
    (this.evictOldestCacheEntry(),
      this.stateCache.set(e.executionId, e),
      this.updateCacheAccess(e.executionId));
  }
  async cleanup() {
    (this.stateCache.clear(),
      this.cacheAccessTime.clear(),
      this.lockMap.clear());
  }
}
exports.StatePersistence = StatePersistence;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ExecutionManager = void 0));
const logger_1 = require('../../../utils/logger');
class ExecutionManager {
  progressTracker;
  executionResults;
  activeExecutions;
  nodeInstances;
  constructor(e) {
    ((this.progressTracker = e),
      (this.executionResults = new Map()),
      (this.activeExecutions = new Map()),
      (this.nodeInstances = new Map()));
  }
  createExecution(e, t) {
    this.executionResults.set(e, t);
  }
  registerActiveExecution(e, t) {
    (this.activeExecutions.set(e, t), this.nodeInstances.set(e, new Map()));
  }
  getNodeInstances(e) {
    return this.nodeInstances.get(e);
  }
  cleanupExecution(e) {
    (this.activeExecutions.delete(e),
      this.nodeInstances.delete(e),
      this.executionResults.delete(e));
  }
  getExecutionResult(e) {
    return this.executionResults.get(e);
  }
  cancelExecution(e) {
    const t = this.activeExecutions.get(e);
    if (!t) return !1;
    (logger_1.logger.info(`[WORKFLOW ${e}] WORKFLOW CANCELLED`), t.abort());
    const s = this.executionResults.get(e);
    return (
      s &&
        'running' === s.status &&
        ((s.status = 'cancelled'),
        (s.endTime = new Date()),
        this.progressTracker.sendExecutionComplete(
          e,
          'cancelled',
          'Workflow cancelled by user'
        )),
      this.activeExecutions.delete(e),
      !0
    );
  }
  getExecutionStatus(e) {
    const t = this.executionResults.get(e);
    return t ? Array.from(t.nodeStatuses.values()) : [];
  }
  getActiveExecutions() {
    return Array.from(this.activeExecutions.keys());
  }
}
exports.ExecutionManager = ExecutionManager;

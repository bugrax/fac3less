'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.BaseNode = exports.NodeState = void 0));
const DataTypes_1 = require('../../../shared/types/DataTypes'),
  logger_1 = require('../../../utils/logger');
var NodeState;
!(function (t) {
  ((t.IDLE = 'idle'),
    (t.VALIDATING = 'validating'),
    (t.EXECUTING = 'executing'),
    (t.COMPLETED = 'completed'),
    (t.FAILED = 'failed'),
    (t.CANCELLED = 'cancelled'));
})(NodeState || (exports.NodeState = NodeState = {}));
class BaseNode {
  config;
  state = NodeState.IDLE;
  progress = 0;
  startTime;
  endTime;
  lastError;
  onProgressCallback;
  constructor(config) {
    ((this.config = config),
      this.config.ports || (this.config.ports = this.defineDefaultPorts()));
  }
  validate(t) {
    if (!this.config.ports) return null;
    for (const e of this.config.ports.inputs) {
      const r = t[e.name],
        s = (0, DataTypes_1.validatePortValue)(e, r);
      if (s) return s;
    }
    return this.validateCustom(t);
  }
  validateCustom(t) {
    return null;
  }
  async executeWithStateTracking(t, e, r) {
    ((this.onProgressCallback = r), this.setState(NodeState.VALIDATING));
    const s = this.validate(t);
    if (s)
      return (
        this.setState(NodeState.FAILED),
        (this.lastError = s),
        { success: !1, error: s }
      );
    (this.setState(NodeState.EXECUTING),
      (this.startTime = new Date()),
      (this.progress = 0));
    try {
      if (e.signal?.aborted) throw new Error('Workflow cancelled');
      const r = await this.execute(t, e);
      return (
        r.success
          ? (this.setState(NodeState.COMPLETED), (this.progress = 100))
          : (this.setState(NodeState.FAILED), (this.lastError = r.error)),
        (this.endTime = new Date()),
        (this.onProgressCallback = void 0),
        r
      );
    } catch (r) {
      const s = r instanceof Error ? r : new Error(String(r)),
        o = this.createEnhancedErrorContext(s, e, t);
      logger_1.logger.error(`Error executing node ${this.config.id}`, o);
      const i = this.createUserFriendlyError(s, e, t);
      (this.setState(NodeState.FAILED),
        (this.endTime = new Date()),
        (this.lastError = i),
        (this.onProgressCallback = void 0));
      const a = r;
      if (
        'RATE_LIMIT_ERROR' === a?.code ||
        'ETIMEDOUT' === a?.code ||
        'ECONNRESET' === a?.code ||
        'ECONNREFUSED' === a?.code
      )
        throw r;
      return { success: !1, error: this.lastError };
    }
  }
  async updateProgress(t) {
    if (
      ((this.progress = Math.max(0, Math.min(100, t))), this.onProgressCallback)
    ) {
      const t = this.onProgressCallback(this.progress);
      t instanceof Promise && (await t);
    }
  }
  setState(t) {
    this.state = t;
  }
  getState() {
    return this.state;
  }
  getProgress() {
    return this.progress;
  }
  getExecutionTime() {
    return this.startTime && this.endTime
      ? this.endTime.getTime() - this.startTime.getTime()
      : null;
  }
  getConfig() {
    return this.config;
  }
  getId() {
    return this.config.id;
  }
  getType() {
    return this.config.type;
  }
  getInputPorts() {
    return this.config.ports?.inputs || [];
  }
  getOutputPorts() {
    return this.config.ports?.outputs || [];
  }
  hasInputPort(t) {
    return this.getInputPorts().some(e => e.name === t);
  }
  hasOutputPort(t) {
    return this.getOutputPorts().some(e => e.name === t);
  }
  emit(t, e) {}
  getInputPort(t) {
    return this.getInputPorts().find(e => e.name === t);
  }
  getOutputPort(t) {
    return this.getOutputPorts().find(e => e.name === t);
  }
  setProgressCallback(t) {
    this.onProgressCallback = t;
  }
  reset() {
    ((this.state = NodeState.IDLE),
      (this.progress = 0),
      (this.startTime = void 0),
      (this.endTime = void 0),
      (this.lastError = void 0));
  }
  getLastError() {
    return this.lastError;
  }
  createEnhancedErrorContext(t, e, r) {
    const s = {
      nodeId: this.config.id,
      nodeType: this.config.type,
      nodeLabel: this.config.label,
      executionId: e.workflowId || e.sessionId || `exec_${Date.now()}`,
      userId: e.userId,
      parameters: this.config.parameters,
      timestamp: Date.now(),
      progress: this.progress,
      state: this.state,
      stackTrace: t.stack,
      originalError: t.message,
      errorCode: 'code' in t ? t.code : void 0,
      retryable: this.isRetryableError(t),
    };
    return (r && (s.inputData = this.sanitizeInputForLogging(r)), s);
  }
  createUserFriendlyError(t, e, r) {
    const s = this.createEnhancedErrorContext(t, e, r);
    return [
      `Node "${this.config.label}" (${this.config.type}) failed:`,
      `  Error: ${t.message}`,
      `  Node ID: ${this.config.id}`,
      `  Execution ID: ${s.executionId}`,
      `  Progress: ${this.progress}%`,
      `  State: ${this.state}`,
      s.errorCode ? `  Error Code: ${s.errorCode}` : null,
      s.retryable ? '  Retryable: Yes' : '  Retryable: No',
      `  Timestamp: ${new Date(s.timestamp).toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n');
  }
  isRetryableError(t) {
    return [
      'RATE_LIMIT_ERROR',
      'ETIMEDOUT',
      'ECONNRESET',
      'ECONNREFUSED',
      'ENOTFOUND',
      'EHOSTUNREACH',
      'ENETUNREACH',
      'ECONNABORTED',
    ].includes(t.code || '');
  }
  sanitizeInputForLogging(t) {
    const e = {};
    for (const [r, s] of Object.entries(t))
      if (this.isSensitiveField(r)) e[r] = '[REDACTED]';
      else if ('object' == typeof s && null !== s) {
        const t = JSON.stringify(s);
        t.length > 1e3 ? (e[r] = t.substring(0, 997) + '...') : (e[r] = s);
      } else e[r] = s;
    return e;
  }
  isSensitiveField(t) {
    return [
      'password',
      'token',
      'apiKey',
      'secret',
      'key',
      'auth',
      'authorization',
      'credential',
      'private',
    ].some(e => t.toLowerCase().includes(e));
  }
  async cleanup() {}
}
exports.BaseNode = BaseNode;

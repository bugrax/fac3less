'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.AlertSystem = exports.AlertLevel = exports.AlertType = void 0));
const logger_1 = require('../../../utils/logger');
var AlertType, AlertLevel;
(!(function (e) {
  ((e.PERFORMANCE_DEGRADATION = 'performance_degradation'),
    (e.MEMORY_LEAK = 'memory_leak'),
    (e.HIGH_FAILURE_RATE = 'high_failure_rate'),
    (e.WORKFLOW_TIMEOUT = 'workflow_timeout'),
    (e.RESOURCE_LEAK = 'resource_leak'),
    (e.ANOMALY_DETECTED = 'anomaly_detected'));
})(AlertType || (exports.AlertType = AlertType = {})),
  (function (e) {
    ((e.WARNING = 'warning'), (e.CRITICAL = 'critical'), (e.INFO = 'info'));
  })(AlertLevel || (exports.AlertLevel = AlertLevel = {})));
class AlertSystem {
  rules = new Map();
  alertHistory = new Map();
  config;
  throttleWindowMs;
  alertCounter = 0;
  constructor(config) {
    ((this.config = config),
      (this.throttleWindowMs = config.throttleWindowMs || 6e4),
      this.initializeDefaultRules());
  }
  initializeDefaultRules() {
    (this.addRule({
      id: 'slow_node_warning',
      type: AlertType.PERFORMANCE_DEGRADATION,
      condition: e =>
        e.nodePerformanceProblems.some(
          e => e.includes('took') && e.includes('ms (>30s)')
        ),
      level: AlertLevel.WARNING,
      message: 'Node execution time exceeded 30 seconds',
    }),
      this.addRule({
        id: 'slow_node_critical',
        type: AlertType.PERFORMANCE_DEGRADATION,
        condition: e =>
          e.nodePerformanceProblems.some(e => {
            const t = e.match(/took (\d+)ms/);
            return t && parseInt(t[1]) > 6e4;
          }),
        level: AlertLevel.CRITICAL,
        message: 'Node execution time exceeded 60 seconds',
      }),
      this.addRule({
        id: 'memory_leak_warning',
        type: AlertType.MEMORY_LEAK,
        condition: e =>
          e.nodePerformanceProblems.some(e =>
            e.includes('Memory usage doubled')
          ),
        level: AlertLevel.WARNING,
        message: 'Memory usage doubled during node execution',
      }),
      this.addRule({
        id: 'high_failure_rate_critical',
        type: AlertType.HIGH_FAILURE_RATE,
        condition: e => e.failedNodes / e.nodeCount > 0.25,
        level: AlertLevel.CRITICAL,
        message: 'Critical failure rate detected',
      }),
      this.addRule({
        id: 'resource_leak_warning',
        type: AlertType.RESOURCE_LEAK,
        condition: e =>
          !!(e.resourceMetrics && e.resourceMetrics.leakedResources > 0),
        level: AlertLevel.WARNING,
        message: 'Resource leak detected',
      }));
  }
  addRule(e) {
    this.rules.set(e.id, e);
  }
  removeRule(e) {
    this.rules.delete(e);
  }
  checkPerformanceMetrics(e) {
    for (const [, t] of this.rules) t.condition(e) && this.triggerAlert(t, e);
  }
  triggerAlert(e, t) {
    const r = e.id + '-' + t.executionId,
      o = Date.now(),
      s = this.alertHistory.get(r);
    if (s && o - s < this.throttleWindowMs) return;
    this.alertCounter++;
    const l = {
      id: 'alert_' + o + '_' + this.alertCounter,
      type: e.type,
      level: e.level,
      message: this.formatAlertMessage(e, t),
      executionId: t.executionId,
      timestamp: o,
      metadata: {
        ruleId: e.id,
        nodeCount: t.nodeCount,
        failedNodes: t.failedNodes,
        successfulNodes: t.successfulNodes,
        totalDuration: t.totalDuration,
        averageNodeTime: t.averageNodeTime,
        memoryDelta: t.memoryDelta,
        peakMemoryUsage: t.peakMemoryUsage,
      },
    };
    (this.alertHistory.set(r, o),
      this.cleanupAlertHistory(),
      logger_1.logger.warn(
        '[ALERT] ' + l.level.toUpperCase() + ': ' + l.message,
        {
          alertId: l.id,
          executionId: l.executionId,
          type: l.type,
          metadata: l.metadata,
        }
      ),
      this.config.onAlert(l));
  }
  formatAlertMessage(e, t) {
    switch (e.type) {
      case AlertType.PERFORMANCE_DEGRADATION: {
        const e = t.nodePerformanceProblems.find(
          e => e.includes('took') && e.includes('ms')
        );
        return e
          ? 'Performance degradation: ' + e
          : 'Performance degradation: Average node time ' +
              Math.round(t.averageNodeTime) +
              'ms';
      }
      case AlertType.MEMORY_LEAK: {
        const e = t.nodePerformanceProblems.find(e =>
          e.includes('Memory usage')
        );
        return e
          ? 'Memory leak detected: ' + e
          : 'Memory leak detected: Memory increased by ' +
              Math.round(t.memoryDelta / 1024 / 1024) +
              'MB';
      }
      case AlertType.HIGH_FAILURE_RATE:
        return (
          'High failure rate: ' +
          Math.round((t.failedNodes / t.nodeCount) * 100) +
          '% of nodes failed (' +
          t.failedNodes +
          '/' +
          t.nodeCount +
          ')'
        );
      case AlertType.RESOURCE_LEAK:
        return t.resourceMetrics
          ? 'Resource leak: ' +
              t.resourceMetrics.leakedResources +
              ' resources not cleaned up (' +
              t.resourceMetrics.cleanedResources +
              '/' +
              t.resourceMetrics.totalResources +
              ' cleaned)'
          : 'Resource leak detected';
      default:
        return e.message;
    }
  }
  async createAlert(e) {
    (logger_1.logger.warn(
      '[ALERT] ' + e.level.toUpperCase() + ': ' + e.message,
      {
        alertId: e.id,
        executionId: e.executionId,
        type: e.type,
        metadata: e.metadata,
      }
    ),
      this.config.onAlert(e));
  }
  cleanupAlertHistory() {
    const e = Date.now() - this.throttleWindowMs;
    for (const [t, r] of this.alertHistory)
      r < e && this.alertHistory.delete(t);
  }
  getAlertStats() {
    const e = Date.now() - this.throttleWindowMs;
    return {
      totalRules: this.rules.size,
      recentAlerts: Array.from(this.alertHistory.values()).filter(t => t > e)
        .length,
      throttledAlerts: this.alertHistory.size,
    };
  }
  clearAlertHistory() {
    this.alertHistory.clear();
  }
}
exports.AlertSystem = AlertSystem;

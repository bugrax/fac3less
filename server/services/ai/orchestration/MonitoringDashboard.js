'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.MonitoringDashboard = void 0));
const logger_1 = require('../../../utils/logger'),
  nodes_1 = require('../../nodes/index');
class MonitoringDashboard {
  workflowExecutor;
  historyProvider;
  alertProvider;
  alertAcknowledger;
  customMetricAggregator;
  webSocketServer;
  realtimeInterval;
  connectedClients = new Set();
  configuration;
  constructor(e) {
    ((this.workflowExecutor = e),
      (this.configuration = {
        refreshInterval: 2e3,
        maxHistoryItems: 500,
        alertThresholds: { criticalAlerts: 5, degradedExecutions: 10 },
      }));
  }
  async getRealtimeMetrics() {
    try {
      const e = this.workflowExecutor.getActiveExecutions(),
        t = this.workflowExecutor.getAlertSystem().getAlertStats();
      let r = 0,
        o = 0,
        s = 0,
        i = 0,
        a = 0,
        n = 0,
        c = 0;
      for (const t of e) {
        const e = this.workflowExecutor.getExecutionResult(t);
        if (e) {
          r += e.nodeStatuses.size;
          for (const [, t] of Array.from(e.nodeStatuses.entries()))
            switch (t.state) {
              case nodes_1.NodeState.COMPLETED:
                o++;
                break;
              case nodes_1.NodeState.EXECUTING:
                s++;
                break;
              case nodes_1.NodeState.FAILED:
                i++;
            }
        }
        const l = this.workflowExecutor.getPerformanceMetrics(t);
        l &&
          ((a += l.peakMemoryUsage),
          (n = Math.max(n, l.peakMemoryUsage)),
          (c += l.memoryDelta));
      }
      const l = this.calculateSystemHealth(e.length, t.recentAlerts);
      return {
        activeExecutions: e.length,
        totalNodes: r,
        completedNodes: o,
        runningNodes: s,
        failedNodes: i,
        systemHealth: l,
        memoryUsage: { current: a, peak: n, delta: c },
        alertStats: t,
        timestamp: Date.now(),
      };
    } catch (e) {
      return (
        logger_1.logger.error('Failed to get realtime metrics:', e),
        {
          activeExecutions: 0,
          totalNodes: 0,
          completedNodes: 0,
          runningNodes: 0,
          failedNodes: 0,
          systemHealth: 'error',
          memoryUsage: { current: 0, peak: 0, delta: 0 },
          alertStats: { totalRules: 0, recentAlerts: 0, throttledAlerts: 0 },
          timestamp: Date.now(),
          error: e instanceof Error ? e.message : 'Unknown error',
        }
      );
    }
  }
  calculateSystemHealth(e, t) {
    return t >= this.configuration.alertThresholds.criticalAlerts
      ? 'critical'
      : e >= this.configuration.alertThresholds.degradedExecutions
        ? 'degraded'
        : 'healthy';
  }
  async getExecutionHistory(e) {
    if (!this.historyProvider) return [];
    return (await this.historyProvider(e)).filter(
      t =>
        (!e.status || t.status === e.status) &&
        (!e.workflowId || t.workflowId === e.workflowId)
    );
  }
  async getPerformanceTrends(e) {
    if (!this.historyProvider)
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
    const t = await this.historyProvider({
        startTime: e.startTime,
        endTime: e.endTime,
        limit: this.configuration.maxHistoryItems,
      }),
      r = t.reduce((e, t) => e + t.duration, 0),
      o = t.length > 0 ? r / t.length : 0,
      s = t.reduce((e, t) => e + t.nodeCount, 0),
      i = t.reduce((e, t) => e + t.successfulNodes, 0),
      a = s > 0 ? i / s : 0,
      n = t.length,
      c = t.map(e => ({
        timestamp: e.startTime.getTime(),
        executionTime: e.duration,
        successRate: e.nodeCount > 0 ? e.successfulNodes / e.nodeCount : 0,
        throughput: 1,
      })),
      l = t.map(e => e.duration),
      d = this.calculateTrend(l);
    return {
      durationTrend: d,
      memoryTrend: 'stable',
      cpuTrend: 'stable',
      averageExecutionTime: o,
      successRate: a,
      throughput: n,
      trendData: c,
      projectedPerformance: {
        duration: o * ('increasing' === d ? 1.1 : 'decreasing' === d ? 0.9 : 1),
        memory: 0,
        cpu: 0,
      },
      alertThreshold: { duration: 1.5 * o, memory: 0, cpu: 0 },
    };
  }
  calculateTrend(e) {
    if (e.length < 2) return 'stable';
    const t = e[0],
      r = (e[e.length - 1] - t) / t;
    return r > 0.1 ? 'increasing' : r < -0.1 ? 'decreasing' : 'stable';
  }
  async getAlertHistory(e) {
    if (!this.alertProvider) return [];
    return (await this.alertProvider(e)).filter(
      t => (!e.level || t.level === e.level) && (!e.type || t.type === e.type)
    );
  }
  async acknowledgeAlert(e, t) {
    return !!this.alertAcknowledger && (await this.alertAcknowledger(e, t));
  }
  async getResourceStatistics() {
    const e = this.workflowExecutor.getActiveExecutions();
    let t = 0,
      r = 0;
    const o = [];
    for (const s of e) {
      const e = this.workflowExecutor.getResourceMetrics(s);
      if (e) {
        ((t += e.totalResources), (r += e.leakedResources));
        const i =
          e.totalResources > 0 ? e.cleanedResources / e.totalResources : 0;
        o.push({
          executionId: s,
          totalResources: e.totalResources,
          leakedResources: e.leakedResources,
          cleanupRate: i,
        });
      }
    }
    return {
      totalActiveResources: t,
      totalLeakedResources: r,
      cleanupRate: t > 0 ? (t - r) / t : 0,
      executionBreakdown: o,
    };
  }
  async startRealtimeMonitoring(e = 2e3) {
    (this.realtimeInterval && this.stopRealtimeMonitoring(),
      (this.realtimeInterval = setInterval(async () => {
        try {
          const e = await this.getRealtimeMetrics();
          this.broadcastMetrics(e);
        } catch (e) {
          logger_1.logger.error('Failed to broadcast realtime metrics:', e);
        }
      }, e)),
      logger_1.logger.info(`Started realtime monitoring with ${e}ms interval`));
  }
  stopRealtimeMonitoring() {
    this.realtimeInterval &&
      (clearInterval(this.realtimeInterval),
      (this.realtimeInterval = void 0),
      logger_1.logger.info('Stopped realtime monitoring'));
  }
  broadcastMetrics(e) {
    if (this.webSocketServer)
      try {
        this.webSocketServer.emit('metrics-update', e);
      } catch (e) {
        logger_1.logger.error('Failed to broadcast metrics via WebSocket:', e);
      }
  }
  attachWebSocketServer(e) {
    ((this.webSocketServer = e),
      e.on('connection', e => {
        (this.connectedClients.add(e.id),
          e.on('request-metrics', async () => {
            try {
              const t = await this.getRealtimeMetrics();
              e.emit('metrics-update', t);
            } catch (e) {
              logger_1.logger.error('Failed to send metrics to client:', e);
            }
          }),
          e.on('disconnect', () => {
            this.connectedClients.delete(e.id);
          }));
      }));
  }
  async getCustomMetrics(e) {
    return this.customMetricAggregator
      ? await this.customMetricAggregator(e)
      : {};
  }
  updateConfiguration(e) {
    this.configuration = { ...this.configuration, ...e };
  }
  getConfiguration() {
    return { ...this.configuration };
  }
  async exportData(e) {
    const t = this.historyProvider
      ? await this.historyProvider({
          startTime: e.startTime,
          endTime: e.endTime,
          limit: this.configuration.maxHistoryItems,
        })
      : [];
    return 'csv' === e.format ? this.exportToCsv(t) : this.exportToJson(t, e);
  }
  exportToCsv(e) {
    const t = e.map(e => [
      e.executionId,
      e.status,
      e.duration.toString(),
      e.nodeCount.toString(),
      e.successfulNodes.toString(),
      e.failedNodes.toString(),
    ]);
    return [
      [
        'executionId',
        'status',
        'duration',
        'nodeCount',
        'successfulNodes',
        'failedNodes',
      ].join(','),
      ...t.map(e => e.join(',')),
    ].join('\n');
  }
  exportToJson(e, t) {
    const r = {
      exportTime: new Date().toISOString(),
      dateRange: {
        startTime: t.startTime.toISOString(),
        endTime: t.endTime.toISOString(),
      },
      executions: e,
    };
    return JSON.stringify(r, null, 2);
  }
  setHistoryProvider(e) {
    this.historyProvider = e;
  }
  setAlertProvider(e) {
    this.alertProvider = e;
  }
  setAlertAcknowledger(e) {
    this.alertAcknowledger = e;
  }
  setCustomMetricAggregator(e) {
    this.customMetricAggregator = e;
  }
  async cleanup() {
    (this.stopRealtimeMonitoring(), this.connectedClients.clear());
  }
}
exports.MonitoringDashboard = MonitoringDashboard;

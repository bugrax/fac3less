'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.NodeExecutor = void 0));
const logger_1 = require('../../../utils/logger');
class NodeExecutor {
  async executeNode(e, r, t, o = {}) {
    const s = e.getId(),
      n = new Date();
    o.onProgress &&
      o.onProgress({
        nodeId: s,
        status: 'running',
        startTime: n,
        message: `Executing ${e.getType()} node`
      });
    try {
      const i = e.execute(r, t),
        c = o.timeout
          ? new Promise((e, r) =>
            setTimeout(
              () => r(new Error('Node execution timeout')),
              o.timeout
            )
          )
          : null,
        u = null !== c ? await Promise.race([i, c]) : await i;
      return (
        o.onProgress &&
          o.onProgress({
            nodeId: s,
            status: u.success ? 'completed' : 'failed',
            startTime: n,
            endTime: new Date(),
            error: u.error
          }),
        u
      );
    } catch (r) {
      const t = r instanceof Error ? r.message : 'Unknown error';
      return (
        logger_1.logger.error('Node execution failed', {
          nodeId: s,
          nodeType: e.getType(),
          error: t,
          stack: r instanceof Error ? r.stack : void 0,
          timeout: o.timeout,
          retries: o.retries
        }),
        o.onProgress &&
          o.onProgress({
            nodeId: s,
            status: 'failed',
            startTime: n,
            endTime: new Date(),
            error: t
          }),
        { success: !1, error: t }
      );
    }
  }
  async executeWithRetry(e, r, t, o = {}) {
    const s = o.retries || 0;
    let n;
    for (let i = 0; i <= s; i++) {
      const c = await this.executeNode(e, r, t, o);
      if (c.success) {
        return c;
      }
      if (((n = c.error), i < s)) {
        const e = 1e3 * Math.pow(2, i);
        await new Promise(r => setTimeout(r, e));
      }
    }
    return { success: !1, error: n || 'Max retries exceeded' };
  }
}
exports.NodeExecutor = NodeExecutor;

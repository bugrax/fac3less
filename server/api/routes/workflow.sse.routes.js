'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.sseConnections = void 0),
(exports.sendProgressUpdate = sendProgressUpdate),
(exports.sendNodeOutput = sendNodeOutput),
(exports.sendExecutionComplete = sendExecutionComplete));
const express_1 = require('express'),
  sse_validation_1 = require('../validation/sse.validation'),
  logger_1 = require('../../utils/logger'),
  router = (0, express_1.Router)(),
  sseConnections = new Map();
function sendProgressUpdate(e, t, n) {
  const s = sseConnections.get(e);
  if (!s) {
    return;
  }
  const o = Array.from(n.entries()).map(([e, t]) => ({
      nodeId: e,
      ...('object' === typeof t && null !== t ? t : {})
    })),
    r = o.find(e => 'generate_script' === e.nodeId);
  r && 'state' in r && r.state;
  const i = { type: 'progress', executionId: e, progress: t, nodeStatuses: o };
  (s.write(`data: ${JSON.stringify(i)}\n\n`), s.flush?.());
}
function sendNodeOutput(e, t, n, s, o = 0) {
  const r = sseConnections.get(e);
  if (!r) {
    return;
  }
  const i = {
    type: 'node-output',
    executionId: e,
    nodeId: t,
    outputType: n,
    outputData: s,
    outputIndex: o
  };
  try {
    (r.write(`data: ${JSON.stringify(i)}\n\n`), r.flush?.());
  } catch (e) {
    logger_1.logger.error('[SSE] Error sending node output:', e);
  }
}
function sendExecutionComplete(e, t) {
  const n = sseConnections.get(e);
  if (!n) {
    return;
  }
  const s = { type: 'complete', executionId: e, result: t };
  (n.write(`data: ${JSON.stringify(s)}\n\n`),
  n.flush?.(),
  setTimeout(() => {
    sseConnections.delete(e);
  }, 1e3));
}
((exports.sseConnections = sseConnections),
router.get(
  '/progress/:executionId',
  ...sse_validation_1.validateSSEProgress,
  (e, t) => {
    const { executionId: n } = e.params;
    (t.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no'
    }),
    sseConnections.set(n, t),
    t.write(
      `data: ${JSON.stringify({ type: 'connected', executionId: n })}\n\n`
    ),
    t.flush?.());
    const s = setInterval(() => {
      try {
        (t.write(':keepalive\n\n'), t.flush?.());
      } catch {
        (clearInterval(s), sseConnections.delete(n));
      }
    }, 15e3);
    e.on('close', () => {
      (clearInterval(s), sseConnections.delete(n));
    });
  }
),
(exports.default = router));

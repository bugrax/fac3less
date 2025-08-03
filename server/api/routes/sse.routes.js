'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.sseRoutes = void 0));
const express_1 = require('express'),
  generation_service_1 = require('../../../services/generation.service'),
  sse_validation_1 = require('../validation/sse.validation'),
  logger_1 = require('../../utils/logger'),
  router = (0, express_1.Router)();
(router.get(
  '/progress/:id',
  ...sse_validation_1.validateGenerationProgress,
  async (e, r) => {
    const { id: t } = e.params;
    (r.setHeader('Content-Type', 'text/event-stream'),
    r.setHeader('Cache-Control', 'no-cache'),
    r.setHeader('Connection', 'keep-alive'),
    r.setHeader('Access-Control-Allow-Origin', '*'),
    r.write(
      'data: {"type":"connected","message":"Connected to progress stream"}\n\n'
    ));
    const s = setInterval(async () => {
      try {
        const e =
          await generation_service_1.generationService.getGenerationStatus(t);
        if (!e) {
          return (
            r.write(
              'data: {"type":"error","message":"Generation not found"}\n\n'
            ),
            clearInterval(s),
            void r.end()
          );
        }
        const n = {
          type: 'progress',
          id: e.id,
          status: e.status,
          progress: e.progress,
          currentStep: e.currentStep,
          script: e.script,
          resultUrl: e.resultUrl,
          error: e.error
        };
        (r.write(`data: ${JSON.stringify(n)}\n\n`),
        ('completed' !== e.status && 'failed' !== e.status) ||
            setTimeout(() => {
              (clearInterval(s), r.end());
            }, 1e3));
      } catch (e) {
        (logger_1.logger.error('SSE error:', e),
        r.write('data: {"type":"error","message":"Server error"}\n\n'),
        clearInterval(s),
        r.end());
      }
    }, 1e3);
    e.on('close', () => {
      (clearInterval(s), r.end());
    });
  }
),
(exports.sseRoutes = router));

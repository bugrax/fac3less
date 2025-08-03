'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.createGetByIdHandler = void 0));
const logger_1 = require('../../utils/logger'),
  createGetByIdHandler =
    ({ paramName: e = 'id', entityName: r, service: t }) =>
      async (a, s, o) => {
        try {
          const o = a.params[e];
          if (!o) {
            return void s.status(400).json({
              error: 'Bad Request',
              message: `${r} ID is required`,
              timestamp: new Date().toISOString()
            });
          }
          const n = await t.getById(o);
          if (!n) {
            return void s.status(404).json({
              error: 'Not Found',
              message: `${r} with ID '${o}' not found`,
              timestamp: new Date().toISOString()
            });
          }
          s.json({ success: !0, data: n });
        } catch (t) {
          (logger_1.logger.error(`Error in ${r} getById handler`, {
            entityName: r,
            id: a.params[e],
            error: t instanceof Error ? t.message : 'Unknown error',
            stack: t instanceof Error ? t.stack : void 0
          }),
          o(t));
        }
      };
exports.createGetByIdHandler = createGetByIdHandler;

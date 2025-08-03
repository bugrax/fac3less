'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.withErrorLogging = withErrorLogging),
(exports.handleServiceError = handleServiceError),
(exports.withErrorResponse = withErrorResponse),
(exports.retryWithBackoff = retryWithBackoff));
const logger_1 = require('./logger');
function withErrorLogging(r, e) {
  return async (...o) => {
    try {
      return await r(...o);
    } catch (r) {
      throw (logger_1.logger.error(`[${e}] Operation failed:`, r), r);
    }
  };
}
function handleServiceError(r, e, o = 'An unexpected error occurred') {
  const t = r instanceof Error ? r.message : o;
  return (
    logger_1.logger.error(`[${e}] ${t}`, {
      error: r,
      stack: r instanceof Error ? r.stack : void 0
    }),
    {
      success: !1,
      error: t,
      details: 'development' === process.env.NODE_ENV ? r : void 0
    }
  );
}
function withErrorResponse(r, e) {
  return async (...o) => {
    try {
      return await r(...o);
    } catch (r) {
      return handleServiceError(r, e);
    }
  };
}
async function retryWithBackoff(r, e = 3, o, t = 1e3) {
  let n;
  for (let i = 0; i <= e; i++) {
    try {
      return await r();
    } catch (r) {
      if (((n = r), i < e)) {
        const n = t * Math.pow(2, i);
        (logger_1.logger.warn(
          `[${o}] Attempt ${i + 1}/${e + 1} failed, retrying in ${n}ms...`,
          { error: r }
        ),
        await new Promise(r => setTimeout(r, n)));
      }
    }
  }
  throw (
    logger_1.logger.error(`[${o}] All ${e + 1} attempts failed`, { error: n }),
    n
  );
}

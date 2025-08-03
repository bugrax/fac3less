'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.waitForPrediction = waitForPrediction),
(exports.handlePredictionError = handlePredictionError),
(exports.extractAudioUrl = extractAudioUrl));
const logger_1 = require('../../../../utils/logger');
async function waitForPrediction(replicate, r, e = !1) {
  try {
    let e = r;
    const t = Date.now(),
      o = 6e4;
    for (; 'succeeded' !== e.status && 'failed' !== e.status; ) {
      if (Date.now() - t > o) {
        throw new Error('Prediction timeout after 60 seconds');
      }
      await new Promise(r => setTimeout(r, 1e3));
      try {
        e = await replicate.predictions.get(e.id);
      } catch (r) {
        throw (
          logger_1.logger.error('Error fetching prediction status:', r),
          new Error(
            `Failed to get prediction status: ${r instanceof Error ? r.message : 'Unknown error'}`
          )
        );
      }
    }
    return e;
  } catch (r) {
    throw (logger_1.logger.error('Error waiting for prediction:', r), r);
  }
}
async function handlePredictionError(r, e, t, o, i = !1) {
  try {
    const n = r,
      a = n.error || 'Unknown error';
    (logger_1.logger.error('[MinimaxTTS] Prediction failed:', {
      id: n.id,
      error: String(a),
      logs: n.logs
    }),
    i && n.logs);
    if (
      [
        'Service is temporarily unavailable',
        'E004',
        'rate limit',
        'timeout',
        'temporary',
        'connection',
        'network'
      ].some(r => String(a).toLowerCase().includes(r.toLowerCase())) &&
      e < t - 1
    ) {
      return (await new Promise(r => setTimeout(r, o)), !0);
    }
    throw new Error(`Prediction failed: ${String(a)}`);
  } catch (r) {
    throw (logger_1.logger.error('Error handling prediction error:', r), r);
  }
}
function extractAudioUrl(r) {
  if (Array.isArray(r) && r.length > 0) {
    return r[0];
  }
  if ('string' === typeof r) {
    return r;
  }
  if (r && 'object' === typeof r) {
    const e = r,
      t = e.url || e.audio_url || e.output || r;
    if ('string' !== typeof t) {
      throw new Error(
        `Could not find audio URL in output: ${JSON.stringify(r)}`
      );
    }
    return t;
  }
  throw new Error(`Unexpected output format from model: ${typeof r}`);
}

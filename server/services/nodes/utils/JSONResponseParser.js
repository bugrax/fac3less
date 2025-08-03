'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.JSONResponseParser = void 0));
const logger_1 = require('../../../utils/logger');
class JSONResponseParser {
  static parse(r, e) {
    if (!r || '' === r.trim()) {
      return (logger_1.logger.error(`[${e}] Empty response from LLM`), null);
    }
    let s = r;
    s.includes('```json')
      ? (s = s
        .replace(/```json\s*/g, '')
        .replace(/```/g, '')
        .trim())
      : s.includes('```') && (s = s.replace(/```\s*/g, '').trim());
    const t = s.match(/\{[\s\S]*\}/m);
    t && (s = t[0]);
    const o = s.indexOf('{'),
      a = s.lastIndexOf('}');
    o >= 0 && a > o && (s = s.substring(o, a + 1));
    try {
      return JSON.parse(s);
    } catch (r) {
      return (
        logger_1.logger.error(`[${e}] JSON parse error:`, r),
        logger_1.logger.error(`[${e}] Failed to parse content:`, s),
        null
      );
    }
  }
  static parseArray(r, e) {
    const s = this.parse(r, e);
    if (s) {
      const r = Object.keys(s).find(r => Array.isArray(s[r]));
      if (r) {
        return s[r];
      }
    }
    const t = r.trim();
    if (t.startsWith('[')) {
      try {
        return JSON.parse(t);
      } catch (r) {
        logger_1.logger.error(`[${e}] Failed to parse array:`, r);
      }
    }
    return null;
  }
}
exports.JSONResponseParser = JSONResponseParser;

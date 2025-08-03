'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.CaptionTimingService = void 0));
const CaptionTextProcessor_1 = require('./CaptionTextProcessor'),
  logger_1 = require('../../utils/logger');
class CaptionTimingService {
  textProcessor;
  constructor() {
    this.textProcessor = new CaptionTextProcessor_1.CaptionTextProcessor();
  }
  async generateContinuousFromWhisperWords(t, e = 42, n) {
    if (!t || 0 === t.length) return [];
    const r = n || 0.05,
      o = [],
      i = this.groupWordsIntoLines(t, e);
    for (const t of i) {
      let e = '';
      for (let n = 0; n < t.words.length; n++) {
        const i = t.words[n];
        ((e += (e ? ' ' : '') + i.word),
          o.push({
            text: e,
            startTime: Math.max(0, i.start - r),
            endTime: i.end,
          }));
      }
    }
    return o;
  }
  async generateFromAdjustedTranscripts(t, e = 42, n, r) {
    const o = [];
    for (const i of t) {
      const t = this.textProcessor.splitIntoSingleLineSegments(i.text, e),
        s = this.calculateSegmentTiming(t, i, n),
        g = n || 0.05,
        a = r || 0;
      for (let e = 0; e < t.length; e++)
        o.push({
          text: t[e],
          startTime: Math.max(0, i.startTime + s[e].startOffset - g + a),
          endTime: i.startTime + s[e].endOffset + a,
        });
    }
    return o;
  }
  calculateSegmentTiming(t, e, n) {
    const r = e.endTime - e.startTime,
      o = [],
      i = t.map(t => this.calculateSegmentWeight(t)),
      s = i.reduce((t, e) => t + e, 0),
      g = n || 0.05;
    let a = 0;
    for (let e = 0; e < t.length; e++) {
      const t = r * (i[e] / s),
        n = 0 === e ? Math.max(0, a - g) : a,
        l = a + t - 0.05;
      (o.push({ startOffset: n, endOffset: l }), (a += t));
    }
    return (o.length > 0 && (o[o.length - 1].endOffset = r), o);
  }
  calculateSegmentWeight(t) {
    const e = t.split(/\s+/).filter(t => t.length > 0).length;
    let n = 0;
    n += 0.5 * (t.match(/[.!?]/g) || []).length;
    n += 0.2 * (t.match(/[,;]/g) || []).length;
    n += 0.3 * (t.match(/[:—–-]/g) || []).length;
    return e / 2.5 + n;
  }
  async generateSingleWordCaptions(t, e, n) {
    if (!t || 0 === t.length) return [];
    const r = e || 0,
      o = n || 0,
      i = [],
      s = 0.001,
      g = new Set();
    logger_1.logger.debug(
      `[CaptionTimingService] Processing ${t.length} words for single-word captions`
    );
    for (let e = 0; e < t.length; e++) {
      const n = t[e];
      if (!n.word || '' === n.word.trim()) {
        logger_1.logger.debug(
          `[CaptionTimingService] Skipping empty word at index ${e}: "${n.word}"`
        );
        continue;
      }
      const a = Math.max(0, n.start - r + o);
      let l = a,
        c = 0;
      for (; g.has(l); ) (c++, (l = a + 0.001 * c));
      g.add(l);
      const d = n.end + o;
      let h = Math.max(d, l + 0.1);
      const m = e + 1;
      if (m < t.length) {
        const e = t[m],
          n = Math.max(0, e.start - r + o);
        h > n && (h = Math.max(n, l + s));
      }
      ((h = Math.max(h, l + s)),
        h <= l &&
          (logger_1.logger.warn(
            `[CaptionTimingService] Word "${n.word}" has invalid timing: start=${l.toFixed(3)}s, end=${h.toFixed(3)}s - adjusting`
          ),
          (h = l + s)),
        i.push({
          startTime: l,
          endTime: h,
          text: n.word.trim(),
          style: { position: 'middle' },
        }),
        logger_1.logger.debug(
          `[CaptionTimingService] Added caption ${i.length}: "${n.word.trim()}" (${l}s - ${h}s)`
        ));
    }
    if (
      (logger_1.logger.debug(
        `[CaptionTimingService] Generated ${i.length} captions from ${t.length} input words`
      ),
      i.length < t.length)
    ) {
      const e = t.length - i.length;
      logger_1.logger.warn(
        `[CaptionTimingService] ${e} words were skipped during caption generation`
      );
    }
    return i;
  }
  groupWordsIntoLines(t, e) {
    const n = [];
    let r = [],
      o = 0;
    for (const i of t) {
      const t = (o > 0 ? ' ' : '') + i.word;
      o + t.length > e && r.length > 0
        ? (n.push({
            words: [...r],
            startTime: r[0].start,
            endTime: r[r.length - 1].end,
          }),
          (r = [i]),
          (o = i.word.length))
        : (r.push(i), (o += t.length));
    }
    return (
      r.length > 0 &&
        n.push({
          words: [...r],
          startTime: r[0].start,
          endTime: r[r.length - 1].end,
        }),
      n
    );
  }
  applyStyling(t, e, n, r) {
    return t.map(t => ({
      ...t,
      style: {
        position: t.style?.position || e || 'middle',
        fontSize: n || 54,
        color: r || '#FFFFFF',
      },
    }));
  }
}
exports.CaptionTimingService = CaptionTimingService;

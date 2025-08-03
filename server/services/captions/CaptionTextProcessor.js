'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.CaptionTextProcessor = void 0));
class CaptionTextProcessor {
  processText(t, e = 'en', s = 42) {
    const n = this.isCJKLanguage(e) ? Math.min(s, 20) : s;
    return this.splitIntoLines(t, n);
  }
  splitIntoSingleLineSegments(t, e) {
    const s = this.splitBySentences(t),
      n = [];
    for (const t of s) {
      if (t.length <= e) {
        n.push(t);
      } else {
        const s = this.splitAtNaturalBreaks(t, e);
        n.push(...s);
      }
    }
    return n;
  }
  splitIntoLines(t, e) {
    if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(t)) {
      return this.splitCJKText(t, e);
    }
    {
      const s = this.splitBySentences(t),
        n = [];
      for (const t of s) {
        const s = this.splitSentenceIntoLines(t.trim(), e);
        n.push(...s);
      }
      return n;
    }
  }
  splitCJKText(t, e) {
    const s = [];
    let n = '';
    const r = Array.from(t);
    for (const t of r) {
      if (n.length < e) {
        n += t;
      } else {
        const r = this.findCJKPunctuationBreak(n);
        r > 0.6 * e
          ? (s.push(n.substring(0, r + 1)), (n = n.substring(r + 1) + t))
          : (s.push(n), (n = t));
      }
    }
    return (n && s.push(n), s);
  }
  findCJKPunctuationBreak(t) {
    const e = ['。', '、', '，', '！', '？', '；'];
    let s = -1;
    for (const n of e) {
      const e = t.lastIndexOf(n);
      e > s && (s = e);
    }
    return s;
  }
  splitBySentences(t) {
    const e = [];
    let s = '',
      n = !1;
    const r = t
      .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr)\./g, '$1<DOT>')
      .replace(/\b(Inc|Ltd|Corp|Co)\./g, '$1<DOT>')
      .replace(/\b(etc|vs|i\.e|e\.g)\./g, '$1<DOT>')
      .split('');
    for (let t = 0; t < r.length; t++) {
      const o = r[t];
      if (
        ((s += o),
        ('"' !== o && "'" !== o) || (n = !n),
        !n && ('.' === o || '!' === o || '?' === o))
      ) {
        const n = r[t + 1],
          o = r[t + 2];
        (n && (' ' !== n || (o && !/[A-Z]/.test(o))) && '\n' !== n) ||
          (e.push(s.replace(/<DOT>/g, '.').trim()), (s = ''));
      }
    }
    return (
      s.trim() && e.push(s.replace(/<DOT>/g, '.').trim()),
      e.filter(t => t.length > 0)
    );
  }
  splitSentenceIntoLines(t, e) {
    if (t.length <= e) {
      return [t];
    }
    const s = t.split(/\s+/),
      n = [];
    let r = '';
    for (const t of s) {
      r.length + t.length + 1 <= e
        ? (r += (r ? ' ' : '') + t)
        : r && this.canBreakLine(r)
          ? (n.push(r), (r = t))
          : r.length + t.length + 1 <= e + 5
            ? (r += ` ${t}`)
            : (r && n.push(r), (r = t));
    }
    return (r && n.push(r), n);
  }
  splitAtNaturalBreaks(t, e) {
    const s = [],
      n = this.protectNumbers(t).split(/,\s*/);
    let r = '';
    for (let t = 0; t < n.length; t++) {
      const o = n[t] + (t < n.length - 1 ? ',' : '');
      r.length + o.length + 1 <= e
        ? (r += (r ? ' ' : '') + o)
        : (r && s.push(this.unprotectNumbers(r.trim())), (r = o));
    }
    if (r) {
      if (r.length > e) {
        const t = r.split(/\s+/);
        let n = '';
        for (const r of t) {
          n.length + r.length + 1 <= e
            ? (n += (n ? ' ' : '') + r)
            : (n && s.push(this.unprotectNumbers(n)), (n = r));
        }
        n && s.push(this.unprotectNumbers(n));
      } else {
        s.push(this.unprotectNumbers(r.trim()));
      }
    }
    return s;
  }
  canBreakLine(t) {
    return !/\b(the|a|an|of|in|to|and|or|but|with|for|at|by|from|up|on|off|is|are|was|were)\s*$/i.test(
      t
    );
  }
  isCJKLanguage(t) {
    return [
      'japanese',
      'korean',
      'chinese-simplified',
      'chinese-traditional',
      'ja',
      'ko',
      'zh',
      'zh-cn',
      'zh-tw'
    ].includes(t.toLowerCase());
  }
  protectNumbers(t) {
    return t.replace(/(\d{1,3}(?:,\d{3})+(?:\.\d+)?)/g, t =>
      t.replace(/,/g, '<COMMA>')
    );
  }
  unprotectNumbers(t) {
    return t.replace(/<COMMA>/g, ',');
  }
}
exports.CaptionTextProcessor = CaptionTextProcessor;

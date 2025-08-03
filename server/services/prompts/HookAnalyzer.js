'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.HookAnalyzer = void 0));
class HookAnalyzer {
  static analyzeHookType(e) {
    const o = e.toLowerCase();
    return o.includes('?') || o.includes('how') || o.includes('why')
      ? 'question-based curiosity hook'
      : o.includes('secret') ||
          o.includes('truth') ||
          o.includes("don't want you to know")
        ? 'forbidden knowledge hook'
        : o.includes('$') ||
            o.includes('rich') ||
            o.includes('money') ||
            o.includes('wealth')
          ? 'aspirational/financial hook'
          : o.includes('shocking') ||
              o.includes('unbelievable') ||
              o.includes('crazy')
            ? 'shock value hook'
            : o.includes('mistake') || o.includes('wrong') || o.includes('stop')
              ? 'warning/urgency hook'
              : o.includes('discover') ||
                  o.includes('found') ||
                  o.includes('reveal')
                ? 'discovery/revelation hook'
                : 'attention-grabbing hook';
  }
}
exports.HookAnalyzer = HookAnalyzer;

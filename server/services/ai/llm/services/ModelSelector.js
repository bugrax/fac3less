'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.ModelSelector = void 0));
const constants_1 = require('./constants');
class ModelSelector {
  static selectModel(t) {
    const {
      task: e,
      prioritizeCost: s,
      prioritizeQuality: o,
      contextLength: n
    } = t;
    return 'script' === e || 'image-prompt' === e
      ? constants_1.OPENROUTER_MODELS.CLAUDE_SONNET_4
      : s
        ? this.getCheapestModel()
        : o
          ? this.getHighestQualityModel()
          : n && n > 1e5
            ? this.getCheapestModel()
            : constants_1.DEFAULT_MODEL;
  }
  static getCheapestModel() {
    let t = constants_1.DEFAULT_MODEL,
      e = 1 / 0;
    for (const [s, o] of Object.entries(constants_1.MODEL_PRICING)) {
      const n = (o.promptPerMillion + o.completionPerMillion) / 2;
      n < e && ((e = n), (t = s));
    }
    return t;
  }
  static getHighestQualityModel() {
    return constants_1.OPENROUTER_MODELS.CLAUDE_SONNET_4;
  }
  static getRecommendations(t) {
    switch (t) {
    case 'script':
      return {
        primary: constants_1.OPENROUTER_MODELS.CLAUDE_SONNET_4,
        fallback: constants_1.OPENROUTER_MODELS.CLAUDE_SONNET_4,
        reasoning:
            'Claude Sonnet 4 provides superior quality for script generation'
      };
    case 'image-prompt':
      return {
        primary: constants_1.OPENROUTER_MODELS.CLAUDE_SONNET_4,
        fallback: constants_1.OPENROUTER_MODELS.CLAUDE_SONNET_4,
        reasoning:
            'Claude Sonnet 4 excels at creative and detailed visual descriptions'
      };
    default:
      return {
        primary: constants_1.DEFAULT_MODEL,
        fallback: constants_1.OPENROUTER_MODELS.CLAUDE_SONNET_4,
        reasoning: 'Using default model configuration'
      };
    }
  }
  static estimateCost(t, e, s) {
    const o = constants_1.MODEL_PRICING[t];
    return (e / 1e6) * o.promptPerMillion + (s / 1e6) * o.completionPerMillion;
  }
}
exports.ModelSelector = ModelSelector;

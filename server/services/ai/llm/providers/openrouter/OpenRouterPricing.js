'use strict';
function calculateCost(e, o, t) {
  const p = exports.MODEL_PRICING[t] || exports.MODEL_PRICING.default;
  return e * p.prompt + o * p.completion;
}
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.MODEL_PRICING = void 0),
(exports.calculateCost = calculateCost),
(exports.MODEL_PRICING = {
  'moonshotai/kimi-k2': { prompt: 1e-6, completion: 3e-6 },
  'anthropic/claude-sonnet-4': { prompt: 3e-6, completion: 15e-6 },
  'google/gemini-2.5-pro': { prompt: 125e-8, completion: 1e-5 },
  'openai/gpt-4.1': { prompt: 1e-5, completion: 3e-5 },
  default: { prompt: 1e-6, completion: 1e-6 }
}));

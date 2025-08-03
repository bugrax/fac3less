'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.OPENROUTER_CONFIG =
    exports.DEFAULT_IMAGE_MODEL =
    exports.DEFAULT_MODEL =
    exports.MODEL_CAPABILITIES =
    exports.MODEL_PRICING =
    exports.OPENROUTER_MODELS =
      void 0),
(exports.OPENROUTER_MODELS = {
  KIMI_K2: 'moonshotai/kimi-k2',
  CLAUDE_SONNET_4: 'anthropic/claude-sonnet-4'
}),
(exports.MODEL_PRICING = {
  [exports.OPENROUTER_MODELS.KIMI_K2]: {
    promptPerMillion: 1,
    completionPerMillion: 3
  },
  [exports.OPENROUTER_MODELS.CLAUDE_SONNET_4]: {
    promptPerMillion: 3,
    completionPerMillion: 15
  }
}),
(exports.MODEL_CAPABILITIES = {
  [exports.OPENROUTER_MODELS.KIMI_K2]: {
    contextLength: 2e5,
    supportedFeatures: ['text', 'json_mode'],
    bestFor: ['cost-effective', 'general-purpose', 'coding']
  },
  [exports.OPENROUTER_MODELS.CLAUDE_SONNET_4]: {
    contextLength: 1e6,
    supportedFeatures: [
      'text',
      'image',
      'file',
      'json_mode',
      'structured_outputs'
    ],
    bestFor: ['creative-writing', 'complex-reasoning', 'image-descriptions']
  }
}),
(exports.DEFAULT_MODEL = exports.OPENROUTER_MODELS.CLAUDE_SONNET_4),
(exports.DEFAULT_IMAGE_MODEL = exports.OPENROUTER_MODELS.CLAUDE_SONNET_4),
(exports.OPENROUTER_CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1',
  timeout: 3e4,
  maxRetries: 3,
  retryDelay: 1e3
}));

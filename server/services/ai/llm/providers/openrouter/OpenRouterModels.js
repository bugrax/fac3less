'use strict';
function getModelById(modelId) {
  return exports.OPENROUTER_MODELS[modelId];
}
function getAllModels() {
  return Object.values(exports.OPENROUTER_MODELS);
}
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.OPENROUTER_MODELS = void 0),
(exports.getModelById = getModelById),
(exports.getAllModels = getAllModels),
(exports.OPENROUTER_MODELS = {
  'moonshotai/kimi-k2': {
    id: 'moonshotai/kimi-k2',
    name: 'Kimi K2',
    description: "Moonshot AI's advanced model for general tasks",
    provider: 'openrouter',
    capabilities: ['text', 'reasoning', 'coding'],
    pricing: {
      amount: 1,
      unit: 'per million tokens (prompt)',
      currency: 'USD',
      notes: 'Completion: $3 per million tokens'
    }
  },
  'anthropic/claude-sonnet-4': {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    description: "Anthropic's balanced model for complex tasks",
    provider: 'openrouter',
    capabilities: ['text', 'analysis', 'coding'],
    pricing: {
      amount: 3,
      unit: 'per million tokens (prompt)',
      currency: 'USD',
      notes: 'Completion: $15 per million tokens'
    }
  },
  'google/gemini-2.5-pro': {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: "Google's advanced multimodal model with enhanced reasoning",
    provider: 'openrouter',
    capabilities: ['text', 'multimodal', 'reasoning', 'coding'],
    pricing: {
      amount: 1.25,
      unit: 'per million tokens (prompt)',
      currency: 'USD',
      notes: 'Completion: $10 per million tokens'
    }
  },
  'openai/gpt-4.1': {
    id: 'openai/gpt-4.1',
    name: 'GPT-4.1',
    description: "OpenAI's enhanced GPT-4 model with improved capabilities",
    provider: 'openrouter',
    capabilities: ['text', 'reasoning', 'coding', 'analysis'],
    pricing: {
      amount: 10,
      unit: 'per million tokens (prompt)',
      currency: 'USD',
      notes: 'Completion: $30 per million tokens'
    }
  }
}));

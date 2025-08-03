'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.modelService = exports.ModelService = void 0));
const openrouter_1 = require('../providers/openrouter/index'),
  OpenRouterModels_1 = require('../providers/openrouter/OpenRouterModels'),
  logger_1 = require('../../../../utils/logger');
class ModelService {
  client;
  cachedModels = null;
  cacheExpiry = 0;
  constructor() {
    this.client = new openrouter_1.OpenRouterClient({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
  staticModels = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      type: 'text',
      provider: 'OpenAI',
      capabilities: ['script-generation', 'content-planning'],
      maxTokens: 8192,
      pricing: { input: 0.03, output: 0.06, unit: 'per 1K tokens' },
    },
    {
      id: 'stable-diffusion-xl',
      name: 'Stable Diffusion XL',
      type: 'image',
      provider: 'Stability AI',
      capabilities: ['image-generation', 'style-transfer'],
      pricing: { input: 0.002, output: 0.002, unit: 'per image' },
    },
    {
      id: 'elevenlabs-v2',
      name: 'ElevenLabs Multilingual v2',
      type: 'audio',
      provider: 'ElevenLabs',
      capabilities: ['text-to-speech', 'voice-cloning'],
      pricing: { input: 0.15, output: 0, unit: 'per 1K characters' },
    },
  ];
  async getAvailableModels(e) {
    const t = [...(await this.getOpenRouterModels()), ...this.staticModels];
    return e ? t.filter(t => t.type === e) : t;
  }
  async getOpenRouterModels() {
    const e = Date.now();
    if (this.cachedModels && this.cacheExpiry > e) return this.cachedModels;
    if (!this.client.validateConfig()) return [];
    try {
      const t = (0, OpenRouterModels_1.getAllModels)();
      return (
        (this.cachedModels = t.map(e => ({
          id: e.id,
          name: e.name,
          type: 'text',
          provider: 'OpenRouter',
          capabilities: e.capabilities || [
            'script-generation',
            'content-planning',
          ],
          maxTokens: 4096,
          pricing: e.pricing
            ? {
                input: e.pricing.amount / 1e3,
                output: (e.pricing.amount / 1e3) * 3,
                unit: 'per 1K tokens',
              }
            : void 0,
        }))),
        (this.cacheExpiry = e + 3e5),
        this.cachedModels
      );
    } catch (e) {
      logger_1.logger.error('Failed to fetch OpenRouter models:', e);
    }
    return [];
  }
  async getModelById(e) {
    return (await this.getAvailableModels()).find(t => t.id === e) || null;
  }
  async checkModelAvailability(e) {
    return (await this.getAvailableModels()).some(t => t.id === e);
  }
}
((exports.ModelService = ModelService),
  (exports.modelService = new ModelService()));

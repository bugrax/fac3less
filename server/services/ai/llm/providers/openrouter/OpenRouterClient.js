'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.OpenRouterClient = void 0));
const openai_1 = __importDefault(require('openai')),
  LLMService_1 = require('../../LLMService'),
  OpenRouterModels_1 = require('./OpenRouterModels'),
  OpenRouterPricing_1 = require('./OpenRouterPricing'),
  logger_1 = require('../../../../../utils/logger');
class OpenRouterClient extends LLMService_1.LLMService {
  client = null;
  constructor(config) {
    super('OpenRouter', config);
    const e = config.apiKey || process.env.OPENROUTER_API_KEY;
    e &&
      (this.client = new openai_1.default({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: e,
        dangerouslyAllowBrowser: !1,
      }));
  }
  validateConfig() {
    const e = this.config.apiKey || process.env.OPENROUTER_API_KEY;
    return e
      ? !!e.startsWith('sk-or-v1-') ||
          (logger_1.logger.error(
            'OpenRouter API key should start with "sk-or-v1-"'
          ),
          !1)
      : (logger_1.logger.error('OpenRouter API key not configured'), !1);
  }
  async complete(e) {
    if (!this.validateConfig() || !this.client)
      return {
        success: !1,
        error: 'OpenRouter API key not configured or invalid',
      };
    try {
      if (e.stream && e.onProgress) return await this.completeWithStreaming(e);
      const t = await this.client.chat.completions.create({
          model: e.model,
          messages: e.messages,
          temperature: e.temperature,
          max_tokens: e.maxTokens,
          top_p: e.topP,
          frequency_penalty: e.frequencyPenalty,
          presence_penalty: e.presencePenalty,
          stream: !1,
        }),
        o = t.choices[0],
        r = t.usage,
        n = {
          id: t.id,
          model: t.model,
          content: o.message.content || '',
          finishReason: o.finish_reason || void 0,
          usage: r
            ? {
                promptTokens: r.prompt_tokens,
                completionTokens: r.completion_tokens,
                totalTokens: r.total_tokens,
              }
            : void 0,
        };
      let s = 0;
      return (
        r &&
          (s = this.estimateCost(
            r.prompt_tokens,
            r.completion_tokens,
            e.model
          )),
        {
          success: !0,
          data: n,
          metadata: {
            provider: 'OpenRouter',
            model: e.model,
            cost: s,
            usage: n.usage,
          },
        }
      );
    } catch (e) {
      const t =
        e instanceof Error ? e.message : 'Unknown error during completion';
      return (
        logger_1.logger.error('OpenRouter completion error:', t),
        { success: !1, error: t }
      );
    }
  }
  async completeWithStreaming(e) {
    if (!this.client)
      return { success: !1, error: 'OpenRouter client not initialized' };
    try {
      const t = Math.floor(
          e.messages.reduce((e, t) => e + t.content.length, 0) / 4
        ),
        o = e.maxTokens || 2e3,
        r = await this.client.chat.completions.create({
          model: e.model,
          messages: e.messages,
          temperature: e.temperature,
          max_tokens: e.maxTokens,
          top_p: e.topP,
          frequency_penalty: e.frequencyPenalty,
          presence_penalty: e.presencePenalty,
          stream: !0,
        });
      let n,
        s = '',
        i = '',
        a = '',
        l = 0,
        c = 0;
      for await (const t of r) {
        (c++, t.id && (i = t.id), t.model && (a = t.model));
        const r = t.choices?.[0];
        if (r?.delta?.content) {
          if (
            ((s += r.delta.content),
            (l = Math.floor(s.length / 4)),
            e.onProgress)
          ) {
            const t = e.onProgress(l, o);
            t instanceof Promise && (await t);
          }
          await new Promise(e => setTimeout(e, 0));
        }
        r?.finish_reason && (n = r.finish_reason);
      }
      const u = Math.floor(s.length / 4),
        p = {
          id: i,
          model: a,
          content: s,
          finishReason: n,
          usage: { promptTokens: t, completionTokens: u, totalTokens: t + u },
        },
        m = this.estimateCost(t, u, e.model);
      return {
        success: !0,
        data: p,
        metadata: {
          provider: 'OpenRouter',
          model: e.model,
          cost: m,
          usage: p.usage,
        },
      };
    } catch (e) {
      const t =
        e instanceof Error
          ? e.message
          : 'Unknown error during streaming completion';
      return (
        logger_1.logger.error('OpenRouter streaming error:', t),
        { success: !1, error: t }
      );
    }
  }
  async listModels() {
    return {
      success: !0,
      data: (0, OpenRouterModels_1.getAllModels)(),
      metadata: {
        provider: 'OpenRouter',
        count: (0, OpenRouterModels_1.getAllModels)().length,
      },
    };
  }
  estimateCost(e, t, o) {
    return (0, OpenRouterPricing_1.calculateCost)(e, t, o);
  }
}
exports.OpenRouterClient = OpenRouterClient;

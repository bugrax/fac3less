'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.LLMBaseNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  openrouter_1 = require('../../ai/llm/providers/openrouter/index'),
  testMedia_1 = require('../../../../config/testMedia'),
  logger_1 = require('../../../utils/logger');
class LLMBaseNode extends BaseNode_1.BaseNode {
  llmClient = null;
  defaultModel;
  defaultTemperature;
  maxTokens;
  constructor(config) {
    (super(config),
      (this.defaultModel = config.defaultModel || 'anthropic/claude-sonnet-4'),
      (this.defaultTemperature = config.defaultTemperature || 0.1),
      (this.maxTokens = config.maxTokens || 2e3),
      (this.llmClient = new openrouter_1.OpenRouterClient({})));
  }
  async executeLLM(e, t) {
    if (!this.llmClient)
      return {
        success: !1,
        error: 'LLM client not initialized. Check API token configuration.',
      };
    try {
      const r = await this.llmClient.complete({
        model: t?.model || this.defaultModel,
        messages: e,
        temperature: t?.temperature || this.defaultTemperature,
        maxTokens: t?.maxTokens || this.maxTokens,
      });
      return r.success && r.data
        ? {
            success: !0,
            data: { content: r.data.content, cost: r.metadata?.cost },
          }
        : { success: !1, error: r.error || 'Failed to get LLM response' };
    } catch (e) {
      return (
        logger_1.logger.error(
          `[${this.config.type}Node] LLM execution error:`,
          e
        ),
        {
          success: !1,
          error: e instanceof Error ? e.message : 'Unknown LLM error',
        }
      );
    }
  }
  parseJSONResponse(e) {
    if (!e || '' === e.trim())
      return (
        logger_1.logger.error(
          `[${this.config.type}Node] Empty response from LLM`
        ),
        null
      );
    let t = e;
    t.includes('```json')
      ? (t = t
          .replace(/```json\s*/g, '')
          .replace(/```/g, '')
          .trim())
      : t.includes('```') && (t = t.replace(/```\s*/g, '').trim());
    const r = t.match(/\{[\s\S]*\}/m);
    r && (t = r[0]);
    const s = t.indexOf('{'),
      o = t.lastIndexOf('}');
    s >= 0 && o > s && (t = t.substring(s, o + 1));
    try {
      return JSON.parse(t);
    } catch (e) {
      return (
        logger_1.logger.error(`[${this.config.type}Node] JSON parse error:`, e),
        logger_1.logger.error(
          `[${this.config.type}Node] Failed to parse content:`,
          t
        ),
        null
      );
    }
  }
  isTestMode() {
    return (0, testMedia_1.isTestMode)();
  }
  async execute(e, t) {
    const r = this.validate(e);
    return r
      ? { success: !1, error: r }
      : this.isTestMode()
        ? (logger_1.logger.info(
            `[${this.config.type}Node] TEST MODE - Returning mock response`
          ),
          this.getTestModeResponse(e))
        : this.executeCore(e, t);
  }
}
exports.LLMBaseNode = LLMBaseNode;

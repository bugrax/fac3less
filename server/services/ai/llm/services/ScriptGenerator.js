'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ScriptGenerator = void 0));
const openrouter_1 = require('../providers/openrouter/index'),
  ai_1 = require('../../../../../config/ai/index'),
  logger_1 = require('../../../../utils/logger');
class ScriptGenerator {
  client;
  model;
  constructor() {
    ((this.client = new openrouter_1.OpenRouterClient({
      apiKey: ai_1.openRouterConfig.apiKey,
    })),
      (this.model = ai_1.openRouterConfig.defaultModel));
  }
  async generateScript(e) {
    const t = this.buildScriptPrompt(e);
    try {
      const e = await this.client.complete({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional video script writer. Create engaging, structured scripts for video content. Always respond with valid JSON.',
          },
          { role: 'user', content: t },
        ],
        temperature: 0.7,
      });
      if (!e.success || !e.data) throw new Error('Failed to generate script');
      const r = e.data.content,
        n = JSON.parse(r);
      if (!n.title || !n.sections || !Array.isArray(n.sections))
        throw new Error('Invalid script format received from LLM');
      return n;
    } catch (e) {
      throw (
        logger_1.logger.error('Failed to generate script:', e),
        new Error(
          `Script generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`
        )
      );
    }
  }
  buildScriptPrompt(e) {
    return `Create a ${e.duration}-second video script about "${e.topic}".\n\nStyle: ${e.style}\n${e.additionalContext ? `Additional context: ${e.additionalContext}` : ''}\n\nGenerate a structured JSON response with:\n- title: A catchy title for the video\n- description: A brief description (2-3 sentences)\n- sections: An array of script sections, each with:\n  - timestamp: When this section starts (in seconds)\n  - narration: What the narrator says\n  - visualDescription: What visuals should be shown\n- estimatedDuration: Total duration in seconds\n\nMake sure the sections cover the full ${e.duration} seconds and create an engaging narrative.`;
  }
  async generateImagePrompts(e, t) {
    const r = [];
    for (const n of e.sections) {
      const e = await this.generateImagePrompt(n.visualDescription, t);
      r.push(e);
    }
    return r;
  }
  async generateImagePrompt(e, t) {
    return `${e}${t ? `, ${t} style` : ''}, high quality, detailed`;
  }
}
exports.ScriptGenerator = ScriptGenerator;

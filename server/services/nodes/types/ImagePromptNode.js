'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ImagePromptNode = void 0));
const LLMBaseNode_1 = require('./LLMBaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  prompts_1 = require('../../prompts/index'),
  utils_1 = require('../utils'),
  logger_1 = require('../../../utils/logger');
class ImagePromptNode extends LLMBaseNode_1.LLMBaseNode {
  promptBuilder;
  constructor(config) {
    (super({
      ...config,
      type: 'imagePrompt',
      defaultModel: 'anthropic/claude-sonnet-4',
      defaultTemperature: 0.1,
      maxTokens: 2e3,
    }),
      (this.promptBuilder = new prompts_1.ImagePromptBuilder()));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'script',
          type: DataTypes_1.DataType.SCRIPT,
          description: 'Script data with sections',
          required: !0,
        },
        {
          name: 'visualStyle',
          type: DataTypes_1.DataType.TEXT,
          description: 'Visual style for images',
          required: !1,
        },
        {
          name: 'model',
          type: DataTypes_1.DataType.TEXT,
          description: 'LLM model to use',
          required: !1,
        },
      ],
      outputs: [
        {
          name: 'imagePrompts',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of image prompt objects',
        },
      ],
    };
  }
  getTestModeResponse(e) {
    const t = e,
      s = t.visualStyle || 'cinematic',
      r = utils_1.TestModeHandler.generateMockArray(
        t.script.scenes.length,
        e => ({
          sectionId: t.script.scenes[e].id,
          prompt: utils_1.TestModeHandler.generateMockText(
            'Test image prompt for scene',
            t.script.scenes[e].id
          ),
          negativePrompt: 'text, words, letters',
          style: s,
          duration: t.script.scenes[e].duration || 5,
        }),
        { nodeType: 'ImagePromptNode' }
      );
    return {
      success: !0,
      data: { imagePrompts: r },
      metadata: {
        nodeId: this.config.id,
        model: 'test-mode',
        visualStyle: s,
        promptCount: r.length,
        cost: 0,
      },
    };
  }
  async executeCore(e, t) {
    const s = e;
    try {
      const e = s.visualStyle || 'cinematic',
        t = s.model || this.defaultModel;
      await this.updateProgress(10);
      const r = this.promptBuilder.buildSystemPrompt(e),
        o = [
          { role: 'system', content: r },
          {
            role: 'user',
            content: `Create image prompts for these scenes:\n${this.promptBuilder.buildSceneDescriptions(s.script)}`,
          },
        ];
      await this.updateProgress(30);
      const a = await this.executeLLM(o, {
        model: t,
        temperature: 0.1,
        maxTokens: 2e3,
      });
      if ((await this.updateProgress(80), !a.success || !a.data))
        throw new Error(a.error || 'Failed to generate image prompts');
      const i = utils_1.JSONResponseParser.parse(
        a.data.content,
        'ImagePromptNode'
      );
      if (!i || !i.imagePrompts)
        return (
          logger_1.logger.error(
            '[ImagePromptNode] Failed to parse prompt data, using fallback'
          ),
          {
            success: !0,
            data: {
              imagePrompts: this.promptBuilder.buildFallbackPrompts(
                s.script,
                e
              ),
            },
            metadata: {
              nodeId: this.config.id,
              model: t,
              cost: a.data.cost,
              promptCount: s.script.scenes.length,
              fallbackUsed: !0,
            },
          }
        );
      const p = i.imagePrompts.map((e, t) =>
        e && 'object' == typeof e
          ? { ...e, duration: s.script.scenes[t]?.duration || 4 }
          : { duration: s.script.scenes[t]?.duration || 4 }
      );
      return (
        await this.updateProgress(100),
        {
          success: !0,
          data: { imagePrompts: p },
          metadata: {
            nodeId: this.config.id,
            model: t,
            cost: a.data.cost,
            promptCount: p.length,
          },
        }
      );
    } catch (e) {
      return {
        success: !1,
        error:
          e instanceof Error ? e.message : 'Failed to generate image prompts',
      };
    }
  }
  validateCustom(e) {
    const t = e;
    return t.script
      ? t.script.scenes && 0 !== t.script.scenes.length
        ? null
        : 'Script must contain at least one scene'
      : 'Script data is required for image prompt generation';
  }
}
exports.ImagePromptNode = ImagePromptNode;

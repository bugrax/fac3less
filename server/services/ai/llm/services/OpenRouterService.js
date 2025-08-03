'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.openRouterService = exports.OpenRouterService = void 0));
const openrouter_1 = require('../providers/openrouter/index'),
  ImagePromptGenerator_1 = require('./ImagePromptGenerator'),
  ScriptGenerator_1 = require('./ScriptGenerator'),
  ai_1 = require('../../../../../config/ai/index');
class OpenRouterService {
  client;
  scriptGenerator;
  imagePromptGenerator;
  constructor() {
    ((this.client = new openrouter_1.OpenRouterClient({
      apiKey: ai_1.openRouterConfig.apiKey,
    })),
      (this.scriptGenerator = new ScriptGenerator_1.ScriptGenerator()),
      (this.imagePromptGenerator =
        new ImagePromptGenerator_1.ImagePromptGenerator(this.client)));
  }
  async generateScript(e) {
    return this.scriptGenerator.generateScript(e);
  }
  async generateImagePromptsFromScript(e, r) {
    return this.scriptGenerator.generateImagePrompts(e, r);
  }
  async generateImagePrompt(e, r) {
    return this.imagePromptGenerator.generateImagePrompt(e, r);
  }
  async generateScriptWithImagePrompts(e, r) {
    const t = await this.generateScript(e);
    return {
      script: t,
      imagePrompts: await this.generateImagePromptsFromScript(t, r),
    };
  }
}
((exports.OpenRouterService = OpenRouterService),
  (exports.openRouterService = new OpenRouterService()));

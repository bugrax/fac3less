'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ImagePromptBuilder = void 0));
const VisualStyleService_1 = require('../styles/VisualStyleService'),
  HookAnalyzer_1 = require('./HookAnalyzer'),
  logger_1 = require('../../utils/logger');
class ImagePromptBuilder {
  visualStyleService;
  constructor() {
    this.visualStyleService =
      VisualStyleService_1.VisualStyleService.getInstance();
  }
  buildSystemPrompt(e) {
    const t = this.visualStyleService.getStyleDefinition(e),
      i = this.visualStyleService.getHookPrinciples(),
      n = this.visualStyleService.getStyleHookLanguage(e);
    return `You are an expert at creating image generation prompts for ${e} visual style.\n\nVISUAL STYLE DEFINITION:\n- Keywords: ${t.keywords}\n- Guidelines: ${t.guidelines}\n- Avoid: ${t.negativePrompt}\n\nFIRST IMAGE HOOK REQUIREMENTS (CRITICAL):\n- The FIRST image must stop viewers from scrolling - it appears in the first 3 seconds\n- Create immediate visual intrigue using ${e} aesthetic principles\n- Use ${n}\n- Psychological hooks to employ: ${Object.values(i).join(', ')}\n- Make viewers think "Wait, what?" or "I need to see more"\n- AVOID: Generic establishing shots, calm scenes, obvious visuals\n- The first prompt should have 2x the visual impact of subsequent prompts\n\nTASK:\nTransform narration text into detailed visual scenes that match the ${e} style.\n\nCRITICAL REQUIREMENTS:\n1. Create one image prompt per script section\n2. NEVER include text, words, letters, numbers, or writing in the image\n3. Transform spoken concepts into visual metaphors and scenes\n4. Include style keywords naturally in each prompt\n5. Describe composition, lighting, colors, mood, and specific visual elements\n6. Maintain visual consistency across all prompts\n7. FIRST IMAGE must be extraordinarily attention-grabbing within the style\n\nVISUAL TRANSFORMATION RULES:\n- Numbers/statistics → Visual representations (crowds, stacks, comparisons)\n- Text/quotes → Show the emotion or action instead\n- Explanations → Visual metaphors for the concept\n- Always describe WHAT TO SHOW, not what to say\n\nRESPONSE FORMAT:\nReturn ONLY a valid JSON object starting with { and ending with }\n\nExample format:\n{\n  "imagePrompts": [\n    {\n      "sectionId": "section_1",\n      "prompt": "Detailed prompt incorporating ${e} style elements",\n      "negativePrompt": "${t.negativePrompt}",\n      "style": "${t.keywords}"\n    }\n  ]\n}`;
  }
  buildSceneDescriptions(e) {
    const t = e.scenes.map((e, t) => ({
      id: e.id,
      text: e.text,
      duration: e.duration || 5,
      imagePrompt: e.imagePrompt,
      isFirstScene: 0 === t,
    }));
    if (t.length > 0) {
      const e = t[0].imagePrompt || t[0].text,
        i = HookAnalyzer_1.HookAnalyzer.analyzeHookType(e);
      ((t[0].hookType = i),
        logger_1.logger.info(
          '[ImagePromptBuilder] First scene hook analysis:',
          { hookType: i, firstScenePreview: e.substring(0, 100) + '...' }
        ));
    }
    return this.formatSceneDescriptions(t);
  }
  formatSceneDescriptions(e) {
    return e
      .map((e, t) => {
        const i =
          e.isFirstScene && e.hookType
            ? ` [CRITICAL HOOK SCENE - ${e.hookType} - Must create immediate visual intrigue using ${this.visualStyleService.getStyleHookLanguage(e.id)}]`
            : '';
        return e.imagePrompt
          ? `Section ${t + 1} (${e.id})${i}: ${e.imagePrompt} (${e.duration}s)`
          : `Section ${t + 1} (${e.id})${i}: ${e.text} (${e.duration}s)`;
      })
      .join('\n');
  }
  buildFallbackPrompts(e, t) {
    const i = this.visualStyleService.getStyleDefinition(t);
    return e.scenes.map(e => ({
      sectionId: e.id,
      prompt: e.imagePrompt
        ? `${i.keywords} visual scene without any text. ${e.imagePrompt}. Professional composition, perfect lighting, high quality render, no words or letters visible`
        : `${i.keywords} visual scene without any text. Visual representation of: ${e.text}. Professional composition, perfect lighting, high quality render, no words or letters visible`,
      negativePrompt: i.negativePrompt,
      style: i.keywords,
      duration: e.duration || 5,
    }));
  }
}
exports.ImagePromptBuilder = ImagePromptBuilder;

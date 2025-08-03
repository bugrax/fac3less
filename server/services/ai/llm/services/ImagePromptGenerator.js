'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ImagePromptGenerator = void 0));
const openrouter_1 = require('../providers/openrouter/index'),
  types_1 = require('../../../styles/types'),
  constants_1 = require('./constants'),
  logger_1 = require('../../../../utils/logger');
class ImagePromptGenerator {
  client;
  constructor(e) {
    this.client =
      e ||
      new openrouter_1.OpenRouterClient({
        apiKey: process.env.OPENROUTER_API_KEY,
      });
  }
  async generateImagePrompt(e, t = constants_1.DEFAULT_IMAGE_MODEL) {
    try {
      const o = this.buildSystemPrompt(),
        r = this.buildUserPrompt(e),
        n = await this.client.complete({
          model: t,
          messages: [
            { role: 'system', content: o },
            { role: 'user', content: r },
          ],
          temperature: 0.7,
          maxTokens: 500,
        });
      if (!n.success || !n.data)
        throw new types_1.OpenRouterError(
          n.error || 'Failed to generate image prompt',
          500,
          'unknown'
        );
      const s = n.data.content,
        i = this.parseResponse(s);
      return (
        n.data.usage &&
          (i.usage = {
            promptTokens: n.data.usage.promptTokens,
            completionTokens: n.data.usage.completionTokens,
            totalTokens: n.data.usage.totalTokens,
            cost: n.metadata?.cost ?? 0,
            model: t,
          }),
        i
      );
    } catch (o) {
      if (
        (logger_1.logger.error('Image prompt generation failed', {
          error: o instanceof Error ? o.message : 'Unknown error',
          stack: o instanceof Error ? o.stack : void 0,
          model: t,
          request: {
            style: e.style,
            aspectRatio: e.aspectRatio,
            mood: e.mood,
            hasVisualDescription: !!e.visualDescription,
          },
        }),
        o instanceof types_1.OpenRouterError)
      )
        throw o;
      throw new types_1.OpenRouterError(
        o instanceof Error ? o.message : 'Unknown error',
        500,
        'unknown'
      );
    }
  }
  buildSystemPrompt() {
    return 'You are an expert at creating detailed image generation prompts for AI systems like DALL-E 3, Stable Diffusion, and Midjourney.\n\nYour task is to transform script visual descriptions into optimized image generation prompts that will produce high-quality, consistent visuals for video production.\n\nGuidelines:\n1. Be extremely specific about visual elements, composition, and framing\n2. Include detailed descriptions of:\n   - Lighting (direction, quality, color temperature)\n   - Camera angle and perspective\n   - Color palette and mood\n   - Art style and rendering quality\n   - Important foreground and background elements\n3. Maintain consistency across all prompts for the same video\n4. Focus on photorealistic or high-quality artistic styles suitable for professional videos\n5. Avoid abstract concepts - describe concrete visual elements\n6. Include technical parameters when relevant (depth of field, lens type, etc.)\n7. Generate negative prompts to exclude common AI artifacts and unwanted elements\n\nBest Practices:\n- Start with the main subject, then describe the environment\n- Use professional photography/cinematography terms\n- Specify the emotional tone through visual elements\n- Consider the 16:9 aspect ratio for video use\n- Ensure prompts work well for the specified style (photorealistic, artistic, etc.)\n\nYou must respond in JSON format with this structure:\n{\n  "prompt": "Detailed, optimized image generation prompt (100-150 words)",\n  "negativePrompt": "Comprehensive list of elements to avoid",\n  "styleGuide": "Consistent style notes for the entire video"\n}';
  }
  buildUserPrompt(e) {
    const t = [`Visual Description: ${e.visualDescription}`],
      o = {
        photorealistic:
          'Ultra-realistic photography, professional camera settings, natural lighting',
        cinematic:
          'Movie-like quality, dramatic lighting, professional cinematography',
        artistic:
          'High-quality digital art, stylized but professional, cohesive art direction',
        documentary:
          'Authentic, journalistic style, natural and unposed, real-world feeling',
        corporate:
          'Clean, professional, modern business aesthetic, bright and optimistic',
      };
    if (e.style) {
      t.push(`Style: ${e.style}`);
      const r = o[e.style.toLowerCase()];
      r && t.push(`Style Guidelines: ${r}`);
    }
    return (
      e.aspectRatio &&
        t.push(
          `Aspect Ratio: ${e.aspectRatio} (optimize composition for this ratio)`
        ),
      e.mood && t.push(`Emotional Mood: ${e.mood}`),
      e.additionalContext &&
        (t.push(`Video Context: ${e.additionalContext}`),
        t.push('Ensure visual consistency with other scenes in this video')),
      t.push(
        'Technical Requirements: High resolution, sharp focus, professional quality'
      ),
      t.push('Composition: Rule of thirds, balanced, visually appealing'),
      t.join('\n')
    );
  }
  parseResponse(e) {
    try {
      const t = JSON.parse(e);
      return {
        prompt: t.prompt || '',
        negativePrompt: t.negativePrompt,
        styleGuide: t.styleGuide,
      };
    } catch (t) {
      return (
        logger_1.logger.warn(
          'Failed to parse image prompt response as JSON, using fallback',
          {
            error: t instanceof Error ? t.message : 'Unknown parse error',
            contentLength: e.length,
            contentPreview: e.substring(0, 100),
          }
        ),
        { prompt: e.trim(), negativePrompt: void 0, styleGuide: void 0 }
      );
    }
  }
  async generateBatchPrompts(e, t = constants_1.DEFAULT_IMAGE_MODEL) {
    return await Promise.all(e.map(e => this.generateImagePrompt(e, t)));
  }
}
exports.ImagePromptGenerator = ImagePromptGenerator;

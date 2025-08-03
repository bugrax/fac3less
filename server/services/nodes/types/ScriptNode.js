'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ScriptNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  openrouter_1 = require('../../ai/llm/providers/openrouter/index'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  testMedia_1 = require('../../../../config/testMedia'),
  logger_1 = require('../../../utils/logger');
class ScriptNode extends BaseNode_1.BaseNode {
  llmClient = null;
  constructor(config) {
    (super({ ...config, type: 'script' }),
      (this.llmClient = new openrouter_1.OpenRouterClient({})));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'prompt',
          type: DataTypes_1.DataType.ANY,
          description: 'Text prompt or prompt data for script generation',
          required: !0,
          validator: e =>
            'string' == typeof e ||
            (null !== e && 'object' == typeof e && 'string' == typeof e.text),
        },
        {
          name: 'duration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Target duration in seconds',
          required: !0,
        },
        {
          name: 'aspectRatio',
          type: DataTypes_1.DataType.TEXT,
          description: 'Video aspect ratio (9:16 or 16:9)',
          required: !1,
          defaultValue: '16:9',
        },
        {
          name: 'style',
          type: DataTypes_1.DataType.TEXT,
          description: 'Script style (professional, casual, educational, etc.)',
          required: !1,
          defaultValue: 'professional',
        },
        {
          name: 'language',
          type: DataTypes_1.DataType.TEXT,
          description: 'Language for script generation',
          required: !1,
          defaultValue: 'english',
        },
        {
          name: 'model',
          type: DataTypes_1.DataType.TEXT,
          description: 'LLM model to use',
          required: !1,
          defaultValue: 'anthropic/claude-sonnet-4',
        },
      ],
      outputs: [
        {
          name: 'script',
          type: DataTypes_1.DataType.SCRIPT,
          description: 'Generated script with scenes and metadata',
        },
        {
          name: 'scenes',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of scene objects',
        },
        {
          name: 'totalDuration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Total duration of all scenes in seconds',
        },
      ],
    };
  }
  async execute(e, t) {
    const n = this.validate(e);
    if (n) return { success: !1, error: n };
    try {
      const t = this.extractInputParameters(e);
      if (
        (await this.initializeProgress(),
        !0 === this.config.parameters?.forceError)
      )
        throw (
          logger_1.logger.warn(
            '[ScriptNode] forceError parameter detected - simulating failure'
          ),
          new Error('Forced error for testing')
        );
      if ((0, testMedia_1.isTestMode)()) {
        logger_1.logger.info('[ScriptNode] TEST MODE - Returning mock script', {
          inputDuration: e.duration,
          paramsDuration: t.duration,
          numberOfSections: t.numberOfSections,
          sectionDuration: t.sectionDuration,
        });
        const n = t.numberOfSections > 0 ? t.numberOfSections : 5,
          o = t.sectionDuration > 0 ? t.sectionDuration : 5,
          r = [],
          a = [
            "Welcome to this test video. We're demonstrating the video generation workflow.",
            'This system can generate scripts in multiple languages and styles.',
            'The audio is generated using text-to-speech technology.',
            'Images are created based on the script content.',
            'Finally, everything is combined into a complete video.',
          ];
        for (let e = 0; e < n; e++)
          r.push({
            id: `section-${e + 1}`,
            text: a[e] || `This is section ${e + 1} of the test video.`,
            audioPrompt: a[e] || `This is section ${e + 1} of the test video.`,
            imagePrompt: `Test visual for scene ${e + 1}`,
            duration: o,
          });
        const i = n * o,
          s = {
            content: 'Test Video Script Content',
            scenes: r,
            metadata: {
              title: 'Test Video Script',
              duration: i,
              style: t.style,
            },
          };
        (logger_1.logger.info(
          '[ScriptNode] TEST MODE - Generated mock script:',
          {
            numScenes: r.length,
            totalDuration: i,
            scenes: r.map(e => ({ id: e.id, duration: e.duration })),
          }
        ),
          this.updateProgress(100));
        const c = {
          success: !0,
          data: { script: s, scenes: r, totalDuration: i },
          metadata: {
            nodeId: this.config.id,
            model: 'test-mode',
            tokenCount: 0,
            cost: 0,
          },
        };
        return (
          logger_1.logger.debug('[ScriptNode] TEST MODE - Returning result:', {
            hasScript: !!c.data.script,
            scriptScenes: c.data.script.scenes.length,
            dataScenes: c.data.scenes.length,
          }),
          c
        );
      }
      const n = [
          {
            role: 'system',
            content: this.buildSystemPrompt(
              t.style,
              t.duration,
              t.numberOfSections,
              t.sectionDuration,
              t.language
            ),
          },
          { role: 'user', content: t.promptText },
        ],
        o = Math.min(50 * t.duration, 2e3);
      if (!this.llmClient)
        throw new Error(
          'LLM client not initialized. Check API token configuration.'
        );
      const r = await this.llmClient.complete({
        model: t.model,
        messages: n,
        temperature: 0.7,
        maxTokens: 4e3,
        stream: !0,
        onProgress: async (e, t) => {
          try {
            const n = Math.min(o, t),
              r = 30 + 60 * Math.min(e / n, 1);
            await this.updateProgress(r);
          } catch (e) {
            logger_1.logger.error(
              'Error updating script generation progress:',
              e
            );
          }
        },
      });
      if (!r.success || !r.data)
        throw new Error(r.error ?? 'Failed to generate script');
      const a = this.parseJsonResponse(r.data.content, t.duration),
        i = (a.sections || []).map((e, n) => {
          const o = e;
          return {
            id: o.id || `section_${n + 1}`,
            text: o.narration || '',
            duration: o.duration ?? t.sectionDuration,
            audioPrompt: o.narration || '',
          };
        }),
        s = this.convertToScriptData(a, i, t.duration, t.style),
        c = i.reduce((e, t) => e + (t.duration ?? 0), 0);
      await this.updateProgress(100);
      return {
        success: !0,
        data: { script: s, scenes: i, totalDuration: c },
        metadata: {
          nodeId: this.config.id,
          model: t.model,
          cost: r.metadata?.cost,
        },
      };
    } catch (e) {
      return (
        logger_1.logger.error('[ScriptNode] Execution error:', e),
        {
          success: !1,
          error: e instanceof Error ? e.message : 'Failed to generate script',
        }
      );
    }
  }
  extractPromptText(e) {
    return 'string' == typeof e ? e : e.text;
  }
  extractInputParameters(e) {
    const t = this.extractPromptText(e.prompt),
      n = e.duration ?? 30;
    return {
      promptText: t,
      duration: n,
      aspectRatio: e.aspectRatio ?? '16:9',
      style: e.style ?? 'professional',
      language: e.language ?? 'english',
      model: e.model ?? 'anthropic/claude-sonnet-4',
      sectionDuration: 5,
      numberOfSections: Math.ceil(n / 5),
    };
  }
  buildSystemPrompt(e, t, n, o, r) {
    const a = this.getStyleGuidelines(e),
      i = r.charAt(0).toUpperCase() + r.slice(1).replace('-', ' ');
    return `You are a viral short-form video script writer specializing in ${e} content for TikTok, YouTube Shorts, and Instagram Reels.\n\nLANGUAGE REQUIREMENT:\n- Generate ALL script content in ${i} language\n- Use native expressions and cultural references appropriate for ${i} speakers\n- Maintain the viral video style while being culturally authentic\n\nVIDEO REQUIREMENTS:\n- Total duration: ${t} seconds\n- Style: ${e}\n- Number of sections: ${n}\n- Each section: Target ${o} seconds (with buffer for TTS variation)\n\nATTENTION HOOK REQUIREMENTS (CRITICAL):\n- FIRST 3 SECONDS MUST grab attention immediately\n- Start with a bold statement, shocking fact, or intriguing question\n- Create curiosity gaps that viewers NEED filled\n- Use pattern interrupts and unexpected angles\n- Promise value within the first sentence\n\nSCRIPT GUIDELINES FOR ${e.toUpperCase()} STYLE:\n${a}\n\nSHORT-FORM VIDEO PRINCIPLES:\n- Assume viewers will scroll away in 1 second - HOOK THEM INSTANTLY\n- Every section must add new value or viewers leave\n- Use cliffhangers between sections to maintain retention\n- End with a strong call-to-action or memorable takeaway\n- Write for viewers with 8-second attention spans\n\nCRITICAL REQUIREMENTS:\n1. Create EXACTLY ${n} sections targeting ${o} seconds each\n2. Write narration that takes ${o} seconds to read aloud (approximately ${Math.round(2.2 * o)} words)\n3. Focus ONLY on the narration script - do NOT include visual descriptions\n4. Make the narration punchy, direct, and binge-worthy\n5. Return ONLY valid JSON with no markdown formatting\n\nReturn the response in this EXACT JSON format:\n{\n  "title": "Short, compelling title",\n  "sections": [\n    {\n      "id": "section_1",\n      "narration": "Narration text that takes ${o} seconds to read",\n      "duration": ${o}\n    },\n    {\n      "id": "section_2",\n      "narration": "Next ${o}-second narration",\n      "duration": ${o}\n    }\n  ]\n}`;
  }
  getStyleGuidelines(e) {
    const t = {
      'viral-explainer':
        '- Hook Examples: "The truth about X will shock you" / "Scientists just discovered..." / "99% of people don\'t know this"\n        - Use rapid-fire facts, mind-blowing statistics, and "wait for it" moments\n        - Structure: Hook → Explanation → Plot Twist → Mind Blown Conclusion\n        - Tone: Excited, urgent, "you need to know this RIGHT NOW"\n        - Phrases: "But here\'s the crazy part..." / "It gets even wilder..." / "And that\'s not even the best part"\n        - End with: "Follow for more mind-blowing facts!"',
      storytime:
        '- Hook Examples: "I\'ll never forget the day..." / "This happened to me last week" / "You won\'t believe what I just saw"\n        - Use personal narrative, emotional rollercoaster, relatable situations\n        - Structure: Hook → Setup → Conflict → Twist → Resolution → Lesson\n        - Tone: Conversational, dramatic, "gathering around to hear a story"\n        - Phrases: "So there I was..." / "But then something crazy happened..." / "And in that moment..."\n        - End with: "Has this ever happened to you? Let me know in the comments!"',
      educational:
        '- Hook Examples: "Here\'s how to X in 30 seconds" / "The 3-step method that changed everything" / "Stop doing X wrong"\n        - Use numbered lists, clear frameworks, actionable takeaways\n        - Structure: Hook → Problem → Solution Steps → Quick Recap → Application\n        - Tone: Authoritative but friendly, "your smart friend teaching you"\n        - Phrases: "Step 1..." / "The key is..." / "Remember this..." / "Pro tip:"\n        - End with: "Save this for later and try it yourself!"',
      'life-hacks':
        '- Hook Examples: "This $2 item will change your life" / "I was today years old when I learned..." / "Why didn\'t anyone tell me this sooner?"\n        - Use before/after contrast, immediate value, "aha!" moments\n        - Structure: Hook → Problem Everyone Has → Simple Solution → Demo → Results\n        - Tone: Enthusiastic, helpful, "sharing a secret with friends"\n        - Phrases: "Game changer alert!" / "You\'ve been doing it wrong!" / "Try this instead..." / "Thank me later"\n        - End with: "What other hacks do you want to see?"',
      motivational:
        '- Hook Examples: "If you\'re feeling stuck, watch this" / "This mindset shift changed my life" / "Your breakthrough is one decision away"\n        - Use powerful metaphors, success stories, emotional triggers\n        - Structure: Hook → Relatable Struggle → Turning Point → Transformation → Call to Action\n        - Tone: Empowering, urgent, "coach pumping you up"\n        - Phrases: "Listen closely..." / "This is your sign to..." / "Imagine if..." / "You have what it takes"\n        - End with: "Your time is NOW. What are you waiting for?"',
      'dark-truth':
        '- Hook Examples: "They don\'t want you to know this..." / "What really happened that night..." / "The disturbing truth about..."\n        - Use ominous tone, conspiracy angles, hidden knowledge, unsettling facts\n        - Structure: Hook → Forbidden Knowledge → Evidence → Dark Revelation → Warning\n        - Tone: Mysterious, urgent, "whispering secrets in the dark"\n        - Phrases: "Look closer..." / "It\'s not what it seems..." / "They\'ve been hiding this..." / "Don\'t watch this alone"\n        - End with: "Now you know the truth. What will you do?"',
      'comedy-roast':
        '- Hook Examples: "Why is nobody talking about how weird X is?" / "I can\'t be the only one who thinks..." / "We need to roast..."\n        - Use sarcastic observations, relatable complaints, exaggerated reactions\n        - Structure: Hook → Setup the Absurdity → Roast It → More Examples → Punchline\n        - Tone: Sarcastic, playful, "your funniest friend roasting everything"\n        - Phrases: "Be so fr..." / "The way I screamed..." / "Not the..." / "It\'s giving..." / "No but why..."\n        - End with: "I said what I said!" / "Don\'t @ me!"',
      'drama-tea':
        '- Hook Examples: "So apparently..." / "Y\'all are not ready for this tea" / "The drama that went down..."\n        - Use gossip format, dramatic pauses, shocking reveals, receipts\n        - Structure: Hook → Background → The Tea → Plot Twist → More Tea → Aftermath\n        - Tone: Gossipy, shocked, "best friend spilling all the drama"\n        - Phrases: "And THEN..." / "But wait, it gets worse..." / "I have the screenshots..." / "The way my jaw DROPPED"\n        - End with: "What do y\'all think? Team X or Team Y?"',
      'finance-hustle':
        '- Hook Examples: "How I made $X in 24 hours" / "The money hack banks hate" / "Stop being broke, do this instead"\n        - Use success stories, easy money angles, FOMO triggers, wealth mindset\n        - Structure: Hook → Poor to Rich Story → The Method → Social Proof → Call to Action\n        - Tone: Confident, urgent, "that friend who\'s always hustling"\n        - Phrases: "While you\'re scrolling, I\'m earning..." / "This is why you\'re broke..." / "Copy this exactly..." / "Thank me when you\'re rich"\n        - End with: "Your bank account will thank you. Link in bio!"',
      'dating-advice':
        '- Hook Examples: "Girls/Guys, we need to talk about..." / "The red flag everyone ignores" / "If they do this, RUN"\n        - Use relationship wisdom, red/green flags, dating horror stories, empowerment\n        - Structure: Hook → Relatable Dating Problem → The Truth → Examples → Empowering Message\n        - Tone: Best friend giving advice, protective, "been there, learned that"\n        - Phrases: "The bare minimum..." / "Know your worth..." / "This is love bombing..." / "Normalize leaving when..."\n        - End with: "You deserve better, bestie!"',
      professional:
        '- Use formal language, clear structure, and authoritative tone\n- Focus on credibility and expertise',
    };
    return t[e] || t['viral-explainer'];
  }
  async initializeProgress() {
    (await this.updateProgress(5),
      await new Promise(e => setTimeout(e, 300)),
      await this.updateProgress(10),
      await new Promise(e => setTimeout(e, 200)),
      await this.updateProgress(15),
      await new Promise(e => setTimeout(e, 200)),
      await this.updateProgress(20),
      await new Promise(e => setTimeout(e, 100)),
      await this.updateProgress(25),
      await new Promise(e => setTimeout(e, 100)),
      await this.updateProgress(30));
  }
  parseJsonResponse(e, t) {
    let n = e;
    e.includes('```json')
      ? (n = e
          .replace(/```json\s*/g, '')
          .replace(/```/g, '')
          .trim())
      : e.includes('```') && (n = e.replace(/```\s*/g, '').trim());
    try {
      return JSON.parse(n);
    } catch (e) {
      return (
        logger_1.logger.error('[ScriptNode] JSON parse error:', e),
        this.attemptJsonRepair(n, t)
      );
    }
  }
  attemptJsonRepair(e, t) {
    try {
      const t = e.lastIndexOf('}');
      if (t > 0) {
        let n = e.substring(0, t + 1);
        return ((n = this.balanceBracketsAndBraces(n)), JSON.parse(n));
      }
    } catch (e) {
      logger_1.logger.error('[ScriptNode] Failed to fix JSON:', e);
    }
    return {
      title: 'Error Video',
      sections: [
        {
          id: 'section_1',
          narration: 'Failed to generate complete script due to parsing error.',
          duration: t,
        },
      ],
    };
  }
  balanceBracketsAndBraces(e) {
    let t = e;
    const n = (t.match(/\[/g) || []).length,
      o = (t.match(/\]/g) || []).length;
    n > o && (t = t.replace(/,\s*$/, '') + ']'.repeat(n - o));
    const r = (t.match(/{/g) || []).length,
      a = (t.match(/}/g) || []).length;
    return (r > a && (t += '}'.repeat(r - a)), t);
  }
  convertToScriptData(e, t, n, o) {
    return {
      content: t.map(e => e.text).join(' '),
      scenes: t,
      metadata: {
        title: e.title || 'Generated Video',
        duration: n,
        style: o,
        sectionCount: t.length,
      },
    };
  }
  validateCustom(e) {
    const t = e;
    if (void 0 === t.prompt || null === t.prompt)
      return 'Prompt is required for script generation';
    const n = this.extractPromptText(t.prompt);
    return n && 0 !== n.trim().length ? null : 'Prompt text cannot be empty';
  }
}
exports.ScriptNode = ScriptNode;

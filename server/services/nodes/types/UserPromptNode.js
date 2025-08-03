'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.UserPromptNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes');
class UserPromptNode extends BaseNode_1.BaseNode {
  constructor(config) {
    super({ ...config, type: 'userPrompt' });
  }
  defineDefaultPorts() {
    return {
      inputs: [],
      outputs: [
        {
          name: 'prompt',
          type: DataTypes_1.DataType.TEXT,
          description: 'The video concept/idea from user'
        },
        {
          name: 'duration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Target video duration in seconds'
        },
        {
          name: 'aspectRatio',
          type: DataTypes_1.DataType.TEXT,
          description: 'Video aspect ratio (9:16 or 16:9)'
        },
        {
          name: 'style',
          type: DataTypes_1.DataType.TEXT,
          description:
            'Video content style (viral-explainer, storytime, educational, life-hacks, motivational, dark-truth, comedy-roast, drama-tea, finance-hustle, dating-advice)'
        },
        {
          name: 'visualStyle',
          type: DataTypes_1.DataType.TEXT,
          description:
            'Visual style for images (cinematic, anime, dark-fantasy, minimalist, cyberpunk, retro, surreal, realistic)'
        },
        {
          name: 'language',
          type: DataTypes_1.DataType.TEXT,
          description: 'Language for script and audio generation'
        },
        {
          name: 'dimensions',
          type: DataTypes_1.DataType.OBJECT,
          description: 'Video dimensions (width and height)'
        }
      ]
    };
  }
  async execute(e, t) {
    const {
      idea: a,
      duration: i,
      aspectRatio: s,
      style: r,
      visualStyle: o,
      language: n
    } = this.config.parameters || {};
    if (!a || 'string' !== typeof a || 0 === a.trim().length) {
      return { success: !1, error: 'Video idea/concept is required' };
    }
    const c = [15, 30, 45],
      d = Number(i) || 30;
    if (!c.includes(d)) {
      return {
        success: !1,
        error: `Duration must be one of: ${c.join(', ')} seconds`
      };
    }
    const u = ['9:16', '16:9'],
      p = String(s || '16:9');
    if (!u.includes(p)) {
      return {
        success: !1,
        error: `Aspect ratio must be one of: ${u.join(', ')}`
      };
    }
    const l = [
        'viral-explainer',
        'storytime',
        'educational',
        'life-hacks',
        'motivational',
        'dark-truth',
        'comedy-roast',
        'drama-tea',
        'finance-hustle',
        'dating-advice',
        'test-mode'
      ],
      m = String(r || 'comedy-roast');
    if (!l.includes(m)) {
      return { success: !1, error: `Style must be one of: ${l.join(', ')}` };
    }
    const y = [
        'cinematic',
        'anime',
        'dark-fantasy',
        'minimalist',
        'cyberpunk',
        'retro',
        'surreal',
        'realistic',
        'flat-design',
        'silhouette',
        'isometric',
        'line-art',
        'duotone',
        'abstract-geometric',
        'bauhaus',
        'liminal',
        'analog-horror',
        'stark-horror',
        'vaporwave',
        'deep-fried',
        'y2k-digital',
        'storybook',
        'comic-noir',
        'puppet-theater',
        'diorama',
        'security-cam',
        'night-vision',
        'trail-cam',
        'classified',
        'old-newsreel',
        'super-8',
        'polaroid-horror',
        'thermal',
        'test'
      ],
      h = String(o || 'anime');
    if (!y.includes(h)) {
      return {
        success: !1,
        error: `Visual style must be one of: ${y.join(', ')}`
      };
    }
    const g = [
        'english',
        'spanish',
        'french',
        'german',
        'portuguese',
        'italian',
        'dutch',
        'polish',
        'russian',
        'japanese',
        'korean',
        'chinese-simplified',
        'chinese-traditional',
        'arabic',
        'turkish',
        'romanian',
        'greek',
        'czech',
        'finnish',
        'hindi',
        'thai',
        'indonesian'
      ],
      f = String(n || 'english').toLowerCase();
    if (!g.includes(f)) {
      return { success: !1, error: `Language must be one of: ${g.join(', ')}` };
    }
    const T = {
      '9:16': { width: 1080, height: 1920 },
      '16:9': { width: 1920, height: 1080 }
    }[p];
    this.updateProgress(100);
    return {
      success: !0,
      data: {
        prompt: a.trim(),
        duration: d,
        aspectRatio: p,
        style: m,
        visualStyle: h,
        language: f,
        dimensions: T
      },
      metadata: { nodeId: this.config.id, timestamp: new Date().toISOString() }
    };
  }
  validateCustom(e) {
    return null;
  }
}
exports.UserPromptNode = UserPromptNode;

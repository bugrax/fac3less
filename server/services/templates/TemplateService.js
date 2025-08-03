'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.templateService = exports.TemplateService = void 0));
const ScriptNode_1 = require('../nodes/types/ScriptNode'),
  ImageGenerationNode_1 = require('../nodes/types/ImageGenerationNode'),
  AudioGenerationNode_1 = require('../nodes/types/AudioGenerationNode'),
  VideoGenerationNode_1 = require('../nodes/types/VideoGenerationNode'),
  EditingNodeV2_1 = require('../nodes/types/EditingNodeV2'),
  CaptionGenerationNode_1 = require('../nodes/types/CaptionGenerationNode'),
  VideoCompilationNode_1 = require('../nodes/types/VideoCompilationNode'),
  FinalOutputNode_1 = require('../nodes/types/FinalOutputNode');
class TemplateService {
  systemTemplates = new Map();
  userTemplates = new Map();
  nodeTypes = new Map();
  idCounter = 0;
  constructor() {
    (this.initializeNodeTypes(), this.initializeSystemTemplates());
  }
  initializeNodeTypes() {
    (this.nodeTypes.set('ScriptNode', ScriptNode_1.ScriptNode),
      this.nodeTypes.set(
        'ImageGenerationNode',
        ImageGenerationNode_1.ImageGenerationNode
      ),
      this.nodeTypes.set(
        'AudioGenerationNode',
        AudioGenerationNode_1.AudioGenerationNode
      ),
      this.nodeTypes.set(
        'VideoGenerationNode',
        VideoGenerationNode_1.VideoGenerationNode
      ),
      this.nodeTypes.set('EditingNode', EditingNodeV2_1.EditingNodeV2),
      this.nodeTypes.set(
        'CaptionGenerationNode',
        CaptionGenerationNode_1.CaptionGenerationNode
      ),
      this.nodeTypes.set(
        'VideoCompilationNode',
        VideoCompilationNode_1.VideoCompilationNode
      ),
      this.nodeTypes.set('FinalOutputNode', FinalOutputNode_1.FinalOutputNode));
  }
  initializeSystemTemplates() {
    [
      {
        id: 'tiktok-viral',
        name: 'TikTok/Reels Viral',
        description:
          'Short-form vertical content optimized for virality with eye-catching captions',
        tags: ['tiktok', 'reels', 'viral', 'short-form', 'vertical'],
        author: 'system',
        isPublic: !0,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        category: 'social-media',
        popularity: 95,
        nodes: {
          CaptionGenerationNode: {
            fontSize: 36,
            position: 'middle',
            fontFamily: 'Archivo Black',
            maxLineLength: 15,
            lineHeight: 0.8,
          },
          EditingNode: { aspectRatio: '9:16', outputResolution: '1080x1920' },
          VideoGenerationNode: { aspectRatio: '9:16', duration: 3 },
        },
      },
      {
        id: 'youtube-tutorial',
        name: 'YouTube Tutorial',
        description:
          'Educational content with clear, readable captions for desktop viewing',
        tags: ['youtube', 'tutorial', 'educational', 'long-form', 'horizontal'],
        author: 'system',
        isPublic: !0,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        category: 'educational',
        popularity: 85,
        nodes: {
          CaptionGenerationNode: {
            fontSize: 24,
            position: 'bottom',
            fontFamily: 'Inter',
            maxLineLength: 50,
            embedInVideo: !0,
          },
          EditingNode: { aspectRatio: '16:9', outputResolution: '1920x1080' },
          VideoGenerationNode: { aspectRatio: '16:9', duration: 5 },
        },
      },
      {
        id: 'instagram-story',
        name: 'Instagram Story',
        description: 'Vertical content with stylish lower-third captions',
        tags: ['instagram', 'story', 'vertical', 'social-media'],
        author: 'system',
        isPublic: !0,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        category: 'social-media',
        popularity: 80,
        nodes: {
          CaptionGenerationNode: {
            fontSize: 32,
            position: '60percent',
            fontFamily: 'Archivo Black',
            maxLineLength: 20,
          },
          EditingNode: { aspectRatio: '9:16', outputResolution: '1080x1920' },
          VideoGenerationNode: { aspectRatio: '9:16', duration: 4 },
        },
      },
      {
        id: 'linkedin-professional',
        name: 'LinkedIn Professional',
        description:
          'Professional content with subtle captions for business audience',
        tags: ['linkedin', 'professional', 'business', 'horizontal'],
        author: 'system',
        isPublic: !0,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        category: 'marketing',
        popularity: 70,
        nodes: {
          CaptionGenerationNode: {
            fontSize: 22,
            position: 'bottom',
            fontFamily: 'Inter',
            maxLineLength: 45,
          },
          EditingNode: { aspectRatio: '16:9', outputResolution: '1920x1080' },
          VideoGenerationNode: { aspectRatio: '16:9', duration: 5 },
        },
      },
    ].forEach(e => {
      this.systemTemplates.set(e.id, e);
    });
  }
  getNodeDefaults() {
    const e = {};
    return (
      this.nodeTypes.forEach((t, i) => {
        try {
          const o = new t('temp', 'Temp Node').getInputPorts();
          ((e[i] = {}),
            o.forEach(t => {
              void 0 !== t.defaultValue && (e[i][t.name] = t.defaultValue);
            }));
        } catch {}
      }),
      e
    );
  }
  getSystemTemplates(e) {
    let t = Array.from(this.systemTemplates.values());
    if (e) {
      if (
        (e.tags &&
          e.tags.length > 0 &&
          (t = t.filter(t => e.tags.some(e => t.tags.includes(e)))),
        e.category && (t = t.filter(t => t.category === e.category)),
        e.search)
      ) {
        const i = e.search.toLowerCase();
        t = t.filter(
          e =>
            e.name.toLowerCase().includes(i) ||
            e.description.toLowerCase().includes(i) ||
            e.tags.some(e => e.toLowerCase().includes(i))
        );
      }
      ((t = t.sort((e, t) => (t.popularity || 0) - (e.popularity || 0))),
        e.offset && (t = t.slice(e.offset)),
        e.limit && (t = t.slice(0, e.limit)));
    }
    return t;
  }
  getSystemTemplate(e) {
    return this.systemTemplates.get(e) || null;
  }
  getUserTemplates(e, t) {
    let i = Array.from(this.userTemplates.values()).filter(t => t.userId === e);
    if (t) {
      if (
        (t.tags &&
          t.tags.length > 0 &&
          (i = i.filter(e => t.tags.some(t => e.tags.includes(t)))),
        t.search)
      ) {
        const e = t.search.toLowerCase();
        i = i.filter(
          t =>
            t.name.toLowerCase().includes(e) ||
            t.description.toLowerCase().includes(e) ||
            t.tags.some(t => t.toLowerCase().includes(e))
        );
      }
      ((i = i.sort((e, t) => t.updatedAt.getTime() - e.updatedAt.getTime())),
        t.offset && (i = i.slice(t.offset)),
        t.limit && (i = i.slice(0, t.limit)));
    }
    return i;
  }
  createUserTemplate(e, t) {
    const i = {
      ...t,
      id: `user-${e}-${Date.now()}-${++this.idCounter}`,
      userId: e,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };
    return (this.userTemplates.set(i.id, i), i);
  }
  updateUserTemplate(e, t, i) {
    const o = this.userTemplates.get(t);
    if (!o || o.userId !== e) return null;
    const s = {
      ...o,
      ...i,
      id: o.id,
      userId: o.userId,
      createdAt: o.createdAt,
      updatedAt: new Date(),
      version: o.version + 1,
    };
    return (this.userTemplates.set(t, s), s);
  }
  deleteUserTemplate(e, t) {
    const i = this.userTemplates.get(t);
    return !(!i || i.userId !== e) && (this.userTemplates.delete(t), !0);
  }
  forkTemplate(e, t, i) {
    const o = this.systemTemplates.get(t) || this.userTemplates.get(t);
    if (!o) return null;
    const s = {
      name: i,
      description: `Forked from "${o.name}"`,
      tags: [...o.tags],
      author: e,
      authorName: void 0,
      isPublic: !1,
      nodes: JSON.parse(JSON.stringify(o.nodes)),
      structure: o.structure ? JSON.parse(JSON.stringify(o.structure)) : void 0,
      id: `user-${e}-${Date.now()}-${++this.idCounter}`,
      userId: e,
      forkedFrom: t,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };
    return (this.userTemplates.set(s.id, s), s);
  }
}
((exports.TemplateService = TemplateService),
  (exports.templateService = new TemplateService()));

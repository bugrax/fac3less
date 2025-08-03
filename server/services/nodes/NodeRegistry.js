'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.NodeRegistry = void 0));
const types_1 = require('../styles/types'),
  UserPromptNode_1 = require('./types/UserPromptNode'),
  ScriptNode_1 = require('./types/ScriptNode'),
  ImagePromptNode_1 = require('./types/ImagePromptNode'),
  VideoGenerationNode_1 = require('./types/VideoGenerationNode'),
  ImageGenerationNode_1 = require('./types/ImageGenerationNode'),
  AudioGenerationNode_1 = require('./types/AudioGenerationNode'),
  EditingNodeWrapper_1 = require('./types/EditingNodeWrapper'),
  CaptionGenerationNode_1 = require('./types/CaptionGenerationNode'),
  FinalOutputNode_1 = require('./types/FinalOutputNode'),
  VideoCompilationNode_1 = require('./types/VideoCompilationNode'),
  MockDataNode_1 = require('./types/MockDataNode'),
  logger_1 = require('../../utils/logger');
class NodeRegistry {
  static instance;
  nodeTypes;
  nodeInstances;
  nodes = new Map();
  constructor() {
    ((this.nodeTypes = new Map()),
      (this.nodeInstances = new Map()),
      this.registerNodeType('userPrompt', UserPromptNode_1.UserPromptNode),
      this.registerNodeType('script', ScriptNode_1.ScriptNode),
      this.registerNodeType('imagePrompt', ImagePromptNode_1.ImagePromptNode),
      this.registerNodeType(
        'videoGeneration',
        VideoGenerationNode_1.VideoGenerationNode
      ),
      this.registerNodeType(
        'video_generation',
        VideoGenerationNode_1.VideoGenerationNode
      ),
      this.registerNodeType(
        'imageGeneration',
        ImageGenerationNode_1.ImageGenerationNode
      ),
      this.registerNodeType(
        'image_generation',
        ImageGenerationNode_1.ImageGenerationNode
      ),
      this.registerNodeType(
        'audioGeneration',
        AudioGenerationNode_1.AudioGenerationNode
      ),
      this.registerNodeType(
        'audio_generation',
        AudioGenerationNode_1.AudioGenerationNode
      ),
      this.registerNodeType('editing', EditingNodeWrapper_1.EditingNodeWrapper),
      this.registerNodeType(
        'captionGeneration',
        CaptionGenerationNode_1.CaptionGenerationNode
      ),
      this.registerNodeType(
        'caption_generation',
        CaptionGenerationNode_1.CaptionGenerationNode
      ),
      this.registerNodeType('finalOutput', FinalOutputNode_1.FinalOutputNode),
      this.registerNodeType('final_output', FinalOutputNode_1.FinalOutputNode),
      this.registerNodeType(
        'videoCompilation',
        VideoCompilationNode_1.VideoCompilationNode
      ),
      this.registerNodeType('mockData', MockDataNode_1.MockDataNode));
  }
  registerNodeType(e, t) {
    this.nodeTypes.set(e, t);
  }
  register(e, t) {
    this.registerNodeType(e, t);
  }
  setNode(e, t) {
    this.nodes.set(e, t);
  }
  createNode(config) {
    this.nodeInstances.size > 1e3 &&
      logger_1.logger.warn(
        `NodeRegistry has ${this.nodeInstances.size} instances - potential memory leak`
      );
    const e = this.nodes.get(config.type);
    if (e) {
      const t = new e(config),
        o = this.wrapMockNode(t, config);
      return (this.nodeInstances.set(config.id, o), o);
    }
    const t = this.nodeTypes.get(config.type);
    if (!t) throw new Error(`Unknown node type: ${config.type}`);
    const o = new t(config);
    return (this.nodeInstances.set(config.id, o), o);
  }
  wrapMockNode(e, config) {
    class MockNodeWrapper extends types_1.BaseNode {
      constructor() {
        super(config);
      }
      async execute(t, o) {
        if ('function' == typeof e.process) {
          return { success: !0, data: await e.process(t, o) };
        }
        throw new Error('Mock node has no process method');
      }
      defineDefaultPorts() {
        return 'function' == typeof e.getInputPorts &&
          'function' == typeof e.getOutputPorts
          ? {
              inputs: e
                .getInputPorts()
                .map(e => ({ name: e.name, type: e.type, required: !1 })),
              outputs: e
                .getOutputPorts()
                .map(e => ({ name: e.name, type: e.type })),
            }
          : { inputs: [], outputs: [] };
      }
      async cleanup() {
        'function' == typeof e.cleanup && (await e.cleanup());
      }
    }
    return new MockNodeWrapper();
  }
  getNode(e) {
    return this.nodeInstances.get(e);
  }
  removeNode(e) {
    return this.nodeInstances.delete(e);
  }
  getNodeTypes() {
    return new Set(this.nodeTypes.keys());
  }
  getAllNodes() {
    return Array.from(this.nodeInstances.values());
  }
  getNodesByType(e) {
    return this.getAllNodes().filter(t => t.getType() === e);
  }
  clear() {
    this.nodeInstances.clear();
  }
  static getInstance() {
    return (
      NodeRegistry.instance || (NodeRegistry.instance = new NodeRegistry()),
      NodeRegistry.instance
    );
  }
  getNodeClass(e) {
    return this.nodeTypes.get(e);
  }
}
exports.NodeRegistry = NodeRegistry;

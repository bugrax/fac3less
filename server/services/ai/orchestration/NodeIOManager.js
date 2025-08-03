'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.NodeIOManager = void 0));
const DataTransformer_1 = require('../../nodes/DataTransformer'),
  logger_1 = require('../../../utils/logger');
class NodeIOManager {
  dataTransformer;
  constructor() {
    this.dataTransformer = new DataTransformer_1.DataTransformer();
  }
  async gatherAndTransformInputs(e, r, t, o, a) {
    const g = {},
      n = r.edges.filter(r => r.target === e),
      s = r.nodes.find(r => r.id === e);
    if (
      (this.extractNodeParameters(s, e, g),
      logger_1.logger.debug(
        `[WORKFLOW] Node ${e} has ${n.length} incoming edges`
      ),
      0 === n.length)
    )
      return (
        logger_1.logger.debug(
          `[WORKFLOW] Node ${e} using initial input (no dependencies)`
        ),
        { ...o, ...g }
      );
    for (const r of n) await this.processEdge(r, e, t, a, g, n);
    return g;
  }
  async transformValue(e, r) {
    const t = this.dataTransformer.detectDataType(e);
    return this.dataTransformer.transform(e, t, r);
  }
  extractNodeParameters(e, r, t) {
    if (e) {
      if (
        (logger_1.logger.debug(
          `[WORKFLOW] Extracting parameters for node ${r} (type: ${e.type}):`,
          { hasParameters: !!e.parameters, parameters: e.parameters }
        ),
        e.parameters)
      ) {
        if (this.isMediaGenerationNode(e.type) && e.parameters.mediaModel) {
          const modelId = e.parameters.mediaModel;
          ((t.model = modelId),
            logger_1.logger.debug(
              `[WORKFLOW] Using media model ${modelId} for ${e.type} node ${r}`
            ));
        }
        ('editing' === e.type &&
          logger_1.logger.debug(
            '[WORKFLOW] Editing node parameters before copy:',
            e.parameters
          ),
          Object.assign(t, e.parameters),
          'editing' === e.type &&
            logger_1.logger.debug(
              '[WORKFLOW] Editing node inputs after parameter copy:',
              t
            ));
      }
      if ('data' in e && e.data?.modelId) {
        const modelId = e.data?.modelId;
        modelId && (t.model = modelId);
      }
    }
  }
  isMediaGenerationNode(e) {
    return [
      'image_generation',
      'video_generation',
      'imageGeneration',
      'videoGeneration',
    ].includes(e);
  }
  async processEdge(e, r, t, o, a, g) {
    logger_1.logger.debug(
      `\n📊 [WORKFLOW] Processing edge ${e.id}: ${e.source} → ${r}`
    );
    const n = t.get(e.source);
    if (!n)
      return void logger_1.logger.debug(
        `⚠️ [WORKFLOW] WARNING: No output available from source node ${e.source}`
      );
    this.logVideoGenerationDebug(r, e.source, n);
    const s = e.data?.sourcePort || e.sourceHandle,
      i = e.data?.targetPort || e.targetHandle;
    s && i
      ? await this.mapSpecificPorts(n, s, i, o, a)
      : await this.mapPortsIntelligently(e, n, o, a, g);
  }
  logVideoGenerationDebug(e, r, t) {
    if (e.includes('video') && r.includes('image')) {
      const e = t.images,
        r = Array.isArray(e) ? e.length : 0;
      logger_1.logger.debug(
        `[WORKFLOW] Video node receiving ${r} images from image node`
      );
    }
  }
  async mapSpecificPorts(e, r, t, o, a) {
    const g = e[r];
    if (
      (logger_1.logger.debug(`[WORKFLOW] Mapping port ${r} → ${t}`, {
        hasValue: void 0 !== g,
        valueType: typeof g,
        isScript: 'script' === r,
        scriptKeys: 'script' === r && g ? Object.keys(g) : [],
        targetNodeType: o.getType(),
        isAudioMapping: 'audioFiles' === r && 'audioFile' === t,
        arrayLength: Array.isArray(g) ? g.length : 'n/a',
      }),
      void 0 !== g)
    ) {
      const e = o.getInputPort(t);
      if (e) {
        const o = await this.transformValue(g, e.type);
        ((a[t] = o),
          logger_1.logger.debug(`[WORKFLOW] Successfully mapped ${r} → ${t}`));
      } else
        logger_1.logger.warn(
          `[WORKFLOW] Target port ${t} not found on node ${o.getType()}`
        );
    } else
      logger_1.logger.warn(`[WORKFLOW] No value found for source port ${r}`);
  }
  async mapPortsIntelligently(e, r, t, o, a) {
    const g = t.getInputPorts();
    for (const e of g) {
      const t = e.name;
      void 0 !== r[t] && (o[t] = r[t]);
    }
    0 === Object.keys(o).length && 1 === a.length && Object.assign(o, r);
  }
}
exports.NodeIOManager = NodeIOManager;

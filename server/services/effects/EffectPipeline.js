'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.EffectPipeline = void 0));
const child_process_1 = require('child_process'),
  util_1 = require('util'),
  uuid_1 = require('uuid'),
  MediaAnalyzer_1 = require('../media/MediaAnalyzer'),
  MediaFileManager_1 = require('../media/MediaFileManager'),
  logger_1 = require('../../utils/logger'),
  execPromise = (0, util_1.promisify)(child_process_1.exec),
  DEFAULT_MAX_PROCESSING_TIME = 6e5,
  DEFAULT_PROGRESS_INTERVAL = 1e3,
  DEFAULT_MAX_BUFFER_SIZE = 10485760,
  CODEC_TYPE_VIDEO = 'video',
  CODEC_TYPE_AUDIO = 'audio',
  FILTER_VIDEO_IN = '[video_in]',
  FILTER_AUDIO_IN = '[audio_in]',
  FILTER_VIDEO_OUT = '[video_out]',
  FILTER_AUDIO_OUT = '[audio_out]',
  INITIAL_VIDEO_LABEL = '0:v',
  INITIAL_AUDIO_LABEL = '0:a',
  FFMPEG_COMMAND = 'ffmpeg',
  FFMPEG_OVERWRITE_FLAG = '-y',
  FFMPEG_INPUT_FLAG = '-i',
  FFMPEG_FILTER_COMPLEX_FLAG = '-filter_complex',
  FFMPEG_MAP_FLAG = '-map',
  FFMPEG_VIDEO_CODEC = '-c:v libx264',
  FFMPEG_AUDIO_CODEC = '-c:a aac',
  ERROR_NO_EFFECTS = 'No effects in pipeline',
  ERROR_NO_VIDEO_INPUT = 'Pipeline requires video input but none provided',
  ERROR_NO_AUDIO_INPUT = 'Pipeline requires audio input but none provided',
  LOG_TAG = '[EffectPipeline]',
  DEFAULT_TEMP_DIR = './temp';
class EffectPipeline {
  effects = [];
  config;
  mediaAnalyzer;
  fileManager;
  constructor(config = {}, e, i) {
    ((this.config = {
      validateBeforeExecution: !0,
      optimizeFilterGraph: !0,
      maxProcessingTime: 6e5,
      useHardwareAcceleration: !1,
      progressInterval: 1e3,
      ...config,
    }),
      (this.mediaAnalyzer = e || new MediaAnalyzer_1.MediaAnalyzer()),
      (this.fileManager = i || new MediaFileManager_1.MediaFileManager()));
  }
  addEffect(e) {
    (this.effects.push(e),
      this.effects.sort((e, i) => e.getPriority() - i.getPriority()));
  }
  removeEffect(e) {
    this.effects = this.effects.filter(i => i.name !== e);
  }
  clearEffects() {
    this.effects = [];
  }
  getEffects() {
    return [...this.effects];
  }
  validatePipeline(e) {
    const i = [],
      t = [];
    return (
      this.checkPipelineEmpty(t),
      this.validateEffects(e, i, t),
      this.validateRequirements(e, i),
      {
        valid: 0 === i.length,
        errors: i.length > 0 ? i : void 0,
        warnings: t.length > 0 ? t : void 0,
      }
    );
  }
  async execute(e, i, t = {}) {
    const a = Date.now(),
      s = new Map();
    try {
      const o = await this.createContext(e, t),
        r = this.checkValidationIfConfigured(o, a, s);
      if (r) return r;
      const d = this.buildFilterGraph(o),
        n = this.buildCommand(o.inputs, i, d);
      return (
        await this.executeCommand(n),
        this.recordResults(s),
        this.createSuccessResult(i, a, s)
      );
    } catch (e) {
      return (
        logger_1.logger.error(`${LOG_TAG} Execution failed:`, e),
        this.createErrorResult(e, a, s)
      );
    }
  }
  async createContext(e, i) {
    const {
        videoStream: t,
        videoMetadata: a,
        audioStream: s,
      } = await this.analyzeMedia(e),
      o = await this.ensureTempDirectory(i.tempDir);
    return {
      inputs: this.buildInputs(e, i, s),
      metadata: this.buildMetadata(t, s, a),
      tempDir: o,
      state: new Map(),
    };
  }
  buildFilterGraph(e) {
    const i = [],
      t = { video: '0:v', audio: '0:a' };
    for (const a of this.effects) {
      const {
        processedFilterNodes: s,
        newVideoLabel: o,
        newAudioLabel: r,
      } = this.processEffect(a, e, t.video, t.audio);
      (i.push(...s), (t.video = o), (t.audio = r));
    }
    return { nodes: i, outputs: { video: t.video, audio: t.audio } };
  }
  buildCommand(e, i, t) {
    const a = ['ffmpeg', '-y'];
    return (this.assembleCommandParts(a, e, t, i), a.join(' '));
  }
  async executeCommand(e) {
    await execPromise(e, {
      timeout: this.config.maxProcessingTime,
      maxBuffer: 10485760,
    });
  }
  recordResults(e) {
    for (const i of this.effects) e.set(i.name, { applied: !0, duration: 0 });
  }
  createSuccessResult(e, i, t) {
    return {
      success: !0,
      outputPath: e,
      executionTime: Date.now() - i,
      effectResults: t,
    };
  }
  createErrorResult(e, i, t) {
    return {
      success: !1,
      errors: [e instanceof Error ? e.message : 'Unknown error'],
      executionTime: Date.now() - i,
      effectResults: t,
    };
  }
  processEffect(e, i, t, a) {
    const s = e.getFilterGraph(i);
    return {
      processedFilterNodes: s.nodes.map(i => this.processNode(i, e.name, t, a)),
      newVideoLabel: s.outputs.video ? `${e.name}_video_out` : t,
      newAudioLabel: s.outputs.audio ? `${e.name}_audio_out` : a,
    };
  }
  addInputs(e, i) {
    (i.video && e.push(`-i "${i.video}"`),
      i.audio && i.audio !== i.video && e.push(`-i "${i.audio}"`),
      i.additionalAudios &&
        i.additionalAudios.forEach(i => {
          e.push(`-i "${i}"`);
        }),
      i.additionalVideos &&
        i.additionalVideos.forEach(i => {
          e.push(`-i "${i}"`);
        }));
  }
  addFilterComplex(e, i) {
    const t = i.nodes.map(e => this.buildNodeFilter(e)).join(';');
    e.push(`-filter_complex "${t}"`);
  }
  addOutputMappings(e, i) {
    (e.push(`-map "[${i.outputs.video}]"`),
      i.outputs.audio && e.push(`-map "[${i.outputs.audio}]"`));
  }
  addCodecSettings(e, i) {
    e.push(`-c:v libx264 -c:a aac "${i}"`);
  }
  checkPipelineEmpty(e) {
    0 === this.effects.length && e.push(ERROR_NO_EFFECTS);
  }
  validateEffects(e, i, t) {
    for (const a of this.effects) {
      const s = a.validate(e);
      (!s.valid && s.errors && i.push(...s.errors),
        s.warnings && t.push(...s.warnings));
    }
  }
  validateRequirements(e, i) {
    const t = this.effects.map(e => e.getRequirements()),
      a = t.some(e => e.requiresVideo),
      s = t.some(e => e.requiresAudio);
    (a && !e.inputs.video && i.push(ERROR_NO_VIDEO_INPUT),
      s && !e.inputs.audio && i.push(ERROR_NO_AUDIO_INPUT));
  }
  checkValidationIfConfigured(e, i, t) {
    if (this.config.validateBeforeExecution) {
      const a = this.validatePipeline(e);
      if (!a.valid)
        return {
          success: !1,
          errors: a.errors,
          warnings: a.warnings,
          executionTime: Date.now() - i,
          effectResults: t,
        };
    }
    return null;
  }
  async analyzeMedia(e) {
    const i = await this.mediaAnalyzer.probeMedia(e);
    return {
      videoStream: i.streams.find(e => 'video' === e.codec_type),
      videoMetadata: await this.mediaAnalyzer.getVideoMetadata(e),
      audioStream: i.streams.find(e => 'audio' === e.codec_type),
    };
  }
  async ensureTempDirectory(e) {
    return (
      e ||
      (await this.fileManager.createTempDirectory(
        process.env.TEMP_DIR || './temp',
        `effects_${(0, uuid_1.v4)()}`
      ))
    );
  }
  buildInputs(e, i, t) {
    return {
      video: e,
      audio: i.inputAudioPath || (t ? e : void 0),
      additionalVideos: i.additionalVideoPaths,
      additionalAudios: i.additionalAudioPaths,
    };
  }
  buildMetadata(e, i, t) {
    return {
      video: e,
      audio: i,
      duration: t.duration,
      width: t.width,
      height: t.height,
      fps: t.fps,
    };
  }
  processNode(e, i, t, a) {
    return {
      ...e,
      id: `${i}_${e.id}`,
      inputs: e.inputs?.map(e =>
        '[video_in]' === e ? t : '[audio_in]' === e ? a : e
      ),
      outputs: e.outputs?.map(e =>
        '[video_out]' === e
          ? `${i}_video_out`
          : '[audio_out]' === e
            ? `${i}_audio_out`
            : e
      ),
    };
  }
  buildNodeFilter(e) {
    let i = '';
    (e.inputs &&
      (i += e.inputs.map(e => (e.startsWith('[') ? e : `[${e}]`)).join('')),
      (i += e.filter));
    const t = Object.entries(e.params)
      .map(([e, i]) => `${e}=${i}`)
      .join(':');
    return (
      t && (i += `=${t}`),
      e.outputs &&
        (i += e.outputs.map(e => (e.startsWith('[') ? e : `[${e}]`)).join('')),
      i
    );
  }
  assembleCommandParts(e, i, t, a) {
    (this.addInputs(e, i),
      this.addFilterComplex(e, t),
      this.addOutputMappings(e, t),
      this.addCodecSettings(e, a));
  }
}
exports.EffectPipeline = EffectPipeline;

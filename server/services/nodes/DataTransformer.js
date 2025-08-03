'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.DataTransformer = void 0));
const DataTypes_1 = require('../../shared/types/DataTypes'),
  logger_1 = require('../../utils/logger');
class DataTransformer {
  transformationRules;
  constructor() {
    ((this.transformationRules = new Map()),
      this.registerDefaultTransformations());
  }
  registerDefaultTransformations() {
    (this.registerTransformation({
      from: DataTypes_1.DataType.ANY,
      to: DataTypes_1.DataType.TEXT,
      transform: async t => String(t),
    }),
      this.registerTransformation({
        from: DataTypes_1.DataType.TEXT,
        to: DataTypes_1.DataType.NUMBER,
        transform: async t => {
          const r = Number(t);
          if (isNaN(r)) throw new Error(`Cannot convert "${t}" to number`);
          return r;
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.TEXT,
        to: DataTypes_1.DataType.BOOLEAN,
        transform: async t => {
          const r = String(t).toLowerCase();
          return (
            'true' === r ||
            '1' === r ||
            'yes' === r ||
            ('false' !== r && '0' !== r && 'no' !== r && Boolean(t))
          );
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.TEXT,
        to: DataTypes_1.DataType.PROMPT,
        transform: async t => ({
          text: String(t),
          type: 'text',
          parameters: {},
        }),
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.SCRIPT,
        to: DataTypes_1.DataType.TEXT,
        transform: async t => {
          try {
            return t.content;
          } catch (r) {
            throw (
              logger_1.logger.error('Failed to transform script to text', {
                error: r instanceof Error ? r.message : 'Unknown error',
                valueType: typeof t,
              }),
              new Error(
                `Failed to transform script to text: ${r instanceof Error ? r.message : 'Unknown error'}`
              )
            );
          }
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.TEXT,
        to: DataTypes_1.DataType.SCRIPT,
        transform: async t => ({
          content: String(t),
          scenes: [],
          duration: 0,
          format: 'plain',
        }),
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.ARRAY,
        to: DataTypes_1.DataType.TEXT,
        transform: async t => {
          try {
            return JSON.stringify(t, null, 2);
          } catch (r) {
            throw (
              logger_1.logger.error('Failed to transform array to JSON', {
                error: r instanceof Error ? r.message : 'Unknown error',
                valueType: typeof t,
              }),
              new Error(
                `Failed to transform array to JSON: ${r instanceof Error ? r.message : 'Unknown error'}`
              )
            );
          }
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.OBJECT,
        to: DataTypes_1.DataType.TEXT,
        transform: async t => {
          try {
            return JSON.stringify(t, null, 2);
          } catch (r) {
            throw (
              logger_1.logger.error('Failed to transform object to JSON', {
                error: r instanceof Error ? r.message : 'Unknown error',
                valueType: typeof t,
              }),
              new Error(
                `Failed to transform object to JSON: ${r instanceof Error ? r.message : 'Unknown error'}`
              )
            );
          }
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.IMAGE,
        to: DataTypes_1.DataType.TEXT,
        transform: async t => {
          try {
            return t.path;
          } catch (r) {
            throw (
              logger_1.logger.error('Failed to extract image path', {
                error: r instanceof Error ? r.message : 'Unknown error',
                valueType: typeof t,
              }),
              new Error(
                `Failed to extract image path: ${r instanceof Error ? r.message : 'Unknown error'}`
              )
            );
          }
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.VIDEO,
        to: DataTypes_1.DataType.TEXT,
        transform: async t => {
          try {
            return t.path;
          } catch (r) {
            throw (
              logger_1.logger.error('Failed to extract video path', {
                error: r instanceof Error ? r.message : 'Unknown error',
                valueType: typeof t,
              }),
              new Error(
                `Failed to extract video path: ${r instanceof Error ? r.message : 'Unknown error'}`
              )
            );
          }
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.AUDIO,
        to: DataTypes_1.DataType.TEXT,
        transform: async t => {
          try {
            return t.path;
          } catch (r) {
            throw (
              logger_1.logger.error('Failed to extract audio path', {
                error: r instanceof Error ? r.message : 'Unknown error',
                valueType: typeof t,
              }),
              new Error(
                `Failed to extract audio path: ${r instanceof Error ? r.message : 'Unknown error'}`
              )
            );
          }
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.ARRAY,
        to: DataTypes_1.DataType.AUDIO,
        transform: async t => {
          try {
            const r = t;
            if (!Array.isArray(r) || 0 === r.length)
              throw new Error('Expected non-empty array');
            logger_1.logger.debug(
              'Array to audio transformation - examining array items:',
              {
                arrayLength: r.length,
                firstItem: r[0],
                itemTypes: r.map(t => typeof t),
              }
            );
            const a = r.find(t => this.isAudioData(t));
            if (!a) {
              const t = r.find(
                t =>
                  t && 'object' == typeof t && t.path && void 0 !== t.duration
              );
              if (t) {
                logger_1.logger.debug(
                  'Found audio-like object, converting to proper AudioData:',
                  t
                );
                const r = t;
                return {
                  path: r.path,
                  mimeType: r.mimeType || 'audio/wav',
                  size: r.size || 0,
                  duration: r.duration,
                  sampleRate: r.sampleRate || 44100,
                  channels: r.channels || 1,
                  format: r.format || 'wav',
                  ...(r.metadata && { metadata: r.metadata }),
                };
              }
              throw (
                logger_1.logger.error('No audio data found in array', {
                  arrayItems: r.map((t, r) => ({
                    index: r,
                    type: typeof t,
                    isObject: 'object' == typeof t,
                    hasPath: t && 'object' == typeof t && t.path,
                    hasDuration: t && 'object' == typeof t && t.duration,
                    isAudioData: this.isAudioData(t),
                    item: t,
                  })),
                }),
                new Error('No audio data found in array')
              );
            }
            const e = a;
            return {
              path: e.path,
              mimeType: e.mimeType || 'audio/wav',
              size: e.size || 0,
              duration: e.duration,
              sampleRate: e.sampleRate || 44100,
              channels: e.channels || 1,
              format: e.format || 'wav',
              ...(e.metadata && { metadata: e.metadata }),
            };
          } catch (r) {
            throw (
              logger_1.logger.error('Failed to transform array to audio', {
                error: r instanceof Error ? r.message : 'Unknown error',
                valueType: typeof t,
                arrayLength: Array.isArray(t) ? t.length : 'not array',
              }),
              new Error(
                `Failed to transform array to audio: ${r instanceof Error ? r.message : 'Unknown error'}`
              )
            );
          }
        },
      }),
      this.registerTransformation({
        from: DataTypes_1.DataType.OBJECT,
        to: DataTypes_1.DataType.VIDEO,
        transform: async t => {
          try {
            const r = t;
            if (r && 'object' == typeof r && r.path) return r;
            if (r && r.videoWithCaptions) return r.videoWithCaptions;
            if (r && r.video) return r.video;
            if (r && r.editedVideo) return r.editedVideo;
            throw (
              logger_1.logger.warn(
                '[DataTransformer] Object to video transformation: no video data found in object',
                r
              ),
              new Error('No video data found in object')
            );
          } catch (t) {
            throw (
              logger_1.logger.error(
                '[DataTransformer] Failed to transform object to video:',
                t
              ),
              t
            );
          }
        },
      }));
  }
  registerTransformation(t) {
    const r = `${t.from}->${t.to}`;
    this.transformationRules.set(r, t);
  }
  async transform(t, r, a) {
    if (
      ('development' === process.env.NODE_ENV &&
        logger_1.logger.debug(`DataTransformer: Attempting ${r} → ${a}`),
      r === a)
    )
      return t;
    if (a === DataTypes_1.DataType.ANY) return t;
    if ((0, DataTypes_1.isValidDataType)(t, a)) return t;
    const e = `${r}->${a}`,
      o = this.transformationRules.get(e);
    if (o) return await o.transform(t);
    const s = `${DataTypes_1.DataType.ANY}->${a}`,
      n = this.transformationRules.get(s);
    if (n) return await n.transform(t);
    if (r !== DataTypes_1.DataType.TEXT && a !== DataTypes_1.DataType.TEXT) {
      const e = `${r}->${DataTypes_1.DataType.TEXT}`,
        o = `${DataTypes_1.DataType.TEXT}->${a}`;
      if (this.transformationRules.has(e) && this.transformationRules.has(o)) {
        const e = await this.transform(t, r, DataTypes_1.DataType.TEXT);
        return await this.transform(e, DataTypes_1.DataType.TEXT, a);
      }
    }
    throw (
      console.error(
        `🔧 DATATRANSFORMER: FAILED - No transformation from ${r} to ${a}`
      ),
      new Error(`No transformation available from ${r} to ${a}`)
    );
  }
  async transformWithMapping(t, r) {
    const a = {};
    for (const e of r) {
      const r = this.getNestedValue(t, e.sourceField);
      if (void 0 !== r) {
        let t = r;
        (e.transform && (t = e.transform(r)),
          void 0 !== t && this.setNestedValue(a, e.targetField, t));
      }
    }
    return a;
  }
  validateDataType(t, r) {
    return (0, DataTypes_1.isValidDataType)(t, r);
  }
  detectDataType(t) {
    return null == t
      ? DataTypes_1.DataType.ANY
      : this.isImageData(t)
        ? DataTypes_1.DataType.IMAGE
        : this.isVideoData(t)
          ? DataTypes_1.DataType.VIDEO
          : this.isAudioData(t)
            ? DataTypes_1.DataType.AUDIO
            : this.isScriptData(t)
              ? DataTypes_1.DataType.SCRIPT
              : this.isPromptData(t)
                ? DataTypes_1.DataType.PROMPT
                : this.isCaptionData(t)
                  ? DataTypes_1.DataType.CAPTION
                  : this.isFileData(t)
                    ? DataTypes_1.DataType.FILE
                    : Array.isArray(t)
                      ? DataTypes_1.DataType.ARRAY
                      : 'object' == typeof t
                        ? DataTypes_1.DataType.OBJECT
                        : 'string' == typeof t
                          ? DataTypes_1.DataType.TEXT
                          : 'number' == typeof t
                            ? DataTypes_1.DataType.NUMBER
                            : 'boolean' == typeof t
                              ? DataTypes_1.DataType.BOOLEAN
                              : DataTypes_1.DataType.ANY;
  }
  getNestedValue(t, r) {
    return r.split('.').reduce((t, r) => {
      if (t && 'object' == typeof t && r in t) return t[r];
    }, t);
  }
  setNestedValue(t, r, a) {
    const e = r.split('.'),
      o = e.pop(),
      s = e.reduce((t, r) => {
        if (t && 'object' == typeof t) {
          const a = t;
          return (r in a || (a[r] = {}), a[r]);
        }
        return t;
      }, t);
    o && s && 'object' == typeof s && (s[o] = a);
  }
  isFileData(t) {
    return !(
      !t ||
      'object' != typeof t ||
      'string' != typeof t.path ||
      'string' != typeof t.mimeType ||
      'number' != typeof t.size
    );
  }
  isImageData(t) {
    return (
      this.isFileData(t) &&
      'number' == typeof t.width &&
      'number' == typeof t.height &&
      'string' == typeof t.format
    );
  }
  isVideoData(t) {
    return (
      this.isFileData(t) &&
      'number' == typeof t.width &&
      'number' == typeof t.height &&
      'number' == typeof t.duration &&
      'number' == typeof t.fps
    );
  }
  isAudioData(t) {
    return (
      this.isFileData(t) &&
      'number' == typeof t.duration &&
      'number' == typeof t.sampleRate &&
      'number' == typeof t.channels
    );
  }
  isScriptData(t) {
    return !(
      !t ||
      'object' != typeof t ||
      ('string' != typeof t.content && 'string' != typeof t.title) ||
      !Array.isArray(t.scenes)
    );
  }
  isPromptData(t) {
    return !(
      !t ||
      'object' != typeof t ||
      'string' != typeof t.text ||
      !['text', 'image', 'video', 'audio'].includes(t.type)
    );
  }
  isCaptionData(t) {
    return !(
      !t ||
      'object' != typeof t ||
      'string' != typeof t.text ||
      'number' != typeof t.startTime ||
      'number' != typeof t.endTime
    );
  }
  async transformArray(t, r, a) {
    return Promise.all(t.map(t => this.transform(t, r, a)));
  }
  mergeOutputs(t) {
    return 0 === t.length
      ? {}
      : 1 === t.length
        ? t[0]
        : t.every(t => 'object' == typeof t && !Array.isArray(t))
          ? Object.assign({}, ...t)
          : t.every(t => Array.isArray(t))
            ? [].concat(...t)
            : t;
  }
  extractArrayElements(t, r) {
    return r ? r.map(r => t[r]).filter(t => void 0 !== t) : t;
  }
  splitArray(t, r) {
    const a = [];
    for (let e = 0; e < t.length; e += r) a.push(t.slice(e, e + r));
    return a;
  }
}
exports.DataTransformer = DataTransformer;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.BaseEffect = void 0));
const logger_1 = require('../../utils/logger');
class BaseEffect {
  onProgressCallback;
  getRequirements() {
    return {
      requiresVideo: !0,
      requiresAudio: !1,
      modifiesVideo: !0,
      modifiesAudio: !1,
      supportsMultipleInputs: !1,
    };
  }
  validate(e) {
    const r = [],
      t = [],
      a = this.getRequirements();
    (a.requiresVideo &&
      !e.inputs.video &&
      r.push(`${this.name} requires video input`),
      a.requiresAudio &&
        !e.inputs.audio &&
        r.push(`${this.name} requires audio input`),
      a.requiresVideo &&
        e.metadata.video &&
        ((e.metadata.width <= 0 || e.metadata.height <= 0) &&
          r.push(
            `Invalid video dimensions: ${e.metadata.width}x${e.metadata.height}`
          ),
        e.metadata.fps <= 0 &&
          r.push(`Invalid frame rate: ${e.metadata.fps}`)));
    const s = this.validateSpecific(e);
    return (
      s.errors && r.push(...s.errors),
      s.warnings && t.push(...s.warnings),
      {
        valid: 0 === r.length,
        errors: r.length > 0 ? r : void 0,
        warnings: t.length > 0 ? t : void 0,
      }
    );
  }
  validateSpecific(e) {
    return { valid: !0 };
  }
  getPriority() {
    return 50;
  }
  estimateProcessingTime(e) {
    const r = e.metadata.duration || 0;
    return Math.ceil(0.1 * r);
  }
  set onProgress(e) {
    this.onProgressCallback = e;
  }
  get onProgress() {
    return this.onProgressCallback;
  }
  reportProgress(e, r) {
    (this.onProgressCallback &&
      this.onProgressCallback({ effect: this.name, progress: e, operation: r }),
      logger_1.logger.debug(
        `[${this.name}] Progress: ${e}% - ${r || 'Processing'}`
      ));
  }
  formatFilterParams(e) {
    return Object.entries(e)
      .filter(([e, r]) => null != r)
      .map(([e, r]) => ('boolean' == typeof r ? (r ? e : '') : `${e}=${r}`))
      .filter(e => e.length > 0)
      .join(':');
  }
  escapeFilterValue(e) {
    return e
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/:/g, '\\:')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }
  calculateFrames(e, r) {
    return Math.round(e * r);
  }
  formatTime(e) {
    const r = Math.floor(e / 3600),
      t = Math.floor((e % 3600) / 60),
      a = (e % 60).toFixed(3);
    return `${r.toString().padStart(2, '0')}:${t.toString().padStart(2, '0')}:${a.padStart(6, '0')}`;
  }
}
exports.BaseEffect = BaseEffect;

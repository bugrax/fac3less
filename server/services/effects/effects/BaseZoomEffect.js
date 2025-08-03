'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.BaseZoomEffect = void 0));
const BaseEffect_1 = require('../BaseEffect');
class BaseZoomEffect extends BaseEffect_1.BaseEffect {
  options;
  constructor(t) {
    (super(), (this.options = t));
  }
  validateSpecific(t) {
    const e = [],
      o = [],
      s = this.options.duration || 0.3,
      i = this.options.scale || 3,
      n = this.options.videoIndex || 0;
    ((s <= 0 || s > 5) &&
      e.push('Zoom duration must be between 0 and 5 seconds'),
      (i < 1 || i > 10) && e.push('Zoom scale must be between 1 and 10'),
      0 !== n && o.push('Zoom effect currently only supports first video'));
    return (
      this.options.type &&
        !['in', 'out'].includes(this.options.type) &&
        e.push(
          `Invalid zoom type: ${this.options.type}. Must be "in" or "out"`
        ),
      t.metadata.duration < s &&
        e.push(
          `Video duration (${t.metadata.duration}s) is shorter than zoom duration (${s}s)`
        ),
      {
        valid: 0 === e.length,
        errors: e.length > 0 ? e : void 0,
        warnings: o.length > 0 ? o : void 0,
      }
    );
  }
}
exports.BaseZoomEffect = BaseZoomEffect;

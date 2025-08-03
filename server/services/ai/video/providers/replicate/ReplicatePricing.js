'use strict';
function calculateVideoCost(e, o, t) {
  const r = exports.VIDEO_MODEL_PRICING[o];
  return r
    ? 'kwaivgi/kling-v2.1' === o && 'pro' === t && r.pro
      ? e * r.pro
      : e * r.perSecond
    : 0.1 * e;
}
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.VIDEO_MODEL_PRICING = void 0),
(exports.calculateVideoCost = calculateVideoCost),
(exports.VIDEO_MODEL_PRICING = {
  'kwaivgi/kling-v2.1': { standard: 0.05, pro: 0.09, perSecond: 0.05 },
  'bytedance/seedance-1-pro': { perSecond: 0.15 },
  'bytedance/seedance-1-lite': { perSecond: 0.08 }
}));

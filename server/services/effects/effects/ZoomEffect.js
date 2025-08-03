'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.ZoomEffect = void 0));
const BaseZoomEffect_1 = require('./BaseZoomEffect'),
  FilterGraphBuilder_1 = require('../FilterGraphBuilder');
class ZoomEffect extends BaseZoomEffect_1.BaseZoomEffect {
  name = 'zoom';
  description = 'Applies a zoom in/out effect to the video';
  constructor(e = {}) {
    super(e);
  }
  getFilterGraph(e) {
    const o = new FilterGraphBuilder_1.FilterGraphBuilder();
    return (
      o.video('null', {}, { inputs: ['[video_in]'], outputs: ['[video_out]'] }),
      o.audio(
        'anull',
        {},
        { inputs: ['[audio_in]'], outputs: ['[audio_out]'] }
      ),
      {
        nodes: o.getNodes(),
        outputs: { video: '[video_out]', audio: '[audio_out]' },
      }
    );
  }
  getDuration() {
    return 0;
  }
  affectsVideo() {
    return !0;
  }
  affectsAudio() {
    return !1;
  }
  getRequirements() {
    return {
      requiresVideo: !0,
      requiresAudio: !1,
      modifiesVideo: !0,
      modifiesAudio: !1,
      supportsMultipleInputs: !1,
    };
  }
  getPriority() {
    return 1;
  }
}
exports.ZoomEffect = ZoomEffect;

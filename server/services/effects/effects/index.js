'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.getAlternatingTransition =
    exports.TransitionEffect =
    exports.TransitionSoundEffect =
    exports.IntroSoundEffect =
    exports.ZoomEffect =
      void 0));
const ZoomEffect_1 = require('./ZoomEffect');
Object.defineProperty(exports, 'ZoomEffect', {
  enumerable: !0,
  get() {
    return ZoomEffect_1.ZoomEffect;
  }
});
const IntroSoundEffect_1 = require('./IntroSoundEffect');
Object.defineProperty(exports, 'IntroSoundEffect', {
  enumerable: !0,
  get() {
    return IntroSoundEffect_1.IntroSoundEffect;
  }
});
const TransitionSoundEffect_1 = require('./TransitionSoundEffect');
Object.defineProperty(exports, 'TransitionSoundEffect', {
  enumerable: !0,
  get() {
    return TransitionSoundEffect_1.TransitionSoundEffect;
  }
});
const TransitionEffect_1 = require('./TransitionEffect');
(Object.defineProperty(exports, 'TransitionEffect', {
  enumerable: !0,
  get() {
    return TransitionEffect_1.TransitionEffect;
  }
}),
Object.defineProperty(exports, 'getAlternatingTransition', {
  enumerable: !0,
  get() {
    return TransitionEffect_1.getAlternatingTransition;
  }
}));

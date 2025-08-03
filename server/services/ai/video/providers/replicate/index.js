'use strict';
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, r, i) {
        void 0 === i && (i = r);
        let o = Object.getOwnPropertyDescriptor(t, r);
        ((o &&
            !('get' in o ? !t.__esModule : o.writable || o.configurable)) ||
            (o = {
              enumerable: !0,
              get() {
                return t[r];
              }
            }),
        Object.defineProperty(e, i, o));
      }
      : function (e, t, r, i) {
        (void 0 === i && (i = r), (e[i] = t[r]));
      }),
  __exportStar =
    (this && this.__exportStar) ||
    function (e, exports) {
      for (const t in e) {
        'default' === t ||
          Object.prototype.hasOwnProperty.call(exports, t) ||
          __createBinding(exports, e, t);
      }
    };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.calculateVideoCost =
    exports.VIDEO_MODEL_PRICING =
    exports.getAllModels =
    exports.getModelById =
    exports.REPLICATE_VIDEO_MODELS =
    exports.ReplicateClient =
      void 0));
const ReplicateClient_1 = require('./ReplicateClient');
Object.defineProperty(exports, 'ReplicateClient', {
  enumerable: !0,
  get() {
    return ReplicateClient_1.ReplicateClient;
  }
});
const ReplicateModels_1 = require('./ReplicateModels');
(Object.defineProperty(exports, 'REPLICATE_VIDEO_MODELS', {
  enumerable: !0,
  get() {
    return ReplicateModels_1.REPLICATE_VIDEO_MODELS;
  }
}),
Object.defineProperty(exports, 'getModelById', {
  enumerable: !0,
  get() {
    return ReplicateModels_1.getModelById;
  }
}),
Object.defineProperty(exports, 'getAllModels', {
  enumerable: !0,
  get() {
    return ReplicateModels_1.getAllModels;
  }
}));
const ReplicatePricing_1 = require('./ReplicatePricing');
(Object.defineProperty(exports, 'VIDEO_MODEL_PRICING', {
  enumerable: !0,
  get() {
    return ReplicatePricing_1.VIDEO_MODEL_PRICING;
  }
}),
Object.defineProperty(exports, 'calculateVideoCost', {
  enumerable: !0,
  get() {
    return ReplicatePricing_1.calculateVideoCost;
  }
}),
__exportStar(require('./models/index'), exports));

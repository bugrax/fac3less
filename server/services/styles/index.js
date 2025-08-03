'use strict';
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, r, i) {
        void 0 === i && (i = r);
        let n = Object.getOwnPropertyDescriptor(t, r);
        ((n &&
            !('get' in n ? !t.__esModule : n.writable || n.configurable)) ||
            (n = {
              enumerable: !0,
              get() {
                return t[r];
              }
            }),
        Object.defineProperty(e, i, n));
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
(exports.VisualStyleService = void 0),
__exportStar(require('./types'), exports));
const VisualStyleService_1 = require('./VisualStyleService');
Object.defineProperty(exports, 'VisualStyleService', {
  enumerable: !0,
  get() {
    return VisualStyleService_1.VisualStyleService;
  }
});

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.ModelService = exports.modelService = void 0));
const ModelService_1 = require('../server/services/ai/llm/services/ModelService');
(Object.defineProperty(exports, 'modelService', {
  enumerable: !0,
  get() {
    return ModelService_1.modelService;
  }
}),
Object.defineProperty(exports, 'ModelService', {
  enumerable: !0,
  get() {
    return ModelService_1.ModelService;
  }
}));

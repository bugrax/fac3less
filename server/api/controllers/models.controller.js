'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.getModelById = exports.getModels = void 0));
const model_service_1 = require('../../../services/model.service'),
  controllerUtils_1 = require('../utils/controllerUtils'),
  logger_1 = require('../../utils/logger'),
  getModels = async (e, r, o) => {
    try {
      const e = await model_service_1.modelService.getAvailableModels();
      r.json({ success: !0, data: e, count: e.length });
    } catch (e) {
      (logger_1.logger.error('Error fetching models', {
        error: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : void 0
      }),
      o(e));
    }
  };
((exports.getModels = getModels),
(exports.getModelById = (0, controllerUtils_1.createGetByIdHandler)({
  entityName: 'Model',
  service: {
    getById: model_service_1.modelService.getModelById.bind(
      model_service_1.modelService
    )
  }
})));

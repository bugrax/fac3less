'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.getGenerationStatus = void 0));
const generation_service_1 = require('../../../services/generation.service'),
  controllerUtils_1 = require('../utils/controllerUtils');
exports.getGenerationStatus = (0, controllerUtils_1.createGetByIdHandler)({
  entityName: 'Generation',
  service: {
    getById: generation_service_1.generationService.getGenerationStatus.bind(
      generation_service_1.generationService
    )
  }
});

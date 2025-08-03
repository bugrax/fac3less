'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.validateGenerationProgress =
    exports.validateSSEProgress =
    exports.handleValidationErrors =
      void 0));
const express_validator_1 = require('express-validator'),
  handleValidationErrors = (e, r, a) => {
    const t = (0, express_validator_1.validationResult)(e);
    t.isEmpty()
      ? a()
      : r.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: t.array(),
        timestamp: new Date().toISOString()
      });
  };
((exports.handleValidationErrors = handleValidationErrors),
(exports.validateSSEProgress = [
  (0, express_validator_1.param)('executionId')
    .notEmpty()
    .withMessage('Execution ID is required')
    .isString()
    .withMessage('Execution ID must be a string')
    .matches(/^exec_\d+_[a-z0-9]+$/)
    .withMessage('Invalid execution ID format'),
  exports.handleValidationErrors
]),
(exports.validateGenerationProgress = [
  (0, express_validator_1.param)('id')
    .notEmpty()
    .withMessage('Generation ID is required')
    .isString()
    .withMessage('Generation ID must be a string')
    .isUUID()
    .withMessage('Generation ID must be a valid UUID'),
  exports.handleValidationErrors
]));

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.validateGetGenerationStatus = exports.handleValidationErrors =
    void 0));
const express_validator_1 = require('express-validator'),
  handleValidationErrors = (e, a, t) => {
    const r = (0, express_validator_1.validationResult)(e);
    r.isEmpty()
      ? t()
      : a.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: r.array(),
        timestamp: new Date().toISOString()
      });
  };
((exports.handleValidationErrors = handleValidationErrors),
(exports.validateGetGenerationStatus = [
  (0, express_validator_1.param)('id')
    .notEmpty()
    .withMessage('Generation ID is required')
    .isString()
    .withMessage('Generation ID must be a string')
    .isUUID()
    .withMessage('Generation ID must be a valid UUID'),
  exports.handleValidationErrors
]));

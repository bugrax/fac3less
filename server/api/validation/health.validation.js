'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.validateHealthCheck = exports.handleValidationErrors = void 0));
const express_validator_1 = require('express-validator'),
  handleValidationErrors = (a, e, r) => {
    const t = (0, express_validator_1.validationResult)(a);
    t.isEmpty()
      ? r()
      : e.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: t.array(),
        timestamp: new Date().toISOString()
      });
  };
((exports.handleValidationErrors = handleValidationErrors),
(exports.validateHealthCheck = [exports.handleValidationErrors]));

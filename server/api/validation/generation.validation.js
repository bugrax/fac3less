'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.validateEstimateGeneration =
    exports.validateGenerateVideo =
    exports.handleValidationErrors =
      void 0));
const express_validator_1 = require('express-validator'),
  handleValidationErrors = (e, t, a) => {
    const i = (0, express_validator_1.validationResult)(e);
    i.isEmpty()
      ? a()
      : t.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: i.array(),
        timestamp: new Date().toISOString()
      });
  };
((exports.handleValidationErrors = handleValidationErrors),
(exports.validateGenerateVideo = [
  (0, express_validator_1.body)('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required')
    .isString()
    .withMessage('Topic must be a string')
    .isLength({ min: 3, max: 500 })
    .withMessage('Topic must be between 3 and 500 characters'),
  (0, express_validator_1.body)('duration')
    .optional()
    .isInt({ min: 10, max: 600 })
    .withMessage('Duration must be between 10 and 600 seconds'),
  (0, express_validator_1.body)('style')
    .optional()
    .isString()
    .withMessage('Style must be a string')
    .isIn([
      'educational',
      'documentary',
      'news',
      'entertainment',
      'motivational'
    ])
    .withMessage(
      'Invalid style. Must be one of: educational, documentary, news, entertainment, motivational'
    ),
  (0, express_validator_1.body)('voiceType')
    .optional()
    .isString()
    .withMessage('Voice type must be a string')
    .isIn(['male', 'female', 'neutral'])
    .withMessage('Invalid voice type'),
  (0, express_validator_1.body)('backgroundAudio')
    .optional()
    .isBoolean()
    .withMessage('Background audio must be a boolean'),
  (0, express_validator_1.body)('llmModel')
    .optional()
    .isString()
    .withMessage('LLM model must be a string')
    .matches(/^[a-zA-Z0-9\-/]+$/)
    .withMessage('Invalid LLM model format'),
  exports.handleValidationErrors
]),
(exports.validateEstimateGeneration = [
  (0, express_validator_1.body)('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required')
    .isString()
    .withMessage('Topic must be a string')
    .isLength({ min: 3, max: 500 })
    .withMessage('Topic must be between 3 and 500 characters'),
  (0, express_validator_1.body)('duration')
    .optional()
    .isInt({ min: 10, max: 600 })
    .withMessage('Duration must be between 10 and 600 seconds'),
  (0, express_validator_1.body)('style')
    .optional()
    .isString()
    .withMessage('Style must be a string')
    .isIn([
      'educational',
      'documentary',
      'news',
      'entertainment',
      'motivational'
    ])
    .withMessage(
      'Invalid style. Must be one of: educational, documentary, news, entertainment, motivational'
    ),
  exports.handleValidationErrors
]));

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.validateCancelWorkflow =
    exports.validateGetExecutionStatus =
    exports.validateExecuteWorkflow =
    exports.handleValidationErrors =
      void 0));
const express_validator_1 = require('express-validator'),
  handleValidationErrors = (e, t, s) => {
    const a = (0, express_validator_1.validationResult)(e);
    a.isEmpty()
      ? s()
      : t.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: a.array(),
        timestamp: new Date().toISOString()
      });
  };
((exports.handleValidationErrors = handleValidationErrors),
(exports.validateExecuteWorkflow = [
  (0, express_validator_1.body)('workflow')
    .notEmpty()
    .withMessage('Workflow definition is required')
    .isObject()
    .withMessage('Workflow must be an object'),
  (0, express_validator_1.body)('workflow.id')
    .notEmpty()
    .withMessage('Workflow ID is required')
    .isString()
    .withMessage('Workflow ID must be a string'),
  (0, express_validator_1.body)('workflow.nodes')
    .isArray({ min: 1 })
    .withMessage('Workflow must have at least one node'),
  (0, express_validator_1.body)('workflow.nodes.*.id')
    .notEmpty()
    .withMessage('Node ID is required')
    .isString()
    .withMessage('Node ID must be a string'),
  (0, express_validator_1.body)('workflow.nodes.*.type')
    .notEmpty()
    .withMessage('Node type is required')
    .isString()
    .withMessage('Node type must be a string'),
  (0, express_validator_1.body)('workflow.edges')
    .optional()
    .isArray()
    .withMessage('Edges must be an array'),
  (0, express_validator_1.body)('initialInput')
    .notEmpty()
    .withMessage('Initial input is required')
    .isObject()
    .withMessage('Initial input must be an object'),
  exports.handleValidationErrors
]),
(exports.validateGetExecutionStatus = [
  (0, express_validator_1.param)('executionId')
    .notEmpty()
    .withMessage('Execution ID is required')
    .isString()
    .withMessage('Execution ID must be a string')
    .matches(/^exec_\d+_[a-z0-9]+$/)
    .withMessage('Invalid execution ID format'),
  exports.handleValidationErrors
]),
(exports.validateCancelWorkflow = [
  (0, express_validator_1.param)('executionId')
    .notEmpty()
    .withMessage('Execution ID is required')
    .isString()
    .withMessage('Execution ID must be a string')
    .matches(/^exec_\d+_[a-z0-9]+$/)
    .withMessage('Invalid execution ID format'),
  exports.handleValidationErrors
]));

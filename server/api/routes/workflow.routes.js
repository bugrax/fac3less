'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
const express_1 = require('express'),
  workflow_controller_1 = require('../controllers/workflow.controller'),
  workflow_validation_1 = require('../validation/workflow.validation'),
  router = (0, express_1.Router)(),
  controller = new workflow_controller_1.WorkflowController();
(router.post(
  '/execute',
  ...workflow_validation_1.validateExecuteWorkflow,
  controller.executeWorkflow.bind(controller)
),
router.get(
  '/execution/:executionId',
  ...workflow_validation_1.validateGetExecutionStatus,
  controller.getExecutionStatus.bind(controller)
),
router.post(
  '/execution/:executionId/cancel',
  ...workflow_validation_1.validateCancelWorkflow,
  controller.cancelWorkflow.bind(controller)
),
router.get('/models/llm', controller.listLLMModels.bind(controller)),
router.get('/models/video', controller.listVideoModels.bind(controller)),
router.get('/models/image', controller.listImageModels.bind(controller)),
(exports.default = router));

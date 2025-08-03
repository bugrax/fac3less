'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.generationRoutes = void 0));
const express_1 = require('express'),
  generation_controller_1 = require('../controllers/generation.controller'),
  generation_validation_1 = require('../validation/generation.validation'),
  router = (0, express_1.Router)();
((exports.generationRoutes = router),
router.post(
  '/',
  ...generation_validation_1.validateGenerateVideo,
  generation_controller_1.generateVideo
),
router.post(
  '/estimate',
  ...generation_validation_1.validateEstimateGeneration,
  generation_controller_1.estimateGeneration
));

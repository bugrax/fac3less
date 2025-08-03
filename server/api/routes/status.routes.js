'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.statusRoutes = void 0));
const express_1 = require('express'),
  status_controller_1 = require('../controllers/status.controller'),
  status_validation_1 = require('../validation/status.validation'),
  router = (0, express_1.Router)();
((exports.statusRoutes = router),
router.get(
  '/:id',
  ...status_validation_1.validateGetGenerationStatus,
  status_controller_1.getGenerationStatus
));

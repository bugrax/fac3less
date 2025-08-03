'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
const express_1 = require('express'),
  express_validator_1 = require('express-validator'),
  TemplateService_1 = require('../../services/templates/TemplateService'),
  logger_1 = require('../../utils/logger'),
  router = (0, express_1.Router)(),
  handleValidationErrors = (e, r) => {
    const t = (0, express_validator_1.validationResult)(e);
    return !t.isEmpty() && (r.status(400).json({ errors: t.array() }), !0);
  };
(router.get('/nodes/defaults', (e, r) => {
  try {
    const e = TemplateService_1.templateService.getNodeDefaults();
    r.json(e);
  } catch (e) {
    (logger_1.logger.error('Error fetching node defaults:', e),
    r.status(500).json({ error: 'Failed to fetch node defaults' }));
  }
}),
router.get(
  '/system',
  [
    (0, express_validator_1.query)('tags').optional().isString().trim(),
    (0, express_validator_1.query)('category')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 50 }),
    (0, express_validator_1.query)('search')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 }),
    (0, express_validator_1.query)('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt(),
    (0, express_validator_1.query)('offset')
      .optional()
      .isInt({ min: 0 })
      .toInt()
  ],
  (e, r) => {
    if (!handleValidationErrors(e, r)) {
      try {
        const t = {
            tags: e.query.tags ? e.query.tags.split(',') : void 0,
            category: e.query.category,
            search: e.query.search,
            limit: e.query.limit ? parseInt(e.query.limit) : void 0,
            offset: e.query.offset ? parseInt(e.query.offset) : void 0
          },
          s = TemplateService_1.templateService.getSystemTemplates(t);
        r.json(s);
      } catch (e) {
        (logger_1.logger.error('Error fetching system templates:', e),
        r.status(500).json({ error: 'Failed to fetch system templates' }));
      }
    }
  }
),
router.get(
  '/system/:id',
  [
    (0, express_validator_1.param)('id')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 100 })
  ],
  (e, r) => {
    if (!handleValidationErrors(e, r)) {
      try {
        const t = TemplateService_1.templateService.getSystemTemplate(
          e.params.id
        );
        if (!t) {
          return void r.status(404).json({ error: 'Template not found' });
        }
        r.json(t);
      } catch (e) {
        (logger_1.logger.error('Error fetching system template:', e),
        r.status(500).json({ error: 'Failed to fetch system template' }));
      }
    }
  }
),
router.get(
  '/user',
  [
    (0, express_validator_1.query)('tags').optional().isString().trim(),
    (0, express_validator_1.query)('search')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 }),
    (0, express_validator_1.query)('isPublic')
      .optional()
      .isBoolean()
      .toBoolean(),
    (0, express_validator_1.query)('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .toInt(),
    (0, express_validator_1.query)('offset')
      .optional()
      .isInt({ min: 0 })
      .toInt()
  ],
  (e, r) => {
    if (!handleValidationErrors(e, r)) {
      try {
        const t = e.headers['x-user-id'];
        if (!t) {
          return void r
            .status(401)
            .json({ error: 'Authentication required' });
        }
        const s = {
            tags: e.query.tags ? e.query.tags.split(',') : void 0,
            search: e.query.search,
            isPublic: 'true' === e.query.isPublic,
            limit: e.query.limit ? parseInt(e.query.limit) : void 0,
            offset: e.query.offset ? parseInt(e.query.offset) : void 0
          },
          o = TemplateService_1.templateService.getUserTemplates(t, s);
        r.json(o);
      } catch (e) {
        (logger_1.logger.error('Error fetching user templates:', e),
        r.status(500).json({ error: 'Failed to fetch user templates' }));
      }
    }
  }
),
router.post(
  '/user',
  [
    (0, express_validator_1.body)('name')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 1, max: 100 }),
    (0, express_validator_1.body)('description')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 }),
    (0, express_validator_1.body)('tags').optional().isArray({ max: 10 }),
    (0, express_validator_1.body)('tags.*')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 30 }),
    (0, express_validator_1.body)('nodes').notEmpty(),
    (0, express_validator_1.body)('structure').optional().isObject(),
    (0, express_validator_1.body)('isPublic').optional().isBoolean()
  ],
  (e, r) => {
    if (e.body.name && e.body.nodes) {
      if (!handleValidationErrors(e, r)) {
        try {
          const t = e.headers['x-user-id'],
            s = e.headers['x-user-name'];
          if (!t) {
            return void r
              .status(401)
              .json({ error: 'Authentication required' });
          }
          const {
              name: o,
              description: a,
              tags: i,
              nodes: n,
              structure: l,
              isPublic: d
            } = e.body,
            u = TemplateService_1.templateService.createUserTemplate(t, {
              name: o,
              description: a || '',
              tags: i || [],
              author: t,
              authorName: s || 'Unknown User',
              isPublic: d || !1,
              nodes: n,
              structure: l
            });
          r.status(201).json(u);
        } catch (e) {
          (logger_1.logger.error('Error creating user template:', e),
          r.status(500).json({ error: 'Failed to create user template' }));
        }
      }
    } else {
      r.status(400).json({ error: 'Name and nodes are required' });
    }
  }
),
router.put(
  '/user/:id',
  [
    (0, express_validator_1.param)('id')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 100 }),
    (0, express_validator_1.body)('name')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 }),
    (0, express_validator_1.body)('description')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 }),
    (0, express_validator_1.body)('tags').optional().isArray({ max: 10 }),
    (0, express_validator_1.body)('tags.*')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 30 }),
    (0, express_validator_1.body)('nodes').optional(),
    (0, express_validator_1.body)('structure').optional().isObject(),
    (0, express_validator_1.body)('isPublic').optional().isBoolean()
  ],
  (e, r) => {
    if (!handleValidationErrors(e, r)) {
      try {
        const t = e.headers['x-user-id'];
        if (!t) {
          return void r
            .status(401)
            .json({ error: 'Authentication required' });
        }
        const s = e.params.id,
          o = e.body,
          a = TemplateService_1.templateService.updateUserTemplate(t, s, o);
        if (!a) {
          return void r
            .status(404)
            .json({ error: 'Template not found or access denied' });
        }
        r.json(a);
      } catch (e) {
        (logger_1.logger.error('Error updating user template:', e),
        r.status(500).json({ error: 'Failed to update user template' }));
      }
    }
  }
),
router.delete(
  '/user/:id',
  [
    (0, express_validator_1.param)('id')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 100 })
  ],
  (e, r) => {
    if (!handleValidationErrors(e, r)) {
      try {
        const t = e.headers['x-user-id'];
        if (!t) {
          return void r
            .status(401)
            .json({ error: 'Authentication required' });
        }
        const s = e.params.id;
        if (!TemplateService_1.templateService.deleteUserTemplate(t, s)) {
          return void r
            .status(404)
            .json({ error: 'Template not found or access denied' });
        }
        r.status(204).send();
      } catch (e) {
        (logger_1.logger.error('Error deleting user template:', e),
        r.status(500).json({ error: 'Failed to delete user template' }));
      }
    }
  }
),
router.post(
  '/fork/:id',
  [
    (0, express_validator_1.param)('id')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ max: 100 }),
    (0, express_validator_1.body)('name')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 1, max: 100 })
  ],
  (e, r) => {
    if (e.body.name) {
      if (!handleValidationErrors(e, r)) {
        try {
          const t = e.headers['x-user-id'];
          if (!t) {
            return void r
              .status(401)
              .json({ error: 'Authentication required' });
          }
          const s = e.params.id,
            { name: o } = e.body,
            a = TemplateService_1.templateService.forkTemplate(t, s, o);
          if (!a) {
            return void r
              .status(404)
              .json({ error: 'Source template not found' });
          }
          r.status(201).json(a);
        } catch (e) {
          (logger_1.logger.error('Error forking template:', e),
          r.status(500).json({ error: 'Failed to fork template' }));
        }
      }
    } else {
      r.status(400).json({ error: 'Name is required' });
    }
  }
),
router.get('/public', (e, r) => {
  try {
    const e = [];
    r.json(e);
  } catch (e) {
    (logger_1.logger.error('Error fetching public templates:', e),
    r.status(500).json({ error: 'Failed to fetch public templates' }));
  }
}),
(exports.default = router));

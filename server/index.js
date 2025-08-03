'use strict';
const __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.initializeServer = initializeServer));
const express_1 = __importDefault(require('express')),
  cors_1 = __importDefault(require('cors')),
  dotenv_1 = __importDefault(require('dotenv')),
  path_1 = __importDefault(require('path')),
  generation_routes_1 = require('./api/routes/generation.routes'),
  models_routes_1 = require('./api/routes/models.routes'),
  status_routes_1 = require('./api/routes/status.routes'),
  sse_routes_1 = require('./api/routes/sse.routes'),
  workflow_routes_1 = __importDefault(require('./api/routes/workflow.routes')),
  workflow_sse_routes_1 = __importDefault(
    require('./api/routes/workflow.sse.routes')
  ),
  templates_routes_1 = __importDefault(
    require('./api/routes/templates.routes')
  ),
  generation_service_1 = require('../services/generation.service'),
  FileCleanupService_1 = require('./services/utils/FileCleanupService'),
  health_validation_1 = require('./api/validation/health.validation'),
  logger_1 = require('./utils/logger');
(dotenv_1.default.config({ quiet: !0 }),
process.on('uncaughtException', e => {
  (logger_1.logger.error('Uncaught Exception:', e),
  logger_1.logger.error('Stack trace:', e.stack),
  'production' === process.env.NODE_ENV && process.exit(1));
}),
process.on('unhandledRejection', (e, t) => {
  const r = e instanceof Error ? e.message : String(e);
  r && r.toLowerCase().includes('workflow cancelled')
    ? logger_1.logger.info('WORKFLOW CANCELLED')
    : (logger_1.logger.error('Unhandled Rejection at:', t, 'reason:', e),
    'production' === process.env.NODE_ENV && process.exit(1));
}));
const app = (0, express_1.default)(),
  PORT = process.env.PORT || 3e3;
function initializeServer(e, t) {
  const r = e || app,
    s = {
      origin: 'production' !== process.env.NODE_ENV || process.env.FRONTEND_URL,
      credentials: !0,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID']
    };
  (r.use((0, cors_1.default)(s)),
  r.use(express_1.default.json()),
  r.use(express_1.default.urlencoded({ extended: !0 })));
  const o =
    'production' === process.env.NODE_ENV
      ? path_1.default.join(__dirname, '../../../client')
      : path_1.default.join(__dirname, '../');
  return (
    r.use(express_1.default.static(o)),
    r.use('/media', (e, t, r) => {
      (logger_1.logger.debug(`[MEDIA] Request for: ${e.path}`),
      logger_1.logger.debug(
        `[MEDIA] Full path: ${path_1.default.join(process.cwd(), 'output', e.path)}`
      ),
      r());
    }),
    r.use(
      '/assets',
      express_1.default.static(path_1.default.join(process.cwd(), 'assets'))
    ),
    r.use(
      '/media',
      express_1.default.static(path_1.default.join(process.cwd(), 'output'), {
        setHeaders: (e, t) => {
          (t.endsWith('.wav')
            ? e.setHeader('Content-Type', 'audio/wav')
            : t.endsWith('.mp3')
              ? e.setHeader('Content-Type', 'audio/mpeg')
              : t.endsWith('.mp4')
                ? e.setHeader('Content-Type', 'video/mp4')
                : t.endsWith('.webm')
                  ? e.setHeader('Content-Type', 'video/webm')
                  : t.endsWith('.png')
                    ? e.setHeader('Content-Type', 'image/png')
                    : t.endsWith('.jpg') || t.endsWith('.jpeg')
                      ? e.setHeader('Content-Type', 'image/jpeg')
                      : t.endsWith('.webp') &&
                        e.setHeader('Content-Type', 'image/webp'),
          e.setHeader('Access-Control-Allow-Origin', '*'),
          e.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS'));
        }
      })
    ),
    r.get('/health', ...health_validation_1.validateHealthCheck, (e, t) => {
      t.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'video-generation-api'
      });
    }),
    r.use('/api/generate', generation_routes_1.generationRoutes),
    r.use('/api/models', models_routes_1.modelRoutes),
    r.use('/api/status', status_routes_1.statusRoutes),
    r.use('/api/sse', sse_routes_1.sseRoutes),
    r.use('/api/workflow', workflow_routes_1.default),
    r.use('/api/workflow/sse', workflow_sse_routes_1.default),
    r.use('/api/templates', templates_routes_1.default),
    'production' !== process.env.NODE_ENV &&
      'true' === process.env.ENABLE_TEST_ROUTES &&
      console.warn(
        '[INFO] Test routes are disabled. Set ENABLE_TEST_ROUTES=true to enable them.'
      ),
    initializeServices(),
    r
  );
}
async function initializeServices() {
  try {
    const e = FileCleanupService_1.FileCleanupService.getInstance();
    (await e.initialize(),
    setInterval(() => {
      try {
        generation_service_1.generationService.cleanupOldJobs();
      } catch (e) {
        logger_1.logger.error('Error cleaning up old jobs:', e);
      }
    }, 18e5));
  } catch (e) {
    logger_1.logger.error('Error during service initialization:', e);
  }
}
module.parent ||
  (initializeServer(),
  app.use((e, t) => {
    t.status(404).json({
      error: 'Not Found',
      message: `Route ${e.method} ${e.path} not found`,
      timestamp: new Date().toISOString()
    });
  }),
  app.use((e, t, r, s) => {
    logger_1.logger.error('Error:', e);
    const o = e.status || 500,
      i = e.message || 'Internal Server Error';
    r.status(o).json({
      error: 500 === o ? 'Internal Server Error' : e.name,
      message:
        'production' === process.env.NODE_ENV && 500 === o
          ? 'An error occurred processing your request'
          : i,
      timestamp: new Date().toISOString(),
      ...('production' !== process.env.NODE_ENV && { stack: e.stack })
    });
  }),
  app.listen(PORT, async () => {
    logger_1.logger.info(`Server running on port ${PORT}`);
  }));

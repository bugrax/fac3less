'use strict';
const __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, r, t, o) {
        void 0 === o && (o = t);
        let n = Object.getOwnPropertyDescriptor(r, t);
        ((n &&
            !('get' in n ? !r.__esModule : n.writable || n.configurable)) ||
            (n = {
              enumerable: !0,
              get() {
                return r[t];
              }
            }),
        Object.defineProperty(e, o, n));
      }
      : function (e, r, t, o) {
        (void 0 === o && (o = t), (e[o] = r[t]));
      }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (e, r) {
        Object.defineProperty(e, 'default', { enumerable: !0, value: r });
      }
      : function (e, r) {
        e.default = r;
      }),
  __importStar =
    (this && this.__importStar) ||
    (function () {
      let ownKeys = function (e) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (e) {
              const r = [];
              for (const t in e) {
                Object.prototype.hasOwnProperty.call(e, t) && (r[r.length] = t);
              }
              return r;
            }),
          ownKeys(e)
        );
      };
      return function (e) {
        if (e && e.__esModule) {
          return e;
        }
        const r = {};
        if (null != e) {
          for (let t = ownKeys(e), o = 0; o < t.length; o++) {
            'default' !== t[o] && __createBinding(r, e, t[o]);
          }
        }
        return (__setModuleDefault(r, e), r);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.modelRoutes = void 0));
const express_1 = require('express'),
  models_controller_1 = require('../controllers/models.controller'),
  logger_1 = require('../../utils/logger'),
  router = (0, express_1.Router)();
((exports.modelRoutes = router),
router.get('/', models_controller_1.getModels),
router.get('/:id', models_controller_1.getModelById),
router.get('/test/openrouter', async (e, r) => {
  try {
    const { OpenRouterClient: e } = await Promise.resolve().then(() =>
        __importStar(
          require('../../services/ai/llm/providers/openrouter/index')
        )
      ),
      t = new e({ apiKey: process.env.OPENROUTER_API_KEY });
    if (!t.validateConfig()) {
      return void r.json({
        success: !1,
        message: 'OpenRouter API key not configured',
        configured: !1
      });
    }
    const o = await t.complete({
      model: 'anthropic/claude-3-haiku',
      messages: [
        { role: 'user', content: "Say 'Hello, OpenRouter is working!'" }
      ],
      maxTokens: 20
    });
    r.json({
      success: !0,
      configured: !0,
      testResponse: o.success ? o.data?.content : null,
      error: o.error
    });
  } catch (e) {
    (logger_1.logger.error('OpenRouter test endpoint failed', {
      error: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : void 0
    }),
    r.status(500).json({
      success: !1,
      error: e instanceof Error ? e.message : 'Unknown error'
    }));
  }
}));

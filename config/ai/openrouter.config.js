'use strict';
const __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
      if (k2 === undefined) {
        k2 = k;
      }
      let desc = Object.getOwnPropertyDescriptor(m, k);
      if (
        !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
      ) {
        desc = {
          enumerable: true,
          get() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    }
    : function (o, m, k, k2) {
      if (k2 === undefined) {
        k2 = k;
      }
      o[k2] = m[k];
    });
const __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
      Object.defineProperty(o, 'default', { enumerable: true, value: v });
    }
    : function (o, v) {
      o['default'] = v;
    });
const __importStar =
  (this && this.__importStar) ||
  (function () {
    let ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          const ar = [];
          for (const k in o) {
            if (Object.prototype.hasOwnProperty.call(o, k)) {
              ar[ar.length] = k;
            }
          }
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) {
        return mod;
      }
      const result = {};
      if (mod != null) {
        for (let k = ownKeys(mod), i = 0; i < k.length; i++) {
          if (k[i] !== 'default') {
            __createBinding(result, mod, k[i]);
          }
        }
      }
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.openRouterConfig = void 0;
const dotenv = __importStar(require('dotenv'));
// Ensure environment variables are loaded
dotenv.config({ quiet: true });
exports.openRouterConfig = {
  get apiKey() {
    return process.env.OPENROUTER_API_KEY;
  },
  get defaultModel() {
    return process.env.OPENROUTER_MODEL || 'moonshotai/kimi-k2';
  },
  baseUrl: 'https://openrouter.ai/api/v1',
  timeout: 30000,
  maxRetries: 3,
  // Available models
  models: {
    scriptGeneration: 'moonshotai/kimi-k2',
    imagePrompts: 'anthropic/claude-sonnet-4',
    general: 'moonshotai/kimi-k2'
  }
};

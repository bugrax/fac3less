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
exports.replicateConfig = void 0;
const dotenv = __importStar(require('dotenv'));
// Ensure environment variables are loaded
dotenv.config({ quiet: true });
exports.replicateConfig = {
  get apiToken() {
    return process.env.REPLICATE_API_TOKEN;
  },
  get defaultModel() {
    return process.env.REPLICATE_VIDEO_MODEL || 'kwaivgi/kling-v2.1';
  },
  timeout: 600000, // 10 minutes for video generation
  maxRetries: 2,
  // Available models with their configurations
  models: {
    'kwaivgi/kling-v2.1': {
      name: 'Kling v2.1',
      supportsTextToVideo: true,
      supportsImageToVideo: true,
      defaultMode: 'standard',
      maxDuration: 10
    },
    'bytedance/seedance-1-pro': {
      name: 'Seedance Pro',
      supportsTextToVideo: false,
      supportsImageToVideo: true,
      defaultResolution: '1080p',
      defaultAspectRatio: '9:16',
      maxDuration: 10
    }
  }
};

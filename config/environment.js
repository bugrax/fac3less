'use strict';
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.environment = void 0;
exports.validateEnvironment = validateEnvironment;
const dotenv_1 = __importDefault(require('dotenv'));
// Load environment variables
dotenv_1.default.config({ quiet: true });
exports.environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // API Keys
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  replicateApiToken: process.env.REPLICATE_API_TOKEN,
  // Default models
  openRouterModel: process.env.OPENROUTER_MODEL || 'moonshotai/kimi-k2',
  replicateVideoModel:
    process.env.REPLICATE_VIDEO_MODEL || 'kwaivgi/kling-v2.1',
  // Output configuration
  outputDir: process.env.OUTPUT_DIR || './output'
};
// Validate required environment variables
function validateEnvironment() {
  const required = [];
  const missing = required.filter(key => !exports.environment[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

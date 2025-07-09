"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
exports.validateEnvironment = validateEnvironment;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
exports.environment = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    // API Keys
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    replicateApiToken: process.env.REPLICATE_API_TOKEN,
    // Default models
    openRouterModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-pro',
    replicateVideoModel: process.env.REPLICATE_VIDEO_MODEL || 'kwaivgi/kling-v2.1',
    // Output configuration
    outputDir: process.env.OUTPUT_DIR || './output',
    assetsDir: process.env.ASSETS_DIR || './assets',
    // Rate limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    logFormat: process.env.LOG_FORMAT || 'json'
};
// Validate required environment variables
function validateEnvironment() {
    const required = [];
    const missing = required.filter(key => !exports.environment[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

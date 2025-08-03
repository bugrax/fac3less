'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.replicateConfig = exports.openRouterConfig = void 0;
const openrouter_config_1 = require('./openrouter.config');
Object.defineProperty(exports, 'openRouterConfig', {
  enumerable: true,
  get() {
    return openrouter_config_1.openRouterConfig;
  }
});
const replicate_config_1 = require('./replicate.config');
Object.defineProperty(exports, 'replicateConfig', {
  enumerable: true,
  get() {
    return replicate_config_1.replicateConfig;
  }
});

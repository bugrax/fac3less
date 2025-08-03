'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.BaseProvider = void 0));
const logger_1 = require('../../utils/logger');
class BaseProvider {
  config;
  name;
  constructor(e, config = {}) {
    ((this.name = e),
      (this.config = { timeout: 3e4, maxRetries: 3, ...config }));
  }
  async withRetry(e, r = this.config.maxRetries || 3) {
    let t;
    for (let i = 0; i < r; i++)
      try {
        return await e();
      } catch (e) {
        if (
          ((t = e),
          logger_1.logger.warn(
            `Provider ${this.name} retry attempt ${i + 1}/${r} failed`,
            {
              provider: this.name,
              attempt: i + 1,
              maxRetries: r,
              error: t?.message,
              willRetry: i < r - 1,
            }
          ),
          i < r - 1)
        ) {
          const e = 1e3 * Math.pow(2, i);
          await new Promise(r => setTimeout(r, e));
        }
      }
    throw t;
  }
}
exports.BaseProvider = BaseProvider;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.TestModeHandler = void 0));
const testMedia_1 = require('../../../../config/testMedia'),
  logger_1 = require('../../../utils/logger');
class TestModeHandler {
  static isTestMode() {
    return (0, testMedia_1.isTestMode)();
  }
  static logTestMode(e) {
    this.isTestMode() &&
      logger_1.logger.info(`[${e}] TEST MODE - Returning mock response`);
  }
  static generateMockData(e, t) {
    return (this.logTestMode(t.nodeType), e());
  }
  static generateMockArray(e, t, s) {
    return (
      this.logTestMode(s.nodeType),
      Array.from({ length: e }, (e, s) => t(s))
    );
  }
  static generateMockText(e, t, s) {
    return (s && this.logTestMode(s.nodeType), `${e}${t ? ` ${t}` : ''}`);
  }
}
exports.TestModeHandler = TestModeHandler;

'use strict';
var LogLevel;
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.logger = exports.LogLevel = void 0),
  (function (e) {
    ((e[(e.ERROR = 0)] = 'ERROR'),
      (e[(e.WARN = 1)] = 'WARN'),
      (e[(e.INFO = 2)] = 'INFO'),
      (e[(e.DEBUG = 3)] = 'DEBUG'));
  })(LogLevel || (exports.LogLevel = LogLevel = {})));
class Logger {
  level;
  constructor() {
    this.level =
      'production' === process.env.NODE_ENV ? LogLevel.WARN : LogLevel.DEBUG;
  }
  error(e, ...o) {
    this.level >= LogLevel.ERROR && console.error(`[ERROR] ${e}`, ...o);
  }
  warn(e, ...o) {
    this.level >= LogLevel.WARN && console.warn(`[WARN] ${e}`, ...o);
  }
  info(e, ...o) {
    if (this.level >= LogLevel.INFO) {
      if ('test' === process.env.NODE_ENV) return;
      console.info(`[INFO] ${e}`, ...o);
    }
  }
  debug(e, ...o) {
    if (this.level >= LogLevel.DEBUG) {
      if ('test' === process.env.NODE_ENV) return;
      console.debug(`[DEBUG] ${e}`, ...o);
    }
  }
  setLevel(e) {
    this.level = e;
  }
}
exports.logger = new Logger();

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.OpenRouterQuotaError =
    exports.OpenRouterRateLimitError =
    exports.OpenRouterAuthError =
    exports.OpenRouterError =
      void 0));
class OpenRouterError extends Error {
  code;
  type;
  constructor(r, e, t) {
    (super(r),
      (this.code = e),
      (this.type = t),
      (this.name = 'OpenRouterError'));
  }
}
exports.OpenRouterError = OpenRouterError;
class OpenRouterAuthError extends OpenRouterError {
  constructor(r) {
    (super(r, 401, 'auth'), (this.name = 'OpenRouterAuthError'));
  }
}
exports.OpenRouterAuthError = OpenRouterAuthError;
class OpenRouterRateLimitError extends OpenRouterError {
  retryAfter;
  constructor(r, e) {
    (super(r, 429, 'rate_limit'),
      (this.retryAfter = e),
      (this.name = 'OpenRouterRateLimitError'));
  }
}
exports.OpenRouterRateLimitError = OpenRouterRateLimitError;
class OpenRouterQuotaError extends OpenRouterError {
  constructor(r) {
    (super(r, 402, 'quota'), (this.name = 'OpenRouterQuotaError'));
  }
}
exports.OpenRouterQuotaError = OpenRouterQuotaError;

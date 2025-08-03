'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.authMiddleware = void 0));
const authMiddleware = (e, r, d) => {
  const t = e.headers['x-user-id'],
    s = e.headers['x-user-name'];
  if (!t) {
    return (
      console.warn('Auth middleware: No user ID provided'),
      void r.status(401).json({ error: 'Authentication required' })
    );
  }
  ((e.user = { id: t, name: s || 'Unknown User' }), d());
};
exports.authMiddleware = authMiddleware;

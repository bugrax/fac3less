'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.WorkflowValidator = void 0));
class WorkflowValidator {
  validateWorkflow(o) {
    if (!o.nodes || 0 === o.nodes.length) {
      throw new Error('Workflow must contain at least one node');
    }
    this.buildExecutionOrder(o);
    for (const e of o.edges) {
      const t = o.nodes.find(o => o.id === e.source),
        r = o.nodes.find(o => o.id === e.target);
      if (!t || !r) {
        throw new Error(`Invalid edge: ${e.source} -> ${e.target}`);
      }
    }
  }
  buildExecutionOrder(o) {
    const e = new Map(),
      t = new Map();
    for (const r of o.nodes) {
      (e.set(r.id, []), t.set(r.id, 0));
    }
    for (const r of o.edges) {
      const o = e.get(r.source) ?? [];
      (o.push(r.target),
      e.set(r.source, o),
      t.set(r.target, (t.get(r.target) ?? 0) + 1));
    }
    const r = [],
      s = [];
    for (const [o, e] of t) {
      0 === e && r.push(o);
    }
    for (; r.length > 0; ) {
      const o = r.shift();
      if (!o) {
        continue;
      }
      s.push(o);
      const n = e.get(o) || [];
      for (const o of n) {
        const e = (t.get(o) || 0) - 1;
        (t.set(o, e), 0 === e && r.push(o));
      }
    }
    if (s.length !== o.nodes.length) {
      throw new Error('Workflow contains cycles');
    }
    return s;
  }
}
exports.WorkflowValidator = WorkflowValidator;

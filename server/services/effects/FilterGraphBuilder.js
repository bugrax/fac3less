'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.FilterGraphBuilder = void 0));
const logger_1 = require('../../utils/logger');
class FilterGraphBuilder {
  nodes = new Map();
  connections = [];
  inputLabels = new Map();
  nodeCounter = 0;
  input(t, e) {
    return (this.inputLabels.set(t, e), this);
  }
  video(t, e = {}, o = {}) {
    const r = o.id || `${t}_${this.nodeCounter++}`,
      n = o.inputs || [],
      i = o.outputs || [`[${r}_out]`];
    return (
      this.nodes.set(r, {
        id: r,
        filter: t,
        params: this.cleanParams(e),
        inputs: n,
        outputs: i,
      }),
      this
    );
  }
  audio(t, e = {}, o = {}) {
    const r = o.id || `${t}_${this.nodeCounter++}`,
      n = o.inputs || [],
      i = o.outputs || [`[${r}_out]`];
    return (
      this.nodes.set(r, {
        id: r,
        filter: t,
        params: this.cleanParams(e),
        inputs: n,
        outputs: i,
      }),
      this
    );
  }
  scale(t, e, o) {
    return this.video('scale', { w: t, h: e }, { outputs: o ? [o] : void 0 });
  }
  zoompan(t, e, o, r, n, i) {
    return this.video(
      'zoompan',
      {
        z: t,
        x_pan: '(iw-iw/zoom)/2',
        y_pan: '(ih-ih/zoom)/2',
        d: r,
        s: `${e}x${o}`,
        fps: n,
      },
      { outputs: i ? [i] : void 0 }
    );
  }
  volume(t, e) {
    return this.audio('volume', { volume: t }, { outputs: e ? [e] : void 0 });
  }
  adelay(t, e) {
    return this.audio(
      'adelay',
      { delays: `${t}|${t}` },
      { outputs: e ? [e] : void 0 }
    );
  }
  atrim(t, e, o) {
    return this.audio(
      'atrim',
      { start: t, end: e },
      { outputs: o ? [o] : void 0 }
    );
  }
  afade(t, e, o, r) {
    return this.audio(
      'afade',
      { type: t, start_time: e, fade_duration: o },
      { outputs: r ? [r] : void 0 }
    );
  }
  amix(t, e, o = {}) {
    return this.audio(
      'amix',
      {
        inputs: t.length,
        mix_duration: o.duration || 'first',
        normalize: !1 !== o.normalize,
      },
      { inputs: t, outputs: [e] }
    );
  }
  connect(t, e) {
    return (this.connections.push({ from: t, to: e }), this);
  }
  output(t) {
    return this;
  }
  build() {
    const t = [];
    for (const [e, o] of this.inputLabels.entries()) t.push(`[${e}]${o}`);
    for (const e of this.nodes.values()) {
      let o = '';
      (e.inputs && e.inputs.length > 0 && (o += e.inputs.join('')),
        (o += e.filter));
      const r = this.formatParams(e.params);
      (r && (o += `=${r}`),
        e.outputs && e.outputs.length > 0 && (o += e.outputs.join('')),
        t.push(o));
    }
    let e = t.join(';');
    for (const t of this.connections) e = e.replace(t.from, t.to);
    return e;
  }
  getNodes() {
    return Array.from(this.nodes.values());
  }
  cleanParams(t) {
    const e = {};
    for (const [o, r] of Object.entries(t))
      if (null != r) {
        let t = o;
        ((t =
          'fade_duration' === o || 'mix_duration' === o || 'trim_duration' === o
            ? 'duration'
            : 'x_pan' === o || 'y_pan' === o
              ? o.replace('_pan', '')
              : 'x_overlay' === o || 'y_overlay' === o
                ? o.replace('_overlay', '')
                : 'start_time' === o ||
                    'end_time' === o ||
                    'start_pts' === o ||
                    'end_pts' === o
                  ? o
                  : o.replace(/_/g, '')),
          (e[t] = r));
      }
    return e;
  }
  formatParams(t) {
    return Object.entries(t)
      .map(([t, e]) =>
        'boolean' == typeof e
          ? e
            ? t
            : ''
          : 'string' == typeof e && (e.includes('(') || e.includes(')'))
            ? `${t}='${e}'`
            : `${t}=${e}`
      )
      .filter(t => t.length > 0)
      .join(':');
  }
  validate() {
    const t = [],
      e = new Set(),
      o = new Set();
    for (const t of this.nodes.values())
      (t.inputs && t.inputs.forEach(t => e.add(t)),
        t.outputs && t.outputs.forEach(t => o.add(t)));
    for (const r of this.connections)
      (o.has(r.from) ||
        t.push(`Connection references non-existent output: ${r.from}`),
        e.has(r.to) ||
          t.push(`Connection references non-existent input: ${r.to}`));
    return { valid: 0 === t.length, errors: t };
  }
  static fromFilterString(t) {
    return (
      logger_1.logger.warn(
        '[FilterGraphBuilder] fromFilterString not yet implemented'
      ),
      new FilterGraphBuilder()
    );
  }
}
exports.FilterGraphBuilder = FilterGraphBuilder;

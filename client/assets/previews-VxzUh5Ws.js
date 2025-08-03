import { r as c, j as o, R as v } from './workflow-DLvrlcxk.js';
class N {
  level;
  constructor() {
    this.level = 1;
  }
  error(e, ...t) {
    this.level >= 0 && console.error(`[ERROR] ${e}`, ...t);
  }
  warn(e, ...t) {
    this.level >= 1 && console.warn(`[WARN] ${e}`, ...t);
  }
  info(e, ...t) {
    this.level >= 2 && console.info(`[INFO] ${e}`, ...t);
  }
  debug(e, ...t) {
    this.level >= 3 && console.debug(`[DEBUG] ${e}`, ...t);
  }
  setLevel(e) {
    this.level = e;
  }
}
const M = new N();
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const B = r => r.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  L = r =>
    r.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, a) =>
      a ? a.toUpperCase() : t.toLowerCase()
    ),
  w = r => {
    const e = L(r);
    return e.charAt(0).toUpperCase() + e.slice(1);
  },
  S = (...r) =>
    r
      .filter((e, t, a) => !!e && e.trim() !== '' && a.indexOf(e) === t)
      .join(' ')
      .trim(),
  R = r => {
    for (const e in r)
      if (e.startsWith('aria-') || e === 'role' || e === 'title') return !0;
  };
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var W = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const T = c.forwardRef(
  (
    {
      color: r = 'currentColor',
      size: e = 24,
      strokeWidth: t = 2,
      absoluteStrokeWidth: a,
      className: s = '',
      children: i,
      iconNode: d,
      ...l
    },
    u
  ) =>
    c.createElement(
      'svg',
      {
        ref: u,
        ...W,
        width: e,
        height: e,
        stroke: r,
        strokeWidth: a ? (Number(t) * 24) / Number(e) : t,
        className: S('lucide', s),
        ...(!i && !R(l) && { 'aria-hidden': 'true' }),
        ...l,
      },
      [
        ...d.map(([p, g]) => c.createElement(p, g)),
        ...(Array.isArray(i) ? i : [i]),
      ]
    )
);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const n = (r, e) => {
  const t = c.forwardRef(({ className: a, ...s }, i) =>
    c.createElement(T, {
      ref: i,
      iconNode: e,
      className: S(`lucide-${B(w(r))}`, `lucide-${r}`, a),
      ...s,
    })
  );
  return ((t.displayName = w(r)), t);
};
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const q = [
    [
      'path',
      {
        d: 'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z',
        key: 'l5xja',
      },
    ],
    [
      'path',
      {
        d: 'M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z',
        key: 'ep3f8r',
      },
    ],
    [
      'path',
      { d: 'M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4', key: '1p4c4q' },
    ],
    ['path', { d: 'M17.599 6.5a3 3 0 0 0 .399-1.375', key: 'tmeiqw' }],
    ['path', { d: 'M6.003 5.125A3 3 0 0 0 6.401 6.5', key: '105sqy' }],
    ['path', { d: 'M3.477 10.896a4 4 0 0 1 .585-.396', key: 'ql3yin' }],
    ['path', { d: 'M19.938 10.5a4 4 0 0 1 .585.396', key: '1qfode' }],
    ['path', { d: 'M6 18a4 4 0 0 1-1.967-.516', key: '2e4loj' }],
    ['path', { d: 'M19.967 17.484A4 4 0 0 1 18 18', key: '159ez6' }],
  ],
  be = n('brain', q);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const I = [
    [
      'rect',
      {
        width: '18',
        height: '14',
        x: '3',
        y: '5',
        rx: '2',
        ry: '2',
        key: '12ruh7',
      },
    ],
    ['path', { d: 'M7 15h4M15 15h2M7 11h2M13 11h4', key: '1ueiar' }],
  ],
  ge = n('captions', I);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const V = [
    [
      'rect',
      {
        width: '14',
        height: '14',
        x: '8',
        y: '8',
        rx: '2',
        ry: '2',
        key: '17jyea',
      },
    ],
    [
      'path',
      {
        d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
        key: 'zix9uf',
      },
    ],
  ],
  ye = n('copy', V);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const H = [
    [
      'path',
      {
        d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
        key: '1rqfz7',
      },
    ],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
    ['path', { d: 'M10 9H8', key: 'b1mrlr' }],
    ['path', { d: 'M16 13H8', key: 't4e002' }],
    ['path', { d: 'M16 17H8', key: 'z1uh3a' }],
  ],
  xe = n('file-text', H);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const U = [
    [
      'path',
      {
        d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
        key: '1rqfz7',
      },
    ],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
    ['path', { d: 'm10 11 5 3-5 3v-6Z', key: '7ntvm4' }],
  ],
  fe = n('file-video', U);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const E = [
    [
      'path',
      {
        d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
        key: '1rqfz7',
      },
    ],
    ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  ],
  ke = n('file', E);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Z = [
    [
      'rect',
      { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' },
    ],
    ['path', { d: 'M7 3v18', key: 'bbkbws' }],
    ['path', { d: 'M3 7.5h4', key: 'zfgn84' }],
    ['path', { d: 'M3 12h18', key: '1i2n21' }],
    ['path', { d: 'M3 16.5h4', key: '1230mu' }],
    ['path', { d: 'M17 3v18', key: 'in4fa5' }],
    ['path', { d: 'M17 7.5h4', key: 'myr1c1' }],
    ['path', { d: 'M17 16.5h4', key: 'go4c1d' }],
  ],
  me = n('film', Z);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const O = [
    [
      'rect',
      {
        width: '18',
        height: '18',
        x: '3',
        y: '3',
        rx: '2',
        ry: '2',
        key: '1m3agn',
      },
    ],
    ['circle', { cx: '9', cy: '9', r: '2', key: 'af1f0g' }],
    ['path', { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21', key: '1xmnt7' }],
  ],
  ve = n('image', O);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const D = [
    ['path', { d: 'M12 19v3', key: 'npa21l' }],
    ['path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2', key: '1vc78b' }],
    [
      'rect',
      { x: '9', y: '2', width: '6', height: '13', rx: '3', key: 's6n7sd' },
    ],
  ],
  Me = n('mic', D);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Y = [
    ['path', { d: 'M9 18V5l12-2v13', key: '1jmyc2' }],
    ['circle', { cx: '6', cy: '18', r: '3', key: 'fqmcym' }],
    ['circle', { cx: '18', cy: '16', r: '3', key: '1hluhg' }],
  ],
  we = n('music', Y);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const G = [
    [
      'path',
      {
        d: 'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z',
        key: 'e79jfc',
      },
    ],
    [
      'circle',
      { cx: '13.5', cy: '6.5', r: '.5', fill: 'currentColor', key: '1okk4w' },
    ],
    [
      'circle',
      { cx: '17.5', cy: '10.5', r: '.5', fill: 'currentColor', key: 'f64h9f' },
    ],
    [
      'circle',
      { cx: '6.5', cy: '12.5', r: '.5', fill: 'currentColor', key: 'qy21gx' },
    ],
    [
      'circle',
      { cx: '8.5', cy: '7.5', r: '.5', fill: 'currentColor', key: 'fotxhn' },
    ],
  ],
  je = n('palette', G);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const K = [
    [
      'rect',
      { x: '14', y: '4', width: '4', height: '16', rx: '1', key: 'zuxfzm' },
    ],
    [
      'rect',
      { x: '6', y: '4', width: '4', height: '16', rx: '1', key: '1okwgv' },
    ],
  ],
  z = n('pause', K);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const J = [['polygon', { points: '6 3 20 12 6 21 6 3', key: '1oa8hb' }]],
  $ = n('play', J);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Q = [
    [
      'path',
      {
        d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
        key: '4pj2yx',
      },
    ],
    ['path', { d: 'M20 3v4', key: '1olli1' }],
    ['path', { d: 'M22 5h-4', key: '1gvqau' }],
    ['path', { d: 'M4 17v2', key: 'vumght' }],
    ['path', { d: 'M5 18H3', key: 'zchphs' }],
  ],
  Ce = n('sparkles', Q);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const X = [
    ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
    ['path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6', key: '4alrt4' }],
    ['path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2', key: 'v07s0e' }],
    ['line', { x1: '10', x2: '10', y1: '11', y2: '17', key: '1uufr5' }],
    ['line', { x1: '14', x2: '14', y1: '11', y2: '17', key: 'xtxkd' }],
  ],
  _e = n('trash-2', X);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ee = [
    [
      'path',
      {
        d: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5',
        key: 'ftymec',
      },
    ],
    [
      'rect',
      { x: '2', y: '6', width: '14', height: '12', rx: '2', key: '158x01' },
    ],
  ],
  Se = n('video', ee);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const re = [
    [
      'path',
      {
        d: 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z',
        key: 'uqj9uw',
      },
    ],
    ['path', { d: 'M16 9a5 5 0 0 1 0 6', key: '1q6k2b' }],
    ['path', { d: 'M19.364 18.364a9 9 0 0 0 0-12.728', key: 'ijwkga' }],
  ],
  ze = n('volume-2', re);
/**
 * @license lucide-react v0.523.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const te = [
    [
      'path',
      {
        d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
        key: '1xq2db',
      },
    ],
  ],
  $e = n('zap', te),
  j = {
    sm: { padding: '8px 16px', fontSize: '12px', height: '32px' },
    md: { padding: '10px 20px', fontSize: '14px', height: '36px' },
    lg: { padding: '12px 24px', fontSize: '16px', height: '40px' },
  },
  C = {
    primary: {
      base: {
        background:
          'linear-gradient(135deg, rgba(172, 92, 255, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
        border: '1px solid rgba(172, 92, 255, 0.3)',
        color: 'rgba(255, 255, 255, 0.95)',
        fontWeight: '500',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
      hover: {
        background:
          'linear-gradient(135deg, rgba(172, 92, 255, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
        borderColor: 'rgba(172, 92, 255, 0.5)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 20px rgba(172, 92, 255, 0.3)',
      },
      active: {
        transform: 'translateY(0)',
        boxShadow: '0 2px 10px rgba(172, 92, 255, 0.2)',
      },
    },
    secondary: {
      base: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
      hover: {
        background: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.9)',
      },
    },
    glass: {
      base: {
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        color: '#ffffff',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow:
          '0 4px 24px rgba(31, 38, 135, 0.27), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      hover: {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow:
          '0 8px 32px rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
    },
    danger: {
      base: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
      hover: {
        background: 'rgba(239, 68, 68, 0.3)',
        borderColor: 'rgba(239, 68, 68, 0.4)',
      },
    },
    success: {
      base: {
        background: 'rgba(16, 185, 129, 0.2)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '#10b981',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
      hover: {
        background: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
      },
    },
    icon: {
      base: {
        backgroundColor: 'rgba(172, 92, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(172, 92, 255, 0.3)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      hover: {
        backgroundColor: 'rgba(172, 92, 255, 0.3)',
        borderColor: 'rgba(172, 92, 255, 0.5)',
        transform: 'scale(1.05)',
      },
      active: { transform: 'scale(0.95)' },
    },
  };
function oe(r = 'primary', e = 'md', t) {
  const a = C[r] || C.primary,
    s = j[e] || j.md;
  return {
    base: {
      ...a.base,
      padding: s.padding,
      fontSize: s.fontSize,
      ...(s.height && { height: s.height }),
      ...t,
    },
    hover: t
      ? {
          background: 'rgba(139, 92, 246, 0.3)',
          borderColor: 'rgba(139, 92, 246, 0.4)',
        }
      : a.hover,
    active: a.active,
    disabled: a.disabled,
  };
}
function ae(r, e) {
  return {
    onMouseEnter: () => {
      r.hover && e({ ...r.base, ...r.hover });
    },
    onMouseLeave: () => {
      e(r.base);
    },
    onMouseDown: () => {
      r.active && e({ ...r.base, ...r.active });
    },
    onMouseUp: () => {
      r.hover && e({ ...r.base, ...r.hover });
    },
  };
}
const se = ({
    children: r,
    variant: e = 'primary',
    size: t = 'md',
    icon: a,
    iconPosition: s = 'left',
    fullWidth: i = !1,
    customStyles: d,
    style: l,
    onClick: u,
    disabled: p,
    ...g
  }) => {
    const y = oe(e, t, d),
      [f, k] = c.useState(y.base),
      m = p ? {} : ae(y, k),
      h = P => {
        !p && u && u(P);
      },
      x = {
        ...f,
        ...(i && { width: '100%' }),
        ...(p && { opacity: 0.5, cursor: 'not-allowed', ...y.disabled }),
        ...l,
        borderRadius: e === 'icon' ? '50%' : '10px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      };
    return o.jsxs('button', {
      style: x,
      onClick: h,
      disabled: p,
      ...m,
      ...g,
      children: [a && s === 'left' && a, r, a && s === 'right' && a],
    });
  },
  ne = ({
    icon: r,
    ariaLabel: e,
    iconSize: t = 20,
    size: a = 'md',
    variant: s = 'icon',
    ...i
  }) => {
    const d = {
      sm: { width: '32px', height: '32px' },
      md: { width: '44px', height: '44px' },
      lg: { width: '52px', height: '52px' },
    };
    return o.jsx(se, {
      variant: s,
      size: a,
      'aria-label': e,
      customStyles: { ...d[a], padding: 0 },
      ...i,
      children: v.isValidElement(r) && v.cloneElement(r, { size: t }),
    });
  },
  F = (r, e) => {
    if (r) return r;
    if (e) {
      if (e.startsWith('http://') || e.startsWith('https://')) return e;
      let t = e;
      return (
        t.startsWith('./') && (t = t.substring(2)),
        t.includes('output/') ? `/media/${t.split('output/')[1]}` : e
      );
    }
    return '';
  },
  A = ({ children: r, metadata: e }) =>
    o.jsx('div', {
      className: 'media-preview',
      children: o.jsxs('div', {
        style: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(172, 92, 255, 0.2)',
          borderRadius: '10px',
          padding: '12px',
          overflow: 'hidden',
        },
        children: [
          r,
          e &&
            o.jsx('div', {
              style: {
                marginTop: '12px',
                fontSize: '13px',
                color: 'rgba(172, 92, 255, 0.8)',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              },
              children: e,
            }),
        ],
      }),
    }),
  ie = ({ data: r, isExpanded: e }) => {
    const t = F(r.url, r.path);
    return o.jsx(A, {
      metadata: o.jsxs(o.Fragment, {
        children: [
          o.jsxs('span', { children: [r.width, 'x', r.height] }),
          o.jsx('span', { children: r.format?.toUpperCase() }),
        ],
      }),
      children: o.jsx('img', {
        src: t,
        alt: 'Generated image',
        style: {
          width: '100%',
          height: e ? 'auto' : '200px',
          maxHeight: e ? '60vh' : '200px',
          objectFit: e ? 'contain' : 'cover',
          borderRadius: '6px',
          transition: 'height 0.3s ease',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          display: 'block',
        },
      }),
    });
  },
  Fe = Object.freeze(
    Object.defineProperty(
      { __proto__: null, ImagePreview: ie },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  le = ({ data: r, isExpanded: e }) => {
    const t = c.useRef(null),
      [a, s] = c.useState(!1),
      i = F(r.url, r.path),
      d = () => {
        t.current && (a ? t.current.pause() : t.current.play(), s(!a));
      };
    return o.jsx(A, {
      metadata: o.jsxs(o.Fragment, {
        children: [
          o.jsxs('span', {
            children: [r.width, 'x', r.height, ' @ ', r.fps, 'fps'],
          }),
          o.jsxs('span', { children: [Math.round(r.duration), 's'] }),
        ],
      }),
      children: o.jsxs('div', {
        style: { position: 'relative' },
        children: [
          o.jsx('video', {
            ref: t,
            src: i,
            style: {
              width: '100%',
              height: e ? 'auto' : '200px',
              maxHeight: e ? '60vh' : '200px',
              objectFit: e ? 'contain' : 'cover',
              borderRadius: '6px',
              transition: 'height 0.3s ease',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              display: 'block',
            },
            onEnded: () => s(!1),
            controls: e,
          }),
          !e &&
            o.jsx('button', {
              onClick: d,
              style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(172, 92, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(172, 92, 255, 0.3)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              },
              onMouseEnter: l => {
                ((l.currentTarget.style.backgroundColor =
                  'rgba(172, 92, 255, 0.3)'),
                  (l.currentTarget.style.borderColor =
                    'rgba(172, 92, 255, 0.5)'));
              },
              onMouseLeave: l => {
                ((l.currentTarget.style.backgroundColor =
                  'rgba(172, 92, 255, 0.2)'),
                  (l.currentTarget.style.borderColor =
                    'rgba(172, 92, 255, 0.3)'));
              },
              children: a
                ? o.jsx(z, { size: 20, color: 'rgba(255, 255, 255, 0.9)' })
                : o.jsx($, {
                    size: 20,
                    color: 'rgba(255, 255, 255, 0.9)',
                    style: { marginLeft: '2px' },
                  }),
            }),
        ],
      }),
    });
  },
  Ae = Object.freeze(
    Object.defineProperty(
      { __proto__: null, VideoPreview: le },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  b = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(172, 92, 255, 0.2)',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
    },
    playButton: {
      base: {
        backgroundColor: 'rgba(172, 92, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(172, 92, 255, 0.3)',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
      },
      playing: { transform: 'scale(0.95)' },
      hover: {
        backgroundColor: 'rgba(172, 92, 255, 0.3)',
        borderColor: 'rgba(172, 92, 255, 0.5)',
        transform: 'scale(1.05)',
      },
      mouseDown: { transform: 'scale(0.9)' },
    },
    progressContainer: { flex: 1 },
    progressBar: (r, e) => ({
      width: '100%',
      height: '4px',
      background: `linear-gradient(to right, rgba(172, 92, 255, 0.6) 0%, rgba(172, 92, 255, 0.6) ${e > 0 ? (r / e) * 100 : 0}%, rgba(255, 255, 255, 0.1) ${e > 0 ? (r / e) * 100 : 0}%, rgba(255, 255, 255, 0.1) 100%)`,
      borderRadius: '2px',
      outline: 'none',
      cursor: 'pointer',
      WebkitAppearance: 'none',
      appearance: 'none',
    }),
    timeDisplay: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '6px',
      fontSize: '12px',
      color: 'rgba(172, 92, 255, 0.8)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    trackLabel: { color: 'rgba(255, 255, 255, 0.6)' },
  },
  ce = `
  .audio-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: rgba(172, 92, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .audio-slider::-webkit-slider-thumb:hover {
    background: rgba(172, 92, 255, 1);
    transform: scale(1.2);
  }

  .audio-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: rgba(172, 92, 255, 0.9);
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .audio-slider::-moz-range-thumb:hover {
    background: rgba(172, 92, 255, 1);
    transform: scale(1.2);
  }
`;
function _(r) {
  const e = Math.floor(r / 60),
    t = Math.floor(r % 60);
  return `${e}:${t.toString().padStart(2, '0')}`;
}
function de(r) {
  if (r.url) return r.url;
  if (r.path) {
    let e = r.path;
    return (
      e.startsWith('./') && (e = e.substring(2)),
      e.includes('output/') ? `/media/${e.split('output/')[1]}` : r.path
    );
  }
  return '';
}
function pe(r, e) {
  return { code: r?.error?.code, message: r?.error?.message, url: e };
}
const he = ({ audioData: r, index: e }) => {
    const t = c.useRef(null),
      [a, s] = c.useState(!1),
      [i, d] = c.useState(0),
      [l, u] = c.useState(0),
      p = de(r),
      g = async () => {
        if (t.current)
          try {
            (a ? t.current.pause() : await t.current.play(), s(!a));
          } catch (h) {
            M.error('Audio play error:', h);
          }
      },
      y = () => {
        t.current && d(t.current.currentTime);
      },
      f = () => {
        t.current && u(t.current.duration);
      },
      k = h => {
        const x = parseFloat(h.target.value);
        t.current && ((t.current.currentTime = x), d(x));
      },
      m = () => {
        const h = pe(t.current, p);
        M.error('Audio playback error:', h);
      };
    return o.jsxs('div', {
      style: b.container,
      children: [
        o.jsx(ne, {
          onClick: g,
          icon: a
            ? o.jsx(z, { color: 'rgba(255, 255, 255, 0.9)' })
            : o.jsx($, { color: 'rgba(255, 255, 255, 0.9)' }),
          ariaLabel: a ? 'Pause audio' : 'Play audio',
          size: 'md',
          variant: 'icon',
          customStyles: a ? b.playButton.playing : {},
        }),
        o.jsxs('div', {
          style: b.progressContainer,
          children: [
            o.jsx('input', {
              type: 'range',
              min: '0',
              max: l || 0,
              value: i,
              onChange: k,
              style: b.progressBar(i, l),
              className: 'audio-slider',
            }),
            o.jsxs('div', {
              style: b.timeDisplay,
              children: [
                o.jsx('span', { children: _(i) }),
                e !== void 0 &&
                  o.jsxs('span', {
                    style: b.trackLabel,
                    children: ['Track ', e + 1],
                  }),
                o.jsx('span', { children: _(l) }),
              ],
            }),
          ],
        }),
        o.jsx('audio', {
          ref: t,
          src: p,
          onTimeUpdate: y,
          onLoadedMetadata: f,
          onEnded: () => s(!1),
          onError: m,
          preload: 'metadata',
        }),
      ],
    });
  },
  Pe = ({ data: r }) => {
    const e = Array.isArray(r) ? r : [r];
    return o.jsxs('div', {
      className: 'audio-preview',
      style: { width: '100%' },
      children: [
        o.jsx('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '12px' },
          children: e.map((t, a) =>
            o.jsx(he, { audioData: t, index: e.length > 1 ? a : void 0 }, a)
          ),
        }),
        o.jsx('style', { children: ce }),
      ],
    });
  };
export {
  Pe as A,
  se as B,
  ye as C,
  ke as F,
  ve as I,
  we as M,
  je as P,
  Ce as S,
  _e as T,
  Se as V,
  $e as Z,
  xe as a,
  me as b,
  ge as c,
  Me as d,
  ze as e,
  be as f,
  fe as g,
  Fe as h,
  Ae as i,
  M as l,
};

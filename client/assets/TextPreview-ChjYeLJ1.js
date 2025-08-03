import { j as e } from './workflow-DLvrlcxk.js';
import { C as a } from './previews-VxzUh5Ws.js';
import './vendor-DJG_os-6.js';
const u = ({ data: r, type: l, isExpanded: n }) => {
  const i = () => {
      if (typeof r === 'string') {
        return r;
      }
      if (r && typeof r === 'object') {
        const t = r;
        if ('content' in t) {
          return String(t.content);
        }
        if ('text' in t) {
          return String(t.text);
        }
        if (
          'script' in t &&
          typeof t.script === 'object' &&
          t.script !== null
        ) {
          const s = t.script;
          return s.content ? String(s.content) : '';
        }
        return JSON.stringify(r, null, 2);
      }
      return 'No content available';
    },
    c = () => {
      navigator.clipboard.writeText(i());
    },
    o = i(),
    p = n ? o : o.slice(0, 200) + (o.length > 200 ? '...' : '');
  return e.jsxs('div', {
    className: 'text-preview',
    style: { width: '100%' },
    children: [
      e.jsxs('div', {
        style: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(172, 92, 255, 0.2)',
          borderRadius: '10px',
          padding: '16px',
          position: 'relative',
          maxHeight: n ? '60vh' : '150px',
          overflow: 'auto',
          transition: 'max-height 0.3s ease',
          width: '100%'
        },
        children: [
          e.jsx('pre', {
            style: {
              margin: 0,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: 'rgba(255, 255, 255, 0.9)'
            },
            children: p
          }),
          e.jsx('button', {
            onClick: c,
            style: {
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            },
            title: 'Copy to clipboard',
            onMouseEnter: t => {
              ((t.currentTarget.style.backgroundColor =
                'rgba(255, 255, 255, 0.1)'),
              (t.currentTarget.style.borderColor =
                  'rgba(255, 255, 255, 0.2)'));
            },
            onMouseLeave: t => {
              ((t.currentTarget.style.backgroundColor =
                'rgba(255, 255, 255, 0.05)'),
              (t.currentTarget.style.borderColor =
                  'rgba(255, 255, 255, 0.1)'));
            },
            children: e.jsx(a, { size: 14, color: 'rgba(255, 255, 255, 0.7)' })
          })
        ]
      }),
      l === 'script' &&
        typeof r !== 'string' &&
        'scenes' in r &&
        e.jsxs('div', {
          style: {
            marginTop: '8px',
            fontSize: '12px',
            color: 'rgba(172, 92, 255, 0.8)',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          },
          children: [r.scenes.length, ' scenes']
        })
    ]
  });
};
export { u as TextPreview };

const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/previews-VxzUh5Ws.js',
      'assets/workflow-DLvrlcxk.js',
      'assets/vendor-DJG_os-6.js',
      'assets/index-DIVdHXkD.js',
      'assets/index-DTja85g_.css',
      'assets/TextPreview-ChjYeLJ1.js',
      'assets/templates-CbE1H7ul.js'
    ])
) => i.map(i => d[i]);
import { _ } from './index-DIVdHXkD.js';
import {
  r as u,
  j as e,
  R as M,
  a as Xe,
  P as ce,
  H as Ke,
  u as ve,
  M as Je,
  b as Qe,
  i as et,
  B as tt,
  c as at,
  C as nt,
  d as ot,
  e as rt,
  f as st,
  g as it,
  h as lt
} from './workflow-DLvrlcxk.js';
import { w as L } from './templates-CbE1H7ul.js';
import {
  T as ye,
  B as G,
  F as ct,
  a as we,
  M as ke,
  V as je,
  I as Se,
  l as O,
  S as dt,
  b as de,
  c as ut,
  P as pt,
  d as gt,
  e as mt,
  f as ft,
  Z as xt,
  g as bt
} from './previews-VxzUh5Ws.js';
import { m as ht } from './motion-D0VV46w0.js';
import './vendor-DJG_os-6.js';
const Ce = u.memo(() => {
  const [a, n] = u.useState({
      fps: 60,
      renderTime: 0,
      nodeCount: 0,
      edgeCount: 0
    }),
    [o, t] = u.useState(!1),
    r = u.useRef(0),
    s = u.useRef(performance.now());
  if (
    (u.useEffect(() => {
      if (!o) {
        return;
      }
      let d;
      const l = () => {
        const c = performance.now();
        if ((r.current++, c >= s.current + 1e3)) {
          const g = Math.round((r.current * 1e3) / (c - s.current));
          (n(p => ({
            ...p,
            fps: g,
            renderTime: Math.round((1e3 / g) * 100) / 100
          })),
          (r.current = 0),
          (s.current = c));
        }
        d = requestAnimationFrame(l);
      };
      return (
        (d = requestAnimationFrame(l)),
        () => {
          cancelAnimationFrame(d);
        }
      );
    }, [o]),
    u.useEffect(() => {
      const d = () => {
        const g = document.querySelectorAll('.react-flow__node'),
          p = document.querySelectorAll('.react-flow__edge');
        n(f => ({ ...f, nodeCount: g.length, edgeCount: p.length }));
      };
      d();
      const l = new MutationObserver(d),
        c = document.querySelector('.react-flow__viewport');
      return (
        c && l.observe(c, { childList: !0, subtree: !0 }),
        () => {
          l.disconnect();
        }
      );
    }, []),
    !o)
  ) {
    return e.jsx('button', {
      onClick: () => t(!0),
      style: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '4px 8px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        zIndex: 1e3
      },
      children: 'Show Performance'
    });
  }
  const i = a.fps >= 50 ? '#10b981' : a.fps >= 30 ? '#f59e0b' : '#ef4444';
  return e.jsxs('div', {
    style: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      padding: '12px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      minWidth: '200px',
      zIndex: 1e3,
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    children: [
      e.jsxs('div', {
        style: {
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        },
        children: [
          e.jsx('span', { children: 'Performance Monitor' }),
          e.jsx('button', {
            onClick: () => t(!1),
            style: {
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0',
              fontSize: '16px'
            },
            children: '×'
          })
        ]
      }),
      e.jsxs('div', {
        style: { marginBottom: '4px' },
        children: [
          e.jsx('span', { children: 'FPS: ' }),
          e.jsx('span', {
            style: { color: i, fontWeight: 'bold' },
            children: a.fps
          })
        ]
      }),
      e.jsxs('div', {
        style: { marginBottom: '4px' },
        children: [
          e.jsx('span', { children: 'Render: ' }),
          e.jsxs('span', { children: [a.renderTime, 'ms'] })
        ]
      }),
      e.jsxs('div', {
        style: { marginBottom: '4px' },
        children: [
          e.jsx('span', { children: 'Nodes: ' }),
          e.jsx('span', { children: a.nodeCount })
        ]
      }),
      e.jsxs('div', {
        children: [
          e.jsx('span', { children: 'Edges: ' }),
          e.jsx('span', { children: a.edgeCount })
        ]
      }),
      e.jsx('div', {
        style: {
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        },
        children: e.jsxs('div', {
          style: { fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' },
          children: [
            e.jsx('div', { children: '✓ GPU Acceleration' }),
            e.jsx('div', { children: '✓ CSS Containment' }),
            e.jsx('div', { children: '✓ React.memo' }),
            e.jsx('div', { children: '✓ Optimized Shadows' })
          ]
        })
      })
    ]
  });
});
Ce.displayName = 'PerformanceOverlay';
const Ee = u.createContext(void 0),
  vt = ({ children: a }) => {
    const [n, o] = u.useState({
        previews: {},
        activePreviewId: null,
        nextZIndex: 1e3
      }),
      t = u.useCallback(
        (p, f, m, b, v) => {
          const k = v || `preview-${p}-${Date.now()}`;
          if (n.previews[k]) {
            return k;
          }
          const w = {
            id: k,
            nodeId: p,
            type: f,
            content: m,
            position: { x: b.x + 250, y: b.y },
            isExpanded: !1,
            zIndex: n.nextZIndex,
            timestamp: Date.now()
          };
          return (
            o(x => ({
              ...x,
              previews: { ...x.previews, [k]: w },
              activePreviewId: k,
              nextZIndex: x.nextZIndex + 1
            })),
            k
          );
        },
        [n.nextZIndex, n.previews]
      ),
      r = u.useCallback(p => {
        o(f => {
          const { [p]: m, ...b } = f.previews;
          return {
            ...f,
            previews: b,
            activePreviewId: f.activePreviewId === p ? null : f.activePreviewId
          };
        });
      }, []),
      s = u.useCallback((p, f) => {
        o(m => {
          const b = m.previews[p];
          return b
            ? { ...m, previews: { ...m.previews, [p]: { ...b, position: f } } }
            : m;
        });
      }, []),
      i = u.useCallback(p => {
        o(f => {
          const m = f.previews[p];
          return m
            ? {
              ...f,
              previews: {
                ...f.previews,
                [p]: { ...m, zIndex: f.nextZIndex }
              },
              activePreviewId: p,
              nextZIndex: f.nextZIndex + 1
            }
            : f;
        });
      }, []),
      d = u.useCallback(p => {
        o(f => {
          const m = f.previews[p];
          return m
            ? {
              ...f,
              previews: {
                ...f.previews,
                [p]: { ...m, isExpanded: !m.isExpanded }
              }
            }
            : f;
        });
      }, []),
      l = u.useCallback(p => {
        o(f => {
          const m = Object.entries(f.previews).reduce(
            (b, [v, k]) => (k.nodeId !== p && (b[v] = k), b),
            {}
          );
          return { ...f, previews: m };
        });
      }, []),
      c = u.useCallback(() => {
        o({ previews: {}, activePreviewId: null, nextZIndex: 1e3 });
      }, []),
      g = {
        previews: Object.values(n.previews),
        activePreviewId: n.activePreviewId,
        addPreview: t,
        removePreview: r,
        updatePreviewPosition: s,
        bringToFront: i,
        toggleExpanded: d,
        removeNodePreviews: l,
        clearAllPreviews: c
      };
    return (
      M.useEffect(() => {}, [g.previews.length]),
      e.jsx(Ee.Provider, { value: g, children: a })
    );
  },
  Ne = () => {
    const a = u.useContext(Ee);
    if (!a) {
      throw new Error('usePreviewStore must be used within a PreviewProvider');
    }
    return a;
  },
  yt = async a => {
    try {
      const n = new Audio(`/assets/sounds/${a}`);
      ((n.volume = 0.5), await n.play());
    } catch (n) {
      console.warn(`Failed to play sound effect: ${a}`, n);
    }
  },
  wt = () => yt('execute.mp3'),
  kt = ({ onClick: a }) =>
    e.jsxs('button', {
      className: 'node-delete-button',
      onClick: n => {
        (n.stopPropagation(), a());
      },
      'aria-label': 'Delete node',
      children: [
        e.jsx('div', { className: 'node-delete-button-glow' }),
        e.jsx('div', { className: 'node-delete-button-glass' }),
        e.jsx('div', {
          className: 'node-delete-button-content',
          children: e.jsx(ye, { size: 16 })
        })
      ]
    }),
  jt = ({ isOpen: a, onClose: n, overlayRef: o }) => {
    (u.useEffect(() => {
      const t = r => {
        o.current && !o.current.contains(r.target) && n();
      };
      if (a) {
        return (
          document.addEventListener('mousedown', t, !0),
          () => document.removeEventListener('mousedown', t, !0)
        );
      }
    }, [a, n, o]),
    u.useEffect(() => {
      const t = r => {
        r.key === 'Escape' && n();
      };
      if (a) {
        return (
          document.addEventListener('keydown', t),
          () => document.removeEventListener('keydown', t)
        );
      }
    }, [a, n]));
  },
  Pe = ({
    isOpen: a,
    onClose: n,
    title: o,
    subtitle: t,
    children: r,
    width: s = '600px',
    maxHeight: i = '80vh',
    showCloseButton: d = !0,
    closeButtonText: l = 'Close',
    className: c = ''
  }) => {
    const g = u.useRef(null);
    return (
      jt({ isOpen: a, onClose: n, overlayRef: g }),
      a
        ? Xe.createPortal(
          e.jsxs(e.Fragment, {
            children: [
              e.jsx('div', {
                className: 'overlay-backdrop',
                style: {
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 9999,
                  animation: 'fadeIn 0.2s ease-out'
                },
                onClick: n
              }),
              e.jsxs('div', {
                ref: g,
                className: `base-overlay ${c}`,
                style: {
                  position: 'fixed',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: s,
                  maxWidth: '90vw',
                  maxHeight: i,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  background: 'rgba(20, 20, 30, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(172, 92, 255, 0.3)',
                  borderRadius: '16px',
                  boxShadow:
                      '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 80px rgba(172, 92, 255, 0.2)',
                  zIndex: 1e4,
                  animation: 'slideIn 0.3s ease-out',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                },
                children: [
                  e.jsxs('h3', {
                    style: {
                      margin: '0 0 20px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.95)',
                      textAlign: 'center',
                      letterSpacing: '0.02em'
                    },
                    children: [
                      o,
                      t &&
                          e.jsx('span', {
                            style: {
                              display: 'block',
                              fontSize: '13px',
                              color: 'rgba(172, 92, 255, 0.8)',
                              marginTop: '4px',
                              fontWeight: '400'
                            },
                            children: t
                          })
                    ]
                  }),
                  e.jsx('div', {
                    className: 'overlay-content',
                    style: {
                      flex: 1,
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      fontFamily:
                          'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      width: '100%',
                      boxSizing: 'border-box'
                    },
                    children: r
                  }),
                  d &&
                      e.jsx('div', {
                        style: {
                          display: 'flex',
                          gap: '12px',
                          marginTop: '24px'
                        },
                        children: e.jsx(G, {
                          onClick: n,
                          variant: 'secondary',
                          size: 'md',
                          fullWidth: !0,
                          className: 'overlay-close-button',
                          children: l
                        })
                      })
                ]
              }),
              e.jsx('style', {
                children: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* Custom scrollbar for the content area */
        .overlay-content::-webkit-scrollbar {
          width: 8px;
        }

        .overlay-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .overlay-content::-webkit-scrollbar-thumb {
          background: rgba(172, 92, 255, 0.3);
          border-radius: 4px;
        }

        .overlay-content::-webkit-scrollbar-thumb:hover {
          background: rgba(172, 92, 255, 0.5);
        }
      `
              })
            ]
          }),
          document.body
        )
        : null
    );
  },
  St = M.lazy(() =>
    _(
      () => import('./previews-VxzUh5Ws.js').then(a => a.h),
      __vite__mapDeps([0, 1, 2])
    ).then(a => ({ default: a.ImagePreview }))
  ),
  Ct = M.lazy(() =>
    _(
      () => import('./previews-VxzUh5Ws.js').then(a => a.i),
      __vite__mapDeps([0, 1, 2])
    ).then(a => ({ default: a.VideoPreview }))
  ),
  Et = M.lazy(() =>
    _(
      () => import('./index-DIVdHXkD.js').then(a => a.i),
      __vite__mapDeps([3, 1, 2, 0, 4])
    ).then(a => ({ default: a.AudioPreview }))
  ),
  J = M.lazy(() =>
    _(
      () => import('./TextPreview-ChjYeLJ1.js'),
      __vite__mapDeps([5, 1, 2, 0])
    ).then(a => ({ default: a.TextPreview }))
  ),
  T = () =>
    e.jsxs('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: 'rgba(255, 255, 255, 0.7)'
      },
      children: [
        e.jsx('div', {
          style: {
            width: '24px',
            height: '24px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid rgba(255,255,255,0.7)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '12px'
          }
        }),
        'Loading preview...',
        e.jsx('style', {
          children: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
        })
      ]
    }),
  Nt = ({ isOpen: a, onClose: n, type: o, content: t, nodeLabel: r }) => {
    const s = () => {
        switch (o) {
        case 'image':
          return e.jsx(u.Suspense, {
            fallback: e.jsx(T, {}),
            children: e.jsx(St, { data: t, isExpanded: !0 })
          });
        case 'video':
          return e.jsx(u.Suspense, {
            fallback: e.jsx(T, {}),
            children: e.jsx(Ct, { data: t, isExpanded: !0 })
          });
        case 'audio':
          return e.jsx(u.Suspense, {
            fallback: e.jsx(T, {}),
            children: e.jsx(Et, { data: t, isExpanded: !0 })
          });
        case 'script':
          return e.jsx(u.Suspense, {
            fallback: e.jsx(T, {}),
            children: e.jsx(J, { data: t, type: 'script', isExpanded: !0 })
          });
        case 'prompt':
          return e.jsx(u.Suspense, {
            fallback: e.jsx(T, {}),
            children: e.jsx(J, { data: t, type: 'prompt', isExpanded: !0 })
          });
        case 'text':
          return e.jsx(u.Suspense, {
            fallback: e.jsx(T, {}),
            children: e.jsx(J, { data: t, type: 'text', isExpanded: !0 })
          });
        default:
          return e.jsx('div', {
            style: { color: 'rgba(255, 255, 255, 0.7)' },
            children: 'Preview not available for this type'
          });
        }
      },
      i = () => {
        switch (o) {
        case 'script':
          return 'Script';
        case 'prompt':
          return 'Prompt';
        default:
          return o.charAt(0).toUpperCase() + o.slice(1);
        }
      };
    return e.jsx(Pe, {
      isOpen: a,
      onClose: n,
      title: `${i()} Output`,
      subtitle: r ? `from ${r}` : void 0,
      className: 'node-output-overlay',
      children: s()
    });
  },
  ae = u.memo(({ type: a, position: n, isConnectable: o, className: t }) =>
    e.jsx(Ke, { type: a, position: n, isConnectable: o, className: t })
  ),
  Ie = u.memo(({ icon: a, isHovered: n }) =>
    e.jsxs('div', {
      className: `gradient-node-icon gradient-node-icon-3d ${n ? 'hover' : ''}`,
      children: [
        e.jsx('div', { className: 'gradient-node-icon-highlight' }),
        e.jsx('div', { className: 'gradient-node-icon-shadow' }),
        e.jsx('div', { className: 'gradient-node-icon-content', children: a })
      ]
    })
  ),
  Me = u.memo(({ title: a, description: n, children: o }) =>
    e.jsx('div', {
      className: 'gradient-node-content',
      children: e.jsxs('div', {
        className: 'gradient-node-info',
        children: [
          a && e.jsx('h3', { className: 'gradient-node-title', children: a }),
          n &&
            e.jsx('p', { className: 'gradient-node-description', children: n }),
          o
        ]
      })
    })
  ),
  _e = u.memo(
    ({
      children: a,
      icon: n,
      title: o,
      description: t,
      isConnectable: r = !0,
      showHandles: s = !0,
      showSourceHandle: i = !0,
      showTargetHandle: d = !0,
      className: l = '',
      nodeId: c = '',
      isHovered: g = !1,
      onHoverChange: p,
      executionState: f = 'idle',
      executionProgress: m = 0
    }) => {
      const b = u.useCallback(() => {
          p?.(c, !0);
        }, [c, p]),
        v = u.useCallback(() => {
          p?.(c, !1);
        }, [c, p]),
        k = u.useMemo(() => {
          const w = f !== 'idle' ? `node-${f}` : '';
          return `gradient-node-wrapper ${l} ${g ? 'hovered' : ''} ${w}`;
        }, [l, g, f]);
      return e.jsxs(e.Fragment, {
        children: [
          s &&
            d &&
            e.jsx(ae, {
              type: 'target',
              position: ce.Left,
              isConnectable: r,
              className: 'gradient-node-handle gradient-node-handle-left'
            }),
          e.jsxs('div', {
            className: k,
            onMouseEnter: b,
            onMouseLeave: v,
            children: [
              e.jsx('div', { className: 'gradient-node-glass' }),
              e.jsx('div', { className: 'gradient-node-bg' }),
              e.jsx('div', { className: 'gradient-node-noise' }),
              e.jsx('div', {
                className: 'gradient-node-glow gradient-node-glow-1'
              }),
              e.jsx('div', {
                className: 'gradient-node-glow gradient-node-glow-2'
              }),
              e.jsx('div', {
                className: `gradient-node-border-glow ${g ? 'hover' : ''}`
              }),
              e.jsx('div', {
                className: 'gradient-node-accent gradient-node-accent-left'
              }),
              e.jsx('div', {
                className: 'gradient-node-accent gradient-node-accent-right'
              }),
              n && e.jsx(Ie, { icon: n, isHovered: g }),
              f !== 'idle' &&
                e.jsxs('div', {
                  className: `gradient-node-status ${f}`,
                  children: [
                    f === 'executing' && `Running... ${Math.round(m)}%`,
                    f === 'completed' && 'Done',
                    f === 'failed' && 'Failed',
                    f === 'pending' && 'Waiting'
                  ]
                }),
              e.jsx(Me, { title: o, description: t, children: a }),
              f === 'executing' &&
                m > 0 &&
                e.jsx('div', {
                  className: 'gradient-node-progress',
                  children: e.jsx('div', {
                    className: 'gradient-node-progress-bar',
                    style: { width: `${m}%` }
                  })
                })
            ]
          }),
          s &&
            i &&
            e.jsx(ae, {
              type: 'source',
              position: ce.Right,
              isConnectable: r,
              className: 'gradient-node-handle gradient-node-handle-right'
            })
        ]
      });
    }
  );
_e.displayName = 'OptimizedGradientNodeWrapper';
ae.displayName = 'NodeHandle';
Ie.displayName = 'NodeIcon';
Me.displayName = 'NodeContent';
const Pt = a => {
    switch (a) {
    case 'image':
      return e.jsx(Se, { size: 24 });
    case 'video':
      return e.jsx(je, { size: 24 });
    case 'audio':
      return e.jsx(ke, { size: 24 });
    case 'text':
      return e.jsx(we, { size: 24 });
    default:
      return e.jsx(ct, { size: 24 });
    }
  },
  Te = M.memo(({ type: a, position: n, index: o, onClick: t }) => {
    const r = o % 2,
      s = o % 5;
    return e.jsx('div', {
      className: 'preview-blob',
      'data-float': r,
      style: { '--blob-index': o, left: `${n.x}px`, top: `${n.y}px` },
      onClick: i => {
        (i.stopPropagation(), t());
      },
      children: e.jsx('div', {
        className: 'preview-blob-animator',
        children: e.jsx('div', {
          className: `preview-blob-inner blob-gradient-${s}`,
          children: e.jsx('span', { className: 'blob-icon', children: Pt(a) })
        })
      })
    });
  });
Te.displayName = 'OptimizedPreviewBlob';
const D = ({
    label: a,
    value: n,
    onChange: o,
    options: t,
    marginBottom: r = '16px'
  }) =>
    e.jsxs('div', {
      className: 'gradient-dropdown',
      style: { marginBottom: r },
      children: [
        e.jsx('label', { className: 'gradient-dropdown-label', children: a }),
        e.jsx('select', {
          className: 'gradient-dropdown-select',
          value: n,
          onChange: s => {
            const i = s.target.value,
              d = t.every(l => typeof l.value === 'number');
            o(d ? Number(i) : i);
          },
          children: t.map(s =>
            e.jsx('option', { value: s.value, children: s.label }, s.value)
          )
        })
      ]
    }),
  It = [
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 45, label: '45 seconds' }
  ],
  Mt = [
    { value: '16:9', label: '16:9 (YouTube)' },
    { value: '9:16', label: '9:16 (TikTok/Reels)' }
  ],
  _t = [
    { value: 'viral-explainer', label: 'Viral Explainer' },
    { value: 'storytime', label: 'Storytime' },
    { value: 'educational', label: 'Educational' },
    { value: 'life-hacks', label: 'Life Hacks' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'dark-truth', label: 'Dark Truth/Conspiracy' },
    { value: 'comedy-roast', label: 'Comedy/Roast' },
    { value: 'drama-tea', label: 'Drama/Tea Spill' },
    { value: 'finance-hustle', label: 'Finance/Hustle' },
    { value: 'dating-advice', label: 'Dating/Relationships' }
  ],
  Tt = [
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'anime', label: 'Anime/Manga' },
    { value: 'dark-fantasy', label: 'Dark Fantasy' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'retro', label: 'Retro/Vintage' },
    { value: 'surreal', label: 'Surreal/Dream' },
    { value: 'realistic', label: 'Realistic/Photo' },
    { value: 'flat-design', label: 'Flat Design' },
    { value: 'silhouette', label: 'Silhouette' },
    { value: 'isometric', label: 'Isometric' },
    { value: 'line-art', label: 'Line Art' },
    { value: 'duotone', label: 'Duotone' },
    { value: 'abstract-geometric', label: 'Abstract Geometric' },
    { value: 'bauhaus', label: 'Bauhaus' },
    { value: 'liminal', label: 'Liminal Space' },
    { value: 'analog-horror', label: 'Analog Horror' },
    { value: 'stark-horror', label: 'Stark Horror' },
    { value: 'vaporwave', label: 'Vaporwave' },
    { value: 'deep-fried', label: 'Deep Fried' },
    { value: 'y2k-digital', label: 'Y2K Digital' },
    { value: 'storybook', label: 'Storybook' },
    { value: 'comic-noir', label: 'Comic Noir' },
    { value: 'puppet-theater', label: 'Puppet Theater' },
    { value: 'diorama', label: 'Diorama' },
    { value: 'security-cam', label: 'Security Cam' },
    { value: 'night-vision', label: 'Night Vision' },
    { value: 'trail-cam', label: 'Trail Cam' },
    { value: 'classified', label: 'Classified' },
    { value: 'old-newsreel', label: 'Old Newsreel' },
    { value: 'super-8', label: 'Super 8' },
    { value: 'polaroid-horror', label: 'Polaroid Horror' },
    { value: 'thermal', label: 'Thermal Imaging' }
  ],
  Rt = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'italian', label: 'Italian' },
    { value: 'dutch', label: 'Dutch' },
    { value: 'polish', label: 'Polish' },
    { value: 'russian', label: 'Russian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'chinese-simplified', label: 'Chinese (Simplified)' },
    { value: 'chinese-traditional', label: 'Chinese (Traditional)' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'turkish', label: 'Turkish' },
    { value: 'romanian', label: 'Romanian' },
    { value: 'greek', label: 'Greek' },
    { value: 'czech', label: 'Czech' },
    { value: 'finnish', label: 'Finnish' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'thai', label: 'Thai' },
    { value: 'indonesian', label: 'Indonesian' }
  ],
  Dt = ({ isOpen: a, onClose: n, onSave: o, initialData: t }) => {
    const [r, s] = u.useState(t?.idea || ''),
      [i, d] = u.useState(t?.duration || 30),
      [l, c] = u.useState(t?.aspectRatio || '16:9'),
      [g, p] = u.useState(t?.style || 'viral-explainer'),
      [f, m] = u.useState(t?.visualStyle || 'cinematic'),
      [b, v] = u.useState(t?.language || 'english'),
      k = u.useRef(null);
    u.useEffect(() => {
      a && k.current && k.current.focus();
    }, [a]);
    const w = () => {
      r.trim() &&
        (o({
          idea: r.trim(),
          duration: i,
          aspectRatio: l,
          style: g,
          visualStyle: f,
          language: b
        }),
        n());
    };
    return e.jsxs(Pe, {
      isOpen: a,
      onClose: n,
      title: 'Video Idea',
      width: '420px',
      showCloseButton: !1,
      className: 'user-prompt-overlay',
      children: [
        e.jsxs('div', {
          style: { marginBottom: '20px' },
          children: [
            e.jsx('label', {
              className: 'gradient-dropdown-label',
              style: { marginBottom: '8px', display: 'block' },
              children: "What's your video about?"
            }),
            e.jsx('textarea', {
              ref: k,
              value: r,
              onChange: x => s(x.target.value),
              placeholder: 'Enter your video idea...',
              style: {
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(172, 92, 255, 0.2)',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.3s ease'
              },
              onFocus: x => {
                ((x.target.style.borderColor = 'rgba(172, 92, 255, 0.5)'),
                (x.target.style.boxShadow =
                    '0 0 0 2px rgba(172, 92, 255, 0.2), 0 0 40px rgba(172, 92, 255, 0.3)'));
              },
              onBlur: x => {
                ((x.target.style.borderColor = 'rgba(172, 92, 255, 0.2)'),
                (x.target.style.boxShadow = 'none'));
              }
            })
          ]
        }),
        e.jsx(D, {
          label: 'Video Duration',
          value: i,
          onChange: x => d(x),
          options: It
        }),
        e.jsx(D, {
          label: 'Aspect Ratio',
          value: l,
          onChange: x => c(x),
          options: Mt
        }),
        e.jsx(D, {
          label: 'Content Style',
          value: g,
          onChange: x => p(x),
          options: _t
        }),
        e.jsx(D, {
          label: 'Visual Style',
          value: f,
          onChange: x => m(x),
          options: Tt
        }),
        e.jsx(D, {
          label: 'Language',
          value: b,
          onChange: x => v(x),
          options: Rt,
          marginBottom: '24px'
        }),
        e.jsxs('div', {
          style: { display: 'flex', gap: '12px' },
          children: [
            e.jsx('button', {
              onClick: n,
              style: {
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              },
              onMouseEnter: x => {
                ((x.currentTarget.style.background =
                  'rgba(255, 255, 255, 0.08)'),
                (x.currentTarget.style.borderColor =
                    'rgba(255, 255, 255, 0.2)'));
              },
              onMouseLeave: x => {
                ((x.currentTarget.style.background =
                  'rgba(255, 255, 255, 0.05)'),
                (x.currentTarget.style.borderColor =
                    'rgba(255, 255, 255, 0.1)'));
              },
              children: 'Cancel'
            }),
            e.jsx('button', {
              onClick: w,
              disabled: !r.trim(),
              style: {
                flex: 1,
                padding: '12px',
                background: r.trim()
                  ? 'linear-gradient(135deg, rgba(172, 92, 255, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)'
                  : 'rgba(172, 92, 255, 0.2)',
                border: '1px solid transparent',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: r.trim() ? 'pointer' : 'not-allowed',
                opacity: r.trim() ? 1 : 0.5,
                transition: 'all 0.2s ease'
              },
              onMouseEnter: x => {
                r.trim() &&
                  ((x.currentTarget.style.transform = 'translateY(-1px)'),
                  (x.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(172, 92, 255, 0.4)'));
              },
              onMouseLeave: x => {
                ((x.currentTarget.style.transform = 'translateY(0)'),
                (x.currentTarget.style.boxShadow = 'none'));
              },
              children: 'Save'
            })
          ]
        })
      ]
    });
  },
  se = ({
    label: a,
    value: n,
    onChange: o,
    options: t,
    disabled: r = !1,
    loading: s = !1,
    loadingText: i = 'Loading...',
    marginBottom: d = '16px',
    showDescription: l = !0,
    additionalInfo: c
  }) => {
    const g = t.find(m => m.value === n),
      p = m => {
        m.stopPropagation();
      },
      f = m => {
        m.stopPropagation();
        const b = m.target.value,
          v = t.find(k => String(k.value) === b);
        v && o(v.value);
      };
    return e.jsxs('div', {
      className: 'gradient-dropdown',
      style: { marginBottom: d },
      onClick: p,
      children: [
        e.jsx('label', { className: 'gradient-dropdown-label', children: a }),
        e.jsx('select', {
          className: 'gradient-dropdown-select',
          value: n,
          onChange: f,
          disabled: r || s,
          onClick: p,
          children: s
            ? e.jsx('option', { children: i })
            : t.map(m =>
              e.jsx('option', { value: m.value, children: m.label }, m.value)
            )
        }),
        !s &&
          g &&
          (l || c) &&
          e.jsxs('div', {
            className: 'gradient-dropdown-info',
            children: [
              l &&
                g.description &&
                e.jsx('div', {
                  className: 'gradient-dropdown-description',
                  children: g.description
                }),
              g.info,
              c
            ]
          })
      ]
    });
  },
  Lt = ({ value: a, onChange: n, disabled: o = !1 }) => {
    const [t, r] = u.useState([]),
      [s, i] = u.useState(!0);
    u.useEffect(() => {
      async function c() {
        try {
          const g = await L.listLLMModels();
          r(g);
        } catch (g) {
          O.error('Failed to fetch models:', g);
        } finally {
          i(!1);
        }
      }
      c();
    }, []);
    const d = 'anthropic/claude-sonnet-4',
      l = t.map(c => ({
        value: c.id,
        label: c.name,
        description: c.description,
        info:
          c.pricing &&
          e.jsx('div', {
            className: 'gradient-dropdown-cost',
            children: `${c.pricing.currency} ${c.pricing.amount} ${c.pricing.unit}`
          })
      }));
    return e.jsx(se, {
      label: 'AI Model',
      value: a || d,
      onChange: c => n(c),
      options: l,
      disabled: o,
      loading: s,
      loadingText: 'Loading models...'
    });
  },
  Ot = {
    image: [
      {
        id: 'replicate-flux',
        name: 'Flux (via Replicate)',
        description: 'High quality image generation'
      },
      {
        id: 'replicate-sdxl',
        name: 'SDXL (via Replicate)',
        description: 'Fast and versatile'
      }
    ],
    caption: [
      {
        id: 'workflow-captions',
        name: 'Workflow Captions',
        description: 'Generated via workflow system'
      }
    ],
    audio: [
      {
        id: 'resemble-ai',
        name: 'Resemble AI',
        description: 'Professional voice synthesis'
      }
    ]
  },
  At = ({
    value: a,
    onChange: n,
    disabled: o = !1,
    mediaType: t,
    aspectRatio: r,
    modelFromParameters: s
  }) => {
    const [i, d] = u.useState([]),
      [l, c] = u.useState(!1);
    u.useEffect(() => {
      (t === 'video' || t === 'image') &&
        (c(!0),
        (t === 'video' ? L.listVideoModels() : L.listImageModels())
          .then(v => {
            d(v);
          })
          .catch(v => {
            O.error(`Failed to fetch ${t} models:`, v);
          })
          .finally(() => {
            c(!1);
          }));
    }, [t]);
    const p = (
        t === 'video' || t === 'image'
          ? i.map(b => ({
            id: b.id,
            name: b.name,
            description: b.description || ''
          }))
          : Ot[t] || []
      ).map(b => ({ value: b.id, label: b.name, description: b.description })),
      f = (t === 'video' || t === 'image') && s ? s : a,
      m = t === 'video' ? 'bytedance/seedance-1-lite' : p[0]?.value;
    return e.jsx(se, {
      label: 'Media Provider',
      value: f || m || '',
      onChange: b => n(b),
      options: p,
      disabled: o,
      loading: l,
      loadingText: 'Loading models...',
      additionalInfo:
        (t === 'image' || t === 'video') && r
          ? e.jsx('div', { className: 'gradient-dropdown-cost', children: r })
          : void 0
    });
  },
  zt = [
    {
      value: 'Wise_Woman',
      label: 'Wise Woman',
      description: 'Mature female voice'
    },
    {
      value: 'Friendly_Person',
      label: 'Friendly Person',
      description: 'Warm neutral voice'
    },
    {
      value: 'Inspirational_girl',
      label: 'Inspirational Girl',
      description: 'Uplifting female voice'
    },
    {
      value: 'Deep_Voice_Man',
      label: 'Deep Voice Man',
      description: 'Deep male voice'
    },
    {
      value: 'Calm_Woman',
      label: 'Calm Woman',
      description: 'Soothing female voice'
    },
    {
      value: 'Casual_Guy',
      label: 'Casual Guy',
      description: 'Relaxed male voice'
    },
    {
      value: 'Lively_Girl',
      label: 'Lively Girl',
      description: 'Energetic female voice'
    },
    {
      value: 'Patient_Man',
      label: 'Patient Man',
      description: 'Steady male voice'
    },
    {
      value: 'Young_Knight',
      label: 'Young Knight',
      description: 'Heroic male voice'
    },
    {
      value: 'Determined_Man',
      label: 'Determined Man',
      description: 'Strong male voice'
    },
    {
      value: 'Lovely_Girl',
      label: 'Lovely Girl',
      description: 'Sweet female voice'
    },
    {
      value: 'Decent_Boy',
      label: 'Decent Boy',
      description: 'Pleasant male voice'
    },
    {
      value: 'Imposing_Manner',
      label: 'Imposing Manner',
      description: 'Authoritative voice'
    },
    {
      value: 'Elegant_Man',
      label: 'Elegant Man',
      description: 'Refined male voice'
    },
    { value: 'Abbess', label: 'Abbess', description: 'Wise female voice' },
    {
      value: 'Sweet_Girl_2',
      label: 'Sweet Girl 2',
      description: 'Gentle female voice'
    },
    {
      value: 'Exuberant_Girl',
      label: 'Exuberant Girl',
      description: 'Enthusiastic female voice'
    }
  ],
  Ft = ({ value: a, onChange: n, disabled: o = !1 }) =>
    e.jsx(se, {
      label: 'Voice Selection',
      value: a,
      onChange: t => n(t),
      options: zt,
      disabled: o
    }),
  Q = [
    {
      value: 'Archivo Black',
      label: 'Archivo Black',
      description: 'Ultra bold, perfect for social media'
    },
    {
      value: 'Bebas Neue',
      label: 'Bebas Neue',
      description: 'Bold, condensed, trendy on TikTok'
    },
    {
      value: 'Impact',
      label: 'Impact',
      description: 'Classic meme font, instant attention'
    },
    {
      value: 'Oswald',
      label: 'Oswald',
      description: 'Modern condensed, great for vertical videos'
    },
    {
      value: 'Rubik Bold',
      label: 'Rubik Bold',
      description: 'Rounded, friendly but bold'
    }
  ],
  Wt = 'Archivo Black',
  ee = [
    {
      value: 'bottom',
      label: 'Bottom',
      description: 'Captions appear at the bottom of the video'
    },
    {
      value: 'middle',
      label: 'Middle',
      description: 'Captions appear in the middle of the video'
    },
    {
      value: '60percent',
      label: 'Lower Third (60%)',
      description: 'Captions appear 60% down from the top'
    }
  ],
  Vt = ({
    fontFamily: a = Wt,
    fontSize: n = 54,
    position: o = 'middle',
    embedInVideo: t = !0,
    onChange: r,
    disabled: s = !1
  }) => {
    const i = Q.find(l => l.value === a) || Q[0],
      d = ee.find(l => l.value === o) || ee[0];
    return e.jsxs('div', {
      className: 'gradient-dropdown-group',
      children: [
        e.jsxs('div', {
          className: 'gradient-dropdown',
          children: [
            e.jsx('label', {
              className: 'gradient-dropdown-label',
              children: 'Caption Font'
            }),
            e.jsx('select', {
              className: 'gradient-dropdown-select nodrag',
              value: a,
              onChange: l => r({ fontFamily: l.target.value }),
              disabled: s,
              children: Q.map(l =>
                e.jsx('option', { value: l.value, children: l.label }, l.value)
              )
            }),
            i.description &&
              e.jsx('div', {
                className: 'gradient-dropdown-info',
                children: e.jsx('div', {
                  className: 'gradient-dropdown-description',
                  children: i.description
                })
              })
          ]
        }),
        e.jsxs('div', {
          className: 'gradient-dropdown',
          style: { marginTop: '12px' },
          children: [
            e.jsx('label', {
              className: 'gradient-dropdown-label',
              children: 'Font Size'
            }),
            e.jsxs('div', {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                e.jsx('input', {
                  type: 'range',
                  min: '40',
                  max: '80',
                  value: n,
                  onChange: l => r({ fontSize: parseInt(l.target.value) }),
                  onMouseDown: l => l.stopPropagation(),
                  onTouchStart: l => l.stopPropagation(),
                  disabled: s,
                  style: {
                    flex: 1,
                    height: '4px',
                    background: 'rgba(172, 92, 255, 0.2)',
                    borderRadius: '2px',
                    outline: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer'
                  },
                  className: 'gradient-slider nodrag'
                }),
                e.jsxs('span', {
                  style: {
                    minWidth: '40px',
                    textAlign: 'right',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  children: [n, 'px']
                })
              ]
            })
          ]
        }),
        e.jsxs('div', {
          className: 'gradient-dropdown',
          style: { marginTop: '12px' },
          children: [
            e.jsx('label', {
              className: 'gradient-dropdown-label',
              children: 'Caption Position'
            }),
            e.jsx('select', {
              className: 'gradient-dropdown-select nodrag',
              value: o,
              onChange: l => r({ position: l.target.value }),
              disabled: s,
              children: ee.map(l =>
                e.jsx('option', { value: l.value, children: l.label }, l.value)
              )
            }),
            d.description &&
              e.jsx('div', {
                className: 'gradient-dropdown-info',
                children: e.jsx('div', {
                  className: 'gradient-dropdown-description',
                  children: d.description
                })
              })
          ]
        }),
        e.jsxs('div', {
          className: 'gradient-dropdown',
          style: { marginTop: '12px' },
          children: [
            e.jsxs('label', {
              className: 'gradient-dropdown-label',
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                e.jsx('input', {
                  type: 'checkbox',
                  checked: t,
                  onChange: l => r({ embedInVideo: l.target.checked }),
                  disabled: s,
                  className: 'nodrag',
                  style: {
                    width: '16px',
                    height: '16px',
                    accentColor: '#ac5cff',
                    cursor: 'pointer'
                  }
                }),
                'Embed captions in video'
              ]
            }),
            e.jsx('div', {
              className: 'gradient-dropdown-info',
              children: e.jsx('div', {
                className: 'gradient-dropdown-description',
                children: t
                  ? 'Captions will be permanently embedded in the video file'
                  : 'Captions will be saved as a separate file (.vtt)'
              })
            })
          ]
        })
      ]
    });
  },
  Re = 200,
  Bt = 100,
  A = 48,
  ue = 120,
  te = 200,
  pe = 200,
  ge = A + 10,
  Gt = -Math.PI / 2,
  Ht = Math.PI / 3,
  $t = 100,
  qt = 20,
  me = 0.3,
  De = (a, n) => Math.sqrt(a * a + n * n),
  ne = (a, n) => Math.atan2(a, n),
  Zt = a => ({ x: a.x + a.width / 2, y: a.y + a.height / 2 }),
  fe = (a, n) => Math.max(-n, Math.min(n, a)),
  Ut = a =>
    a.map(n => ({ x: n.position.x, y: n.position.y, width: Re, height: Bt })),
  Yt = (a, n) => {
    const o = Gt + (a - (n - 1) / 2) * (Ht / Math.max(n - 1, 1)),
      t = $t + (a % 2) * qt,
      r = Math.cos(o) * t + Re / 2 - A / 2,
      s = Math.sin(o) * t - A / 2;
    return { x: r, y: s };
  },
  Xt = (a, n, o) => {
    const t = Zt(n),
      r = a.x - t.x,
      s = a.y - t.y,
      i = De(r, s);
    if (o && i < ue) {
      const d = ne(s, r),
        l = ue - i;
      return { x: Math.cos(d) * l, y: Math.sin(d) * l };
    }
    if (!o && i < te) {
      const d = Math.pow(te - i, 2) / te,
        l = ne(s, r);
      return { x: Math.cos(l) * d * me, y: Math.sin(l) * d * me };
    }
    return { x: 0, y: 0 };
  },
  Kt = a => {
    for (let n = 0; n < a.length; n++) {
      for (let o = n + 1; o < a.length; o++) {
        const t = a[o].x - a[n].x,
          r = a[o].y - a[n].y,
          s = De(t, r);
        if (s < ge) {
          const i = ne(r, t),
            d = (ge - s) / 2;
          ((a[n].x -= Math.cos(i) * d),
          (a[n].y -= Math.sin(i) * d),
          (a[o].x += Math.cos(i) * d),
          (a[o].y += Math.sin(i) * d));
        }
      }
    }
  },
  Jt = (a, n) => {
    const { getNodes: o } = ve();
    return u.useMemo(() => {
      const r = o(),
        s = r.find(l => l.id === a);
      if (!s || n === 0) {
        return [];
      }
      const i = Ut(r),
        d = [];
      for (let l = 0; l < n; l++) {
        const c = Yt(l, n),
          g = { x: s.position.x + c.x + A / 2, y: s.position.y + c.y + A / 2 },
          p = { x: 0, y: 0 };
        (i.forEach((f, m) => {
          const b = r[m].id === a,
            v = Xt(g, f, b);
          ((p.x += v.x), (p.y += v.y));
        }),
        (c.x = fe(c.x + p.x, pe)),
        (c.y = fe(c.y + p.y, pe)),
        d.push(c));
      }
      return (Kt(d), d);
    }, [a, n, o]);
  },
  B = {
    script: we,
    enhance: ft,
    audio: mt,
    voice: gt,
    prompt: pt,
    image: Se,
    video: je,
    backgroundAudio: ke,
    caption: ut,
    compile: de,
    final: de,
    default: dt
  },
  Qt = [
    { key: 'audio', includes: ['audio'], excludes: ['voice'] },
    { key: 'image', includes: ['image'], excludes: ['prompt'] },
    { key: 'video', includes: ['video'], excludes: ['compile'] },
    { key: 'prompt', includes: ['prompt', 'image prompt'] }
  ],
  ea = a => {
    const n = a.toLowerCase();
    for (const { key: o, includes: t, excludes: r } of Qt) {
      const s = t.some(d => n.includes(d)),
        i = r?.some(d => n.includes(d)) ?? !1;
      if (s && !i && B[o]) {
        return B[o];
      }
    }
    for (const [o, t] of Object.entries(B)) {
      if (o !== 'default' && n.includes(o)) {
        return t;
      }
    }
    return B.default;
  },
  ta = ({ data: a, isConnectable: n, id: o }) => {
    const t = a,
      [r, s] = u.useState(!1),
      [i, d] = u.useState(!1),
      [l, c] = u.useState(!1),
      [g, p] = u.useState(null),
      { previews: f } = Ne(),
      m = f.filter(h => h.nodeId === o),
      b = Jt(o, m.length),
      v = u.useCallback(
        h => {
          t.onModelChange?.(h);
        },
        [t]
      ),
      k = u.useCallback(
        h => {
          t.onMediaChange?.(h);
        },
        [t]
      ),
      w = u.useCallback(
        h => {
          t.onVoiceChange?.(h);
        },
        [t]
      ),
      x = u.useCallback(() => {
        t.onDelete?.();
      }, [t]),
      j = u.useCallback(() => {
        s(!0);
      }, []),
      S = u.useCallback(() => {
        s(!1);
      }, []),
      E = u.useMemo(() => {
        const h = ea(t.label);
        return e.jsx(h, {});
      }, [t.label]),
      N = t.label === 'User Prompt';
    return e.jsxs('div', {
      style: { position: 'relative', paddingBottom: '45px' },
      onMouseEnter: j,
      onMouseLeave: S,
      children: [
        e.jsx('div', {
          style: {
            position: 'absolute',
            bottom: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            opacity: r ? 1 : 0,
            pointerEvents: r ? 'auto' : 'none',
            transition: 'opacity 0.2s ease'
          },
          children: e.jsx(kt, { onClick: x })
        }),
        e.jsxs(_e, {
          icon: E,
          title: t.label,
          description: t.description,
          isConnectable: n,
          isHovered: r,
          executionState: t.executionState,
          executionProgress: t.executionProgress,
          children: [
            t.hasModel &&
              e.jsx('div', {
                className: 'gradient-node-selector',
                children: e.jsx(Lt, {
                  value: t.modelId || '',
                  onChange: v,
                  nodeType: t.nodeType
                })
              }),
            t.hasMedia &&
              t.mediaType &&
              e.jsx(e.Fragment, {
                children: e.jsx('div', {
                  className: 'gradient-node-selector',
                  children:
                    t.mediaType === 'audio'
                      ? e.jsx(Ft, {
                        value:
                            t.voice || t.parameters?.voice || 'Friendly_Person',
                        onChange: w
                      })
                      : t.mediaType === 'caption'
                        ? e.jsx(Vt, {
                          fontFamily: t.parameters?.fontFamily,
                          fontSize: t.parameters?.fontSize,
                          position: t.parameters?.position,
                          embedInVideo: t.parameters?.embedInVideo,
                          onChange: h => {
                            t.onDataChange?.({
                              ...t,
                              parameters: { ...t.parameters, ...h }
                            });
                          }
                        })
                        : e.jsx(At, {
                          value: t.mediaId || '',
                          onChange: k,
                          mediaType: t.mediaType,
                          aspectRatio: t.parameters?.aspectRatio,
                          modelFromParameters: t.parameters?.model
                        })
                })
              }),
            N &&
              e.jsxs(e.Fragment, {
                children: [
                  t.userPromptData?.idea &&
                    e.jsxs('div', {
                      className: 'gradient-node-selector',
                      style: {
                        marginTop: '12px',
                        padding: '10px',
                        background: 'rgba(172, 92, 255, 0.05)',
                        border: '1px solid rgba(172, 92, 255, 0.2)',
                        borderRadius: '8px'
                      },
                      children: [
                        e.jsx('div', {
                          style: {
                            fontSize: '12px',
                            color: 'rgba(172, 92, 255, 0.8)',
                            marginBottom: '4px'
                          },
                          children: 'Video Idea:'
                        }),
                        e.jsx('div', {
                          style: {
                            fontSize: '13px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          },
                          children: t.userPromptData.idea
                        }),
                        e.jsxs('div', {
                          style: {
                            fontSize: '11px',
                            color: 'rgba(172, 92, 255, 0.8)',
                            display: 'flex',
                            gap: '12px'
                          },
                          children: [
                            e.jsxs('span', {
                              children: [t.userPromptData.duration, 's']
                            }),
                            e.jsx('span', {
                              children: t.userPromptData.aspectRatio
                            }),
                            e.jsx('span', { children: t.userPromptData.style }),
                            t.userPromptData.visualStyle &&
                              e.jsx('span', {
                                children: t.userPromptData.visualStyle
                              })
                          ]
                        })
                      ]
                    }),
                  e.jsx('div', {
                    className: 'gradient-node-selector',
                    style: { marginTop: '12px' },
                    children: e.jsxs('button', {
                      className: 'gradient-node-button',
                      onClick: h => {
                        (h.stopPropagation(), d(!0));
                      },
                      style: {
                        width: '100%',
                        padding: '10px 16px',
                        background: t.userPromptData?.idea
                          ? 'rgba(172, 92, 255, 0.05)'
                          : 'rgba(172, 92, 255, 0.1)',
                        border: '1px solid rgba(172, 92, 255, 0.3)',
                        borderRadius: '8px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      },
                      onMouseEnter: h => {
                        ((h.currentTarget.style.background =
                          'rgba(172, 92, 255, 0.2)'),
                        (h.currentTarget.style.borderColor =
                            'rgba(172, 92, 255, 0.5)'));
                      },
                      onMouseLeave: h => {
                        ((h.currentTarget.style.background = t.userPromptData
                          ?.idea
                          ? 'rgba(172, 92, 255, 0.05)'
                          : 'rgba(172, 92, 255, 0.1)'),
                        (h.currentTarget.style.borderColor =
                            'rgba(172, 92, 255, 0.3)'));
                      },
                      children: [
                        e.jsx('span', {
                          children: t.userPromptData?.idea ? '✏️' : '💡'
                        }),
                        t.userPromptData?.idea ? 'Edit Idea' : 'Add Idea'
                      ]
                    })
                  })
                ]
              })
          ]
        }),
        m.length > 0 &&
          e.jsx(ht.div, {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0, opacity: 0 },
            transition: { type: 'spring', stiffness: 400, damping: 25 },
            style: {
              position: 'absolute',
              right: '-3px',
              top: '-3px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#4f46e5',
              border: '2px solid #1e1b4b',
              zIndex: 15,
              cursor: 'pointer'
            },
            whileHover: { scale: 1.2, background: '#6366f1' }
          }),
        m.length > 0 &&
          e.jsxs(e.Fragment, {
            children: [
              e.jsxs('svg', {
                className: 'blob-connections',
                style: { shapeRendering: 'optimizeSpeed' },
                children: [
                  e.jsx('defs', {
                    children: e.jsxs('linearGradient', {
                      id: `blob-gradient-${o}`,
                      children: [
                        e.jsx('stop', {
                          offset: '0%',
                          stopColor: '#8b5cf6',
                          stopOpacity: '0.5'
                        }),
                        e.jsx('stop', {
                          offset: '100%',
                          stopColor: '#8b5cf6',
                          stopOpacity: '0.2'
                        })
                      ]
                    })
                  }),
                  e.jsx('g', {
                    stroke: `url(#blob-gradient-${o})`,
                    strokeWidth: '2',
                    fill: 'none',
                    opacity: '0.7',
                    children: m.map((h, P) => {
                      const I = b[P] || { x: 250, y: -120 - P * 60 };
                      return e.jsx(
                        'line',
                        { x1: '277', y1: '-3', x2: I.x + 28, y2: I.y + 28 },
                        h.id
                      );
                    })
                  })
                ]
              }),
              m.map((h, P) => {
                const I = b[P] || { x: 250, y: -120 - P * 60 };
                return e.jsx(
                  Te,
                  {
                    type: h.type,
                    position: I,
                    index: P,
                    onClick: () => {
                      (p({ ...h, blobPosition: I }), c(!0));
                    }
                  },
                  h.id
                );
              })
            ]
          }),
        N &&
          e.jsx(Dt, {
            isOpen: i,
            onClose: () => d(!1),
            onSave: h => {
              (t.onDataChange?.({
                ...t,
                userPromptData: h,
                parameters: {
                  idea: h.idea,
                  duration: h.duration,
                  aspectRatio: h.aspectRatio,
                  style: h.style,
                  visualStyle: h.visualStyle,
                  language: h.language
                }
              }),
              d(!1));
            },
            initialData: t.userPromptData
          }),
        g &&
          e.jsx(Nt, {
            isOpen: l,
            onClose: () => {
              (c(!1), p(null));
            },
            type: g.type,
            content: g.content,
            nodeLabel: t.label,
            blobPosition: g.blobPosition
          })
      ]
    });
  },
  aa = a => (a < 0.5 ? 4 * a * a * a : 1 - Math.pow(-2 * a + 2, 3) / 2);
function na(a) {
  const n = new Map();
  return (
    a.forEach(o => {
      n.set(o.id, { ...o.position });
    }),
    n
  );
}
function oa(a, n, o) {
  return { x: a.x + (n.x - a.x) * o, y: a.y + (n.y - a.y) * o };
}
function ra(a, n, o) {
  const t = aa(o);
  return a.map(r => {
    const s = n.get(r.id) || r.position,
      i = r.position;
    return { ...r, position: oa(s, i, t) };
  });
}
function sa(a, n, o) {
  return Math.min((a - n) / o, 1);
}
function ia(a, n, o) {
  const { width: t, height: r } = o;
  return !(
    a.position.x + t < n.position.x ||
    n.position.x + t < a.position.x ||
    a.position.y + r < n.position.y ||
    n.position.y + r < a.position.y
  );
}
function la(a, n = { width: 280, height: 120 }) {
  const o = [];
  for (let t = 0; t < a.length; t++) {
    for (let r = t + 1; r < a.length; r++) {
      const s = a[t],
        i = a[r];
      ia(s, i, n) && o.push({ node1: s.id, node2: i.id });
    }
  }
  return o;
}
const ca = {
  nodeWidth: 280,
  nodeHeight: 120,
  horizontalSpacing: 150,
  verticalSpacing: 100,
  layerSpacing: 350
};
function da(a, n) {
  const o = new Map(),
    t = new Map();
  (a.forEach(i => {
    (o.set(i.id, []), t.set(i.id, 0));
  }),
  n.forEach(i => {
    const d = o.get(i.source) || [];
    (d.push(i.target),
    o.set(i.source, d),
    t.set(i.target, (t.get(i.target) || 0) + 1));
  }));
  const r = [],
    s = new Map();
  for (
    t.forEach((i, d) => {
      i === 0 && (r.push(d), s.set(d, 0));
    });
    r.length > 0;

  ) {
    const i = r.shift(),
      d = s.get(i) || 0;
    (o.get(i) || []).forEach(c => {
      const g = Math.max(s.get(c) || 0, d + 1);
      s.set(c, g);
      const p = (t.get(c) || 0) - 1;
      (t.set(c, p), p === 0 && r.push(c));
    });
  }
  return s;
}
function xe(a, n, o) {
  let t = 0;
  const r = o.filter(s => {
    const i = a.some(l => l.id === s.source),
      d = n.some(l => l.id === s.target);
    return i && d;
  });
  for (let s = 0; s < r.length; s++) {
    for (let i = s + 1; i < r.length; i++) {
      const d = r[s],
        l = r[i],
        c = a.findIndex(m => m.id === d.source),
        g = n.findIndex(m => m.id === d.target),
        p = a.findIndex(m => m.id === l.source),
        f = n.findIndex(m => m.id === l.target);
      ((c < p && g > f) || (c > p && g < f)) && t++;
    }
  }
  return t;
}
function ua(a, n, o = 10) {
  for (let t = 0; t < o; t++) {
    let r = !1;
    for (let s = 0; s < a.length - 1; s++) {
      const i = a[s].nodes,
        d = a[s + 1].nodes;
      for (let l = 0; l < i.length - 1; l++) {
        const c = xe(i, d, n);
        (([i[l], i[l + 1]] = [i[l + 1], i[l]]),
        xe(i, d, n) < c ? (r = !0) : ([i[l], i[l + 1]] = [i[l + 1], i[l]]));
      }
    }
    if (!r) {
      break;
    }
  }
}
const oe = {
    'User Prompt': { layer: 0, priority: 0 },
    'Script Generator': { layer: 1, priority: 0 },
    'Audio Generation': { layer: 2, priority: 0 },
    'Image Prompt Generator': { layer: 2, priority: 1 },
    'Image Generation': { layer: 3, priority: 1 },
    'Background Audio Generation': { layer: 3, priority: 0 },
    'Video Generation': { layer: 4, priority: 1 },
    'Video Editing': { layer: 5, priority: 0 },
    'Caption Generation': { layer: 6, priority: 0 },
    'Final Output': { layer: 7, priority: 0 }
  },
  pa = {
    user_prompt_node: 'User Prompt',
    script_node: 'Script Generator',
    audio_gen_node: 'Audio Generation',
    image_prompt_node: 'Image Prompt Generator',
    image_gen_node: 'Image Generation',
    background_audio_gen_node: 'Background Audio Generation',
    video_gen_node: 'Video Generation',
    editing_node: 'Video Editing',
    caption_gen_node: 'Caption Generation',
    final_output_node: 'Final Output'
  };
function re(a) {
  const n = pa[a.id];
  if (n) {
    return n;
  }
  if (a.data?.label) {
    return a.data.label;
  }
}
function ga(a) {
  const n = new Map(),
    o = [];
  return (
    a.forEach(t => {
      const r = re(t),
        s = r ? oe[r] : void 0;
      s
        ? (n.has(s.layer) || n.set(s.layer, []), n.get(s.layer).push(t))
        : o.push(t);
    }),
    { layers: n, unplaced: o }
  );
}
function ma(a) {
  return a.sort((n, o) => {
    const t = re(n),
      r = re(o),
      s = (t && oe[t]?.priority) || 0,
      i = (r && oe[r]?.priority) || 0;
    return s - i;
  });
}
function fa(a, n, o, t, r) {
  const s = o + n * t;
  let d = 300 - (a.length * 120 + (a.length - 1) * r) / 2;
  return a.map(l => {
    const c = { ...l, position: { x: s, y: d } };
    return ((d += 120 + r), c);
  });
}
function xa(a, n) {
  const { layers: s, unplaced: i } = ga(a),
    d = [];
  return (
    s.forEach((l, c) => {
      const g = ma(l),
        p = fa(g, c, 100, 350, 150);
      d.push(...p);
    }),
    d.push(...i),
    d
  );
}
function ba(a, n, o) {
  const t = new Map();
  return (
    a.forEach(r => {
      const s = o.get(r.id) || 0,
        i = n.filter(p => p.target === r.id).map(p => p.source),
        d = n.filter(p => p.source === r.id).map(p => p.target),
        l = [...i].sort((p, f) => p.localeCompare(f)),
        c = [...d].sort((p, f) => p.localeCompare(f)),
        g = `${s}-${l.join(',')}-${c.join(',')}`;
      (t.has(g) || t.set(g, []), t.get(g).push(r.id));
    }),
    t
  );
}
function ha(a, n, o = {}) {
  const t = { ...ca, ...o },
    r = da(a, n),
    s = [],
    i = Math.max(...Array.from(r.values()));
  for (let c = 0; c <= i; c++) {
    const g = a.filter(p => r.get(p.id) === c);
    s.push({ nodes: g, minY: 0, maxY: 0 });
  }
  const d = ba(a, n, r);
  ua(s, n);
  const l = new Map();
  return (
    s.forEach((c, g) => {
      const p = g * t.layerSpacing + 100;
      let m =
        300 -
        (c.nodes.length * t.nodeHeight +
          (c.nodes.length - 1) * t.verticalSpacing) /
          2;
      (c.nodes.forEach((b, v) => {
        let k = 0;
        (d.forEach(w => {
          if (w.includes(b.id) && w.length > 1) {
            const x = w.indexOf(b.id);
            x > 0 && (k = x * 30);
          }
        }),
        l.set(b.id, { x: p + (v % 2) * 50, y: m + k }),
        (m += t.nodeHeight + t.verticalSpacing));
      }),
      c.nodes.length > 0 &&
          ((c.minY = l.get(c.nodes[0].id).y),
          (c.maxY = l.get(c.nodes[c.nodes.length - 1].id).y)));
    }),
    a.map(c => ({ ...c, position: l.get(c.id) || c.position }))
  );
}
const va = {
  animated: !0,
  duration: 300,
  fitView: !0,
  fitViewOptions: { padding: 0.2, maxZoom: 1, minZoom: 0.1 }
};
function ya(a = {}) {
  const n = { ...va, ...a },
    { animated: o, duration: t, fitView: r, fitViewOptions: s } = n,
    i = ve(),
    d = u.useRef(null),
    l = u.useRef(!1);
  u.useEffect(
    () => () => {
      d.current && cancelAnimationFrame(d.current);
    },
    []
  );
  const c = u.useCallback(() => {
      r && setTimeout(() => i.fitView(s), 50);
    }, [r, s, i]),
    g = u.useCallback(
      (w, x, j) => {
        let S = null;
        const E = N => {
          S || (S = N);
          const h = sa(N, S, t),
            P = ra(w, x, h);
          (i.setNodes(P),
          h < 1
            ? (d.current = requestAnimationFrame(E))
            : ((d.current = null), c(), j?.()));
        };
        d.current = requestAnimationFrame(E);
      },
      [t, i, c]
    ),
    p = u.useCallback(
      (w, x, j) => {
        if (!o) {
          (i.setNodes(w), c(), j?.());
          return;
        }
        const S = na(x);
        g(w, S, j);
      },
      [o, i, c, g]
    ),
    f = u.useCallback(
      (w, x) => {
        const j = ha(w, x, {
          nodeWidth: 280,
          nodeHeight: 120,
          horizontalSpacing: 150,
          verticalSpacing: 150,
          layerSpacing: 350
        });
        return (p(j, w), j);
      },
      [p]
    ),
    m = u.useCallback(() => {
      d.current && (cancelAnimationFrame(d.current), (d.current = null));
    }, []),
    b = u.useCallback(
      (w, x) => {
        if ((m(), l.current)) {
          return;
        }
        l.current = !0;
        const j = i.getNodes(),
          S = xa(j);
        return (
          p(S, j, () => {
            l.current = !1;
          }),
          S
        );
      },
      [i, p, m]
    ),
    v = u.useCallback(w => la(w), []),
    k = u.useCallback(
      (w, x) =>
        w.map(j => ({
          ...j,
          type: 'smoothstep',
          pathOptions: { offset: 20, borderRadius: 10 }
        })),
      []
    );
  return {
    autoArrange: f,
    optimizeVideoLayout: b,
    detectOverlaps: v,
    routeEdgesAroundNodes: k,
    cancelAnimation: m
  };
}
const wa = ({ reactFlowInstance: a, handleAddNode: n }) => {
    const o = u.useCallback(r => {
        (r.preventDefault(), (r.dataTransfer.dropEffect = 'copy'));
      }, []),
      t = u.useCallback(
        r => {
          r.preventDefault();
          const s = r.dataTransfer.getData('nodeTemplate');
          if (!s || !a) {
            return;
          }
          const i = JSON.parse(s),
            d = a.screenToFlowPosition({ x: r.clientX, y: r.clientY });
          n({ ...i, position: d });
        },
        [a, n]
      );
    return { onDragOver: o, onDrop: t };
  },
  ka = ({
    nodes: a,
    edges: n,
    hoveredNodeId: o,
    nodeEventHandlers: t,
    handleModelChange: r,
    handleMediaChange: s,
    handleVoiceChange: i,
    handleExecuteWorkflow: d,
    deleteNode: l,
    updateNodeData: c,
    setNodes: g,
    addNodeFromTemplate: p,
    updateNodeParametersFromEdges: f,
    removeNodePreviews: m
  }) => {
    const b = u.useRef(a),
      v = u.useRef(n);
    ((b.current = a), (v.current = n));
    const k = u.useCallback(
        x => {
          const j = x.position || {
              x: 400 + Math.random() * 200,
              y: 200 + Math.random() * 200
            },
            S = p(x, j),
            E = { isHovered: o === S };
          if (
            (x.hasModel && (E.onModelChange = N => r(S, N)),
            x.hasMedia &&
              ((E.onMediaChange = N => s(S, N)), x.mediaType === 'audio'))
          ) {
            E.onVoiceChange = h => i(S, h);
            const N = x;
            E.voice = N.parameters?.voice || 'Orion';
          }
          (x.label === 'User Prompt' && (E.onExecute = d),
          (E.onDelete = () => l(S)),
          (E.onDataChange = N => {
            (c(S, N),
            x.label === 'User Prompt' &&
                  setTimeout(() => {
                    const h = b.current,
                      P = v.current,
                      I = f(h, P);
                    g(I);
                  }, 50));
          }),
          c(S, E));
        },
        [p, c, r, s, i, d, l, o, g, f]
      ),
      w = u.useCallback(
        x => {
          x.forEach(j => {
            (l(j.id), m(j.id));
          });
        },
        [l, m]
      );
    return { handleAddNode: k, onNodeDelete: w, nodesRef: b, edgesRef: v };
  },
  ja = () => ({
    updateNodeParametersFromEdges: u.useCallback(
      (n, o) =>
        n.map(r => {
          const s = o.filter(d => d.target === r.id);
          if (s.length === 0) {
            return r;
          }
          const i = { ...(r.data.parameters || {}) };
          return (
            s.forEach(d => {
              const l = n.find(p => p.id === d.source),
                c = d.data?.sourcePort,
                g = d.data?.targetPort;
              if (l && c && g) {
                const p = l.data?.parameters || {},
                  f = l.data?.userPromptData || {},
                  m = l.data || {},
                  b = p[c] || f[c] || m[c];
                b !== void 0 && (i[g] = b);
              }
            }),
            { ...r, data: { ...r.data, parameters: i } }
          );
        }),
      []
    )
  }),
  Sa = (a, n, o, t) => {
    const [r, s] = u.useState(new Map()),
      i = u.useCallback(c => {
        s(c);
      }, []),
      d = u.useCallback(() => {
        const c = new Map();
        (a.forEach(g => {
          c.set(g.id, { state: 'idle', progress: 0 });
        }),
        s(c));
      }, [a]),
      l = u.useCallback((c, g) => {
        s(p => {
          const f = new Map(p);
          return (f.set(c, g), f);
        });
      }, []);
    return (
      u.useEffect(() => {
        r.size !== 0 &&
          o(c =>
            c.map(g => {
              const p = r.get(g.id);
              return p
                ? {
                  ...g,
                  data: {
                    ...g.data,
                    executionState: p.state,
                    executionProgress: p.progress
                  }
                }
                : g;
            })
          );
      }, [r, o]),
      u.useEffect(() => {
        r.size !== 0 &&
          t(c =>
            c.map(g => {
              const p = r.get(g.source),
                f = r.get(g.target);
              let m = '';
              return (
                p?.state === 'executing' &&
                (f?.state === 'pending' || f?.state === 'executing')
                  ? (m = 'edge-active')
                  : p?.state === 'completed' && f?.state === 'completed'
                    ? (m = 'edge-completed')
                    : (p?.state === 'failed' || f?.state === 'failed') &&
                      (m = 'edge-failed'),
                { ...g, className: m }
              );
            })
          );
      }, [r, t]),
      {
        nodeExecutionStates: r,
        updateNodeStates: i,
        resetNodeStates: d,
        updateSingleNodeState: l
      }
    );
  },
  Ca = () => {
    const { addPreview: a, removeNodePreviews: n, clearAllPreviews: o } = Ne(),
      t = u.useCallback(s => {
        const i = s,
          d = i.label?.toLowerCase() || '',
          l = i.mediaType;
        return d.includes('image') && !d.includes('prompt')
          ? 'image'
          : d.includes('video') && !d.includes('compile')
            ? 'video'
            : d.includes('audio') || d.includes('background')
              ? 'audio'
              : d.includes('script') ||
                  d.includes('prompt') ||
                  d.includes('caption')
                ? 'text'
                : l === 'image'
                  ? 'image'
                  : l === 'video'
                    ? 'video'
                    : l === 'audio'
                      ? 'audio'
                      : null;
      }, []),
      r = u.useCallback(
        (s, i, d) => {
          const l = t(s.data);
          l && i && a(s.id, l, i, s.position, d);
        },
        [a, t]
      );
    return {
      addPreview: a,
      removeNodePreviews: n,
      clearAllPreviews: o,
      getPreviewTypeFromNodeData: t,
      handleNodeCompletion: r
    };
  },
  Ea = () => {
    const [a, n] = u.useState(!1),
      [o, t] = u.useState(null),
      [r, s] = u.useState(null),
      i = u.useCallback((g, p) => {
        (n(!0), s(g), t(p));
      }, []),
      d = u.useCallback(g => {
        (n(!1), t(g || null), s(null));
      }, []),
      l = u.useCallback(g => {
        t(g);
      }, []),
      c = u.useCallback(() => {
        t(null);
      }, []);
    return {
      isExecuting: a,
      executionStatus: o,
      executionId: r,
      startExecution: i,
      stopExecution: d,
      updateExecutionStatus: l,
      clearExecutionStatus: c
    };
  },
  Na = (a, n, o, t) => {
    const [r, s] = u.useState(a.length + 1),
      i = u.useCallback(
        (p, f) => {
          const m = r.toString(),
            b = {
              id: m,
              type: 'custom',
              position: f || {
                x: Math.random() * 500 + 100,
                y: Math.random() * 300 + 100
              },
              data: {
                label: p.label,
                description: p.description,
                icon: p.icon,
                hasModel: p.hasModel || !1,
                nodeType: p.nodeType,
                modelId: '',
                hasMedia: p.hasMedia || !1,
                mediaType: p.mediaType,
                mediaId: ''
              }
            };
          return (o(v => [...v, b]), s(v => v + 1), m);
        },
        [r, o]
      ),
      d = u.useCallback(
        p => {
          (o(f => f.filter(m => m.id !== p)),
          t(f => f.filter(m => m.source !== p && m.target !== p)));
        },
        [o, t]
      ),
      l = u.useCallback(
        p => {
          const f = {
            ...p,
            type: 'smoothstep',
            animated: !0,
            style: {
              stroke: 'url(#optimized-edge-gradient)',
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            },
            markerEnd: {
              type: Je.ArrowClosed,
              color: '#8b5cf6',
              width: 20,
              height: 20
            }
          };
          t(m => Qe(f, m));
        },
        [t]
      ),
      c = u.useCallback(
        (p, f) => {
          o(m =>
            m.map(b => {
              if (b.id === p) {
                const v =
                  f && typeof f === 'object' && !Array.isArray(f) ? f : {};
                return { ...b, data: { ...b.data, ...v } };
              }
              return b;
            })
          );
        },
        [o]
      ),
      g = u.useCallback(() => {
        (o([]), t([]));
      }, [o, t]);
    return {
      addNodeFromTemplate: i,
      deleteNode: d,
      onConnect: l,
      updateNodeData: c,
      clearWorkflow: g
    };
  };
function Pa({ children: a, size: n = 'sm', style: o, ...t }) {
  const [r, s] = u.useState(!1),
    i = {
      sm: { height: '32px', padding: '0 16px', fontSize: '12px' },
      default: { height: '36px', padding: '0 20px', fontSize: '14px' },
      lg: { height: '40px', padding: '0 24px', fontSize: '14px' }
    };
  return e.jsxs('button', {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50px',
      fontWeight: '600',
      color: '#ffffff',
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(10px) saturate(180%)',
      WebkitBackdropFilter: 'blur(10px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: r
        ? '0 8px 32px rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        : '0 4px 24px rgba(31, 38, 135, 0.27), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      transform: r ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
      ...i[n],
      ...o
    },
    onMouseEnter: () => s(!0),
    onMouseLeave: () => s(!1),
    ...t,
    children: [
      e.jsx('div', {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
          borderRadius: '50px 50px 0 0',
          pointerEvents: 'none'
        }
      }),
      e.jsx('div', {
        style: {
          position: 'absolute',
          inset: '-2px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: r ? 0.3 : 0,
          filter: 'blur(10px)',
          transition: 'opacity 0.3s',
          zIndex: -1,
          pointerEvents: 'none'
        }
      }),
      e.jsx('span', {
        style: { position: 'relative', zIndex: 1 },
        children: a
      })
    ]
  });
}
const Le = M.memo(
  ({
    isExecuting: a,
    executionId: n,
    handleExecuteWorkflow: o,
    handleStopWorkflow: t
  }) =>
    e.jsx('div', {
      style: {
        position: 'fixed',
        bottom: '23px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100
      },
      children: e.jsx(Pa, {
        size: 'lg',
        onClick: a ? t : o,
        disabled: a && !n,
        className: a ? 'bg-red-600 hover:bg-red-700' : '',
        children: a ? 'Stop Workflow' : 'Execute Workflow'
      })
    })
);
Le.displayName = 'ExecutionButton';
const be = a => a !== null && a.readyState === EventSource.OPEN,
  Ia = a =>
    a.success
      ? { state: 'completed', progress: 100 }
      : a.error
        ? { state: 'failed', progress: 50 }
        : { state: 'executing', progress: 50 },
  Ma = a => {
    const n = new Map();
    return (
      a.forEach(o => {
        const { state: t, progress: r } = Ia(o);
        n.set(o.nodeId, { state: t, progress: r });
      }),
      n
    );
  },
  _a = (a, n, o, t) => {
    if (
      !(!a.success || !a.data) &&
      ((a.data.status === 'completed' || a.data.status === 'failed') &&
        (n(`Workflow ${a.data.status}`), setTimeout(() => o(), 5e3)),
      a.data.nodeResults)
    ) {
      const r = Ma(a.data.nodeResults);
      t(r);
    }
  },
  Ta = ({
    executionId: a,
    isExecuting: n,
    stopExecution: o,
    clearExecutionStatus: t,
    updateNodeStates: r,
    eventSourceRef: s
  }) => (
    u.useEffect(() => {
      if (!a || !n || be(s.current)) {
        return;
      }
      const i = setInterval(async () => {
        if (be(s.current)) {
          clearInterval(i);
          return;
        }
        try {
          const d = await L.getExecutionStatus(a);
          _a(d, o, t, r);
        } catch (d) {
          O.error('Failed to poll execution status:', d);
        }
      }, 2e3);
      return () => clearInterval(i);
    }, [a, n, o, t, r, s]),
    null
  );
class he {
  static transform(n) {
    const o = (n || '').toLowerCase();
    return this.isRateLimitError(o)
      ? {
        message:
            '⏱️ Rate limited - too many requests. Retrying automatically...',
        severity: 'warning',
        actionable: !1,
        guidance: 'Please wait while we retry your request',
        duration: 1e4,
        icon: '⏱️'
      }
      : this.isBillingError(o)
        ? {
          message: "💳 You've run out of Replicate credits",
          severity: 'critical',
          actionable: !0,
          guidance: 'Add funds to your Replicate account to continue',
          duration: 'manual',
          icon: '💳'
        }
        : this.isAuthError(o)
          ? {
            message: '🔑 API authentication failed',
            severity: 'critical',
            actionable: !0,
            guidance: 'Check your REPLICATE_API_TOKEN in settings',
            duration: 'manual',
            icon: '🔑'
          }
          : this.isCapacityError(o)
            ? {
              message: '🔄 Model is currently busy - retrying...',
              severity: 'warning',
              actionable: !1,
              guidance: 'High demand detected, automatically retrying',
              duration: 8e3,
              icon: '🔄'
            }
            : this.isSafetyError(o)
              ? {
                message: '⚠️ Content flagged by safety filter',
                severity: 'warning',
                actionable: !0,
                guidance: 'Try adjusting your prompt to be more specific',
                duration: 'manual',
                icon: '⚠️'
              }
              : this.isNetworkError(o)
                ? {
                  message: '🌐 Network connection issue',
                  severity: 'warning',
                  actionable: !0,
                  guidance: 'Check your network connection and try again',
                  duration: 12e3,
                  icon: '🌐'
                }
                : this.isTimeoutError(o)
                  ? {
                    message: '⏰ Connection timeout',
                    severity: 'warning',
                    actionable: !0,
                    guidance:
                        'The request took too long - check your network connection',
                    duration: 12e3,
                    icon: '⏰'
                  }
                  : {
                    message: '❌ Generation failed - please try again',
                    severity: 'warning',
                    actionable: !0,
                    guidance: 'If this persists, check your account status',
                    duration: 15e3,
                    icon: '❌'
                  };
  }
  static createSuccessMessage() {
    return {
      message: '✅ Workflow completed successfully!',
      severity: 'success',
      actionable: !1,
      guidance: void 0,
      duration: 8e3,
      icon: '✅'
    };
  }
  static createProgressMessage(n) {
    return {
      message: `🔄 Workflow progress: ${Math.round(n)}%`,
      severity: 'info',
      actionable: !1,
      guidance: void 0,
      duration: 'manual',
      icon: '🔄'
    };
  }
  static isRateLimitError(n) {
    return [
      'rate_limit',
      'rate limit',
      'too many requests',
      '429',
      'throttl'
    ].some(t => n.includes(t));
  }
  static isBillingError(n) {
    return [
      'insufficient_quota',
      'insufficient quota',
      'insufficient credits',
      'quota exceeded',
      'credits',
      'billing',
      'payment',
      'insufficient funds',
      '402'
    ].some(t => n.includes(t));
  }
  static isAuthError(n) {
    return [
      'authentication',
      'auth',
      'unauthorized',
      'invalid token',
      'api key',
      'api_key',
      '401'
    ].some(t => n.includes(t));
  }
  static isCapacityError(n) {
    return [
      'model_busy',
      'model busy',
      'capacity',
      'queue',
      'overloaded',
      'unavailable',
      'busy',
      'high demand'
    ].some(t => n.includes(t));
  }
  static isSafetyError(n) {
    return [
      'safety',
      'content_policy',
      'content policy',
      'flagged',
      'inappropriate',
      'violation',
      'moderation'
    ].some(t => n.includes(t));
  }
  static isNetworkError(n) {
    return [
      'network',
      'connection',
      'dns',
      'host',
      'unreachable',
      'connection refused',
      'network error'
    ].some(t => n.includes(t));
  }
  static isTimeoutError(n) {
    return ['timeout', 'timed out', 'time out', 'deadline exceeded'].some(t =>
      n.includes(t)
    );
  }
  static getSeverityClass(n) {
    switch (n) {
    case 'critical':
      return 'error-critical';
    case 'warning':
      return 'error-warning';
    case 'info':
      return 'error-info';
    case 'success':
      return 'error-success';
    default:
      return 'error-warning';
    }
  }
  static getSeverityStyle(n) {
    switch (n) {
    case 'critical':
      return {
        background:
            'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        color: '#fecaca'
      };
    case 'warning':
      return {
        background:
            'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        color: '#fed7aa'
      };
    case 'info':
      return {
        background:
            'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        color: '#bfdbfe'
      };
    case 'success':
      return {
        background:
            'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.4)',
        color: '#bbf7d0'
      };
    default:
      return {
        background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      };
    }
  }
  static requiresManualDismissal(n) {
    return n.duration === 'manual';
  }
  static getDurationDisplay(n) {
    return n === 'manual'
      ? 'Click to dismiss'
      : `Auto-dismiss in ${Math.ceil(n / 1e3)}s`;
  }
}
const Oe = M.memo(
  ({ executionStatus: a, isExecuting: n, errorInfo: o, onDismiss: t }) => {
    const [r, s] = u.useState(!1),
      [i, d] = u.useState(null);
    if (
      (u.useEffect(() => {
        if (o && typeof o.duration === 'number') {
          d(Math.ceil(o.duration / 1e3));
          const c = setInterval(() => {
            d(g => (g === null || g <= 1 ? (clearInterval(c), null) : g - 1));
          }, 1e3);
          return () => clearInterval(c);
        } else {
          d(null);
        }
      }, [o]),
      !a)
    ) {
      return null;
    }
    const l = () => {
      const c = {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        borderRadius: '50px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        letterSpacing: '0.02em',
        zIndex: 1e3,
        boxShadow:
          '0 4px 24px rgba(31, 38, 135, 0.27), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        animation: n
          ? 'pulse 2s ease-in-out infinite'
          : 'slideDown 0.3s ease-out',
        maxWidth: '500px',
        minWidth: 'auto',
        whiteSpace: 'nowrap'
      };
      if (o) {
        const g = he.getSeverityStyle(o.severity);
        return { ...c, ...g, color: g.color || '#ffffff' };
      }
      return {
        ...c,
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        color: '#ffffff'
      };
    };
    return e.jsxs(e.Fragment, {
      children: [
        e.jsxs('div', {
          style: l(),
          children: [
            e.jsx('div', {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background:
                  'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                borderRadius: '50px 50px 0 0',
                pointerEvents: 'none'
              }
            }),
            e.jsxs('div', {
              style: { position: 'relative', zIndex: 1 },
              children: [
                e.jsxs('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  },
                  children: [
                    e.jsx('div', {
                      style: { flex: 1 },
                      children: e.jsxs('div', {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        },
                        children: [
                          e.jsx('span', { children: a }),
                          i &&
                            e.jsxs('span', {
                              style: { fontSize: '12px', opacity: 0.7 },
                              children: ['(', i, 's)']
                            })
                        ]
                      })
                    }),
                    e.jsxs('div', {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      },
                      children: [
                        o?.actionable &&
                          e.jsx('button', {
                            onClick: () => s(!r),
                            style: {
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '16px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              color: 'inherit',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            },
                            onMouseEnter: c => {
                              c.currentTarget.style.background =
                                'rgba(255, 255, 255, 0.2)';
                            },
                            onMouseLeave: c => {
                              c.currentTarget.style.background =
                                'rgba(255, 255, 255, 0.1)';
                            },
                            children: r ? 'Hide Details' : 'Details'
                          }),
                        (t || he.requiresManualDismissal(o || {})) &&
                          e.jsx('button', {
                            onClick: t,
                            style: {
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              color: 'inherit',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            },
                            onMouseEnter: c => {
                              c.currentTarget.style.background =
                                'rgba(255, 255, 255, 0.2)';
                            },
                            onMouseLeave: c => {
                              c.currentTarget.style.background =
                                'rgba(255, 255, 255, 0.1)';
                            },
                            children: '✕'
                          })
                      ]
                    })
                  ]
                }),
                r &&
                  o?.guidance &&
                  e.jsx('div', {
                    style: {
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: '12px',
                      opacity: 0.9,
                      lineHeight: '1.4'
                    },
                    children: e.jsxs('div', {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px'
                      },
                      children: [
                        e.jsx('span', {
                          style: { fontSize: '14px' },
                          children: '💡'
                        }),
                        e.jsx('span', { children: o.guidance })
                      ]
                    })
                  })
              ]
            })
          ]
        }),
        e.jsx('style', {
          children: `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.95;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.02);
          }
        }
      `
        })
      ]
    });
  }
);
Oe.displayName = 'ExecutionStatus';
const Ra = () => null,
  Da = () =>
    e.jsx('svg', {
      width: '0',
      height: '0',
      style: { position: 'absolute' },
      children: e.jsx('defs', {
        children: e.jsxs('linearGradient', {
          id: 'optimized-edge-gradient',
          x1: '0%',
          y1: '0%',
          x2: '100%',
          y2: '0%',
          children: [
            e.jsx('stop', {
              offset: '0%',
              stopColor: '#3b82f6',
              stopOpacity: '0.8'
            }),
            e.jsx('stop', {
              offset: '50%',
              stopColor: '#8b5cf6',
              stopOpacity: '1'
            }),
            e.jsx('stop', {
              offset: '100%',
              stopColor: '#ec4899',
              stopOpacity: '0.8'
            })
          ]
        })
      })
    }),
  La = {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 200,
    height: 120,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    border: '1px solid #2a2a2a',
    borderRadius: '8px'
  },
  Oa = M.memo(
    ({
      nodes: a,
      edges: n,
      onNodesChange: o,
      onEdgesChange: t,
      onConnect: r,
      onNodesDelete: s,
      onNodeMouseEnter: i,
      onNodeMouseLeave: d,
      onInit: l,
      onDrop: c,
      onDragOver: g,
      nodeTypes: p
    }) =>
      e.jsxs(et, {
        nodes: a,
        edges: n,
        onNodesChange: o,
        onEdgesChange: t,
        onConnect: r,
        onNodesDelete: s,
        onNodeMouseEnter: i,
        onNodeMouseLeave: d,
        onInit: l,
        onDrop: c,
        onDragOver: g,
        nodeTypes: p,
        fitViewOptions: { padding: 0.1, maxZoom: 1 },
        minZoom: 0.1,
        maxZoom: 1.5,
        panOnScroll: !0,
        panOnDrag: !0,
        deleteKeyCode: 'Delete',
        connectionLineStyle: {
          stroke: 'url(#optimized-edge-gradient)',
          strokeWidth: 2
        },
        defaultEdgeOptions: {
          animated: !0,
          type: 'smoothstep',
          style: { stroke: 'url(#optimized-edge-gradient)', strokeWidth: 2 }
        },
        className: 'workflow-canvas',
        proOptions: { hideAttribution: !0 },
        children: [
          e.jsx(Da, {}),
          e.jsx(tt, { variant: at.Dots, color: '#4a4a4a', gap: 20, size: 2 }),
          e.jsx(nt, {}),
          e.jsx(ot, {
            nodeColor: () => '#ffffff',
            nodeStrokeWidth: 3,
            pannable: !0,
            zoomable: !0,
            style: La
          }),
          e.jsx(rt, {
            position: 'top-left',
            style: { pointerEvents: 'none', margin: 0, padding: 0 },
            children: e.jsx(Ra, {})
          })
        ]
      })
  ),
  Ae = M.memo(
    ({
      clearWorkflow: a,
      loadVideoTemplate: n,
      optimizeVideoLayout: o,
      reactFlowInstance: t,
      nodes: r,
      edges: s
    }) => {
      const i = () => {
        const d = t?.getEdges() || s;
        o(r, d);
      };
      return e.jsxs('div', {
        style: {
          position: 'absolute',
          bottom: '23px',
          left: '235px',
          display: 'flex',
          gap: '8px',
          zIndex: 100
        },
        children: [
          e.jsx(G, {
            onClick: a,
            variant: 'danger',
            size: 'md',
            icon: e.jsx(ye, { size: 16 }),
            children: 'Clear'
          }),
          e.jsx(G, {
            onClick: i,
            variant: 'success',
            size: 'md',
            icon: e.jsx(xt, { size: 16 }),
            children: 'Optimize Layout'
          }),
          e.jsx(G, {
            onClick: n,
            variant: 'primary',
            size: 'md',
            icon: e.jsx(bt, { size: 16 }),
            customStyles: {
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#8b5cf6',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            },
            children: 'Load Video Template'
          })
        ]
      });
    }
  );
Ae.displayName = 'WorkflowControls';
const ze = M.memo(() =>
  e.jsx('div', {
    style: { position: 'absolute', top: '-10px', left: '20px', zIndex: 1e3 },
    children: e.jsx('img', {
      src: '/logo.svg',
      alt: 'Automator Logo',
      style: {
        width: '250px',
        height: '100px',
        filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
      }
    })
  })
);
ze.displayName = 'WorkflowHeader';
const Aa = { custom: ta },
  za = [],
  Fa = [];
window.sseDebugLogged = !1;
const Fe = M.memo(() => {
  const a = u.useRef(null),
    [n, o] = M.useState(null),
    [t, r] = u.useState(null),
    [s, i, d] = it(za),
    [l, c, g] = lt(Fa),
    {
      isExecuting: p,
      executionStatus: f,
      executionId: m,
      startExecution: b,
      stopExecution: v,
      updateExecutionStatus: k,
      clearExecutionStatus: w
    } = Ea(),
    {
      nodeExecutionStates: x,
      updateNodeStates: j,
      resetNodeStates: S
    } = Sa(s, l, i, c),
    {
      addPreview: E,
      removeNodePreviews: N,
      clearAllPreviews: h,
      handleNodeCompletion: P
    } = Ca(),
    I = u.useRef(null),
    {
      addNodeFromTemplate: We,
      deleteNode: H,
      onConnect: Ve,
      updateNodeData: z,
      clearWorkflow: $
    } = Na(s, l, i, c),
    { optimizeVideoLayout: q } = ya({
      animated: !1,
      fitView: !0,
      fitViewOptions: { padding: 0.2, maxZoom: 1, minZoom: 0.3 }
    }),
    F = u.useRef(null),
    Z = u.useRef(null),
    R = u.useRef(null),
    U = u.useCallback((y, C) => {
      R.current?.handleModelChange(y, C);
    }, []),
    Y = u.useCallback(
      (y, C) => {
        R.current?.handleMediaChange(y, C, s);
      },
      [s]
    ),
    X = u.useCallback(
      (y, C) => {
        R.current?.handleVoiceChange(y, C, s);
      },
      [s]
    ),
    { updateNodeParametersFromEdges: K } = ja(),
    ie = u.useRef(async () => {}),
    {
      handleAddNode: Be,
      onNodeDelete: Ge,
      nodesRef: W,
      edgesRef: le
    } = ka({
      nodes: s,
      edges: l,
      hoveredNodeId: t,
      nodeEventHandlers: R,
      handleModelChange: U,
      handleMediaChange: Y,
      handleVoiceChange: X,
      handleExecuteWorkflow: async () => {
        await ie.current?.();
      },
      deleteNode: H,
      updateNodeData: z,
      setNodes: i,
      addNodeFromTemplate: We,
      updateNodeParametersFromEdges: K,
      removeNodePreviews: N
    }),
    V = u.useCallback(async () => {
      F.current && (wt(), await F.current.execute(s, l, W, I));
    }, [s, l, W]);
  ((ie.current = V),
  u.useEffect(
    () => (
      _(
        async () => {
          const { WorkflowExecutionHandler: y } = await import(
            './templates-CbE1H7ul.js'
          ).then(C => C.W);
          return { WorkflowExecutionHandler: y };
        },
        __vite__mapDeps([6, 0, 1, 2])
      ).then(({ WorkflowExecutionHandler: y }) => {
        F.current = new y({
          startExecution: b,
          stopExecution: v,
          updateExecutionStatus: k,
          clearExecutionStatus: w,
          clearAllPreviews: h,
          resetNodeStates: S,
          updateNodeStates: j,
          addPreview: E
        });
      }),
      _(
        async () => {
          const { TemplateLoader: y } = await import(
            './templates-CbE1H7ul.js'
          ).then(C => C.T);
          return { TemplateLoader: y };
        },
        __vite__mapDeps([6, 0, 1, 2])
      ).then(({ TemplateLoader: y }) => {
        Z.current = new y({
          clearWorkflow: $,
          updateNodeStates: j,
          stopExecution: v,
          deleteNode: H,
          updateNodeData: z,
          setNodes: i,
          setEdges: c,
          handleModelChange: U,
          handleMediaChange: Y,
          handleVoiceChange: X,
          handleExecuteWorkflow: V,
          optimizeVideoLayout: q,
          updateNodeParametersFromEdges: K
        });
      }),
      _(
        async () => {
          const { NodeEventHandlers: y } = await import(
            './templates-CbE1H7ul.js'
          ).then(C => C.N);
          return { NodeEventHandlers: y };
        },
        __vite__mapDeps([6, 0, 1, 2])
      ).then(({ NodeEventHandlers: y }) => {
        R.current = new y({ updateNodeData: z });
      }),
      () => {
        F.current?.cleanup();
      }
    ),
    [E, h, w, $, H, V, Y, U, X, q, S, c, i, b, v, k, z, K, j]
  ),
  u.useEffect(() => {
    if (l.length > 0 && n) {
      const y = setTimeout(() => {
        const C = n.getViewport();
        n.setViewport(C);
      }, 100);
      return () => clearTimeout(y);
    }
  }, [l.length, n]),
  u.useEffect(() => {
    x.size !== 0 &&
        s.forEach(y => {
          const C = x.get(y.id);
          C &&
            y.data.executionState !== 'completed' &&
            C.state === 'completed' &&
            y.data.output &&
            P(y, y.data.output);
        });
  }, [x, s, P]));
  const He = u.useCallback(async () => {
    if (m) {
      try {
        const y = await L.cancelWorkflow(m);
        y.success
          ? (v('Workflow cancelled'),
          I.current && (I.current.close(), (I.current = null)))
          : (O.error('Failed to stop workflow:', y.error),
          alert(`Failed to stop workflow: ${y.error}`));
      } catch (y) {
        (O.error('Error stopping workflow:', y),
        alert('Error stopping workflow'));
      }
    }
  }, [m, v]);
  u.useEffect(() => {
    _(
      async () => {
        const { videoGenerationTemplate: y } = await import(
          './templates-CbE1H7ul.js'
        ).then(C => C.v);
        return { videoGenerationTemplate: y };
      },
      __vite__mapDeps([6, 0, 1, 2])
    ).then(({ videoGenerationTemplate: y }) => {
      window.videoGenerationTemplate = y;
    });
  }, []);
  const $e = u.useCallback(() => {
      Z.current && Z.current.loadVideoTemplate(s, W, le);
    }, [s, W, le]),
    qe = u.useCallback((y, C) => {
      r(C.id);
    }, []),
    Ze = u.useCallback(() => {
      r(null);
    }, []),
    { onDragOver: Ue, onDrop: Ye } = wa({
      reactFlowInstance: n,
      handleAddNode: Be
    });
  return e.jsxs('div', {
    className: 'modern-workflow-container',
    children: [
      e.jsx('div', {
        ref: a,
        style: { width: '100%', height: '100%' },
        children: e.jsx(Oa, {
          nodes: s,
          edges: l,
          onNodesChange: d,
          onEdgesChange: g,
          onConnect: Ve,
          onNodesDelete: Ge,
          onNodeMouseEnter: qe,
          onNodeMouseLeave: Ze,
          onInit: y => {
            (o(y), y.fitView({ padding: 0.1, maxZoom: 1 }));
          },
          onDrop: Ye,
          onDragOver: Ue,
          nodeTypes: Aa
        })
      }),
      e.jsx(ze, {}),
      e.jsx(Oe, { executionStatus: f, isExecuting: p }),
      e.jsx(Ae, {
        clearWorkflow: $,
        loadVideoTemplate: $e,
        optimizeVideoLayout: q,
        reactFlowInstance: n,
        nodes: s,
        edges: l
      }),
      e.jsx(Le, {
        isExecuting: p,
        executionId: m,
        handleExecuteWorkflow: V,
        handleStopWorkflow: He
      }),
      e.jsx(Ce, {}),
      e.jsx(Ta, {
        executionId: m,
        isExecuting: p,
        stopExecution: v,
        clearExecutionStatus: w,
        updateNodeStates: j,
        eventSourceRef: I
      })
    ]
  });
});
Fe.displayName = 'ModernWorkflowViewContent';
const Za = () =>
  e.jsx(st, { children: e.jsx(vt, { children: e.jsx(Fe, {}) }) });
export { Za as ModernWorkflowView };

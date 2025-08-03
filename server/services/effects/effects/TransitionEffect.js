'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.TransitionEffect = void 0),
  (exports.getAlternatingTransition = getAlternatingTransition));
class TransitionEffect {
  name;
  description;
  config;
  sceneIndex;
  constructor(config, e) {
    ((this.config = config),
      (this.sceneIndex = e),
      (this.name = `transition_${config.type}_${e}`),
      (this.description = `${config.type} transition at scene ${e}`));
  }
  getRequirements() {
    return { requiresVideo: !0, modifiesVideo: !0, supportsMultipleInputs: !0 };
  }
  validate(e) {
    return !e.inputs.additionalVideos ||
      e.inputs.additionalVideos.length <= this.sceneIndex
      ? {
          valid: !1,
          errors: [
            `Transition at scene ${this.sceneIndex} requires at least ${this.sceneIndex + 1} videos`,
          ],
        }
      : { valid: !0 };
  }
  getFilterGraph(e) {
    const t = this.config.duration || 0.15,
      i = {
        slide_left: 'slideleft',
        slide_right: 'slideright',
        slide_up: 'slideup',
        slide_down: 'slidedown',
        wipe_left: 'wipeleft',
        wipe_right: 'wiperight',
        squeeze_h: 'squeezeh',
        squeeze_v: 'squeezev',
        cover_left: 'coverleft',
        reveal_right: 'revealright',
        diagonal_tl: 'diagtl',
        radial: 'radial',
        dissolve: 'dissolve',
        hard_cut: "expr='if(lt(P,0.3),A,B)'",
      }[this.config.type],
      s =
        'hard_cut' === this.config.type
          ? { expr: i, duration: t, offset: -t }
          : { transition: i, duration: t, offset: -t };
    return {
      nodes: [
        {
          id: `transition_${this.sceneIndex}`,
          filter: 'xfade',
          params: s,
          inputs: [`[${this.sceneIndex}:v]`, `[${this.sceneIndex + 1}:v]`],
          outputs: [`[trans${this.sceneIndex}]`],
        },
      ],
      outputs: { video: `[trans${this.sceneIndex}]` },
    };
  }
  getPriority() {
    return 50;
  }
}
function getAlternatingTransition(e) {
  const t = [
    'slide_left',
    'slide_right',
    'slide_up',
    'slide_down',
    'wipe_left',
    'wipe_right',
    'squeeze_h',
    'squeeze_v',
    'cover_left',
    'reveal_right',
    'diagonal_tl',
    'dissolve',
  ];
  return { type: t[e % t.length], duration: 0.15 };
}
exports.TransitionEffect = TransitionEffect;

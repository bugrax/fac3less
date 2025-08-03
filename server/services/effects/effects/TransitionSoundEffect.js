'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.TransitionSoundEffect = void 0));
const BaseEffect_1 = require('../BaseEffect'),
  FilterGraphBuilder_1 = require('../FilterGraphBuilder'),
  MediaFileManager_1 = require('../../media/MediaFileManager');
class TransitionSoundEffect extends BaseEffect_1.BaseEffect {
  options;
  name = 'transition-sound';
  description = 'Adds transition sound effects at specified timestamps';
  fileManager;
  constructor(t = {}, i) {
    (super(),
      (this.options = t),
      (this.fileManager = i || new MediaFileManager_1.MediaFileManager()));
  }
  getRequirements() {
    return {
      requiresVideo: !1,
      requiresAudio: !0,
      modifiesVideo: !1,
      modifiesAudio: !0,
      supportsMultipleInputs: !0,
    };
  }
  validateSpecific(t) {
    const i = [],
      o = [],
      s = this.options.soundPath || 'assets/sounds/whoosh.mp3',
      e = this.options.volume || 0.6,
      n = this.options.transitionTimestamps || [],
      a = this.options.transitionDuration || 0.5;
    (s || i.push('Transition sound path is required'),
      (e < 0 || e > 1) && i.push('Volume must be between 0 and 1'),
      0 === n.length &&
        o.push(
          'No transition timestamps provided - no transitions will be added'
        ));
    const u = t.metadata.duration;
    for (const t of n)
      (t < 0 || t > u) &&
        i.push(
          `Transition timestamp ${t}s is outside video duration (0-${u}s)`
        );
    (a <= 0 || a > 2) &&
      i.push('Transition duration must be between 0 and 2 seconds');
    const d = [...n].sort((t, i) => t - i);
    for (let t = 1; t < d.length; t++)
      d[t] - d[t - 1] < a &&
        o.push(`Transitions at ${d[t - 1]}s and ${d[t]}s may overlap`);
    return (
      t.inputs.audio ||
        t.metadata.audio ||
        o.push(
          'No audio track detected in input - transition sounds will be the only audio'
        ),
      {
        valid: 0 === i.length,
        errors: i.length > 0 ? i : void 0,
        warnings: o.length > 0 ? o : void 0,
      }
    );
  }
  getFilterGraph(t) {
    const i = this.options.volume || 0.6,
      o = this.options.transitionTimestamps || [],
      s = this.options.transitionDuration || 0.5,
      e = this.options.soundPath || 'assets/sounds/whoosh.mp3';
    if (0 === o.length)
      return {
        nodes: [
          {
            id: 'passthrough',
            filter: 'anull',
            params: {},
            inputs: ['[audio_in]'],
            outputs: ['[audio_out]'],
          },
        ],
        outputs: { video: '[video_in]', audio: '[audio_out]' },
      };
    const n = new FilterGraphBuilder_1.FilterGraphBuilder(),
      a = 1 + (t.inputs.additionalAudios?.length || 0);
    (t.inputs.additionalAudios || (t.inputs.additionalAudios = []),
      t.inputs.additionalAudios.includes(this.fileManager.resolvePath(e)) ||
        t.inputs.additionalAudios.push(this.fileManager.resolvePath(e)));
    const u = [];
    for (let t = 0; t < o.length; t++) {
      const e = Math.round(1e3 * o[t]),
        d = `[trans${t}]`;
      (n
        .audio(
          'atrim',
          { start: 0, end: s },
          { inputs: [`${a}:a`], outputs: [`[trans${t}_trim]`] }
        )
        .audio(
          'volume',
          { volume: i },
          { inputs: [`[trans${t}_trim]`], outputs: [`[trans${t}_vol]`] }
        )
        .audio(
          'adelay',
          { delays: `${e}|${e}` },
          { inputs: [`[trans${t}_vol]`], outputs: [d] }
        ),
        u.push(d));
    }
    if (t.inputs.audio || t.metadata.audio) {
      const t = ['[audio_in]', ...u];
      (n.audio(
        'amix',
        { inputs: t.length, mix_duration: 'first', normalize: !1 },
        { inputs: t, outputs: ['[mixed_audio]'] }
      ),
        n.audio(
          'volume',
          { volume: 1.2 },
          { inputs: ['[mixed_audio]'], outputs: ['[audio_out]'] }
        ));
    } else
      1 === u.length
        ? n.connect(u[0], '[audio_out]')
        : (n.audio(
            'amix',
            { inputs: u.length, mix_duration: 'longest', normalize: !1 },
            { inputs: u, outputs: ['[mixed_transitions]'] }
          ),
          n.audio(
            'volume',
            { volume: 1.2 },
            { inputs: ['[mixed_transitions]'], outputs: ['[audio_out]'] }
          ));
    return (
      n.video('null', {}, { inputs: ['[video_in]'], outputs: ['[video_out]'] }),
      {
        nodes: n.getNodes(),
        outputs: { video: '[video_out]', audio: '[audio_out]' },
      }
    );
  }
  getPriority() {
    return 40;
  }
  estimateProcessingTime(t) {
    const i = 0.01 * (this.options.transitionTimestamps?.length || 0);
    return Math.ceil(t.metadata.duration * (0.05 + i));
  }
}
exports.TransitionSoundEffect = TransitionSoundEffect;

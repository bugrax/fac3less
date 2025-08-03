'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.IntroSoundEffect = void 0));
const BaseEffect_1 = require('../BaseEffect'),
  FilterGraphBuilder_1 = require('../FilterGraphBuilder'),
  MediaFileManager_1 = require('../../media/MediaFileManager');
class IntroSoundEffect extends BaseEffect_1.BaseEffect {
  options;
  name = 'intro-sound';
  description = 'Adds an intro sound effect to the beginning of a video';
  fileManager;
  constructor(t = {}, e) {
    (super(),
      (this.options = t),
      (this.fileManager = e || new MediaFileManager_1.MediaFileManager()));
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
    const e = [],
      i = [],
      o = this.options.soundPath || 'assets/sounds/intro-whoosh.mp3',
      n = this.options.volume || 0.8,
      u = this.options.duration || 2;
    (o || e.push('Intro sound path is required'),
      (n < 0 || n > 1) && e.push('Volume must be between 0 and 1'),
      (u <= 0 || u > 10) &&
        e.push('Intro sound duration must be between 0 and 10 seconds'));
    const s = this.options.fadeIn || 0.1,
      a = this.options.fadeOut || 0.1;
    return (
      (s < 0 || s > u / 2) &&
        e.push(
          'Fade in duration must be between 0 and half the intro duration'
        ),
      (a < 0 || a > u / 2) &&
        e.push(
          'Fade out duration must be between 0 and half the intro duration'
        ),
      t.inputs.audio ||
        t.metadata.audio ||
        i.push(
          'No audio track detected in input - intro sound will be the only audio'
        ),
      {
        valid: 0 === e.length,
        errors: e.length > 0 ? e : void 0,
        warnings: i.length > 0 ? i : void 0,
      }
    );
  }
  getFilterGraph(t) {
    const e = this.options.duration || 2,
      i = this.options.volume || 0.8,
      o = this.options.fadeIn || 0.1,
      n = this.options.fadeOut || 0.1,
      u = this.options.soundPath || 'assets/sounds/intro-whoosh.mp3',
      s = new FilterGraphBuilder_1.FilterGraphBuilder();
    return (
      (t.inputs.additionalAudios = [this.fileManager.resolvePath(u)]),
      s
        .audio(
          'atrim',
          { start: 0, end: e },
          { inputs: ['1:a'], outputs: ['[intro_trimmed]'] }
        )
        .audio(
          'afade',
          { type: 'in', start_time: 0, fade_duration: o },
          { inputs: ['[intro_trimmed]'], outputs: ['[intro_fade_in]'] }
        )
        .audio(
          'afade',
          { type: 'out', start_time: e - n, fade_duration: n },
          { inputs: ['[intro_fade_in]'], outputs: ['[intro_fade]'] }
        )
        .audio(
          'volume',
          { volume: i },
          { inputs: ['[intro_fade]'], outputs: ['[intro_processed]'] }
        ),
      t.inputs.audio || t.metadata.audio
        ? (s.audio(
            'amix',
            { inputs: 2, mix_duration: 'first', normalize: !1 },
            {
              inputs: ['[audio_in]', '[intro_processed]'],
              outputs: ['[mixed_audio]'],
            }
          ),
          s.audio(
            'volume',
            { volume: 1.2 },
            { inputs: ['[mixed_audio]'], outputs: ['[audio_out]'] }
          ))
        : s.connect('[intro_processed]', '[audio_out]'),
      s.video('null', {}, { inputs: ['[video_in]'], outputs: ['[video_out]'] }),
      {
        nodes: s.getNodes(),
        outputs: { video: '[video_out]', audio: '[audio_out]' },
      }
    );
  }
  getPriority() {
    return 30;
  }
  estimateProcessingTime(t) {
    return Math.ceil(0.05 * t.metadata.duration);
  }
}
exports.IntroSoundEffect = IntroSoundEffect;

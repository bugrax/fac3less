'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VideoPromptEnhancer = void 0));
const logger_1 = require('../../../../utils/logger');
class VideoPromptEnhancer {
  static styleMotionAdaptations = {
    cinematic: 'dramatic dolly zoom, lens flare sweep, depth focus shift',
    anime: 'speed lines effect, dynamic zoom with energy particles',
    minimalist: 'precise geometric camera movement, clean transitions',
    'dark-fantasy': 'ominous slow push-in, shadow creep, fog swirl',
    cyberpunk: 'glitch-style micro movements, neon pulse rhythm',
    retro: 'vintage camera shake, film burn effect movement',
    surreal: 'warping perspective shift, dreamlike float',
    realistic: 'handheld camera urgency, documentary-style movement',
    'flat-design': 'smooth lateral slide transitions, depth layer parallax',
    silhouette: 'backlit figure tracking, rim light pulse transitions',
    isometric: 'rotational axis shift, cubic space navigation',
    'line-art': 'stroke weight morphing, sketch-to-complete reveal',
    duotone: 'color channel separation glitch, chromatic shift movement',
    'abstract-geometric': 'kaleidoscope rotation, fractal zoom progression',
    bauhaus: 'grid-based pan movements, constructivist angle cuts',
    liminal: 'unsettling drift motion, threshold space warping',
    'analog-horror': 'VHS tracking distortion, signal degradation judder',
    'stark-horror': 'jarring snap zooms, negative space invasion',
    vaporwave: 'slow-motion glide, CRT monitor flicker rhythm',
    'deep-fried': 'chaotic zoom bursts, oversaturated pulse effects',
    'y2k-digital': 'matrix rain transitions, wireframe rotation sweeps',
    storybook: 'page turn transitions, pop-up depth layers',
    'comic-noir': 'panel-to-panel snap cuts, dramatic shadow sweeps',
    'puppet-theater':
      'stage-like lateral movements, curtain reveal transitions',
    diorama: 'miniature tilt-shift focus pulls, orbiting perspective',
    'security-cam': 'fixed angle pan sweeps, timestamp glitch stutters',
    'night-vision': 'thermal bloom movements, IR flare sweeps',
    'trail-cam': 'motion-triggered snap focus, wildlife startle zooms',
    classified: 'redaction bar swipes, document scanner movements',
    'old-newsreel': 'projector gate shake, film splice jumps',
    'super-8': 'home movie wobble, light leak flashes',
    'polaroid-horror':
      'instant photo development reveal, chemical burn transitions',
    thermal: 'heat signature tracking, temperature gradient flows',
  };
  static enhance(e, t, i, a) {
    if (!t) return e;
    const o = this.analyzeImageContext(i?.prompt || ''),
      n = this.getStyleMotion(a);
    return (
      logger_1.logger.info(
        '[VideoPromptEnhancer] Enhancing first video prompt:',
        {
          originalPrompt: e,
          imageContext: o,
          styleAdaptation: n,
          sectionId: i?.sectionId,
        }
      ),
      `${o}, ${n}, creating immediate visual interest through movement,\n            energetic but smooth motion that draws viewer attention forward,\n            building anticipation through camera and atmospheric dynamics`
    );
  }
  static analyzeImageContext(e) {
    const t = e.toLowerCase();
    return t.includes('face') || t.includes('person') || t.includes('portrait')
      ? 'slow zoom on subject, subtle camera shake for urgency'
      : t.includes('landscape') || t.includes('wide') || t.includes('panoramic')
        ? 'sweeping camera pan revealing scope, atmospheric particles'
        : t.includes('object') || t.includes('product') || t.includes('item')
          ? 'rotating orbit reveal, dynamic lighting shift'
          : t.includes('text') || t.includes('screen') || t.includes('display')
            ? 'quick zoom to focus, subtle pulse effect'
            : t.includes('crowd') || t.includes('group') || t.includes('people')
              ? 'dynamic camera weave through scene, energy building'
              : t.includes('close-up') ||
                  t.includes('detail') ||
                  t.includes('macro')
                ? 'intense push-in with shallow depth, revealing texture'
                : 'forward camera movement with increasing energy';
  }
  static getStyleMotion(e) {
    return this.styleMotionAdaptations[e || ''] || 'dynamic camera movement';
  }
  static getValidStyles() {
    return Object.keys(this.styleMotionAdaptations);
  }
}
exports.VideoPromptEnhancer = VideoPromptEnhancer;

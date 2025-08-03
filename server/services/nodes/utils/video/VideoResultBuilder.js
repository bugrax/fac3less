'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.VideoResultBuilder = void 0));
const VideoParameters_1 = require('./VideoParameters');
class VideoResultBuilder {
  static createFailedResult(e, t, i, r, o) {
    const { width: d, height: s } =
      VideoParameters_1.VideoParametersBuilder.parseResolution(i);
    return {
      sectionId: e,
      video: {
        path: '',
        mimeType: 'video/mp4',
        size: 0,
        duration: t.duration,
        width: d,
        height: s,
        fps: r,
        format: 'mp4'
      },
      duration: t.duration,
      status: 'failed',
      error: o
    };
  }
  static createSuccessfulResult(e, t, i, r) {
    const { width: o, height: d } =
      VideoParameters_1.VideoParametersBuilder.parseResolution(r.resolution);
    return {
      sectionId: e,
      video: {
        path: i,
        mimeType: 'video/mp4',
        size: 0,
        duration: t.duration,
        width: o,
        height: d,
        fps: r.fps,
        format: 'mp4',
        metadata: {
          sectionId: e,
          model: r.model,
          prompt: r.videoPrompt,
          sourceImage: t.image.path
        }
      },
      duration: t.duration,
      status: 'completed'
    };
  }
}
exports.VideoResultBuilder = VideoResultBuilder;

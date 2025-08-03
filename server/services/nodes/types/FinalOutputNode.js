'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (t, e, i, a) {
          void 0 === a && (a = i);
          var o = Object.getOwnPropertyDescriptor(e, i);
          ((o &&
            !('get' in o ? !e.__esModule : o.writable || o.configurable)) ||
            (o = {
              enumerable: !0,
              get: function () {
                return e[i];
              },
            }),
            Object.defineProperty(t, a, o));
        }
      : function (t, e, i, a) {
          (void 0 === a && (a = i), (t[a] = e[i]));
        }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (t, e) {
          Object.defineProperty(t, 'default', { enumerable: !0, value: e });
        }
      : function (t, e) {
          t.default = e;
        }),
  __importStar =
    (this && this.__importStar) ||
    (function () {
      var ownKeys = function (t) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (t) {
              var e = [];
              for (var i in t)
                Object.prototype.hasOwnProperty.call(t, i) && (e[e.length] = i);
              return e;
            }),
          ownKeys(t)
        );
      };
      return function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (null != t)
          for (var i = ownKeys(t), a = 0; a < i.length; a++)
            'default' !== i[a] && __createBinding(e, t, i[a]);
        return (__setModuleDefault(e, t), e);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.FinalOutputNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  OutputConfigs_1 = require('./OutputConfigs'),
  fs_1 = require('fs'),
  path = __importStar(require('path')),
  uuid_1 = require('uuid'),
  child_process_1 = require('child_process'),
  util_1 = require('util'),
  NodeCompatibility_1 = require('../../utils/NodeCompatibility'),
  logger_1 = require('../../../utils/logger'),
  execAsync = (0, util_1.promisify)(child_process_1.exec);
class FinalOutputNode extends BaseNode_1.BaseNode {
  outputDir;
  constructor(config) {
    (super({ ...config, type: 'final_output' }),
      (this.outputDir = process.env.FINAL_OUTPUT_DIR || './output/final'));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'videoWithCaptions',
          type: DataTypes_1.DataType.VIDEO,
          description:
            'Video with embedded captions from CaptionGenerationNode',
          required: !1,
        },
        {
          name: 'editedVideo',
          type: DataTypes_1.DataType.VIDEO,
          description: 'Edited video from EditingNode (if no captions)',
          required: !1,
        },
        {
          name: 'outputFormat',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output video format (mp4, webm, mov)',
          required: !1,
          defaultValue: 'mp4',
        },
        {
          name: 'quality',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output quality preset',
          required: !1,
          defaultValue: 'high',
        },
        {
          name: 'optimization',
          type: DataTypes_1.DataType.TEXT,
          description: 'Optimization strategy (size, quality, balanced)',
          required: !1,
          defaultValue: 'balanced',
        },
        {
          name: 'watermark',
          type: DataTypes_1.DataType.OBJECT,
          description: 'Watermark configuration',
          required: !1,
        },
        {
          name: 'metadata',
          type: DataTypes_1.DataType.OBJECT,
          description: 'Video metadata',
          required: !1,
        },
        {
          name: 'outputPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Custom output path',
          required: !1,
        },
        {
          name: 'uploadTo',
          type: DataTypes_1.DataType.TEXT,
          description: 'Upload destination',
          required: !1,
          defaultValue: 'local',
        },
      ],
      outputs: OutputConfigs_1.OutputPresets.finalOutput(),
    };
  }
  async execute(t, e) {
    try {
      this.updateProgress(5);
      const e = t.videoWithCaptions || t.editedVideo;
      if (!e || !e.path)
        throw new Error('No video provided for final processing');
      const i =
        'true' === process.env.USE_MOCK_SERVICES || e.path.startsWith('/mock/');
      i || (await fs_1.promises.mkdir(this.outputDir, { recursive: !0 }));
      const a = i
        ? `/mock/temp_${(0, uuid_1.v4)()}`
        : path.join(this.outputDir, `temp_${(0, uuid_1.v4)()}`);
      i || (await fs_1.promises.mkdir(a, { recursive: !0 }));
      try {
        this.updateProgress(10);
        const o = await this.optimizeVideo(
          e.path,
          a,
          t.outputFormat || 'mp4',
          t.quality || 'high',
          t.optimization || 'balanced'
        );
        this.updateProgress(40);
        let r = o;
        t.watermark &&
          ((r = await this.addWatermark(o, a, t.watermark)),
          this.updateProgress(60));
        const s = await this.addMetadata(
          r,
          a,
          t.outputFormat || 'mp4',
          t.metadata
        );
        this.updateProgress(70);
        const u = `final_video_${(0, uuid_1.v4)()}.${t.outputFormat || 'mp4'}`,
          n = t.outputPath || (i ? `/mock/${u}` : path.join(this.outputDir, u));
        let p, d, c, l;
        if (
          (i || (await fs_1.promises.rename(s, n)), this.updateProgress(80), i)
        )
          p = {
            originalSize: 10485760,
            finalSize: 5242880,
            compressionRatio: 2,
          };
        else {
          const t = await fs_1.promises.stat(e.path),
            i = await fs_1.promises.stat(n);
          p = {
            originalSize: t.size,
            finalSize: i.size,
            compressionRatio: t.size / i.size,
          };
        }
        (t.uploadTo &&
          'local' !== t.uploadTo &&
          'none' !== t.uploadTo &&
          ((d = await this.uploadVideo(n, t.uploadTo)),
          this.updateProgress(95)),
          i
            ? ((c = e.duration || 30),
              (l = { width: e.width || 1920, height: e.height || 1080 }))
            : ((c = await this.getVideoDuration(n)),
              (l = await this.getVideoDimensions(n))),
          i ||
            (await NodeCompatibility_1.NodeCompatibility.rm(a, {
              recursive: !0,
              force: !0,
            })),
          this.updateProgress(100));
        return {
          success: !0,
          data: {
            finalVideo: {
              path: n,
              mimeType: `video/${t.outputFormat || 'mp4'}`,
              size: p.finalSize,
              duration: c,
              width: l.width,
              height: l.height,
              fps: e.fps,
              format: t.outputFormat || 'mp4',
              metadata: {
                ...e.metadata,
                ...t.metadata,
                optimized: !0,
                quality: t.quality || 'high',
                hasWatermark: !!t.watermark,
              },
            },
            outputPath: n,
            fileSize: p.finalSize,
            optimizationStats: p,
            uploadUrl: d,
          },
          metadata: {
            nodeId: this.config.id,
            format: t.outputFormat || 'mp4',
            quality: t.quality || 'high',
            optimization: t.optimization || 'balanced',
          },
        };
      } catch (t) {
        try {
          await NodeCompatibility_1.NodeCompatibility.rm(a, {
            recursive: !0,
            force: !0,
          });
        } catch (t) {
          logger_1.logger.error(
            '[FinalOutputNode] Failed to clean up temp directory:',
            t
          );
        }
        throw t;
      }
    } catch (t) {
      return {
        success: !1,
        error: t instanceof Error ? t.message : 'Failed to process final video',
      };
    }
  }
  async optimizeVideo(t, e, i, a, o) {
    const r = e.startsWith('/mock/')
      ? `/mock/optimized.${i}`
      : path.join(e, `optimized.${i}`);
    if ('true' === process.env.USE_MOCK_SERVICES || t.startsWith('/mock/'))
      return r;
    let s = `ffmpeg -i "${t}"`;
    const u = {
      low: { crf: 28, bitrate: '1M' },
      medium: { crf: 23, bitrate: '2M' },
      high: { crf: 18, bitrate: '4M' },
      ultra: { crf: 15, bitrate: '8M' },
    }[a];
    return (
      (s +=
        'size' === o
          ? ` -c:v libx264 -preset slow -crf ${u.crf + 5} -c:a aac -b:a 128k`
          : 'quality' === o
            ? ` -c:v libx264 -preset veryslow -crf ${u.crf} -c:a aac -b:a 192k`
            : ` -c:v libx264 -preset medium -crf ${u.crf} -c:a aac -b:a 160k`),
      'webm' === i
        ? (s = s.replace('libx264', 'libvpx-vp9'))
        : 'mov' === i && (s += ' -f mov'),
      (s += ` "${r}"`),
      await execAsync(s),
      r
    );
  }
  async addWatermark(t, e, i) {
    if (!i) return t;
    const a = e.startsWith('/mock/')
      ? '/mock/watermarked.mp4'
      : path.join(e, 'watermarked.mp4');
    if ('true' === process.env.USE_MOCK_SERVICES || t.startsWith('/mock/'))
      return a;
    let o = `ffmpeg -i "${t}"`;
    if (i.text) {
      const t = this.getWatermarkPosition(i.position || 'bottom-right'),
        e = i.opacity || 0.7;
      o += ` -vf "drawtext=text='${i.text}':fontcolor=white@${e}:fontsize=24:${t}"`;
    } else if (i.imagePath) {
      const t = this.getOverlayPosition(i.position || 'bottom-right'),
        e = i.opacity || 0.7;
      o += ` -i "${i.imagePath}" -filter_complex "[1:v]format=rgba,colorchannelmixer=aa=${e}[logo];[0:v][logo]overlay=${t}"`;
    }
    return ((o += ` -c:a copy "${a}"`), await execAsync(o), a);
  }
  getWatermarkPosition(t) {
    const e = {
      'top-left': 'x=10:y=10',
      'top-right': 'x=w-tw-10:y=10',
      'bottom-left': 'x=10:y=h-th-10',
      'bottom-right': 'x=w-tw-10:y=h-th-10',
      center: 'x=(w-tw)/2:y=(h-th)/2',
    };
    return e[t] || e['bottom-right'];
  }
  getOverlayPosition(t) {
    const e = {
      'top-left': '10:10',
      'top-right': 'W-w-10:10',
      'bottom-left': '10:H-h-10',
      'bottom-right': 'W-w-10:H-h-10',
      center: '(W-w)/2:(H-h)/2',
    };
    return e[t] || e['bottom-right'];
  }
  async addMetadata(t, e, i, a) {
    const o = e.startsWith('/mock/')
      ? `/mock/final.${i}`
      : path.join(e, `final.${i}`);
    if ('true' === process.env.USE_MOCK_SERVICES || t.startsWith('/mock/'))
      return o;
    let r = `ffmpeg -i "${t}" -c copy`;
    return (
      a &&
        (a.title && (r += ` -metadata title="${a.title}"`),
        a.description && (r += ` -metadata comment="${a.description}"`),
        a.author && (r += ` -metadata artist="${a.author}"`),
        a.copyright && (r += ` -metadata copyright="${a.copyright}"`),
        a.tags &&
          a.tags.length > 0 &&
          (r += ` -metadata keywords="${a.tags.join(', ')}"`)),
      (r += ` "${o}"`),
      await execAsync(r),
      o
    );
  }
  async uploadVideo(t, e) {
    return `${e}://placeholder-url`;
  }
  async getVideoDuration(t) {
    const e = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${t}"`,
      { stdout: i } = await execAsync(e);
    return parseFloat(i.trim());
  }
  async getVideoDimensions(t) {
    const e = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of json "${t}"`,
      { stdout: i } = await execAsync(e),
      a = JSON.parse(i).streams[0];
    return { width: a.width, height: a.height };
  }
  validateCustom(t) {
    const e = t;
    return e.videoWithCaptions || e.editedVideo
      ? e.outputFormat && !['mp4', 'webm', 'mov'].includes(e.outputFormat)
        ? 'Invalid output format. Must be mp4, webm, or mov'
        : e.quality && !['low', 'medium', 'high', 'ultra'].includes(e.quality)
          ? 'Invalid quality. Must be low, medium, high, or ultra'
          : e.optimization &&
              !['size', 'quality', 'balanced'].includes(e.optimization)
            ? 'Invalid optimization. Must be size, quality, or balanced'
            : e.uploadTo &&
                !['local', 's3', 'youtube', 'none'].includes(e.uploadTo)
              ? 'Invalid upload destination. Must be local, s3, youtube, or none'
              : null
      : 'Either videoWithCaptions or editedVideo is required';
  }
}
exports.FinalOutputNode = FinalOutputNode;

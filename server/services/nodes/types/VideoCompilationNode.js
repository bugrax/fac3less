'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, i, a) {
          void 0 === a && (a = i);
          var o = Object.getOwnPropertyDescriptor(t, i);
          ((o &&
            !('get' in o ? !t.__esModule : o.writable || o.configurable)) ||
            (o = {
              enumerable: !0,
              get: function () {
                return t[i];
              },
            }),
            Object.defineProperty(e, a, o));
        }
      : function (e, t, i, a) {
          (void 0 === a && (a = i), (e[a] = t[i]));
        }),
  __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
      ? function (e, t) {
          Object.defineProperty(e, 'default', { enumerable: !0, value: t });
        }
      : function (e, t) {
          e.default = t;
        }),
  __importStar =
    (this && this.__importStar) ||
    (function () {
      var ownKeys = function (e) {
        return (
          (ownKeys =
            Object.getOwnPropertyNames ||
            function (e) {
              var t = [];
              for (var i in e)
                Object.prototype.hasOwnProperty.call(e, i) && (t[t.length] = i);
              return t;
            }),
          ownKeys(e)
        );
      };
      return function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
          for (var i = ownKeys(e), a = 0; a < i.length; a++)
            'default' !== i[a] && __createBinding(t, e, i[a]);
        return (__setModuleDefault(t, e), t);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VideoCompilationNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  fs_1 = require('fs'),
  path = __importStar(require('path')),
  uuid_1 = require('uuid'),
  NodeCompatibility_1 = require('../../utils/NodeCompatibility'),
  child_process_1 = require('child_process'),
  util_1 = require('util'),
  logger_1 = require('../../../utils/logger'),
  execAsync = (0, util_1.promisify)(child_process_1.exec);
class VideoCompilationNode extends BaseNode_1.BaseNode {
  outputDir;
  tempDir;
  constructor(config) {
    (super({ ...config, type: 'video_compilation' }),
      (this.outputDir = process.env.VIDEO_OUTPUT_DIR || './output/videos'),
      (this.tempDir = process.env.TEMP_DIR || './temp'));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'videos',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of video clips to compile',
          required: !1,
        },
        {
          name: 'images',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of images to include',
          required: !1,
        },
        {
          name: 'audio',
          type: DataTypes_1.DataType.AUDIO,
          description: 'Narration or voice-over audio',
          required: !1,
        },
        {
          name: 'audioFiles',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of audio files matching video segments',
          required: !1,
        },
        {
          name: 'backgroundAudio',
          type: DataTypes_1.DataType.AUDIO,
          description: 'Background audio',
          required: !1,
        },
        {
          name: 'captions',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Captions/subtitles to overlay',
          required: !1,
        },
        {
          name: 'script',
          type: DataTypes_1.DataType.SCRIPT,
          description: 'Script for timing and scene information',
          required: !1,
        },
        {
          name: 'transitions',
          type: DataTypes_1.DataType.TEXT,
          description: 'Transition type (fade, dissolve, wipe)',
          required: !1,
          defaultValue: 'fade',
        },
        {
          name: 'resolution',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output resolution (1920x1080, 1280x720, etc)',
          required: !1,
          defaultValue: '1920x1080',
        },
        {
          name: 'fps',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Frames per second (24, 30, 60)',
          required: !1,
          defaultValue: 30,
          validator: e => [24, 25, 30, 60].includes(e),
        },
        {
          name: 'format',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output format (mp4, webm, mov)',
          required: !1,
          defaultValue: 'mp4',
        },
        {
          name: 'outputPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Custom output path for final video',
          required: !1,
        },
      ],
      outputs: [
        {
          name: 'video',
          type: DataTypes_1.DataType.VIDEO,
          description: 'Compiled video file',
        },
        {
          name: 'duration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Total video duration in seconds',
        },
        {
          name: 'fileSize',
          type: DataTypes_1.DataType.NUMBER,
          description: 'File size in bytes',
        },
        {
          name: 'resolution',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output resolution',
        },
      ],
    };
  }
  async execute(e, t) {
    try {
      if (!e.videos?.length && !e.images?.length)
        throw new Error('No video or image content provided for compilation');
      (this.updateProgress(10),
        await fs_1.promises.mkdir(this.outputDir, { recursive: !0 }),
        await fs_1.promises.mkdir(this.tempDir, { recursive: !0 }));
      const t = `compiled_${(0, uuid_1.v4)()}.${e.format || 'mp4'}`,
        i = e.outputPath || path.join(this.outputDir, t),
        a = path.join(this.tempDir, `compile_${(0, uuid_1.v4)()}`);
      (await fs_1.promises.mkdir(a, { recursive: !0 }),
        this.updateProgress(20));
      try {
        let t;
        if (e.videos && e.videos.length > 0)
          t = await this.compileVideoClips(
            e.videos,
            a,
            e.transitions || 'fade',
            e.resolution || '1920x1080',
            e.fps || 30,
            e.audioFiles
          );
        else {
          if (!(e.images && e.images.length > 0))
            throw new Error('No visual content to compile');
          t = await this.createVideoFromImages(
            e.images,
            a,
            e.script,
            e.resolution || '1920x1080',
            e.fps || 30
          );
        }
        (this.updateProgress(50),
          (!e.audio && !e.backgroundAudio) ||
            e.audioFiles ||
            (t = await this.addAudioTracks(t, e.audio, e.backgroundAudio, a)),
          this.updateProgress(70),
          e.captions &&
            e.captions.length > 0 &&
            (t = await this.addCaptions(t, e.captions, a)),
          this.updateProgress(85),
          await fs_1.promises.rename(t, i));
        const o = await fs_1.promises.stat(i),
          r = await this.getVideoMetadata(i);
        (this.updateProgress(95),
          await NodeCompatibility_1.NodeCompatibility.rm(a, {
            recursive: !0,
            force: !0,
          }),
          this.updateProgress(100));
        return {
          success: !0,
          data: {
            video: {
              path: i,
              url: `/videos/${path.basename(i)}`,
              mimeType: `video/${e.format || 'mp4'}`,
              size: o.size,
              width: r.width,
              height: r.height,
              duration: r.duration,
              fps: r.fps,
              format: e.format || 'mp4',
            },
            duration: r.duration,
            fileSize: o.size,
            resolution: `${r.width}x${r.height}`,
          },
          metadata: { nodeId: this.config.id, processingTime: Date.now() },
        };
      } finally {
        try {
          await NodeCompatibility_1.NodeCompatibility.rm(a, {
            recursive: !0,
            force: !0,
          });
        } catch (e) {
          logger_1.logger.warn('Failed to clean up temporary directory', {
            workDir: a,
            error: e instanceof Error ? e.message : 'Unknown error',
          });
        }
      }
    } catch (t) {
      return (
        logger_1.logger.error('Video compilation failed', {
          nodeId: this.config.id,
          error: t instanceof Error ? t.message : 'Unknown error',
          stack: t instanceof Error ? t.stack : void 0,
          input: {
            hasVideos: !!e.videos?.length,
            hasImages: !!e.images?.length,
            hasAudio: !!e.audio,
            hasBackgroundAudio: !!e.backgroundAudio,
            hasCaptions: !!e.captions?.length,
          },
        }),
        {
          success: !1,
          error: t instanceof Error ? t.message : 'Failed to compile video',
        }
      );
    }
  }
  async compileVideoClips(e, t, i, a, o, r) {
    if ((this.updateProgress(25), r && r.length > 0))
      return this.compileVideoWithAudioSync(e, r, t, a, o);
    const s = path.join(t, 'concat.txt'),
      n = e.map(e => `file '${e.path}'`).join('\n');
    await fs_1.promises.writeFile(s, n);
    const p = path.join(t, 'compiled.mp4'),
      d = `ffmpeg -f concat -safe 0 -i "${s}"       -vf "scale=${a},fps=${o}"       -c:v libx264 -preset medium -crf 23       -c:a aac -b:a 192k       -movflags +faststart       "${p}"`;
    return (await execAsync(d), this.updateProgress(45), p);
  }
  async compileVideoWithAudioSync(e, t, i, a, o) {
    const r = [],
      s = 20 / Math.max(e.length, t.length);
    for (let n = 0; n < Math.min(e.length, t.length); n++) {
      const p = e[n],
        d = t[n],
        u = path.join(i, `synced_${n}.mp4`),
        c = await this.getAudioDuration(d.path),
        l = `ffmpeg -i "${p.path}" -i "${d.path}"         -t ${c}         -c:v libx264 -preset medium -crf 23         -vf "scale=${a},fps=${o}"         -c:a aac -b:a 192k         -map 0:v:0 -map 1:a:0         -y "${u}"`;
      (await execAsync(l), r.push(u), this.updateProgress(25 + (n + 1) * s));
    }
    const n = path.join(i, 'concat_final.txt'),
      p = r.map(e => `file '${path.resolve(e)}'`).join('\n');
    await fs_1.promises.writeFile(n, p);
    const d = path.join(i, 'compiled.mp4'),
      u = `ffmpeg -f concat -safe 0 -i "${n}"       -c copy       -movflags +faststart       "${d}"`;
    await execAsync(u);
    for (const e of r)
      await fs_1.promises.unlink(e).catch(t => {
        logger_1.logger.debug('Failed to remove intermediate clip', {
          clip: e,
          error: t.message,
        });
      });
    return (
      await fs_1.promises.unlink(n).catch(e => {
        logger_1.logger.debug('Failed to remove concat file', {
          concatFile: n,
          error: e.message,
        });
      }),
      this.updateProgress(45),
      d
    );
  }
  async createVideoFromImages(e, t, i, a, o) {
    this.updateProgress(25);
    for (let i = 0; i < e.length; i++) {
      const a = path.join(t, `img_${String(i).padStart(4, '0')}.jpg`);
      await fs_1.promises.copyFile(e[i].path, a);
    }
    let r = 5;
    if (i && i.scenes.length > 0) {
      r = i.scenes.reduce((e, t) => e + (t.duration || 5), 0) / e.length;
    }
    const s = path.join(t, 'slideshow.mp4'),
      n = `ffmpeg -framerate 1/${r}       -i "${t}/img_%04d.jpg"       -vf "scale=${a},fps=${o}"       -c:v libx264 -preset medium -crf 23       -pix_fmt yuv420p       "${s}"`;
    return (await execAsync(n), this.updateProgress(45), s);
  }
  async addAudioTracks(e, t, i, a) {
    const o = path.join(a, 'with_audio.mp4');
    let r = `ffmpeg -i "${e}"`;
    return (
      t && (r += ` -i "${t.path}"`),
      i && (r += ` -i "${i.path}"`),
      t && i
        ? (r +=
            ' -filter_complex "[1:a]volume=1.2[a1];[2:a]volume=0.3[a2];[a1][a2]amix=inputs=2:duration=first:normalize=0[aout]" -map 0:v -map "[aout]"')
        : t
          ? (r +=
              ' -filter_complex "[1:a]volume=1.2[aout]" -map 0:v -map "[aout]"')
          : i && (r += ' -map 0:v -map 1:a'),
      (r += ` -c:v copy -c:a aac -b:a 192k -shortest "${o}"`),
      await execAsync(r),
      this.updateProgress(65),
      o
    );
  }
  async addCaptions(e, t, i) {
    const a = path.join(i, 'captions.srt'),
      o = this.captionsToSRT(t);
    await fs_1.promises.writeFile(a, o);
    const r = path.join(i, 'with_captions.mp4'),
      s = `ffmpeg -i "${e}" -vf "subtitles='${a}':force_style='FontSize=24,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,BorderStyle=1,Outline=2,Shadow=0'" -c:a copy "${r}"`;
    return (await execAsync(s), this.updateProgress(80), r);
  }
  captionsToSRT(e) {
    return e
      .map(
        (e, t) =>
          `${t + 1}\n${this.formatTime(e.startTime)} --\x3e ${this.formatTime(e.endTime)}\n${e.text}\n`
      )
      .join('\n');
  }
  formatTime(e) {
    const t = Math.floor(e / 3600),
      i = Math.floor((e % 3600) / 60),
      a = Math.floor(e % 60),
      o = Math.floor((e % 1) * 1e3);
    return `${String(t).padStart(2, '0')}:${String(i).padStart(2, '0')}:${String(a).padStart(2, '0')},${String(o).padStart(3, '0')}`;
  }
  async getVideoMetadata(e) {
    const t = `ffprobe -v quiet -print_format json -show_streams "${e}"`,
      { stdout: i } = await execAsync(t),
      a = JSON.parse(i).streams.find(e => 'video' === e.codec_type);
    return {
      width: a.width,
      height: a.height,
      duration: parseFloat(a.duration || '0'),
      fps: a.r_frame_rate.includes('/')
        ? parseInt(a.r_frame_rate.split('/')[0]) /
          parseInt(a.r_frame_rate.split('/')[1])
        : parseFloat(a.r_frame_rate),
    };
  }
  validateCustom(e) {
    const t = e;
    return t.videos?.length || t.images?.length
      ? t.format && !['mp4', 'webm', 'mov'].includes(t.format)
        ? 'Invalid format. Must be mp4, webm, or mov'
        : null
      : 'Either videos or images must be provided';
  }
  async getAudioDuration(e) {
    const t = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${e}"`,
      { stdout: i } = await execAsync(t);
    return parseFloat(i.trim());
  }
}
exports.VideoCompilationNode = VideoCompilationNode;

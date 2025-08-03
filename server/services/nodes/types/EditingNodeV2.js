'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, i, a) {
          void 0 === a && (a = i);
          var s = Object.getOwnPropertyDescriptor(t, i);
          ((s &&
            !('get' in s ? !t.__esModule : s.writable || s.configurable)) ||
            (s = {
              enumerable: !0,
              get: function () {
                return t[i];
              },
            }),
            Object.defineProperty(e, a, s));
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
  (exports.EditingNodeV2 = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  path = __importStar(require('path')),
  uuid_1 = require('uuid'),
  child_process_1 = require('child_process'),
  util_1 = require('util'),
  ffmpeg_service_1 = require('../../ffmpeg.service'),
  MediaFileManager_1 = require('../../media/MediaFileManager'),
  MediaAnalyzer_1 = require('../../media/MediaAnalyzer'),
  AudioVideoSyncService_1 = require('../../sync/AudioVideoSyncService'),
  EffectPipeline_1 = require('../../effects/EffectPipeline'),
  effects_1 = require('../../effects/effects/index'),
  logger_1 = require('../../../utils/logger'),
  execPromise = (0, util_1.promisify)(child_process_1.exec);
class EditingNodeV2 extends BaseNode_1.BaseNode {
  outputDir;
  currentProgress = 0;
  progressWeights = {
    download: 15,
    syncSegments: 35,
    effects: 20,
    concatenate: 20,
    finalize: 10,
  };
  ffmpegService;
  fileManager;
  mediaAnalyzer;
  audioVideoSyncService;
  effectPipeline;
  constructor(config) {
    (super({ ...config, type: 'editing' }),
      (this.outputDir = process.env.EDITED_OUTPUT_DIR || './output/edited'),
      (this.ffmpegService = new ffmpeg_service_1.FFmpegService()),
      (this.fileManager = new MediaFileManager_1.MediaFileManager()),
      (this.mediaAnalyzer = new MediaAnalyzer_1.MediaAnalyzer(
        this.ffmpegService
      )),
      (this.audioVideoSyncService =
        new AudioVideoSyncService_1.AudioVideoSyncService(
          this.mediaAnalyzer,
          this.fileManager
        )),
      (this.effectPipeline = new EffectPipeline_1.EffectPipeline()));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'videos',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of video segments from VideoGenerationNode',
          required: !0,
        },
        {
          name: 'audioFiles',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of audio narrations from AudioGenerationNode',
          required: !0,
        },
        {
          name: 'transcripts',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of transcripts from AudioGenerationNode',
          required: !0,
        },
        {
          name: 'outputPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Custom output path for the edited video',
          required: !1,
        },
        {
          name: 'enableWhipZoom',
          type: DataTypes_1.DataType.BOOLEAN,
          description: 'Apply zoom effect to first video',
          required: !1,
          defaultValue: !1,
        },
        {
          name: 'zoomDuration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Duration of zoom effect in seconds',
          required: !1,
          defaultValue: 0.3,
        },
        {
          name: 'zoomType',
          type: DataTypes_1.DataType.TEXT,
          description: 'Direction of zoom (in or out)',
          required: !1,
          defaultValue: 'out',
        },
        {
          name: 'enableIntroSound',
          type: DataTypes_1.DataType.BOOLEAN,
          description: 'Add intro sound to first segment',
          required: !1,
          defaultValue: !1,
        },
        {
          name: 'enableTransitionSounds',
          type: DataTypes_1.DataType.BOOLEAN,
          description: 'Add transition sounds between segments',
          required: !1,
          defaultValue: !1,
        },
        {
          name: 'introSoundPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Path to intro sound file',
          required: !1,
          defaultValue: 'assets/sounds/intro-whoosh.mp3',
        },
        {
          name: 'transitionSoundPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Path to transition sound file',
          required: !1,
          defaultValue: 'assets/sounds/whoosh.mp3',
        },
        {
          name: 'soundEffectVolume',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Volume for intro sound effect (0-1)',
          required: !1,
          defaultValue: 0.8,
        },
        {
          name: 'transitionSoundVolume',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Volume for transition sound effects (0-1)',
          required: !1,
          defaultValue: 0.6,
        },
      ],
      outputs: [
        {
          name: 'editedVideo',
          type: DataTypes_1.DataType.VIDEO,
          description: 'The final edited video with all segments combined',
        },
        {
          name: 'duration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Total duration of the edited video in seconds',
        },
        {
          name: 'outputPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Path to the edited video file',
        },
        {
          name: 'adjustedTranscripts',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Transcripts with adjusted timestamps',
        },
      ],
    };
  }
  async execute(e, t) {
    const i = this.validateCustom(e);
    if (i) return { success: !1, error: i };
    logger_1.logger.info('[EditingNodeV2] Starting video editing process');
    try {
      ((this.currentProgress = 0),
        await this.updateProgress(this.currentProgress));
      const t = (0, uuid_1.v4)(),
        i = await this.setupWorkspace(t);
      await this.updateProgress(5);
      const { videoPaths: a, audioPaths: s } = await this.downloadMediaFiles(
        e,
        i
      );
      await this.updateProgress(this.progressWeights.download);
      const r = await this.processWithNewPipeline(e, a, s, i),
        { finalVideoPath: o, syncSegments: n } = r;
      return { success: !0, data: await this.finalizeOutput(e, o, n, t, i) };
    } catch (e) {
      return this.handleExecutionError(e);
    }
  }
  handleExecutionError(e) {
    return (
      logger_1.logger.error('[EditingNodeV2] Error during video editing:', e),
      e instanceof Error
        ? e.message.includes('ENOSPC')
          ? { success: !1, error: 'Insufficient disk space for video editing' }
          : ((e.message.includes('ffmpeg') || e.message.includes('FFmpeg')) &&
              logger_1.logger.error(
                '[EditingNodeV2] FFmpeg error details:',
                e.message
              ),
            { success: !1, error: e.message })
        : { success: !1, error: 'Failed to edit video' }
    );
  }
  async processWithNewPipeline(e, t, i, a) {
    (logger_1.logger.info('[EditingNodeV2] Using new effect pipeline'),
      await this.handleZoomEffect(e, t, a),
      await this.updateProgress(this.progressWeights.download + 10));
    const { processedPaths: s, syncSegments: r } =
      await this.audioVideoSyncService.smartAudioVideoSync(i, t, a);
    if (
      (await this.updateProgress(
        this.progressWeights.download + this.progressWeights.syncSegments
      ),
      0 === s.length)
    )
      throw new Error('No processed segments available');
    const o = await this.createEffects(e, s),
      n = await this.processSegments(s, o, a, e);
    return (
      await this.updateProgress(
        this.progressWeights.download +
          this.progressWeights.syncSegments +
          this.progressWeights.effects +
          this.progressWeights.concatenate
      ),
      { finalVideoPath: n, syncSegments: r }
    );
  }
  async handleZoomEffect(e, t, i) {
    if (e.enableWhipZoom && t.length > 0) {
      const a = await this.applyLegacyZoomToFirstVideo(
        t[0],
        i,
        e.zoomDuration || 0.3
      );
      t[0] = a;
    }
  }
  async createEffects(e, t) {
    const i = [];
    if (
      (e.enableIntroSound &&
        i.push(
          new effects_1.IntroSoundEffect(
            {
              soundPath: e.introSoundPath,
              volume: e.soundEffectVolume,
              duration: 2,
              fadeIn: 0.1,
              fadeOut: 0.1,
            },
            this.fileManager
          )
        ),
      e.enableTransitionSounds && t.length > 1)
    ) {
      const a = await this.calculateTransitionTimestamps(t, e);
      i.push(
        new effects_1.TransitionSoundEffect(
          {
            soundPath: e.transitionSoundPath,
            volume: e.transitionSoundVolume,
            transitionTimestamps: a,
            transitionDuration: 0.5,
          },
          this.fileManager
        )
      );
    }
    return i;
  }
  async calculateTransitionTimestamps(e, t) {
    const i = [];
    let a = 0;
    const s = t.transitionDuration || 0.15;
    for (let t = 0; t < e.length - 1; t++) {
      const r = await this.mediaAnalyzer.getMediaDuration(e[t]),
        o = a + r - s;
      (i.push(o), (a += r - s));
    }
    return i;
  }
  async processSegments(e, t, i, a) {
    return 1 === e.length
      ? this.processSingleSegment(e[0], t, i)
      : this.processMultipleSegments(e, t, i, a);
  }
  async processSingleSegment(e, t, i) {
    if (0 === t.length) return e;
    const a = path.join(i, 'final_with_effects.mp4');
    return (
      await this.updateProgress(
        this.progressWeights.download + this.progressWeights.syncSegments + 10
      ),
      await this.applyEffects(t, e, a, i),
      a
    );
  }
  async processMultipleSegments(e, t, i, a) {
    await this.updateProgress(
      this.progressWeights.download + this.progressWeights.syncSegments + 10
    );
    const s = await this.concatenateSegments(e, i, a);
    if (0 === t.length) return s;
    const r = path.join(i, 'final_with_effects.mp4');
    return (
      await this.updateProgress(
        this.progressWeights.download +
          this.progressWeights.syncSegments +
          this.progressWeights.concatenate
      ),
      await this.applyEffects(t, s, r, i),
      r
    );
  }
  async applyEffects(e, t, i, a) {
    e.forEach(e => this.effectPipeline.addEffect(e));
    const s = await this.effectPipeline.execute(t, i, { tempDir: a });
    if (!s.success)
      throw new Error(`Effect pipeline failed: ${s.errors?.join(', ')}`);
  }
  async setupWorkspace(e) {
    const t = await this.fileManager.createTempDirectory(
      this.outputDir,
      `temp_${e}`
    );
    return (await this.fileManager.ensureDirectory(this.outputDir), t);
  }
  async applyLegacyZoomToFirstVideo(e, t, i) {
    logger_1.logger.info(
      `[EditingNodeV2] Applying legacy zoom to first video: duration=${i}s`
    );
    const a = path.join(t, 'first_video_zoomed.mp4'),
      s = await this.mediaAnalyzer.probeMedia(e),
      r = s.streams.find(e => 'video' === e.codec_type),
      o = s.streams.find(e => 'audio' === e.codec_type);
    if (!r) throw new Error('No video stream found');
    const n = r.width || 720,
      d = r.height || 1280,
      u = Math.round(24 * i),
      l = `ffmpeg -loglevel error -i "${e}" -filter_complex "[0:v]scale=${3 * n}:${3 * d},zoompan=z='if(lte(on,${u}),3-2*on/${u},1)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=${n}x${d}:fps=24[v]" -map "[v]" ${o ? '-map 0:a' : ''} -c:v libx264 -preset fast -crf 23 ${o ? '-c:a copy' : ''} -pix_fmt yuv420p -movflags +faststart "${a}" -y`;
    try {
      return (
        await execPromise(l),
        logger_1.logger.info(
          '[EditingNodeV2] Legacy zoom applied successfully'
        ),
        a
      );
    } catch (t) {
      return (
        logger_1.logger.error(
          '[EditingNodeV2] Failed to apply legacy zoom:',
          t
        ),
        e
      );
    }
  }
  async downloadMediaFiles(e, t) {
    return {
      videoPaths: await this.fileManager.downloadFiles(
        e.videos.map(e => e.video.path),
        t,
        'video'
      ),
      audioPaths: await this.fileManager.downloadFiles(
        e.audioFiles.map(e => e.path),
        t,
        'audio'
      ),
    };
  }
  async concatenateSegments(e, t, i) {
    if (
      (logger_1.logger.info(
        `[EditingNodeV2] Concatenating ${e.length} segments with ${i.transitionType || 'diagonal'} transitions`
      ),
      1 === e.length)
    )
      return e[0];
    const a = path.join(t, 'concatenated_with_transitions.mp4'),
      s = await this.buildFilterComplex(e, i),
      r = e.map(e => `-i "${e}"`).join(' '),
      o = `ffmpeg ${r} -filter_complex "${s}" -map "[vout]" -map "[aout]" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "${a}"`;
    logger_1.logger.info(
      `[EditingNodeV2] Concatenating ${e.length} segments with ${i.transitionType || 'diagonal'} transitions`
    );
    try {
      await execPromise(o);
    } catch (e) {
      throw (
        logger_1.logger.error('[EditingNodeV2] FFmpeg transition error:', e),
        e
      );
    }
    return a;
  }
  async buildFilterComplex(e, t) {
    let i = this.buildNormalizeStreams(e);
    return ((i += await this.buildTransitionFilters(e, t)), i);
  }
  buildNormalizeStreams(e) {
    let t = '';
    for (let i = 0; i < e.length; i++)
      ((t += `[${i}:v]scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:-1:-1,setsar=1[v${i}]; `),
        (t += `[${i}:a]aformat=sample_rates=44100:channel_layouts=stereo[a${i}]; `));
    return t;
  }
  async buildTransitionFilters(e, t) {
    let i = '',
      a = '[v0]',
      s = '[a0]',
      r = 0;
    for (let o = 0; o < e.length - 1; o++) {
      const n = await this.calculateTransitionData(e, o, t, r),
        d = o === e.length - 2 ? '[vout]' : `[vtrans${o}]`,
        u = o === e.length - 2 ? '[aout]' : `[atrans${o}]`;
      ((i += `${a}[v${o + 1}]xfade=transition=${n.filter}:duration=${n.duration}:offset=${n.offset}${d}; `),
        (i += `${s}[a${o + 1}]acrossfade=d=${n.duration}:c1=tri:c2=tri${u}; `),
        (a = d),
        (s = u),
        (r = n.newCumulativeOffset));
    }
    return i;
  }
  async calculateTransitionData(e, t, i, a) {
    const s = this.getTransitionForIndex(t, i.transitionType || 'diagonal'),
      r = i.transitionDuration || 0.15,
      o = await this.mediaAnalyzer.getMediaDuration(e[t]);
    return {
      filter: s,
      duration: r,
      offset: a + o - r,
      newCumulativeOffset: a + o - r,
    };
  }
  getTransitionForIndex(e, t) {
    const i = ['diagtl', 'diagtr', 'diagbl', 'diagbr'],
      a = [
        'diagtl',
        'slideright',
        'wipeup',
        'squeezeh',
        'diagbr',
        'slideleft',
        'wipedown',
        'squeezev',
        'diagtr',
        'slideup',
        'wiperight',
        'dissolve',
        'diagbl',
        'slidedown',
        'wipeleft',
        'radial',
      ];
    return (
      {
        diagonal: i[e % 4],
        slide: ['slideleft', 'slideright', 'slideup', 'slidedown'][e % 4],
        wipe: ['wipeleft', 'wiperight', 'wipeup', 'wipedown'][e % 4],
        squeeze: ['squeezeh', 'squeezev'][e % 2],
        mixed: a[e % a.length],
      }[t] || i[e % 4]
    );
  }
  async finalizeOutput(e, t, i, a, s) {
    const r = `edited_${a}.mp4`,
      o = e.outputPath || path.join(this.outputDir, r);
    if (!o || '' === o.trim())
      throw new Error(
        `Invalid output path: outputPath="${o}", outputDir="${this.outputDir}", outputFilename="${r}"`
      );
    if ((await this.fileManager.moveFile(t, o), !o || '' === o.trim()))
      throw new Error(
        `Memory corruption detected: outputPath became empty after moveFile operation. originalPath="${e.outputPath}", outputDir="${this.outputDir}", outputFilename="${r}"`
      );
    const n = await this.mediaAnalyzer.getVideoMetadata(o);
    (logger_1.logger.info(
      `[EditingNodeV2] Calculating adjusted transcripts: ${e.transcripts.length} transcripts, ${i.length} sync segments`
    ),
      logger_1.logger.debug(
        '[EditingNodeV2] Input transcripts:',
        e.transcripts.map((e, t) => ({
          index: t,
          text: e.substring(0, 50) + '...',
          length: e.length,
        }))
      ));
    const d = this.audioVideoSyncService.calculateAdjustedTranscripts(
      e.transcripts,
      i
    );
    (logger_1.logger.info(
      `[EditingNodeV2] Adjusted transcripts created: ${d.length} transcripts`
    ),
      logger_1.logger.debug(
        '[EditingNodeV2] Adjusted transcript timings:',
        d.map((e, t) => ({
          index: t,
          text: e.text.substring(0, 50) + '...',
          startTime: e.startTime,
          endTime: e.endTime,
          duration: e.endTime - e.startTime,
        }))
      ),
      await this.updateProgress(
        this.progressWeights.download +
          this.progressWeights.syncSegments +
          this.progressWeights.effects +
          this.progressWeights.concatenate +
          this.progressWeights.finalize
      ),
      await this.fileManager.cleanupDirectory(s),
      await this.updateProgress(100));
    const u = {
      editedVideo: {
        path: o,
        mimeType: 'video/mp4',
        size: (await this.fileManager.getFileStats(o)).size,
        duration: n.duration,
        width: n.width,
        height: n.height,
        fps: n.fps,
        format: 'mp4',
      },
      duration: n.duration,
      outputPath: o,
      adjustedTranscripts: d,
    };
    return (
      logger_1.logger.info(
        `[EditingNodeV2] Video editing completed. Output: ${o}`
      ),
      u
    );
  }
  validateCustom(e) {
    return e.videos && 0 !== e.videos.length
      ? e.audioFiles && 0 !== e.audioFiles.length
        ? e.transcripts && 0 !== e.transcripts.length
          ? e.videos.length !== e.audioFiles.length
            ? 'Mismatch between number of videos and audio files'
            : null
          : 'No transcripts provided'
        : 'No audio files provided'
      : 'No video segments provided';
  }
}
exports.EditingNodeV2 = EditingNodeV2;

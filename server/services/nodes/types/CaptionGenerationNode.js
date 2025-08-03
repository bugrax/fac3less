'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, i, o) {
          void 0 === o && (o = i);
          var r = Object.getOwnPropertyDescriptor(t, i);
          ((r &&
            !('get' in r ? !t.__esModule : r.writable || r.configurable)) ||
            (r = {
              enumerable: !0,
              get: function () {
                return t[i];
              },
            }),
            Object.defineProperty(e, o, r));
        }
      : function (e, t, i, o) {
          (void 0 === o && (o = i), (e[o] = t[i]));
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
          for (var i = ownKeys(e), o = 0; o < i.length; o++)
            'default' !== i[o] && __createBinding(t, e, i[o]);
        return (__setModuleDefault(t, e), t);
      };
    })();
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.CaptionGenerationNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  OutputConfigs_1 = require('./OutputConfigs'),
  fs_1 = require('fs'),
  path = __importStar(require('path')),
  uuid_1 = require('uuid'),
  testMedia_1 = require('../../../../config/testMedia'),
  CaptionFormatService_1 = require('../../captions/CaptionFormatService'),
  CaptionTimingService_1 = require('../../captions/CaptionTimingService'),
  CaptionVideoEmbedder_1 = require('../../captions/CaptionVideoEmbedder'),
  OpenAIWhisperService_1 = require('../../ai/stt/OpenAIWhisperService'),
  logger_1 = require('../../../utils/logger'),
  child_process_1 = require('child_process'),
  util_1 = require('util'),
  execPromise = (0, util_1.promisify)(child_process_1.exec);
class CaptionGenerationNode extends BaseNode_1.BaseNode {
  outputDir;
  captionFormatService;
  timingService;
  videoEmbedder;
  whisperService;
  constructor(config) {
    if (
      (super({ ...config, type: 'caption_generation' }),
      (this.outputDir = process.env.CAPTION_OUTPUT_DIR ?? './output/captions'),
      (this.captionFormatService =
        new CaptionFormatService_1.CaptionFormatService()),
      (this.timingService = new CaptionTimingService_1.CaptionTimingService()),
      (this.videoEmbedder = new CaptionVideoEmbedder_1.CaptionVideoEmbedder(
        this.outputDir
      )),
      !(0, testMedia_1.isTestMode)() && process.env.REPLICATE_API_TOKEN)
    )
      try {
        ((this.whisperService =
          new OpenAIWhisperService_1.OpenAIWhisperService()),
          logger_1.logger.info(
            '[CaptionGenerationNode] ✅ OpenAI Whisper service initialized successfully'
          ));
      } catch (e) {
        (logger_1.logger.error(
          '[CaptionGenerationNode] ❌ Failed to initialize OpenAI Whisper service:',
          e
        ),
          (this.whisperService = void 0));
      }
    else
      (logger_1.logger.info(
        `[CaptionGenerationNode] Whisper service not initialized - testMode: ${(0, testMedia_1.isTestMode)()}, hasAPIKey: ${!!process.env.REPLICATE_API_TOKEN}`
      ),
        (this.whisperService = void 0));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'editedVideo',
          type: DataTypes_1.DataType.VIDEO,
          description: 'Edited video from EditingNode',
          required: !0,
        },
        {
          name: 'language',
          type: DataTypes_1.DataType.TEXT,
          description: 'Language code (e.g., en, es, fr)',
          required: !1,
          defaultValue: 'en',
        },
        {
          name: 'maxLineLength',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Maximum characters per line',
          required: !1,
          defaultValue: 42,
          validator: e => 'number' == typeof e && e >= 15 && e <= 100,
        },
        {
          name: 'position',
          type: DataTypes_1.DataType.TEXT,
          description: 'Caption position on screen',
          required: !1,
          defaultValue: 'bottom',
          validator: e =>
            'string' == typeof e &&
            ['bottom', 'middle', '60percent'].includes(e),
        },
        {
          name: 'fontSize',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Font size in pixels (40-80)',
          required: !1,
          defaultValue: 54,
          validator: e => 'number' == typeof e && e >= 40 && e <= 80,
        },
        {
          name: 'fontFamily',
          type: DataTypes_1.DataType.TEXT,
          description: 'Font family for captions',
          required: !1,
          defaultValue: 'Archivo Black',
          validator: e =>
            'string' == typeof e &&
            [
              'Archivo Black',
              'Bebas Neue',
              'Impact',
              'Oswald',
              'Rubik Bold',
            ].includes(e),
        },
        {
          name: 'color',
          type: DataTypes_1.DataType.TEXT,
          description: 'Text color (hex or name)',
          required: !1,
          defaultValue: '#FFFFFF',
        },
        {
          name: 'outputFormat',
          type: DataTypes_1.DataType.TEXT,
          description: 'Output format (srt, vtt, json, ass)',
          required: !1,
          defaultValue: 'ass',
        },
        {
          name: 'embedInVideo',
          type: DataTypes_1.DataType.BOOLEAN,
          description: 'Whether to embed captions directly in the video',
          required: !1,
          defaultValue: !0,
        },
        {
          name: 'outputPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Custom output path for caption file',
          required: !1,
        },
        {
          name: 'lineHeight',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Line height multiplier (1.0 = normal, 1.5 = 150%)',
          required: !1,
          defaultValue: 1,
          validator: e => 'number' == typeof e && e >= 0.5 && e <= 3,
        },
        {
          name: 'speechRate',
          type: DataTypes_1.DataType.NUMBER,
          description:
            'TTS speech rate multiplier (0.5 = half speed, 2.0 = double speed)',
          required: !1,
          defaultValue: 1,
          validator: e => 'number' == typeof e && e >= 0.5 && e <= 2,
        },
        {
          name: 'captionLeadTime',
          type: DataTypes_1.DataType.NUMBER,
          description: 'How early captions appear before speech (in seconds)',
          required: !1,
          defaultValue: 0.05,
          validator: e => 'number' == typeof e && e >= 0 && e <= 1,
        },
      ],
      outputs: OutputConfigs_1.OutputPresets.captionGeneration(),
    };
  }
  async execute(e, t) {
    logger_1.logger.debug(
      '[CaptionGenerationNode] Starting caption generation',
      {
        embedInVideo: e.embedInVideo,
        hasEditedVideo: !!e.editedVideo,
        language: e.language,
      }
    );
    try {
      if ((this.updateProgress(10), !e.editedVideo?.path))
        throw new Error('Edited video is required for caption generation');
      let t;
      logger_1.logger.info(
        '[CaptionGenerationNode] Using new approach: Extracting audio from edited video'
      );
      const i = await this.extractAudioFromVideo(e.editedVideo.path);
      try {
        if (
          (this.updateProgress(20),
          (0, testMedia_1.isTestMode)() || !this.whisperService)
        ) {
          logger_1.logger.info(
            `[CaptionGenerationNode] Using mock whisper transcription - testMode: ${(0, testMedia_1.isTestMode)()}, hasWhisperService: ${!!this.whisperService}`
          );
          let i = [
            { word: 'Welcome', start: 0, end: 0.5 },
            { word: 'to', start: 0.5, end: 0.7 },
            { word: 'this', start: 0.7, end: 1 },
            { word: 'test', start: 1, end: 1.3 },
            { word: 'video', start: 1.3, end: 1.8 },
            { word: 'demonstration', start: 1.8, end: 2.8 },
            { word: 'of', start: 2.8, end: 3 },
            { word: 'single-word', start: 3, end: 3.7 },
            { word: 'captions', start: 3.7, end: 4.3 },
            { word: 'system', start: 4.3, end: 5 },
          ];
          (e.transitionInfo &&
            ((i = this.applyTransitionDriftCompensation(i, e.transitionInfo)),
            logger_1.logger.info(
              `[CaptionGenerationNode] Applied transition drift compensation to mock data for ${e.transitionInfo.segmentCount} segments`
            )),
            this.updateProgress(40),
            (t = await this.timingService.generateSingleWordCaptions(
              i,
              e.captionLeadTime,
              0
            )),
            logger_1.logger.info(
              `[CaptionGenerationNode] Generated ${t.length} single-word captions from mock word data`
            ));
        } else
          try {
            logger_1.logger.info(
              `[CaptionGenerationNode] Processing extracted audio with Whisper: ${i}`
            );
            const o = await this.whisperService.extractWordLevelTimestamps(i);
            if (
              (logger_1.logger.info(
                `[CaptionGenerationNode] Transcription completed: "${o.text}" (${o.words?.length || 0} words)`
              ),
              this.updateProgress(40),
              o.words && o.words.length > 0)
            ) {
              let i = o.words;
              (e.transitionInfo &&
                ((i = this.applyTransitionDriftCompensation(
                  o.words,
                  e.transitionInfo
                )),
                logger_1.logger.info(
                  `[CaptionGenerationNode] Applied transition drift compensation for ${e.transitionInfo.segmentCount} segments`
                )),
                logger_1.logger.info(
                  `[CaptionGenerationNode] Using ${i.length} word-level timestamps for single-word captions`
                ),
                (t = await this.timingService.generateSingleWordCaptions(
                  i,
                  e.captionLeadTime,
                  0
                )),
                logger_1.logger.info(
                  `[CaptionGenerationNode] Generated ${t.length} single-word captions from Whisper word data`
                ));
            } else {
              if (!(o.segments && o.segments.length > 0))
                throw new Error('No transcription data returned from Whisper');
              {
                logger_1.logger.warn(
                  '[CaptionGenerationNode] No word-level data available, falling back to segment-based captions'
                );
                const i = o.segments.map((e, t) => ({
                    text: e.text.trim(),
                    startTime: e.start,
                    endTime: e.end,
                    originalIndex: t,
                  })),
                  r = e.maxLineLength || 42;
                ((t = await this.timingService.generateFromAdjustedTranscripts(
                  i,
                  r,
                  e.captionLeadTime,
                  0
                )),
                  logger_1.logger.info(
                    `[CaptionGenerationNode] Generated ${t.length} captions from Whisper segments (fallback)`
                  ));
              }
            }
          } catch (e) {
            throw (
              logger_1.logger.error(
                '[CaptionGenerationNode] Whisper processing failed:',
                e
              ),
              new Error(
                `Whisper STT processing failed: ${e instanceof Error ? e.message : String(e)}`
              )
            );
          }
      } finally {
        await this.cleanupTempFile(i);
      }
      let o, r;
      if (
        (this.updateProgress(70),
        (t = this.timingService.applyStyling(
          t,
          e.position,
          e.fontSize,
          e.color
        )),
        'true' !== process.env.USE_MOCK_SERVICES &&
          (await fs_1.promises.mkdir(this.outputDir, { recursive: !0 })),
        (0, testMedia_1.isTestMode)())
      )
        ((o = (0, testMedia_1.getNextTestFile)('caption')),
          logger_1.logger.info(
            `[CaptionGenerationNode] TEST MODE - Using test caption: ${o}`
          ));
      else {
        const t = `captions_${(0, uuid_1.v4)()}.${e.outputFormat || 'ass'}`;
        o =
          e.outputPath ||
          ('true' === process.env.USE_MOCK_SERVICES
            ? `/mock/${t}`
            : path.join(this.outputDir, t));
      }
      ((0, testMedia_1.isTestMode)() ||
        (await this.saveCaptions(t, o, e.outputFormat || 'ass', e)),
        this.updateProgress(80),
        e.embedInVideo &&
          ((r = await this.videoEmbedder.embedCaptionsInVideo(
            e.editedVideo,
            o,
            e.outputFormat || 'ass',
            {
              fontFamily: e.fontFamily,
              position: e.position,
              fontSize: e.fontSize,
            }
          )),
          this.updateProgress(95)));
      const a = t.length > 0 ? t[t.length - 1].endTime : 0;
      return (
        this.updateProgress(100),
        {
          success: !0,
          data: {
            captions: t,
            captionFile: o,
            videoWithCaptions: r,
            format: e.outputFormat || 'srt',
            duration: a,
          },
          metadata: {
            nodeId: this.config.id,
            captionCount: t.length,
            language: e.language || 'en',
            embedded: !!r,
          },
        }
      );
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to generate captions',
      };
    }
  }
  async saveCaptions(e, t, i, o) {
    if ('true' === process.env.USE_MOCK_SERVICES || t.startsWith('/mock/'))
      return;
    const r = this.captionFormatService.convert(e, i, o);
    await fs_1.promises.writeFile(t, r, 'utf8');
  }
  validateCustom(e) {
    const t = e;
    return t.editedVideo
      ? t.outputFormat &&
        !['srt', 'vtt', 'json', 'ass'].includes(t.outputFormat)
        ? 'Invalid output format. Must be srt, vtt, json, or ass'
        : t.position && !['bottom', 'middle', '60percent'].includes(t.position)
          ? 'Invalid position. Must be bottom, middle, or 60percent'
          : null
      : 'Edited video is required for caption generation';
  }
  async extractAudioFromVideo(e) {
    'true' !== process.env.USE_MOCK_SERVICES &&
      (await fs_1.promises.mkdir(this.outputDir, { recursive: !0 }));
    const t = path.join(this.outputDir, `temp_audio_${(0, uuid_1.v4)()}.wav`);
    logger_1.logger.info(
      `[CaptionGenerationNode] Extracting audio from edited video to: ${t}`
    );
    const i = `ffmpeg -i "${e}" -vn -acodec pcm_s16le -ar 44100 -avoid_negative_ts make_zero "${t}" -y`;
    try {
      return (
        await execPromise(i),
        logger_1.logger.info(
          '[CaptionGenerationNode] Audio extraction completed successfully with timing precision'
        ),
        t
      );
    } catch (e) {
      throw (
        logger_1.logger.error(
          '[CaptionGenerationNode] Failed to extract audio:',
          e
        ),
        new Error(
          `Failed to extract audio from video: ${e instanceof Error ? e.message : String(e)}`
        )
      );
    }
  }
  async cleanupTempFile(e) {
    try {
      (await fs_1.promises.unlink(e),
        logger_1.logger.debug(
          `[CaptionGenerationNode] Cleaned up temp file: ${e}`
        ));
    } catch (t) {
      logger_1.logger.warn(
        `[CaptionGenerationNode] Failed to cleanup temp file: ${e}`,
        t
      );
    }
  }
  applyTransitionDriftCompensation(e, t) {
    const { segmentCount: i, segmentDuration: o, transitionDuration: r } = t;
    return e.map(e => {
      const t = Math.floor(e.start / o),
        a = Math.min(t, i - 1),
        n = a * r,
        s = {
          ...e,
          start: Math.max(0, e.start - n),
          end: Math.max(0, e.end - n),
        };
      return (
        a < 3 &&
          e.start < 2 * o &&
          logger_1.logger.debug(
            `[TransitionCompensation] Word "${e.word}" segment ${a}: ${e.start.toFixed(3)}s → ${s.start.toFixed(3)}s (drift: -${n.toFixed(3)}s)`
          ),
        s
      );
    });
  }
}
exports.CaptionGenerationNode = CaptionGenerationNode;

'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.AudioGenerationNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  MinimaxTTS_1 = require('../../ai/tts/MinimaxTTS'),
  fs_1 = require('fs'),
  uuid_1 = require('uuid'),
  FileCleanupService_1 = require('../../utils/FileCleanupService'),
  testMedia_1 = require('../../../../config/testMedia'),
  MediaAnalyzer_1 = require('../../media/MediaAnalyzer'),
  logger_1 = require('../../../utils/logger');
class AudioGenerationNode extends BaseNode_1.BaseNode {
  minimaxTTSClient = null;
  outputDir;
  mediaAnalyzer;
  constructor(config) {
    (super({ ...config, type: 'audio_generation' }),
      process.env.REPLICATE_API_TOKEN &&
        (this.minimaxTTSClient = new MinimaxTTS_1.MinimaxTTSClient()),
      (this.outputDir = process.env.AUDIO_OUTPUT_DIR ?? './output/audio'),
      (this.mediaAnalyzer = new MediaAnalyzer_1.MediaAnalyzer()));
  }
  defineDefaultPorts() {
    return {
      inputs: [
        {
          name: 'script',
          type: DataTypes_1.DataType.SCRIPT,
          description: 'Script data with sections to convert to speech',
          required: !0,
        },
        {
          name: 'voice',
          type: DataTypes_1.DataType.TEXT,
          description: 'Voice selection from MiniMax TTS',
          required: !1,
          defaultValue: 'Friendly_Person',
        },
        {
          name: 'pitch',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Voice pitch adjustment (-2 to 2)',
          required: !1,
          defaultValue: 0,
          validator: e => 'number' == typeof e && e >= -2 && e <= 2,
        },
        {
          name: 'speed',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Speech speed (0.5 - 2.0)',
          required: !1,
          defaultValue: 1,
          validator: e => 'number' == typeof e && e >= 0.5 && e <= 2,
        },
        {
          name: 'language',
          type: DataTypes_1.DataType.TEXT,
          description:
            'Language for audio generation (used for automatic language detection)',
          required: !1,
        },
        {
          name: 'outputPath',
          type: DataTypes_1.DataType.TEXT,
          description: 'Custom output path for audio file',
          required: !1,
        },
      ],
      outputs: [
        {
          name: 'audioFiles',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of generated audio files (one per section)',
        },
        {
          name: 'totalDuration',
          type: DataTypes_1.DataType.NUMBER,
          description: 'Total audio duration in seconds',
        },
        {
          name: 'transcripts',
          type: DataTypes_1.DataType.ARRAY,
          description: 'Array of transcripts (one per section)',
        },
      ],
    };
  }
  async execute(e, t) {
    try {
      if (!e.script?.scenes)
        throw new Error('No script data provided for audio generation');
      const t = String(
          e.voice ?? this.config.parameters?.voice ?? 'Friendly_Person'
        ),
        i = Number(e.pitch ?? this.config.parameters?.pitch ?? 0),
        a = Number(e.speed ?? this.config.parameters?.speed ?? 1);
      (this.updateProgress(10),
        (0, testMedia_1.isTestMode)() ||
          (await fs_1.promises.mkdir(this.outputDir, { recursive: !0 })));
      const o = [],
        r = [];
      let n = 0;
      const s = e.script.scenes,
        d = 80 / s.length;
      (logger_1.logger.info(
        `[AudioGenerationNode] Processing ${s.length} script sections`
      ),
        logger_1.logger.debug(
          '[AudioGenerationNode] Sections:',
          s.map((e, t) => ({
            index: t,
            id: e.id,
            duration: e.duration,
            hasAudioPrompt: !!e.audioPrompt,
            hasText: !!e.text,
          }))
        ));
      for (let e = 0; e < s.length; e++) {
        const u = s[e];
        let c = u.audioPrompt ?? u.text ?? '';
        if (((c = this.sanitizeSectionText(c, e)), !c)) continue;
        const p = 10 + e * d;
        if (
          (this.updateProgress(p),
          !this.minimaxTTSClient && !(0, testMedia_1.isTestMode)())
        )
          throw new Error(
            'MiniMax TTS client not initialized. Check API token configuration.'
          );
        try {
          const s = await this.generateAudioForSection(c, t, i, a, e, u);
          (o.push(s), r.push(c), s.duration && (n += s.duration));
        } catch (n) {
          const s = this.createErrorAudioData(c, t, i, a, e, u, n);
          (o.push(s), r.push(c));
        }
        this.updateProgress(10 + (e + 1) * d);
      }
      const u = FileCleanupService_1.FileCleanupService.getInstance();
      return (
        await u.triggerCleanup(this.outputDir),
        this.updateProgress(100),
        logger_1.logger.info(
          `[AudioGenerationNode] Completed: ${o.length} audio files, ${r.length} transcripts`
        ),
        {
          success: !0,
          data: { audioFiles: o, totalDuration: n, transcripts: r },
          metadata: {
            nodeId: this.config.id,
            provider: 'minimax-speech-02-hd',
            voice: t,
            pitch: i,
            speed: a,
            sectionCount: o.length,
          },
        }
      );
    } catch (e) {
      return {
        success: !1,
        error: e instanceof Error ? e.message : 'Failed to generate audio',
      };
    }
  }
  validateCustom(e) {
    const t = e;
    return (
      logger_1.logger.debug(
        '[AudioGenerationNode] validateCustom called with input:',
        {
          hasScript: !!t.script,
          scriptKeys: t.script ? Object.keys(t.script) : [],
          hasScenes: !!t.script?.scenes,
          scenesLength: t.script?.scenes?.length,
          isTestMode: (0, testMedia_1.isTestMode)(),
        }
      ),
      t.script
        ? t.script.scenes && 0 !== t.script.scenes.length
          ? !t.voice ||
            MinimaxTTS_1.MINIMAX_VOICES[t.voice] ||
            (0, testMedia_1.isTestMode)()
            ? null
            : `Invalid voice. Must be one of: ${Object.keys(MinimaxTTS_1.MINIMAX_VOICES).join(', ')}`
          : 'Script must contain at least one scene'
        : 'Script is required for audio generation'
    );
  }
  sanitizeSectionText(e, t) {
    if (!(e = e.trim()))
      return (
        logger_1.logger.warn(
          `[AudioGenerationNode] Section ${t + 1} has no text, skipping`
        ),
        ''
      );
    const i = e.split(/\s+/).filter(e => e.length > 0).length;
    return (
      i < 3 &&
        (logger_1.logger.warn(
          `[AudioGenerationNode] Section ${t + 1} has only ${i} words (min: 3), text may be too short for TTS`
        ),
        (0, testMedia_1.isTestMode)() ||
          0 !== i ||
          (e = `Section ${t + 1} content.`)),
      (!(e = e
        .replace(/[\u{0000}-\u{001F}\u{007F}-\u{009F}]/gu, '')
        .replace(/[<>{}[\]\\]/g, '')
        .replace(/\s+/g, ' ')
        .trim()) ||
        e.length < 10) &&
        (logger_1.logger.error(
          `[AudioGenerationNode] Section ${t + 1} text too short after sanitization`
        ),
        e || (e = `Section ${t + 1}.`)),
      e
    );
  }
  async generateAudioForSection(e, t, i, a, o, r) {
    if ((0, testMedia_1.isTestMode)()) {
      const i = (0, testMedia_1.getNextTestFile)('audio');
      return (
        logger_1.logger.info(
          `[AudioGenerationNode] TEST MODE - Using test audio: ${i}`
        ),
        {
          path: i,
          mimeType: 'audio/wav',
          size: 0,
          duration: r.duration || 5,
          sampleRate: 44100,
          channels: 1,
          format: 'wav',
          metadata: { sectionId: r.id, voice: t, text: e },
        }
      );
    }
    const n = await this.minimaxTTSClient.textToSpeech({
      text: e,
      voice_id: t,
      pitch: i,
      speed: a,
      language_boost: 'Automatic',
    });
    if (!n.success || !n.data)
      return (
        logger_1.logger.error(
          `[AudioGenerationNode] Failed to generate audio for section ${o + 1}: ${n.error}`
        ),
        logger_1.logger.error(`[AudioGenerationNode] Failed text was: "${e}"`),
        this.createErrorAudioData(
          e,
          t,
          i,
          a,
          o,
          r,
          new Error(n.error ?? 'Failed to generate audio')
        )
      );
    const s = `audio_section_${o + 1}_${(0, uuid_1.v4)()}.wav`,
      d = await this.minimaxTTSClient.saveAudioToFile(n.data.audio, s),
      u = await fs_1.promises.stat(d);
    let c = n.data.duration;
    try {
      ((c = await this.mediaAnalyzer.getMediaDuration(d)),
        logger_1.logger.info(
          `[AudioGenerationNode] Section ${o + 1} - Estimated duration: ${n.data.duration.toFixed(2)}s, Actual duration: ${c.toFixed(2)}s`
        ));
    } catch (e) {
      logger_1.logger.warn(
        `[AudioGenerationNode] Failed to get actual duration for section ${o + 1}, using estimate: ${e}`
      );
    }
    return {
      path: d,
      mimeType: 'audio/wav',
      size: u.size,
      duration: c,
      sampleRate: n.data.sampleRate,
      channels: n.data.channels,
      format: n.data.format,
      metadata: {
        voice: t,
        pitch: i,
        speed: a,
        provider: 'minimax-speech-02-hd',
        sectionIndex: o + 1,
        sectionText: e,
        estimatedDuration: n.data.duration,
        actualDuration: c,
      },
    };
  }
  createErrorAudioData(e, t, i, a, o, r, n) {
    return (
      logger_1.logger.error(
        `[AudioGenerationNode] Error processing section ${o + 1}:`,
        n
      ),
      logger_1.logger.error(
        `[AudioGenerationNode] Section text that failed: "${e}"`
      ),
      {
        path: '',
        mimeType: 'audio/wav',
        size: 0,
        duration: r.duration ?? 5,
        sampleRate: 22050,
        channels: 1,
        format: 'wav',
        metadata: {
          voice: t,
          pitch: i,
          speed: a,
          provider: 'minimax-speech-02-hd',
          sectionIndex: o + 1,
          sectionText: e,
          error: n instanceof Error ? n.message : 'Unknown error',
        },
      }
    );
  }
}
exports.AudioGenerationNode = AudioGenerationNode;

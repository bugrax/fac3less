'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.exampleWorkflow = void 0),
(exports.runExample = runExample));
const WorkflowExecutor_1 = require('../services/ai/orchestration/WorkflowExecutor'),
  logger_1 = require('../utils/logger'),
  exampleWorkflow = {
    id: 'example_video_workflow',
    name: 'Text to Video Workflow',
    nodes: [
      {
        id: 'user_prompt_node',
        type: 'userPrompt',
        label: 'User Input',
        parameters: {
          idea: 'Create a 60-second educational video about the water cycle. Explain evaporation, condensation, and precipitation in simple terms suitable for middle school students.',
          duration: 30,
          dimensions: '16:9',
          style: 'educational'
        }
      },
      {
        id: 'script_node',
        type: 'script',
        label: 'Generate Script',
        parameters: { style: 'professional' }
      },
      {
        id: 'audio_gen_node',
        type: 'audio_generation',
        label: 'Generate Narration',
        parameters: { voice: 'alloy', provider: 'openai' }
      },
      {
        id: 'image_prompt_node',
        type: 'imagePrompt',
        label: 'Generate Image Prompts',
        parameters: {}
      },
      {
        id: 'image_gen_node',
        type: 'image_generation',
        label: 'Generate Images',
        parameters: { model: 'seedream-3', outputFormat: 'webp' }
      },
      {
        id: 'video_gen_node',
        type: 'video_generation',
        label: 'Generate Videos',
        parameters: { model: 'kwaivgi/kling-v2.1', mode: 'standard' }
      },
      {
        id: 'editing_node',
        type: 'editing',
        label: 'Edit Video',
        parameters: {
          backgroundAudioVolume: 0.2,
          audioFadeIn: 0.5,
          audioFadeOut: 1,
          enableWhipZoom: !0,
          zoomDuration: 0.3,
          zoomType: 'out',
          enableIntroSound: !0,
          enableTransitionSounds: !0,
          introSoundPath: 'assets/sounds/intro-whoosh.mp3',
          transitionSoundPath: 'assets/sounds/whoosh.mp3',
          soundEffectVolume: 0.8,
          transitionSoundVolume: 0.6
        }
      },
      {
        id: 'caption_gen_node',
        type: 'caption_generation',
        label: 'Generate Captions',
        parameters: {
          style: 'subtitles',
          language: 'en',
          embedInVideo: !0,
          outputFormat: 'vtt'
        }
      },
      {
        id: 'final_output_node',
        type: 'final_output',
        label: 'Final Output',
        parameters: {
          outputFormat: 'mp4',
          quality: 'high',
          optimization: 'balanced'
        }
      }
    ],
    edges: [
      {
        id: 'edge_1',
        source: 'user_prompt_node',
        target: 'script_node',
        data: { sourcePort: 'prompt', targetPort: 'prompt' }
      },
      {
        id: 'edge_2',
        source: 'user_prompt_node',
        target: 'script_node',
        data: { sourcePort: 'duration', targetPort: 'duration' }
      },
      {
        id: 'edge_3',
        source: 'user_prompt_node',
        target: 'script_node',
        data: { sourcePort: 'aspectRatio', targetPort: 'aspectRatio' }
      },
      {
        id: 'edge_3b',
        source: 'user_prompt_node',
        target: 'script_node',
        data: { sourcePort: 'style', targetPort: 'style' }
      },
      {
        id: 'edge_4',
        source: 'script_node',
        target: 'audio_gen_node',
        data: { sourcePort: 'script', targetPort: 'script' }
      },
      {
        id: 'edge_5',
        source: 'script_node',
        target: 'image_prompt_node',
        data: { sourcePort: 'script', targetPort: 'script' }
      },
      {
        id: 'edge_5b',
        source: 'user_prompt_node',
        target: 'image_prompt_node',
        data: { sourcePort: 'style', targetPort: 'style' }
      },
      {
        id: 'edge_6',
        source: 'image_prompt_node',
        target: 'image_gen_node',
        data: { sourcePort: 'imagePrompts', targetPort: 'imagePrompts' }
      },
      {
        id: 'edge_7',
        source: 'user_prompt_node',
        target: 'image_gen_node',
        data: { sourcePort: 'aspectRatio', targetPort: 'aspectRatio' }
      },
      {
        id: 'edge_8',
        source: 'image_gen_node',
        target: 'video_gen_node',
        data: { sourcePort: 'images', targetPort: 'images' }
      },
      {
        id: 'edge_11',
        source: 'video_gen_node',
        target: 'editing_node',
        data: { sourcePort: 'videos', targetPort: 'videos' }
      },
      {
        id: 'edge_12',
        source: 'audio_gen_node',
        target: 'editing_node',
        data: { sourcePort: 'audioFiles', targetPort: 'audioFiles' }
      },
      {
        id: 'edge_14',
        source: 'editing_node',
        target: 'caption_gen_node',
        data: { sourcePort: 'editedVideo', targetPort: 'editedVideo' }
      },
      {
        id: 'edge_15',
        source: 'audio_gen_node',
        target: 'caption_gen_node',
        data: { sourcePort: 'transcripts', targetPort: 'transcripts' }
      },
      {
        id: 'edge_16',
        source: 'caption_gen_node',
        target: 'final_output_node',
        data: {
          sourcePort: 'videoWithCaptions',
          targetPort: 'videoWithCaptions'
        }
      }
    ]
  };
async function runExample() {
  try {
    const e = new WorkflowExecutor_1.WorkflowExecutor(),
      o = { userId: 'example_user', startTime: Date.now() },
      t = {},
      r = await e.executeWorkflow(exampleWorkflow, t, o, {
        parallel: !0,
        continueOnError: !1,
        onProgress: (e, o, t) => {
          t.forEach((e, o) => {});
        }
      });
    if ('completed' === r.status) {
      const e = r.nodeResults.get('final_output_node');
      e?.success && e.data && e.data.fileSize;
    } else {
      (logger_1.logger.error('Workflow failed:', r.error),
      r.nodeResults.forEach((e, o) => {
        e.success || logger_1.logger.error(`Node ${o} failed:`, e.error);
      }));
    }
  } catch (e) {
    throw (logger_1.logger.error('Error running workflow example:', e), e);
  }
}
((exports.exampleWorkflow = exampleWorkflow),
require.main === module && runExample().catch(console.error));

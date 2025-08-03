'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.estimateGeneration = exports.generateVideo = void 0));
const generation_service_1 = require('../../../services/generation.service'),
  logger_1 = require('../../utils/logger'),
  generateVideo = async (e, t, o) => {
    try {
      const {
        topic: o,
        duration: r,
        style: i,
        voiceType: s,
        backgroundAudio: n,
        llmModel: a,
        ...c
      } = e.body;
      if (!o) {
        return void t.status(400).json({
          error: 'Bad Request',
          message: 'Missing required field: topic',
          timestamp: new Date().toISOString()
        });
      }
      const d = {
          prompt: o,
          model: a || process.env.OPENROUTER_MODEL || 'openai/gpt-4-turbo',
          duration: r || 60,
          style: i || 'educational',
          aspectRatio: '16:9',
          settings: { voiceType: s, backgroundAudio: n, ...c }
        },
        g = await generation_service_1.generationService.generateVideo(d);
      t.status(201).json({
        success: !0,
        data: {
          jobId: g.id,
          status: g.status,
          estimatedCompletionTime: g.estimatedCompletionTime
        },
        message: 'Video generation started successfully'
      });
    } catch (t) {
      (logger_1.logger.error('Error generating video:', {
        error: t instanceof Error ? t.message : 'Unknown error',
        stack: t instanceof Error ? t.stack : void 0,
        topic: e.body.topic,
        requestId: e.id
      }),
      o(t));
    }
  };
exports.generateVideo = generateVideo;
const estimateGeneration = async (e, t, o) => {
  try {
    const { topic: o, duration: r, style: i } = e.body;
    if (!o) {
      return void t.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: topic',
        timestamp: new Date().toISOString()
      });
    }
    const s = {
        prompt: o,
        model: 'multi-model',
        duration: r || 60,
        style: i || 'educational',
        aspectRatio: '16:9',
        settings: {}
      },
      n = await generation_service_1.generationService.estimateGeneration(s);
    t.json({
      success: !0,
      data: {
        estimatedCost: n.cost,
        estimatedDuration: n.duration,
        breakdown: {
          scriptGeneration: 0.02,
          audioGeneration: 0.3 * n.cost,
          visualGeneration: 0.5 * n.cost,
          videoComposition: 0.18 * n.cost
        }
      }
    });
  } catch (t) {
    (logger_1.logger.error('Error estimating generation cost:', {
      error: t instanceof Error ? t.message : 'Unknown error',
      stack: t instanceof Error ? t.stack : void 0,
      topic: e.body.topic,
      duration: e.body.duration,
      requestId: e.id
    }),
    o(t));
  }
};
exports.estimateGeneration = estimateGeneration;

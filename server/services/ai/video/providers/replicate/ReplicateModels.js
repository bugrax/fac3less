'use strict';
function getModelById(modelId) {
  return exports.REPLICATE_VIDEO_MODELS[modelId];
}
function getAllModels() {
  return Object.values(exports.REPLICATE_VIDEO_MODELS);
}
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.REPLICATE_VIDEO_MODELS = void 0),
(exports.getModelById = getModelById),
(exports.getAllModels = getAllModels),
(exports.REPLICATE_VIDEO_MODELS = {
  'kwaivgi/kling-v2.1': {
    id: 'kwaivgi/kling-v2.1',
    name: 'Kling v2.1',
    description:
        'High-quality video generation with support for both text-to-video and image-to-video',
    provider: 'replicate',
    capabilities: [
      'text-to-video',
      'image-to-video',
      'standard-mode',
      'pro-mode'
    ],
    pricing: {
      amount: 0.05,
      unit: 'per second (standard 720p)',
      currency: 'USD',
      notes: 'Pro mode (1080p): $0.09 per second'
    }
  },
  'bytedance/seedance-1-pro': {
    id: 'bytedance/seedance-1-pro',
    name: 'Seedance 1 Pro',
    description: 'Professional image-to-video generation with camera control',
    provider: 'replicate',
    capabilities: ['image-to-video', 'camera-control', 'high-resolution'],
    pricing: { amount: 0.15, unit: 'per second', currency: 'USD' }
  },
  'bytedance/seedance-1-lite': {
    id: 'bytedance/seedance-1-lite',
    name: 'Seedance 1 Lite',
    description:
        'Lightweight image-to-video generation for quick prototyping',
    provider: 'replicate',
    capabilities: ['image-to-video', 'camera-control'],
    pricing: { amount: 0.08, unit: 'per second', currency: 'USD' }
  }
}));

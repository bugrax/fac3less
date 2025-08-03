'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.OutputPresets = exports.CommonOutputs = void 0));
const DataTypes_1 = require('../../../shared/types/DataTypes');
((exports.CommonOutputs = {
  outputPath: (t = 'Path to the output file') => ({
    name: 'outputPath',
    type: DataTypes_1.DataType.TEXT,
    description: t
  }),
  fileSize: (t = 'File size in bytes') => ({
    name: 'fileSize',
    type: DataTypes_1.DataType.NUMBER,
    description: t
  }),
  duration: (t = 'Duration in seconds') => ({
    name: 'duration',
    type: DataTypes_1.DataType.NUMBER,
    description: t
  }),
  format: (t = 'File format') => ({
    name: 'format',
    type: DataTypes_1.DataType.TEXT,
    description: t
  }),
  video: (t, e) => ({
    name: t,
    type: DataTypes_1.DataType.VIDEO,
    description: e
  }),
  array: (t, e) => ({
    name: t,
    type: DataTypes_1.DataType.ARRAY,
    description: e
  }),
  object: (t, e) => ({
    name: t,
    type: DataTypes_1.DataType.OBJECT,
    description: e
  }),
  text: (t, e) => ({
    name: t,
    type: DataTypes_1.DataType.TEXT,
    description: e
  })
}),
(exports.OutputPresets = {
  videoProcessing: () => [
    exports.CommonOutputs.video('processedVideo', 'Processed video output'),
    exports.CommonOutputs.outputPath('Path to the processed video file'),
    exports.CommonOutputs.fileSize('Processed file size in bytes'),
    exports.CommonOutputs.duration('Video duration in seconds')
  ],
  captionGeneration: () => [
    exports.CommonOutputs.array('captions', 'Array of caption objects'),
    exports.CommonOutputs.text('captionFile', 'Path to caption file'),
    exports.CommonOutputs.video(
      'videoWithCaptions',
      'Video with embedded captions (if embedInVideo is true)'
    ),
    exports.CommonOutputs.format('Caption file format'),
    exports.CommonOutputs.duration('Total duration of captions')
  ],
  finalOutput: () => [
    exports.CommonOutputs.video('finalVideo', 'Final processed video'),
    exports.CommonOutputs.outputPath('Path to the final video file'),
    exports.CommonOutputs.fileSize('Final file size in bytes'),
    exports.CommonOutputs.object(
      'optimizationStats',
      'Optimization statistics'
    ),
    exports.CommonOutputs.text('uploadUrl', 'URL if uploaded to cloud')
  ]
}));

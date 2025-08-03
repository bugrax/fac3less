'use strict';
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.testMediaConfig = void 0;
exports.getNextTestFile = getNextTestFile;
exports.isTestMode = isTestMode;
const path_1 = __importDefault(require('path'));
exports.testMediaConfig = {
  baseDir: path_1.default.resolve(process.cwd(), 'stuff'),
  videos: ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4'],
  audio: ['1.wav', '2.wav', '3.wav', '4.wav', '5.wav'],
  captions: [
    'captions_1ba72b1f-8a4a-457b-9052-a359f20ced16.ass',
    'captions_5c5a2244-7872-4c03-9567-6fda130b1ee9.ass',
    'captions_5d63257e-0099-40c4-b314-d79cfa1616c7.ass',
    'captions_8a0d4979-aa63-447d-9486-8f0a0b8f9eea.ass',
    'captions_8a328bde-7592-4990-96eb-6ef1247b9682.ass',
    'captions_8d907c3e-f8c5-4bf6-bd46-56daf1a137e7.ass'
  ],
  currentIndex: {
    video: 0,
    audio: 0,
    caption: 0
  }
};
function getNextTestFile(type) {
  const config = exports.testMediaConfig;
  let file;
  switch (type) {
  case 'video':
    file = config.videos[config.currentIndex.video];
    config.currentIndex.video =
        (config.currentIndex.video + 1) % config.videos.length;
    break;
  case 'audio':
    file = config.audio[config.currentIndex.audio];
    config.currentIndex.audio =
        (config.currentIndex.audio + 1) % config.audio.length;
    break;
  case 'caption':
    file = config.captions[config.currentIndex.caption];
    config.currentIndex.caption =
        (config.currentIndex.caption + 1) % config.captions.length;
    break;
  }
  return path_1.default.join(config.baseDir, file);
}
function isTestMode() {
  return process.env.USE_TEST_MODE === 'true';
}

'use strict';
let VideoStyle,
  VideoTone,
  AspectRatio,
  ImageStyle,
  BackgroundAudioStyle,
  TTSProvider,
  GenerationStatus;
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.GenerationStatus =
    exports.TTSProvider =
    exports.BackgroundAudioStyle =
    exports.ImageStyle =
    exports.AspectRatio =
    exports.VideoTone =
    exports.VideoStyle =
      void 0),
(function (e) {
  ((e.EDUCATIONAL = 'educational'),
  (e.ENTERTAINMENT = 'entertainment'),
  (e.PROMOTIONAL = 'promotional'),
  (e.INFORMATIONAL = 'informational'),
  (e.TUTORIAL = 'tutorial'));
})(VideoStyle || (exports.VideoStyle = VideoStyle = {})),
(function (e) {
  ((e.PROFESSIONAL = 'professional'),
  (e.CASUAL = 'casual'),
  (e.HUMOROUS = 'humorous'),
  (e.SERIOUS = 'serious'),
  (e.INSPIRATIONAL = 'inspirational'));
})(VideoTone || (exports.VideoTone = VideoTone = {})),
(function (e) {
  ((e.LANDSCAPE = '16:9'), (e.PORTRAIT = '9:16'), (e.SQUARE = '1:1'));
})(AspectRatio || (exports.AspectRatio = AspectRatio = {})),
(function (e) {
  ((e.REALISTIC = 'realistic'),
  (e.ARTISTIC = 'artistic'),
  (e.CARTOON = 'cartoon'),
  (e.ABSTRACT = 'abstract'),
  (e.PHOTOGRAPHIC = 'photographic'));
})(ImageStyle || (exports.ImageStyle = ImageStyle = {})),
(function (e) {
  ((e.CORPORATE = 'corporate'),
  (e.AMBIENT = 'ambient'),
  (e.UPBEAT = 'upbeat'),
  (e.DRAMATIC = 'dramatic'),
  (e.RELAXING = 'relaxing'));
})(
  BackgroundAudioStyle ||
      (exports.BackgroundAudioStyle = BackgroundAudioStyle = {})
),
(function (e) {
  e.RESEMBLE_AI = 'resemble-ai';
})(TTSProvider || (exports.TTSProvider = TTSProvider = {})),
(function (e) {
  ((e.IDLE = 'idle'),
  (e.SCRIPT = 'script'),
  (e.AUDIO = 'audio'),
  (e.IMAGES = 'images'),
  (e.VIDEO = 'video'),
  (e.COMPLETE = 'complete'),
  (e.FAILED = 'failed'),
  (e.CANCELLED = 'cancelled'));
})(GenerationStatus || (exports.GenerationStatus = GenerationStatus = {})));

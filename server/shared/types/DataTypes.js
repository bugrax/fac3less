'use strict';
let DataType;
function isValidDataType(t, e) {
  switch (e) {
  case DataType.TEXT:
    return 'string' === typeof t;
  case DataType.NUMBER:
    return 'number' === typeof t && !isNaN(t);
  case DataType.BOOLEAN:
    return 'boolean' === typeof t;
  case DataType.IMAGE:
    return isImageData(t);
  case DataType.VIDEO:
    return isVideoData(t);
  case DataType.AUDIO:
    return isAudioData(t);
  case DataType.SCRIPT:
    return isScriptData(t);
  case DataType.CAPTION:
    return isCaptionData(t);
  case DataType.PROMPT:
    return isPromptData(t);
  case DataType.FILE:
    return isFileData(t);
  case DataType.ARRAY:
    return Array.isArray(t);
  case DataType.OBJECT:
    return 'object' === typeof t && null !== t && !Array.isArray(t);
  case DataType.ANY:
    return !0;
  default:
    return !1;
  }
}
function isFileData(t) {
  return !!(
    t &&
    'object' === typeof t &&
    'path' in t &&
    'mimeType' in t &&
    'size' in t &&
    'string' === typeof t.path &&
    'string' === typeof t.mimeType &&
    'number' === typeof t.size
  );
}
function isImageData(t) {
  return (
    isFileData(t) &&
    'width' in t &&
    'height' in t &&
    'format' in t &&
    'number' === typeof t.width &&
    'number' === typeof t.height &&
    'string' === typeof t.format
  );
}
function isVideoData(t) {
  return (
    isFileData(t) &&
    'width' in t &&
    'height' in t &&
    'duration' in t &&
    'fps' in t &&
    'format' in t &&
    'number' === typeof t.width &&
    'number' === typeof t.height &&
    'number' === typeof t.duration &&
    'number' === typeof t.fps &&
    'string' === typeof t.format
  );
}
function isAudioData(t) {
  return (
    isFileData(t) &&
    'duration' in t &&
    'sampleRate' in t &&
    'channels' in t &&
    'format' in t &&
    'number' === typeof t.duration &&
    'number' === typeof t.sampleRate &&
    'number' === typeof t.channels &&
    'string' === typeof t.format
  );
}
function isScriptData(t) {
  if (!t || 'object' !== typeof t) {
    return !1;
  }
  const e = t;
  return (
    'content' in e &&
    'scenes' in e &&
    'string' === typeof e.content &&
    Array.isArray(e.scenes) &&
    e.scenes.every(t => {
      if (!t || 'object' !== typeof t) {
        return !1;
      }
      return 'id' in t && 'text' in t && 'string' === typeof t.text;
    })
  );
}
function isCaptionData(t) {
  return !!(
    t &&
    'object' === typeof t &&
    'text' in t &&
    'startTime' in t &&
    'endTime' in t &&
    'string' === typeof t.text &&
    'number' === typeof t.startTime &&
    'number' === typeof t.endTime
  );
}
function isPromptData(t) {
  return !!(
    t &&
    'object' === typeof t &&
    'text' in t &&
    'type' in t &&
    'string' === typeof t.text &&
    'string' === typeof t.type &&
    ['text', 'image', 'video', 'audio'].includes(t.type)
  );
}
function validatePortValue(t, e) {
  if (t.required && null == e) {
    return `Port "${t.name}" is required`;
  }
  if (null == e) {
    return null;
  }
  if (t.array) {
    if (!Array.isArray(e)) {
      return `Port "${t.name}" expects an array`;
    }
    for (const a of e) {
      if (!isValidDataType(a, t.type)) {
        return `Invalid array item type for port "${t.name}"`;
      }
    }
  } else if (!isValidDataType(e, t.type)) {
    return `Invalid data type for port "${t.name}". Expected ${t.type}`;
  }
  return t.validator && !t.validator(e)
    ? `Custom validation failed for port "${t.name}"`
    : null;
}
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.DataType = void 0),
(exports.isValidDataType = isValidDataType),
(exports.validatePortValue = validatePortValue),
(function (t) {
  ((t.TEXT = 'text'),
  (t.NUMBER = 'number'),
  (t.BOOLEAN = 'boolean'),
  (t.IMAGE = 'image'),
  (t.VIDEO = 'video'),
  (t.AUDIO = 'audio'),
  (t.SCRIPT = 'script'),
  (t.PROMPT = 'prompt'),
  (t.CAPTION = 'caption'),
  (t.FILE = 'file'),
  (t.ARRAY = 'array'),
  (t.OBJECT = 'object'),
  (t.ANY = 'any'));
})(DataType || (exports.DataType = DataType = {})));

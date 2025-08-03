'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.CaptionFormatService = void 0));
class CaptionFormatService {
  convert(t, r, e) {
    switch (r) {
    case 'srt':
      return this.toSRT(t);
    case 'vtt':
      return this.toVTT(t);
    case 'ass':
      return this.toASS(t, e);
    case 'json':
      return JSON.stringify(t, null, 2);
    default:
      throw new Error(`Unsupported caption format: ${r}`);
    }
  }
  toSRT(t) {
    return t
      .map(
        (t, r) =>
          `${r + 1}\n${this.formatSRTTime(t.startTime)} --\x3e ${this.formatSRTTime(t.endTime)}\n${t.text}\n`
      )
      .join('\n');
  }
  toVTT(t) {
    const r = ['WEBVTT\n'];
    return (
      t.forEach((t, e) => {
        const n = this.formatVTTTime(t.startTime),
          o = this.formatVTTTime(t.endTime);
        r.push(`${e + 1}\n${n} --\x3e ${o}\n${t.text}\n`);
      }),
      r.join('\n')
    );
  }
  toASS(t, r) {
    const e = r?.fontFamily || 'Archivo Black',
      n = r?.fontSize || 24,
      o = r?.position || 'bottom';
    let a = '2',
      i = 50;
    'middle' === o
      ? ((a = '5'), (i = 0))
      : '60percent' === o && ((a = '2'), (i = 768));
    const S = r?.lineHeight || 1;
    return `[Script Info]\nTitle: Generated Captions\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,${e},${n},&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,${Math.round(n * (S - 1))},0,1,3,0,${a},30,30,${i},1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${t
      .map(
        t =>
          `Dialogue: 0,${this.formatASSTime(t.startTime)},${this.formatASSTime(t.endTime)},Default,,0,0,0,,${t.text}`
      )
      .join('\n')}`;
  }
  formatSRTTime(t) {
    const r = Math.floor(t / 3600),
      e = Math.floor((t % 3600) / 60),
      n = Math.floor(t % 60),
      o = Math.floor((t % 1) * 1e3);
    return `${String(r).padStart(2, '0')}:${String(e).padStart(2, '0')}:${String(n).padStart(2, '0')},${String(o).padStart(3, '0')}`;
  }
  formatVTTTime(t) {
    return this.formatSRTTime(t).replace(',', '.');
  }
  formatASSTime(t) {
    const r = Math.floor(t / 3600),
      e = Math.floor((t % 3600) / 60),
      n = Math.floor(t % 60),
      o = Math.floor((t % 1) * 100);
    return `${r}:${String(e).padStart(2, '0')}:${String(n).padStart(2, '0')}.${String(o).padStart(2, '0')}`;
  }
}
exports.CaptionFormatService = CaptionFormatService;

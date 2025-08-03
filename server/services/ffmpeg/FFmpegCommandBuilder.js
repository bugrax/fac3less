'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.FFmpegCommandBuilder = void 0));
class FFmpegCommandBuilder {
  static buildZoomCommand(t) {
    const {
        inputPath: a,
        outputPath: o,
        zoomDuration: i,
        zoomType: e,
        width: r,
        height: s,
        fps: m,
        videoDuration: n,
        hasAudio: f
      } = t,
      p = 3 * r,
      u = 3 * s,
      c = Math.round(i * m);
    let l;
    l =
      'out' === e
        ? `if(lte(on,${c}),3-2*on/${c},1)`
        : `if(lte(on,${c}),1+2*on/${c},3)`;
    return [
      'ffmpeg',
      '-loglevel error',
      `-i "${a}"`,
      '-filter_complex',
      `"[0:v]scale=${p}:${u},`,
      `zoompan=z='${l}':`,
      "x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':",
      `d=1:s=${r}x${s}:fps=${m}[v]"`,
      '-map "[v]"',
      f ? '-map 0:a' : '',
      '-c:v libx264 -preset fast -crf 23',
      f ? '-c:a aac -b:a 192k' : '',
      '-pix_fmt yuv420p',
      '-movflags +faststart',
      `-t ${n.toFixed(6)}`,
      `"${o}"`,
      '-y'
    ]
      .filter(t => t)
      .join(' ');
  }
  static buildConcatCommand(t) {
    const { concatListPath: a, outputPath: o, canUseCopy: i } = t;
    return i
      ? [
        'ffmpeg',
        '-loglevel error',
        `-f concat -safe 0 -i "${a}"`,
        '-c copy',
        '-movflags +faststart',
        `"${o}"`,
        '-y'
      ].join(' ')
      : [
        'ffmpeg',
        '-loglevel error',
        `-f concat -safe 0 -i "${a}"`,
        '-c:v libx264 -preset fast -crf 23',
        '-c:a aac -b:a 192k',
        '-pix_fmt yuv420p',
        '-r 24',
        '-movflags +faststart',
        `"${o}"`,
        '-y'
      ].join(' ');
  }
  static buildSyncCommand(t) {
    const {
      audioPath: a,
      videoPath: o,
      outputPath: i,
      startTime: e,
      audioDuration: r
    } = t;
    if (r > 5) {
      return [
        'ffmpeg',
        '-loglevel error',
        `-i "${a}"`,
        `-i "${o}"`,
        '-filter_complex',
        `"[1:v]setpts=${(r / 5).toFixed(6)}*PTS[v]"`,
        `-ss ${e.toFixed(6)}`,
        `-t ${r.toFixed(6)}`,
        '-c:v libx264 -preset fast -crf 23',
        '-c:a aac -b:a 192k',
        '-r 24',
        '-map "[v]" -map 0:a:0',
        '-pix_fmt yuv420p',
        '-movflags +faststart',
        `"${i}"`,
        '-y'
      ].join(' ');
    }
    return [
      'ffmpeg',
      `-i "${a}"`,
      `-i "${o}"`,
      `-ss ${e.toFixed(6)}`,
      `-t ${r.toFixed(6)}`,
      '-c:v libx264 -preset fast -crf 23',
      '-c:a aac -b:a 192k',
      '-r 24',
      '-map 1:v:0 -map 0:a:0',
      '-pix_fmt yuv420p',
      '-movflags +faststart',
      `"${i}"`,
      '-y'
    ].join(' ');
  }
  static buildTransitionCommand(t) {
    const {
      concatListPath: a,
      transitionSoundPath: o,
      outputPath: i,
      transitionTimestamps: e,
      soundVolume: r
    } = t;
    let s = '';
    for (let t = 0; t < e.length; t++) {
      const a = Math.round(1e3 * e[t]);
      s += `[1:a]atrim=0:0.5,volume=${r},adelay=${a}|${a}[trans${t}];`;
    }
    const m = ['[0:a]'];
    for (let t = 0; t < e.length; t++) {
      m.push(`[trans${t}]`);
    }
    s += `${m.join('')}amix=inputs=${m.length}:duration=first:normalize=0[mixed];[mixed]volume=1.2[aout]`;
    return [
      'ffmpeg',
      `-f concat -safe 0 -i "${a}"`,
      `-i "${o}"`,
      '-filter_complex',
      `"${s}"`,
      '-map 0:v',
      '-map "[aout]"',
      '-c:v libx264 -preset fast -crf 23',
      '-c:a aac -b:a 192k',
      '-pix_fmt yuv420p',
      '-movflags +faststart',
      `"${i}"`,
      '-y'
    ].join(' ');
  }
  static buildIntroSoundCommand(t) {
    const {
      videoPath: a,
      introSoundPath: o,
      outputPath: i,
      soundVolume: e
    } = t;
    return [
      'ffmpeg',
      `-i "${a}"`,
      `-i "${o}"`,
      '-filter_complex',
      `"[1:a]atrim=0:2,afade=t=in:d=0.1,afade=t=out:st=1.9:d=0.1,volume=${e}[intro];`,
      '[0:a][intro]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[mixed];[mixed]volume=1.2[aout]"',
      '-map 0:v',
      '-map "[aout]"',
      '-c:v copy',
      '-c:a aac -b:a 192k',
      `"${i}"`,
      '-y'
    ].join(' ');
  }
  static buildComplexSegmentCommand(t) {
    const {
      videoClipPaths: a,
      concatListPath: o,
      audioPath: i,
      outputPath: e,
      audioDuration: r
    } = t;
    let s;
    return (
      (s =
        1 === a.length
          ? [
            'ffmpeg',
            `-i "${a[0]}"`,
            `-i "${i}"`,
            `-t ${r.toFixed(6)}`,
            '-c:v libx264 -preset fast -crf 23',
            '-c:a aac -b:a 192k',
            '-map 0:v:0 -map 1:a:0',
            '-pix_fmt yuv420p',
            `"${e}"`,
            '-y'
          ].join(' ')
          : [
            'ffmpeg',
            `-f concat -safe 0 -i "${o}"`,
            `-i "${i}"`,
            `-t ${r.toFixed(6)}`,
            '-c:v libx264 -preset fast -crf 23',
            '-c:a aac -b:a 192k',
            '-map 0:v:0 -map 1:a:0',
            '-pix_fmt yuv420p',
            `"${e}"`,
            '-y'
          ].join(' ')),
      s
    );
  }
  static buildVideoClipCommand(t, a, o, i) {
    return [
      'ffmpeg',
      `-i "${t}"`,
      `-ss ${o.toFixed(3)}`,
      `-t ${i.toFixed(3)}`,
      '-c:v libx264 -preset ultrafast -crf 23',
      '-pix_fmt yuv420p',
      '-r 24',
      '-an',
      `"${a}"`,
      '-y'
    ].join(' ');
  }
  static buildNormalizeCommand(t, a) {
    return [
      'ffmpeg',
      `-i "${t}"`,
      '-c:v libx264 -preset fast -crf 23',
      '-c:a aac -b:a 192k',
      '-pix_fmt yuv420p',
      '-r 24',
      '-movflags +faststart',
      `"${a}"`,
      '-y'
    ].join(' ');
  }
  static buildProbeCommand(t) {
    return `ffprobe -v quiet -print_format json -show_streams "${t}"`;
  }
  static buildDurationProbeCommand(t) {
    return `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${t}"`;
  }
  static buildMetadataProbeCommand(t) {
    return `ffprobe -v error -print_format json -show_format -show_streams "${t}"`;
  }
}
exports.FFmpegCommandBuilder = FFmpegCommandBuilder;

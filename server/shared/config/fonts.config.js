'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.FONT_INSTALL_COMMANDS =
    exports.DEFAULT_FONT =
    exports.AVAILABLE_FONTS =
      void 0),
(exports.AVAILABLE_FONTS = [
  {
    value: 'Archivo Black',
    label: 'Archivo Black',
    description: 'Ultra bold, perfect for social media'
  },
  {
    value: 'Bebas Neue',
    label: 'Bebas Neue',
    description: 'Bold, condensed, trendy on TikTok'
  },
  {
    value: 'Impact',
    label: 'Impact',
    description: 'Classic meme font, instant attention'
  },
  {
    value: 'Oswald',
    label: 'Oswald',
    description: 'Modern condensed, great for vertical videos'
  },
  {
    value: 'Rubik Bold',
    label: 'Rubik Bold',
    description: 'Rounded, friendly but bold'
  }
]),
(exports.DEFAULT_FONT = 'Archivo Black'),
(exports.FONT_INSTALL_COMMANDS = {
  ubuntu:
      'sudo apt-get install -y fonts-archivo fonts-bebas-neue fonts-oswald fonts-rubik',
  mac: 'brew tap homebrew/cask-fonts && brew install --cask font-archivo-black font-bebas-neue font-impact font-oswald font-rubik',
  manual:
      'Download fonts from Google Fonts (except Impact which is pre-installed) and install manually'
}));

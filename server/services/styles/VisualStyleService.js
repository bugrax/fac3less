'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.VisualStyleService = void 0));
class VisualStyleService {
  static instance;
  styleDefinitions = {
    cinematic: {
      keywords:
        'cinematic composition, anamorphic lens, film grain, dramatic lighting, movie scene, depth of field, professional cinematography, epic scale',
      guidelines:
        'Create movie-like shots with dramatic camera angles, shallow depth of field, volumetric lighting, atmospheric haze, and cinematic color grading. Think blockbuster film scenes.',
      negativePrompt:
        'text, words, letters, numbers, flat lighting, amateur, phone photo, low quality, cartoon, subtitles, captions',
    },
    anime: {
      keywords:
        'anime art style, manga aesthetic, vibrant saturated colors, dynamic action lines, expressive eyes, cel-shaded rendering, Japanese animation',
      guidelines:
        'Create scenes with exaggerated expressions, speed lines for motion, cherry blossoms or dramatic backgrounds, bold color contrasts, and signature anime visual tropes.',
      negativePrompt:
        'text, words, letters, realistic, photographic, western cartoon, 3D render, dull colors, uncanny valley',
    },
    'dark-fantasy': {
      keywords:
        'dark fantasy aesthetic, gothic atmosphere, mysterious fog, dramatic chiaroscuro, ethereal glow, ominous shadows, mystical elements',
      guidelines:
        'Create haunting scenes with twisted trees, ancient ruins, magical particles, dark creatures lurking, purple/blue color palette, and supernatural atmosphere.',
      negativePrompt:
        'text, words, letters, bright colors, cheerful, modern, minimalist, cartoon, comedy, daylight',
    },
    minimalist: {
      keywords:
        'minimalist design, geometric shapes, single focal point, monochromatic palette, clean composition, negative space, zen aesthetic',
      guidelines:
        'Create simple yet powerful imagery with one main subject, solid colors, geometric patterns, lots of empty space, and subtle gradients. Think Apple ad aesthetic.',
      negativePrompt:
        'text, words, letters, cluttered, busy, ornate, detailed textures, complex, vintage, multiple subjects',
    },
    cyberpunk: {
      keywords:
        'cyberpunk aesthetic, neon glow, rain-slicked streets, holographic displays, urban dystopia, tech noir, retrowave colors, blade runner style',
      guidelines:
        'Create futuristic cityscapes with neon signs (no readable text), flying vehicles, augmented humans, pink/blue/purple lighting, reflective wet surfaces, and tech elements.',
      negativePrompt:
        'text, words, letters, natural lighting, rural, historical, vintage, bright daylight, pastoral, organic',
    },
    retro: {
      keywords:
        'retro aesthetic, vintage film look, 80s/90s style, nostalgic mood, grainy texture, pastel colors, synthwave vibes, old school',
      guidelines:
        'Create scenes with retro technology, vintage clothing styles, sunset gradients, VHS effects, geometric patterns, and nostalgic atmosphere without actual text.',
      negativePrompt:
        'text, words, letters, modern tech, sharp digital, contemporary, minimalist, black and white',
    },
    surreal: {
      keywords:
        'surreal dreamscape, impossible physics, melting reality, floating objects, distorted perspective, salvador dali inspired, mind-bending',
      guidelines:
        'Create impossible scenes with floating islands, melting clocks, giant everyday objects, twisted architecture, and dream-like transitions between elements.',
      negativePrompt:
        'text, words, letters, realistic, logical, mundane, normal proportions, everyday scenes',
    },
    realistic: {
      keywords:
        'photorealistic, hyperrealistic detail, natural lighting, authentic textures, lifelike rendering, professional photography, 8K quality',
      guidelines:
        'Create highly detailed realistic scenes with accurate lighting, realistic skin textures, natural environments, and documentary-style composition.',
      negativePrompt:
        'text, words, letters, cartoon, anime, painted, artificial, stylized, illustration, drawing',
    },
    'flat-design': {
      keywords:
        'flat design, vector art, solid colors, 2D illustration, material design, simple shapes, no gradients, clean geometric',
      guidelines:
        'Create simple 2D compositions with solid colors, no shadows or gradients, material design inspired, clean vector-style shapes.',
      negativePrompt:
        'text, words, letters, 3D, gradients, shadows, complex textures, photorealistic, depth',
    },
    silhouette: {
      keywords:
        'silhouette art, high contrast, black shapes, backlit, shadow puppets, dramatic outline, solid black forms, colored background',
      guidelines:
        'Create high contrast images with solid black silhouettes against colored or bright backgrounds, focus on shape and form, dramatic backlighting effects.',
      negativePrompt:
        'text, words, letters, detailed features, gradients, mid-tones, complex textures, facial details',
    },
    isometric: {
      keywords:
        'isometric view, 30 degree angle, simple 3D, geometric blocks, pixel art style, clean lines, technical illustration, grid-based',
      guidelines:
        'Create isometric 3D scenes with 30-degree angles, simple geometric shapes, clean technical illustration style, grid-based compositions.',
      negativePrompt:
        'text, words, letters, perspective distortion, complex textures, organic shapes, realistic lighting',
    },
    'line-art': {
      keywords:
        'line art, contour drawing, single line, outline only, pen sketch, minimalist drawing, black lines, white background',
      guidelines:
        'Create simple line drawings with single color outlines, no fills or shading, focus on contours and essential forms, pen sketch aesthetic.',
      negativePrompt:
        'text, words, letters, filled shapes, colors, gradients, shading, complex details, photorealistic',
    },
    duotone: {
      keywords:
        'duotone, two colors, limited palette, high contrast, graphic design, bold color scheme, simple two-tone',
      guidelines:
        'Create images using only two colors, high contrast between them, graphic design approach, bold visual impact through color limitation.',
      negativePrompt:
        'text, words, letters, multiple colors, gradients, complex color schemes, photorealistic, detailed textures',
    },
    'abstract-geometric': {
      keywords:
        'abstract geometric, basic shapes, triangles circles squares, pattern design, mathematical precision, clean geometry, modernist',
      guidelines:
        'Create abstract compositions using basic geometric shapes, mathematical precision, clean patterns, focus on shape relationships and balance.',
      negativePrompt:
        'text, words, letters, organic forms, realistic objects, complex textures, representational art',
    },
    bauhaus: {
      keywords:
        'bauhaus style, modernist, primary colors, geometric composition, clean design, functional aesthetic, red yellow blue black',
      guidelines:
        'Create clean modernist compositions with primary colors, geometric forms, Bauhaus school principles, functional beauty, grid-based layouts.',
      negativePrompt:
        'text, words, letters, ornate details, complex textures, organic shapes, pastel colors, realistic',
    },
    liminal: {
      keywords:
        'liminal space, empty hallway, fluorescent lights, backrooms, abandoned mall, uncanny, endless corridors, yellow rooms',
      guidelines:
        'Create unsettling empty spaces with fluorescent lighting, endless hallways, abandoned locations, uncanny atmosphere, no people present.',
      negativePrompt:
        'text, words, letters, people, crowds, cozy, warm lighting, lived-in spaces, outdoor nature',
    },
    'analog-horror': {
      keywords:
        'analog horror, VHS quality, static noise, found footage, grainy video, surveillance camera, distorted, glitch effects',
      guidelines:
        'Create grainy, low-quality footage aesthetic with VHS artifacts, static interference, surveillance camera look, intentionally degraded quality.',
      negativePrompt:
        'text, words, letters, HD quality, sharp details, modern technology, clean image, high resolution',
    },
    'stark-horror': {
      keywords:
        'stark horror, high contrast, black white red only, minimal horror, sharp shadows, simple shapes, disturbing silhouettes',
      guidelines:
        'Create high contrast horror using only black, white, and red, minimal but disturbing compositions, sharp dramatic shadows.',
      negativePrompt:
        'text, words, letters, multiple colors, soft lighting, complex details, gradients, cheerful elements',
    },
    vaporwave: {
      keywords:
        'vaporwave aesthetic, pink purple teal, windows 95, glitch art, nostalgic, mall aesthetic, retro computer, neon grid',
      guidelines:
        'Create nostalgic 90s computer aesthetic with pink/purple/teal palette, glitch effects, retro technology, mall and corporate imagery.',
      negativePrompt:
        'text, words, letters, modern technology, realistic, natural colors, high definition, contemporary style',
    },
    'deep-fried': {
      keywords:
        'deep fried meme, oversaturated, high contrast, glowing eyes, distorted, internet meme style, extreme filters, lens flare',
      guidelines:
        'Create intentionally over-processed images with extreme saturation, high contrast, glowing effects, meme-style distortion.',
      negativePrompt:
        'text, words, letters, subtle colors, natural lighting, professional quality, clean image, realistic',
    },
    'y2k-digital': {
      keywords:
        'Y2K aesthetic, early internet, matrix digital rain, windows XP, simple cyber, low poly, tech optimism, translucent plastic',
      guidelines:
        'Create early 2000s digital aesthetic with matrix-like elements, Windows XP vibes, low poly 3D, tech optimism, simple cyber elements.',
      negativePrompt:
        'text, words, letters, modern UI, high poly, realistic textures, vintage pre-digital, contemporary design',
    },
    storybook: {
      keywords:
        "storybook illustration, children's book art, simple characters, flat illustration, fairy tale style, whimsical, soft colors",
      guidelines:
        "Create simple, charming illustrations like children's books, clear focal points, minimal backgrounds, fairy tale aesthetic.",
      negativePrompt:
        'text, words, letters, photorealistic, complex details, dark themes, adult content, harsh lighting',
    },
    'comic-noir': {
      keywords:
        'noir style, black and white, dramatic shadows, high contrast, visual narrative, sin city aesthetic, one accent color',
      guidelines:
        'Create dramatic black and white scenes with optional single accent color, strong shadows, noir atmosphere, visual storytelling.',
      negativePrompt:
        'text, words, letters, speech bubbles, multiple colors, soft lighting, cheerful mood, low contrast',
    },
    'puppet-theater': {
      keywords:
        'puppet show aesthetic, theatrical stage, spotlight lighting, simple backdrop, marionette style, dramatic staging, curtains',
      guidelines:
        'Create theatrical puppet show scenes with stage lighting, simple painted backdrops, dramatic spotlights, theatrical composition.',
      negativePrompt:
        'text, words, letters, realistic humans, natural lighting, complex backgrounds, photorealistic, outdoor scenes',
    },
    diorama: {
      keywords:
        'diorama style, miniature scene, tilt shift, model railway, tiny world, shoebox scene, forced perspective, craft materials',
      guidelines:
        'Create miniature world aesthetic with tilt-shift effect, shoebox diorama look, model-like scenes, clear boundaries, craft material textures.',
      negativePrompt:
        'text, words, letters, full scale, normal perspective, realistic proportions, infinite depth, natural landscapes',
    },
    'security-cam': {
      keywords:
        'security camera footage, CCTV, surveillance, grainy monochrome, fish eye lens, low quality, timestamp overlay, static',
      guidelines:
        'Create CCTV surveillance footage aesthetic with grainy quality, monochrome or washed colors, slight fish-eye distortion, low resolution.',
      negativePrompt:
        'text, words, letters, HD quality, vibrant colors, artistic composition, professional photography, clear details',
    },
    'night-vision': {
      keywords:
        'night vision, infrared camera, green tint, heavy grain, military footage, ghost hunting, thermal artifacts, glowing eyes',
      guidelines:
        'Create night vision camera aesthetic with green tint, heavy noise, military or paranormal investigation feel, infrared artifacts.',
      negativePrompt:
        'text, words, letters, natural colors, daylight, clear image, low noise, professional quality, full color',
    },
    'trail-cam': {
      keywords:
        'trail camera, wildlife cam, motion triggered, harsh flash, grainy outdoor, cryptid footage, forest surveillance, infrared',
      guidelines:
        'Create trail camera aesthetic with harsh flash lighting, grainy quality, outdoor forest settings, motion blur, surveillance feel.',
      negativePrompt:
        'text, words, letters, studio lighting, urban settings, high quality, professional photography, indoor scenes',
    },
    classified: {
      keywords:
        'classified footage, degraded video, photocopied aesthetic, leaked tape, government archive, redacted, low quality transfer',
      guidelines:
        'Create degraded footage aesthetic suggesting classified or leaked material, photocopied quality, archival damage, mysterious origin.',
      negativePrompt:
        'text, words, letters, HD quality, modern footage, clean image, professional production, commercial quality',
    },
    'old-newsreel': {
      keywords:
        'vintage newsreel, old film grain, 1960s footage, scratched film, archival footage, black and white, film artifacts',
      guidelines:
        'Create vintage newsreel aesthetic with film grain, scratches, light leaks, black and white or faded color, 1950s-60s look.',
      negativePrompt:
        'text, words, letters, modern quality, digital artifacts, contemporary subjects, HD resolution, clean image',
    },
    'super-8': {
      keywords:
        'super 8 film, home movie, film grain, light leaks, vintage 8mm, amateur footage, warm nostalgic, handheld camera',
      guidelines:
        'Create super 8 home movie aesthetic with warm colors, film grain, light leaks, slight shake, amateur filming quality.',
      negativePrompt:
        'text, words, letters, professional quality, digital look, steady shots, modern technology, cold colors',
    },
    'polaroid-horror': {
      keywords:
        'polaroid photo, instant film, faded colors, creepy polaroid, found photos, yellowed edges, mysterious subjects, vintage instant',
      guidelines:
        'Create instant photo aesthetic with faded colors, white borders, slightly yellow/green tint, mysterious or unsettling subjects.',
      negativePrompt:
        'text, words, letters, digital photo, sharp details, modern quality, video footage, professional photography',
    },
    thermal: {
      keywords:
        'thermal imaging, heat signature, infrared thermal, FLIR camera, temperature visualization, hot cold gradient, scientific imaging',
      guidelines:
        'Create thermal camera aesthetic with heat signature visualization, blue to red color gradients, scientific/military imaging style.',
      negativePrompt:
        'text, words, letters, natural colors, normal photography, artistic style, complex details, realistic textures',
    },
  };
  styleHookLanguage = {
    cinematic:
      'depth of field, dramatic lighting, and powerful composition to create intrigue',
    anime: 'expressive emotions, dynamic energy, and symbolic visual elements',
    'dark-fantasy':
      'mysterious shadows, otherworldly atmosphere, and ominous beauty',
    minimalist: 'one striking element with maximum impact through simplicity',
    cyberpunk: 'neon-lit mystery, tech-noir atmosphere, and urban energy',
    retro: 'nostalgic tension, vintage drama, and era-specific intrigue',
    surreal:
      'impossible situations, dreamlike confusion, and reality-bending visuals',
    realistic:
      'raw authentic moments, genuine emotion, and documentary-style impact',
    'flat-design':
      'bold geometric shapes, striking color blocks, and clean visual hierarchy',
    silhouette:
      'dramatic contrast, mysterious forms, and powerful shape language',
    isometric:
      'impossible perspectives, geometric intrigue, and spatial puzzles',
    'line-art':
      'elegant simplicity, flowing contours, and minimalist storytelling',
    duotone:
      'bold color contrast, graphic impact, and visual tension through limitation',
    'abstract-geometric':
      'mathematical beauty, pattern intrigue, and shape relationships',
    bauhaus:
      'functional elegance, primary color drama, and modernist composition',
    liminal: 'unsettling emptiness, uncanny spaces, and psychological unease',
    'analog-horror':
      'degraded mystery, found footage tension, and technological decay',
    'stark-horror':
      'minimal terror, high contrast fear, and simple but disturbing imagery',
    vaporwave:
      'nostalgic glitch, aesthetic contradiction, and digital dreamscapes',
    'deep-fried':
      'chaotic energy, meme aesthetics, and intentional visual overload',
    'y2k-digital':
      'cyber optimism, digital nostalgia, and turn-of-millennium tech magic',
    storybook: 'whimsical charm, narrative clarity, and fairy tale wonder',
    'comic-noir':
      'dramatic shadows, visual storytelling, and noir atmosphere without words',
    'puppet-theater':
      'theatrical staging, dramatic spotlights, and performance energy',
    diorama: 'miniature worlds, forced perspective, and crafted reality',
    'security-cam':
      'surveillance tension, grainy mystery, and voyeuristic unease',
    'night-vision': 'infrared revelation, military tension, and hidden threats',
    'trail-cam':
      'wilderness mystery, motion-triggered surprise, and cryptid potential',
    classified: 'degraded secrets, archival mystery, and forbidden knowledge',
    'old-newsreel':
      'historical drama, archival authenticity, and vintage documentation',
    'super-8': 'nostalgic moments, home movie warmth, and personal memories',
    'polaroid-horror': 'instant dread, faded memories, and found photo mystery',
    thermal:
      'heat signatures, scientific intrigue, and hidden temperature stories',
  };
  hookPrinciples = {
    tension: 'visual tension, something about to happen, unresolved moment',
    mystery: 'partially revealed element, obscured detail, intriguing shadow',
    contrast: 'unexpected juxtaposition, size difference, light/dark drama',
    motion: 'implied movement, dynamic energy, frozen action moment',
    focus: 'extreme detail, macro view, selective emphasis',
    surprise: 'unexpected element, scale revelation, hidden detail',
  };
  constructor() {}
  static getInstance() {
    return (
      VisualStyleService.instance ||
        (VisualStyleService.instance = new VisualStyleService()),
      VisualStyleService.instance
    );
  }
  getStyleDefinition(e) {
    return this.styleDefinitions[e] || this.styleDefinitions.cinematic;
  }
  getStyleHookLanguage(e) {
    return (
      this.styleHookLanguage[e] ||
      'powerful visual composition and emotional impact'
    );
  }
  getHookPrinciples() {
    return this.hookPrinciples;
  }
  getAllStyles() {
    return Object.keys(this.styleDefinitions);
  }
  getStyleDefinitions() {
    return this.styleDefinitions;
  }
  isValidStyle(e) {
    return e in this.styleDefinitions;
  }
}
exports.VisualStyleService = VisualStyleService;

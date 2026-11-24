/* Dessins : sprites pixel art (16 × 24) pour la salle, portraits illustrés (SVG) pour les dialogues. */
(function () {
  'use strict';

  /* ---------- Couleurs ---------- */
  function hexToRgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  }
  function mix(a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  }
  const shade = (h, t) => (t < 0 ? mix(h, '#10122a', -t) : mix(h, '#ffffff', t));

  /* ---------- Sprites de la salle ---------- */
  const DOWN = [
    '......OOOO......',
    '....OOHHHHOO....',
    '...OHHhhHHHHO...',
    '..OHHhHHHHHHHO..',
    '..OHHHHHHHHHHO..',
    '..OHHSSSSSSHHO..',
    '..OHSSSSSSSSHO..',
    '..OSSEWSSEWSSO..',
    '..OSSEESSEESSO..',
    '..ORSSSSSSSSRO..',
    '...OSSSmmSSSO...',
    '....OOSSSSOO....',
    '.....OsSSsO.....',
    '...OOTTCCTTOO...',
    '..OTTTTCCTTTTO..',
    '.OTTTTTCCTTTTTO.',
    '.OTtTTTCCTTTtTO.',
    '.OSOTTTCCTTTOSO.',
    '.OSOtTTTTTTtOSO.',
    '...OOPPPPPPOO...',
    '....OPPPPPPO....',
    '....OPPOOPPO....',
    '....OPPOOPPO....',
    '...OBBBOOBBBO...',
  ];
  const UP = DOWN.map((r, y) => {
    if (y >= 5 && y <= 9) return y === 8 ? '..OSHHHHHHHHSO..' : '..OHHHHHHHHHHO..';
    if (y === 10) return '...OHHHHHHHHO...';
    if (y === 11) return '....OOHHHHOO....';
    if (y >= 13 && y <= 18) return r.replace(/C/g, 'T');
    return r;
  });
  const SIDE = [
    '......OOOO......',
    '.....OHHHHOO....',
    '....OHHhhHHHO...',
    '...OHHhHHHHHHO..',
    '...OHHHHHHHHHO..',
    '...OHHHHHSSSSO..',
    '...OHHHHSSSSSO..',
    '...OHHHSSSSEWO..',
    '...OHSSSSSSEEO..',
    '...OHSSSSSSSRO..',
    '....OSSSSSSmO...',
    '.....OOSSSSOO...',
    '......OsSSO.....',
    '.....OTTTTTO....',
    '....OTTTTTTCO...',
    '....OTTTTTTCO...',
    '....OTtTTTTCO...',
    '....OTSSTTTCO...',
    '....OtSStTTtO...',
    '.....OPPPPPO....',
    '.....OPPPPPO....',
    '.....OPPOPPO....',
    '.....OPPOPPO....',
    '.....OBBOBBBO...',
  ];
  const WALK = {
    down: [null, { 22: '....OPPOOBBO....', 23: '...OBBBO..OO....' }, { 22: '....OBBOOPPO....', 23: '....OO..OBBBO...' }],
    up: [null, { 22: '....OPPOOBBO....', 23: '...OBBBO..OO....' }, { 22: '....OBBOOPPO....', 23: '....OO..OBBBO...' }],
    side: [null, { 21: '....OPPO.OPPO...', 22: '...OPPO...OPPO..', 23: '...OBBO...OBBO..' }, null],
  };

  function grid(dir, frame, look) {
    const base = dir === 'up' ? UP : dir === 'down' ? DOWN : SIDE;
    const g = base.map((r) => r.split(''));
    const w = WALK[dir === 'up' || dir === 'down' ? dir : 'side'][frame];
    if (w) Object.entries(w).forEach(([y, row]) => { g[+y] = row.split(''); });
    const set = (y, row) => { g[y] = row.split(''); };
    const side = dir === 'left' || dir === 'right';

    if (look.hair === 'long') {
      if (dir === 'down') {
        for (let y = 5; y <= 10; y++) { g[y][1] = 'O'; g[y][2] = 'H'; g[y][13] = 'H'; g[y][14] = 'O'; }
        set(11, '..OHHOSSSSOHHO..');
        set(12, '..OHHOsSSsOHHO..');
        set(13, '..OHOTTCCTTOHO..');
      } else if (dir === 'up') {
        set(11, '...OHHHHHHHHO...');
        set(12, '...OHHHHHHHHO...');
        set(13, '...OHHHHHHHHO...');
        set(14, '..OTOHHHHHHOTO..');
      } else {
        for (let y = 6; y <= 13; y++) { g[y][3] = 'O'; g[y][4] = 'H'; }
        g[11][4] = 'H'; g[12][4] = 'H'; g[13][4] = 'H';
      }
    }
    if (look.hair === 'ponytail') {
      if (dir === 'up') { for (let y = 10; y <= 15; y++) { g[y][6] = 'O'; g[y][7] = 'H'; g[y][8] = 'H'; g[y][9] = 'O'; } }
      if (side) { for (let y = 4; y <= 10; y++) { g[y][2] = 'O'; g[y][3] = 'H'; } g[11][3] = 'O'; }
      if (dir === 'down') { g[4][2] = 'O'; g[4][1] = '.'; }
    }
    if (look.hair === 'cap') {
      if (dir === 'down') {
        set(1, '....OOQQQQOO....'); set(2, '...OQQQqQQQQO...'); set(3, '..OQQQQQQQQQQO..'); set(4, '..OQQQQQQQQQQO..'); set(5, '..OKKKKKKKKKKO..');
      } else if (dir === 'up') {
        set(1, '....OOQQQQOO....'); set(2, '...OQQQQQQQQO...'); set(3, '..OQQQQQQQQQQO..'); set(4, '..OQQQQQQQQQQO..'); set(5, '..OKKKKKKKKKKO..');
      } else {
        set(1, '.....OQQQQOO....'); set(2, '....OQQQqQQQO...'); set(3, '...OQQQQQQQQQO..'); set(4, '...OQQQQQQQQKKKO');
      }
    }
    if (look.glasses) {
      if (dir === 'down') { set(7, '..OSGEWGGEWGSO..'); set(8, '..OSGEEGGEEGSO..'); }
      if (side) { set(7, '...OHHHSSSGEWO..'); set(8, '...OHSSSSSGEEO..'); }
    }
    if (look.beard) {
      if (dir === 'down') { set(9, '..OFSSSSSSSSFO..'); set(10, '...OFFFmmFFFO...'); set(11, '....OOFFFFOO....'); }
      if (side) { set(9, '...OHSSSSFFFFO..'); set(10, '....OSFFFFFmO...'); set(11, '.....OOFFFFOO...'); }
    }
    return g;
  }

  const SPRITE_CACHE = new Map();
  function sprite(look, dir, frame) {
    frame = frame || 0;
    const key = look.id + dir + frame;
    if (SPRITE_CACHE.has(key)) return SPRITE_CACHE.get(key);
    const g = grid(dir, frame, look);
    const pal = {
      O: '#1a1d33', E: '#1a1d33', W: '#ffffff', G: '#1a1d33',
      H: look.H, h: shade(look.H, 0.28), S: look.S, s: shade(look.S, -0.2), R: mix(look.S, '#ff6f6f', 0.3), m: '#8f3b3b',
      T: look.T, t: shade(look.T, -0.25), C: look.C, P: look.P, B: look.B || '#2a2233',
      F: look.F || look.H, Q: look.Q || '#1b3f8f', q: shade(look.Q || '#1b3f8f', 0.3), K: look.K || '#d71f30',
    };
    const c = document.createElement('canvas');
    c.width = 16; c.height = 24;
    const ctx = c.getContext('2d');
    g.forEach((row, y) => row.forEach((ch, x) => {
      if (ch === '.') return;
      ctx.fillStyle = pal[ch] || '#ff00ff';
      ctx.fillRect(dir === 'left' ? 15 - x : x, y, 1, 1);
    }));
    SPRITE_CACHE.set(key, c);
    return c;
  }

  /* ---------- Portraits façon visual novel (buste derrière un bureau, encrage épais) ---------- */
  const INK = '#151a33';
  let uid = 0;
  const OUT = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;

  /* Bras en « tube » encré : épaule → coude → poignet */
  function tube(pts, w, col) {
    const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
    return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="${shade(col, -0.22)}" stroke-width="${Math.round(w * 0.4)}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${Math.round(w * 0.16)} ${Math.round(w * 0.12)})"/>`;
  }
  /* Mains : poing, index tendu, main posée à plat */
  function hand(kind, x, y, rot, skin) {
    const sk = shade(skin, -0.18);
    let g = '';
    if (kind === 'point') {
      g = `<rect x="4" y="-30" width="62" height="18" rx="9" fill="${skin}" ${OUT}/>
        <path d="M-26 -14 C-28 -34 -6 -40 14 -34 L30 -32 C40 -30 42 -14 30 -12 L22 -12 C34 -8 34 8 22 10 C30 14 26 28 14 26 C-6 32 -24 18 -26 -14 Z" fill="${skin}" ${OUT}/>
        <path d="M-2 -12 L18 -10 M-2 6 L14 8" stroke="${sk}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else if (kind === 'flat') {
      g = `<path d="M-40 -6 C-40 -20 -20 -24 0 -22 L36 -18 C48 -16 48 -4 38 -2 L42 0 C50 4 46 14 36 12 L-30 12 C-40 12 -42 4 -40 -6 Z" fill="${skin}" ${OUT}/>
        <path d="M8 -12 L30 -10 M6 2 L30 4" stroke="${sk}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else {
      g = `<path d="M-26 -6 C-28 -28 -4 -34 14 -28 C34 -22 36 -4 30 8 C26 22 6 30 -8 26 C-22 22 -26 10 -26 -6 Z" fill="${skin}" ${OUT}/>
        <path d="M2 -26 C10 -14 10 -2 4 8 M16 -22 C22 -12 22 0 18 10" stroke="${sk}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    }
    return `<g transform="translate(${x} ${y}) rotate(${rot})">${g}</g>`;
  }

  function eye(cx, cy, s, iris, id, lash) {
    const X = (dx) => cx + dx * s;
    const white = `M${X(-25)} ${cy + 2} C${X(-16)} ${cy - 16} ${X(16)} ${cy - 19} ${X(25)} ${cy - 5} C${X(17)} ${cy + 13} ${X(-13)} ${cy + 16} ${X(-25)} ${cy + 2} Z`;
    return `<clipPath id="${id}"><path d="${white}"/></clipPath>
      <path d="${white}" fill="#ffffff"/>
      <g clip-path="url(#${id})">
        <ellipse cx="${X(1)}" cy="${cy}" rx="13" ry="17" fill="${iris}"/>
        <ellipse cx="${X(1)}" cy="${cy - 8}" rx="13" ry="9" fill="${shade(iris, -0.35)}"/>
        <ellipse cx="${X(1)}" cy="${cy + 1}" rx="5.5" ry="8.5" fill="${INK}"/>
        <circle cx="${X(-4)}" cy="${cy - 7}" r="5" fill="#ffffff"/>
        <circle cx="${X(6)}" cy="${cy + 7}" r="2.4" fill="#ffffff" opacity=".9"/>
        <path d="${white}" fill="none" stroke="${shade(iris, -0.5)}" stroke-width="2" opacity=".35"/>
      </g>
      <path d="M${X(-28)} ${cy + 3} C${X(-17)} ${cy - 19} ${X(16)} ${cy - 22} ${X(28)} ${cy - 6}${lash ? ` l${8 * s} -7` : ''}" fill="none" stroke="${INK}" stroke-width="${lash ? 7 : 6}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${X(-10)} ${cy + 16} Q${X(2)} ${cy + 19} ${X(14)} ${cy + 12}" fill="none" stroke="${INK}" stroke-width="2.5" opacity=".55" stroke-linecap="round"/>`;
  }

  /* ---------- Décors ---------- */
  function room(kind) {
    const veil = '<rect width="600" height="760" fill="#0f1f4a" opacity=".12"/>';
    if (kind === 'accueil') return `<rect width="600" height="760" fill="#d7e1f2"/>
      <rect width="600" height="70" fill="#14285c"/><rect y="70" width="600" height="6" fill="#d71f30"/>
      ${[60, 180, 300, 420, 540].map((x) => `<rect x="${x}" y="76" width="3" height="684" fill="#c4d1ea"/>`).join('')}
      <rect x="110" y="120" width="380" height="230" rx="6" fill="#6b4429"/><rect x="122" y="132" width="356" height="206" fill="#2b1d16"/>
      <rect x="122" y="232" width="356" height="8" fill="#7a5236"/>
      ${[150, 220, 290, 360, 420].map((x, i) => `<path d="M${x} ${i % 2 ? 160 : 168} h40 v14 c0 22 -10 30 -20 30 c-10 0 -20 -8 -20 -30 Z M${x + 14} ${i % 2 ? 204 : 212} h12 v10 h10 v8 h-32 v-8 h10 Z" fill="#f2b632"/>`).join('')}
      ${[160, 250, 340, 410].map((x, i) => `<rect x="${x}" y="262" width="40" height="52" rx="4" fill="${['#d71f30', '#ffffff', '#1b3f8f', '#d71f30'][i]}"/>`).join('')}
      <rect x="56" y="110" width="30" height="190" fill="#d71f30"/><rect x="66" y="110" width="10" height="190" fill="#1b3f8f"/>
      <rect x="514" y="110" width="30" height="190" fill="#1b3f8f"/><rect x="524" y="110" width="10" height="190" fill="#d71f30"/>${veil}`;
    if (kind === 'tactique') return `<rect width="600" height="760" fill="#c4956a"/>
      ${Array.from({ length: 19 }, (_, i) => `<rect y="${i * 40}" width="600" height="3" fill="#a87a50"/>`).join('')}
      <rect x="80" y="100" width="440" height="280" rx="8" fill="#9aa6c4"/><rect x="92" y="112" width="416" height="256" fill="#ffffff"/>
      <rect x="120" y="136" width="360" height="208" fill="#3f9a56"/><rect x="120" y="136" width="360" height="208" fill="none" stroke="#ffffff" stroke-width="4"/>
      <path d="M300 136 V344" stroke="#ffffff" stroke-width="4"/><circle cx="300" cy="240" r="34" fill="none" stroke="#ffffff" stroke-width="4"/>
      ${[[170, 190], [170, 290], [230, 240], [260, 180], [260, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#d71f30" stroke="#151a33" stroke-width="3"/>`).join('')}
      ${[[360, 200], [380, 270], [430, 240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#1b3f8f" stroke="#151a33" stroke-width="3"/>`).join('')}
      <path d="M240 236 C280 200 320 196 352 206" fill="none" stroke="#f2b632" stroke-width="5" stroke-dasharray="12 8"/><path d="M344 196 l14 10 l-14 10" fill="none" stroke="#f2b632" stroke-width="5"/>${veil}`;
    if (kind === 'scout') return `<rect width="600" height="760" fill="#1b2b58"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 52}" width="2" height="760" fill="#22356a"/>`).join('')}
      <rect x="70" y="100" width="460" height="260" rx="6" fill="#6b4429"/><rect x="82" y="112" width="436" height="236" fill="#8fd0ef"/>
      ${[[110, 140, 90, 70], [130, 210, 50, 80], [250, 130, 70, 50], [260, 190, 60, 90], [350, 130, 120, 70], [420, 230, 50, 40]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="#7cc06a"/>`).join('')}
      <path d="M150 170 L282 160 L410 170 M282 160 L150 260" stroke="#d71f30" stroke-width="3" stroke-dasharray="8 6" fill="none"/>
      ${[[150, 170], [282, 160], [410, 170], [150, 260], [440, 250]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#d71f30" stroke="#151a33" stroke-width="3"/>`).join('')}
      <rect x="40" y="400" width="140" height="90" rx="6" fill="#0f1730"/><rect x="50" y="410" width="120" height="70" fill="#1f6b46"/><rect x="420" y="400" width="140" height="90" rx="6" fill="#0f1730"/><rect x="430" y="410" width="120" height="70" fill="#7a5a12"/>${veil}`;
    if (kind === 'gym') return `<rect width="600" height="760" fill="#e6ecf6"/>
      <rect x="60" y="90" width="480" height="300" rx="10" fill="#ffffff"/>
      <rect x="76" y="106" width="448" height="268" fill="#8fc9ef"/>
      <rect x="76" y="250" width="448" height="124" fill="#4fa35b"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${76 + i * 64}" y="250" width="32" height="124" fill="#47964f"/>`).join('')}
      <path d="M76 300 H524 M300 250 V374" stroke="#ffffff" stroke-width="3"/>
      <path d="M120 250 V150 M480 250 V150" stroke="#9aa6c4" stroke-width="6"/><rect x="96" y="128" width="48" height="26" rx="4" fill="#f4f6fb" stroke="#151a33" stroke-width="3"/><rect x="456" y="128" width="48" height="26" rx="4" fill="#f4f6fb" stroke="#151a33" stroke-width="3"/>
      <path d="M300 106 V374 M76 240 H524" stroke="#ffffff" stroke-width="10"/>
      <rect x="40" y="420" width="520" height="14" fill="#c4cde0"/>${[80, 140, 460, 520].map((x) => `<circle cx="${x}" cy="456" r="22" fill="#2b2f45"/>`).join('')}${veil}`;
    if (kind === 'video') return `<rect width="600" height="760" fill="#0d1532"/>
      <rect x="50" y="80" width="500" height="310" rx="10" fill="#060a1c"/><rect x="64" y="94" width="472" height="282" fill="#2f8f4a"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${64 + i * 80}" y="94" width="40" height="282" fill="#2a8243"/>`).join('')}
      <rect x="64" y="94" width="472" height="282" fill="none" stroke="#ffffff" stroke-width="3"/><path d="M300 94 V376" stroke="#ffffff" stroke-width="3"/><circle cx="300" cy="235" r="40" fill="none" stroke="#ffffff" stroke-width="3"/>
      ${[[150, 160], [190, 300], [240, 220], [360, 150], [400, 280]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#d71f30" stroke="#ffffff" stroke-width="3"/>`).join('')}
      ${[[330, 230], [440, 200], [460, 320]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#ffffff" stroke="#151a33" stroke-width="3"/>`).join('')}
      <path d="M240 220 C290 180 330 170 352 152" fill="none" stroke="#f2b632" stroke-width="5"/><path d="M344 146 l14 4 l-6 14" fill="none" stroke="#f2b632" stroke-width="5"/>
      <rect x="64" y="94" width="472" height="282" fill="url(#none)" opacity="0"/>
      <ellipse cx="300" cy="420" rx="300" ry="60" fill="#2a55b0" opacity=".25"/>`;
    return `<rect width="600" height="760" fill="#b8875a"/>
      <rect x="60" y="80" width="480" height="360" fill="#6b4429"/>
      ${[0, 1, 2].map((r) => `<rect x="72" y="${92 + r * 116}" width="456" height="104" fill="#3d281b"/><rect x="72" y="${188 + r * 116}" width="456" height="10" fill="#7a5236"/>` +
        Array.from({ length: 18 }, (_, i) => `<rect x="${80 + i * 25}" y="${112 + r * 116 + (i % 3) * 6}" width="18" height="${76 - (i % 3) * 6}" fill="${['#d71f30', '#1b3f8f', '#e9dcc0', '#2f7a4a', '#f2b632', '#7a5bb5'][(i + r) % 6]}"/>`).join('')).join('')}
      <rect x="250" y="20" width="100" height="48" fill="#f4ecd8" stroke="#6b4429" stroke-width="6"/><rect x="262" y="30" width="76" height="28" fill="#9aa6c4"/>${veil}`;
  }

  function dramaticBg() {
    const cx = 300, cy = 300, n = 40;
    let s = `<rect width="600" height="760" fill="#14285c"/>`;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = a0 + (Math.PI * 2) / n * 0.55;
      const R = 900;
      s += `<path d="M${cx} ${cy} L${cx + Math.cos(a0) * R} ${cy + Math.sin(a0) * R} L${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R} Z" fill="${i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#2a55b0' : '#d71f30'}" opacity="${i % 3 === 0 ? 0.55 : 0.8}"/>`;
    }
    return s + `<circle cx="${cx}" cy="${cy}" r="150" fill="#14285c" opacity=".55"/>`;
  }

  function desk(kind) {
    const top = { accueil: ['#f6f8fc', '#1b3f8f'], tactique: ['#b98a5e', '#8a5d3b'], scout: ['#7d5438', '#5a3b26'], gym: ['#ffffff', '#d71f30'], video: ['#2a3456', '#151d3a'], bureau: ['#8a5d3b', '#5a3b26'] }[kind];
    let extra = '';
    if (kind === 'accueil') extra = '<rect x="0" y="672" width="600" height="16" fill="#d71f30"/><rect x="0" y="688" width="600" height="6" fill="#ffffff"/><rect x="420" y="596" width="90" height="18" rx="3" fill="#ffffff" stroke="#151a33" stroke-width="4"/>';
    if (kind === 'tactique') extra = '<rect x="380" y="590" width="110" height="26" rx="2" fill="#ffffff" stroke="#151a33" stroke-width="4" transform="rotate(-6 435 603)"/><circle cx="130" cy="604" r="10" fill="#d71f30" stroke="#151a33" stroke-width="3"/><circle cx="160" cy="610" r="10" fill="#1b3f8f" stroke="#151a33" stroke-width="3"/>';
    if (kind === 'scout') extra = '<path d="M400 600 L520 600 L536 616 L384 616 Z" fill="#c9d0de" stroke="#151a33" stroke-width="4"/><rect x="60" y="594" width="120" height="22" fill="#f2b632" stroke="#151a33" stroke-width="4"/><rect x="70" y="586" width="120" height="14" fill="#d71f30" stroke="#151a33" stroke-width="4"/>';
    if (kind === 'gym') extra = '<path d="M90 612 L106 572 L122 612 Z" fill="#f07a2a" stroke="#151a33" stroke-width="4"/><circle cx="480" cy="596" r="20" fill="#ffffff" stroke="#151a33" stroke-width="4"/><path d="M470 588 l10 -6 l10 6 l-4 12 h-12 Z" fill="#151a33"/><rect x="0" y="660" width="600" height="30" fill="#1b3f8f"/>';
    if (kind === 'video') extra = '<rect x="80" y="600" width="440" height="20" rx="4" fill="#0d1532"/>' + Array.from({ length: 14 }, (_, i) => `<rect x="${92 + i * 30}" y="604" width="22" height="12" rx="2" fill="${i === 6 ? '#d71f30' : '#3b4770'}"/>`).join('') + '<rect x="0" y="650" width="600" height="4" fill="#2a55b0"/>';
    if (kind === 'bureau') extra = '<path d="M440 596 h44 v26 c0 10 -44 10 -44 0 Z" fill="#ffffff" stroke="#151a33" stroke-width="4"/><path d="M484 604 c16 0 16 14 0 14" fill="none" stroke="#151a33" stroke-width="4"/><rect x="90" y="598" width="130" height="18" fill="#e9dcc0" stroke="#151a33" stroke-width="4"/>';
    return `<rect x="-10" y="612" width="620" height="160" fill="${top[1]}" ${OUT}/><rect x="-10" y="600" width="620" height="28" fill="${top[0]}" ${OUT}/>${extra}`;
  }

  /* ---------- Les six membres du staff ---------- */
  const CAST = {
    club: { room: 'accueil', skin: '#f6d3b8', hair: '#b3472b', iris: '#3f8a5a', lash: true, brows: 'calm', mouth: 'smile', top: '#14285c' },
    tactique: { room: 'tactique', skin: '#d9a27a', hair: '#b4b8c4', iris: '#5a3a24', brows: 'stern', mouth: 'neutral', top: '#1b3f8f', beard: '#c9ccd4', old: true },
    transferts: { room: 'scout', skin: '#8d5a3b', hair: '#1c1717', iris: '#3a2414', brows: 'confident', mouth: 'smirk', top: '#14285c', glasses: '#151a33', stubble: true },
    entrainement: { room: 'gym', skin: '#c68a5e', hair: '#35201a', iris: '#5a3420', lash: true, brows: 'confident', mouth: 'smile', top: '#d71f30' },
    match: { room: 'video', skin: '#f6dcc4', hair: '#f0c24f', iris: '#2f6fb0', brows: 'raised', mouth: 'smile', top: '#f4f6fb', glasses: '#1b3f8f' },
    guide: { room: 'bureau', skin: '#f1c7a1', hair: '#d4d4d8', iris: '#4a6a8a', brows: 'bushy', mouth: 'smile', top: '#c9b48a', beard: '#f2f2f2', old: true },
  };

  function portrait(kind, opts) {
    const c = CAST[kind];
    const id = 'vn' + (++uid);
    const skinS = shade(c.skin, -0.18), hairS = shade(c.hair, -0.28), hairL = shade(c.hair, 0.3);
    const P = [];
    const head = 'M300 112 C372 112 408 162 406 230 C404 284 384 322 346 352 C330 366 314 378 300 382 C286 378 270 366 254 352 C216 322 196 284 194 230 C192 162 228 112 300 112 Z';

    /* Cheveux : [arrière, avant] */
    const HAIR = {
      club: [
        'M188 232 C176 140 228 90 300 90 C374 90 426 140 414 234 C428 332 444 440 458 600 L142 600 C156 440 172 332 188 232 Z',
        'M190 252 C182 160 230 98 302 98 C376 98 420 154 412 254 L400 232 C394 200 382 178 364 164 C352 202 322 224 284 234 L298 202 C274 224 244 238 212 244 L230 214 C214 226 200 238 190 252 Z',
      ],
      tactique: [null, 'M196 240 C186 150 236 96 304 96 C372 96 418 150 404 240 C400 210 390 188 372 174 L378 198 C356 172 330 162 304 162 L312 184 C288 166 256 166 232 178 L238 198 C220 204 206 216 196 240 Z'],
      transferts: [null, 'M204 228 C198 150 242 102 304 102 C366 102 406 150 398 228 L388 204 C380 178 366 162 348 154 L354 180 C336 162 312 154 290 156 L298 178 C276 164 250 164 232 178 L236 200 C222 206 210 216 204 228 Z'],
      entrainement: [
        'M354 122 C440 84 512 150 490 250 C478 310 446 352 424 362 C438 306 440 246 412 194 Z',
        'M192 242 C184 158 232 100 302 100 C372 100 418 156 410 242 L398 220 C386 190 368 172 348 164 L350 194 C332 176 308 168 286 170 L290 196 C268 184 244 186 226 198 L228 218 C212 224 200 232 192 242 Z',
      ],
      match: [null, 'M186 252 C174 192 188 140 212 118 L192 82 L244 102 L256 58 L292 96 L320 54 L340 98 L388 68 L380 116 C414 140 426 192 414 252 L400 228 L390 194 L366 214 L354 176 L324 202 L308 166 L282 200 L262 170 L246 206 L226 184 L214 222 Z'],
      guide: [null, null],
    };
    const [hb, hf] = HAIR[kind];

    P.push(`<g class="bg-room">${room(c.room)}</g><g class="bg-dramatic">${dramaticBg()}</g>`);
    P.push('<g class="char">');
    if (hb) P.push(`<path d="${hb}" fill="${c.hair}" ${OUT}/>`);
    if (kind === 'entrainement') P.push(`<circle cx="372" cy="126" r="14" fill="#1b3f8f" ${OUT}/>`);

    /* Buste et tenue */
    const body = 'M92 780 L92 568 C96 494 148 450 228 430 L270 414 L330 414 L372 430 C452 450 504 494 508 568 L508 780 Z';
    P.push(`<path d="${body}" fill="${c.top}" ${OUT}/>`);
    P.push(`<path d="M430 452 C478 474 500 516 504 570 L504 780 L452 780 C456 640 452 520 430 452 Z" fill="${shade(c.top, -0.22)}"/>`);
    P.push(`<path d="M270 330 L268 424 C290 440 310 440 332 424 L330 330 Z" fill="${c.skin}" ${OUT}/>`);
    P.push(`<path d="M270 352 C290 392 310 392 330 352 L331 404 C310 424 290 424 269 404 Z" fill="${skinS}"/>`);

    if (kind === 'club') {
      P.push(`<path d="M262 420 L300 528 L338 420 C320 432 280 432 262 420 Z" fill="#ffffff" ${OUT}/>`);
      P.push(`<path d="M262 420 L224 446 L282 580 L300 528 Z" fill="${shade(c.top, 0.15)}" ${OUT}/><path d="M338 420 L376 446 L318 580 L300 528 Z" fill="${shade(c.top, 0.08)}" ${OUT}/>`);
      P.push(`<path d="M272 428 Q286 480 298 520 M328 428 Q314 480 302 520" stroke="#d71f30" stroke-width="7" fill="none"/>`);
      P.push(`<path d="M400 500 l26 -4 l4 18 l-26 4 Z" fill="#d71f30" ${OUT}/>`);
    }
    if (kind === 'tactique') {
      P.push(`<path d="M130 520 C150 470 200 440 262 426" stroke="#d71f30" stroke-width="18" fill="none"/><path d="M136 546 C158 494 206 462 266 446" stroke="#ffffff" stroke-width="9" fill="none"/>`);
      P.push(`<path d="M470 520 C450 470 400 440 338 426" stroke="#d71f30" stroke-width="18" fill="none"/><path d="M464 546 C442 494 394 462 334 446" stroke="#ffffff" stroke-width="9" fill="none"/>`);
      P.push(`<path d="M254 380 L262 434 Q300 458 338 434 L346 380 Q300 412 254 380 Z" fill="${c.top}" ${OUT}/><path d="M258 392 Q300 420 342 392" stroke="#d71f30" stroke-width="6" fill="none"/>`);
      P.push(`<path d="M300 446 L300 780" stroke="${INK}" stroke-width="6"/><path d="M300 448 L300 780" stroke="#ffffff" stroke-width="2.5"/>`);
    }
    if (kind === 'transferts') {
      P.push(`<path d="M262 418 L284 452 L300 432 L316 452 L338 418 Z" fill="#ffffff" ${OUT}/>`);
      P.push(`<path d="M250 384 L258 430 Q300 454 342 430 L350 384 Q300 414 250 384 Z" fill="${c.top}" ${OUT}/><path d="M254 396 Q300 424 346 396" stroke="#d71f30" stroke-width="7" fill="none"/>`);
      P.push(`<path d="M300 442 L300 520" stroke="${INK}" stroke-width="5"/><rect x="293" y="514" width="14" height="22" rx="3" fill="#c9d0de" ${OUT}/>`);
    }
    if (kind === 'entrainement') {
      P.push(`<path d="M152 500 C180 466 220 444 262 432 L270 470 C230 480 196 500 176 528 Z" fill="#ffffff" ${OUT}/><path d="M448 500 C420 466 380 444 338 432 L330 470 C370 480 404 500 424 528 Z" fill="#ffffff" ${OUT}/>`);
      P.push(`<path d="M260 414 Q300 446 340 414" stroke="#1b3f8f" stroke-width="12" fill="none" stroke-linecap="round"/>`);
      P.push(`<path d="M276 430 Q290 500 298 540 M324 430 Q310 500 302 540" stroke="#ffffff" stroke-width="5" fill="none"/>`);
    }
    if (kind === 'match') {
      P.push(`<path d="M220 430 Q300 500 380 430 Q370 392 300 398 Q230 392 220 430 Z" fill="#dfe5f0" ${OUT}/>`);
      P.push(`<path d="M280 452 L274 540 M320 452 L326 540" stroke="#1b3f8f" stroke-width="6" stroke-linecap="round"/><circle cx="274" cy="546" r="7" fill="#d71f30" ${OUT}/><circle cx="326" cy="546" r="7" fill="#d71f30" ${OUT}/>`);
      P.push(`<path d="M226 400 Q300 470 374 400" stroke="${INK}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M226 400 Q300 470 374 400" stroke="#1b3f8f" stroke-width="14" fill="none" stroke-linecap="round"/>`);
      P.push(`<ellipse cx="222" cy="404" rx="28" ry="34" fill="#d71f30" ${OUT}/><ellipse cx="378" cy="404" rx="28" ry="34" fill="#d71f30" ${OUT}/><ellipse cx="214" cy="396" rx="10" ry="14" fill="#f06a76"/><ellipse cx="370" cy="396" rx="10" ry="14" fill="#f06a76"/>`);
    }
    if (kind === 'guide') {
      P.push(`<path d="M266 420 L300 516 L334 420 C318 432 282 432 266 420 Z" fill="#cfe0f5" ${OUT}/>`);
      P.push(`<path d="M250 392 Q300 440 350 392 L360 436 Q300 484 240 436 Z" fill="#d71f30" ${OUT}/><path d="M246 412 Q300 460 354 412" stroke="#ffffff" stroke-width="8" fill="none"/><path d="M243 426 Q300 474 357 426" stroke="#1b3f8f" stroke-width="8" fill="none"/>`);
      P.push(`<path d="M262 450 L236 600 L282 606 L292 462 Z" fill="#d71f30" ${OUT}/>`);
      [0.28, 0.48, 0.68].forEach((t, i) => P.push(`<path d="M${262 - 26 * t} ${450 + 150 * t} L${292 - 10 * t} ${462 + 144 * t}" stroke="${i % 2 ? '#1b3f8f' : '#ffffff'}" stroke-width="10"/>`));
      P.push(`<path d="M262 450 L236 600 L282 606 L292 462 Z" fill="none" ${OUT}/>`);
      [540, 600].forEach((y) => P.push(`<circle cx="326" cy="${y}" r="7" fill="${shade(c.top, -0.4)}"/>`));
    }

    /* Tête */
    P.push(`<ellipse cx="196" cy="256" rx="16" ry="26" fill="${c.skin}" ${OUT}/><ellipse cx="404" cy="256" rx="16" ry="26" fill="${c.skin}" ${OUT}/>`);
    P.push(`<clipPath id="${id}h"><path d="${head}"/></clipPath>`);
    P.push(`<path d="${head}" fill="${c.skin}" ${OUT}/>`);
    P.push(`<g clip-path="url(#${id}h)">
      <path d="M382 160 C410 220 404 296 370 340 C354 360 330 374 300 378 L300 400 L420 400 L420 160 Z" fill="${skinS}" opacity=".55"/>
      ${hf ? `<path d="${hf}" fill="${skinS}" transform="translate(4 16)"/>` : ''}
      ${kind === 'guide' ? `<rect x="180" y="216" width="240" height="26" fill="${skinS}"/>` : ''}
    </g>`);
    if (c.old) P.push(`<path d="M262 170 Q300 160 338 170 M270 188 Q300 180 330 188" stroke="${skinS}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    if (c.lash) P.push(`<path d="M228 302 l10 -6 M240 304 l10 -6 M352 302 l10 -6 M364 304 l10 -6" stroke="#e86a6a" stroke-width="3" stroke-linecap="round" opacity=".7"/>`);

    /* Yeux + paupières (clignement) */
    P.push(`<g class="eyes">${eye(256, 262, 1, c.iris, id + 'a', c.lash)}${eye(344, 262, -1, c.iris, id + 'b', c.lash)}</g>`);
    P.push(`<g class="lids"><path d="M228 262 Q256 248 284 258 L284 282 L228 282 Z M372 262 Q344 248 316 258 L316 282 L372 282 Z" fill="${c.skin}"/><path d="M230 266 Q256 276 284 264 M370 266 Q344 276 316 264" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`);

    /* Sourcils */
    const bc = shade(c.brows === 'bushy' ? '#e4e4e8' : c.hair, c.brows === 'bushy' ? -0.05 : -0.2);
    const BROWS = {
      calm: 'M224 230 Q252 214 286 224 M376 230 Q348 214 314 224',
      stern: 'M222 220 L288 238 M378 220 L312 238',
      confident: 'M224 226 Q254 210 288 228 M376 222 Q348 214 314 230',
      raised: 'M226 222 Q254 200 284 214 M374 222 Q346 200 316 214',
      bushy: 'M220 226 Q252 206 290 228 M380 226 Q348 206 310 228',
    };
    P.push(`<path d="${BROWS[c.brows]}" stroke="${INK}" stroke-width="${c.brows === 'bushy' ? 18 : 12}" fill="none" stroke-linecap="round"/><path d="${BROWS[c.brows]}" stroke="${bc}" stroke-width="${c.brows === 'bushy' ? 11 : 6}" fill="none" stroke-linecap="round"/>`);

    /* Nez */
    P.push(`<path d="M306 272 L292 304 L308 306" fill="none" stroke="${shade(c.skin, -0.35)}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M306 276 L296 300 L306 302 Z" fill="${skinS}" opacity=".6"/>`);

    /* Barbe */
    const my = c.beard ? 342 : 336;
    if (c.beard) {
      P.push(`<path d="M200 288 C204 344 242 384 300 388 C358 384 396 344 400 288 C388 320 366 338 340 338 C326 346 274 346 260 338 C234 338 212 320 200 288 Z" fill="${c.beard}" ${OUT}/>`);
      P.push(`<path d="M224 320 l8 14 M256 352 l4 12 M344 352 l-4 12 M376 320 l-8 14" stroke="${shade(c.beard, -0.2)}" stroke-width="3" stroke-linecap="round"/>`);
    }
    if (c.stubble) P.push(`<path d="M208 296 C214 348 248 380 300 384 C352 380 386 348 392 296 C380 330 358 344 336 344 C320 350 280 350 264 344 C242 344 220 330 208 296 Z" fill="${c.hair}" opacity=".28"/>`);

    /* Bouche */
    const MOUTH = { smile: `M282 ${my - 4} Q300 ${my + 8} 320 ${my - 6}`, smirk: `M284 ${my} Q306 ${my + 4} 322 ${my - 10}`, neutral: `M284 ${my} Q300 ${my + 3} 316 ${my}` };
    P.push(`<g class="mouth-idle"><path d="${MOUTH[c.mouth]}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`);
    P.push(`<g class="mouth-talk"><path d="M280 ${my - 8} Q300 ${my + 22} 322 ${my - 8} Q300 ${my - 2} 280 ${my - 8} Z" fill="#5c1a24" ${OUT}/><path d="M290 ${my + 4} Q301 ${my - 1} 312 ${my + 4} Q301 ${my + 11} 290 ${my + 4} Z" fill="#e06a78"/></g>`);
    if (c.beard) P.push(`<path d="M258 ${my - 14} C274 ${my - 34} 296 ${my - 28} 300 ${my - 20} C304 ${my - 28} 326 ${my - 34} 342 ${my - 14} C326 ${my - 6} 310 ${my - 10} 300 ${my - 16} C290 ${my - 10} 274 ${my - 6} 258 ${my - 14} Z" fill="${c.beard}" ${OUT}/>`);

    /* Cheveux avant / casquette */
    if (hf) {
      P.push(`<path d="${hf}" fill="${c.hair}" ${OUT}/>`);
      P.push(`<path d="M240 140 C266 122 300 118 330 124 M352 132 C368 140 380 152 388 166" stroke="${hairL}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>`);
      P.push(`<clipPath id="${id}f"><path d="${hf}"/></clipPath><g clip-path="url(#${id}f)" opacity=".55"><path d="M300 96 L278 240 M300 96 L232 236 M300 96 L352 220 M300 96 L398 230 M262 100 L206 232" stroke="${hairS}" stroke-width="9" fill="none" stroke-linecap="round"/></g>`);
      P.push(`<path d="${hf}" fill="none" ${OUT}/>`);
    }
    if (kind === 'club') {
      P.push(`<path d="M196 238 C186 304 188 370 206 426 L224 392 C214 350 212 300 216 254 Z" fill="${c.hair}" ${OUT}/><path d="M404 238 C414 304 412 370 394 426 L376 392 C386 350 388 300 384 254 Z" fill="${c.hair}" ${OUT}/>`);
    }
    if (kind === 'tactique' || kind === 'transferts') P.push(`<path d="M198 236 L204 286 L214 280 L212 238 Z M402 236 L396 286 L386 280 L388 238 Z" fill="${kind === 'tactique' ? c.hair : hairS}" ${OUT}/>`);
    if (kind === 'entrainement') P.push(`<path d="M206 196 C240 138 362 138 396 196" stroke="${INK}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M206 196 C240 138 362 138 396 196" stroke="#1b3f8f" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M196 244 C190 280 192 310 200 336 L214 326 C208 300 208 270 212 248 Z" fill="${c.hair}" ${OUT}/>`);
    if (kind === 'guide') {
      P.push(`<path d="M196 230 C188 270 192 300 204 324 L218 312 C210 288 208 262 212 236 Z M404 230 C412 270 408 300 396 324 L382 312 C390 288 392 262 388 236 Z" fill="${c.hair}" ${OUT}/>`);
      P.push(`<path d="M190 226 C186 142 236 94 300 94 C364 94 414 142 410 226 Z" fill="#14285c" ${OUT}/>`);
      P.push(`<path d="M232 120 C256 104 282 100 300 100 L300 214 L208 214 C206 170 214 140 232 120 Z" fill="#2a55b0" opacity=".45"/>`);
      P.push(`<rect x="192" y="198" width="216" height="16" fill="#d71f30"/><rect x="192" y="205" width="216" height="4" fill="#ffffff"/>`);
      P.push(`<path d="M168 226 C236 206 364 206 432 226 C438 244 424 252 410 250 C342 236 258 236 190 250 C176 252 162 244 168 226 Z" fill="#0f1f4a" ${OUT}/>`);
      P.push(`<circle cx="300" cy="96" r="9" fill="#0f1f4a" ${OUT}/>`);
    }

    /* Lunettes */
    if (c.glasses) {
      const round = kind === 'match';
      P.push(`<g fill="rgba(210,232,255,.22)" stroke="${c.glasses}" stroke-width="6">${round ? '<circle cx="256" cy="262" r="32"/><circle cx="344" cy="262" r="32"/>' : '<rect x="220" y="238" width="72" height="48" rx="8"/><rect x="308" y="238" width="72" height="48" rx="8"/>'}</g>`);
      P.push(`<path d="M${round ? 288 : 292} 258 Q300 250 ${round ? 312 : 308} 258 M${round ? 224 : 220} 256 L198 248 M${round ? 376 : 380} 256 L402 248" stroke="${c.glasses}" stroke-width="5" fill="none"/>`);
      P.push(`<path d="M232 252 L252 244 M320 252 L340 244" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".9"/>`);
    }

    /* Bras : pose normale et pose « coup d'éclat » */
    const sk = c.skin, sl = c.top;
    let normal = '';
    if (kind === 'club') {
      normal = tube([[200, 452], [168, 560], [262, 548]], 48, sl)
        + `<g transform="rotate(-8 300 540)"><rect x="236" y="460" width="132" height="168" rx="8" fill="#8a5d3b" ${OUT}/><rect x="248" y="476" width="108" height="144" fill="#ffffff"/><rect x="276" y="452" width="52" height="22" rx="4" fill="#c9d0de" ${OUT}/>${[500, 524, 548, 572].map((y) => `<rect x="262" y="${y}" width="${y === 500 ? 80 : 64}" height="6" rx="3" fill="${y === 500 ? '#1b3f8f' : '#9aa6c4'}"/>`).join('')}</g>`
        + hand('fist', 270, 548, -10, sk) + tube([[402, 452], [432, 560], [410, 640]], 48, sl);
    }
    if (kind === 'tactique') {
      normal = tube([[198, 452], [176, 548], [372, 532]], 50, sl) + hand('fist', 380, 528, 0, sk)
        + tube([[402, 452], [426, 552], [228, 566]], 50, sl) + hand('fist', 220, 566, 180, sk);
    }
    if (kind === 'transferts') {
      normal = tube([[198, 452], [176, 560], [190, 640]], 48, sl)
        + tube([[402, 452], [438, 540], [334, 330]], 46, sl) + hand('point', 322, 320, -112, sk);
    }
    if (kind === 'entrainement') {
      normal = tube([[402, 452], [468, 526], [424, 588]], 46, sl) + hand('fist', 420, 590, 60, sk)
        + tube([[198, 452], [168, 548], [244, 500]], 46, sl)
        + `<path d="M256 470 L292 470 Q306 470 306 484 Q306 500 290 500 L262 500 Q248 500 248 486 Z" fill="#d7dce8" ${OUT}/><circle cx="268" cy="486" r="6" fill="${INK}"/>`
        + hand('fist', 252, 498, -20, sk);
    }
    if (kind === 'match') {
      normal = tube([[198, 452], [184, 552], [394, 560]], 46, sl) + hand('fist', 400, 556, 0, sk)
        + tube([[402, 452], [414, 548], [334, 404]], 46, sl) + hand('fist', 330, 392, -80, sk);
    }
    if (kind === 'guide') {
      normal = tube([[198, 452], [156, 560], [176, 628]], 50, sl) + tube([[402, 452], [444, 560], [424, 628]], 50, sl);
    }
    const point = tube([[198, 452], [160, 560], [190, 628]], 48, sl)
      + tube([[402, 452], [452, 424], [466, 392]], 46, sl) + hand('point', 466, 388, -28, sk);

    P.push(`<g class="pose-normal">${normal}</g><g class="pose-point">${point}</g>`);
    P.push('</g>');
    P.push(desk(c.room));
    /* Mains posées sur le bureau (devant le plateau) */
    const flatOnDesk = (kind === 'guide' ? hand('flat', 176, 626, 10, sk) + hand('flat', 424, 626, 170, sk) : '');
    P.push(`<g class="pose-normal">${flatOnDesk}${kind === 'club' || kind === 'transferts' ? '' : ''}</g>`);
    P.push(`<g class="pose-point">${hand('flat', 190, 626, 10, sk)}</g>`);

    const vb = opts && opts.face ? '172 84 256 256' : '0 0 600 760';
    return `<svg class="portrait-svg" viewBox="${vb}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${P.join('')}</svg>`;
  }

  window.ART = { sprite, portrait, mix, shade };
})();

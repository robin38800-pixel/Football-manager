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

  /* ---------- Portraits illustrés ---------- */
  const INK = '#1a1d33';

  function portrait(p) {
    const skinS = shade(p.skin, -0.16);
    const hairS = shade(p.hair, -0.25);
    const hairL = shade(p.hair, 0.22);
    const st = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
    const parts = [];


    /* Cheveux arrière */
    if (p.hairStyle === 'long') {
      parts.push(`<path ${st} fill="${p.hair}" d="M98 214 C86 118 140 70 202 70 C266 70 318 120 306 214 C314 300 338 384 322 446 C300 468 258 466 246 446 L246 330 L154 330 L154 446 C142 466 100 468 78 446 C64 384 88 300 98 214 Z"/>`);
      parts.push(`<path fill="${hairS}" d="M112 300 C108 360 100 410 96 440 C110 452 130 452 142 440 L146 330 Z M288 300 C292 360 300 410 304 440 C290 452 270 452 258 440 L254 330 Z" opacity=".7"/>`);
    }
    if (p.hairStyle === 'ponytail') {
      parts.push(`<path ${st} fill="${p.hair}" d="M262 118 C326 106 360 170 348 246 C342 300 318 338 300 344 C292 330 304 300 308 262 C314 206 300 168 258 150 Z"/>`);
      parts.push(`<path fill="${hairL}" d="M300 140 C330 160 340 200 334 240" stroke="${hairL}" stroke-width="6" fill="none" opacity=".8"/>`);
    }

    /* Buste */
    parts.push(`<path ${st} fill="${p.top}" d="M34 520 C38 432 88 392 158 372 Q200 386 242 372 C312 392 362 432 366 520 Z"/>`);
    parts.push(`<path fill="${shade(p.top, -0.22)}" d="M300 396 C338 420 358 460 362 520 L314 520 C314 470 310 428 300 396 Z"/>`);
    parts.push(`<path fill="${shade(p.top, 0.12)}" d="M100 404 C80 424 64 460 60 520 L80 520 C84 470 92 434 100 404 Z" opacity=".8"/>`);

    /* Cou */
    parts.push(`<path ${st} fill="${p.skin}" d="M166 290 L166 374 Q200 392 234 374 L234 290 Z"/>`);
    parts.push(`<path fill="${skinS}" d="M168 312 Q200 352 232 312 L232 352 Q200 372 168 352 Z"/>`);

    /* Tenue */
    const o = p.outfit;
    if (o === 'blazer') {
      parts.push(`<path ${st} fill="${p.shirt}" d="M162 372 L200 452 L238 372 Q200 388 162 372 Z"/>`);
      parts.push(`<path ${st} fill="${shade(p.top, 0.1)}" d="M160 372 L132 392 L172 470 L200 452 Z"/>`);
      parts.push(`<path ${st} fill="${shade(p.top, -0.05)}" d="M240 372 L268 392 L228 470 L200 452 Z"/>`);
      parts.push(`<circle cx="200" cy="486" r="6" fill="${shade(p.top, 0.35)}" stroke="${INK}" stroke-width="3"/>`);
    }
    if (o === 'tracksuit' || o === 'sport') {
      const s1 = o === 'tracksuit' ? '#d71f30' : '#ffffff';
      const s2 = o === 'tracksuit' ? '#ffffff' : '#1b3f8f';
      parts.push(`<path d="M74 452 C92 414 122 392 160 380" stroke="${s1}" stroke-width="14" fill="none"/>`);
      parts.push(`<path d="M80 470 C98 430 128 406 164 394" stroke="${s2}" stroke-width="7" fill="none"/>`);
      parts.push(`<path d="M326 452 C308 414 278 392 240 380" stroke="${s1}" stroke-width="14" fill="none"/>`);
      parts.push(`<path d="M320 470 C302 430 272 406 236 394" stroke="${s2}" stroke-width="7" fill="none"/>`);
      parts.push(`<path ${st} fill="${p.top}" d="M154 346 L160 384 Q200 404 240 384 L246 346 Q200 372 154 346 Z"/>`);
      parts.push(`<path d="M156 352 Q200 378 244 352" stroke="${s1}" stroke-width="5" fill="none"/>`);
      if (o === 'tracksuit') {
        parts.push(`<path d="M200 390 L200 520" stroke="${INK}" stroke-width="4"/><path d="M200 392 L200 520" stroke="#ffffff" stroke-width="2"/>`);
        parts.push(`<rect x="194" y="404" width="12" height="20" rx="3" fill="#c9d0de" stroke="${INK}" stroke-width="3"/>`);
      }
    }
    if (o === 'quarterzip') {
      parts.push(`<path ${st} fill="${p.top}" d="M154 346 L160 384 Q200 404 240 384 L246 346 Q200 372 154 346 Z"/>`);
      parts.push(`<path d="M157 354 Q200 380 243 354" stroke="#d71f30" stroke-width="6" fill="none"/>`);
      parts.push(`<path d="M200 380 L200 440" stroke="${INK}" stroke-width="4"/><path d="M200 382 L200 438" stroke="#d71f30" stroke-width="2"/>`);
      parts.push(`<rect x="194" y="436" width="12" height="18" rx="3" fill="#c9d0de" stroke="${INK}" stroke-width="3"/>`);
      parts.push(`<path d="M250 450 L300 450" stroke="${shade(p.top, 0.25)}" stroke-width="5" stroke-linecap="round"/>`);
    }
    if (o === 'hoodie') {
      parts.push(`<path ${st} fill="${shade(p.top, -0.1)}" d="M132 376 Q200 420 268 376 Q258 340 200 346 Q142 340 132 376 Z"/>`);
      parts.push(`<path d="M182 392 L178 450 M218 392 L222 450" stroke="#1b3f8f" stroke-width="5" stroke-linecap="round"/>`);
      parts.push(`<circle cx="178" cy="454" r="5" fill="#d71f30"/><circle cx="222" cy="454" r="5" fill="#d71f30"/>`);
      parts.push(`<path d="M110 470 Q200 500 290 470" stroke="#1b3f8f" stroke-width="10" fill="none" opacity=".9"/>`);
    }
    if (o === 'cardigan') {
      parts.push(`<path ${st} fill="${p.shirt}" d="M164 372 L200 446 L236 372 Q200 388 164 372 Z"/>`);
      parts.push(`<path d="M200 446 L200 520" stroke="${INK}" stroke-width="4"/>`);
      [462, 492].forEach((y) => parts.push(`<circle cx="214" cy="${y}" r="5" fill="${shade(p.top, -0.35)}"/>`));
    }

    /* Accessoires au cou */
    const acc = p.acc || [];
    if (acc.includes('lanyard')) {
      parts.push(`<path d="M170 378 Q182 430 198 462 M230 378 Q218 430 202 462" stroke="#d71f30" stroke-width="7" fill="none" stroke-linecap="round"/>`);
      parts.push(`<rect x="180" y="458" width="40" height="50" rx="5" fill="#ffffff" stroke="${INK}" stroke-width="4"/><rect x="182" y="460" width="36" height="12" fill="#1b3f8f"/><rect x="188" y="480" width="24" height="4" fill="#9aa6c4"/><rect x="188" y="490" width="16" height="4" fill="#9aa6c4"/>`);
    }
    if (acc.includes('whistle')) {
      parts.push(`<path d="M172 380 Q186 430 198 450 M228 380 Q214 430 202 450" stroke="#ffffff" stroke-width="5" fill="none"/>`);
      parts.push(`<path ${st} fill="#d7dce8" d="M186 448 L214 448 Q226 448 226 460 Q226 474 212 474 L196 474 Q182 474 182 462 Z"/><circle cx="198" cy="462" r="5" fill="${INK}"/>`);
    }
    if (acc.includes('headphones')) {
      parts.push(`<path d="M138 368 Q200 420 262 368" stroke="${INK}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M138 368 Q200 420 262 368" stroke="#1b3f8f" stroke-width="10" fill="none" stroke-linecap="round"/>`);
      parts.push(`<ellipse ${st} cx="134" cy="370" rx="22" ry="26" fill="#d71f30"/><ellipse ${st} cx="266" cy="370" rx="22" ry="26" fill="#d71f30"/>`);
      parts.push(`<ellipse cx="128" cy="364" rx="8" ry="10" fill="#f06a76"/><ellipse cx="260" cy="364" rx="8" ry="10" fill="#f06a76"/>`);
    }
    if (acc.includes('scarf')) {
      parts.push(`<path ${st} fill="#d71f30" d="M150 346 Q200 384 250 346 L256 384 Q200 420 144 384 Z"/>`);
      parts.push(`<path d="M150 360 Q200 398 252 360" stroke="#ffffff" stroke-width="6" fill="none"/><path d="M148 372 Q200 410 254 372" stroke="#1b3f8f" stroke-width="6" fill="none"/>`);
      parts.push(`<path ${st} fill="#d71f30" d="M164 384 L146 486 L182 492 L192 398 Z"/>`);
      [[0.3, '#ffffff'], [0.45, '#1b3f8f'], [0.6, '#ffffff'], [0.75, '#1b3f8f']].forEach(([t, col]) => {
        parts.push(`<path d="M${164 - 18 * t} ${384 + 102 * t} L${192 - 10 * t} ${398 + 94 * t}" stroke="${col}" stroke-width="7"/>`);
      });
      parts.push(`<path ${st} fill="none" d="M164 384 L146 486 L182 492 L192 398 Z"/>`);
      parts.push(`<path d="M146 486 L144 500 M156 488 L154 502 M166 490 L164 504 M176 491 L175 505" stroke="#d71f30" stroke-width="4" stroke-linecap="round"/>`);
    }

    /* Oreilles + tête */
    parts.push(`<ellipse ${st} cx="102" cy="226" rx="16" ry="25" fill="${p.skin}"/><ellipse ${st} cx="298" cy="226" rx="16" ry="25" fill="${p.skin}"/>`);
    parts.push(`<path d="M100 216 Q108 226 102 238 M300 216 Q292 226 298 238" stroke="${skinS}" stroke-width="4" fill="none"/>`);
    const jaw = p.jaw === 'soft'
      ? 'M200 92 C268 92 302 140 302 206 C302 266 274 316 230 334 C216 340 184 340 170 334 C126 316 98 266 98 206 C98 140 132 92 200 92 Z'
      : 'M200 92 C268 92 302 140 302 206 C302 262 282 306 246 328 C228 338 172 338 154 328 C118 306 98 262 98 206 C98 140 132 92 200 92 Z';
    parts.push(`<path ${st} fill="${p.skin}" d="${jaw}"/>`);
    parts.push(`<path fill="${skinS}" opacity=".55" d="M262 132 C296 168 300 220 292 260 C286 296 262 320 236 330 C262 300 276 262 278 220 C280 184 274 156 262 132 Z"/>`);

    /* Rides / âge */
    if (p.age === 'old') {
      parts.push(`<path d="M164 160 Q200 150 236 160 M172 176 Q200 168 228 176" stroke="${skinS}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
      parts.push(`<path d="M138 244 Q146 252 158 250 M262 244 Q254 252 242 250 M150 280 Q146 296 156 308 M250 280 Q254 296 244 308" stroke="${skinS}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
    }

    /* Joues */
    parts.push(`<ellipse cx="146" cy="268" rx="16" ry="9" fill="#ff7a7a" opacity=".28"/><ellipse cx="254" cy="268" rx="16" ry="9" fill="#ff7a7a" opacity=".28"/>`);

    /* Yeux */
    const eye = (cx) => `
      <ellipse cx="${cx}" cy="226" rx="19" ry="15" fill="#ffffff" stroke="${INK}" stroke-width="3"/>
      <circle cx="${cx + 1}" cy="228" r="11" fill="${p.eyes}"/>
      <circle cx="${cx + 1}" cy="228" r="5.5" fill="${INK}"/>
      <circle cx="${cx - 3}" cy="223" r="3.6" fill="#ffffff"/>
      <path d="M${cx - 21} 222 Q${cx} 204 ${cx + 21} 220" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${p.lashes ? `<path d="M${cx + (cx < 200 ? -20 : 20)} 220 l${cx < 200 ? -7 : 7} -6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` : ''}`;
    parts.push(`<g class="eyes">${eye(160)}${eye(240)}</g>`);
    parts.push(`<g class="lids"><ellipse cx="160" cy="226" rx="21" ry="17" fill="${p.skin}"/><ellipse cx="240" cy="226" rx="21" ry="17" fill="${p.skin}"/><path d="M140 228 Q160 236 180 228 M220 228 Q240 236 260 228" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`);

    /* Sourcils */
    const bw = p.brows || p.hair;
    const browL = p.stern ? 'M136 192 Q160 186 184 198' : 'M136 196 Q158 182 184 192';
    const browR = p.stern ? 'M216 198 Q240 186 264 192' : 'M216 192 Q242 182 264 196';
    parts.push(`<path d="${browL} M${browR.slice(1)}" stroke="${shade(bw, -0.15)}" stroke-width="9" fill="none" stroke-linecap="round"/>`);

    /* Nez */
    parts.push(`<path d="M204 236 Q192 262 197 270 Q206 275 216 268" stroke="${shade(p.skin, -0.3)}" stroke-width="4" fill="none" stroke-linecap="round"/>`);

    /* Barbe */
    if (p.beard === 'full') {
      parts.push(`<path ${st} fill="${p.beardColor}" d="M108 244 C110 300 148 344 200 346 C252 344 290 300 292 244 C282 282 258 300 236 298 C220 296 180 296 164 298 C142 300 118 282 108 244 Z"/>`);
      parts.push(`<path ${st} fill="${p.beardColor}" d="M162 292 Q178 272 200 282 Q222 272 238 292 Q224 298 212 294 Q200 290 188 294 Q176 298 162 292 Z"/>`);
    }
    if (p.beard === 'stubble') {
      parts.push(`<path fill="${p.beardColor}" opacity=".32" d="M112 250 C116 302 152 340 200 342 C248 340 284 302 288 250 C276 288 252 304 232 304 C216 302 184 302 168 304 C148 304 124 288 112 250 Z"/>`);
    }

    /* Bouche */
    const mouthY = p.beard === 'full' ? 310 : 296;
    parts.push(`<g class="mouth-idle"><path d="M180 ${mouthY - 4} Q200 ${mouthY + 12} 222 ${mouthY - 4}" stroke="#7d2e36" stroke-width="5" fill="none" stroke-linecap="round"/></g>`);
    parts.push(`<g class="mouth-talk"><path d="M180 ${mouthY - 6} Q200 ${mouthY + 20} 222 ${mouthY - 6} Q200 ${mouthY} 180 ${mouthY - 6} Z" fill="#6a1f2a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M190 ${mouthY + 6} Q200 ${mouthY + 2} 210 ${mouthY + 6} Q200 ${mouthY + 12} 190 ${mouthY + 6} Z" fill="#e06a78"/></g>`);

    /* Cheveux avant */
    const hs = p.hairStyle;
    if (hs === 'short') {
      parts.push(`<path ${st} fill="${p.hair}" d="M98 206 C94 126 142 82 204 82 C268 82 308 128 302 206 C296 176 286 156 268 144 C246 130 220 128 196 134 C170 136 148 128 132 142 C114 158 104 180 98 206 Z"/>`);
      parts.push(`<path d="M150 104 C180 92 222 92 250 104" stroke="${hairL}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>`);
      parts.push(`<path fill="${p.hair}" d="M99 206 L99 238 L108 238 L110 206 Z M301 206 L301 238 L292 238 L290 206 Z"/>`);
    }
    if (hs === 'fade') {
      parts.push(`<path fill="${hairS}" d="M100 210 C98 160 120 128 140 118 L140 200 C124 196 108 200 100 210 Z M300 210 C302 160 280 128 260 118 L260 200 C276 196 292 200 300 210 Z" opacity=".75"/>`);
      parts.push(`<path ${st} fill="${p.hair}" d="M114 178 C110 118 150 80 202 80 C256 80 294 118 288 178 C282 152 270 136 252 128 C222 116 178 116 150 128 C130 136 118 152 114 178 Z"/>`);
      parts.push(`<path d="M150 100 Q200 84 250 100" stroke="${hairL}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>`);
    }
    if (hs === 'messy') {
      parts.push(`<path ${st} fill="${p.hair}" d="M98 212 C90 140 118 100 148 92 L156 66 L180 86 L196 58 L214 84 L238 62 L248 92 C284 102 310 142 302 212 C292 176 274 152 250 142 L240 164 L224 142 L208 166 L192 142 L174 164 L162 144 C132 152 110 178 98 212 Z"/>`);
      parts.push(`<path d="M168 92 L182 78 M210 84 L224 72" stroke="${hairL}" stroke-width="6" stroke-linecap="round" opacity=".9"/>`);
    }
    if (hs === 'long') {
      parts.push(`<path ${st} fill="${p.hair}" d="M98 224 C92 134 140 82 204 82 C268 82 310 134 302 224 C296 190 282 160 262 146 C232 172 184 174 146 150 C124 170 106 196 98 224 Z"/>`);
      parts.push(`<path d="M140 120 C170 98 230 96 262 118" stroke="${hairL}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".75"/>`);
    }
    if (hs === 'ponytail') {
      parts.push(`<path ${st} fill="${p.hair}" d="M100 212 C96 130 142 84 202 84 C262 84 306 130 300 212 C292 172 272 142 238 132 C200 126 160 132 136 146 C116 162 104 186 100 212 Z"/>`);
      parts.push(`<path d="M106 170 C130 112 270 112 294 170" stroke="${INK}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M106 170 C130 112 270 112 294 170" stroke="#1b3f8f" stroke-width="11" fill="none" stroke-linecap="round"/>`);
      parts.push(`<path d="M150 100 C176 90 220 90 246 98" stroke="${hairL}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>`);
    }
    if (hs === 'cap') {
      parts.push(`<path ${st} fill="${p.hair}" d="M98 200 Q92 230 104 252 L114 244 Q108 222 114 204 Z M302 200 Q308 230 296 252 L286 244 Q292 222 286 204 Z"/>`);
      parts.push(`<path ${st} fill="${p.cap}" d="M98 198 C96 122 142 78 200 78 C258 78 304 122 302 198 Z"/>`);
      parts.push(`<path fill="${shade(p.cap, 0.18)}" d="M128 116 C150 94 176 86 200 86 L200 196 L118 196 C116 160 118 136 128 116 Z" opacity=".6"/>`);
      parts.push(`<path d="M200 80 L200 196" stroke="${shade(p.cap, -0.3)}" stroke-width="3"/>`);
      parts.push(`<rect x="98" y="176" width="204" height="14" fill="#d71f30"/><rect x="98" y="182" width="204" height="4" fill="#ffffff"/>`);
      parts.push(`<path ${st} fill="${shade(p.cap, -0.25)}" d="M80 200 Q200 170 320 200 Q328 220 304 222 Q200 200 96 222 Q72 220 80 200 Z"/>`);
      parts.push(`<circle cx="200" cy="80" r="8" fill="${shade(p.cap, -0.2)}" stroke="${INK}" stroke-width="3"/>`);
    }

    /* Lunettes */
    if (p.glasses) {
      parts.push(`<g fill="rgba(200,225,255,.25)" stroke="${p.glassesColor || INK}" stroke-width="6"><rect x="130" y="204" width="60" height="44" rx="14"/><rect x="210" y="204" width="60" height="44" rx="14"/></g><path d="M190 222 Q200 214 210 222" stroke="${p.glassesColor || INK}" stroke-width="6" fill="none"/><path d="M130 222 L106 216 M270 222 L294 216" stroke="${p.glassesColor || INK}" stroke-width="5"/>`);
      parts.push(`<path d="M140 214 L152 210 M220 214 L232 210" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`);
    }

    return `<svg class="portrait-svg" viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${parts.join('')}</svg>`;
  }

  window.ART = { sprite, portrait, mix, shade };
})();

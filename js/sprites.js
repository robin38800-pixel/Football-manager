/* Sprites pixel art générés à partir de grilles de caractères (12 × 16). */

const SPRITE_BASE = {
  down: [
    '....OOOO....',
    '..OOHHHHOO..',
    '.OHHHHHHHHO.',
    '.OHHHHHHHHO.',
    '.OHHSSSSHHO.',
    '.OSSESSESSO.',
    '.OSSSSSSSSO.',
    '..OSSSSSSO..',
    '...OTTTTO...',
    '..OTTTTTTO..',
    '.OTOTTTTOTO.',
    '.OSOTTTTOSO.',
    '..OPPPPPPO..',
    '..OPPOOPPO..',
    '..OPO..OPO..',
    '..OBO..OBO..',
  ],
  up: [
    '....OOOO....',
    '..OOHHHHOO..',
    '.OHHHHHHHHO.',
    '.OHHHHHHHHO.',
    '.OHHHHHHHHO.',
    '.OHHHHHHHHO.',
    '.OHHHHHHHHO.',
    '..OHHHHHHO..',
    '...OTTTTO...',
    '..OTTTTTTO..',
    '.OTOTTTTOTO.',
    '.OSOTTTTOSO.',
    '..OPPPPPPO..',
    '..OPPOOPPO..',
    '..OPO..OPO..',
    '..OBO..OBO..',
  ],
  side: [
    '....OOOO....',
    '...OHHHHOO..',
    '..OHHHHHHHO.',
    '..OHHHHHHHO.',
    '..OHHHSSSSO.',
    '..OHHSSSESO.',
    '..OHHSSSSSO.',
    '...OSSSSSO..',
    '....OTTTO...',
    '...OTTTTTO..',
    '...OTTOTTO..',
    '...OTTSTTO..',
    '...OPPPPPO..',
    '...OPPOPPO..',
    '...OPO.OPO..',
    '...OBO.OBBO.',
  ],
};

function cloneRows(rows) { return rows.map((r) => r.split('')); }

function applyLook(rows, dir, look) {
  const g = cloneRows(rows);
  if (look.hair === 'long') {
    for (let y = 4; y <= 9; y++) {
      if (dir === 'side') { g[y][2] = 'H'; g[y][1] = 'O'; }
      else { g[y][1] = 'H'; g[y][0] = 'O'; g[y][10] = 'H'; g[y][11] = 'O'; }
    }
  }
  if (look.hair === 'cap') {
    if (dir === 'side') {
      g[1] = '...OCCCCOO..'.split('');
      g[2] = '..OCCCCCCCO.'.split('');
      g[3] = '..OCCCCKKKKO'.split('');
    } else {
      g[1] = '..OOCCCCOO..'.split('');
      g[2] = '.OCCCCCCCCO.'.split('');
      g[3] = dir === 'down' ? '.OKKKKKKKKO.'.split('') : '.OCCCCCCCCO.'.split('');
    }
  }
  if (look.glasses) {
    if (dir === 'down') g[5] = '.OSGGSSGGSO.'.split('');
    if (dir === 'side') g[5] = '..OHHSSGGGO.'.split('');
  }
  if (look.beard && dir !== 'up') {
    if (dir === 'down') g[7] = '..OHHHHHHO..'.split('');
    else g[7] = '...OSSHHHO..'.split('');
  }
  return g;
}

const SPRITE_CACHE = new Map();

function spriteURL(look, dir) {
  const key = JSON.stringify(look) + dir;
  if (SPRITE_CACHE.has(key)) return SPRITE_CACHE.get(key);
  const baseDir = dir === 'left' || dir === 'right' ? 'side' : dir;
  const grid = applyLook(SPRITE_BASE[baseDir], baseDir, look);
  const pal = {
    O: '#23202e', E: '#1b1b2a', G: '#2c3550',
    H: look.hairColor, S: look.skin, T: look.top, P: look.pants, B: look.shoes || '#3a2a24',
    C: look.cap || '#c0392b', K: look.brim || '#7d2318',
  };
  const c = document.createElement('canvas');
  c.width = 12; c.height = 16;
  const ctx = c.getContext('2d');
  grid.forEach((row, y) => row.forEach((ch, x) => {
    if (ch === '.') return;
    ctx.fillStyle = pal[ch] || '#ff00ff';
    const px = dir === 'left' ? 11 - x : x;
    ctx.fillRect(px, y, 1, 1);
  }));
  // Reflet léger sur le haut : ombrage du vêtement
  const url = c.toDataURL();
  SPRITE_CACHE.set(key, url);
  return url;
}

/* Petits objets pixel (ballon, plot) */
function pixelURL(rows, pal) {
  const c = document.createElement('canvas');
  c.width = rows[0].length; c.height = rows.length;
  const ctx = c.getContext('2d');
  rows.forEach((row, y) => row.split('').forEach((ch, x) => {
    if (ch === '.') return;
    ctx.fillStyle = pal[ch];
    ctx.fillRect(x, y, 1, 1);
  }));
  return c.toDataURL();
}

const BALL = [
  '...OOOO...',
  '..OWWWWO..',
  '.OWKKWWWO.',
  'OWWKKWWWWO',
  'OWWWWWKKWO',
  'OWKWWWKKWO',
  'OWKKWWWWWO',
  '.OWWWKKWO.',
  '..OWWWWO..',
  '...OOOO...',
];
const CONE = [
  '....OO....',
  '...OAAO...',
  '...OAAO...',
  '..OWWWWO..',
  '..OAAAAO..',
  '.OAAAAAAO.',
  '.OWWWWWWO.',
  'OAAAAAAAAO',
  'OOOOOOOOOO',
];
const PLANT = [
  '....GG.GG...',
  '..GGLGGLGG..',
  '.GLGGGGGLGG.',
  'GGGLGGLGGGLG',
  '.GGGLGGGGGG.',
  'GLGGGGLGGLGG',
  '.GGLGGGGLGG.',
  '..GGGGLGGG..',
  '...OPPPPO...',
  '...OPPPPO...',
  '....OPPO....',
  '....OOOO....',
];
const TROPHY = [
  '.OOOOOOOO.',
  'OYYYYYYYYO',
  'OYOYYYYOYO',
  'OYOYYYYOYO',
  '.OYYYYYYO.',
  '..OYYYYO..',
  '...OYYO...',
  '...OYYO...',
  '..OOYYOO..',
  '.OBBBBBBO.',
  '.OBBBBBBO.',
  '.OOOOOOOO.',
];

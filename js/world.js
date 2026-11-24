/* Le centre d'entraînement : décor pixel art dessiné sur canvas, déplacements au clic ou au clavier. */
(function () {
  'use strict';
  const { sprite, mix, shade } = window.ART;

  const T = 16, COLS = 22, ROWS = 13, W = COLS * T, H = ROWS * T, WALK_Y = 3;
  const C = {
    navy: '#0f1f4a', navy2: '#13275c', blue: '#1f4596', blueL: '#3561b8', royal: '#1b3f8f',
    red: '#d71f30', redD: '#9e1422', white: '#ffffff', ink: '#1a1d33',
    wall: '#e8edf7', wallSeam: '#d5ddee',
    tile: '#f5f7fc', tile2: '#edf1f9', grout: '#d9e0ef',
    wood: '#c8935f', wood2: '#bd8754', woodL: '#9b693e',
    turf: '#4fa35b', turf2: '#47964f', carpet: '#263b72', carpet2: '#2f4683',
    metal: '#c9d0de', metalD: '#8e98b0', glass: '#bfe3ff',
  };

  /* Générateur pseudo-aléatoire stable (pour les détails du décor) */
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function painter(ctx) {
    return (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
  }

  /* ---------------- Décor fixe : sols et murs ---------------- */
  function zoneOf(x, y) {
    if (y < WALK_Y) return 'wall';
    if (x <= 6) return y <= 7 ? 'wood' : 'turf';
    if (x >= 15) return y <= 7 ? 'wood' : 'carpet';
    return 'tile';
  }

  function drawBackground() {
    const c = cnv(W, H), ctx = c.getContext('2d'), r = painter(ctx);
    seed = 11;
    for (let ty = WALK_Y; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        const x = tx * T, y = ty * T, z = zoneOf(tx, ty);
        if (z === 'tile') {
          r(x, y, T, T, (tx + ty) % 2 ? C.tile : C.tile2);
          r(x, y + 15, T, 1, C.grout); r(x + 15, y, 1, T, C.grout);
          r(x + 1, y + 1, 3, 1, '#ffffff');
        } else if (z === 'wood') {
          for (let p = 0; p < 4; p++) {
            const py = y + p * 4, off = ((ty * 4 + p) * 7) % 16;
            r(x, py, T, 4, p % 2 ? C.wood : C.wood2);
            r(x, py + 3, T, 1, C.woodL);
            if ((tx * 16 + off) % 24 < 16) r(x + ((off + tx * 5) % 16), py, 1, 3, C.woodL);
            if (rnd() < 0.08) r(x + Math.floor(rnd() * 13), py + 1, 2, 1, shade(C.wood, -0.2));
          }
        } else if (z === 'turf') {
          r(x, y, T, T, tx % 2 ? C.turf : C.turf2);
          for (let i = 0; i < 6; i++) r(x + Math.floor(rnd() * 16), y + Math.floor(rnd() * 15), 1, 2, i % 2 ? '#63b86e' : '#3f8a48');
        } else if (z === 'carpet') {
          r(x, y, T, T, C.carpet);
          for (let i = 0; i < 16; i += 4) for (let j = 0; j < 16; j += 4) r(x + i + ((j / 4) % 2) * 2, y + j, 1, 1, C.carpet2);
        }
      }
    }
    // Bordures entre zones
    r(7 * T - 1, WALK_Y * T, 1, (ROWS - WALK_Y) * T, '#b6bfd4');
    r(15 * T, WALK_Y * T, 1, (ROWS - WALK_Y) * T, '#b6bfd4');
    r(0, 8 * T, 7 * T - 1, 1, '#2f7a3a');
    r(15 * T + 1, 8 * T, 7 * T - 1, 1, '#18294f');
    // Lignes blanches du mini terrain
    r(2, 8 * T + 2, 7 * T - 5, 1, '#ffffff'); r(2, H - 3, 7 * T - 5, 1, '#ffffff');
    r(2, 8 * T + 2, 1, 5 * T - 4, '#ffffff'); r(7 * T - 4, 8 * T + 2, 1, 5 * T - 4, '#ffffff');
    // Échelle de rythme au sol
    for (let i = 0; i < 4; i++) { r(2 * T + i * 10, 11 * T + 3, 1, 10, '#f4c14a'); }
    r(2 * T, 11 * T + 3, 31, 1, '#f4c14a'); r(2 * T, 11 * T + 12, 31, 1, '#f4c14a');

    // Rond central aux couleurs du club
    const cx = 11 * T, cy = 7.5 * T;
    for (let y = -30; y <= 30; y++) for (let x = -30; x <= 30; x++) {
      const d = Math.sqrt((x + 0.5) * (x + 0.5) + (y + 0.5) * (y + 0.5));
      if (d >= 25.5 && d < 28.5) r(cx + x, cy + y, 1, 1, C.red);
      else if (d >= 22.5 && d < 24.5) r(cx + x, cy + y, 1, 1, C.royal);
    }
    r(cx - 2, cy - 2, 4, 4, C.royal);
    r(cx - 22, cy, 44, 1, 'rgba(27,63,143,.3)');
    // Tapis rouge de l'entrée
    r(10 * T + 2, 9 * T + 6, 2 * T - 4, 4 * T - 6, C.red);
    r(10 * T + 2, 9 * T + 6, 1, 4 * T - 6, '#f07a85'); r(12 * T - 3, 9 * T + 6, 1, 4 * T - 6, C.redD);
    r(10 * T + 5, 9 * T + 6, 1, 4 * T - 6, '#ffffff'); r(12 * T - 6, 9 * T + 6, 1, 4 * T - 6, '#ffffff');
    // Paillasson de sortie
    r(10 * T, 12 * T + 3, 2 * T, 13, C.navy); r(10 * T + 2, 12 * T + 5, 2 * T - 4, 9, C.blue);
    for (let i = 0; i < 2 * T - 6; i += 3) r(10 * T + 3 + i, 12 * T + 6, 1, 7, C.blueL);

    drawWall(ctx, r);
    // Ombre portée du mur
    const g = ctx.createLinearGradient(0, WALK_Y * T, 0, WALK_Y * T + 6);
    g.addColorStop(0, 'rgba(15,31,74,.22)'); g.addColorStop(1, 'rgba(15,31,74,0)');
    ctx.fillStyle = g; ctx.fillRect(0, WALK_Y * T, W, 6);
    return c;
  }

  function drawWall(ctx, r) {
    r(0, 0, W, 6, C.navy2); r(0, 5, W, 1, '#2a4589');
    r(0, 6, W, 28, C.wall);
    for (let x = 0; x < W; x += 32) r(x, 6, 1, 28, C.wallSeam);
    r(0, 6, W, 2, '#d0d9eb');
    r(0, 34, W, 2, C.red);
    r(0, 36, W, 8, C.blue); r(0, 36, W, 1, C.blueL);
    for (let x = 8; x < W; x += 24) { r(x, 38, 1, 5, C.navy); r(x + 1, 38, 1, 5, C.blueL); }
    r(0, 44, W, 4, C.navy);

    // Tableau blanc tactique (zone de Bernard)
    const bx = 18, by = 9;
    r(bx - 2, by - 2, 66, 27, C.metalD); r(bx - 1, by - 1, 64, 25, C.metal);
    r(bx, by, 62, 23, '#ffffff');
    r(bx + 30, by + 2, 1, 19, '#9db4e0');
    ctx.strokeStyle = '#9db4e0'; ctx.lineWidth = 1; ctx.strokeRect(bx + 25.5, by + 7.5, 11, 8);
    [[8, 5], [8, 17], [16, 11], [21, 5], [21, 17]].forEach(([x, y]) => r(bx + x, by + y, 3, 3, C.red));
    [[40, 4], [44, 11], [40, 18], [52, 11]].forEach(([x, y]) => r(bx + x, by + y, 3, 3, C.royal));
    for (let i = 0; i < 8; i++) r(bx + 11 + i, by + 7 - Math.floor(i / 3), 1, 1, C.ink);
    r(bx + 19, by + 4, 1, 2, C.ink); r(bx + 18, by + 4, 2, 1, C.ink);
    r(bx + 10, by + 24, 42, 2, C.metalD);
    r(bx + 14, by + 23, 6, 1, C.red); r(bx + 22, by + 23, 6, 1, C.royal);

    // Fenêtre avec vue sur le stade
    const wx = 90, wy = 9;
    r(wx - 2, wy - 2, 32, 27, '#ffffff'); r(wx - 2, wy + 23, 32, 2, '#c4cde0');
    r(wx, wy, 28, 23, '#9fd3f7');
    r(wx, wy, 28, 6, '#bfe3ff');
    r(wx + 2, wy + 2, 6, 2, '#ffffff'); r(wx + 18, wy + 4, 7, 2, '#ffffff');
    r(wx, wy + 13, 28, 10, '#6d7d9e');
    r(wx + 3, wy + 10, 22, 5, '#d9dee9'); r(wx + 3, wy + 10, 22, 1, '#ffffff');
    r(wx + 2, wy + 9, 1, 4, C.metalD); r(wx + 25, wy + 9, 1, 4, C.metalD);
    r(wx + 4, wy + 16, 20, 4, '#4fa35b');
    r(wx + 13, wy, 2, 23, '#ffffff'); r(wx, wy + 11, 28, 1, '#ffffff');

    // Vitrine à trophées derrière l'accueil
    const vx = 132, vy = 7;
    r(vx, vy, 88, 29, '#6b4429'); r(vx + 2, vy + 2, 84, 25, '#2b1d16');
    r(vx + 3, vy + 3, 82, 23, '#3a2a22');
    r(vx + 3, vy + 14, 82, 2, '#7a5236'); r(vx + 3, vy + 25, 82, 1, '#7a5236');
    const cup = (x, y, big) => {
      const w = big ? 8 : 6;
      r(x, y, w, 1, '#8a6516'); r(x, y + 1, w, 4, '#f4c14a'); r(x + 1, y + 1, 1, 3, '#fff1b8');
      r(x - 1, y + 1, 1, 2, '#f4c14a'); r(x + w, y + 1, 1, 2, '#f4c14a');
      r(x + Math.floor(w / 2) - 1, y + 5, 2, 2, '#d9a531'); r(x + 1, y + 7, w - 2, 2, '#5a3b26');
    };
    cup(vx + 8, vy + 4, false); cup(vx + 22, vy + 3, true); cup(vx + 40, vy + 4, false); cup(vx + 56, vy + 3, true); cup(vx + 72, vy + 4, false);
    [[vx + 10, vy + 17, C.red], [vx + 28, vy + 17, C.royal], [vx + 52, vy + 17, '#ffffff'], [vx + 68, vy + 17, C.red]].forEach(([x, y, col]) => {
      r(x, y, 6, 7, col); r(x - 1, y, 1, 3, col); r(x + 6, y, 1, 3, col); r(x + 2, y, 2, 1, C.ink);
    });
    r(vx + 38, vy + 17, 10, 7, '#cfd6e6'); r(vx + 39, vy + 18, 8, 5, '#f4c14a');
    r(vx + 3, vy + 3, 1, 22, 'rgba(255,255,255,.25)'); r(vx + 44, vy + 3, 1, 22, 'rgba(255,255,255,.18)');
    // Bannières rayées rouge et bleu
    [[124, C.red, C.royal], [224, C.royal, C.red]].forEach(([x, a, b]) => {
      r(x, 6, 6, 24, a); r(x + 2, 6, 2, 24, b);
      r(x, 30, 2, 3, a); r(x + 4, 30, 2, 3, a);
    });

    // Maillot encadré
    const jx = 236, jy = 10;
    r(jx - 2, jy - 2, 18, 22, '#ffffff'); r(jx - 1, jy - 1, 16, 20, '#2a3150');
    r(jx + 3, jy + 2, 8, 15, '#ffffff'); r(jx, jy + 2, 3, 5, '#ffffff'); r(jx + 11, jy + 2, 3, 5, '#ffffff');
    r(jx + 3, jy + 7, 8, 2, C.red); r(jx + 3, jy + 9, 8, 2, C.royal);
    r(jx + 6, jy + 2, 2, 1, '#2a3150');

    // Carte du réseau de recrutement (zone de Sami)
    const mx = 258, my = 9;
    r(mx - 2, my - 2, 60, 27, '#6b4429'); r(mx, my, 56, 23, '#8fd0ef');
    [[4, 4, 12, 8], [6, 12, 6, 7], [22, 3, 10, 6], [24, 9, 8, 10], [36, 4, 14, 9], [44, 15, 6, 4]].forEach(([x, y, w, h]) => r(mx + x, my + y, w, h, '#7cc06a'));
    [[8, 7], [27, 6], [29, 12], [41, 8], [10, 15], [46, 16]].forEach(([x, y]) => { r(mx + x, my + y, 2, 2, C.red); r(mx + x, my + y - 2, 1, 2, C.ink); });
    ctx.strokeStyle = 'rgba(215,31,48,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx + 9, my + 8); ctx.lineTo(mx + 28, my + 7); ctx.lineTo(mx + 42, my + 9); ctx.stroke();

    // Horloge
    const hx = 334, hy = 12;
    r(hx, hy, 14, 14, C.navy); r(hx + 1, hy + 1, 12, 12, '#ffffff');
    r(hx + 6, hy + 3, 2, 5, C.ink); r(hx + 7, hy + 7, 4, 1, C.red);
    r(hx + 1, hy + 1, 12, 1, C.red);
  }

  /* ---------------- Mobilier (dessiné une fois, trié en profondeur) ---------------- */
  function prop(w, h, draw) { const c = cnv(w, h); draw(painter(c.getContext('2d')), c.getContext('2d')); return c; }

  const PROPS = [];
  function addProp(o) { PROPS.push(o); }

  function buildProps() {
    seed = 3;
    // Bibliothèque
    addProp({ x: 0, y: 3, w: 1, h: 1, px: 0, py: 30, img: prop(16, 34, (r) => {
      r(0, 0, 16, 34, '#6b4429'); r(1, 1, 14, 32, '#4a2f1f');
      [2, 12, 22].forEach((sy) => {
        r(1, sy + 9, 14, 2, '#7a5236');
        let x = 2;
        while (x < 14) { const w = 1 + Math.floor(rnd() * 2); const h = 6 + Math.floor(rnd() * 3); r(x, sy + 9 - h, w, h, [C.red, C.royal, '#f4c14a', '#ffffff', '#5aa36a'][Math.floor(rnd() * 5)]); x += w + (rnd() < 0.2 ? 1 : 0); }
      });
    }), msg: 'Des classeurs : « Règlement de la Ligue 1 », « Fair-play financier », « Rapports des jeunes ». Jacques les connaît par cœur.' });

    // Paperboard
    addProp({ x: 5, y: 4, w: 1, h: 1, px: 80, py: 50, img: prop(16, 30, (r) => {
      r(3, 20, 1, 10, C.metalD); r(12, 20, 1, 10, C.metalD); r(7, 22, 2, 8, C.metalD);
      r(1, 0, 14, 22, C.metal); r(2, 1, 12, 20, '#ffffff');
      r(2, 1, 12, 3, C.royal);
      r(4, 7, 8, 1, C.red); r(4, 10, 6, 1, '#9aa6c4'); r(4, 13, 7, 1, '#9aa6c4'); r(4, 16, 5, 1, '#9aa6c4');
    }), msg: 'Le paperboard de Bernard : « Compacité. Patience. Contre-pressing. » souligné trois fois.' });

    // Table de réunion + tabourets
    addProp({ x: 1, y: 6, w: 3, h: 1, px: 16, py: 92, img: prop(48, 20, (r) => {
      r(0, 4, 48, 9, '#8a5d3b'); r(0, 4, 48, 2, '#a7774f'); r(0, 13, 48, 2, '#5a3b26');
      r(2, 15, 2, 5, '#5a3b26'); r(44, 15, 2, 5, '#5a3b26');
      r(6, 5, 14, 6, '#3c8f4a'); r(13, 5, 1, 6, '#ffffff'); r(8, 7, 2, 2, C.red); r(16, 8, 2, 2, C.royal);
      r(26, 5, 7, 5, '#ffffff'); r(27, 6, 5, 1, '#9aa6c4'); r(27, 8, 4, 1, '#9aa6c4');
      r(37, 5, 4, 4, '#ffffff'); r(38, 6, 2, 2, '#5c3a22');
    }), msg: 'La table des réunions tactiques. Des magnets rouges et bleus partout.' });
    [[1, 7], [3, 7]].forEach(([x, y]) => addProp({ x, y, w: 1, h: 1, px: x * T + 2, py: y * T + 4, img: prop(12, 12, (r) => {
      r(1, 0, 10, 4, C.red); r(1, 0, 10, 1, '#f06a76'); r(2, 4, 8, 2, C.redD); r(2, 6, 1, 6, C.metalD); r(9, 6, 1, 6, C.metalD);
    }), msg: 'Un tabouret. Bernard ne s’assoit jamais pendant les réunions.' }));

    // Plantes
    const plant = prop(16, 26, (r) => {
      const leaves = [[7, 0, 2, 6], [3, 3, 3, 7], [10, 2, 3, 8], [1, 8, 4, 4], [11, 8, 4, 4], [5, 5, 6, 9], [2, 12, 12, 3]];
      leaves.forEach(([x, y, w, h]) => r(x, y, w, h, '#3d9a4f'));
      [[7, 1, 1, 4], [4, 4, 1, 4], [11, 3, 1, 4], [6, 7, 1, 5], [9, 9, 1, 4]].forEach(([x, y, w, h]) => r(x, y, w, h, '#7fd08a'));
      [[2, 10, 2, 2], [12, 10, 2, 2], [6, 13, 4, 2]].forEach(([x, y, w, h]) => r(x, y, w, h, '#2b7a3a'));
      r(3, 15, 10, 2, C.navy); r(4, 17, 8, 8, C.royal); r(4, 17, 2, 8, C.blueL); r(4, 20, 8, 1, C.red); r(5, 25, 6, 1, C.navy);
    });
    [[7, 3, 'Une plante. Elle est en meilleure forme que ton arrière gauche.'], [14, 3, 'Margaux arrose cette plante avant chaque match. Superstition.'], [21, 12, 'Une plante. Théo lui parle pendant les longues soirées vidéo.']].forEach(([x, y, msg]) =>
      addProp({ x, y, w: 1, h: 1, px: x * T, py: y * T - 10, img: plant, msg }));

    // Comptoir d'accueil
    addProp({ x: 8, y: 4, w: 6, h: 1, px: 128, py: 54, talk: 'club', img: prop(96, 26, (r) => {
      r(0, 0, 96, 8, '#f6f8fc'); r(0, 0, 96, 1, '#ffffff'); r(0, 7, 96, 1, '#c4cde0');
      r(0, 8, 96, 16, C.royal); r(0, 8, 96, 1, C.blueL);
      r(0, 13, 96, 3, C.red); r(0, 14, 96, 1, '#f06a76');
      for (let x = 8; x < 96; x += 16) r(x, 17, 1, 6, C.navy);
      r(0, 24, 96, 2, C.navy);
      // Objets sur le comptoir
      r(10, 1, 12, 5, '#ffffff'); r(11, 2, 8, 1, '#9aa6c4'); r(11, 4, 6, 1, '#9aa6c4');
      r(60, -0, 14, 1, C.ink); r(62, 1, 10, 5, '#d7dce8');
      r(84, 2, 5, 4, '#f4c14a'); r(86, 1, 1, 1, '#f4c14a');
      r(40, 2, 8, 4, C.red); r(41, 3, 6, 2, '#ffffff');
    }) });
    // Écran posé sur le comptoir
    addProp({ x: 12, y: 4, w: 0, h: 0, px: 186, py: 44, sortY: 81, img: prop(14, 12, (r) => {
      r(0, 0, 14, 9, C.ink); r(1, 1, 12, 7, '#2a3a6a'); r(2, 2, 6, 1, '#7fd08a'); r(2, 4, 9, 1, '#9db4e0'); r(2, 6, 5, 1, '#9db4e0'); r(6, 9, 2, 2, C.metalD); r(3, 11, 8, 1, C.metalD);
    }) });

    // Bureau de Sami avec écrans
    addProp({ x: 16, y: 4, w: 3, h: 1, px: 256, py: 50, talk: 'transferts', img: prop(48, 30, (r) => {
      r(0, 10, 48, 8, '#a7774f'); r(0, 10, 48, 1, '#c28f62'); r(0, 18, 48, 10, '#7d5438'); r(0, 28, 48, 2, '#4d3222');
      r(4, 20, 12, 1, '#5a3b26'); r(32, 20, 12, 1, '#5a3b26');
      const screen = (x, col) => { r(x, 0, 12, 9, C.ink); r(x + 1, 1, 10, 7, '#18233f'); for (let i = 0; i < 3; i++) r(x + 2, 2 + i * 2, 4 + ((i * 3) % 5), 1, col); r(x + 5, 9, 2, 2, C.metalD); r(x + 2, 11, 8, 1, C.metalD); };
      screen(1, '#7fd08a'); screen(35, '#f4c14a');
      r(18, 12, 12, 3, '#d7dce8'); r(19, 13, 10, 1, '#9aa6c4');
      r(31, 11, 3, 4, '#ffffff'); r(32, 12, 1, 2, C.red);
    }) });
    // Classeurs et fontaine
    [[20, 3], [21, 3]].forEach(([x, y]) => addProp({ x, y, w: 1, h: 1, px: x * T, py: y * T - 8, img: prop(16, 24, (r) => {
      r(1, 0, 14, 24, '#9aa6c4'); r(1, 0, 14, 1, '#c9d0de'); r(14, 0, 1, 24, '#7a849c');
      [2, 10, 18].forEach((y) => { r(2, y, 12, 6, '#b3bccf'); r(6, y + 2, 4, 1, C.navy); });
      r(3, 4, 3, 1, C.red);
    }), msg: 'Les classeurs de Sami : « Fins de contrat », « Jeunes Europe », « Pistes Amérique du Sud ».' }));
    addProp({ x: 15, y: 3, w: 1, h: 1, px: 240, py: 30, img: prop(16, 34, (r) => {
      r(4, 0, 8, 11, '#9fd3f7'); r(4, 0, 8, 2, '#d7efff'); r(5, 3, 1, 7, '#ffffff');
      r(3, 11, 10, 22, '#e8ecf5'); r(3, 11, 10, 1, '#ffffff'); r(12, 11, 1, 22, '#b3bccf');
      r(6, 15, 2, 2, C.royal); r(9, 15, 2, 2, C.red); r(5, 20, 6, 8, '#c4cde0');
    }), msg: 'La fontaine à eau. Inès compte combien de verres boit chaque joueur.' });

    // Cage d'entraînement
    addProp({ x: 0, y: 9, w: 1, h: 2, px: 0, py: 134, img: prop(18, 44, (r) => {
      r(0, 0, 3, 44, '#ffffff'); r(0, 0, 16, 3, '#ffffff'); r(0, 41, 16, 3, '#ffffff');
      for (let y = 4; y < 41; y += 3) r(3, y, 12, 1, 'rgba(255,255,255,.55)');
      for (let x = 5; x < 16; x += 3) r(x, 3, 1, 38, 'rgba(255,255,255,.45)');
      r(2, 0, 1, 44, '#c9d0de');
    }), msg: "Une cage d'entraînement. Les attaquants y travaillent leur finition chaque mardi." });
    blockTile(0, 10);
    // Plots et ballons
    const cone = prop(12, 12, (r) => { r(5, 0, 2, 2, '#f07a2a'); r(4, 2, 4, 3, '#ffffff'); r(3, 5, 6, 3, '#f07a2a'); r(2, 8, 8, 2, '#ffffff'); r(0, 10, 12, 2, '#c4561a'); r(4, 2, 1, 8, 'rgba(255,255,255,.4)'); });
    [[2, 8], [5, 11], [6, 9]].forEach(([x, y]) => addProp({ x, y, w: 1, h: 1, px: x * T + 2, py: y * T + 3, img: cone, msg: "Un plot d'entraînement. Il défend mieux que certains de tes joueurs." }));
    const ball = prop(10, 9, (r) => {
      const rows = ['..OOOOOO..', '.OWWKKWWO.', 'OWWKKKKWWO', 'OKWWKKWWKO', 'OKKWWWWKKO', 'OWWWWWWWWO', 'OWKKWWKKWO', '.OKKWWKKO.', '..OOOOOO..'];
      const pal = { O: C.ink, W: '#ffffff', K: '#2b2f45' };
      rows.forEach((row, y) => row.split('').forEach((ch, x) => { if (ch !== '.') r(x, y, 1, 1, pal[ch]); }));
      r(2, 1, 1, 1, '#ffffff'); r(8, 5, 1, 2, '#d7dce8');
    });
    [[5, 9], [1, 12]].forEach(([x, y]) => addProp({ x, y, w: 1, h: 1, px: x * T + 3, py: y * T + 5, img: ball, msg: 'Tu tentes un jongle... 3 jongles. Pas mal pour un coach !' }));

    // Écran d'analyse vidéo
    addProp({ x: 17, y: 8, w: 3, h: 1, px: 272, py: 104, img: prop(48, 40, (r) => {
      r(22, 26, 4, 10, C.metalD); r(14, 36, 20, 4, '#5b6684'); r(14, 36, 20, 1, C.metal);
      r(0, 0, 48, 28, C.ink); r(2, 2, 44, 24, '#3d9a4f');
      for (let x = 2; x < 46; x += 8) r(x, 2, 4, 24, '#46a85a');
      r(24, 2, 1, 24, '#ffffff'); r(2, 2, 44, 1, '#ffffff'); r(2, 25, 44, 1, '#ffffff');
      r(2, 9, 6, 10, 'rgba(255,255,255,.0)'); r(8, 9, 1, 10, '#ffffff'); r(2, 9, 6, 1, '#ffffff'); r(2, 18, 6, 1, '#ffffff');
      r(39, 9, 1, 10, '#ffffff'); r(40, 9, 6, 1, '#ffffff'); r(40, 18, 6, 1, '#ffffff');
      [[12, 6], [16, 15], [20, 10], [28, 7], [30, 18]].forEach(([x, y]) => r(x, y, 2, 2, C.red));
      [[34, 12], [26, 14], [37, 20], [18, 21]].forEach(([x, y]) => r(x, y, 2, 2, '#ffffff'));
      r(13, 7, 1, 1, '#f4c14a'); r(14, 8, 1, 1, '#f4c14a'); r(15, 9, 1, 1, '#f4c14a'); r(16, 10, 2, 1, '#f4c14a');
      r(36, 3, 8, 3, 'rgba(26,29,51,.7)'); r(37, 4, 2, 1, C.red); r(40, 4, 3, 1, '#ffffff');
    }), msg: "Théo repasse le dernier match de l'adversaire. Image par image." });
    // Canapé (vu de dos)
    addProp({ x: 16, y: 11, w: 4, h: 1, px: 258, py: 172, img: prop(60, 20, (r) => {
      r(0, 0, 60, 12, C.red); r(0, 0, 60, 2, '#f06a76'); r(2, 12, 56, 6, C.redD);
      r(0, 4, 4, 14, C.redD); r(56, 4, 4, 14, C.redD);
      r(20, 2, 1, 10, C.redD); r(40, 2, 1, 10, C.redD); r(2, 18, 56, 2, C.ink);
    }), msg: 'Le canapé de la salle vidéo. On y regarde les matchs adverses, pas des films.' });
    // Table basse avec ordinateur
    addProp({ x: 21, y: 9, w: 1, h: 1, px: 336, py: 147, img: prop(16, 14, (r) => {
      r(0, 4, 16, 3, '#ffffff'); r(0, 7, 16, 1, '#c4cde0'); r(1, 8, 1, 6, C.metalD); r(14, 8, 1, 6, C.metalD);
      r(3, 0, 10, 4, C.ink); r(4, 1, 8, 2, '#2a3a6a'); r(5, 1, 3, 1, '#7fd08a');
    }), msg: 'Un ordinateur avec 340 clips vidéo classés par adversaire.' });

    // Bancs de l'accueil
    [[13, 10, C.red, '#f06a76'], [13, 11, C.royal, C.blueL]].forEach(([x, y, a, b]) => addProp({ x, y, w: 1, h: 1, px: x * T + 1, py: y * T + 2, img: prop(14, 14, (r) => {
      r(0, 0, 14, 5, a); r(0, 0, 14, 1, b); r(1, 5, 12, 4, shade(a, -0.25)); r(1, 9, 1, 5, C.metalD); r(12, 9, 1, 5, C.metalD);
    }), msg: 'Un banc. Assieds-toi un instant... Non, le mercato n’attend pas !' }));
  }

  /* ---------------- Carte de passage ---------------- */
  const blocked = new Map();
  function blockTile(x, y, data) { blocked.set(x + ',' + y, data || { msg: null }); }

  /* ---------------- Personnages ---------------- */
  const state = {
    npcs: [], player: null, paused: false, bubbles: {}, hover: null, dest: null, keys: new Set(), onArrive: null, time: 0,
  };
  let cb = {};

  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  function npcAt(x, y) { return state.npcs.find((n) => n.x === x && n.y === y); }
  function passable(x, y) {
    if (x < 0 || y < WALK_Y || x >= COLS || y >= ROWS) return false;
    if (blocked.has(x + ',' + y)) return false;
    return !npcAt(x, y);
  }

  function bfs(sx, sy, goals) {
    const key = (x, y) => x + ',' + y;
    const goalSet = new Set(goals.map(([x, y]) => key(x, y)));
    if (goalSet.has(key(sx, sy))) return [];
    const prev = new Map([[key(sx, sy), null]]);
    const q = [[sx, sy]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of Object.values(DIRS)) {
        const nx = x + dx, ny = y + dy, k = key(nx, ny);
        if (prev.has(k) || !passable(nx, ny)) continue;
        prev.set(k, key(x, y));
        if (goalSet.has(k)) {
          const path = [];
          let cur = k;
          while (cur && cur !== key(sx, sy)) { const [px, py] = cur.split(',').map(Number); path.unshift([px, py]); cur = prev.get(cur); }
          return path;
        }
        q.push([nx, ny]);
      }
    }
    return null;
  }

  const neighbours = (x, y) => Object.values(DIRS).map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => passable(a, b));
  const dirTo = (fx, fy, tx, ty) => (Math.abs(tx - fx) > Math.abs(ty - fy) ? (tx > fx ? 'right' : 'left') : (ty > fy ? 'down' : 'up'));

  /* Ce qu'il y a sur une case (PNJ, meuble, décor mural) */
  function thingAt(x, y) {
    const n = npcAt(x, y);
    if (n) return { npc: n, x, y };
    const b = blocked.get(x + ',' + y);
    if (b && (b.talk || b.msg)) return { prop: b, x, y };
    if (y < WALK_Y) {
      const wallMsg = WALL_MSGS.find((m) => x >= m.x0 && x <= m.x1);
      if (wallMsg) return { wall: wallMsg, x, y: WALK_Y - 1 };
    }
    return null;
  }
  const WALL_MSGS = [
    { x0: 1, x1: 4, msg: 'Le tableau tactique. Bernard y a dessiné 47 flèches. Tu en comprends 3.' },
    { x0: 5, x1: 6, msg: 'Par la fenêtre, on aperçoit le stade. Il est plein les soirs de match.' },
    { x0: 8, x1: 13, msg: 'La vitrine à trophées du club. Il reste un peu de place pour les tiens.' },
    { x0: 14, x1: 15, msg: 'Un maillot encadré, signé par toute l’équipe de la saison dernière.' },
    { x0: 16, x1: 19, msg: 'La carte du réseau de recrutement. Des punaises partout : Sami ne dort jamais.' },
    { x0: 20, x1: 21, msg: "L'horloge du centre. Elle avance de deux minutes, comme le veut la tradition." },
  ];

  function interact(t) {
    if (!t) return false;
    const p = state.player;
    if (t.npc) {
      p.dir = dirTo(p.x, p.y, t.npc.x, t.npc.y);
      t.npc.dir = dirTo(t.npc.x, t.npc.y, p.x, p.y);
      cb.onTalk && cb.onTalk(t.npc.id);
      return true;
    }
    if (t.prop) {
      p.dir = dirTo(p.x, p.y, t.x, t.y);
      if (t.prop.talk) {
        const n = state.npcs.find((m) => m.id === t.prop.talk);
        n.dir = dirTo(n.x, n.y, p.x, p.y);
        cb.onTalk && cb.onTalk(n.id);
      } else cb.onMessage && cb.onMessage(t.prop.msg);
      return true;
    }
    if (t.wall) { p.dir = 'up'; cb.onMessage && cb.onMessage(t.wall.msg); return true; }
    return false;
  }

  function facing() {
    const p = state.player, [dx, dy] = DIRS[p.dir];
    return thingAt(p.x + dx, p.y + dy);
  }

  /* Se rendre quelque part (clic) */
  function goTo(tx, ty) {
    const p = state.player;
    const t = thingAt(tx, ty);
    let goals, after = null;
    if (t) {
      if (t.wall) goals = [[tx, WALK_Y]].filter(([a, b]) => passable(a, b)).concat(neighbours(tx, WALK_Y));
      else goals = neighbours(t.x, t.y);
      const adj = Math.abs(p.x - t.x) + Math.abs(p.y - t.y) === 1 || (t.wall && p.y === WALK_Y && Math.abs(p.x - tx) <= 1);
      if (adj && !p.path.length) { interact(t); return; }
      after = () => {
        if (t.wall) { p.dir = 'up'; cb.onMessage && cb.onMessage(t.wall.msg); }
        else interact(thingAt(t.x, t.y) || t);
      };
    } else {
      if (!passable(tx, ty)) return;
      goals = [[tx, ty]];
    }
    const from = p.moving ? p.next : [p.x, p.y];
    const path = bfs(from[0], from[1], goals);
    if (!path) return;
    p.path = path;
    state.onArrive = after;
    state.dest = path.length ? path[path.length - 1] : null;
    if (!path.length && after) { after(); state.onArrive = null; }
  }

  function step(dir) {
    const p = state.player;
    p.dir = dir;
    const [dx, dy] = DIRS[dir];
    if (passable(p.x + dx, p.y + dy)) { p.path = [[p.x + dx, p.y + dy]]; state.dest = null; state.onArrive = null; }
  }

  /* ---------------- Boucle de jeu ---------------- */
  const SPEED = 6.5; // cases par seconde
  function update(dt) {
    state.time += dt;
    const p = state.player;
    if (!p.moving && p.path.length) {
      p.next = p.path.shift();
      p.dir = dirTo(p.x, p.y, p.next[0], p.next[1]);
      p.moving = true;
      p.t = 0;
    }
    if (p.moving) {
      p.t += dt * SPEED;
      if (p.t >= 1) {
        p.x = p.next[0]; p.y = p.next[1]; p.moving = false; p.walk = (p.walk + 1) % 4;
        if (!p.path.length) {
          state.dest = null;
          if (state.onArrive) { const f = state.onArrive; state.onArrive = null; f(); }
          else if (p.x >= 10 && p.x <= 11 && p.y === 12) cb.onMessage && cb.onMessage('La sortie vers le terrain. Reviens quand tu veux, coach !');
          if (!state.paused) {
            const held = [...state.keys].pop();
            if (held) step(held);
          }
        }
      }
    } else if (!state.paused && state.keys.size) {
      step([...state.keys].pop());
    }
    // Les membres du staff se tournent de temps en temps
    state.npcs.forEach((n) => {
      n.idle -= dt;
      if (n.idle <= 0) {
        n.idle = 2.5 + Math.random() * 4;
        const near = Math.abs(n.x - p.x) + Math.abs(n.y - p.y) <= 2;
        if (near) n.dir = dirTo(n.x, n.y, p.x, p.y);
        else if (!n.fixed) n.dir = ['down', 'down', 'left', 'right', n.home][Math.floor(Math.random() * 5)];
      }
    });
  }

  let canvas, ctx, scene, sctx, bg, cam = { sx: 0, sy: 0, sw: W, sh: H, dx: 0, dy: 0, scale: 1 };

  function bubble(x, y, kind) {
    const r = painter(sctx);
    const bob = Math.round(Math.sin(state.time * 5) * 1);
    const bx = x + 3, by = y - 12 + bob;
    r(bx, by, 11, 9, C.ink); r(bx + 1, by + 1, 9, 7, '#ffffff');
    r(bx + 3, by + 9, 3, 1, C.ink); r(bx + 4, by + 8, 2, 1, '#ffffff');
    if (kind === '!') { r(bx + 5, by + 2, 1, 3, C.red); r(bx + 5, by + 6, 1, 1, C.red); r(bx + 4, by + 2, 1, 3, C.red); r(bx + 4, by + 6, 1, 1, C.red); }
    else { r(bx + 2, by + 4, 1, 1, C.ink); r(bx + 5, by + 4, 1, 1, C.ink); r(bx + 8, by + 4, 1, 1, C.ink); }
  }

  function render() {
    const r = painter(sctx);
    sctx.drawImage(bg, 0, 0);
    const p = state.player;
    const ppx = (p.moving ? p.x + (p.next[0] - p.x) * p.t : p.x) * T;
    const ppy = (p.moving ? p.y + (p.next[1] - p.y) * p.t : p.y) * T;

    // Repère de survol et de destination
    if (state.hover && !state.paused) {
      const [hx, hy] = state.hover;
      sctx.fillStyle = 'rgba(255,255,255,.35)'; sctx.fillRect(hx * T, hy * T, T, T);
      sctx.strokeStyle = 'rgba(27,63,143,.55)'; sctx.lineWidth = 1; sctx.strokeRect(hx * T + 0.5, hy * T + 0.5, T - 1, T - 1);
    }
    if (state.dest) {
      const [dx, dy] = state.dest, k = 2 + Math.round((Math.sin(state.time * 8) + 1) * 1.5);
      sctx.strokeStyle = C.red; sctx.lineWidth = 1; sctx.strokeRect(dx * T + k + 0.5, dy * T + k + 0.5, T - 2 * k - 1, T - 2 * k - 1);
    }

    // Tri en profondeur : meubles et personnages
    const items = PROPS.map((o) => ({ y: o.sortY || (o.y + Math.max(o.h, 1)) * T, draw: () => sctx.drawImage(o.img, o.px, o.py) }));
    const drawChar = (look, dir, frame, x, y) => {
      sctx.fillStyle = 'rgba(15,31,74,.22)';
      sctx.fillRect(x + 3, y + 14, 10, 2); sctx.fillRect(x + 4, y + 13, 8, 4);
      sctx.drawImage(sprite(look, dir, frame), x, y - 8);
    };
    state.npcs.forEach((n) => items.push({ y: (n.y + 1) * T, draw: () => drawChar(n.look, n.dir, 0, n.x * T, n.y * T) }));
    const frame = p.moving ? (p.t < 0.5 ? (p.walk % 2 ? 1 : 2) : 0) : 0;
    items.push({ y: ppy + T + 0.5, draw: () => drawChar(p.look, p.dir, frame, Math.round(ppx), Math.round(ppy)) });
    items.sort((a, b) => a.y - b.y).forEach((it) => it.draw());

    // Bulles
    const f = !p.moving && facing();
    state.npcs.forEach((n) => {
      const kind = state.bubbles[n.id] || (f && f.npc === n ? '…' : (f && f.prop && f.prop.talk === n.id ? '…' : null));
      if (kind) bubble(n.x * T, n.y * T - 8, kind);
    });

    // Composition finale à l'échelle de l'écran
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(scene, cam.sx, cam.sy, cam.sw, cam.sh, cam.dx, cam.dy, cam.sw * cam.scale, cam.sh * cam.scale);
    void r;
  }

  function updateCamera() {
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    }
    let scale = ch / H;
    if (cw / scale < 12 * T) scale = cw / (12 * T);
    const viewW = cw / scale, viewH = ch / scale;
    const p = state.player;
    const ppx = (p.moving ? p.x + (p.next[0] - p.x) * p.t : p.x) * T + T / 2;
    const ppy = (p.moving ? p.y + (p.next[1] - p.y) * p.t : p.y) * T + T / 2;
    let sx = 0, sw = W, dx = 0, sy = 0, sh = H, dy = 0;
    if (viewW >= W) dx = (viewW - W) / 2; else { sw = viewW; sx = Math.max(0, Math.min(W - viewW, ppx - viewW / 2)); }
    if (viewH >= H) dy = (viewH - H) / 2; else { sh = viewH; sy = Math.max(0, Math.min(H - viewH, ppy - viewH / 2)); }
    const s = scale * dpr;
    cam = { sx: Math.round(sx * s) / s, sy: Math.round(sy * s) / s, sw, sh, dx: Math.round(dx * s), dy: Math.round(dy * s), scale: s, cssScale: scale, cssDx: dx * scale, cssDy: dy * scale };
  }

  function toTile(ev) {
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left - cam.cssDx) / cam.cssScale + cam.sx;
    const y = (ev.clientY - rect.top - cam.cssDy) / cam.cssScale + cam.sy;
    if (x < 0 || y < 0 || x >= W || y >= H) return null;
    return [Math.floor(x / T), Math.floor(y / T)];
  }

  let last = 0;
  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    update(dt);
    updateCamera();
    render();
    requestAnimationFrame(loop);
  }

  /* ---------------- Initialisation ---------------- */
  function init(opts) {
    cb = opts;
    canvas = opts.canvas;
    ctx = canvas.getContext('2d');
    scene = cnv(W, H); sctx = scene.getContext('2d');
    bg = drawBackground();
    buildProps();
    PROPS.forEach((o) => {
      if (!o.w || !o.h) return;
      for (let x = o.x; x < o.x + o.w; x++) for (let y = o.y; y < o.y + o.h; y++) blockTile(x, y, { msg: o.msg, talk: o.talk });
    });
    // Zones réservées derrière l'accueil et le bureau
    for (let x = 8; x <= 13; x++) if (x !== 10) blockTile(x, 3, { msg: "C'est le bureau de Margaux. On ne passe pas derrière le comptoir !" });
    blockTile(16, 3, { talk: 'transferts' }); blockTile(18, 3, { talk: 'transferts' });

    state.npcs = opts.staff.map((s) => ({ id: s.id, x: s.x, y: s.y, dir: s.dir, home: s.dir, look: s.sprite, idle: 2 + Math.random() * 3, fixed: s.fixed }));
    state.player = { x: 11, y: 10, dir: 'up', path: [], moving: false, t: 0, next: [11, 10], walk: 0, look: opts.player };

    canvas.addEventListener('pointerdown', (e) => {
      if (state.paused) return;
      const tile = toTile(e);
      if (!tile) return;
      cb.onActivity && cb.onActivity();
      goTo(tile[0], tile[1]);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const tile = toTile(e);
      if (!tile) { state.hover = null; canvas.style.cursor = 'default'; return; }
      const t = thingAt(tile[0], tile[1]);
      state.hover = !t && passable(tile[0], tile[1]) ? tile : null;
      canvas.style.cursor = t ? 'pointer' : passable(tile[0], tile[1]) ? 'pointer' : 'default';
    });
    canvas.addEventListener('pointerleave', () => { state.hover = null; });

    const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', z: 'up', w: 'up', s: 'down', q: 'left', a: 'left', d: 'right' };
    const typing = () => { const a = document.activeElement; return a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName); };
    window.addEventListener('keydown', (e) => {
      if (state.paused || typing() || e.ctrlKey || e.metaKey || e.altKey) return;
      const dir = KEYS[e.key] || KEYS[e.key.toLowerCase()];
      if (dir) {
        e.preventDefault();
        state.keys.delete(dir); state.keys.add(dir);
        cb.onActivity && cb.onActivity();
        if (!state.player.moving && !state.player.path.length) step(dir);
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        const onCtl = document.activeElement && /^(BUTTON|A|SUMMARY)$/.test(document.activeElement.tagName);
        if (onCtl) return;
        e.preventDefault();
        interact(facing());
      }
    });
    window.addEventListener('keyup', (e) => {
      const dir = KEYS[e.key] || KEYS[e.key.toLowerCase()];
      if (dir) state.keys.delete(dir);
    });
    window.addEventListener('blur', () => state.keys.clear());
    requestAnimationFrame(loop);
  }

  window.WORLD = {
    init,
    pause(v) { state.paused = v; state.keys.clear(); if (v) { state.player.path = []; state.dest = null; state.onArrive = null; state.hover = null; } },
    setBubble(id, kind) { if (kind) state.bubbles[id] = kind; else delete state.bubbles[id]; },
    walkTo(id) {
      const n = state.npcs.find((m) => m.id === id);
      if (n) goTo(n.x, n.y);
    },
  };
})();

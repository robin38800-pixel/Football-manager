/* Staff de Poche FM27 — interface : HUD, conversations, outils du staff. */
(function () {
  'use strict';

  /* ---------------- Outils ---------------- */
  const PREFIX = 'staffdepoche.';
  const store = {
    get(key, fallback) {
      try { const raw = localStorage.getItem(PREFIX + key); return raw == null ? fallback : JSON.parse(raw); } catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ } },
  };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function money(n) {
    if (!isFinite(n)) return '—';
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' M€';
    if (a >= 1e3) return Math.round(n / 1e3).toLocaleString('fr-FR') + ' k€';
    return Math.round(n).toLocaleString('fr-FR') + ' €';
  }
  const num = (v) => { const n = parseFloat(String(v).replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; };

  /* ---------------- État ---------------- */
  const DEFAULT_PROFILE = { club: 'Olympique Lyonnais', ligue: 'Ligue 1', saison: '2026/27', statut: 'haut', style: 'equilibre', objectif: '', budget: '', salaire: '' };
  const saved = store.get('profile', null);
  const state = {
    profile: saved && saved.club ? saved : { ...DEFAULT_PROFILE },
    profileSaved: !!(saved && saved.club),
    checklist: store.get('checklist', {}),
    notes: store.get('notes', []),
    shortlist: store.get('shortlist', null),
    tabs: store.get('tabs', {}),
    tactic: { statut: null, style: null, force: null, mode: 'ip', sel: -1, systeme: 'equilibre' },
    recrut: { poste: 'bu', style: null },
    calc: { fee: '12000000', wage: '60000', years: '4', age: '23', bonus: '800000' },
    plan: 'saison',
    talk: { ctx: 'avant', sit: 'favori' },
    gloss: '',
  };
  const EXEMPLES_SHORTLIST = [
    { id: 'ex1', nom: 'Lucas Moreau', poste: 'Ailier', age: 21, valeur: 9000000, status: 1, ex: true },
    { id: 'ex2', nom: 'Diego Ferreira', poste: 'Défenseur central', age: 29, valeur: 0, status: 0, note: 'Fin de contrat en juin', ex: true },
  ];

  /* ---------------- Le staff ---------------- */
  const STAFF = [
    {
      id: 'club', name: 'Margaux', role: 'Secrétaire générale', topic: 'Fiche du club et carnet de saison', x: 10, y: 3, dir: 'down', glow: 'rgba(215,31,48,.55)',
      sprite: { id: 'margaux', hair: 'long', H: '#a8442a', S: '#f3cfb0', T: '#14285c', C: '#ffffff', P: '#1d2a55' },
      art: { skin: '#f3cfb0', hair: '#a8442a', hairStyle: 'long', eyes: '#3f7a4a', outfit: 'blazer', top: '#14285c', shirt: '#ffffff', acc: ['lanyard'], lashes: true, jaw: 'soft' },
      lines: () => !state.profile.budget
        ? [`Bienvenue à l'${state.profile.club}, coach ! Je suis Margaux, je tiens le registre du club.`, "J'ai déjà noté le club et le championnat. Il me manque ton budget transferts et ta marge salariale : tu les trouves dans l'écran Finances du jeu.", "J'ai mis « Haut de tableau » comme statut. Vérifie l'objectif fixé par le conseil d'administration et corrige-moi si besoin."]
        : [`Tout est à jour pour l'${state.profile.club}, coach.`, 'Modifie la fiche si ta situation change : le staff adapte ses conseils. Et note tes idées dans le carnet de saison !'],
    },
    {
      id: 'tactique', name: 'Bernard', role: 'Entraîneur adjoint', topic: 'Tactiques et systèmes de jeu', x: 2, y: 4, dir: 'down', glow: 'rgba(42,85,176,.6)',
      sprite: { id: 'bernard', hair: 'short', H: '#b9bcc6', S: '#d9a27a', T: '#1b3f8f', C: '#ffffff', P: '#14285c', beard: true, F: '#c9ccd4' },
      art: { skin: '#d9a27a', hair: '#b9bcc6', hairStyle: 'short', eyes: '#4a3424', outfit: 'tracksuit', top: '#1b3f8f', beard: 'full', beardColor: '#c9ccd4', stern: true, age: 'old', brows: '#9ea2ae' },
      lines: () => ['Alors coach, on joue comment ?', "Réponds à mes trois questions et je te propose un système, avec un plan B. Depuis FM26, chaque tactique a deux formes : avec le ballon et sans le ballon."],
    },
    {
      id: 'transferts', name: 'Sami', role: 'Recruteur en chef', topic: 'Transferts et recrutement', x: 17, y: 3, dir: 'down', glow: 'rgba(242,182,50,.45)',
      sprite: { id: 'sami', hair: 'short', H: '#1f1a1a', S: '#8d5a3b', T: '#14285c', C: '#d71f30', P: '#3b3b4b', glasses: true },
      art: { skin: '#8d5a3b', hair: '#1f1a1a', hairStyle: 'fade', eyes: '#2a1a10', outfit: 'quarterzip', top: '#14285c', glasses: true, beard: 'stubble', beardColor: '#1f1a1a' },
      lines: () => ["J'ai des yeux dans tous les championnats, coach.", 'Dis-moi quel poste tu veux renforcer : je te dis quels attributs regarder, et si le joueur rentre dans ton budget.'],
    },
    {
      id: 'entrainement', name: 'Inès', role: 'Préparatrice physique', topic: 'Entraînement et jeunes', x: 3, y: 9, dir: 'right', glow: 'rgba(215,31,48,.5)',
      sprite: { id: 'ines', hair: 'ponytail', H: '#3a2418', S: '#c68a5e', T: '#d71f30', C: '#ffffff', P: '#14285c' },
      art: { skin: '#c68a5e', hair: '#3a2418', hairStyle: 'ponytail', eyes: '#3a2418', outfit: 'sport', top: '#d71f30', acc: ['whistle'], lashes: true, jaw: 'soft' },
      lines: () => ['Un joueur fatigué, c’est un joueur blessé !', 'Choisis la période de la saison et je te donne le planning de la semaine. Je m’occupe aussi des jeunes.'],
    },
    {
      id: 'match', name: 'Théo', role: 'Analyste vidéo', topic: 'Matchs et causeries', x: 18, y: 9, dir: 'down', glow: 'rgba(120,170,255,.5)',
      sprite: { id: 'theo', hair: 'short', H: '#e3b94e', S: '#f3d2b3', T: '#eef2fa', C: '#1b3f8f', P: '#2a2f3a', glasses: true },
      art: { skin: '#f3d2b3', hair: '#e3b94e', hairStyle: 'messy', eyes: '#2f6fb0', outfit: 'hoodie', top: '#f4f6fb', glasses: true, glassesColor: '#1b3f8f', acc: ['headphones'], jaw: 'soft' },
      lines: () => ["J'ai regardé les vidéos de l'adversaire. Trois fois.", 'Avant le match, pendant le match, dans le vestiaire : je te dis quoi faire.'],
    },
    {
      id: 'guide', name: 'Jacques', role: 'Ancien coach, ton mentor', topic: 'Guide FM27 pour débutant', x: 8, y: 10, dir: 'down', glow: 'rgba(242,182,50,.45)',
      sprite: { id: 'jacques', hair: 'cap', H: '#9aa0ad', S: '#f1c7a1', T: '#c9b48a', C: '#d71f30', P: '#5a4a3a', beard: true, F: '#ececec', Q: '#14285c', K: '#0f1f4a' },
      art: { skin: '#f1c7a1', hair: '#d6d6d6', hairStyle: 'cap', cap: '#14285c', eyes: '#4a6a8a', outfit: 'cardigan', top: '#c9b48a', shirt: '#cfe0f5', beard: 'full', beardColor: '#eeeeee', age: 'old', acc: ['scarf'], brows: '#d6d6d6' },
      lines: () => {
        const done = Object.values(state.checklist).filter(Boolean).length;
        return done === 0
          ? ['Ah, un nouveau coach ! Ça me rappelle mes débuts sur le banc...', "FM27 fait peur au début. Suis ma liste des premiers pas, une étape à la fois. Je t'explique aussi l'interface du jeu et le vocabulaire."]
          : [`Déjà ${done} étape${done > 1 ? 's' : ''} sur ${CHECKLIST.length}. Bien, petit !`, 'Continue ma liste. Et si un mot te bloque, regarde le glossaire.'];
      },
    },
  ];
  const staffById = Object.fromEntries(STAFF.map((s) => [s.id, s]));
  const PLAYER = { id: 'player', hair: 'short', H: '#4a2f1d', S: '#e8b48a', T: '#14285c', C: '#d71f30', P: '#0f1f4a', B: '#f2f2f2' };

  const ARTS = {};
  STAFF.forEach((s) => { ARTS[s.id] = window.ART.portrait(s.art); });
  const face = (id) => ARTS[id].replace('viewBox="0 0 400 520"', 'viewBox="78 56 244 244"');

  /* ---------------- HUD ---------------- */
  function updateHud() {
    const p = state.profile;
    $('#hudName').textContent = p.club || 'Mon club';
    $('#hudSub').textContent = [p.ligue, p.saison].filter(Boolean).join(' · ');
    const done = Object.values(state.checklist).filter(Boolean).length;
    $('#hudProgressTxt').textContent = `${done}/${CHECKLIST.length}`;
    $('#hudProgress').setAttribute('aria-label', `Premiers pas : ${done} sur ${CHECKLIST.length}`);
  }
  function refreshWorld() {
    window.WORLD.setBubble('club', state.profile.budget ? null : '!');
    window.WORLD.setBubble('guide', Object.values(state.checklist).some(Boolean) ? null : '!');
  }

  function staffCards() {
    return STAFF.map((s) => `<button type="button" class="staff-card" data-open="${s.id}">
      <span class="face" style="--c:${s.glow}">${face(s.id)}</span>
      <span><b>${esc(s.name)}</b><span>${esc(s.topic)}</span></span></button>`).join('');
  }

  /* ---------------- Boîte de message (dans la salle) ---------------- */
  const msg = { lines: [], i: 0, typing: false, timer: null };
  function say(lines, speakerId) {
    msg.lines = Array.isArray(lines) ? lines : [lines];
    msg.i = 0;
    const s = speakerId && staffById[speakerId];
    $('#msgFace').hidden = !s;
    $('#msgName').hidden = !s;
    if (s) { $('#msgFace').innerHTML = face(s.id); $('#msgFace').style.setProperty('--c', s.glow); $('#msgName').textContent = s.name; }
    $('#msgbox').hidden = false;
    window.WORLD.pause(true);
    typeInto($('#msgText'), msg, () => {});
  }
  function typeInto(el, box, onTick) {
    clearInterval(box.timer);
    const txt = box.lines[box.i];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { el.textContent = txt; box.typing = false; onTick(false); return; }
    let n = 0; box.typing = true; el.textContent = '';
    box.timer = setInterval(() => {
      n += 2;
      el.textContent = txt.slice(0, n);
      onTick(true, n);
      if (n >= txt.length) { clearInterval(box.timer); box.typing = false; onTick(false); }
    }, 18);
  }
  function msgNext() {
    if (msg.typing) { clearInterval(msg.timer); msg.typing = false; $('#msgText').textContent = msg.lines[msg.i]; return; }
    if (msg.i < msg.lines.length - 1) { msg.i++; typeInto($('#msgText'), msg, () => {}); return; }
    $('#msgbox').hidden = true;
    window.WORLD.pause(false);
  }
  $('#msgbox .msg-inner').addEventListener('click', msgNext);

  /* ---------------- Conversation ---------------- */
  const convo = { id: null, lines: [], i: 0, typing: false, timer: null };
  const convoEl = $('#convo');
  let blinkT = null;

  function openConvo(id, tab) {
    const s = staffById[id];
    if (!s) return;
    if (tab) state.tabs[id] = tab;
    convo.id = id;
    window.WORLD.pause(true);
    $('#msgbox').hidden = true;
    $('#sheet').hidden = true;
    convoEl.hidden = false;
    $('#convoChar').style.setProperty('--glow', s.glow);
    $('#charArt').innerHTML = ARTS[id];
    $('#plateName').textContent = s.name;
    $('#plateRole').textContent = s.role;
    $('#speechName').textContent = s.name;
    renderTabs(id);
    speak(s.lines());
    $('#convoBody').scrollTop = 0;
    if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
    clearInterval(blinkT);
    blinkT = setInterval(() => {
      const c = $('#convoChar');
      c.classList.add('blink');
      setTimeout(() => c.classList.remove('blink'), 140);
    }, 3200);
  }
  function closeConvo() {
    convoEl.hidden = true;
    convo.id = null;
    clearInterval(convo.timer); clearInterval(blinkT);
    window.WORLD.pause(false);
    history.replaceState(null, '', location.pathname + location.search);
    updateHud(); refreshWorld();
  }
  function speak(lines) {
    convo.lines = lines; convo.i = 0;
    showLine();
  }
  function showLine() {
    const c = $('#convoChar');
    $('#speechNext').hidden = convo.i >= convo.lines.length - 1;
    typeInto($('#speechText'), convo, (talking, n) => {
      c.classList.toggle('talking', talking);
      c.classList.toggle('mo', talking && Math.floor((n || 0) / 6) % 2 === 0);
    });
  }
  function speechNext() {
    if (convo.typing) { clearInterval(convo.timer); convo.typing = false; $('#speechText').textContent = convo.lines[convo.i]; $('#convoChar').classList.remove('talking', 'mo'); return; }
    if (convo.i < convo.lines.length - 1) { convo.i++; showLine(); }
  }
  $('#speech').addEventListener('click', speechNext);
  $('#speech').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); speechNext(); } });
  $('#convoClose').addEventListener('click', closeConvo);

  function renderTabs(id) {
    const mod = MODULES[id];
    const tab = state.tabs[id] && mod.tabs.some(([k]) => k === state.tabs[id]) ? state.tabs[id] : mod.tabs[0][0];
    $('#tabs').innerHTML = mod.tabs.map(([k, l]) => `<button type="button" class="tab" role="tab" aria-selected="${k === tab}" data-tab="${k}">${esc(l)}</button>`).join('');
    $$('[data-tab]', $('#tabs')).forEach((b) => b.addEventListener('click', () => {
      state.tabs[id] = b.dataset.tab;
      store.set('tabs', state.tabs);
      $$('[data-tab]', $('#tabs')).forEach((x) => x.setAttribute('aria-selected', x === b));
      mod.render($('#content'), b.dataset.tab);
    }));
    mod.render($('#content'), tab);
  }

  const MODULES = {
    club: { tabs: [['fiche', 'Fiche du club'], ['carnet', 'Carnet de saison']], render: (el, t) => renderClub(el, t) },
    tactique: { tabs: [['assistant', 'Assistant'], ['systemes', 'Les systèmes'], ['diagnostic', 'Diagnostic'], ['regles', "Règles d'or"]], render: (el, t) => renderTactique(el, t) },
    transferts: { tabs: [['fiche', 'Fiche de poste'], ['calcul', 'Calculateur'], ['liste', 'Ma liste'], ['conseils', 'Conseils']], render: (el, t) => renderTransferts(el, t) },
    entrainement: { tabs: [['planning', 'Planning'], ['individuel', 'Individuel'], ['jeunes', 'Jeunes'], ['fatigue', 'Fatigue']], render: (el, t) => renderEntrainement(el, t) },
    match: { tabs: [['avant', 'Avant'], ['pendant', 'Pendant'], ['causeries', 'Causeries']], render: (el, t) => renderMatch(el, t) },
    guide: { tabs: [['depart', 'Premiers pas'], ['interface', "L'interface"], ['nouveautes', 'Nouveautés FM27'], ['glossaire', 'Glossaire'], ['pieges', 'Pièges']], render: (el, t) => renderGuide(el, t) },
  };

  /* ----- Margaux : fiche du club + carnet ----- */
  const STATUT_CONSEILS = {
    favori: ['Le conseil attend le titre : chaque défaite sera commentée.', 'Tu as les moyens de dominer : tactique offensive, pressing ou possession.', 'Gère la fatigue : ton effectif jouera beaucoup de matchs.'],
    haut: ["Vise le haut du classement et l'Europe.", 'Une base solide + un ou deux joueurs décisifs devant.', 'Recrute malin : des joueurs à leur pic (24-28 ans).'],
    milieu: ['Objectif réaliste : finir dans la première moitié.', 'Sois solide à domicile, prudent à l’extérieur.', 'Les prêts et les joueurs libres sont tes meilleures affaires.'],
    maintien: ['Vise environ 40 points pour te maintenir dans un championnat à 20 équipes (moins s’il y a moins de clubs).', 'Priorité à la défense : bloc compact et contre-attaque.', 'Les matchs contre les équipes de ton niveau valent double.'],
    promu: ['Le maintien sera déjà une réussite.', 'Joue simple et compact : 4-4-2 ou 5-3-2.', 'Cherche des joueurs libres expérimentés et des prêts de jeunes talents.'],
  };

  function renderClub(el, tab) {
    if (tab === 'carnet') return renderCarnet(el);
    const p = state.profile || {};
    const opt = (list, val) => list.map((o) => `<option value="${o.id}" ${o.id === val ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
    el.innerHTML = `
      <form class="textbox" id="clubForm">
        <h2>Fiche du club</h2>
        <div class="form">
          <div class="field"><label for="f-club">Nom du club</label><input id="f-club" name="club" value="${esc(p.club || '')}" placeholder="ex. FC Annecy"></div>
          <div class="field"><label for="f-ligue">Championnat</label><input id="f-ligue" name="ligue" value="${esc(p.ligue || '')}" placeholder="ex. Ligue 2"></div>
          <div class="field"><label for="f-saison">Saison</label><input id="f-saison" name="saison" value="${esc(p.saison || '2026/27')}"></div>
          <div class="field"><label for="f-statut">Statut du club</label><select id="f-statut" name="statut">${opt(STATUTS, p.statut || 'milieu')}</select></div>
          <div class="field"><label for="f-style">Style que tu aimes</label><select id="f-style" name="style">${opt(STYLES, p.style || 'equilibre')}</select></div>
          <div class="field"><label for="f-objectif">Objectif du conseil</label><input id="f-objectif" name="objectif" value="${esc(p.objectif || '')}" placeholder="ex. Milieu de tableau"></div>
          <div class="field"><label for="f-budget">Budget transferts (€)</label><input id="f-budget" name="budget" inputmode="numeric" value="${esc(p.budget || '')}" placeholder="ex. 5000000"></div>
          <div class="field"><label for="f-salaire">Marge salariale (€/semaine)</label><input id="f-salaire" name="salaire" inputmode="numeric" value="${esc(p.salaire || '')}" placeholder="ex. 40000"></div>
        </div>
        <div class="row" style="margin-top:14px"><button class="btn" type="submit">Enregistrer</button><span class="muted" id="saved" aria-live="polite"></span></div>
      </form>
      <div class="textbox" id="clubAdvice"></div>`;
    const showAdvice = () => {
      const st = (state.profile && state.profile.statut) || $('#f-statut').value;
      const label = STATUTS.find((x) => x.id === st).label;
      $('#clubAdvice').innerHTML = `<h2>Ce que le staff retient</h2>
        <div class="stat" style="margin-bottom:10px"><span class="badge blue">${esc(label)}</span>${p.budget ? `<span class="badge gold">Transferts : ${money(num(p.budget))}</span>` : ''}${p.salaire ? `<span class="badge green">Salaires : ${money(num(p.salaire))}/sem.</span>` : ''}</div>
        <ul class="dots">${STATUT_CONSEILS[st].map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <p class="muted" style="margin-top:10px">Où trouver ces infos dans le jeu : cherche « Finances » et « Conseil d'administration » avec la recherche, ou regarde les messages du Portail en début de saison.</p>`;
    };
    showAdvice();
    $('#f-statut').addEventListener('change', showAdvice);
    $('#clubForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      state.profile = Object.fromEntries(fd.entries());
      store.set('profile', state.profile);
      state.profileSaved = true;
      state.tactic.statut = state.profile.statut;
      state.tactic.style = state.profile.style;
      $('#saved').textContent = 'Fiche enregistrée.';
      updateHud();
      refreshWorld();
      showAdvice();
      speak([`C'est noté pour ${state.profile.club || 'le club'} ! Tout le staff a reçu la fiche.`, 'Va voir Bernard pour la tactique, ou Sami pour le mercato.']);
    });
  }

  function renderCarnet(el) {
    el.innerHTML = `
      <form class="textbox" id="noteForm">
        <h2>Carnet de saison</h2>
        <div class="field full"><label for="n-txt">Nouvelle note</label><textarea id="n-txt" placeholder="ex. J12 : victoire 2-0, le 4-4-2 marche bien à l'extérieur. Cibler un latéral gauche en janvier."></textarea></div>
        <div class="row" style="margin-top:10px"><button class="btn" type="submit">Ajouter</button></div>
      </form>
      <div class="notes-list" id="notes"></div>`;
    const draw = () => {
      $('#notes').innerHTML = state.notes.length
        ? state.notes.map((n, i) => `<div class="note"><div class="note-head"><time>${esc(n.d)}</time><button type="button" class="x" data-del="${i}" aria-label="Supprimer la note">✕</button></div><p>${esc(n.t)}</p></div>`).join('')
        : '<div class="textbox"><p class="muted">Ton carnet est vide. Note ici tes résultats, ce qui marche, tes idées de recrues. Tout reste dans ce navigateur.</p></div>';
      $$('[data-del]', el).forEach((b) => b.addEventListener('click', () => {
        state.notes.splice(+b.dataset.del, 1);
        store.set('notes', state.notes);
        draw();
      }));
    };
    draw();
    $('#noteForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = $('#n-txt').value.trim();
      if (!t) return;
      state.notes.unshift({ t, d: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) });
      store.set('notes', state.notes);
      $('#n-txt').value = '';
      draw();
    });
  }

  /* ----- Bernard : tactiques ----- */
  function chips(name, list, val) {
    return `<div class="chips" role="group" aria-label="${esc(name)}">${list.map((o) => `<button type="button" class="chip" data-chip="${name}" data-v="${o.id}" aria-pressed="${o.id === val}">${esc(o.label)}</button>`).join('')}</div>`;
  }
  function bindChips(el, name, cb) {
    $$(`[data-chip="${name}"]`, el).forEach((b) => b.addEventListener('click', () => {
      $$(`[data-chip="${name}"]`, el).forEach((x) => x.setAttribute('aria-pressed', x === b));
      cb(b.dataset.v);
    }));
  }

  function scoreSystems(st, sy, fo) {
    return SYSTEMES.map((s, i) => {
      const why = [];
      let sc = 0;
      if (s.statuts.includes(st)) { sc += 3; why.push('adapté au statut de ton club'); }
      if (s.styles.includes(sy)) { sc += 3; why.push('colle au style que tu aimes'); }
      if (s.forces.includes(fo)) { sc += 2; why.push('met en valeur la force de ton effectif'); }
      return { s, sc: sc - i * 0.01, why };
    }).sort((a, b) => b.sc - a.sc);
  }

  function systemCard(sys) {
    const mode = state.tactic.mode;
    return `
      <div class="textbox" id="sysCard">
        <h2>${esc(sys.nom)}</h2>
        <div class="stat" style="margin-bottom:10px">
          <span class="badge red">Avec ballon : ${esc(sys.ip)}</span>
          <span class="badge blue">Sans ballon : ${esc(sys.oop)}</span>
          <span class="badge gold">Mentalité : ${esc(sys.mentalite)}</span>
        </div>
        <p>${esc(sys.resume)}</p>
        <div class="pitch-wrap" style="margin-top:12px">
          <div>
            <div class="chips" style="margin-bottom:8px" role="group" aria-label="Phase de jeu">
              <button type="button" class="chip" data-mode="ip" aria-pressed="${mode === 'ip'}">En possession</button>
              <button type="button" class="chip" data-mode="oop" aria-pressed="${mode === 'oop'}">Hors possession</button>
            </div>
            <div class="pitch" aria-label="Disposition des joueurs">
              <div class="l half"></div><div class="l circ"></div><div class="l box1"></div><div class="l box2"></div>
              <span class="pitch-legend">${mode === 'ip' ? 'AVEC BALLON ▲' : 'SANS BALLON'}</span>
              ${sys.postes.map((p, i) => {
                const [x, y] = p[mode];
                return `<span class="dot ${p.p === 'GB' ? 'gk' : ''} ${state.tactic.sel === i ? 'sel' : ''}" data-i="${i}" style="left:${x}%;top:${y}%">${esc(p.p)}</span>`;
              }).join('')}
            </div>
          </div>
          <div class="scroll-x">
            <table class="roles">
              <thead><tr><th>Poste</th><th>Rôle avec ballon</th><th>Rôle sans ballon</th></tr></thead>
              <tbody>${sys.postes.map((p, i) => `<tr data-i="${i}" class="${state.tactic.sel === i ? 'sel' : ''}"><td>${esc(p.p)}</td><td>${esc(p.rip)}</td><td>${esc(p.roop)}</td></tr>`).join('')}</tbody>
            </table>
            <p class="muted" style="margin-top:8px">Les noms des rôles changent selon la langue du jeu. Si tu ne trouves pas le nom exact, prends le rôle le plus proche (le nom anglais est entre parenthèses).</p>
          </div>
        </div>
        <h3>Consignes d'équipe</h3>
        <div class="grid3">
          <div class="panel"><h3>En possession</h3><ul class="dots">${sys.consignes.ip.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
          <div class="panel"><h3>Transitions</h3><ul class="dots">${sys.consignes.transition.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
          <div class="panel"><h3>Hors possession</h3><ul class="dots">${sys.consignes.oop.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
        </div>
        <div class="grid2" style="margin-top:12px">
          <div class="panel good"><h3>Points forts</h3><ul class="dots">${sys.forcesTxt.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
          <div class="panel bad"><h3>Points faibles</h3><ul class="dots">${sys.faiblessesTxt.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
        </div>
        <h3>Les profils qu'il te faut</h3>
        <p>${esc(sys.profils)}</p>
      </div>`;
  }

  function bindSystemCard(el, sys, rerender) {
    $$('[data-mode]', el).forEach((b) => b.addEventListener('click', () => {
      state.tactic.mode = b.dataset.mode;
      $$('[data-mode]', el).forEach((x) => x.setAttribute('aria-pressed', x === b));
      $$('.pitch .dot', el).forEach((d) => {
        const [x, y] = sys.postes[+d.dataset.i][state.tactic.mode];
        d.style.left = x + '%'; d.style.top = y + '%';
      });
      $('.pitch-legend', el).textContent = state.tactic.mode === 'ip' ? 'AVEC BALLON ▲' : 'SANS BALLON';
    }));
    const select = (i) => {
      state.tactic.sel = state.tactic.sel === i ? -1 : i;
      $$('.pitch .dot', el).forEach((d) => d.classList.toggle('sel', +d.dataset.i === state.tactic.sel));
      $$('.roles tbody tr', el).forEach((r) => r.classList.toggle('sel', +r.dataset.i === state.tactic.sel));
    };
    $$('.pitch .dot', el).forEach((d) => d.addEventListener('click', () => select(+d.dataset.i)));
    $$('.roles tbody tr', el).forEach((r) => r.addEventListener('click', () => select(+r.dataset.i)));
  }

  function renderTactique(el, tab) {
    const t = state.tactic;
    const p = state.profile || {};
    t.statut = t.statut || p.statut || 'milieu';
    t.style = t.style || p.style || 'equilibre';
    t.force = t.force || 'milieu';

    if (tab === 'assistant') {
      el.innerHTML = `
        <div class="textbox">
          <h2>Trois questions de Bernard</h2>
          <p class="lbl">1. Ton club est...</p>${chips('statut', STATUTS, t.statut)}
          <p class="lbl" style="margin-top:12px">2. Tu veux jouer en...</p>${chips('style', STYLES, t.style)}
          <p class="lbl" style="margin-top:12px">3. La force de ton effectif</p>${chips('force', FORCES, t.force)}
        </div>
        <div id="reco"></div>`;
      const draw = () => {
        const ranked = scoreSystems(t.statut, t.style, t.force);
        const best = ranked[0], second = ranked[1];
        $('#reco').innerHTML = `
          <div class="textbox" style="margin-bottom:14px">
            <h2>Ma recommandation</h2>
            <p>Tactique principale : <b>${esc(best.s.nom)}</b> (${esc(best.s.ip)})${best.why.length ? ', ' + esc(best.why.join(', ')) : ''}.</p>
            <p>Plan B : <b>${esc(second.s.nom)}</b> (${esc(second.s.ip)}). Prépare-la dans le deuxième emplacement de tactique, pour les matchs où la première ne marche pas.</p>
            <p class="muted">Dans FM27, regarde la jauge d'Efficacité tactique après avoir créé ta tactique : si elle est très basse, tes joueurs ne sont pas faits pour ce système.</p>
          </div>
          ${systemCard(best.s)}`;
        bindSystemCard($('#reco'), best.s);
      };
      ['statut', 'style', 'force'].forEach((k) => bindChips(el, k, (v) => { t[k] = v; t.sel = -1; draw(); }));
      draw();
    } else if (tab === 'systemes') {
      el.innerHTML = `<div class="textbox"><h2>Les systèmes de Bernard</h2>${chips('sys', SYSTEMES.map((s) => ({ id: s.id, label: `${s.nom} · ${s.ip}` })), t.systeme)}</div><div id="sysWrap"></div>`;
      const draw = () => {
        const sys = SYSTEMES.find((s) => s.id === t.systeme);
        $('#sysWrap').innerHTML = systemCard(sys);
        bindSystemCard($('#sysWrap'), sys);
      };
      bindChips(el, 'sys', (v) => { t.systeme = v; t.sel = -1; draw(); });
      draw();
    } else if (tab === 'diagnostic') {
      el.innerHTML = `<div class="textbox"><h2>Qu'est-ce qui ne va pas ?</h2><p class="muted">Choisis le problème que tu vois en match. Change une seule chose à la fois.</p>
        ${DIAGNOSTICS.map((d, i) => `<details class="acc" ${i === 0 ? 'open' : ''}><summary>${esc(d.q)}</summary><div class="body"><ul class="dots">${d.a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></details>`).join('')}</div>`;
    } else {
      el.innerHTML = `<div class="textbox"><h2>Les règles d'or</h2><ol class="steps">${REGLES_TACTIQUES.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
        <h3>Où régler tout ça dans le jeu</h3>
        <p>Ouvre l'écran Tactique (tape « Tactique » dans la recherche si besoin). Tu y trouveras deux onglets : en possession et hors possession. Choisis la formation de chaque phase, puis clique sur chaque joueur pour lui donner son rôle.</p></div>`;
    }
  }

  /* ----- Sami : transferts ----- */
  const SEUILS = { favori: 15, haut: 14, milieu: 13, maintien: 12, promu: 11 };

  function renderTransferts(el, tab) {
    const p = state.profile || {};
    if (tab === 'fiche') {
      const r = state.recrut;
      const poste = POSTES_RECRUT.find((x) => x.id === r.poste);
      const styleIds = Object.keys(poste.styles);
      if (!poste.styles[r.style]) r.style = styleIds[0];
      const st = poste.styles[r.style];
      const seuil = SEUILS[p.statut || 'milieu'];
      el.innerHTML = `
        <div class="textbox">
          <h2>Quel poste renforcer ?</h2>
          ${chips('poste', POSTES_RECRUT.map((x) => ({ id: x.id, label: x.label })), r.poste)}
          <p class="lbl" style="margin-top:12px">Type de joueur</p>
          ${chips('pstyle', styleIds.map((k) => ({ id: k, label: poste.styles[k].label })), r.style)}
        </div>
        <div class="textbox">
          <h2>Fiche de poste : ${esc(st.label)}</h2>
          <p class="lbl">Attributs indispensables</p>
          <div class="stat" style="margin:6px 0 12px">${st.cles.map((a) => `<span class="badge red">${esc(a)}</span>`).join('')}</div>
          <p class="lbl">Le petit plus</p>
          <div class="stat" style="margin:6px 0 12px">${st.bonus.map((a) => `<span class="badge blue">${esc(a)}</span>`).join('')}</div>
          <h3>Ma recherche conseillée</h3>
          <ul class="dots">
            <li>Attributs indispensables à <b>${seuil}+</b> sur 20${p.statut ? '' : ' (ajuste ce seuil en remplissant la fiche du club)'}.</li>
            <li>Âge : 18-23 ans si tu veux revendre, 24-29 ans pour un impact immédiat.</li>
            <li>Personnalité : évite « Peu professionnel » et « Tempérament ».</li>
            <li>Demande un rapport complet à tes recruteurs et regarde l'adéquation à ta tactique (FM27).</li>
          </ul>
          <p class="muted" style="margin-top:10px">Dans le jeu : ouvre la recherche de joueurs (le centre de recrutement), ajoute un filtre par attribut et entre ces valeurs minimales.</p>
        </div>`;
      bindChips(el, 'poste', (v) => { r.poste = v; r.style = null; renderTransferts(el, tab); });
      bindChips(el, 'pstyle', (v) => { r.style = v; renderTransferts(el, tab); });
    } else if (tab === 'calcul') {
      const c = state.calc;
      el.innerHTML = `
        <form class="textbox" id="calcForm">
          <h2>Combien coûte vraiment ce joueur ?</h2>
          <p class="muted">Valeurs d'exemple : remplace-les par celles de ton joueur.</p>
          <div class="form">
            <div class="field"><label for="c-fee">Indemnité de transfert (€)</label><input id="c-fee" name="fee" inputmode="numeric" value="${esc(c.fee)}"></div>
            <div class="field"><label for="c-wage">Salaire (€/semaine)</label><input id="c-wage" name="wage" inputmode="numeric" value="${esc(c.wage)}"></div>
            <div class="field"><label for="c-years">Durée du contrat (ans)</label><input id="c-years" name="years" inputmode="numeric" value="${esc(c.years)}"></div>
            <div class="field"><label for="c-bonus">Prime à la signature (€)</label><input id="c-bonus" name="bonus" inputmode="numeric" value="${esc(c.bonus)}"></div>
            <div class="field"><label for="c-age">Âge du joueur</label><input id="c-age" name="age" inputmode="numeric" value="${esc(c.age)}"></div>
          </div>
        </form>
        <div class="textbox" id="calcOut"></div>`;
      const draw = () => {
        const fee = num(c.fee), wage = num(c.wage), years = Math.max(1, num(c.years)), bonus = num(c.bonus), age = num(c.age);
        const wages = wage * 52 * years;
        const total = fee + wages + bonus;
        const perSeason = total / years;
        const bT = num(p.budget), bS = num(p.salaire);
        const shareFee = bT ? fee / bT : null;
        const shareWage = bS ? wage / bS : null;
        const meter = (share) => {
          if (share == null) return '<p class="muted">Renseigne ce budget dans la fiche du club (Margaux).</p>';
          const pct = Math.min(100, Math.round(share * 100));
          return `<div class="meter"><i class="${share > 1 ? 'over' : share > 0.6 ? 'warn' : ''}" style="width:${pct}%"></i></div><p class="muted" style="margin-top:4px">${Math.round(share * 100)} % du budget</p>`;
        };
        let verdict, cls;
        const worst = Math.max(shareFee || 0, shareWage || 0);
        if (shareFee == null && shareWage == null) { verdict = 'Remplis ton budget dans la fiche du club pour avoir mon avis.'; cls = 'blue'; }
        else if (worst > 1) { verdict = "Hors budget. Propose des paiements échelonnés, un prêt avec option d'achat, ou cherche une alternative moins chère."; cls = 'red'; }
        else if (worst > 0.6) { verdict = 'Gros investissement. Il doit devenir un titulaire indiscutable, sinon passe ton tour.'; cls = 'gold'; }
        else { verdict = 'Raisonnable pour ton budget. Négocie quand même : première offre à 60-70 % du prix demandé.'; cls = 'green'; }
        let ageTxt;
        if (age <= 21) ageTxt = 'Jeune : sa valeur peut grimper. Contrat long (4-5 ans) conseillé.';
        else if (age <= 26) ageTxt = 'Âge idéal : il va progresser ou rester à son meilleur niveau plusieurs saisons.';
        else if (age <= 29) ageTxt = 'À son pic : bon pour gagner tout de suite, mais la revente sera plus faible.';
        else ageTxt = 'Valeur de revente quasi nulle : contrat de 1 ou 2 ans maximum.';
        if (age >= 30 && years > 2) ageTxt += ' Attention : ton contrat est trop long pour son âge.';
        $('#calcOut').innerHTML = `
          <h2>Le verdict de Sami</h2>
          <div class="verdict">
            <div class="k"><span>COÛT TOTAL</span><b>${money(total)}</b></div>
            <div class="k"><span>PAR SAISON</span><b>${money(perSeason)}</b></div>
            <div class="k"><span>SALAIRES CUMULÉS</span><b>${money(wages)}</b></div>
          </div>
          <div class="grid2" style="margin-top:12px">
            <div><p class="lbl">Part du budget transferts</p>${meter(shareFee)}</div>
            <div><p class="lbl">Part de la marge salariale</p>${meter(shareWage)}</div>
          </div>
          <p style="margin-top:12px"><span class="badge ${cls}">Avis</span> ${esc(verdict)}</p>
          <p><span class="badge">Âge</span> ${esc(ageTxt)}</p>`;
      };
      $('#calcForm').addEventListener('input', (e) => { if (e.target.name) { c[e.target.name] = e.target.value; draw(); } });
      $('#calcForm').addEventListener('submit', (e) => e.preventDefault());
      draw();
    } else if (tab === 'liste') {
      renderShortlist(el);
    } else {
      el.innerHTML = `<div class="textbox"><h2>Les conseils de Sami</h2>
        ${CONSEILS_MERCATO.map((c, i) => `<details class="acc" ${i < 2 ? 'open' : ''}><summary>${esc(c.t)}</summary><div class="body"><p>${esc(c.d)}</p></div></details>`).join('')}</div>`;
    }
  }

  const STATUTS_SL = ['À superviser', 'Rapport demandé', 'Offre faite', 'Signé', 'Abandonné'];
  function renderShortlist(el) {
    const list = state.shortlist || EXEMPLES_SHORTLIST;
    const hasEx = !state.shortlist;
    el.innerHTML = `
      <form class="textbox" id="slForm">
        <h2>Ma liste de cibles</h2>
        <div class="form">
          <div class="field"><label for="s-nom">Nom</label><input id="s-nom" name="nom" required placeholder="Nom du joueur"></div>
          <div class="field"><label for="s-poste">Poste</label><input id="s-poste" name="poste" placeholder="ex. Latéral gauche"></div>
          <div class="field"><label for="s-age">Âge</label><input id="s-age" name="age" inputmode="numeric"></div>
          <div class="field"><label for="s-valeur">Prix estimé (€)</label><input id="s-valeur" name="valeur" inputmode="numeric" placeholder="0 si libre"></div>
          <div class="field full"><label for="s-note">Note</label><input id="s-note" name="note" placeholder="ex. Fin de contrat en juin, pied gauche"></div>
        </div>
        <div class="row" style="margin-top:12px"><button class="btn" type="submit">Ajouter à la liste</button>${hasEx ? '<button type="button" class="btn alt small" id="clearEx">Retirer les exemples</button>' : ''}</div>
      </form>
      <div class="textbox">
        ${list.length ? `<div class="scroll-x"><table class="sl">
          <thead><tr><th>Joueur</th><th>Poste</th><th>Âge</th><th>Prix</th><th>Statut</th><th></th></tr></thead>
          <tbody>${list.map((j, i) => `<tr>
            <td><b>${esc(j.nom)}</b>${j.ex ? '<span class="ex-tag">exemple</span>' : ''}${j.note ? `<br><span class="muted">${esc(j.note)}</span>` : ''}</td>
            <td>${esc(j.poste)}</td><td class="num">${esc(j.age || '')}</td>
            <td class="num">${num(j.valeur) ? money(num(j.valeur)) : 'Libre'}</td>
            <td><button type="button" class="status s${j.status}" data-st="${i}" title="Changer le statut">${STATUTS_SL[j.status]}</button></td>
            <td><button type="button" class="x" data-rm="${i}" aria-label="Retirer ${esc(j.nom)}">✕</button></td></tr>`).join('')}</tbody></table></div>
          <p class="muted" style="margin-top:8px">Touche un statut pour le faire avancer. Ta liste reste dans ce navigateur.</p>`
          : '<p class="muted">Ta liste est vide. Ajoute ta première cible avec le formulaire ci-dessus.</p>'}
      </div>`;
    const save = (l) => { state.shortlist = l; store.set('shortlist', l); renderShortlist(el); };
    const own = () => (state.shortlist ? state.shortlist.slice() : []);
    $('#slForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target).entries());
      const l = own();
      l.push({ id: Date.now().toString(36), nom: fd.nom.trim(), poste: fd.poste.trim(), age: fd.age.trim(), valeur: fd.valeur.trim(), note: fd.note.trim(), status: 0 });
      save(l);
    });
    const clr = $('#clearEx');
    if (clr) clr.addEventListener('click', () => save([]));
    $$('[data-st]', el).forEach((b) => b.addEventListener('click', () => {
      const l = state.shortlist ? state.shortlist : list.map((x) => ({ ...x }));
      const j = l[+b.dataset.st];
      j.status = (j.status + 1) % STATUTS_SL.length;
      if (!state.shortlist) { state.shortlist = null; EXEMPLES_SHORTLIST[+b.dataset.st].status = j.status; renderShortlist(el); return; }
      save(l);
    }));
    $$('[data-rm]', el).forEach((b) => b.addEventListener('click', () => {
      if (!state.shortlist) { save(EXEMPLES_SHORTLIST.filter((_, i) => i !== +b.dataset.rm).map((x) => ({ ...x }))); return; }
      const l = own(); l.splice(+b.dataset.rm, 1); save(l);
    }));
  }

  /* ----- Inès : entraînement ----- */
  function renderEntrainement(el, tab) {
    if (tab === 'planning') {
      const pl = PLANNINGS[state.plan];
      el.innerHTML = `
        <div class="textbox">
          <h2>Quelle période ?</h2>
          ${chips('plan', Object.entries(PLANNINGS).map(([id, v]) => ({ id, label: v.label })), state.plan)}
          <p style="margin-top:12px">${esc(pl.intro)}</p>
        </div>
        <div class="textbox">
          <h2>Ta semaine type</h2>
          <div class="scroll-x"><div class="week">
            ${JOURS.map((j) => `<div class="day">${j}</div>`).join('')}
            ${[0, 1, 2].map((slot) => pl.jours.map((d) => `<div class="sess ${SEANCE_COULEUR(d[slot])}">${esc(d[slot] === 'MATCH' ? 'MATCH' : d[slot] || '')}</div>`).join('')).join('')}
          </div></div>
          <p class="muted" style="margin-top:6px">Ligne 1 : matin · ligne 2 : après-midi · ligne 3 : soir.</p>
          <div class="legend" style="margin-top:8px">
            <span><i style="background:#ffe0c2"></i>Physique</span><span><i style="background:#dde8ff"></i>Tactique</span>
            <span><i style="background:#fff1b8"></i>Préparation / CPA</span><span><i style="background:#d9f0dd"></i>Repos</span><span><i style="background:var(--red)"></i>Match</span>
          </div>
          <h3>Les conseils d'Inès</h3>
          <ul class="dots">${pl.conseils.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        </div>
        <div class="textbox">
          <h2>Entraînement et Efficacité tactique</h2>
          <p>Dans FM27, la compréhension tactique se travaille : les séances tactiques et la préparation de match font monter l'Efficacité tactique de ton équipe. Garde la même tactique et les mêmes titulaires assez longtemps pour qu'elle progresse.</p>
          <p class="muted">Pas envie de gérer ? Tu peux confier l'entraînement à ton staff dans les responsabilités. Tu pourras le reprendre plus tard.</p>
        </div>`;
      bindChips(el, 'plan', (v) => { state.plan = v; renderEntrainement(el, tab); });
    } else if (tab === 'individuel') {
      el.innerHTML = `<div class="textbox"><h2>Entraînement individuel</h2>
        <p>Pour chaque joueur, choisis le rôle qu'il tient dans ta tactique, puis un focus supplémentaire sur un point faible important pour ce rôle.</p>
        <div class="grid2">${INDIVIDUEL.map((x) => `<div class="panel"><h3>${esc(x.p)}</h3><p style="margin:0">${esc(x.d)}</p></div>`).join('')}</div></div>`;
    } else if (tab === 'jeunes') {
      el.innerHTML = `<div class="textbox"><h2>Faire grandir les jeunes</h2><ul class="dots">${JEUNES.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <h3>Le bon parcours d'un espoir</h3>
        <ol class="steps"><li>16-18 ans : équipe de jeunes, tutorat avec un pro exemplaire.</li><li>18-20 ans : prêt dans un club où il sera titulaire, ou rotation chez toi.</li><li>20-22 ans : il revient et gagne sa place, ou tu le vends au bon prix.</li></ol></div>`;
    } else {
      el.innerHTML = `<div class="textbox"><h2>Fatigue et blessures</h2><ul class="dots">
        <li>Avant chaque match, regarde la condition physique de ton onze : un joueur fatigué joue moins bien et se blesse plus.</li>
        <li>Le jeu signale les joueurs à risque de blessure : mets-les au repos un ou deux jours.</li>
        <li>Fais jouer tes remplaçants en coupe et contre les petites équipes.</li>
        <li>Le pressing haut fatigue beaucoup plus : adapte la charge d'entraînement en conséquence.</li>
        <li>Après une blessure longue, un joueur manque de rythme : fais-le rejouer petit à petit (réserve, fins de match).</li>
        <li>Un bon kiné et un bon préparateur physique réduisent les blessures : recrute-les en priorité.</li></ul></div>`;
    }
  }

  /* ----- Théo : matchs ----- */
  function renderMatch(el, tab) {
    if (tab === 'avant') {
      el.innerHTML = `<div class="textbox"><h2>Avant le coup d'envoi</h2><ol class="steps">${AVANT_MATCH.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
        <h3>Consignes adverses : qui cibler ?</h3>
        <ul class="dots"><li>Leur meneur de jeu : presse-le toujours.</li><li>Leur ailier star : ferme-lui son pied fort pour l'envoyer sur son mauvais pied.</li><li>Leur attaquant grand : marquage serré par ton meilleur défenseur de la tête.</li><li>Leur défenseur le plus lent : demande à ton attaquant le plus rapide de jouer sur lui.</li></ul></div>`;
    } else if (tab === 'pendant') {
      el.innerHTML = `<div class="textbox"><h2>Pendant le match</h2><p class="muted">Avec FM27, tu peux faire des ajustements tactiques rapides sans ouvrir l'écran Tactique.</p>
        ${SITUATIONS_MATCH.map((x, i) => `<details class="acc" ${i === 0 ? 'open' : ''}><summary>${esc(x.s)}</summary><div class="body"><p>${esc(x.a)}</p></div></details>`).join('')}</div>
        <div class="textbox"><h2>Quand faire les changements ?</h2><ul class="dots">
        <li>Un joueur averti qui fait beaucoup de fautes : change-le avant de prendre un rouge.</li>
        <li>Vers 60-65 minutes : remplace les joueurs les plus fatigués (ailiers, latéraux, pressing).</li>
        <li>Vers 75 minutes : change le plan si le score ne te convient pas.</li>
        <li>Garde un changement pour une blessure en fin de match.</li></ul></div>`;
    } else {
      const ctx = CAUSERIES[state.talk.ctx];
      if (!ctx.situations[state.talk.sit]) state.talk.sit = Object.keys(ctx.situations)[0];
      const s = ctx.situations[state.talk.sit];
      el.innerHTML = `
        <div class="textbox"><h2>Causeries</h2>
          <p class="lbl">Moment</p>${chips('ctx', Object.entries(CAUSERIES).map(([id, v]) => ({ id, label: v.label })), state.talk.ctx)}
          <p class="lbl" style="margin-top:12px">Situation</p>${chips('sit', Object.entries(ctx.situations).map(([id, v]) => ({ id, label: v.label })), state.talk.sit)}
        </div>
        <div class="textbox">
          <h2>Ce que je dirais</h2>
          <div class="stat" style="margin-bottom:10px"><span class="badge gold">Ton : ${esc(s.ton)}</span></div>
          <p style="font-size:20px">${esc(s.phrase)}</p>
          <p class="muted">${esc(s.pourquoi)}</p>
          <h3>Règles de base</h3>
          <ul class="dots"><li>Regarde la réaction des joueurs après ta causerie : si plusieurs sont nerveux, sois plus calme la prochaine fois.</li><li>Tu peux parler à un joueur en particulier : félicite le meilleur, rassure le plus nerveux.</li><li>Si tu ne sais pas quoi dire, le ton calme ne fait presque jamais de dégâts.</li></ul>
        </div>`;
      bindChips(el, 'ctx', (v) => { state.talk.ctx = v; state.talk.sit = Object.keys(CAUSERIES[v].situations)[0]; renderMatch(el, tab); });
      bindChips(el, 'sit', (v) => { state.talk.sit = v; renderMatch(el, tab); });
    }
  }

  /* ----- Jacques : guide FM27 ----- */
  function renderGuide(el, tab) {
    if (tab === 'depart') {
      const done = Object.values(state.checklist).filter(Boolean).length;
      const pct = Math.round((done / CHECKLIST.length) * 100);
      el.innerHTML = `<div class="textbox"><h2>Tes premiers pas</h2>
        <div class="xp" style="margin-bottom:12px"><span class="lbl">${done}/${CHECKLIST.length}</span><div class="meter"><i style="width:${pct}%"></i></div></div>
        ${CHECKLIST.map((c, i) => `<label class="check ${state.checklist[i] ? 'done' : ''}" for="ck-${i}"><input type="checkbox" id="ck-${i}" data-ck="${i}" ${state.checklist[i] ? 'checked' : ''}><span><b>${i + 1}. ${esc(c.t)}</b><span>${esc(c.d)}</span></span></label>`).join('')}</div>`;
      $$('[data-ck]', el).forEach((b) => b.addEventListener('change', () => {
        state.checklist[b.dataset.ck] = b.checked;
        store.set('checklist', state.checklist);
        if (b.checked) speak([pick(['Bien joué, petit ! Une étape de plus.', 'Tu apprends vite. Continue comme ça.', 'Parfait. Passe à la suivante quand tu es prêt.'])]);
        renderGuide(el, tab);
        updateHud();
      }));
    } else if (tab === 'interface') {
      el.innerHTML = `<div class="textbox"><h2>Se repérer dans FM27</h2><p class="muted">FM27 garde l'interface lancée avec FM26 : plus de menu sur le côté, tout passe par le haut de l'écran.</p>
        <div class="grid2">${NAVIGATION.map((n) => `<div class="panel"><h3>${esc(n.t)}</h3><p style="margin:0">${esc(n.d)}</p></div>`).join('')}</div>
        <h3>Mon conseil</h3><p>Perdu ? Retourne au Portail, ou tape le nom de l'écran dans la recherche. Et active l'aide du jeu en choisissant « Aucune expérience » au début de ta carrière.</p></div>`;
    } else if (tab === 'nouveautes') {
      el.innerHTML = `<div class="textbox"><h2>Ce qui est nouveau</h2>
        ${NOUVEAUTES_FM27.map((n, i) => `<details class="acc" ${i === 0 ? 'open' : ''}><summary>${esc(n.t)}</summary><div class="body"><p>${esc(n.d)}</p></div></details>`).join('')}</div>`;
    } else if (tab === 'glossaire') {
      el.innerHTML = `<div class="textbox"><h2>Le glossaire de Jacques</h2>
        <div class="field" style="margin-bottom:12px"><label for="g-q">Chercher un mot</label><input id="g-q" type="search" value="${esc(state.gloss)}" placeholder="ex. moral, CA, prêt..."></div>
        <div id="gl"></div></div>`;
      const draw = () => {
        const q = state.gloss.trim().toLowerCase();
        const items = GLOSSAIRE.filter((g) => !q || (g.t + ' ' + g.d).toLowerCase().includes(q));
        $('#gl').innerHTML = items.length
          ? items.map((g) => `<details class="acc" ${q ? 'open' : ''}><summary>${esc(g.t)}</summary><div class="body"><p>${esc(g.d)}</p></div></details>`).join('')
          : `<p class="muted">Pas de mot pour « ${esc(state.gloss)} ». Dans le jeu, cherche-le dans FMPedia, le glossaire intégré.</p>`;
      };
      $('#g-q').addEventListener('input', (e) => { state.gloss = e.target.value; draw(); });
      draw();
    } else {
      el.innerHTML = `<div class="textbox"><h2>Les pièges du débutant</h2><ul class="dots">${PIEGES.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    }
  }


  /* ---------------- Démarrage ---------------- */
  window.WORLD.init({
    canvas: $('#world'),
    staff: STAFF.map((s) => ({ id: s.id, x: s.x, y: s.y, dir: s.dir, sprite: s.sprite, fixed: s.id === 'club' || s.id === 'transferts' })),
    player: PLAYER,
    onTalk: (id) => openConvo(id),
    onMessage: (text) => say(text),
    onActivity: () => $('#hint').classList.add('fade'),
  });

  $('#sheetList').innerHTML = staffCards();
  $('#dock').innerHTML = `<h2>Ton staff</h2><div class="staff-grid">${staffCards()}</div>`;
  $$('[data-open]').forEach((b) => b.addEventListener('click', () => openConvo(b.dataset.open)));
  $('#hudStaff').addEventListener('click', () => { $('#sheet').hidden = false; window.WORLD.pause(true); $('#sheetClose').focus(); });
  const closeSheet = () => { $('#sheet').hidden = true; window.WORLD.pause(false); };
  $('#sheetClose').addEventListener('click', closeSheet);
  $('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') closeSheet(); });
  $('#hudClub').addEventListener('click', () => openConvo('club', 'fiche'));
  $('#hudProgress').addEventListener('click', () => openConvo('guide', 'depart'));
  $('#hudHelp').addEventListener('click', () => say([
    'Clique sur le sol pour te déplacer. Tu peux aussi utiliser les flèches du clavier (ou Z Q S D).',
    "Clique sur un membre du staff pour aller lui parler. Au clavier : place-toi face à lui et appuie sur Entrée.",
    'Le bouton « Mon staff » ouvre directement une conversation. Échap te ramène au centre.',
  ], 'guide'));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!convoEl.hidden) closeConvo();
    else if (!$('#sheet').hidden) closeSheet();
    else if (!$('#msgbox').hidden) { $('#msgbox').hidden = true; window.WORLD.pause(false); }
  });
  document.addEventListener('keydown', (e) => {
    if ($('#msgbox').hidden || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault(); e.stopPropagation(); msgNext();
  }, true);

  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (staffById[id] && convo.id !== id) openConvo(id);
  });

  updateHud();
  refreshWorld();
  setTimeout(() => $('#hint').classList.add('fade'), 9000);
  const start = location.hash.slice(1);
  if (staffById[start]) openConvo(start);
  else if (!state.profileSaved) {
    setTimeout(() => say([
      `Bienvenue au centre d'entraînement de l'${state.profile.club}, coach ! Je suis Margaux, à l'accueil.`,
      "Tout le staff est là pour t'aider. Clique sur quelqu'un pour lui parler : Bernard pour la tactique, Sami pour le mercato, Inès pour l'entraînement, Théo pour les matchs.",
      "Commence par venir me voir au comptoir pour compléter la fiche du club. Et si tu débutes, Jacques, près de l'entrée, a une liste des premiers pas.",
    ], 'club'), 500);
  }
})();

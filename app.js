// ============================================================
// === STATE ===
// ============================================================
const state = {
  mood: null,
  tasks: JSON.parse(localStorage.getItem('rg_tasks') || '[]'),
  xp: parseInt(localStorage.getItem('rg_xp') || '0'),
  level: parseInt(localStorage.getItem('rg_level') || '1'),
  streak: parseInt(localStorage.getItem('rg_streak') || '0'),
  lastActiveDate: localStorage.getItem('rg_lastDate') || '',
  lang: localStorage.getItem('rg_lang') || 'en',
  sessionStart: Date.now(),
  scrollLogCount: 0,
  lastNudgeTime: 0,
  breathingInterval: null,
  nudgeDismissed: false,
};

function save() {
  localStorage.setItem('rg_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('rg_xp', state.xp);
  localStorage.setItem('rg_level', state.level);
  localStorage.setItem('rg_streak', state.streak);
  localStorage.setItem('rg_lastDate', state.lastActiveDate);
  localStorage.setItem('rg_lang', state.lang);
}

// ============================================================
// === DOM HELPERS ===
// ============================================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ============================================================
// === i18n ===
// ============================================================
function t(key) {
  return LANG[state.lang][key] || LANG.en[key] || key;
}

function setLang(lang) {
  state.lang = lang;
  save();
  applyLang();
}

function applyLang() {
  const L = LANG[state.lang];

  // Lang toggle button text
  $('#btn-lang').textContent = t('lang_label');

  // Mood screen
  $('#screen-mood .subtitle').textContent = t('mood_subtitle');
  $('[data-mood="calm"] .mood-label').textContent = t('mood_calm');
  $('[data-mood="anxious"] .mood-label').textContent = t('mood_anxious');
  $('[data-mood="nervous"] .mood-label').textContent = t('mood_nervous');
  $('[data-mood="bored"] .mood-label').textContent = t('mood_bored');
  $('[data-mood="overwhelmed"] .mood-label').textContent = t('mood_overwhelmed');
  $('[data-mood="restless"] .mood-label').textContent = t('mood_restless');

  // Dashboard
  $('#btn-change-mood').textContent = t('switch_mood');
  $('#screen-time-card .card-header h3').textContent = t('screen_sesh');
  $('#btn-reset-timer').textContent = t('reset');
  $('#btn-log-scroll').innerHTML = t('caught_scrolling');

  // Suggestion
  $('#suggestion-card .card-header h3').textContent = t('suggestion_title');
  $('#btn-accept-suggestion').textContent = t('lets_go');
  $('#btn-skip-suggestion').textContent = t('nah');

  // Power-ups
  $('.power-ups-label').textContent = t('powerups_label');
  $('#btn-breath-game .pu-label').textContent = t('pu_breath_game');
  $('#btn-move .pu-label').textContent = t('pu_body_quest');
  $('#btn-breathe .pu-label').textContent = t('pu_breathe');
  $('#btn-ground .pu-label').textContent = t('pu_ground');
  $('#btn-get-task .pu-label').textContent = t('pu_random_quest');
  $('#btn-spin-wheel .pu-label').textContent = t('pu_surprise');

  // Physical
  $('#physical-card .card-header h3').textContent = t('physical_title');
  $('#btn-complete-exercise').textContent = t('done_claim_xp');
  $('#btn-next-exercise').textContent = t('nah_next');

  // Guided breath
  $('#breath-guided-card .card-header h3').textContent = t('guided_title');
  $('#btn-recalibrate').textContent = t('redo');
  $('#btn-extend-breath').textContent = t('slower');

  // Tasks
  $('.tasks-section .section-header h3').textContent = t('quests_title');
  $('#btn-add-task').textContent = t('new_quest');

  // Add task screen
  $('#screen-add-task .screen-header h2').textContent = t('add_quest_title');
  $('label[for="task-name"]').textContent = t('whats_mission');
  $('#task-name').placeholder = t('task_placeholder');
  $$('.form-group label').forEach((l) => {
    if (l.textContent.match(/energy|custo/i)) l.textContent = t('energy_cost');
    if (l.textContent.match(/category|categoria/i)) l.textContent = t('category_label');
  });
  $$('.energy-btn').forEach((b) => {
    const e = b.dataset.energy;
    if (e === 'low') b.textContent = t('energy_low');
    if (e === 'medium') b.textContent = t('energy_medium');
    if (e === 'high') b.textContent = t('energy_high');
  });
  $$('.category-btn').forEach((b) => {
    const c = b.dataset.category;
    b.textContent = t('cat_' + c);
  });
  $('#task-form button[type="submit"]').textContent = t('add_quest_btn');

  // Re-apply mood if set
  if (state.mood) {
    const key = 'sug_' + state.mood;
    $('#current-mood-text').textContent = t('mood_' + state.mood);
    $('#mood-suggestion-text').textContent = t(key);
  }

  // Refresh greeting
  setGreeting();
  updateXPDisplay();
  renderStreak();
  renderTasks();
}

$('#btn-lang').addEventListener('click', () => {
  setLang(state.lang === 'en' ? 'pt' : 'en');
});

// ============================================================
// === CONFIG ===
// ============================================================
const XP_PER_LEVEL = 100;
const NUDGE_THRESHOLDS = { warning: 15 * 60000, danger: 30 * 60000 };
const SCROLL_NUDGE_THRESHOLD = 2;

const MOOD_KEYS = {
  calm: { emoji: '\u{1F33F}', energyMatch: ['high', 'medium'], exercises: ['mindful-check'] },
  anxious: { emoji: '\u{1F4A8}', energyMatch: ['low'], exercises: ['breathing', '5-4-3-2-1'] },
  nervous: { emoji: '\u{26A1}', energyMatch: ['low', 'medium'], exercises: ['breathing', 'cold-water'] },
  bored: { emoji: '\u{1F611}', energyMatch: ['medium', 'high'], exercises: ['mindful-check'] },
  overwhelmed: { emoji: '\u{1F30A}', energyMatch: ['low'], exercises: ['breathing', '5-4-3-2-1'] },
  restless: { emoji: '\u{1F525}', energyMatch: ['medium', 'high'], exercises: ['cold-water', 'movement'] },
};

const EX_KEYS = {
  breathing: { titleKey: 'ex_breathing_title', instKey: 'ex_breathing_inst' },
  '5-4-3-2-1': { titleKey: 'ex_54321_title', instKey: 'ex_54321_inst' },
  'cold-water': { titleKey: 'ex_cold_title', instKey: 'ex_cold_inst' },
  'mindful-check': { titleKey: 'ex_mindful_title', instKey: 'ex_mindful_inst' },
  movement: { titleKey: 'ex_movement_title', instKey: 'ex_movement_inst' },
};

const screens = {
  mood: $('#screen-mood'),
  dashboard: $('#screen-dashboard'),
  addTask: $('#screen-add-task'),
};

function showScreen(name) {
  $$('.screen').forEach((s) => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ============================================================
// === PARTICLES ===
// ============================================================
(function initParticles() {
  const canvas = $('#bg-particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const count = 40;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      hue: Math.random() * 60 + 250,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, 0.3)`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ============================================================
// === XP / LEVELING ===
// ============================================================
function addXP(amount) {
  state.xp += amount;
  while (state.xp >= XP_PER_LEVEL) { state.xp -= XP_PER_LEVEL; state.level++; }
  save();
  updateXPDisplay();
  showXPToast(amount);
}

function showXPToast(amount) {
  const toast = $('#xp-toast');
  toast.textContent = `+${amount} XP`;
  toast.classList.remove('hidden');
  toast.style.animation = 'none'; void toast.offsetHeight; toast.style.animation = '';
  setTimeout(() => toast.classList.add('hidden'), 1200);
}

function getTitle() {
  const titles = t('titles');
  return titles[Math.min(state.level - 1, titles.length - 1)];
}

function updateXPDisplay() {
  const pct = (state.xp / XP_PER_LEVEL) * 100;
  $('#xp-fill').style.width = pct + '%';
  $('#xp-fill-mini').style.width = pct + '%';
  $('#level-num').textContent = state.level;
  $('#level-num-mini').textContent = state.level;
  $('#xp-text').textContent = `${state.xp} / ${XP_PER_LEVEL} XP`;
  $('#xp-text-mini').textContent = `${state.xp} xp`;
  $('#xp-title').textContent = getTitle();
  $('#level-badge').innerHTML = `${t('level')} <span id="level-num">${state.level}</span>`;
}

// === Streak ===
function updateStreak() {
  const today = new Date().toDateString();
  if (state.lastActiveDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastActiveDate === yesterday) state.streak++;
  else if (state.lastActiveDate !== today) state.streak = 1;
  state.lastActiveDate = today;
  save();
}

function renderStreak() {
  const s = state.streak;
  const word = s > 1 ? t('days') : t('day');
  const text = s > 0 ? `\u{1F525} ${s} ${word}` : '';
  $('#streak-badge').textContent = text;
  $('#streak-mini').textContent = text;
}

// ============================================================
// === MOOD ===
// ============================================================
$$('.mood-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    setMood(btn.dataset.mood);
    showScreen('dashboard');
    addXP(5);
  });
});

function setMood(mood) {
  state.mood = mood;
  const data = MOOD_KEYS[mood];
  $('#current-mood-text').textContent = t('mood_' + mood);
  $('#current-mood-emoji').textContent = data.emoji;
  $('#mood-suggestion-text').textContent = t('sug_' + mood);
  document.body.className = `mood-${mood}`;
  state.nudgeDismissed = false;
  hideSuggestion();
  renderTasks();
}

$('#btn-change-mood').addEventListener('click', () => showScreen('mood'));

// ============================================================
// === TIMER ===
// ============================================================
function updateTimer() {
  const elapsed = Date.now() - state.sessionStart;
  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  $('#timer-value').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const card = $('#screen-time-card');
  const badge = $('#session-badge');
  const hint = $('#timer-hint');

  if (elapsed >= NUDGE_THRESHOLDS.danger) {
    card.className = 'card screen-time-card danger';
    badge.className = 'badge danger'; badge.textContent = t('badge_danger');
    hint.textContent = t('timer_hint_danger');
    maybeShowTimeNudge();
  } else if (elapsed >= NUDGE_THRESHOLDS.warning) {
    card.className = 'card screen-time-card warning';
    badge.className = 'badge warning'; badge.textContent = t('badge_warning');
    hint.textContent = t('timer_hint_warning');
    maybeShowTimeNudge();
  } else {
    card.className = 'card screen-time-card';
    badge.className = 'badge'; badge.textContent = t('badge_ok');
    hint.textContent = t('timer_hint_ok');
  }
}

setInterval(updateTimer, 1000);

$('#btn-reset-timer').addEventListener('click', () => {
  state.sessionStart = Date.now();
  state.scrollLogCount = 0;
  state.nudgeDismissed = false;
  hideSuggestion();
  updateTimer();
});

// ============================================================
// === SCROLL LOGGING ===
// ============================================================
$('#btn-log-scroll').addEventListener('click', () => {
  state.scrollLogCount++;
  addXP(3);
  if (state.scrollLogCount >= SCROLL_NUDGE_THRESHOLD) {
    showScrollNudge();
  } else {
    const btn = $('#btn-log-scroll');
    const orig = btn.innerHTML;
    btn.textContent = t('honesty_msg');
    setTimeout(() => { btn.innerHTML = orig; }, 1500);
  }
});

// ============================================================
// === NUDGES ===
// ============================================================
function maybeShowTimeNudge() {
  if (state.nudgeDismissed) return;
  if (Date.now() - state.lastNudgeTime < 120000) return;
  state.lastNudgeTime = Date.now();
  showNudge(randomFrom(t('nudge_time')));
}

function showScrollNudge() {
  if (state.nudgeDismissed) return;
  state.lastNudgeTime = Date.now();
  showNudge(randomFrom(t('nudge_scroll')));
}

function showNudge(msg) {
  $('#suggestion-text').textContent = msg;
  $('#suggestion-card').classList.remove('hidden');
  $('#suggestion-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideSuggestion() { $('#suggestion-card').classList.add('hidden'); }

$('#btn-dismiss-suggestion').addEventListener('click', () => { state.nudgeDismissed = true; hideSuggestion(); });
$('#btn-skip-suggestion').addEventListener('click', () => { state.nudgeDismissed = true; hideSuggestion(); });
$('#btn-accept-suggestion').addEventListener('click', () => {
  hideSuggestion();
  const task = findBestTask();
  if (task) highlightTask(task.id);
  else startGroundingExercise();
});

// ============================================================
// === TASK ENGINE ===
// ============================================================
function findBestTask() {
  if (!state.mood) return null;
  const data = MOOD_KEYS[state.mood];
  const active = state.tasks.filter((t) => !t.completed);
  if (!active.length) return null;
  const matched = active.filter((t) => data.energyMatch.includes(t.energy));
  return matched.length ? randomFrom(matched) : randomFrom(active);
}

function highlightTask(id) {
  renderTasks();
  setTimeout(() => {
    const el = document.querySelector(`[data-task-id="${id}"]`);
    if (el) { el.classList.add('suggested'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }, 100);
}

// ============================================================
// === GROUNDING ===
// ============================================================
function startGroundingExercise(specific) {
  const moodData = MOOD_KEYS[state.mood] || MOOD_KEYS.calm;
  const key = specific || randomFrom(moodData.exercises);
  const ex = EX_KEYS[key];

  $('#grounding-title').textContent = t(ex.titleKey);
  $('#grounding-instruction').textContent = t(ex.instKey);
  $('#grounding-card').classList.remove('hidden');
  $('#grounding-card').scrollIntoView({ behavior: 'smooth', block: 'center' });

  stopBreathing();
  if (key === 'breathing') startBreathingAnimation();
  else $('#breathing-circle').classList.add('hidden');

  addXP(10);
}

function startBreathingAnimation() {
  const circle = $('#breathing-circle');
  const text = $('#breathing-text');
  circle.classList.remove('hidden');
  let phase = 0;

  function tick() {
    const labels = [t('breathe_in_anim'), t('hold_anim'), t('breathe_out_anim'), t('hold_anim')];
    const classes = ['expand', 'expand', 'contract', 'contract'];
    text.textContent = labels[phase % 4];
    circle.className = 'breathing-circle ' + classes[phase % 4];
    phase++;
  }

  tick();
  state.breathingInterval = setInterval(tick, 4000);
}

function stopBreathing() {
  if (state.breathingInterval) { clearInterval(state.breathingInterval); state.breathingInterval = null; }
}

$('#btn-close-grounding').addEventListener('click', () => { $('#grounding-card').classList.add('hidden'); stopBreathing(); });
$('#btn-breathe').addEventListener('click', () => startGroundingExercise('breathing'));
$('#btn-ground').addEventListener('click', () => startGroundingExercise(randomFrom(['5-4-3-2-1', 'cold-water', 'mindful-check', 'movement'])));
$('#btn-get-task').addEventListener('click', () => {
  const task = findBestTask();
  if (task) highlightTask(task.id);
  else showNudge(t('no_quests_nudge'));
});

// ============================================================
// === SURPRISE ME ===
// ============================================================
$('#btn-spin-wheel').addEventListener('click', () => {
  const options = [
    () => startGroundingExercise('breathing'),
    () => startGroundingExercise('5-4-3-2-1'),
    () => startGroundingExercise('cold-water'),
    () => startGroundingExercise('movement'),
    () => showPhysicalExercise(),
    () => openBreathGame(),
    () => { const task = findBestTask(); if (task) highlightTask(task.id); else showPhysicalExercise(); },
  ];
  randomFrom(options)();
});

// ============================================================
// === TASKS CRUD ===
// ============================================================
function saveTasks() { localStorage.setItem('rg_tasks', JSON.stringify(state.tasks)); }

function renderTasks() {
  const container = $('#tasks-list');
  const active = state.tasks.filter((tk) => !tk.completed);
  const done = state.tasks.filter((tk) => tk.completed);
  const all = [...active, ...done];

  if (!all.length) {
    container.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = t('empty_quests');
    container.appendChild(p);
    return;
  }

  container.innerHTML = '';
  all.forEach((task) => {
    const el = document.createElement('div');
    el.className = `task-item${task.completed ? ' completed' : ''}`;
    el.dataset.taskId = task.id;
    const xpReward = task.energy === 'high' ? 30 : task.energy === 'medium' ? 20 : 15;

    // Translate energy and category labels
    const energyLabel = t('energy_' + task.energy).replace(/^[\S]+ /, ''); // strip emoji
    const catLabel = t('cat_' + task.category);

    el.innerHTML = `
      <button class="task-check ${task.completed ? 'checked' : ''}" data-id="${task.id}">
        ${task.completed ? '\u2713' : ''}
      </button>
      <div class="task-info">
        <div class="task-name">${escapeHtml(task.name)}</div>
        <div class="task-meta">
          <span class="task-tag energy-${task.energy}">${energyLabel}</span>
          <span class="task-tag" style="background:rgba(255,255,255,0.03);color:var(--text3)">${catLabel}</span>
          ${!task.completed ? `<span class="task-xp">+${xpReward} xp</span>` : ''}
        </div>
      </div>
      <button class="task-delete" data-id="${task.id}">\u00d7</button>
    `;
    container.appendChild(el);
  });

  container.querySelectorAll('.task-check').forEach((b) =>
    b.addEventListener('click', () => toggleTask(b.dataset.id))
  );
  container.querySelectorAll('.task-delete').forEach((b) =>
    b.addEventListener('click', () => deleteTask(b.dataset.id))
  );
}

function toggleTask(id) {
  const task = state.tasks.find((tk) => tk.id === id);
  if (!task) return;
  task.completed = !task.completed;
  if (task.completed) addXP(task.energy === 'high' ? 30 : task.energy === 'medium' ? 20 : 15);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((tk) => tk.id !== id);
  saveTasks();
  renderTasks();
}

// === Add Task ===
$('#btn-add-task').addEventListener('click', () => showScreen('addTask'));
$('#btn-back-from-task').addEventListener('click', () => showScreen('dashboard'));

let selectedEnergy = 'low';
let selectedCategory = 'work';

$$('.energy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.energy-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedEnergy = btn.dataset.energy;
  });
});

$$('.category-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.category-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCategory = btn.dataset.category;
  });
});

$('#task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#task-name').value.trim();
  if (!name) return;
  state.tasks.push({ id: generateId(), name, energy: selectedEnergy, category: selectedCategory, completed: false, createdAt: Date.now() });
  saveTasks();
  $('#task-name').value = '';
  showScreen('dashboard');
  renderTasks();
  addXP(5);
});

// ============================================================
// === BREATH GAME ===
// ============================================================
const breathGame = {
  active: false, round: 0, maxRounds: 5,
  inhaleTimes: [], exhaleTimes: [],
  pressStart: null, releaseStart: null,
  phase: 'waiting', guidedInterval: null,
  guidedActive: false, extraSlowdown: 0,
};

function openBreathGame() {
  breathGame.round = 0; breathGame.inhaleTimes = []; breathGame.exhaleTimes = [];
  breathGame.phase = 'waiting'; breathGame.active = true; breathGame.extraSlowdown = 0;

  const card = $('#breath-game-card');
  card.classList.remove('hidden');
  $('#breath-game-title').textContent = t('breath_cal_title');
  $('#breath-game-subtitle').textContent = t('breath_cal_subtitle');

  $$('.progress-dot').forEach((d) => d.classList.remove('done', 'active'));
  $(`.progress-dot[data-round="1"]`).classList.add('active');

  const circle = $('#breath-game-circle');
  circle.style.transform = 'scale(1)'; circle.className = 'breath-game-circle';
  $('#breath-game-label').textContent = t('hold_me');
  $('#breath-game-counter').textContent = t('round_x_of_5').replace('{n}', '1');
  $('#breath-game-progress').classList.remove('hidden');

  closeGuidedBreath();
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeBreathGame() {
  breathGame.active = false; breathGame.phase = 'waiting';
  $('#breath-game-card').classList.add('hidden');
  const circle = $('#breath-game-circle');
  circle.style.transform = 'scale(1)'; circle.className = 'breath-game-circle';
}

const breathCircle = $('#breath-game-circle');
let breathAnimFrame = null;

function onBreathPress(e) {
  e.preventDefault();
  if (!breathGame.active || breathGame.phase === 'done') return;
  if (breathGame.phase === 'waiting' || breathGame.phase === 'exhaling') {
    if (breathGame.phase === 'exhaling' && breathGame.releaseStart)
      breathGame.exhaleTimes.push(Date.now() - breathGame.releaseStart);
    breathGame.phase = 'inhaling'; breathGame.pressStart = Date.now();
    breathCircle.classList.add('pressing'); breathCircle.classList.remove('released');
    $('#breath-game-label').textContent = t('breathing_in');
    animateGrow();
  }
}

function onBreathRelease(e) {
  e.preventDefault();
  if (!breathGame.active || breathGame.phase !== 'inhaling') return;
  breathGame.inhaleTimes.push(Date.now() - breathGame.pressStart);
  breathGame.round++;
  breathGame.phase = 'exhaling'; breathGame.releaseStart = Date.now();
  breathCircle.classList.remove('pressing'); breathCircle.classList.add('released');
  $('#breath-game-label').textContent = t('breathing_out');
  animateShrink();

  $$('.progress-dot').forEach((d) => d.classList.remove('active'));
  $(`.progress-dot[data-round="${breathGame.round}"]`).classList.add('done');

  if (breathGame.round >= breathGame.maxRounds) {
    setTimeout(() => {
      if (breathGame.releaseStart) breathGame.exhaleTimes.push(Date.now() - breathGame.releaseStart);
      breathGame.phase = 'done';
      showCalibrationResult();
      addXP(15);
    }, 2000);
  } else {
    const next = breathGame.round + 1;
    if (next <= breathGame.maxRounds) $(`.progress-dot[data-round="${next}"]`).classList.add('active');
    $('#breath-game-counter').textContent = t('round_x_of_5').replace('{n}', next);
  }
}

function animateGrow() {
  cancelAnimationFrame(breathAnimFrame);
  const t0 = Date.now(), s0 = getScale(breathCircle);
  (function loop() {
    if (breathGame.phase !== 'inhaling') return;
    const p = Math.min((Date.now() - t0) / 6000, 1);
    breathCircle.style.transform = `scale(${s0 + (2.0 - s0) * easeOut(p)})`;
    if (p < 1) breathAnimFrame = requestAnimationFrame(loop);
  })();
}

function animateShrink() {
  cancelAnimationFrame(breathAnimFrame);
  const t0 = Date.now(), s0 = getScale(breathCircle);
  (function loop() {
    if (breathGame.phase === 'inhaling') return;
    const p = Math.min((Date.now() - t0) / 3000, 1);
    breathCircle.style.transform = `scale(${Math.max(1, s0 - (s0 - 1) * easeOut(p))})`;
    if (p < 1 && breathGame.phase !== 'done') breathAnimFrame = requestAnimationFrame(loop);
  })();
}

function getScale(el) { const m = el.style.transform.match(/scale\(([^)]+)\)/); return m ? parseFloat(m[1]) : 1; }
function easeOut(x) { return 1 - Math.pow(1 - x, 3); }

breathCircle.addEventListener('mousedown', onBreathPress);
breathCircle.addEventListener('mouseup', onBreathRelease);
breathCircle.addEventListener('mouseleave', (e) => { if (breathGame.phase === 'inhaling') onBreathRelease(e); });
breathCircle.addEventListener('touchstart', onBreathPress, { passive: false });
breathCircle.addEventListener('touchend', onBreathRelease, { passive: false });
breathCircle.addEventListener('touchcancel', onBreathRelease, { passive: false });

function showCalibrationResult() {
  const avgIn = breathGame.inhaleTimes.reduce((a, b) => a + b, 0) / breathGame.inhaleTimes.length;
  const avgOut = breathGame.exhaleTimes.reduce((a, b) => a + b, 0) / breathGame.exhaleTimes.length;
  const iSec = (avgIn / 1000).toFixed(1), oSec = (avgOut / 1000).toFixed(1);

  let msg;
  if (avgIn < 2000) msg = t('cal_fast');
  else if (avgIn < 4000) msg = t('cal_medium');
  else msg = t('cal_deep');

  $('#breath-game-label').textContent = '\u2728';
  breathCircle.style.transform = 'scale(1)'; breathCircle.className = 'breath-game-circle';
  $('#breath-game-counter').textContent = '';
  $('#breath-game-subtitle').innerHTML = `<strong>${iSec}s / ${oSec}s</strong> \u2014 ${msg}`;
  $('#breath-game-counter').innerHTML =
    `<button class="btn btn-primary btn-glow" id="btn-start-guided" style="margin-top:12px">${t('start_guided')}</button>`;
  $('#btn-start-guided').addEventListener('click', () => { closeBreathGame(); startGuidedBreath(avgIn, avgOut); });
}

// === Guided Breathing ===
function startGuidedBreath(avgInMs, avgOutMs) {
  const slow = breathGame.extraSlowdown * 1000;
  const inhMs = avgInMs + 500 + slow, exhMs = avgOutMs + 500 + slow;
  const holdMs = Math.min(inhMs * 0.5, 2000);

  const card = $('#breath-guided-card');
  card.classList.remove('hidden');
  const circle = $('#breath-guided-circle');
  const label = $('#guided-breath-label');

  $('#guided-breath-stats').textContent =
    `${(inhMs/1000).toFixed(1)}${t('s_in')} \u2022 ${(holdMs/1000).toFixed(1)}${t('s_hold')} \u2022 ${(exhMs/1000).toFixed(1)}${t('s_out')}`;
  $('#guided-breath-subtitle').textContent = t('guided_subtitle');

  if (breathGame.guidedInterval) clearTimeout(breathGame.guidedInterval);
  breathGame.guidedActive = true;
  let rounds = 0; const max = 8;

  function doRound() {
    if (!breathGame.guidedActive || rounds >= max) {
      label.textContent = t('guided_done');
      circle.style.transition = 'transform 1s ease'; circle.style.transform = 'scale(1)';
      circle.className = 'breath-guided-circle'; return;
    }
    label.textContent = t('breathe_in');
    circle.className = 'breath-guided-circle inhale';
    circle.style.transition = `transform ${inhMs}ms ease-in-out`; circle.style.transform = 'scale(1.5)';
    breathGame.guidedInterval = setTimeout(() => {
      label.textContent = t('hold');
      breathGame.guidedInterval = setTimeout(() => {
        label.textContent = t('breathe_out');
        circle.className = 'breath-guided-circle exhale';
        circle.style.transition = `transform ${exhMs}ms ease-in-out`; circle.style.transform = 'scale(1)';
        breathGame.guidedInterval = setTimeout(() => { rounds++; doRound(); }, exhMs + 300);
      }, holdMs);
    }, inhMs);
  }

  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(doRound, 800);
}

function closeGuidedBreath() {
  breathGame.guidedActive = false;
  if (breathGame.guidedInterval) clearTimeout(breathGame.guidedInterval);
  breathGame.guidedInterval = null;
  $('#breath-guided-card').classList.add('hidden');
  const c = $('#breath-guided-circle'); c.style.transform = 'scale(1)'; c.style.transition = '';
}

$('#btn-close-breath-game').addEventListener('click', closeBreathGame);
$('#btn-close-guided-breath').addEventListener('click', closeGuidedBreath);
$('#btn-recalibrate').addEventListener('click', () => { closeGuidedBreath(); openBreathGame(); });
$('#btn-extend-breath').addEventListener('click', () => {
  breathGame.extraSlowdown += 1;
  const avgIn = breathGame.inhaleTimes.reduce((a, b) => a + b, 0) / breathGame.inhaleTimes.length;
  const avgOut = breathGame.exhaleTimes.reduce((a, b) => a + b, 0) / breathGame.exhaleTimes.length;
  closeGuidedBreath(); startGuidedBreath(avgIn, avgOut);
});
$('#btn-breath-game').addEventListener('click', openBreathGame);

// ============================================================
// === PHYSICAL EXERCISES ===
// ============================================================
let lastPhysIdx = -1;

function showPhysicalExercise() {
  const exercises = t('physical_exercises');
  let idx;
  do { idx = Math.floor(Math.random() * exercises.length); }
  while (idx === lastPhysIdx && exercises.length > 1);
  lastPhysIdx = idx;

  const ex = exercises[idx];
  $('#physical-card').classList.remove('hidden');
  $('#physical-emoji').textContent = ex.emoji;
  $('#physical-name').textContent = ex.name;
  $('#physical-desc').textContent = ex.desc;
  $('#physical-steps').innerHTML = '<ol>' + ex.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('') + '</ol>';
  $('#physical-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

$('#btn-move').addEventListener('click', showPhysicalExercise);
$('#btn-next-exercise').addEventListener('click', showPhysicalExercise);
$('#btn-complete-exercise').addEventListener('click', () => { addXP(20); $('#physical-card').classList.add('hidden'); });
$('#btn-close-physical').addEventListener('click', () => { $('#physical-card').classList.add('hidden'); });

// ============================================================
// === GREETING ===
// ============================================================
function setGreeting() {
  const h = new Date().getHours();
  const key = h < 12 ? 'greeting_morning' : h < 18 ? 'greeting_afternoon' : 'greeting_evening';
  $('#greeting-text').textContent = randomFrom(t(key));
}

// ============================================================
// === HELPERS ===
// ============================================================
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function generateId() { return Math.random().toString(36).substring(2, 10); }
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// ============================================================
// === INIT ===
// ============================================================
updateStreak();
setGreeting();
updateXPDisplay();
renderStreak();
renderTasks();
applyLang();

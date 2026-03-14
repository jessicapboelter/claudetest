// ============================================================
// === GAME: SHAKE IT OUT ===
// ============================================================
(function () {
  const canvas = document.getElementById('shake-canvas');
  const ctx = canvas.getContext('2d');
  let balls = [];
  let shakeActive = false;
  let animId = null;

  function resizeCanvas() {
    const card = document.getElementById('game-shake-card');
    if (card.classList.contains('hidden')) return;
    canvas.width = Math.min(card.offsetWidth - 40, 340);
    canvas.height = 350;
  }

  function spawnBalls() {
    balls = [];
    const colors = ['#a855f7', '#f472b6', '#fb923c', '#34d399', '#60a5fa', '#fbbf24',
                     '#f87171', '#c084fc', '#38bdf8', '#a3e635', '#e879f9', '#facc15'];
    for (let i = 0; i < 12; i++) {
      balls.push({
        x: 30 + Math.random() * (canvas.width - 60),
        y: 30 + Math.random() * (canvas.height - 60),
        r: 14 + Math.random() * 10,
        vx: 0, vy: 0,
        color: colors[i % colors.length],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function update() {
    if (!shakeActive) return;
    balls.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.98;
      b.vy *= 0.98;
    });

    // Remove balls that left the screen
    balls = balls.filter((b) =>
      b.x + b.r > -50 && b.x - b.r < canvas.width + 50 &&
      b.y + b.r > -50 && b.y - b.r < canvas.height + 50
    );

    document.getElementById('shake-status').textContent =
      balls.length > 0 ? `balls left: ${balls.length}` : '';

    draw();

    if (balls.length === 0) {
      shakeActive = false;
      document.getElementById('shake-instruction').textContent = 'you did it! all gone!';
      if (typeof addXP === 'function') addXP(20);
      return;
    }

    animId = requestAnimationFrame(update);
  }

  function onShake(e) {
    if (!shakeActive) return;
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a) return;
    const force = 1.8;
    balls.forEach((b) => {
      b.vx += (a.x || 0) * force + (Math.random() - 0.5) * 2;
      b.vy -= (a.y || 0) * force + (Math.random() - 0.5) * 2;
    });
  }

  // Fallback: mouse/touch drag for desktop testing
  let lastTouch = null;
  canvas.addEventListener('touchmove', (e) => {
    if (!shakeActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (lastTouch) {
      const dx = (touch.clientX - lastTouch.x) * 0.8;
      const dy = (touch.clientY - lastTouch.y) * 0.8;
      balls.forEach((b) => { b.vx += dx; b.vy += dy; });
    }
    lastTouch = { x: touch.clientX, y: touch.clientY };
  }, { passive: false });
  canvas.addEventListener('touchend', () => { lastTouch = null; });

  // Mouse fallback
  let mouseDown = false;
  let lastMouse = null;
  canvas.addEventListener('mousedown', () => { mouseDown = true; });
  canvas.addEventListener('mouseup', () => { mouseDown = false; lastMouse = null; });
  canvas.addEventListener('mousemove', (e) => {
    if (!shakeActive || !mouseDown) return;
    if (lastMouse) {
      const dx = (e.clientX - lastMouse.x) * 0.8;
      const dy = (e.clientY - lastMouse.y) * 0.8;
      balls.forEach((b) => { b.vx += dx; b.vy += dy; });
    }
    lastMouse = { x: e.clientX, y: e.clientY };
  });

  function requestMotion() {
    return new Promise((resolve) => {
      if (typeof DeviceMotionEvent !== 'undefined' &&
          typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then((perm) => resolve(perm === 'granted'))
          .catch(() => resolve(false));
      } else if ('DeviceMotionEvent' in window) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  function startShakeGame() {
    const card = document.getElementById('game-shake-card');
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    resizeCanvas();
    spawnBalls();
    shakeActive = true;

    requestMotion().then((granted) => {
      if (granted) {
        window.addEventListener('devicemotion', onShake);
        document.getElementById('shake-instruction').textContent =
          'shake your phone to fling the balls off the screen!';
      } else {
        document.getElementById('shake-instruction').textContent =
          'swipe the balls off the screen with your finger!';
      }
    });

    cancelAnimationFrame(animId);
    update();
  }

  function closeShakeGame() {
    shakeActive = false;
    cancelAnimationFrame(animId);
    window.removeEventListener('devicemotion', onShake);
    document.getElementById('game-shake-card').classList.add('hidden');
  }

  document.getElementById('btn-game-shake').addEventListener('click', startShakeGame);
  document.getElementById('btn-close-shake').addEventListener('click', closeShakeGame);
})();

// ============================================================
// === GAME: TAP FRENZY ===
// ============================================================
(function () {
  const DURATION = 10000;
  let taps = 0;
  let running = false;
  let startTime = 0;
  let timerId = null;
  let record = parseInt(localStorage.getItem('rg_tap_record') || '0');

  const zone = document.getElementById('tap-zone');
  const countEl = document.getElementById('tap-count');
  const timerEl = document.getElementById('tap-timer');
  const recordEl = document.getElementById('tap-record');
  const startBtn = document.getElementById('btn-tap-start');
  const instrEl = document.getElementById('tap-instruction');

  recordEl.textContent = `record: ${record}`;

  function onTap(e) {
    e.preventDefault();
    if (!running) return;
    taps++;
    countEl.textContent = taps;
    zone.style.transform = 'scale(0.93)';
    setTimeout(() => { zone.style.transform = ''; }, 50);
  }

  function tick() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, DURATION - elapsed);
    timerEl.textContent = (remaining / 1000).toFixed(1) + 's';

    if (remaining <= 0) {
      endGame();
      return;
    }
    timerId = requestAnimationFrame(tick);
  }

  function startGame() {
    taps = 0;
    running = true;
    startTime = Date.now();
    countEl.textContent = '0';
    zone.className = 'tap-zone active-game';
    startBtn.classList.add('hidden');
    instrEl.textContent = 'GO GO GO! tap as fast as you can!';
    tick();
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(timerId);
    zone.className = 'tap-zone finished';
    timerEl.textContent = '0.0s';
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'again!';

    const isRecord = taps > record;
    if (isRecord) {
      record = taps;
      localStorage.setItem('rg_tap_record', record);
      instrEl.textContent = `NEW RECORD! ${taps} taps!`;
    } else {
      instrEl.textContent = `${taps} taps! (record: ${record})`;
    }
    recordEl.textContent = `record: ${record}`;
    if (typeof addXP === 'function') addXP(isRecord ? 25 : 15);
  }

  zone.addEventListener('touchstart', onTap, { passive: false });
  zone.addEventListener('mousedown', onTap);
  startBtn.addEventListener('click', startGame);

  document.getElementById('btn-game-tap').addEventListener('click', () => {
    const card = document.getElementById('game-tap-card');
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    taps = 0;
    countEl.textContent = '0';
    timerEl.textContent = '10.0s';
    zone.className = 'tap-zone';
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'start!';
    instrEl.textContent = 'tap the zone as fast as you can for 10 seconds!';
  });

  document.getElementById('btn-close-tap').addEventListener('click', () => {
    running = false;
    cancelAnimationFrame(timerId);
    document.getElementById('game-tap-card').classList.add('hidden');
  });
})();

// ============================================================
// === GAME: FREEZE HOLD ===
// ============================================================
(function () {
  const THRESHOLD = 1.2; // movement sensitivity
  let holding = false;
  let holdStart = 0;
  let holdTimer = null;
  let record = parseFloat(localStorage.getItem('rg_hold_record') || '0');

  const circle = document.getElementById('hold-circle');
  const timeEl = document.getElementById('hold-time');
  const statusEl = document.getElementById('hold-status');
  const recordEl = document.getElementById('hold-record');
  const startBtn = document.getElementById('btn-hold-start');

  recordEl.textContent = `record: ${record.toFixed(1)}s`;

  // Track baseline so we detect change from initial position, not absolute values
  let baselineAccel = null;

  function onMotion(e) {
    if (!holding) return;
    const a = e.accelerationIncludingGravity;
    if (!a || (a.x === null && a.y === null && a.z === null)) return;
    const ax = a.x || 0, ay = a.y || 0, az = a.z || 0;

    if (!baselineAccel) {
      baselineAccel = { x: ax, y: ay, z: az };
      return;
    }

    const dx = Math.abs(ax - baselineAccel.x);
    const dy = Math.abs(ay - baselineAccel.y);
    const dz = Math.abs(az - baselineAccel.z);
    const total = dx + dy + dz;

    // Slowly adapt baseline to avoid drift
    baselineAccel.x += (ax - baselineAccel.x) * 0.02;
    baselineAccel.y += (ay - baselineAccel.y) * 0.02;
    baselineAccel.z += (az - baselineAccel.z) * 0.02;

    if (total > THRESHOLD * 3) {
      failHold();
    }
  }

  function tickHold() {
    if (!holding) return;
    const elapsed = (Date.now() - holdStart) / 1000;
    timeEl.textContent = elapsed.toFixed(1) + 's';
    circle.className = 'hold-circle holding';
    statusEl.textContent = 'stay still...';
    holdTimer = requestAnimationFrame(tickHold);
  }

  function failHold() {
    const elapsed = (Date.now() - holdStart) / 1000;
    holding = false;
    cancelAnimationFrame(holdTimer);
    window.removeEventListener('devicemotion', onMotion);
    circle.className = 'hold-circle failed';
    statusEl.textContent = `you moved! ${elapsed.toFixed(1)}s`;

    const isRecord = elapsed > record;
    if (isRecord) {
      record = elapsed;
      localStorage.setItem('rg_hold_record', record.toFixed(1));
      statusEl.textContent = `NEW RECORD! ${elapsed.toFixed(1)}s!`;
    }
    recordEl.textContent = `record: ${record.toFixed(1)}s`;
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'try again';
    if (typeof addXP === 'function') addXP(isRecord ? 25 : 15);
  }

  function requestMotionHold() {
    return new Promise((resolve) => {
      if (typeof DeviceMotionEvent !== 'undefined' &&
          typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then((perm) => resolve(perm === 'granted'))
          .catch(() => resolve(false));
      } else if ('DeviceMotionEvent' in window) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  function startHold() {
    holding = true;
    holdStart = Date.now();
    baselineAccel = null;
    timeEl.textContent = '0.0s';
    circle.className = 'hold-circle holding';
    statusEl.textContent = 'stay still...';
    startBtn.classList.add('hidden');

    requestMotionHold().then((granted) => {
      if (granted) {
        window.addEventListener('devicemotion', onMotion);
        document.getElementById('hold-instruction').textContent =
          'hold your phone perfectly still for as long as you can. breathe slowly.';
      } else {
        document.getElementById('hold-instruction').textContent =
          'motion sensors not available on this device. try on your phone!';
      }
    });

    tickHold();

    // Auto-win after 30 seconds
    setTimeout(() => {
      if (holding) {
        holding = false;
        cancelAnimationFrame(holdTimer);
        window.removeEventListener('devicemotion', onMotion);
        const elapsed = (Date.now() - holdStart) / 1000;
        timeEl.textContent = elapsed.toFixed(1) + 's';
        circle.className = 'hold-circle';
        statusEl.textContent = 'zen master! 30 seconds!';
        if (elapsed > record) {
          record = elapsed;
          localStorage.setItem('rg_hold_record', record.toFixed(1));
        }
        recordEl.textContent = `record: ${record.toFixed(1)}s`;
        startBtn.classList.remove('hidden');
        startBtn.textContent = 'again';
        if (typeof addXP === 'function') addXP(30);
      }
    }, 30000);
  }

  startBtn.addEventListener('click', startHold);

  document.getElementById('btn-game-hold').addEventListener('click', () => {
    const card = document.getElementById('game-hold-card');
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    circle.className = 'hold-circle';
    timeEl.textContent = '0.0s';
    statusEl.textContent = 'waiting...';
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'start!';
    document.getElementById('hold-instruction').textContent =
      'hold your phone perfectly still for as long as you can. breathe slowly.';
  });

  document.getElementById('btn-close-hold').addEventListener('click', () => {
    holding = false;
    cancelAnimationFrame(holdTimer);
    window.removeEventListener('devicemotion', onMotion);
    document.getElementById('game-hold-card').classList.add('hidden');
  });
})();

// ============================================================
// === GAME: POP BUBBLES ===
// ============================================================
(function () {
  const canvas = document.getElementById('pop-canvas');
  const ctx = canvas.getContext('2d');
  const GAME_DURATION = 30000;
  let bubbles = [];
  let score = 0;
  let running = false;
  let startTime = 0;
  let animId = null;
  let spawnTimer = null;
  let record = parseInt(localStorage.getItem('rg_pop_record') || '0');

  const scoreEl = document.getElementById('pop-score');
  const timerEl = document.getElementById('pop-timer');
  const recordEl = document.getElementById('pop-record');
  const instrEl = document.getElementById('pop-instruction');

  recordEl.textContent = `record: ${record}`;

  function resizeCanvas() {
    const card = document.getElementById('game-pop-card');
    if (card.classList.contains('hidden')) return;
    canvas.width = Math.min(card.offsetWidth - 40, 340);
    canvas.height = 380;
  }

  const COLORS = ['#a855f7', '#f472b6', '#fb923c', '#34d399', '#60a5fa', '#fbbf24', '#e879f9', '#38bdf8'];

  function spawnBubble() {
    if (!running) return;
    const r = 18 + Math.random() * 18;
    bubbles.push({
      x: r + Math.random() * (canvas.width - r * 2),
      y: canvas.height + r,
      r,
      vy: -(1.2 + Math.random() * 1.5),
      vx: (Math.random() - 0.5) * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 1,
      popped: false,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach((b) => {
      if (b.popped) return;
      ctx.globalAlpha = b.opacity;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      // Shine
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function update() {
    if (!running) return;

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, GAME_DURATION - elapsed);
    timerEl.textContent = Math.ceil(remaining / 1000) + 's';

    if (remaining <= 0) {
      endPopGame();
      return;
    }

    bubbles.forEach((b) => {
      if (b.popped) return;
      b.x += b.vx;
      b.y += b.vy;
      // Wobble
      b.vx += (Math.random() - 0.5) * 0.1;
    });

    // Remove escaped bubbles
    bubbles = bubbles.filter((b) => b.popped || b.y + b.r > -20);

    draw();
    animId = requestAnimationFrame(update);
  }

  function popAt(px, py) {
    if (!running) return;
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (b.popped) continue;
      const dist = Math.sqrt((px - b.x) ** 2 + (py - b.y) ** 2);
      if (dist < b.r + 8) {
        b.popped = true;
        score++;
        scoreEl.textContent = `score: ${score}`;
        // Pop animation: just remove
        setTimeout(() => {
          bubbles = bubbles.filter((bb) => bb !== b);
        }, 50);
        return;
      }
    }
  }

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    for (const touch of e.touches) {
      popAt(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  }, { passive: false });

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    popAt(e.clientX - rect.left, e.clientY - rect.top);
  });

  function startPopGame() {
    const card = document.getElementById('game-pop-card');
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    resizeCanvas();

    bubbles = [];
    score = 0;
    running = true;
    startTime = Date.now();
    scoreEl.textContent = 'score: 0';
    timerEl.textContent = '30s';
    instrEl.textContent = 'tap the bubbles before they float away! 30 seconds.';

    // Spawn bubbles at intervals
    clearInterval(spawnTimer);
    spawnTimer = setInterval(() => {
      if (!running) { clearInterval(spawnTimer); return; }
      // Spawn more as time goes on
      const elapsed = Date.now() - startTime;
      const count = elapsed < 10000 ? 1 : elapsed < 20000 ? 2 : 3;
      for (let i = 0; i < count; i++) spawnBubble();
    }, 700);

    // Initial bubbles
    for (let i = 0; i < 4; i++) spawnBubble();

    cancelAnimationFrame(animId);
    update();
  }

  function endPopGame() {
    running = false;
    cancelAnimationFrame(animId);
    clearInterval(spawnTimer);

    const isRecord = score > record;
    if (isRecord) {
      record = score;
      localStorage.setItem('rg_pop_record', record);
      instrEl.textContent = `NEW RECORD! ${score} bubbles popped!`;
    } else {
      instrEl.textContent = `${score} popped! (record: ${record})`;
    }
    recordEl.textContent = `record: ${record}`;
    if (typeof addXP === 'function') addXP(isRecord ? 25 : 15);
  }

  document.getElementById('btn-game-pop').addEventListener('click', startPopGame);
  document.getElementById('btn-close-pop').addEventListener('click', () => {
    running = false;
    cancelAnimationFrame(animId);
    clearInterval(spawnTimer);
    document.getElementById('game-pop-card').classList.add('hidden');
  });
})();

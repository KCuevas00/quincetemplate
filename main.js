/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCE TEMPLATE — ISABELLA SMITH
 * Interactive Controller: Screen Switcher, RSVP Modal, Confetti & Audio
 * ═════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  initCardSwitcher();
  initRSVPModal();
  initAmbientCanvas();
  initAudioEngine();
});

/* ═════════════════════════════════════════════════════════════════════
   1. CARD NAVIGATION & SCREEN SWITCHER
   ═════════════════════════════════════════════════════════════════════ */
function initCardSwitcher() {
  const tabs = document.querySelectorAll('.nav-tab');
  const cards = document.querySelectorAll('.invitation-card');
  const phoneScreen = document.querySelector('.phone-screen');

  function switchCard(targetId) {
    cards.forEach(card => {
      if (card.id === targetId) {
        card.classList.add('card-active');
      } else {
        card.classList.remove('card-active');
      }
    });

    tabs.forEach(tab => {
      if (tab.dataset.target === targetId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (phoneScreen) {
      phoneScreen.scrollTop = 0;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchCard(tab.dataset.target);
    });
  });

  // Next buttons inside cards
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchCard(btn.dataset.jump);
    });
  });
}

/* ═════════════════════════════════════════════════════════════════════
   2. INTERACTIVE RSVP MODAL & CONFETTI CELEBRATION
   ═════════════════════════════════════════════════════════════════════ */
function initRSVPModal() {
  const modal = document.getElementById('rsvp-modal');
  const openBtn = document.getElementById('open-rsvp-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('rsvp-form');
  const successAlert = document.getElementById('modal-success-alert');

  if (!modal) return;

  function openModal() {
    modal.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-fullname');
      const contactInput = document.getElementById('guest-email');
      const attendInput = document.getElementById('guest-attend');

      if (!nameInput.value.trim()) {
        nameInput.focus();
        return;
      }
      if (!contactInput.value.trim()) {
        contactInput.focus();
        return;
      }
      if (!attendInput.value) {
        attendInput.focus();
        return;
      }

      // Celebratory Confetti Burst
      triggerCelebrationConfetti();

      // Show success feedback
      if (successAlert) {
        successAlert.removeAttribute('hidden');
        form.reset();
      }
    });
  }
}

/* ═════════════════════════════════════════════════════════════════════
   3. CELEBRATORY CONFETTI PARTICLES
   ═════════════════════════════════════════════════════════════════════ */
let confettiCanvas, confettiCtx;
const confettiParticles = [];

function triggerCelebrationConfetti() {
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.inset = '0';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '9999';
    document.body.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext('2d');
  }

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const colors = ['#d39585', '#f7d8ce', '#c49e58', '#f4d3c9', '#ffffff', '#e8a594'];

  for (let i = 0; i < 70; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01
    });
  }

  function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = p.alpha;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      confettiCtx.restore();
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(updateConfetti);
    }
  }

  requestAnimationFrame(updateConfetti);
}

/* ═════════════════════════════════════════════════════════════════════
   4. AMBIENT BOKEH BACKGROUND CANVAS
   ═════════════════════════════════════════════════════════════════════ */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const bokehs = [];
  const count = window.innerWidth < 600 ? 18 : 35;

  for (let i = 0; i < count; i++) {
    bokehs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 22 + 8,
      speedY: -(Math.random() * 0.25 + 0.08),
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.5 ? '255, 255, 255' : '247, 216, 206'
    });
  }

  function renderBokeh() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < bokehs.length; i++) {
      const b = bokehs[i];
      b.y += b.speedY;
      b.x += b.speedX;

      if (b.y < -b.radius) {
        b.y = height + b.radius;
        b.x = Math.random() * width;
      }

      ctx.beginPath();
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      grad.addColorStop(0, `rgba(${b.color}, ${b.alpha})`);
      grad.addColorStop(1, `rgba(${b.color}, 0)`);
      ctx.fillStyle = grad;
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(renderBokeh);
  }

  renderBokeh();
}

/* ═════════════════════════════════════════════════════════════════════
   5. AMBIENT AUDIO CONTROLLER (GENTLE WALTZ HARP SYNTHESIS)
   ═════════════════════════════════════════════════════════════════════ */
function initAudioEngine() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let sequenceTimer = null;

  // Gentle acoustic harp waltz chords (F major / D minor progression)
  const notes = [
    349.23, 440.00, 523.25, 698.46, 523.25, 440.00,
    392.00, 493.88, 587.33, 783.99, 587.33, 493.88,
    329.63, 392.00, 493.88, 659.25, 493.88, 392.00,
    440.00, 523.25, 659.25, 880.00, 659.25, 523.25
  ];
  let noteIndex = 0;

  function getCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playNote(freq) {
    if (!isPlaying) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  }

  function startMusic() {
    isPlaying = true;
    audioBtn.classList.add('playing');
    function loop() {
      if (!isPlaying) return;
      playNote(notes[noteIndex]);
      noteIndex = (noteIndex + 1) % notes.length;
      sequenceTimer = setTimeout(loop, 450);
    }
    loop();
  }

  function stopMusic() {
    isPlaying = false;
    clearTimeout(sequenceTimer);
    audioBtn.classList.remove('playing');
  }

  audioBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

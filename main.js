/**
 * ═════════════════════════════════════════════════════════════════════
 * QUINCE TEMPLATE — VALERIA MORALES
 * Interactive Controller: Smooth Navigation, RSVP Modal, Confetti & Audio
 * ═════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  // Prevent browser from restoring a previous scroll position
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Keep pinned to top while envelope has not opened
  const pinToTopBeforeEnter = () => {
    if (!document.body.classList.contains('site-entered')) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };
  window.addEventListener('scroll', pinToTopBeforeEnter, { passive: true });

  initRSVPModal();
  initAmbientCanvas();
  initAudioEngine();
  initEntryExperience();
  initLanguageSwitcher();
  initCountdown();
  initMapLinks();
  initScrollFadeIn();
});

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

  for (let i = 0; i < 75; i++) {
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
  const count = window.innerWidth < 600 ? 16 : 30;

  for (let i = 0; i < count; i++) {
    bokehs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 20 + 6,
      speedY: -(Math.random() * 0.22 + 0.06),
      speedX: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.3 + 0.08,
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
   5. AMBIENT AUDIO CONTROLLER (BEBE DAME - FUERZA REGIDA & GRUPO FRONTERA)
   ═════════════════════════════════════════════════════════════════════ */
function initAudioEngine() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioPlayIcon = document.getElementById('audio-play-icon');
  const audioPauseIcon = document.getElementById('audio-pause-icon');
  const volumeSlider = document.getElementById('audio-volume-slider');
  const muteBtn = document.getElementById('audio-mute-btn');
  const volIcon = document.getElementById('vol-icon');

  if (!audioBtn) return;

  const audio = document.getElementById('bg-audio') || new Audio('music/Fuerza Regida, Grupo Frontera - Bebe Dame (SPOTISAVER).mp3');
  const START_TIME = 12; // Start at 12 seconds
  let hasSetInitialTime = false;
  let isPlaying = false;
  let lastNonZeroVolume = 0.8;

  // Set default initial volume
  audio.volume = 0.8;

  function ensureStartTime() {
    if (!hasSetInitialTime) {
      try {
        audio.currentTime = START_TIME;
        hasSetInitialTime = true;
      } catch (e) {}
    }
  }

  audio.addEventListener('loadedmetadata', ensureStartTime);

  function updatePlayState(playing) {
    isPlaying = playing;
    if (audioBtn) {
      if (playing) {
        audioBtn.classList.add('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'none';
        if (audioPauseIcon) audioPauseIcon.style.display = 'inline-flex';
      } else {
        audioBtn.classList.remove('playing');
        if (audioPlayIcon) audioPlayIcon.style.display = 'inline-flex';
        if (audioPauseIcon) audioPauseIcon.style.display = 'none';
      }
    }
  }

  function updateVolumeUI() {
    const isMuted = audio.muted || audio.volume === 0;
    if (volIcon) {
      if (isMuted) {
        volIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.05 4.05L7 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
      } else if (audio.volume <= 0.5) {
        volIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
      } else {
        volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
      }
    }
    if (volumeSlider) {
      volumeSlider.value = isMuted ? 0 : audio.volume;
    }
  }

  function playAudio() {
    ensureStartTime();
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updatePlayState(true);
        })
        .catch(err => {
          console.warn('Audio play prevented or interrupted:', err);
        });
    }
  }

  function pauseAudio() {
    audio.pause();
    updatePlayState(false);
  }

  // Play / Pause Button Click
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  // Volume Slider Change
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      audio.volume = val;
      if (val > 0) {
        audio.muted = false;
        lastNonZeroVolume = val;
      } else {
        audio.muted = true;
      }
      updateVolumeUI();
    });
  }

  // Mute / Unmute Button Click
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = lastNonZeroVolume || 0.8;
      } else {
        lastNonZeroVolume = audio.volume;
        audio.muted = true;
      }
      updateVolumeUI();
    });
  }

  audio.addEventListener('play', () => {
    updatePlayState(true);
  });

  audio.addEventListener('pause', () => {
    updatePlayState(false);
  });

  // When song ends, loop back directly to 12 seconds
  audio.addEventListener('ended', () => {
    try {
      audio.currentTime = START_TIME;
      audio.play().catch(() => {});
    } catch (e) {
      updatePlayState(false);
    }
  });

  // Initialize UI state
  updatePlayState(false);
  updateVolumeUI();

  // Expose global starter for when envelope opens
  window.playAmbientSong = () => {
    if (!isPlaying) {
      playAudio();
    }
  };
}

/* ═════════════════════════════════════════════════════════════════════
   6. ARTISANAL ENVELOPE ENTRY CONTROLLER & SAKURA CASCADE
   ═════════════════════════════════════════════════════════════════════ */
function initEntryExperience() {
  const overlay = document.getElementById('entry-popup-overlay');
  const envelope = document.getElementById('luxury-envelope');
  const sealTrigger = document.getElementById('wax-seal-trigger');

  if (!overlay || !envelope) return;

  // Falling Cherry Blossom Petal Engine
  class SakuraCascadeEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.active = false; // NOTE: petals are strictly INACTIVE until invitation is opened!
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createPetal(initialY = -25) {
      return {
        x: Math.random() * this.width,
        y: initialY,
        size: Math.random() * 9 + 6,
        speedY: Math.random() * 1.6 + 0.9,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.03 + 0.015,
        color: Math.random() > 0.4 ? (Math.random() > 0.5 ? 'rgba(252, 206, 185, 0.9)' : 'rgba(247, 185, 198, 0.85)') : 'rgba(255, 238, 228, 0.92)',
        flipSpeed: Math.random() * 0.03 + 0.015,
        flip: Math.random() * Math.PI
      };
    }

    // Called the moment the guest taps the wax seal
    start() {
      if (this.active) return;
      this.active = true;

      // Seed initial gentle stream
      const count = window.innerWidth < 600 ? 30 : 55;
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createPetal(Math.random() * -this.height * 0.8));
      }

      this.animate();
    }

    // Celebratory burst radiating from the broken seal
    burst(count = 65) {
      const originX = this.width / 2;
      const originY = this.height * 0.45;

      for (let i = 0; i < count; i++) {
        const p = this.createPetal(originY);
        p.x = originX;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        p.speedX = Math.cos(angle) * speed;
        p.speedY = Math.sin(angle) * speed - 3;
        this.particles.push(p);
      }
    }

    animate() {
      if (!this.active) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        p.y += p.speedY;
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.75 + p.speedX;
        p.rotation += p.rotSpeed;
        p.flip += p.flipSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.scale(1, Math.cos(p.flip));

        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 0.55, p.size * 0.85, 0, 0, Math.PI * 2);
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(235, 180, 160, 0.4)';
        this.ctx.fill();

        this.ctx.restore();

        // Reset once off-screen: maintain perpetual cascade over celebration photo
        if (p.y > this.height + 25) {
          const maxOngoing = this.width < 600 ? 32 : 48;
          if (this.particles.length > maxOngoing) {
            this.particles.splice(i, 1);
          } else {
            this.particles[i] = this.createPetal(-20);
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  const sakuraCascade = new SakuraCascadeEngine('entry-canvas');

  // Action: Open the Envelope
  let isEnvelopeOpen = false;

  function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    // Force page to the top immediately with zero delay
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 1. Trigger Envelope 3D Fold & Card Rise
    envelope.classList.add('is-opened');

    // 2. Start petals strictly on opening
    sakuraCascade.start();
    sakuraCascade.burst(65);

    // 3. Start song "Bebe Dame" starting at 12s
    if (typeof window.playAmbientSong === 'function') {
      window.playAmbientSong();
    }

    // 4. Smoothly transition to the page much sooner (850ms)
    setTimeout(() => {
      enterWebsite();
    }, 850);
  }

  // Action: Enter the Full Website
  function enterWebsite() {
    // Snap to top immediately before and during reveal
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.body.classList.add('site-entered');
    document.documentElement.classList.add('site-entered');
    overlay.classList.add('fade-out');

    if (typeof window.playAmbientSong === 'function') {
      window.playAmbientSong();
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    setTimeout(() => {
      overlay.style.display = 'none';
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Re-enable smooth scrolling after page is entered
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 50);
    }, 600);
  }

  // Bind Interactions
  envelope.addEventListener('click', () => {
    if (!isEnvelopeOpen) {
      openEnvelope();
    }
  });

  if (sealTrigger) {
    sealTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }
}

/* ═════════════════════════════════════════════════════════════════════
   7. BILINGUAL LANGUAGE CONTROLLER (ENGLISH / ESPAÑOL)
   ═════════════════════════════════════════════════════════════════════ */
function initLanguageSwitcher() {
  const btnEn = document.getElementById('btn-lang-en');
  const btnEs = document.getElementById('btn-lang-es');

  const translations = {
    en: {
      'nav-invitation': 'INVITATION',
      'nav-program': 'PROGRAM',
      'nav-rsvp': 'RSVP',
      'invite-parents': 'ALEJANDRO & MARIANA MORALES',
      'invite-preamble': 'WARMLY INVITE YOU TO CELEBRATE THE',
      'invite-quince': 'Quinceañera',
      'invite-daughter': 'OF THEIR DAUGHTER',
      'invite-date-month': 'JUL',
      'invite-date-day': 'SATURDAY',
      'invite-date-time': 'AT 4:00 PM',
      'invite-date-short': 'JUL 17, 2027',
      'invite-venue': 'THE GRAND BALLROOM • SAN ANTONIO, TX',
      'loc-ceremony-type': 'CEREMONY • 2:00 PM',
      'loc-ceremony-name': 'St. Concord Church',
      'loc-reception-type': 'RECEPTION • 4:30 PM',
      'loc-reception-name': 'The Grand Ballroom',
      'countdown-title': 'COUNTING DOWN TO THE BIG DAY',
      'cd-days': 'DAYS',
      'cd-hours': 'HOURS',
      'cd-mins': 'MINUTES',
      'cd-secs': 'SECONDS',
      'lang-label': 'LANGUAGE / IDIOMA:',
      'program-title': 'PROGRAM',
      'program-mass-title': 'MASS',
      'program-mass-desc': 'ST. CONCORD CHURCH,<br/>SAN ANTONIO, TX',
      'program-entrance-title': 'ENTRANCE',
      'program-entrance-desc': 'THE GRAND BALLROOM,<br/>SAN ANTONIO, TX',
      'tl-btn-location': 'Location',
      'program-waltz-title': 'WALTZ',
      'program-waltz-desc': 'FIRST DANCE &amp;<br/>FATHER-DAUGHTER WALTZ',
      'program-dinner-title': 'DINNER',
      'program-dinner-desc': 'GOURMET CELEBRATORY<br/>DINNER SERVED',
      'program-party-title': 'PARTY',
      'program-party-desc': 'SURPRISE DANCE,<br/>MUSIC &amp; TOAST',
      'program-banda-title': 'BANDA / DJ',
      'program-banda-desc': 'LIVE MUSIC &amp;<br/>OPEN DANCE FLOOR',
      'program-end-title': 'END',
      'program-end-desc': 'FAREWELL &amp;<br/>GOODNIGHT',
      'court-title': 'COURT OF HONOR',
      'court-role-chambelan': 'CHAMBELÁN DE HONOR',
      'court-damas-title': 'DAMAS',
      'court-chambelanes-title': 'CHAMBELANES',
      'rsvp-deadline': 'BY JULY 17',
      'rsvp-instruction': 'CLICK THE RSVP BUTTON AND<br/>LET US KNOW IF YOU CAN MAKE IT',
      'rsvp-thankyou': 'Thank You',
      'modal-title': 'RSVP to Valeria\'s Quinceañera',
      'modal-subtitle': 'Saturday, July 17, 2027 • San Antonio, TX',
      'label-fullname': 'Your Full Name(s) *',
      'label-email': 'Phone or Email *',
      'label-attend': 'Will You Be Attending? *',
      'opt-select': 'Please select...',
      'opt-yes': 'Joyfully Accept (I will be there!)',
      'opt-no': 'Regretfully Decline (Celebrating in spirit)',
      'label-party': 'Total Number of Guests Attending',
      'label-notes': 'Warm Wishes / Song Request for Valeria',
      'btn-submit': 'Confirm RSVP',
      'modal-success-title': 'Thank You So Much!',
      'modal-success-desc': 'Your RSVP has been saved. We cannot wait to celebrate with you!'
    },
    es: {
      'nav-invitation': 'INVITACIÓN',
      'nav-program': 'PROGRAMA',
      'nav-rsvp': 'CONFIRMAR',
      'invite-parents': 'ALEJANDRO Y MARIANA MORALES',
      'invite-preamble': 'TIENEN EL HONOR DE INVITARLE A CELEBRAR LOS',
      'invite-quince': 'Quince Años',
      'invite-daughter': 'DE SU QUERIDA HIJA',
      'invite-date-month': 'JUL',
      'invite-date-day': 'SÁBADO',
      'invite-date-time': 'A LAS 4:00 PM',
      'invite-date-short': '17 JUL, 2027',
      'invite-venue': 'THE GRAND BALLROOM • SAN ANTONIO, TX',
      'loc-ceremony-type': 'CEREMONIA • 2:00 PM',
      'loc-ceremony-name': 'Iglesia St. Concord',
      'loc-reception-type': 'RECEPCIÓN • 4:30 PM',
      'loc-reception-name': 'The Grand Ballroom',
      'countdown-title': 'CUENTA REGRESIVA PARA EL GRAN DÍA',
      'cd-days': 'DÍAS',
      'cd-hours': 'HORAS',
      'cd-mins': 'MINUTOS',
      'cd-secs': 'SEGUNDOS',
      'lang-label': 'IDIOMA / LANGUAGE:',
      'program-title': 'PROGRAMA',
      'program-mass-title': 'MISA DE ACCIÓN DE GRACIAS',
      'program-mass-desc': 'IGLESIA SAN CONCORDIA,<br/>SAN ANTONIO, TX',
      'program-entrance-title': 'RECEPCIÓN Y ENTRADA',
      'program-entrance-desc': 'THE GRAND BALLROOM,<br/>SAN ANTONIO, TX',
      'tl-btn-location': 'Ubicación',
      'program-waltz-title': 'VALS DE HONOR',
      'program-waltz-desc': 'PRIMER BAILE Y<br/>VALS CON SU PADRE',
      'program-dinner-title': 'CENA DE GALA',
      'program-dinner-desc': 'CENA GOURMET Y<br/>BRINDIS EN SU HONOR',
      'program-party-title': 'FIESTA Y BAILE',
      'program-party-desc': 'BAILE SORPRESA,<br/>MÚSICA Y CELEBRACIÓN',
      'program-banda-title': 'BANDA / DJ',
      'program-banda-desc': 'MÚSICA EN VIVO Y<br/>PISTA DE BAILE ABIERTA',
      'program-end-title': 'FIN',
      'program-end-desc': 'DESPEDIDA Y<br/>BUENAS NOCHES',
      'court-title': 'CORTE DE HONOR',
      'court-role-chambelan': 'CHAMBELÁN DE HONOR',
      'court-damas-title': 'DAMAS',
      'court-chambelanes-title': 'CHAMBELANES',
      'rsvp-deadline': 'ANTES DEL 17 DE JULIO',
      'rsvp-instruction': 'HAGA CLIC EN EL BOTÓN Y<br/>CONFIRME SU ASISTENCIA',
      'rsvp-thankyou': 'Muchas Gracias',
      'modal-title': 'Confirmar Asistencia - Quinceañera de Valeria',
      'modal-subtitle': 'Sábado, 17 de Julio, 2027 • San Antonio, TX',
      'label-fullname': 'Nombre y Apellido(s) *',
      'label-email': 'Teléfono o Correo Electrónico *',
      'label-attend': '¿Asistirás a la Celebración? *',
      'opt-select': 'Por favor seleccione...',
      'opt-yes': 'Acepto con Alegría (¡Allí estaré!)',
      'opt-no': 'Declinó con Tristeza (Acompaño en espíritu)',
      'label-party': 'Número Total de Asistentes',
      'label-notes': 'Felicitaciones o Petición de Canción',
      'btn-submit': 'Confirmar Asistencia',
      'modal-success-title': '¡Muchas Gracias!',
      'modal-success-desc': 'Su confirmación ha sido guardada. ¡Esperamos celebrar juntos este gran día!'
    }
  };

  function setLanguage(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
      }
    });

    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
    if (btnEs) btnEs.classList.toggle('active', lang === 'es');
    localStorage.setItem('quince_lang', lang);
  }

  const langBar = document.getElementById('lang-control-bar');
  if (langBar) {
    langBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-pill-btn');
      if (!btn) return;
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        setLanguage(lang);
      }
    });
  }

  if (btnEn) {
    btnEn.addEventListener('click', (e) => {
      e.preventDefault();
      setLanguage('en');
    });
  }
  if (btnEs) {
    btnEs.addEventListener('click', (e) => {
      e.preventDefault();
      setLanguage('es');
    });
  }

  // Restore saved language or default to English
  const savedLang = localStorage.getItem('quince_lang') || 'en';
  if (savedLang !== 'en') {
    setLanguage(savedLang);
  }
}

/* ═════════════════════════════════════════════════════════════════════
   8. QUINCEAÑERA LIVE COUNTDOWN CONTROLLER
   ═════════════════════════════════════════════════════════════════════ */
function initCountdown() {
  const allDays = document.querySelectorAll('.cd-val-days');
  const allHours = document.querySelectorAll('.cd-val-hours');
  const allMins = document.querySelectorAll('.cd-val-mins');
  const allSecs = document.querySelectorAll('.cd-val-secs');

  if (!allDays.length && !document.getElementById('cd-days')) return;

  // Target date for Valeria's Quinceañera: Saturday, July 17, 2027 at 2:00 PM (Ceremony Start)
  const target = new Date(2027, 6, 17, 14, 0, 0); // Month is 0-indexed: 6 = July 17, 2027

  function updateCountdown() {
    const currentTime = new Date().getTime();
    const distance = target.getTime() - currentTime;

    let strDays = '00', strHours = '00', strMins = '00', strSecs = '00';

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      strDays = String(days).padStart(2, '0');
      strHours = String(hours).padStart(2, '0');
      strMins = String(minutes).padStart(2, '0');
      strSecs = String(seconds).padStart(2, '0');
    }

    allDays.forEach(el => el.textContent = strDays);
    allHours.forEach(el => el.textContent = strHours);
    allMins.forEach(el => el.textContent = strMins);
    allSecs.forEach(el => el.textContent = strSecs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ═════════════════════════════════════════════════════════════════════
   9. DEVICE-AWARE MAP DIRECTIONS
   ═════════════════════════════════════════════════════════════════════ */
function initMapLinks() {
  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && !window.MSStream;
  if (isApple) {
    document.querySelectorAll('.timeline-loc-btn[data-apple-url]').forEach(btn => {
      const appleUrl = btn.getAttribute('data-apple-url');
      if (appleUrl) btn.setAttribute('href', appleUrl);
    });
  }
}

/* ═════════════════════════════════════════════════════════════════════
   10. SCROLL-TRIGGERED FADE-IN SYSTEM
   Starting with the countdown, all subsequent sections, text, and images
   fade in gracefully as the user scrolls down the page.
   ═════════════════════════════════════════════════════════════════════ */
function initScrollFadeIn() {
  const elements = document.querySelectorAll('.scroll-fade-in, .scroll-fade-scale');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}


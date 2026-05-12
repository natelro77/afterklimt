/* ============================================
   YARA'S ARCHIVE — JAVASCRIPT
   Every detail is intentional. Nothing is accidental.
   ============================================ */

// ============================================
// LOADING SCREEN
// ============================================
const loadingScreen = document.getElementById('loading-screen');

window.addEventListener('load', () => {
  // Simulate archive restoration
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    // Start ambient effects after loading
    initAmbientPhrases();
    initObservatory();
  }, 3400);
});

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';

  // Spawn gold sparkle
  if (Math.random() < 0.25) {
    createSparkle(mouseX, mouseY);
  }
});

// Smooth cursor ring
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor expand on hover
document.querySelectorAll('a, button, .memory-card, .enter-btn, .secret-object').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('expanded'));
});

// ============================================
// GOLD SPARKLES
// ============================================
function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');

  const size = Math.random() * 4 + 1;
  const tx = (Math.random() - 0.5) * 40 + 'px';
  const ty = (Math.random() - 0.5) * 40 - 20 + 'px';
  const hue = Math.random() > 0.5 ? 'rgba(184,150,90,' : 'rgba(212,184,150,';
  const opacity = Math.random() * 0.8 + 0.2;

  sparkle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: ${hue + opacity + ')' };
    --tx: ${tx};
    --ty: ${ty};
  `;

  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 800);
}

// ============================================
// GALLERY — GOLD PARTICLE CANVAS
// ============================================
const galleryCanvas = document.getElementById('gallery-canvas');
if (galleryCanvas) {
  const ctx = galleryCanvas.getContext('2d');

  function resizeGalleryCanvas() {
    galleryCanvas.width = galleryCanvas.offsetWidth;
    galleryCanvas.height = galleryCanvas.offsetHeight;
  }

  window.addEventListener('resize', resizeGalleryCanvas);
  resizeGalleryCanvas();

  const particles = [];
  const PARTICLE_COUNT = 80;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * galleryCanvas.width,
      y: Math.random() * galleryCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      life: Math.random(),
      decay: Math.random() * 0.003 + 0.001,
    });
  }

  function drawGalleryParticles() {
    ctx.clearRect(0, 0, galleryCanvas.width, galleryCanvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -10) {
        p.x = Math.random() * galleryCanvas.width;
        p.y = galleryCanvas.height + 5;
        p.life = 1;
        p.opacity = Math.random() * 0.6 + 0.1;
        p.vy = -Math.random() * 0.4 - 0.1;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      const alpha = p.opacity * p.life;
      ctx.fillStyle = `rgba(184,150,90,${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(drawGalleryParticles);
  }

  drawGalleryParticles();

  // Draw Klimt-inspired gold swirls
  function drawKlimtTexture() {
    ctx.save();
    ctx.globalAlpha = 0.06;

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const cx = galleryCanvas.width * (0.2 + i * 0.15);
      const cy = galleryCanvas.height * (0.3 + Math.sin(i) * 0.2);
      const r = 60 + i * 30;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, 'rgba(184,150,90,0.4)');
      gradient.addColorStop(1, 'rgba(184,150,90,0)');
      ctx.fillStyle = gradient;
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  drawKlimtTexture();
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger based on index
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay * 150);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((el, i) => {
  el.dataset.delay = i % 5;
  revealObserver.observe(el);
});

// ============================================
// ARCHIVE — MEMORY TYPING SOUND EFFECT
// (subtle synthetic click using Web Audio API)
// ============================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTypingClick() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 800 + Math.random() * 200;
  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
  osc.type = 'square';
  osc.start();
  osc.stop(audioCtx.currentTime + 0.06);
}

// Typing sound on memory card hover
document.querySelectorAll('.memory-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    initAudio();
    // Play 2-3 soft clicks
    for (let i = 0; i < 2; i++) {
      setTimeout(playTypingClick, i * 60);
    }
  });
});

// ============================================
// DO NOT PRESS BUTTON
// ============================================
const dontPressBtn = document.getElementById('do-not-press');
const secretOverlay = document.getElementById('secret-overlay');
const overlayClose = document.getElementById('overlay-close');

if (dontPressBtn) {
  dontPressBtn.addEventListener('click', () => {
    dontPressBtn.classList.add('pressed');
    dontPressBtn.textContent = '— you did —';
    setTimeout(() => {
      secretOverlay.classList.add('active');
    }, 600);
  });
}

if (overlayClose) {
  overlayClose.addEventListener('click', () => {
    secretOverlay.classList.remove('active');
  });
}

// ============================================
// SECRET HIDDEN OBJECT CLICK
// ============================================
const secretObject = document.querySelector('.secret-object');
if (secretObject) {
  secretObject.addEventListener('click', () => {
    showToast('Some archives were never meant to be found.');
  });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');

function showToast(message, duration = 3500) {
  if (!toast) return;
  toastText.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), duration);
}

// Reveal toast after a delay when user enters archive section
const archiveSection = document.getElementById('archive');
if (archiveSection) {
  const archiveObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => showToast('Some files may have been altered.'), 2000);
      archiveObserver.disconnect();
    }
  }, { threshold: 0.3 });
  archiveObserver.observe(archiveSection);
}

// ============================================
// OBSERVATORY — STARS CANVAS
// ============================================
function initObservatory() {
  const starsCanvas = document.getElementById('stars-canvas');
  if (!starsCanvas) return;

  const sCtx = starsCanvas.getContext('2d');

  function resizeStars() {
    starsCanvas.width = starsCanvas.offsetWidth;
    starsCanvas.height = starsCanvas.offsetHeight;
  }

  window.addEventListener('resize', resizeStars);
  resizeStars();

  const stars = [];
  const STAR_COUNT = 200;

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.8 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }

  function drawStars() {
    sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

    const t = Date.now() * 0.001;

    stars.forEach(star => {
      const twinkle = Math.sin(t * star.twinkleSpeed * 100 + star.twinklePhase) * 0.3 + 0.7;
      sCtx.beginPath();
      sCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(255,255,255,${star.opacity * twinkle})`;
      sCtx.fill();

      // Occasional gold star
      if (star.r > 1) {
        sCtx.beginPath();
        sCtx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(184,150,90,${star.opacity * twinkle * 0.08})`;
        sCtx.fill();
      }
    });

    requestAnimationFrame(drawStars);
  }

  drawStars();

  // Constellation lines
  const conCanvas = document.getElementById('constellation-canvas');
  if (conCanvas) {
    const cCtx = conCanvas.getContext('2d');

    function resizeCon() {
      conCanvas.width = conCanvas.offsetWidth;
      conCanvas.height = conCanvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCon);
    resizeCon();

    // Draw subtle constellation
    const conPoints = [
      { x: 0.2, y: 0.3 }, { x: 0.28, y: 0.22 }, { x: 0.38, y: 0.18 },
      { x: 0.48, y: 0.25 }, { x: 0.55, y: 0.35 }, { x: 0.65, y: 0.28 },
      { x: 0.75, y: 0.15 }, { x: 0.82, y: 0.4 },
    ];

    let conOpacity = 0;
    let conVisible = false;

    const obsSection = document.getElementById('observatory');
    if (obsSection) {
      const obsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          conVisible = true;
          obsObserver.disconnect();
        }
      }, { threshold: 0.3 });
      obsObserver.observe(obsSection);
    }

    function drawConstellation() {
      cCtx.clearRect(0, 0, conCanvas.width, conCanvas.height);

      if (conVisible && conOpacity < 0.3) conOpacity += 0.001;

      cCtx.save();
      cCtx.globalAlpha = conOpacity;
      cCtx.strokeStyle = 'rgba(184,150,90,0.4)';
      cCtx.lineWidth = 0.5;

      for (let i = 0; i < conPoints.length - 1; i++) {
        cCtx.beginPath();
        cCtx.moveTo(conPoints[i].x * conCanvas.width, conPoints[i].y * conCanvas.height);
        cCtx.lineTo(conPoints[i+1].x * conCanvas.width, conPoints[i+1].y * conCanvas.height);
        cCtx.stroke();
      }

      conPoints.forEach(p => {
        cCtx.beginPath();
        cCtx.arc(p.x * conCanvas.width, p.y * conCanvas.height, 2, 0, Math.PI * 2);
        cCtx.fillStyle = 'rgba(184,150,90,0.7)';
        cCtx.fill();
      });

      cCtx.restore();
      requestAnimationFrame(drawConstellation);
    }

    drawConstellation();
  }
}

// ============================================
// FLOATING PHRASES — OBSERVATORY
// ============================================
const observatoryPhrases = [
  'some distances never close',
  'you existed in the in-between',
  'I kept looking for your name in unfamiliar skies',
  'two forty-three in the morning, again',
  'memory has very little to do with accuracy',
  'the space between messages grew slowly, then all at once',
  'I still think of the laugh first',
  'certain songs are uninhabitable now',
  'how does someone become a before and after',
];

function initAmbientPhrases() {
  const observatory = document.getElementById('observatory');
  if (!observatory) return;

  function spawnPhrase() {
    const phrase = document.createElement('div');
    phrase.classList.add('float-phrase');
    phrase.textContent = observatoryPhrases[Math.floor(Math.random() * observatoryPhrases.length)];

    const xStart = 10 + Math.random() * 80;
    const yStart = 40 + Math.random() * 50;
    const duration = 12 + Math.random() * 10;
    const drift = (Math.random() - 0.5) * 100 + 'px';

    phrase.style.cssText = `
      left: ${xStart}%;
      top: ${yStart}%;
      animation-duration: ${duration}s;
      animation-delay: 0s;
      --x-drift: ${drift};
    `;

    observatory.appendChild(phrase);
    setTimeout(() => phrase.remove(), duration * 1000);
  }

  // Start spawning when observatory is in view
  const obsEl = document.getElementById('observatory');
  if (obsEl) {
    const obsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        spawnPhrase();
        setInterval(spawnPhrase, 5000);
      }
    }, { threshold: 0.2 });
    obsEl.observe(obsEl);
  }
}

// ============================================
// LISTENING ROOM — FLOATING PARTICLES
// ============================================
const listeningSection = document.getElementById('listening');
if (listeningSection) {
  function spawnListenParticle() {
    const p = document.createElement('div');
    p.classList.add('listen-particle');
    const size = Math.random() * 3 + 1;
    const left = 20 + Math.random() * 60;
    const duration = 6 + Math.random() * 6;
    const delay = Math.random() * 3;
    const drift = (Math.random() - 0.5) * 60 + 'px';

    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${left}%; bottom: ${10 + Math.random() * 20}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --drift: ${drift};
    `;
    listeningSection.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay) * 1000);
  }

  const listenObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      for (let i = 0; i < 5; i++) spawnListenParticle();
      setInterval(spawnListenParticle, 1800);
    }
  }, { threshold: 0.2 });
  listenObserver.observe(listeningSection);
}

// ============================================
// VINYL SPIN TOGGLE
// ============================================
const vinyl = document.querySelector('.vinyl');
const spotifyIframe = document.getElementById('spotify-iframe');

// The vinyl spins by default (CSS). We can toggle it.
if (vinyl) {
  vinyl.addEventListener('click', () => {
    vinyl.classList.toggle('paused');
    showToast(vinyl.classList.contains('paused') ? 'Playback paused.' : 'Press play on the playlist.');
  });
}

// ============================================
// EXIT ROOM — REVEAL ON SCROLL
// ============================================
const exitQuote = document.querySelector('.exit-quote');
if (exitQuote) {
  const exitObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => exitQuote.classList.add('visible'), 500);
      exitObserver.disconnect();
    }
  }, { threshold: 0.4 });
  exitObserver.observe(exitQuote);
}

// ============================================
// AMBIENT AUDIO BUTTON (No actual audio played —
// we use the Web Audio API for subtle tones)
// ============================================
const ambientBtn = document.getElementById('ambient-btn');
let isAmbientPlaying = false;
let ambientInterval = null;
let ambientNodes = [];

function startAmbient() {
  initAudio();
  isAmbientPlaying = true;
  ambientBtn.classList.add('playing');

  // Create a gentle drone
  function createTone(freq, gain) {
    const osc = audioCtx.createOscillator();
    const gNode = audioCtx.createGain();
    osc.connect(gNode);
    gNode.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gNode.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + 2);
    osc.start();
    ambientNodes.push({ osc, gain: gNode });
    return { osc, gain: gNode };
  }

  // A gentle ambient tone cluster
  createTone(110, 0.015);
  createTone(165, 0.01);
  createTone(220, 0.008);
}

function stopAmbient() {
  isAmbientPlaying = false;
  ambientBtn.classList.remove('playing');
  ambientNodes.forEach(({ osc, gain }) => {
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    osc.stop(audioCtx.currentTime + 1.5);
  });
  ambientNodes = [];
}

if (ambientBtn) {
  ambientBtn.addEventListener('click', () => {
    if (isAmbientPlaying) {
      stopAmbient();
      showToast('Silence restored.');
    } else {
      startAmbient();
      showToast('Playing ambient tones.');
    }
  });
}

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================
// GHOST BACKGROUND PHRASES
// ============================================
const ghostPhrases = [
  'she already knew',
  'fragments remain',
  'the gold was always there',
  'quietly, for years',
  'without translation',
  'almost but not quite said aloud',
  'the interval between',
  'room after room',
];

function initGhostPhrases() {
  ghostPhrases.forEach((phrase, i) => {
    const el = document.createElement('div');
    el.classList.add('ghost-phrase');
    el.textContent = phrase;
    el.style.cssText = `
      left: ${5 + (i * 13) % 80}%;
      top: ${10 + (i * 17) % 80}%;
      animation-delay: ${i * 4}s;
      animation-duration: ${18 + i * 3}s;
      font-size: ${0.6 + Math.random() * 0.4}rem;
      transform: rotate(${(Math.random() - 0.5) * 10}deg);
    `;
    document.body.appendChild(el);
  });
}

initGhostPhrases();

// ============================================
// BROKEN LINK EASTER EGG
// ============================================
const brokenLink = document.getElementById('broken-link');
if (brokenLink) {
  let clickCount = 0;
  brokenLink.addEventListener('click', (e) => {
    e.preventDefault();
    clickCount++;
    if (clickCount === 1) {
      brokenLink.textContent = '[link unavailable]';
      showToast('This page no longer exists.');
    } else if (clickCount === 2) {
      brokenLink.textContent = '[recovering...]';
      setTimeout(() => {
        brokenLink.textContent = '"she noticed things no one else did."';
        brokenLink.style.color = 'var(--pale-gold)';
        brokenLink.style.textDecoration = 'none';
      }, 1800);
    }
  });
}

// ============================================
// PAGE TITLE EASTER EGG
// ============================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = 'come back.';
  } else {
    document.title = 'An Archive for Yara';
  }
});

// ============================================
// SCROLL PROGRESS INDICATOR (subtle)
// ============================================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  cursorDot.style.opacity = 0.5 + scrolled * 0.5;
});

// ============================================
// DELAYED REVEAL TOAST — appears once at start
// ============================================
setTimeout(() => {
  showToast('"some things survive only in fragments."');
}, 5000);

// Second toast — appears when user has been on page a while
setTimeout(() => {
  showToast('You are the first person to see this.');
}, 18000);

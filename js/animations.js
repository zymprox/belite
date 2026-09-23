/* ═══════════════════════════════════════════════════════════════
   Animations — Confetti, Fireworks, Balloons, Floating Elements
   Lightweight CSS-driven animations with minimal JS orchestration
   ═══════════════════════════════════════════════════════════════ */

const Animations = (() => {
  /* ─── Color palette for confetti/balloons ───────────────── */
  const COLORS = [
    '#F43F5E', '#EC4899', '#F59E0B', '#EAB308',
    '#FB923C', '#D946EF', '#10B981', '#FF6B6B',
    '#FBBF24', '#A855F7'
  ];

  const CONFETTI_SHAPES = ['square', 'circle', 'strip'];

  /**
   * Burst confetti from the top of the screen
   * @param {number} count - Number of confetti pieces
   * @param {number} duration - How long each piece falls (ms)
   */
  function confetti(count = 60, duration = 3000) {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const shape = CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
      const left = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 200;
      const delay = Math.random() * 800;
      const size = 6 + Math.random() * 10;
      const fallDuration = duration + Math.random() * 1500;

      piece.style.left = `${left}%`;
      piece.style.setProperty('--drift', `${drift}px`);
      piece.style.animationDelay = `${delay}ms`;
      piece.style.animationDuration = `${fallDuration}ms`;
      piece.style.background = color;
      piece.style.width = `${size}px`;

      // Vary shapes
      if (shape === 'circle') {
        piece.style.borderRadius = '50%';
        piece.style.height = `${size}px`;
      } else if (shape === 'strip') {
        piece.style.height = `${size * 2.5}px`;
        piece.style.width = `${size * 0.4}px`;
        piece.style.borderRadius = '2px';
      } else {
        piece.style.height = `${size}px`;
      }

      container.appendChild(piece);

      // Clean up after animation
      setTimeout(() => piece.remove(), fallDuration + delay + 200);
    }
  }

  /**
   * Create a firework burst at a specific position
   * @param {number} x - Center X position (px)
   * @param {number} y - Center Y position (px)
   * @param {number} particles - Number of particles
   */
  function firework(x, y, particles = 30) {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework';

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = (Math.PI * 2 * i) / particles + (Math.random() - 0.5) * 0.3;
      const distance = 80 + Math.random() * 120;
      const fx = Math.cos(angle) * distance;
      const fy = Math.sin(angle) * distance;
      const duration = 600 + Math.random() * 600;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.background = color;
      particle.style.setProperty('--fx', `${fx}px`);
      particle.style.setProperty('--fy', `${fy}px`);
      particle.style.animationDuration = `${duration}ms`;
      particle.style.width = `${4 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;

      container.appendChild(particle);
      setTimeout(() => particle.remove(), duration + 100);
    }
  }

  /**
   * Launch multiple fireworks at random positions
   * @param {number} bursts - Number of firework bursts
   * @param {number} intervalMs - Delay between bursts
   */
  function fireworkShow(bursts = 5, intervalMs = 400) {
    for (let i = 0; i < bursts; i++) {
      setTimeout(() => {
        const x = window.innerWidth * (0.15 + Math.random() * 0.7);
        const y = window.innerHeight * (0.1 + Math.random() * 0.5);
        firework(x, y);
      }, i * intervalMs);
    }
  }

  /**
   * Release balloons from the bottom
   * @param {number} count - Number of balloons
   */
  function releaseBalloons(count = 12) {
    const container = document.getElementById('balloonsContainer');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const left = 5 + Math.random() * 90;
      const delay = Math.random() * 2000;
      const size = 30 + Math.random() * 30;

      balloon.style.left = `${left}%`;
      balloon.style.background = `radial-gradient(circle at 30% 30%, ${color}dd, ${color}88)`;
      balloon.style.width = `${size}px`;
      balloon.style.height = `${size * 1.25}px`;
      balloon.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%';
      balloon.style.animationDelay = `${delay}ms`;

      // Balloon string
      balloon.style.boxShadow = `0 ${size * 1.2}px 0 0 ${color}44`;

      container.appendChild(balloon);

      // Trigger animation
      requestAnimationFrame(() => balloon.classList.add('rise'));

      // Clean up
      setTimeout(() => balloon.remove(), 4500 + delay);
    }
  }

  /**
   * Create floating birthday elements in the welcome section
   */
  function createFloatingElements() {
    const container = document.getElementById('floatingElements');
    if (!container) return;

    const symbols = ['✨', '🎈', '🎁', '🎀', '💫', '🌟'];

    for (let i = 0; i < 15; i++) {
      const el = document.createElement('div');
      el.className = 'floating-el';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.fontSize = `${14 + Math.random() * 20}px`;
      el.style.animationDelay = `${Math.random() * 5}s`;
      el.style.animationDuration = `${8 + Math.random() * 6}s`;
      container.appendChild(el);
    }
  }

  /**
   * Create floating particles for the gate screen
   */
  function createGateParticles() {
    const container = document.getElementById('gateParticles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'gate__particle';

      const size = 4 + Math.random() * 8;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${6 + Math.random() * 8}s`;

      container.appendChild(particle);
    }
  }

  /**
   * Animate the baklol meters (triggered by Intersection Observer)
   */
  function animateMeters() {
    const items = document.querySelectorAll('.meter__item');
    items.forEach((item, index) => {
      setTimeout(() => {
        const fill = item.querySelector('.meter__bar-fill');
        const target = parseInt(item.dataset.target, 10);
        if (fill) {
          fill.style.width = `${target}%`;
        }
      }, index * 300);
    });
  }

  /**
   * Show the easter egg popup
   * @param {string} message - Text to display
   * @param {number} durationMs - How long to show (ms)
   */
  function showEasterEgg(message, durationMs = 2500) {
    const popup = document.getElementById('easterEggPopup');
    if (!popup) return;

    popup.textContent = message;
    popup.classList.add('show');

    setTimeout(() => popup.classList.remove('show'), durationMs);
  }

  // Public API
  return {
    confetti,
    firework,
    fireworkShow,
    releaseBalloons,
    createFloatingElements,
    createGateParticles,
    animateMeters,
    showEasterEgg,
    COLORS
  };
})();

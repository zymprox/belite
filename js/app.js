/* ═══════════════════════════════════════════════════════════════
   App Controller — Happy Birthday Prachi
   Password gate, countdown, section navigation, interactions
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── CONFIGURATION ─────────────────────────────────────────
     Change these values to customize the experience
     ──────────────────────────────────────────────────────────── */
  const CONFIG = {
    // 4-digit password (change this to whatever you want)
    password: '2608',

    // Birthday date (YYYY, Month-1, Day, Hour, Minute)
    // Month is 0-indexed: January = 0, August = 7
    birthdayDate: new Date(2026, 7, 26, 0, 0, 0), // August 26, 2026

    // Max wrong password attempts before the "abe ruk ja" message
    maxAttempts: 5,
  };

  /* ─── STATE ─────────────────────────────────────────────── */
  let wrongAttempts = 0;
  let countdownInterval = null;
  let metersAnimated = false;
  let candlesBlown = false;
  let photoClickCount = 0;

  /* ─── Wrong password messages (escalating roasts) ──────── */
  const WRONG_MESSAGES = [
    'Nope! Think harder... kuch special date soch 🤔',
    'Galat! Itna bhi mushkil nahi hai... ya hai? 😂',
    'Bhai kitna galat dalegi! Ek aur chance de rahi hoon 🤦',
    'Serious? Ab toh hint bhi nahi milega. Last try wisely use kar.',
    'Abe ruk ja bhai, nag madi le ke manega kya... 😤\nChalo ek hint: birthday se related hai.',
    'Haar mat maan! Par thoda dimag bhi laga le... 🧠',
    'Ab toh Google bhi help nahi karega. Seedha birthday girl ko call kar 📞',
    'Itni baar galat dala, phone ka lock bhi sharam se unlock ho gaya hoga 💀',
  ];


  /* ═══════════════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    // Init audio
    AudioController.init();

    // Create gate particles
    Animations.createGateParticles();

    // Setup countdown
    startCountdown();

    // Setup password inputs
    setupPinInputs();

    // Setup enter button
    document.getElementById('gateEnterBtn').addEventListener('click', handlePasswordSubmit);

    // Setup music toggle
    document.getElementById('musicToggle').addEventListener('click', () => AudioController.toggle());

    // Setup scroll observer for section reveals
    setupScrollObserver();

    // Setup roast card flips
    setupRoastCards();

    // Setup wish card expansions
    setupWishCards();

    // Setup cake interaction
    setupCakeInteraction();

    // Setup easter eggs
    setupEasterEggs();

    // Setup scroll progress
    setupScrollProgress();
  });


  /* ═══════════════════════════════════════════════════════════
     COUNTDOWN TIMER
     ═══════════════════════════════════════════════════════════ */
  function startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const diff = CONFIG.birthdayDate - now;

      if (diff <= 0) {
        // Birthday is today or has passed
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('birthdayToday').style.display = 'block';
        if (countdownInterval) clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('countDays').textContent = String(days).padStart(2, '0');
      document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('countMins').textContent = String(mins).padStart(2, '0');
      document.getElementById('countSecs').textContent = String(secs).padStart(2, '0');
    };

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }


  /* ═══════════════════════════════════════════════════════════
     PIN INPUT HANDLING
     ═══════════════════════════════════════════════════════════ */
  function setupPinInputs() {
    const inputs = document.querySelectorAll('.pin-input__digit');

    inputs.forEach((input, index) => {
      // Auto-focus next input on digit entry
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        // Only allow digits
        e.target.value = value.replace(/\D/g, '');

        if (e.target.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }

        // Auto-submit when all 4 digits are entered
        if (index === inputs.length - 1 && e.target.value) {
          handlePasswordSubmit();
        }
      });

      // Handle backspace to go to previous input
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].value = '';
        }

        // Handle Enter key
        if (e.key === 'Enter') {
          handlePasswordSubmit();
        }
      });

      // Handle paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (pasted.length >= 4) {
          for (let i = 0; i < 4; i++) {
            inputs[i].value = pasted[i] || '';
          }
          inputs[3].focus();
          // Auto-submit
          setTimeout(handlePasswordSubmit, 100);
        }
      });
    });

    // Focus first input
    setTimeout(() => inputs[0].focus(), 500);
  }


  /* ═══════════════════════════════════════════════════════════
     PASSWORD VALIDATION
     ═══════════════════════════════════════════════════════════ */
  function handlePasswordSubmit() {
    const inputs = document.querySelectorAll('.pin-input__digit');
    const entered = Array.from(inputs).map(i => i.value).join('');
    const errorEl = document.getElementById('gateError');

    if (entered.length < 4) {
      errorEl.textContent = 'Enter all 4 digits!';
      errorEl.classList.remove('hidden');
      return;
    }

    if (entered === CONFIG.password) {
      // Success — open the site
      unlockGate();
    } else {
      // Wrong password
      wrongAttempts++;

      // Shake animation
      inputs.forEach(input => {
        input.classList.add('shake', 'wrong');
        setTimeout(() => {
          input.classList.remove('shake', 'wrong');
          input.value = '';
        }, 600);
      });

      // Show escalating error message
      const msgIndex = Math.min(wrongAttempts - 1, WRONG_MESSAGES.length - 1);
      errorEl.textContent = WRONG_MESSAGES[msgIndex];
      errorEl.classList.remove('hidden');

      // Re-focus first input after shake
      setTimeout(() => inputs[0].focus(), 700);
    }
  }


  /* ═══════════════════════════════════════════════════════════
     GATE UNLOCK → LOADING SCREEN TRANSITION
     ═══════════════════════════════════════════════════════════ */
  function unlockGate() {
    const gateScreen = document.getElementById('gate-screen');
    const loadingScreen = document.getElementById('loading-screen');

    // Confetti on successful unlock
    Animations.confetti(40, 2500);

    // Fade out gate
    gateScreen.classList.add('hidden');

    // Show loading screen after gate fades
    setTimeout(() => {
      loadingScreen.classList.remove('hidden');
      startLoadingSequence();
    }, 800);
  }


  /* ═══════════════════════════════════════════════════════════
     LOADING / SYSTEM SCAN SEQUENCE
     ═══════════════════════════════════════════════════════════ */
  function startLoadingSequence() {
    const lines = document.querySelectorAll('.terminal__line');
    const warning = document.getElementById('terminalWarning');
    const enterBtn = document.getElementById('loadingEnterBtn');

    // Reveal lines one by one
    lines.forEach((line) => {
      const delay = parseInt(line.dataset.delay, 10) || 0;
      setTimeout(() => line.classList.add('visible'), delay);
    });

    // Show warning after all lines
    const lastDelay = Math.max(...Array.from(lines).map(l => parseInt(l.dataset.delay, 10) || 0));
    setTimeout(() => warning.classList.add('visible'), lastDelay + 800);

    // Show enter button
    setTimeout(() => enterBtn.classList.add('visible'), lastDelay + 1500);

    // Enter button click — transition to main content
    enterBtn.addEventListener('click', () => {
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.classList.add('hidden');

      // Unlock body scroll
      document.body.classList.remove('locked');

      // Start music
      AudioController.play();
      AudioController.showToggle();

      // Create floating elements
      Animations.createFloatingElements();

      // Small confetti burst
      setTimeout(() => Animations.confetti(30, 2000), 300);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     SCROLL OBSERVER — Reveal sections on scroll
     ═══════════════════════════════════════════════════════════ */
  function setupScrollObserver() {
    // Observe timeline cards
    const observerCards = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerCards.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.timeline__card').forEach(card => observerCards.observe(card));

    // Observe friendship lines
    const observerLines = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerLines.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.friendship__line').forEach(line => observerLines.observe(line));

    // Observe final message lines
    document.querySelectorAll('.final__line').forEach(line => observerLines.observe(line));
    const sig = document.getElementById('finalSignature');
    if (sig) observerLines.observe(sig);

    // Observe wish cards
    document.querySelectorAll('.wish__card').forEach(card => observerCards.observe(card));

    // Observe baklol meter section
    const meterSection = document.getElementById('baklol-meter');
    if (meterSection) {
      const meterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !metersAnimated) {
            metersAnimated = true;
            Animations.animateMeters();
            meterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      meterObserver.observe(meterSection);
    }
  }


  /* ═══════════════════════════════════════════════════════════
     ROAST CARDS — Flip on tap/click
     ═══════════════════════════════════════════════════════════ */
  function setupRoastCards() {
    document.querySelectorAll('.roast__card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });

      // Long press easter egg
      let pressTimer;
      const startPress = () => {
        pressTimer = setTimeout(() => {
          Animations.showEasterEgg('Sach toh kadwa hota hai 😂');
        }, 800);
      };
      const endPress = () => clearTimeout(pressTimer);

      card.addEventListener('mousedown', startPress);
      card.addEventListener('mouseup', endPress);
      card.addEventListener('mouseleave', endPress);
      card.addEventListener('touchstart', startPress, { passive: true });
      card.addEventListener('touchend', endPress);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     WISH CARDS — Expand on click
     ═══════════════════════════════════════════════════════════ */
  function setupWishCards() {
    document.querySelectorAll('.wish__card').forEach(card => {
      card.addEventListener('click', () => {
        // Close other expanded cards
        document.querySelectorAll('.wish__card.expanded').forEach(c => {
          if (c !== card) c.classList.remove('expanded');
        });
        card.classList.toggle('expanded');
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     CAKE INTERACTION — Blow candles
     ═══════════════════════════════════════════════════════════ */
  function setupCakeInteraction() {
    const cake = document.getElementById('birthdayCake');
    const instruction = document.getElementById('cakeInstruction');
    const wishText = document.getElementById('wishText');

    if (!cake) return;

    cake.addEventListener('click', () => {
      if (candlesBlown) return;
      candlesBlown = true;

      // Blow out candles one by one
      const flames = document.querySelectorAll('.candle__flame');
      flames.forEach((flame, i) => {
        setTimeout(() => flame.classList.add('blown'), i * 200);
      });

      // Change instruction text
      instruction.textContent = '';

      // Show wish text
      setTimeout(() => {
        wishText.classList.add('visible');
      }, 1200);

      // Show "whatever you wished for" after a pause
      setTimeout(() => {
        wishText.textContent = 'Whatever you wished for, you deserve it.';
      }, 3500);

      // Release balloons + confetti + fireworks
      setTimeout(() => {
        Animations.releaseBalloons(15);
        Animations.confetti(80, 3500);
      }, 1500);

      setTimeout(() => {
        Animations.fireworkShow(8, 300);
      }, 2500);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     EASTER EGGS
     ═══════════════════════════════════════════════════════════ */
  function setupEasterEggs() {
    // Easter egg 1: Click Prachi's photo 5 times
    const photo = document.getElementById('prachiPhoto');
    if (photo) {
      photo.addEventListener('click', () => {
        photoClickCount++;
        if (photoClickCount === 5) {
          Animations.showEasterEgg('Itna mat dekho, blush ho jayegi 😳');
          photoClickCount = 0;
        }
      });
    }

    // Easter egg 2: Click baklol meter → confetti
    const baklolMeter = document.getElementById('baklolMeter');
    if (baklolMeter) {
      baklolMeter.addEventListener('click', () => {
        Animations.confetti(50, 2500);
        Animations.showEasterEgg('Baklol energy overload! System crashed 💥');
        // Hide the hint text
        const hint = document.getElementById('meterHint');
        if (hint) hint.style.display = 'none';
      });
    }
  }


  /* ═══════════════════════════════════════════════════════════
     SCROLL PROGRESS BAR
     ═══════════════════════════════════════════════════════════ */
  function setupScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const progress = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

})();

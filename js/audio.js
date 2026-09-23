/* ═══════════════════════════════════════════════════════════════
   Audio Controller — Birthday Music
   Manages background music with fade in/out and user controls
   ═══════════════════════════════════════════════════════════════ */

const AudioController = (() => {
  let audioElement = null;
  let isPlaying = false;
  let isMuted = false;
  const VOLUME = 0.3; // Keep background music subtle

  /**
   * Initialize the audio controller
   * Looks for audio file in assets/audio/
   * Supported files: birthday.mp3, birthday.ogg, birthday.wav
   */
  function init() {
    audioElement = new Audio();
    audioElement.loop = true;
    audioElement.volume = 0;
    audioElement.preload = 'auto';

    // Try to load audio file — will silently fail if not present
    // User can add any of these files
    const audioSources = [
      'assets/audio/birthday.mp3',
      'assets/audio/birthday.ogg',
      'assets/audio/birthday.wav',
      'assets/audio/music.mp3',
    ];

    // Try the first available source
    audioElement.src = audioSources[0];

    audioElement.addEventListener('error', () => {
      // Audio file not found — that's OK, the site works without it
      console.log('Audio: No music file found in assets/audio/. The site works without it.');
      audioElement = null;
    });

    audioElement.addEventListener('canplaythrough', () => {
      console.log('Audio: Music file loaded and ready.');
    });
  }

  /**
   * Start playing music with a fade-in effect
   */
  function play() {
    if (!audioElement || isPlaying) return;

    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        fadeIn();
        updateToggleUI(true);
      }).catch(() => {
        // Autoplay blocked — will be retried on next user interaction
        console.log('Audio: Autoplay blocked. Will play on next interaction.');
      });
    }
  }

  /**
   * Pause music with fade-out
   */
  function pause() {
    if (!audioElement || !isPlaying) return;

    fadeOut(() => {
      audioElement.pause();
      isPlaying = false;
      updateToggleUI(false);
    });
  }

  /**
   * Toggle play/pause
   */
  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  /**
   * Fade audio volume in
   */
  function fadeIn(durationMs = 1000) {
    if (!audioElement) return;

    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = VOLUME / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audioElement.volume = Math.min(volumeStep * currentStep, VOLUME);
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
  }

  /**
   * Fade audio volume out
   * @param {Function} callback - Called after fade completes
   */
  function fadeOut(callback, durationMs = 500) {
    if (!audioElement) {
      if (callback) callback();
      return;
    }

    const steps = 15;
    const stepTime = durationMs / steps;
    const startVolume = audioElement.volume;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      audioElement.volume = Math.max(startVolume - volumeStep * currentStep, 0);
      if (currentStep >= steps) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, stepTime);
  }

  /**
   * Update the music toggle button UI
   * @param {boolean} playing - Whether music is currently playing
   */
  function updateToggleUI(playing) {
    const btn = document.getElementById('musicToggle');
    if (!btn) return;

    if (playing) {
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Pause music');
    } else {
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Play music');
    }
  }

  /**
   * Show the music toggle button
   */
  function showToggle() {
    const btn = document.getElementById('musicToggle');
    if (btn) btn.classList.add('show');
  }

  /**
   * Check if audio is available
   * @returns {boolean}
   */
  function isAvailable() {
    return audioElement !== null;
  }

  return {
    init,
    play,
    pause,
    toggle,
    showToggle,
    isAvailable,
    get isPlaying() { return isPlaying; }
  };
})();

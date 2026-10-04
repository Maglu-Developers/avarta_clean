/**
 * AVĀRTĀ ® — Global Audio Manager (Singleton)
 * Controls background soundtrack "The Sound of Magic (2022) - Opening Theme.mp3"
 * Continuously plays on a seamless loop across all pages, categories, and route switches without stopping.
 */
(function (window) {
  'use strict';

  const AUDIO_SOURCES = [
    'audio/The Sound of Magic (2022) - Opening Theme.mp3',
    'audio/The Sound of Magic - Opening Theme.mp3',
    'audio/sound_of_magic.mp3',
    'audio/fantasy.mp3',
    'audio/mystical.mp3',
    'assets/audio/ambient.mp3'
  ];

  const TARGET_VOLUME = 0.85;

  class AudioManager {
    constructor() {
      if (window.AudioManagerInstance) {
        return window.AudioManagerInstance;
      }

      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.volume = TARGET_VOLUME;

      this.sourceIdx = 0;
      this.isStarted = false;
      this.isIntroPlaying = true;

      this.initSource();
      this.bindEvents();
      this.bindInteractionListener();

      window.AudioManagerInstance = this;
    }

    initSource() {
      if (this.sourceIdx >= AUDIO_SOURCES.length) return;
      this.audio.src = AUDIO_SOURCES[this.sourceIdx];

      // Sync playback position from sessionStorage across page transitions
      const savedPos = sessionStorage.getItem('avarta_bg_audio_pos');
      if (savedPos && !isNaN(parseFloat(savedPos))) {
        try {
          this.audio.currentTime = parseFloat(savedPos);
        } catch (e) {}
      }
    }

    bindEvents() {
      this.audio.addEventListener('error', () => {
        this.sourceIdx++;
        if (this.sourceIdx < AUDIO_SOURCES.length) {
          this.initSource();
          this.play();
        }
      });

      // Save position periodically to sessionStorage for seamless cross-page navigation
      setInterval(() => {
        if (this.audio && !this.audio.paused && this.audio.currentTime > 0) {
          sessionStorage.setItem('avarta_bg_audio_pos', this.audio.currentTime.toFixed(2));
          sessionStorage.setItem('avarta_bg_audio_playing', 'true');
        }
      }, 300);

      window.addEventListener('beforeunload', () => {
        if (this.audio && !this.audio.paused) {
          sessionStorage.setItem('avarta_bg_audio_pos', this.audio.currentTime.toFixed(2));
          sessionStorage.setItem('avarta_bg_audio_playing', 'true');
        }
      });
    }

    // Called when intro video completely finishes or is skipped
    onIntroFinished() {
      this.isIntroPlaying = false;
      this.play();
    }

    play() {
      const isCrossPageNav = sessionStorage.getItem('avarta_bg_audio_playing') === 'true';
      if (this.isIntroPlaying && !isCrossPageNav) {
        return; // Strictly do NOT play during intro video
      }

      this.isStarted = true;
      this.audio.volume = TARGET_VOLUME;

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          sessionStorage.setItem('avarta_bg_audio_playing', 'true');
        }).catch(err => {
          console.warn('[AudioManager] Autoplay blocked, waiting for user interaction:', err);
          this.bindInteractionListener();
        });
      }
    }

    bindInteractionListener() {
      if (this.hasInteractionListener) return;
      this.hasInteractionListener = true;
      const self = this;
      function startOnInteraction() {
        if (!self.isIntroPlaying || sessionStorage.getItem('avarta_bg_audio_playing') === 'true') {
          self.play();
        }
        ['click', 'touchstart', 'keydown', 'pointerdown', 'wheel'].forEach(evt => {
          document.removeEventListener(evt, startOnInteraction);
          window.removeEventListener(evt, startOnInteraction);
        });
      }
      ['click', 'touchstart', 'keydown', 'pointerdown', 'wheel'].forEach(evt => {
        document.addEventListener(evt, startOnInteraction, { once: true, passive: true });
        window.addEventListener(evt, startOnInteraction, { once: true, passive: true });
      });
    }
  }

  // Create singleton instance
  const manager = new AudioManager();
  window.AudioManager = manager;

  window.avartaBgAudio = {
    play: function () { manager.play(); },
    pause: function () {}, // Intentionally disabled so background music plays continuously
    stop: function () {}   // Intentionally disabled so background music plays continuously
  };

  // If music was already playing in session (e.g. navigation to categories.html), play immediately
  if (sessionStorage.getItem('avarta_bg_audio_playing') === 'true') {
    manager.isIntroPlaying = false;
    manager.play();
  }
})(window);

/**
 * AVĀRTĀ ® — Global Audio Manager (Singleton)
 * Primary Soundtrack: "assets/The Sound of Magic (2022) - Opening Theme.mp3.mpeg"
 * Continuously plays on a seamless loop across all pages, landing page, intro video, and route switches.
 */
(function (window) {
  'use strict';

  const AUDIO_SOURCES = [
    'assets/The Sound of Magic (2022) - Opening Theme.mp3.mpeg',
    'assets/The%20Sound%20of%20Magic%20(2022)%20-%20Opening%20Theme.mp3.mpeg',
    'audio/The Sound of Magic (2022) - Opening Theme.mp3',
    'audio/The%20Sound%20of%20Magic%20(2022)%20-%20Opening%20Theme.mp3',
    'audio/hero section.mpeg',
    'audio/mystical.mp3',
    'audio/fantasy.mp3'
  ];

  const TARGET_VOLUME = 0.85;

  class GlobalAudioManager {
    constructor() {
      if (window.AudioManagerInstance) {
        return window.AudioManagerInstance;
      }

      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.volume = TARGET_VOLUME;
      this.audio.preload = 'auto';

      this.sourceIdx = 0;
      this.isPlaying = false;
      this.hasInteractionListener = false;

      this.initSource();
      this.bindEvents();
      this.bindInteractionListener();
      this.attemptPlay();

      window.AudioManagerInstance = this;
    }

    initSource() {
      if (this.sourceIdx >= AUDIO_SOURCES.length) return;
      this.audio.src = AUDIO_SOURCES[this.sourceIdx];

      // Restore playback position from sessionStorage for seamless cross-page navigation
      const savedPos = sessionStorage.getItem('avarta_bg_audio_pos');
      if (savedPos && !isNaN(parseFloat(savedPos))) {
        try {
          this.audio.currentTime = parseFloat(savedPos);
        } catch (e) {}
      }
    }

    bindEvents() {
      // Fallback to next source if error occurs loading audio
      this.audio.addEventListener('error', () => {
        this.sourceIdx++;
        if (this.sourceIdx < AUDIO_SOURCES.length) {
          this.initSource();
          this.attemptPlay();
        }
      });

      // Save position periodically to sessionStorage for seamless cross-page navigation
      setInterval(() => {
        if (this.audio && !this.audio.paused && this.audio.currentTime > 0) {
          sessionStorage.setItem('avarta_bg_audio_pos', this.audio.currentTime.toFixed(2));
          sessionStorage.setItem('avarta_bg_audio_active', 'true');
        }
      }, 250);

      window.addEventListener('beforeunload', () => {
        if (this.audio && !this.audio.paused) {
          sessionStorage.setItem('avarta_bg_audio_pos', this.audio.currentTime.toFixed(2));
          sessionStorage.setItem('avarta_bg_audio_active', 'true');
        }
      });
    }

    attemptPlay() {
      this.audio.volume = TARGET_VOLUME;
      const promise = this.audio.play();

      if (promise !== undefined) {
        promise.then(() => {
          this.isPlaying = true;
          sessionStorage.setItem('avarta_bg_audio_active', 'true');
        }).catch(err => {
          console.warn('[AVĀRTĀ Audio Engine] Autoplay pending user interaction:', err);
          this.bindInteractionListener();
        });
      }
    }

    play() {
      this.attemptPlay();
    }

    onIntroFinished() {
      // Keep music playing continuously (no restart or pause)
      this.attemptPlay();
    }

    bindInteractionListener() {
      if (this.hasInteractionListener) return;
      this.hasInteractionListener = true;
      const self = this;

      function unlockAudio() {
        self.attemptPlay();
        ['click', 'touchstart', 'keydown', 'pointerdown', 'wheel', 'scroll', 'mousemove'].forEach(evt => {
          document.removeEventListener(evt, unlockAudio);
          window.removeEventListener(evt, unlockAudio);
        });
      }

      ['click', 'touchstart', 'keydown', 'pointerdown', 'wheel', 'scroll', 'mousemove'].forEach(evt => {
        document.addEventListener(evt, unlockAudio, { once: true, passive: true });
        window.addEventListener(evt, unlockAudio, { once: true, passive: true });
      });
    }
  }

  // Create singleton instance immediately
  const manager = new GlobalAudioManager();
  window.AudioManager = manager;

  // Global window handle for backward compatibility with existing project scripts
  window.avartaBgAudio = {
    play: function () { manager.play(); },
    pause: function () {}, // Continuous loop throughout entire website
    stop: function () {}   // Continuous loop throughout entire website
  };

  // Attempt play on DOMReady & load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    manager.attemptPlay();
  } else {
    document.addEventListener('DOMContentLoaded', function () { manager.attemptPlay(); });
    window.addEventListener('load', function () { manager.attemptPlay(); });
  }
})(window);

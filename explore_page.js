/**
 * AVĀRTĀ — 3D SPATIAL EXPLORE PANORAMA CONTROLLER
 * Smooth mouse tracking, 3D cylindrical perspective tilt, and routing.
 */

(function (global) {
  'use strict';

  class ExplorePageController {
    constructor() {
      this._initElements();
      this._bindEvents();
    }

    _initElements() {
      this.view = document.getElementById('explore-view');
      this.track = document.getElementById('exploreSpatialTrack');
      this.cards = document.querySelectorAll('.explore-spatial-card');
    }

    _bindEvents() {
      if (!this.view || !this.track) return;

      // Mouse Parallax 3D Perspective Tilt on Desktop
      let rafId = null;
      let targetRotY = 0;
      let targetRotX = 0;
      let currentRotY = 0;
      let currentRotX = 0;

      const onMouseMove = (e) => {
        if (window.innerWidth < 992) return;
        const rect = this.view.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        targetRotY = mouseX * 14; // Max 14 deg tilt
        targetRotX = -mouseY * 8;  // Max 8 deg vertical pitch

        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      };

      const updateTilt = () => {
        const ease = 0.08;
        currentRotY += (targetRotY - currentRotY) * ease;
        currentRotX += (targetRotX - currentRotX) * ease;

        if (this.track) {
          this.track.style.transform = `rotateY(${currentRotY.toFixed(2)}deg) rotateX(${currentRotX.toFixed(2)}deg)`;
        }

        if (Math.abs(targetRotY - currentRotY) > 0.02 || Math.abs(targetRotX - currentRotX) > 0.02) {
          rafId = requestAnimationFrame(updateTilt);
        } else {
          rafId = null;
        }
      };

      this.view.addEventListener('mousemove', onMouseMove, { passive: true });
      this.view.addEventListener('mouseleave', () => {
        targetRotY = 0;
        targetRotX = 0;
        if (!rafId) rafId = requestAnimationFrame(updateTilt);
      });

      // Bind Card Clicks
      if (this.cards) {
        this.cards.forEach((card) => {
          card.addEventListener('click', (e) => {
            const href = card.getAttribute('href');
            if (href && href.startsWith('#')) {
              e.preventDefault();
              const route = href.replace('#', '');
              if (typeof window.avartaNavigate === 'function') {
                window.avartaNavigate(route);
              } else {
                window.location.hash = href;
              }
            }
          });
        });
      }

      // ── Card Selection on Hover ──
      if (this.cards && this.track) {
        this.cards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            // Deselect all, then select the hovered card
            this.cards.forEach((c) => c.classList.remove('is-selected'));
            card.classList.add('is-selected');
            this.track.classList.add('has-selection');
          });

          card.addEventListener('mouseleave', () => {
            card.classList.remove('is-selected');
            // Only clear has-selection if no card remains selected
            const anySelected = [...this.cards].some((c) => c.classList.contains('is-selected'));
            if (!anySelected) this.track.classList.remove('has-selection');
          });
        });

        // Clear selection when cursor leaves the whole track
        this.track.addEventListener('mouseleave', () => {
          this.cards.forEach((c) => c.classList.remove('is-selected'));
          this.track.classList.remove('has-selection');
        });
      }
    }
  }

  // Initialize once DOM is ready
  function init() {
    window.avartaExplorePage = new ExplorePageController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);

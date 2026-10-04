/**
 * AVĀRTĀ — BEYOND AVĀRTĀ (3D FLASHCARD SWIPE CAROUSEL)
 * Single-screen view at a glance, smooth step swipe left/right physics, zero page scroll.
 */

(function (global) {
  'use strict';

  const MUSEUMS_DATABASE = [
    {
      id: 'louvre',
      name: 'Louvre Museum',
      city: 'Paris',
      country: 'France',
      region: 'Europe',
      officialUrl: 'https://www.louvre.fr/en',
      desc: 'The world\'s most visited art museum, home to the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace.',
      bgImage: 'louvre_museum.jpg'
    },
    {
      id: 'met',
      name: 'The Metropolitan Museum of Art',
      city: 'New York',
      country: 'United States',
      region: 'Americas',
      officialUrl: 'https://www.metmuseum.org',
      desc: 'Over 5,000 years of art from every corner of the world, situated along Fifth Avenue at the edge of Central Park.',
      bgImage: 'metropolitan_museum.jpg'
    },
    {
      id: 'moma',
      name: 'Museum of Modern Art (MoMA)',
      city: 'New York',
      country: 'United States',
      region: 'Americas',
      officialUrl: 'https://www.moma.org',
      desc: 'Pioneering institution celebrating modern and contemporary art, architecture, photography, and design.',
      bgImage: 'moma_museum.jpg'
    },
    {
      id: 'tate',
      name: 'Tate',
      city: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      officialUrl: 'https://www.tate.org.uk',
      desc: 'A family of four world-renowned galleries including Tate Modern on Bankside and Tate Britain on Millbank.',
      bgImage: 'tate_museum.jpg'
    },
    {
      id: 'rijksmuseum',
      name: 'Rijksmuseum',
      city: 'Amsterdam',
      country: 'Netherlands',
      region: 'Europe',
      officialUrl: 'https://www.rijksmuseum.nl/en',
      desc: 'The national museum of the Netherlands dedicated to Dutch masterworks by Rembrandt, Vermeer, and Frans Hals.',
      bgImage: 'rijksmuseum.jpg'
    },
    {
      id: 'uffizi',
      name: 'Uffizi Galleries',
      city: 'Florence',
      country: 'Italy',
      region: 'Europe',
      officialUrl: 'https://www.uffizi.it/en',
      desc: 'The cradle of the Italian Renaissance featuring Botticelli’s Birth of Venus, Michelangelo, Raphael, and Da Vinci.',
      bgImage: 'uffizi_galleries.jpg'
    },
    {
      id: 'prado',
      name: 'Museo del Prado',
      city: 'Madrid',
      country: 'Spain',
      region: 'Europe',
      officialUrl: 'https://www.museodelprado.es/en',
      desc: 'Spain\'s premier national art museum housing the definitive masterpieces of Velázquez, Goya, and El Greco.',
      bgImage: 'prado_museum.jpg'
    },
    {
      id: 'national_gallery',
      name: 'National Gallery',
      city: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      officialUrl: 'https://www.nationalgallery.org.uk',
      desc: 'Over 2,300 paintings spanning Western European art from the mid-13th century to 1900 in Trafalgar Square.',
      bgImage: 'national_gallery.jpg'
    },
    {
      id: 'artic',
      name: 'Art Institute of Chicago',
      city: 'Chicago',
      country: 'United States',
      region: 'Americas',
      officialUrl: 'https://www.artic.edu',
      desc: 'Renowned for one of the world\'s largest permanent collections of Impressionist and Post-Impressionist art.',
      bgImage: 'artic_museum.jpg'
    },
    {
      id: 'guggenheim',
      name: 'Guggenheim Museum',
      city: 'New York',
      country: 'United States',
      region: 'Americas',
      officialUrl: 'https://www.guggenheim.org',
      desc: 'Frank Lloyd Wright\'s architectural marvel housing world-class modern masterpieces along its spiral ramp.',
      bgImage: 'guggenheim_museum.jpg'
    },
    {
      id: 'orsay',
      name: 'Musée d\'Orsay',
      city: 'Paris',
      country: 'France',
      region: 'Europe',
      officialUrl: 'https://www.musee-orsay.fr/en',
      desc: 'Housed in a grand Beaux-Arts railway station, showcasing Impressionist and Post-Impressionist French masterpieces.',
      bgImage: 'orsay_museum.jpg'
    },
    {
      id: 'vatican',
      name: 'Vatican Museums',
      city: 'Vatican City',
      country: 'Vatican City',
      region: 'Europe',
      officialUrl: 'https://www.museivaticani.va',
      desc: 'Monumental papal collections including the Sistine Chapel frescoes and Raphael Rooms.',
      bgImage: 'vatican_museums.jpg'
    }
  ];

  class BeyondAvartaCarouselController {
    constructor() {
      this.museums = MUSEUMS_DATABASE;
      this.filteredMuseums = [...this.museums];

      // Progress & Physics
      this.targetProgress = 0;
      this.currentProgress = 0;
      this.autoPlaySpeed = 0.001; // gentle continuous drift
      this.isAutoPlaying = true;
      this.idleTimeout = null;
      this.lastWheelTime = 0;

      // Pointer Swipe Physics
      this.isDragging = false;
      this.startX = 0;
      this.lastX = 0;
      this.startProgress = 0;
      this.cardSpacing = 310;

      // Canvas Particles
      this.particles = [];

      this._initElements();
      this._initParticles();
      this._bindEvents();
      this.renderCarousel();
      this.startAnimationLoop();
    }

    _initElements() {
      this.viewport = document.getElementById('beyondAvartaViewport');
      this.trackContainer = document.getElementById('beyondAvartaTrack');
      this.indicatorsContainer = document.getElementById('beyondAvartaIndicators');
      this.prevBtn = document.getElementById('beyondAvartaPrevBtn');
      this.nextBtn = document.getElementById('beyondAvartaNextBtn');
      this.particleCanvas = document.getElementById('beyondParticlesCanvas');

      this._updateResponsiveSpacing();
      window.addEventListener('resize', () => {
        this._updateResponsiveSpacing();
        this._resizeCanvas();
      });
    }

    _updateResponsiveSpacing() {
      const w = window.innerWidth;
      if (w <= 600) {
        this.cardSpacing = 220;
      } else if (w <= 900) {
        this.cardSpacing = 260;
      } else {
        this.cardSpacing = 310;
      }
    }

    _bindEvents() {
      // Floating Arrow Controls
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.pauseAutoPlay();
          this.targetProgress = Math.round(this.targetProgress) - 1;
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.pauseAutoPlay();
          this.targetProgress = Math.round(this.targetProgress) + 1;
        });
      }

      // Pointer Swipe Events (Touch & Drag)
      if (this.viewport) {
        this.viewport.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.viewport.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.viewport.addEventListener('pointerup', (e) => this.onPointerUp(e));
        this.viewport.addEventListener('pointercancel', (e) => this.onPointerUp(e));

        // Hover pauses auto-drift
        this.viewport.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.viewport.addEventListener('mouseleave', () => this.resumeAutoPlayLater());

        // Mouse Wheel / Touchpad Horizontal Swipe
        this.viewport.addEventListener('wheel', (e) => {
          const now = Date.now();
          if (now - this.lastWheelTime < 350) return;

          const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
          if (Math.abs(delta) > 15) {
            this.lastWheelTime = now;
            this.pauseAutoPlay();
            if (delta > 0) {
              this.targetProgress = Math.round(this.targetProgress) + 1;
            } else {
              this.targetProgress = Math.round(this.targetProgress) - 1;
            }
            this.resumeAutoPlayLater();
          }
        }, { passive: true });
      }

      // Keyboard Left / Right Navigation
      document.addEventListener('keydown', (e) => {
        const beyondView = document.getElementById('beyond-avarta-view');
        if (!beyondView || !beyondView.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
          this.pauseAutoPlay();
          this.targetProgress = Math.round(this.targetProgress) - 1;
        } else if (e.key === 'ArrowRight') {
          this.pauseAutoPlay();
          this.targetProgress = Math.round(this.targetProgress) + 1;
        }
      });
    }

    onPointerDown(e) {
      if (e.target.closest('a') || e.target.closest('button')) return;

      this.isDragging = true;
      this.startX = e.clientX;
      this.lastX = e.clientX;
      this.startProgress = this.targetProgress;
      this.pauseAutoPlay();

      if (this.viewport) {
        this.viewport.classList.add('is-dragging');
        try {
          this.viewport.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    onPointerMove(e) {
      if (!this.isDragging) return;

      this.lastX = e.clientX;
      const deltaX = e.clientX - this.startX;

      // Real-time tracking during drag
      this.targetProgress = this.startProgress - (deltaX / this.cardSpacing);
    }

    onPointerUp(e) {
      if (!this.isDragging) return;

      this.isDragging = false;
      if (this.viewport) {
        this.viewport.classList.remove('is-dragging');
        try {
          this.viewport.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }

      const totalDeltaX = this.lastX - this.startX;

      // Flashcard swipe logic: threshold 35px triggers clean step swipe left or right
      if (totalDeltaX < -35) {
        this.targetProgress = Math.round(this.startProgress) + 1;
      } else if (totalDeltaX > 35) {
        this.targetProgress = Math.round(this.startProgress) - 1;
      } else {
        this.targetProgress = Math.round(this.targetProgress);
      }

      this.resumeAutoPlayLater();
    }

    pauseAutoPlay() {
      this.isAutoPlaying = false;
      if (this.idleTimeout) clearTimeout(this.idleTimeout);
    }

    resumeAutoPlayLater() {
      if (this.idleTimeout) clearTimeout(this.idleTimeout);
      this.idleTimeout = setTimeout(() => {
        this.isAutoPlaying = true;
      }, 4000);
    }

    renderCarousel() {
      if (!this.trackContainer) return;

      const itemsHtml = this.filteredMuseums.map((museum, idx) => `
        <article class="museum-3d-card" data-index="${idx}" data-id="${museum.id}">
          <div class="museum-card-bg" style="background-image: url('${museum.bgImage}')"></div>
          <div class="museum-card-overlay"></div>
          <div class="museum-card-content">
            <div class="museum-card-top">
              <span class="museum-region-tag">${museum.region}</span>
            </div>
            <div class="museum-card-bottom">
              <h2 class="museum-name">${museum.name}</h2>
              <div class="museum-location">
                <svg class="museum-location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>${museum.city}, ${museum.country}</span>
              </div>
              <p class="museum-short-desc">${museum.desc}</p>
              <div class="museum-card-footer">
                <a href="${museum.officialUrl}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="museum-website-btn" 
                   aria-label="Visit official website of ${museum.name}">
                  <span>VISIT WEBSITE</span>
                  <span class="btn-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      `).join('');

      this.trackContainer.innerHTML = itemsHtml;

      // Click card to center
      const cards = this.trackContainer.querySelectorAll('.museum-3d-card');
      cards.forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;

          const idx = parseInt(card.getAttribute('data-index'), 10);
          if (!isNaN(idx)) {
            const N = this.filteredMuseums.length;
            let diff = idx - (this.targetProgress % N);
            while (diff < -N / 2) diff += N;
            while (diff > N / 2) diff -= N;

            this.pauseAutoPlay();
            this.targetProgress += diff;
            this.resumeAutoPlayLater();
          }
        });
      });

      this.renderIndicators();
    }

    renderIndicators() {
      if (!this.indicatorsContainer) return;
      const N = this.filteredMuseums.length;
      if (N <= 1) {
        this.indicatorsContainer.innerHTML = '';
        return;
      }

      this.indicatorsContainer.innerHTML = Array.from({ length: N }).map((_, idx) => `
        <div class="beyond-indicator-dot${idx === 0 ? ' active' : ''}" data-index="${idx}"></div>
      `).join('');

      const dots = this.indicatorsContainer.querySelectorAll('.beyond-indicator-dot');
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-index'), 10);
          if (!isNaN(idx)) {
            const currentNorm = (Math.round(this.targetProgress) % N + N) % N;
            let diff = idx - currentNorm;
            while (diff < -N / 2) diff += N;
            while (diff > N / 2) diff -= N;

            this.pauseAutoPlay();
            this.targetProgress += diff;
            this.resumeAutoPlayLater();
          }
        });
      });
    }

    updateIndicators(activeNormIndex) {
      if (!this.indicatorsContainer) return;
      const dots = this.indicatorsContainer.querySelectorAll('.beyond-indicator-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeNormIndex);
      });
    }

    startAnimationLoop() {
      const loop = () => {
        // Continuous slow drift when idle
        if (this.isAutoPlaying && !this.isDragging && this.filteredMuseums.length > 1) {
          this.targetProgress += this.autoPlaySpeed;
        }

        // Lerp physics smoothing
        const diff = this.targetProgress - this.currentProgress;
        this.currentProgress += diff * 0.095;

        this.updateCardTransforms();
        this.updateParticles();

        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    updateCardTransforms() {
      if (!this.trackContainer) return;
      const cards = Array.from(this.trackContainer.querySelectorAll('.museum-3d-card'));
      const N = this.filteredMuseums.length;
      if (N === 0) return;

      const activeNormIdx = (Math.round(this.currentProgress) % N + N) % N;
      this.updateIndicators(activeNormIdx);

      cards.forEach((card, i) => {
        let dist = i - this.currentProgress;

        // Wrap calculation
        while (dist < -N / 2) dist += N;
        while (dist > N / 2) dist -= N;

        const absDist = Math.abs(dist);

        // 3D Matrix Math calculations
        const translateX = dist * this.cardSpacing;
        const scale = Math.max(0.62, 1 - absDist * 0.17);
        const translateZ = Math.max(-420, -absDist * 150);
        const rotateY = Math.max(-28, Math.min(28, dist * -11));

        // Filters & Opacity
        const opacity = Math.max(0, 1 - Math.pow(absDist / 2.7, 2));
        const brightness = Math.max(0.4, 1 - absDist * 0.26);
        const zIndex = Math.round(100 - absDist * 10);

        card.style.transform = `translate3d(${translateX.toFixed(2)}px, 0px, ${translateZ.toFixed(2)}px) scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1) rotateY(${rotateY.toFixed(2)}deg)`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = `brightness(${brightness.toFixed(2)})`;
        card.style.zIndex = zIndex;

        if (absDist < 0.45) {
          card.classList.add('is-center');
        } else {
          card.classList.remove('is-center');
        }
      });
    }

    /* Floating Ambient Gold Dust Particles Engine */
    _initParticles() {
      if (!this.particleCanvas) return;
      this.ctx = this.particleCanvas.getContext('2d');
      this._resizeCanvas();

      this.particles = Array.from({ length: 35 }).map(() => ({
        x: Math.random() * this.particleCanvas.width,
        y: Math.random() * this.particleCanvas.height,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.2,
        speedY: -(Math.random() * 0.22 + 0.06),
        speedX: (Math.random() - 0.5) * 0.12,
        twinkle: Math.random() * 0.02 + 0.005
      }));
    }

    _resizeCanvas() {
      if (!this.particleCanvas) return;
      this.particleCanvas.width = this.particleCanvas.offsetWidth || window.innerWidth;
      this.particleCanvas.height = this.particleCanvas.offsetHeight || (window.innerHeight - 140);
    }

    updateParticles() {
      if (!this.ctx || !this.particleCanvas) return;
      const w = this.particleCanvas.width;
      const h = this.particleCanvas.height;

      this.ctx.clearRect(0, 0, w, h);

      this.particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.twinkle) * 0.008;

        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const alpha = Math.max(0.1, Math.min(0.85, p.alpha));

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(223, 194, 130, ${alpha})`;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#dfc282';
        this.ctx.fill();
      });
    }
  }

  function init() {
    window.avartaBeyondDirectory = new BeyondAvartaCarouselController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);

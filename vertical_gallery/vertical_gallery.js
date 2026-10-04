/**
 * VERTICAL SLIDE GALLERY — COMPONENT CONTROLLER
 * Fully isolated, self-contained module.
 * 
 * Features:
 * - Ambient full-bleed blurred backdrop with smooth crossfade
 * - Centered crisp inset cards with stacked deck peeking effect
 * - GPU-accelerated ease-out transforms (scale, translateY, opacity)
 * - Scoped gesture handling (vertical mouse wheel, touch swipe, pointer drag, keyboard)
 * - Synchronized 3-part caption row (index, project title/category, year)
 * - Static left and right panels unaffected by slide transitions
 */

(function (global) {
  'use strict';

  // Default curated art dataset if none provided
  const DEFAULT_ITEMS = [
    {
      image: './assets/paintings/starry_night.jpg',
      title: 'The Starry Night',
      category: 'Post-Impressionism · Masterwork',
      tag: 'Post-Impressionism',
      year: '1889',
      description: 'A swirling nocturnal visionary masterwork capturing celestial motion and deep spiritual longing from the Saint-Paul asylum.',
      profile: {
        label: 'Meet the CEO',
        name: 'Elena Rostova',
        role: 'Creative Director',
        avatar: './about_hero.jpg'
      }
    },
    {
      image: './assets/paintings/birth_of_venus.jpg',
      title: 'The Birth of Venus',
      category: 'Early Renaissance · Tempera',
      tag: 'Early Renaissance',
      year: '1485',
      description: 'Venus arriving on the shores of Cyprus upon a giant seashell, propelled by the breath of Zephyrs into neoclassical reverence.',
      profile: {
        label: 'Principal Curator',
        name: 'Lorenzo Medici',
        role: 'Renaissance Archivist',
        avatar: './assets/paintings/birth_of_venus.jpg'
      }
    },
    {
      image: './assets/paintings/the_kiss.jpg',
      title: 'The Kiss (Der Kuss)',
      category: 'Vienna Secession · Gold Leaf',
      tag: 'Vienna Secession',
      year: '1908',
      description: 'A golden sanctuary of geometric ornamentation enveloping two lovers in a timeless embrace of eternal devotion.',
      profile: {
        label: 'Artisan Lead',
        name: 'Klara Klimt',
        role: 'Gold Leaf Specialist',
        avatar: './assets/paintings/the_kiss.jpg'
      }
    },
    {
      image: './assets/paintings/great_wave.jpg',
      title: 'The Great Wave off Kanagawa',
      category: 'Edo Period · Ukiyo-e Woodblock',
      tag: 'Edo Period',
      year: '1831',
      description: 'Hokusai’s monumental cresting wave framing Mount Fuji in an iconic dialogue between raw nature and human endurance.',
      profile: {
        label: 'Master Printmaker',
        name: 'Kenji Hokusai',
        role: 'Ukiyo-e Director',
        avatar: './assets/paintings/great_wave.jpg'
      }
    },
    {
      image: './assets/paintings/wanderer.jpg',
      title: 'Wanderer Above the Sea of Fog',
      category: 'Romanticism · Oil on Canvas',
      tag: 'Romanticism',
      year: '1818',
      description: 'A solitary traveler gazing out over a tumultuous sea of fog, reflecting the sublime contemplation of human existence.',
      profile: {
        label: 'Lead Historian',
        name: 'Caspar Friedrich',
        role: 'Sublime Archivist',
        avatar: './assets/paintings/wanderer.jpg'
      }
    },
    {
      image: './assets/paintings/girl_pearl_earring.jpg',
      title: 'Girl with a Pearl Earring',
      category: 'Dutch Golden Age · Tronie',
      tag: 'Dutch Golden Age',
      year: '1665',
      description: 'Vermeer’s captivating tronie renowned for its intimate chiaroscuro gaze, oriental turban, and luminous pearl earring.',
      profile: {
        label: 'Lighting Master',
        name: 'Johannes Vermeer',
        role: 'Chiaroscuro Lead',
        avatar: './assets/paintings/girl_pearl_earring.jpg'
      }
    },
    {
      image: './assets/paintings/water_lilies.jpg',
      title: 'Water Lilies (Nymphéas)',
      category: 'Impressionism · Giverny Garden',
      tag: 'Impressionism',
      year: '1916',
      description: 'Monet’s meditative impressionist study of water, sky, and light reflections dissolving physical form into pure sensation.',
      profile: {
        label: 'Atmosphere Lead',
        name: 'Claude Monet',
        role: 'Impressionist Director',
        avatar: './assets/paintings/water_lilies.jpg'
      }
    },
    {
      image: './assets/paintings/night_watch.jpg',
      title: 'The Night Watch',
      category: 'Baroque · Civic Guard Militia',
      tag: 'Baroque',
      year: '1642',
      description: 'Rembrandt’s dramatic civic guard portrait revolutionizing group composition through colossally dynamic chiaroscuro light.',
      profile: {
        label: 'Baroque Specialist',
        name: 'Rembrandt van Rijn',
        role: 'Master of Illumination',
        avatar: './assets/paintings/night_watch.jpg'
      }
    }
  ];

  class VerticalSlideGallery {
    /**
     * @param {Object} options
     * @param {HTMLElement|string} options.target - Mounting DOM element or selector
     * @param {Array} [options.items] - [{ image, title, category, year }]
     * @param {Object} [options.leftPanel] - Left static panel options
     * @param {Object} [options.rightPanel] - Right static panel options
     * @param {Function} [options.onSlideChange] - Callback on transition
     */
    constructor(options = {}) {
      this.options = Object.assign({
        target: null,
        items: DEFAULT_ITEMS,
        transitionDuration: 750, // ms
        leftPanel: {
          logo: 'AVĀRTĀ ®',
          badge: 'VISUAL STUDIO',
          tag: 'Curated Archive',
          ctaText: 'Join Us Now',
          ctaHref: '#contact'
        },
        rightPanel: {
          metaLabel: 'Curated Collection',
          seeAllText: 'See all',
          onSeeAll: null
        },
        onSlideChange: null
      }, options);

      this.items = (Array.isArray(this.options.items) && this.options.items.length > 0)
        ? this.options.items
        : DEFAULT_ITEMS;

      this.currentIndex = 0;
      this.isAnimating = false;
      this.root = null;
      this.slides = [];
      this.ambientLayers = [];

      // Gesture tracking
      this.touchStartY = 0;
      this.touchCurrentY = 0;
      this.isDragging = false;
      this.wheelCooldown = false;
      this.wheelTimeout = null;

      // Bound listeners for cleanup
      this._onWheel = this._handleWheel.bind(this);
      this._onPointerDown = this._handlePointerDown.bind(this);
      this._onPointerMove = this._handlePointerMove.bind(this);
      this._onPointerUp = this._handlePointerUp.bind(this);
      this._onKeyDown = this._handleKeyDown.bind(this);

      if (this.options.target) {
        this.mount(this.options.target);
      }
    }

    /**
     * Mount the component to a DOM container
     * @param {HTMLElement|string} target
     */
    mount(target) {
      const container = typeof target === 'string' ? document.querySelector(target) : target;
      if (!container) {
        console.error('[VerticalSlideGallery] Mount target container not found:', target);
        return this;
      }

      this.destroy(); // Tear down previous instance if any
      this.root = this._render();
      container.appendChild(this.root);

      this._cacheElements();
      this._bindEvents();
      this._updateDeck(true);

      return this;
    }

    /**
     * Render the component DOM structure
     * @private
     */
    _render() {
      const root = document.createElement('div');
      root.className = 'vsg-root';
      root.setAttribute('role', 'region');
      root.setAttribute('aria-label', 'Vertical Art Slide Gallery');
      root.setAttribute('tabindex', '0');

      const count = this.items.length;
      const countStr = String(count).padStart(2, '0');

      // 1. Ambient blurred background viewport
      const ambientHtml = this.items.map((item, idx) => `
        <div class="vsg-ambient-layer ${idx === 0 ? 'vsg-active' : ''}" 
             data-index="${idx}" 
             style="background-image: url('${item.image}');" 
             aria-hidden="true"></div>
      `).join('');

      // 2. Center deck viewport with inset cards
      const slidesHtml = this.items.map((item, idx) => {
        const indexStr = `(${String(idx + 1).padStart(2, '0')})`;
        return `
          <div class="vsg-slide ${idx === 0 ? 'vsg-slide-active' : ''}" data-index="${idx}" id="vsg-slide-${idx}">
            <div class="vsg-card-frame">
              <img src="${item.image}" alt="${item.title}" class="vsg-card-img" loading="${idx < 3 ? 'eager' : 'lazy'}">
              <div class="vsg-card-sheen" aria-hidden="true"></div>
            </div>
            <div class="vsg-caption-row">
              <span class="vsg-caption-left">${indexStr}</span>
              <div class="vsg-caption-center">
                <div class="vsg-caption-title">${item.title}</div>
                <div class="vsg-caption-sub">${item.category}</div>
              </div>
              <span class="vsg-caption-right">© ${item.year}</span>
            </div>
          </div>
        `;
      }).join('');

      const leftCfg = this.options.leftPanel;
      const rightCfg = this.options.rightPanel;
      const nextImg = this.items.length > 1 ? this.items[1].image : this.items[0].image;

      root.innerHTML = `
        <!-- Ambient Full-Bleed Blurred Layers -->
        <div class="vsg-ambient-viewport">
          ${ambientHtml}
          <div class="vsg-ambient-scrim" aria-hidden="true"></div>
        </div>

        <!-- Static Left Panel (Unaffected by slide transitions) -->
        <aside class="vsg-panel-left" aria-label="Gallery Identity">
          <a href="${leftCfg.ctaHref}" class="vsg-cta-link" aria-label="${leftCfg.ctaText}">
            <span>${leftCfg.ctaText}</span>
            <span class="vsg-cta-arrow">→</span>
          </a>
        </aside>

        <!-- Centered Stacked Deck Viewport -->
        <div class="vsg-deck-viewport" id="vsg-deck-viewport">
          ${slidesHtml}
        </div>

        <!-- Static Right Panel (Unaffected by slide transitions) -->
        <aside class="vsg-panel-right" aria-label="Gallery Controls"></aside>

        <!-- Vertical Scroll & Gesture Indicator -->
        <div class="vsg-scroll-hint" aria-hidden="true">
          <div class="vsg-scroll-mouse-icon">
            <div class="vsg-scroll-wheel-tick"></div>
          </div>
          <span>SCROLL / SWIPE</span>
        </div>
      `;

      return root;
    }

    /**
     * Cache rendered DOM elements
     * @private
     */
    _cacheElements() {
      if (!this.root) return;
      this.deckViewport = this.root.querySelector('.vsg-deck-viewport');
      this.slides = Array.from(this.root.querySelectorAll('.vsg-slide'));
      this.ambientLayers = Array.from(this.root.querySelectorAll('.vsg-ambient-layer'));
      this.fractionEl = this.root.querySelector('#vsg-meta-fraction');
      this.thumbImg = this.root.querySelector('#vsg-thumb-img');
      this.thumbWrapper = this.root.querySelector('#vsg-next-thumb');
      this.seeAllBtn = this.root.querySelector('#vsg-see-all-btn');
    }

    /**
     * Bind gesture, wheel, and keyboard events scoped to the gallery root
     * @private
     */
    _bindEvents() {
      if (!this.root) return;

      // Scoped vertical wheel listener
      this.root.addEventListener('wheel', this._onWheel, { passive: false });

      // Scoped drag / touch swipe
      if (this.deckViewport) {
        this.deckViewport.addEventListener('pointerdown', this._onPointerDown);
        window.addEventListener('pointermove', this._onPointerMove);
        window.addEventListener('pointerup', this._onPointerUp);
        window.addEventListener('pointercancel', this._onPointerUp);
      }

      // Keyboard navigation
      this.root.addEventListener('keydown', this._onKeyDown);

      // Thumbnail click advances
      if (this.thumbWrapper) {
        this.thumbWrapper.addEventListener('click', () => this.next());
      }

      // Click-to-expand detail view on collection cards
      this.slides.forEach((slide, index) => {
        const cardFrame = slide.querySelector('.vsg-card-frame');
        if (cardFrame) {
          cardFrame.addEventListener('click', (e) => {
            if (this.isDragging) return;
            if (index === this.currentIndex) {
              if (typeof this.options.onCardClick === 'function') {
                this.options.onCardClick(index, this.items[index]);
              } else if (window.CollectionDetailView && typeof window.CollectionDetailView.open === 'function') {
                window.CollectionDetailView.open(this.items[index], index);
              }
            } else {
              this.goTo(index);
            }
          });
        }
      });

      // See all trigger
      if (this.seeAllBtn && typeof this.options.rightPanel.onSeeAll === 'function') {
        this.seeAllBtn.addEventListener('click', this.options.rightPanel.onSeeAll);
      }
    }

    /**
     * Update stacked deck card geometry, opacity, and ambient backdrop
     * @param {boolean} immediate
     * @private
     */
    _updateDeck(immediate = false) {
      const current = this.currentIndex;
      const total = this.items.length;

      // Update Slides (Stacked deck geometry)
      this.slides.forEach((slide, index) => {
        const diff = index - current;
        slide.style.transition = immediate ? 'none' : 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1)';

        if (diff === 0) {
          // ACTIVE CARD: Full size, centered, crisp
          slide.style.transform = 'translate(-50%, -50%) scale(1)';
          slide.style.opacity = '1';
          slide.style.zIndex = '20';
          slide.classList.add('vsg-slide-active');
        } else if (diff === 1) {
          // UPCOMING 1: Peeking above current slide
          slide.style.transform = 'translate(-50%, calc(-50% - 34px)) scale(0.94)';
          slide.style.opacity = '0.92';
          slide.style.zIndex = '18';
          slide.classList.remove('vsg-slide-active');
        } else if (diff === 2) {
          // UPCOMING 2: Peeking above upcoming 1
          slide.style.transform = 'translate(-50%, calc(-50% - 64px)) scale(0.88)';
          slide.style.opacity = '0.66';
          slide.style.zIndex = '16';
          slide.classList.remove('vsg-slide-active');
        } else if (diff === 3) {
          // UPCOMING 3: Peeking above upcoming 2
          slide.style.transform = 'translate(-50%, calc(-50% - 90px)) scale(0.82)';
          slide.style.opacity = '0.38';
          slide.style.zIndex = '14';
          slide.classList.remove('vsg-slide-active');
        } else if (diff > 3) {
          // Further upcoming: hidden behind the stack
          slide.style.transform = 'translate(-50%, calc(-50% - 110px)) scale(0.76)';
          slide.style.opacity = '0';
          slide.style.zIndex = '10';
          slide.classList.remove('vsg-slide-active');
        } else if (diff === -1) {
          // PREVIOUS CARD: Scales down and fades below
          slide.style.transform = 'translate(-50%, calc(-50% + 75px)) scale(0.92)';
          slide.style.opacity = '0';
          slide.style.zIndex = '5';
          slide.classList.remove('vsg-slide-active');
        } else {
          // Further previous: far below
          slide.style.transform = 'translate(-50%, calc(-50% + 120px)) scale(0.85)';
          slide.style.opacity = '0';
          slide.style.zIndex = '1';
          slide.classList.remove('vsg-slide-active');
        }
      });

      // Update Ambient Backdrop Layers
      this.ambientLayers.forEach((layer, idx) => {
        if (idx === current) {
          layer.classList.add('vsg-active');
        } else {
          layer.classList.remove('vsg-active');
        }
      });

      // Update Fraction Text
      if (this.fractionEl) {
        this.fractionEl.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      }

      // Update Right Thumbnail to Next Slide
      if (this.thumbImg && total > 1) {
        const nextIdx = (current + 1) % total;
        this.thumbImg.src = this.items[nextIdx].image;
        this.thumbImg.alt = `Preview of next artwork: ${this.items[nextIdx].title}`;
      }

      // Trigger callback if defined
      if (typeof this.options.onSlideChange === 'function') {
        this.options.onSlideChange(current, this.items[current]);
      }
    }

    /**
     * Transition to a specific slide index
     * @param {number} targetIndex
     */
    goTo(targetIndex) {
      if (this.isAnimating) return;
      const count = this.items.length;
      const nextIndex = Math.max(0, Math.min(count - 1, targetIndex));
      if (nextIndex === this.currentIndex) return;

      this.isAnimating = true;
      this.currentIndex = nextIndex;
      this._updateDeck(false);

      setTimeout(() => {
        this.isAnimating = false;
      }, this.options.transitionDuration);
    }

    /**
     * Advance to the next slide
     */
    next() {
      if (this.currentIndex < this.items.length - 1) {
        this.goTo(this.currentIndex + 1);
      } else {
        // Optional loop or spring back
        this.goTo(0);
      }
    }

    /**
     * Return to previous slide
     */
    prev() {
      if (this.currentIndex > 0) {
        this.goTo(this.currentIndex - 1);
      } else {
        this.goTo(this.items.length - 1);
      }
    }

    /**
     * Handle scoped mouse wheel navigation
     * @private
     */
    _handleWheel(e) {
      e.preventDefault();
      if (this.isAnimating || this.wheelCooldown) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 20) return; // Ignore trackpad micro-jitters

      this.wheelCooldown = true;
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = setTimeout(() => {
        this.wheelCooldown = false;
      }, 700);

      if (delta > 0) {
        this.next();
      } else {
        this.prev();
      }
    }

    /**
     * Pointer Down (start touch / drag)
     * @private
     */
    _handlePointerDown(e) {
      if (this.isAnimating) return;
      this.isDragging = true;
      this.touchStartY = e.clientY;
      this.touchCurrentY = e.clientY;
    }

    /**
     * Pointer Move (drag progress)
     * @private
     */
    _handlePointerMove(e) {
      if (!this.isDragging) return;
      this.touchCurrentY = e.clientY;
    }

    /**
     * Pointer Up (commit drag gesture)
     * @private
     */
    _handlePointerUp() {
      if (!this.isDragging) return;
      this.isDragging = false;

      const deltaY = this.touchCurrentY - this.touchStartY;
      const threshold = 45; // Pixels required to trigger navigation

      if (deltaY < -threshold) {
        this.next(); // Drag up advances to next
      } else if (deltaY > threshold) {
        this.prev(); // Drag down goes to prev
      }
    }

    /**
     * Handle keyboard navigation
     * @private
     */
    _handleKeyDown(e) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.prev();
      }
    }

    /**
     * Destroy component, remove listeners and DOM nodes
     */
    destroy() {
      if (this.root) {
        this.root.removeEventListener('wheel', this._onWheel);
        this.root.removeEventListener('keydown', this._onKeyDown);
        if (this.deckViewport) {
          this.deckViewport.removeEventListener('pointerdown', this._onPointerDown);
        }
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('pointerup', this._onPointerUp);
        window.removeEventListener('pointercancel', this._onPointerUp);

        if (this.root.parentNode) {
          this.root.parentNode.removeChild(this.root);
        }
      }

      clearTimeout(this.wheelTimeout);
      this.root = null;
      this.slides = [];
      this.ambientLayers = [];
    }
  }

  // Export to global scope
  global.VerticalSlideGallery = VerticalSlideGallery;

})(typeof window !== 'undefined' ? window : this);

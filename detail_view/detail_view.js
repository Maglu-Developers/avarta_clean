/**
 * COLLECTION DETAIL VIEW — FULL PROJECT DETAIL VIEW WITH SCROLL-SCRUB REVEAL
 * Isolated component triggered dynamically on click from the collection.
 * 
 * STEP 1 — Click to pop up (hero view):
 * - Blackout transition buffer (~180ms)
 * - Full-bleed hero background with soft dark overlay
 * - Staggered fade + slide in:
 *     - Top navbar (logo left, nav links centered)
 *     - Floating card top-right (photo thumbnail, label + arrow, name + role)
 *     - Four crosshairs (+) near inner corners
 *     - Large bold centered title
 *     - Bottom row: tag bottom-left, short description centered, year bottom-right
 * 
 * STEP 2 — Scroll down to reveal description:
 * - Hero image stays pinned while white content section slides up from bottom
 * - Subtly angled/diagonal top edge during motion
 * - Sticky thin row at top: index counter (01) left, (Read More) center, year right
 * - Large bold multi-line description paragraph reveals progressively tied to scroll position
 *   (scroll-scrubbed: words turn from light gray to solid black, reversible on scroll up)
 * - Navbar, floating card, and crosshairs stay visible/fixed throughout
 */

(function (global) {
  'use strict';

  // Curated deep multi-line narratives for scroll-scrubbed highlight reveal
  const EXTENDED_NARRATIVES = {
    'The Starry Night': 'Painted from the barred window of his asylum room in Saint-Rémy-de-Provence, Vincent van Gogh channeled his deepest spiritual yearnings into a churning nocturnal sky. The monumental cypress tree rises like a dark flame connecting terrestrial suffering to cosmic transcendence, while vibrant swirling brushstrokes imbue the celestial heavens with hypnotic movement and turbulent emotion.',
    'The Birth of Venus': 'Emerging from the sea upon a monumental scallop shell, Venus is propelled ashore by the gentle breath of the Zephyrs as the goddess of spring waits to cloak her in floral reverence. Sandro Botticelli redefined Renaissance humanism by reviving classical mythological grace, celebrating ethereal beauty through sinuous linear elegance and poetic tempera harmony.',
    'The Kiss (Der Kuss)': 'Enveloped within a resplendent cocoon of gold leaf, silver leaf, and intricate geometric mosaics, two lovers dissolve into an eternal embrace upon a carpet of vibrant wildflowers. Gustav Klimt’s Golden Phase masterwork synthesizes Art Nouveau ornamentation with profound human intimacy, capturing the transcendent triumph of romantic devotion over the passage of time.',
    'The Great Wave off Kanagawa': 'Katsushika Hokusai captured the perilous fragility of human existence against the raw majesty of nature in this defining woodblock print. A towering, claw-like cresting wave threatens three fragile fishing boats while Mount Fuji sits serene and timeless in the distant horizon, composed in Prussian blue with geometric precision.',
    'Wanderer Above the Sea of Fog': 'Perched atop a jagged rocky precipice, a solitary traveler gazes out into an impenetrable sea of swirling mountain mist. Caspar David Friedrich’s defining Romantic icon captures the sublime confrontation between the human soul and the infinite mysteries of the natural universe, inviting contemplative introspection.',
    'Girl with a Pearl Earring': 'Johannes Vermeer captured an enigmatic, intimate moment in this luminous Dutch Golden Age tronie. The young woman glances over her shoulder with parted lips and glistening eyes, crowned by an exotic blue and gold turban, while an oversized teardrop pearl earring catches the single beam of chiaroscuro illumination with breathtaking delicacy.',
    'Water Lilies (Nymphéas)': 'From his tranquil water garden in Giverny, Claude Monet pioneered the dissolution of formal perspective into pure light, color, and atmosphere. The gently floating blossoms, aquatic reflections, and shifting cloudscapes blend into a meditative, boundaryless continuum that anticipated abstract modernism.',
    'The Night Watch': 'Rembrandt van Rijn dramatically shattered conventional group portraiture by depicting Captain Frans Banning Cocq and his civic guard militia in colossal, theatrical motion. Emerging from deep atmospheric shadow into brilliant golden light, every figure pulsates with individuality, energy, and civic pride.'
  };

  class CollectionDetailView {
    constructor() {
      this.isOpen = false;
      this.overlayEl = null;
      this.currentItem = null;
      this.currentIndex = 0;
      this._historyPushed = false;
      this._scrollTicking = false;
      this._lastScrollTop = 0;
      this._navHidden = false;

      this._onKeyDown = this._handleKeyDown.bind(this);
      this._onPopState = this._handlePopState.bind(this);
      this._onScroll = this._handleScroll.bind(this);

      this._initDOM();
      this._bindGlobalListeners();
    }

    /**
     * Build isolated DOM structure
     * @private
     */
    _initDOM() {
      let el = document.getElementById('collection-detail-overlay');
      if (el) {
        el.remove();
      }

      el = document.createElement('div');
      el.id = 'collection-detail-overlay';
      el.className = 'cdv-overlay';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-hidden', 'true');

      el.innerHTML = `
        <!-- Transition Buffer (180ms blackout) -->
        <div class="cdv-buffer" id="cdv-buffer" aria-hidden="true"></div>

        <!-- Fixed Top Navbar (Persists across Hero and Description scroll) -->
        <header class="cdv-navbar" id="cdv-navbar">
          <!-- Logo / Brand on Far Left (Hidden: only toggle requested) -->
          <a href="#collection" class="cdv-nav-brand" id="cdv-brand-trigger" aria-label="Brand Home" style="display: none !important;">
            <span class="cdv-brand-text">AVĀRTĀ</span>
            <span class="cdv-brand-registered">®</span>
          </a>

          <!-- Centered Liquid Glass Pill Navigation -->
          <nav class="cdv-nav-links nav-menu" aria-label="Project Navigation">
            <!-- Sliding Crystal Glass Indicator Thumb -->
            <div class="nav-glass-indicator cdv-glass-indicator" id="cdv-glass-indicator" aria-hidden="true">
              <div class="indicator-glass-body"></div>
              <div class="indicator-rainbow-rim"></div>
            </div>

            <!-- Dynamic cursor sheen overlay -->
            <div class="nav-glass-sheen" aria-hidden="true"></div>

            <!-- Iridescent prism dispersion caustics -->
            <div class="nav-glass-caustics" aria-hidden="true"></div>

            <!-- Perimeter specular highlight border -->
            <div class="nav-glass-hairline" aria-hidden="true"></div>

            <a href="#home" class="cdv-nav-link nav-item" data-route="home">
              <span class="cdv-link-text">HOME</span>
            </a>
            <a href="#collection" class="cdv-nav-link nav-item active" data-route="collection">
              <span class="cdv-link-text">COLLECTION</span>
            </a>
            <a href="#about" class="cdv-nav-link nav-item" data-route="about">
              <span class="cdv-link-text">ABOUT</span>
            </a>
            <a href="#explore" class="cdv-nav-link nav-item" data-route="explore">
              <span class="cdv-link-text">EXPLORE</span>
            </a>
          </nav>

          <!-- Top-Right Corner: Sleek Liquid Glass Back Toggle -->
          <button type="button" class="cdv-back-btn" id="cdv-back-btn" aria-label="Back to collection gallery">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="cdv-back-icon">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span class="cdv-back-label">BACK</span>
          </button>
        </header>

        <!-- Scrollable Body Container -->
        <div class="cdv-scroll-body" id="cdv-scroll-body">
          <!-- ==================== STEP 1: HERO VIEW (Pinned 100vh) ==================== -->
          <section class="cdv-hero-section" id="cdv-hero-section">
            <div class="cdv-hero-bg-layer" id="cdv-hero-bg-layer" aria-hidden="true">
              <img src="" alt="" class="cdv-hero-img" id="cdv-hero-img">
              <div class="cdv-hero-scrim"></div>
            </div>

            <!-- Large Bold Centered Title -->
            <div class="cdv-center-title-container" id="cdv-center-title-container">
              <h1 class="cdv-main-title" id="cdv-main-title">Project Name</h1>
            </div>

            <!-- Bottom Row: Tag left, Short description center, Year right -->
            <div class="cdv-hero-bottom-row" id="cdv-hero-bottom-row">
              <div class="cdv-bottom-col-left">
                <span class="cdv-hero-tag" id="cdv-hero-tag">Strategy</span>
              </div>
              <div class="cdv-bottom-col-center">
                <p class="cdv-hero-short-desc" id="cdv-hero-short-desc">
                  A refined identity system blending structure with expressive form.
                </p>
              </div>
              <div class="cdv-bottom-col-right">
                <span class="cdv-hero-year" id="cdv-hero-year">1889</span>
              </div>
            </div>

            <!-- Subtle Scroll Prompt -->
            <div class="cdv-scroll-indicator" aria-hidden="true">
              <span>Scroll to explore</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </section>

          <!-- ==================== STEP 2: WHITE CONTENT SECTION ==================== -->
          <section class="cdv-white-section" id="cdv-white-section">
            <div class="cdv-white-content-wrapper">
              <!-- Sticky Thin Row: Index Left (01), (Read More) Center, Year Right -->
              <div class="cdv-sticky-info-bar" id="cdv-sticky-bar">
                <div class="cdv-sticky-left">
                  <span class="cdv-sticky-index" id="cdv-sticky-index">(01)</span>
                </div>
                <div class="cdv-sticky-center">
                  <span class="cdv-sticky-label">(Read More)</span>
                </div>
                <div class="cdv-sticky-right">
                  <span class="cdv-sticky-year" id="cdv-sticky-year">1889</span>
                </div>
              </div>

              <!-- Large Bold Multi-line Description Paragraph (Pinned Sticky Track) -->
              <div class="cdv-scrub-pin-track" id="cdv-scrub-pin-track">
                <div class="cdv-scrub-sticky-box" id="cdv-scrub-sticky-box">
                  <div class="cdv-scrub-text-container">
                    <p class="cdv-scrub-paragraph" id="cdv-scrub-paragraph">
                      <!-- Progressively populated with <span class="cdv-scrub-word">word</span> -->
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ==================== STEP 3: METADATA BLACK DIAGONAL SECTION ==================== -->
          <section class="black-diagonal-section cdv-black-diagonal-section" id="cdv-metadata-section">
            <div class="cdv-black-diagonal-inner">
              <!-- Rich Project Specs Grid -->
              <div class="cdv-project-specs">
                <div class="cdv-spec-item">
                  <span class="cdv-spec-k">Category</span>
                  <span class="cdv-spec-v" id="cdv-spec-category">Post-Impressionism · Masterwork</span>
                </div>
                <div class="cdv-spec-item">
                  <span class="cdv-spec-k">Year Created</span>
                  <span class="cdv-spec-v" id="cdv-spec-year">1889</span>
                </div>
                <div class="cdv-spec-item">
                  <span class="cdv-spec-k">Curator / Lead</span>
                  <span class="cdv-spec-v" id="cdv-spec-curator">Elena Rostova</span>
                </div>
                <div class="cdv-spec-item">
                  <span class="cdv-spec-k">Archive Status</span>
                  <span class="cdv-spec-v">Verified Masterwork</span>
                </div>
              </div>

              <!-- Monumental Brand Wordmark Closing -->
              <div class="cdv-footer-closing" id="cdv-footer-closing">
                <div class="cdv-footer-wordmark-container">
                  <div class="cdv-footer-wordmark" id="cdv-footer-wordmark" aria-label="Brand Wordmark">
                    <span class="cdv-wm-single" id="cdv-wm-single">AVĀRTĀ</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      `;

      document.body.appendChild(el);
      this.overlayEl = el;
      this._bindOverlayEvents();
    }

    /**
     * Bind listeners inside the overlay component
     * @private
     */
    _bindOverlayEvents() {
      if (!this.overlayEl) return;

      // Scroll listener for Step 2 scroll-scrubbed reveal
      this.overlayEl.addEventListener('scroll', this._onScroll, { passive: true });

      // Close button
      const closeBtn = this.overlayEl.querySelector('#cdv-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.close();
        });
      }

      // Back toggle in top-right corner
      const backBtn = this.overlayEl.querySelector('#cdv-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.close();
        });
      }

      // Brand logo closes detail view and stays in collection
      const brandTrigger = this.overlayEl.querySelector('#cdv-brand-trigger');
      if (brandTrigger) {
        brandTrigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
        });
      }

      // Profile card action
      const profileCard = this.overlayEl.querySelector('#cdv-profile-card');
      if (profileCard) {
        profileCard.addEventListener('click', () => {
          if (this.currentItem && this.currentItem.categoryLink) {
            window.location.href = this.currentItem.categoryLink;
          }
        });
      }

      // Nav links inside detail view
      const navLinks = this.overlayEl.querySelectorAll('.cdv-nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const route = link.getAttribute('data-route');
          const href = link.getAttribute('href');

          // Highlight clicked link immediately and slide crystal indicator
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          const menu = this.overlayEl.querySelector('.cdv-nav-links');
          if (typeof window.updateNavGlassIndicator === 'function' && menu) {
            window.updateNavGlassIndicator(menu);
          }

          // Smooth route transition
          setTimeout(() => {
            if (route === 'collection') {
              this.close();
            } else if (route && typeof window.avartaNavigate === 'function') {
              this.close();
              window.avartaNavigate(route);
            } else if (href && href.startsWith('#')) {
              this.close();
              window.location.hash = href;
            }
          }, 140);
        });
      });

    }

    /**
     * Bind global document and history listeners
     * @private
     */
    _bindGlobalListeners() {
      window.addEventListener('popstate', this._onPopState);
    }

    /**
     * Open Detail View with selected item data
     * @param {Object} item - Data for clicked project/image
     * @param {number} [index=0] - Index in collection
     */
    open(item, index = 0) {
      if (!item || !this.overlayEl) return;
      this.isOpen = true;
      this.currentItem = item;
      this.currentIndex = index;

      // 1. Reset scroll position of the overlay to top (Hero View)
      this.overlayEl.scrollTop = 0;

      // 2. Populate Full-Bleed Hero Background Image
      const heroImg = this.overlayEl.querySelector('#cdv-hero-img');
      if (heroImg) {
        heroImg.src = item.image || item.src || '';
        heroImg.alt = item.title || item.name || 'Project Image';
      }

      // 3. Populate Large Bold Centered Title
      const titleEl = this.overlayEl.querySelector('#cdv-main-title');
      if (titleEl) {
        titleEl.textContent = item.title || item.name || 'Untitled Project';
      }

      // 4. Populate Hero Bottom Row: Tag left, Short description center, Year right
      const heroTag = this.overlayEl.querySelector('#cdv-hero-tag');
      const heroShortDesc = this.overlayEl.querySelector('#cdv-hero-short-desc');
      const heroYear = this.overlayEl.querySelector('#cdv-hero-year');

      const tagText = item.tag || (item.category ? item.category.split('·')[0].trim() : 'Strategy');
      const shortDescText = item.description || 'A refined identity system blending structure with expressive form.';
      const yearText = item.year || '2024';

      if (heroTag) heroTag.textContent = tagText;
      if (heroShortDesc) heroShortDesc.textContent = shortDescText;
      if (heroYear) heroYear.textContent = yearText;

      // 5. Populate Floating White Profile Card (Top-Right)
      const profileData = item.profile || item.curator || {};
      const thumbEl = this.overlayEl.querySelector('#cdv-profile-thumb');
      const labelEl = this.overlayEl.querySelector('#cdv-profile-label');
      const nameEl = this.overlayEl.querySelector('#cdv-profile-name');
      const roleEl = this.overlayEl.querySelector('#cdv-profile-role');

      if (thumbEl) {
        thumbEl.src = profileData.avatar || profileData.thumbnail || item.avatar || item.image || './about_hero.jpg';
        thumbEl.alt = profileData.name || item.artist || 'Profile Thumbnail';
      }
      if (labelEl) labelEl.textContent = profileData.label || 'Meet the CEO';
      if (nameEl) nameEl.textContent = profileData.name || item.artist || item.author || 'Elena Rostova';
      if (roleEl) roleEl.textContent = profileData.role || item.role || item.era || 'Creative Director';

      // 6. Populate Step 2 Sticky Bar & Project Specs
      const stickyIndex = this.overlayEl.querySelector('#cdv-sticky-index');
      const stickyYear = this.overlayEl.querySelector('#cdv-sticky-year');
      const specCategory = this.overlayEl.querySelector('#cdv-spec-category');
      const specYear = this.overlayEl.querySelector('#cdv-spec-year');
      const specCurator = this.overlayEl.querySelector('#cdv-spec-curator');

      const formattedIndex = `(${String(index + 1).padStart(2, '0')})`;
      if (stickyIndex) stickyIndex.textContent = formattedIndex;
      if (stickyYear) stickyYear.textContent = yearText;
      if (specCategory) specCategory.textContent = item.category || tagText;
      if (specYear) specYear.textContent = yearText;
      if (specCurator) specCurator.textContent = profileData.name || 'Elena Rostova';

      // 6.5. Populate Closing Brand Wordmark

      const wmSingle = this.overlayEl.querySelector('#cdv-wm-single') || this.overlayEl.querySelector('#cdv-wm-left');
      if (wmSingle) {
        const rawVal = item.wordmark || (global.SITE_CONFIG && global.SITE_CONFIG.wordmark) || 'AVĀRTĀ';
        wmSingle.textContent = rawVal.replace(/\s+/g, '') || 'AVĀRTĀ';
      }

      // 7. Tokenize Description into Word Spans for Scroll-Scrub Reveal
      this._buildScrubWords(item);

      // 8. STEP 1 Transition Buffer (~180ms blackout)
      this.overlayEl.scrollTop = 0;
      this._lastScrollTop = 0;
      this._navHidden = false;
      const heroTitle = this.overlayEl.querySelector('#cdv-center-title-container');
      const heroBottom = this.overlayEl.querySelector('#cdv-hero-bottom-row');
      const heroIndicator = this.overlayEl.querySelector('.cdv-scroll-indicator');
      if (heroTitle) { heroTitle.style.opacity = ''; heroTitle.style.transform = ''; heroTitle.style.visibility = ''; }
      if (heroBottom) { heroBottom.style.opacity = ''; heroBottom.style.transform = ''; heroBottom.style.visibility = ''; }
      if (heroIndicator) { heroIndicator.style.opacity = ''; heroIndicator.style.visibility = ''; }

      this.overlayEl.classList.remove('cdv-settled', 'cdv-closing', 'cdv-scrolled-past-hero', 'cdv-on-black-section');
      const navbar = this.overlayEl.querySelector('#cdv-navbar');
      if (navbar) navbar.classList.remove('cdv-navbar-on-white', 'cdv-navbar-hidden');
      const blackSec = this.overlayEl.querySelector('#cdv-metadata-section');
      if (blackSec) blackSec.classList.remove('is-revealed', 'in-view');

      this.overlayEl.classList.add('cdv-open');
      this.overlayEl.removeAttribute('aria-hidden');

      window.addEventListener('keydown', this._onKeyDown);

      // Support browser back navigation
      try {
        if (!window.location.hash.includes('detail')) {
          history.pushState({ cdvOpen: true }, '', '#detail');
          this._historyPushed = true;
        }
      } catch (err) {
        // Safe failover
      }

      window.dispatchEvent(new CustomEvent('cdvOpened'));

      // Ensure COLLECTION is active and position the crystal glass indicator
      const cdvNav = this.overlayEl.querySelector('.cdv-nav-links');
      if (cdvNav) {
        cdvNav.querySelectorAll('.cdv-nav-link').forEach(l => {
          if (l.getAttribute('data-route') === 'collection') {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
        if (typeof window.initGlassSheenTracking === 'function') {
          window.initGlassSheenTracking(cdvNav);
        }
        if (typeof window.updateNavGlassIndicator === 'function') {
          setTimeout(() => window.updateNavGlassIndicator(cdvNav), 60);
          setTimeout(() => window.updateNavGlassIndicator(cdvNav), 220);
        }
      }

      // Settle UI elements with staggered choreography after 180ms blackout buffer
      setTimeout(() => {
        if (!this.isOpen) return;
        this.overlayEl.classList.add('cdv-settled');
        if (typeof window.updateNavGlassIndicator === 'function' && cdvNav) {
          window.updateNavGlassIndicator(cdvNav);
        }
      }, 190);
    }

    /**
     * Build words array for scroll-scrubbed highlight
     * @private
     */
    _buildScrubWords(item) {
      const paragraphEl = this.overlayEl.querySelector('#cdv-scrub-paragraph');
      if (!paragraphEl) return;

      // Select narrative: custom extended narrative, longDescription, or structured expansion
      let narrative = item.longDescription || EXTENDED_NARRATIVES[item.title];
      if (!narrative) {
        narrative = `${item.description || ''} Recognized as a transcendent masterwork, the composition blends emotional resonance, refined form, and timeless craftsmanship to immerse the viewer beyond the physical canvas into an unforgettable world of atmosphere and discovery.`;
      }

      const words = narrative.trim().split(/\s+/);
      paragraphEl.innerHTML = '';

      const frag = document.createDocumentFragment();
      words.forEach((word, idx) => {
        const span = document.createElement('span');
        span.className = 'cdv-scrub-word';
        span.setAttribute('data-idx', idx);
        span.textContent = word + ' ';
        frag.appendChild(span);
      });

      paragraphEl.appendChild(frag);
      this.scrubWords = paragraphEl.querySelectorAll('.cdv-scrub-word');
      this.totalWords = this.scrubWords.length;
    }

    /**
     * High-performance scroll handler (requestAnimationFrame scrub)
     * @private
     */
    _handleScroll() {
      if (!this._scrollTicking && this.isOpen) {
        this._scrollTicking = true;
        requestAnimationFrame(() => {
          this._updateScrollScrub();
          this._scrollTicking = false;
        });
      }
    }

    /**
     * Update angled top edge and word highlight reveal based on scroll offset
     * @private
     */
    _updateScrollScrub() {
      if (!this.overlayEl) return;

      const scrollTop = this.overlayEl.scrollTop;
      const vh = window.innerHeight;

      // 0. Smoothly fade out Hero Title, Bottom Info, and Scroll Indicator on scroll
      // so only the pristine painting artwork remains behind the frosted glass section
      const heroTitle = this.overlayEl.querySelector('#cdv-center-title-container');
      const heroBottom = this.overlayEl.querySelector('#cdv-hero-bottom-row');
      const heroIndicator = this.overlayEl.querySelector('.cdv-scroll-indicator');

      const heroFadeProgress = Math.min(1, Math.max(0, scrollTop / (vh * 0.4)));
      const heroOpacity = (1 - heroFadeProgress).toFixed(3);
      const heroTranslateY = (heroFadeProgress * -35).toFixed(1);

      if (heroTitle) {
        heroTitle.style.opacity = heroOpacity;
        heroTitle.style.transform = `translateY(${heroTranslateY}px)`;
        heroTitle.style.visibility = heroOpacity <= 0 ? 'hidden' : 'visible';
      }
      if (heroBottom) {
        heroBottom.style.opacity = heroOpacity;
        heroBottom.style.transform = `translateY(${heroTranslateY}px)`;
        heroBottom.style.visibility = heroOpacity <= 0 ? 'hidden' : 'visible';
      }
      if (heroIndicator) {
        heroIndicator.style.opacity = heroOpacity;
        heroIndicator.style.visibility = heroOpacity <= 0 ? 'hidden' : 'visible';
      }

      // 1. Dynamic Angled Top Edge of White Section
      const whiteSection = this.overlayEl.querySelector('#cdv-white-section');
      if (whiteSection) {
        // As white section reaches the top, angle smoothly flattens from 4.5vw to 0
        const angleProgress = Math.min(1, Math.max(0, (scrollTop - (vh * 0.35)) / (vh * 0.5)));
        const currentAngleVw = 4.5 * (1 - angleProgress);
        whiteSection.style.clipPath = `polygon(0 ${currentAngleVw.toFixed(2)}vw, 100% 0, 100% 100%, 0 100%)`;
      }

      // 2. Navbar Adaptation & Scroll Direction Tracking (Move up on scroll down, reveal on scroll up)
      const navbar = this.overlayEl.querySelector('#cdv-navbar');
      const isOverWhite = scrollTop >= vh * 0.88;

      if (navbar) {
        if (isOverWhite) {
          navbar.classList.add('cdv-navbar-on-white');
        } else {
          navbar.classList.remove('cdv-navbar-on-white');
        }

        const delta = scrollTop - (this._lastScrollTop || 0);

        if (scrollTop <= 20) {
          // Always visible at the very top of the view
          if (this._navHidden) {
            navbar.classList.remove('cdv-navbar-hidden');
            this._navHidden = false;
          }
        } else if (delta > 6 && scrollTop > 50) {
          // Scrolling down: smoothly move the entire top bar up out of view
          if (!this._navHidden) {
            navbar.classList.add('cdv-navbar-hidden');
            this._navHidden = true;
          }
        } else if (delta < -6) {
          // Scrolling up: reveal the top bar smoothly
          if (this._navHidden) {
            navbar.classList.remove('cdv-navbar-hidden');
            this._navHidden = false;
          }
        }
      }

      this._lastScrollTop = Math.max(0, scrollTop);

      if (isOverWhite) {
        this.overlayEl.classList.add('cdv-scrolled-past-hero');
      } else {
        this.overlayEl.classList.remove('cdv-scrolled-past-hero');
      }

      // 3. Scroll-Linked Text Reveal Animation (Pinned 1:1 Scrub Engine)
      if (this.scrubWords && this.totalWords > 0) {
        const pinTrack = this.overlayEl.querySelector('#cdv-scrub-pin-track');
        const stickyBox = this.overlayEl.querySelector('#cdv-scrub-sticky-box');

        if (pinTrack && stickyBox) {
          const trackRect = pinTrack.getBoundingClientRect();
          const stickyHeight = stickyBox.offsetHeight;
          const totalDistance = pinTrack.offsetHeight - stickyHeight;
          // Complete word scrub smoothly at 82% of scroll distance so the entire paragraph
          // (including the final words) is 100% revealed and fully readable while comfortably pinned
          const stickyTop = parseFloat(window.getComputedStyle(stickyBox).top) || 108;
          const scrolledDistance = stickyTop - trackRect.top;
          const scrubTargetDistance = totalDistance * 0.82;
          const progress = Math.min(1, Math.max(0, scrolledDistance / (scrubTargetDistance > 0 ? scrubTargetDistance : 1)));

          const N = this.totalWords;
          for (let i = 0; i < N; i++) {
            const wordStart = i / N;
            const wordEnd = (i + 1) / N;

            if (progress <= wordStart) {
              this.scrubWords[i].style.color = '#d1d1d6';
            } else if (progress >= wordEnd) {
              this.scrubWords[i].style.color = '#000000';
            } else {
              // Word is in its active slice: smooth, micro-continuous transition gray -> black
              const sliceProgress = (progress - wordStart) / (wordEnd - wordStart);
              const val = Math.round(209 * (1 - sliceProgress));
              this.scrubWords[i].style.color = `rgb(${val}, ${val}, ${Math.round(val * 1.02)})`;
            }
          }
        }
      }

      // 4. Reveal of Glass Metadata Section
      const blackSection = this.overlayEl.querySelector('#cdv-metadata-section') || this.overlayEl.querySelector('.black-diagonal-section');
      if (blackSection) {
        const bRect = blackSection.getBoundingClientRect();

        // Trigger scroll slide-up reveal animation
        if (bRect.top < vh * 0.95) {
          blackSection.classList.add('is-revealed', 'in-view');
        } else {
          blackSection.classList.remove('is-revealed', 'in-view');
        }

        // Adapt crosshairs when scrolling into black section
        if (bRect.top <= vh * 0.55) {
          this.overlayEl.classList.add('cdv-on-black-section');
        } else {
          this.overlayEl.classList.remove('cdv-on-black-section');
        }
      }
    }

    /**
     * Close Detail View and return smoothly to collection
     * @param {boolean} [skipHistory=false]
     */
    close(skipHistory = false) {
      if (!this.isOpen || !this.overlayEl) return;
      this.isOpen = false;

      this.overlayEl.classList.remove('cdv-settled');
      this.overlayEl.classList.add('cdv-closing');

      window.removeEventListener('keydown', this._onKeyDown);

      // Revert history state if detail hash is active
      if (!skipHistory && this._historyPushed && window.location.hash === '#detail') {
        this._historyPushed = false;
        history.back();
      }

      setTimeout(() => {
        this.overlayEl.classList.remove('cdv-open', 'cdv-closing', 'cdv-scrolled-past-hero', 'cdv-on-black-section');
        this.overlayEl.setAttribute('aria-hidden', 'true');
        const navbar = this.overlayEl.querySelector('#cdv-navbar');
        if (navbar) navbar.classList.remove('cdv-navbar-on-white', 'cdv-navbar-hidden');
        this._navHidden = false;
        this._lastScrollTop = 0;
        const blackSection = this.overlayEl.querySelector('#cdv-metadata-section');
        if (blackSection) blackSection.classList.remove('is-revealed', 'in-view');
        window.dispatchEvent(new CustomEvent('cdvClosed'));
      }, 280);
    }

    /**
     * Keyboard navigation handler (ESC to close)
     * @private
     */
    _handleKeyDown(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        this.close();
      }
    }

    /**
     * Browser popstate listener for back button navigation
     * @private
     */
    _handlePopState(e) {
      if (this.isOpen && (!window.location.hash || window.location.hash !== '#detail')) {
        this.close(true);
      }
    }
  }

  // Singleton instance
  let instance = null;

  function initDetailView() {
    if (!instance) {
      instance = new CollectionDetailView();
      global.CollectionDetailView = instance;
    }
    return instance;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetailView);
  } else {
    initDetailView();
  }

})(window);

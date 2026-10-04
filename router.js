/**
 * AVĀRTĀ — Client-Side Page Router & Cinematic Blackout Transition
 * Handles smooth fade-to-black view swaps between Home and About pages.
 * Fully supports browser history, hash navigation, and prefers-reduced-motion.
 */

(function () {
  const transitionOverlay = document.getElementById('page-transition');
  const homeView = document.getElementById('home-view');
  const aboutView = document.getElementById('about-view');
  const collectionView = document.getElementById('collection-view');
  const exploreView = document.getElementById('explore-view');
  const beyondView = document.getElementById('beyond-view');
  const quizView = document.getElementById('quiz-view');
  const guessView = document.getElementById('guess-view');
  const beyondAvartaView = document.getElementById('beyond-avarta-view');
  const waterCanvas = document.getElementById('water-canvas');
  const ambientOverlay = document.querySelector('.overlay');
  const introContainer = document.getElementById('intro-video-container');
  const navLinks = document.querySelectorAll('.nav-item');

  let isTransitioning = false;
  let currentRoute = 'home';
  let verticalGalleryInstance = null;

  // ==========================================================================
  // HERO BACKGROUND AUDIO ENGINE ("The Sound of Magic (2022) - Opening Theme")
  // ==========================================================================
  const heroAudio = {
    init() {},
    play() {
      if (window.avartaBgAudio && typeof window.avartaBgAudio.play === 'function') {
        window.avartaBgAudio.play();
      }
    },
    stop() {
      if (window.avartaBgAudio && typeof window.avartaBgAudio.pause === 'function') {
        window.avartaBgAudio.pause();
      }
    },
    toggleMute() {
      if (window.avartaBgAudio && typeof window.avartaBgAudio.pause === 'function') {
        window.avartaBgAudio.pause();
      }
    }
  };

  // Initialize Vertical Slide Gallery when collection view is activated
  function ensureVerticalGallery() {
    if (!verticalGalleryInstance && window.VerticalSlideGallery) {
      verticalGalleryInstance = new window.VerticalSlideGallery({
        target: '#vertical-gallery-mount',
        leftPanel: {
          logo: 'AVĀRTĀ ®',
          badge: 'VISUAL STUDIO',
          tag: 'Curated Collection',
          ctaText: 'Enter the Gallery',
          ctaHref: 'categories.html'
        },
        rightPanel: {
          metaLabel: 'Curated Archive',
          seeAllText: 'All Categories',
          onSeeAll: () => { window.location.href = 'categories.html'; }
        }
      });
      window.avartaVerticalGallery = verticalGalleryInstance;
    }
  }

  // Check user preference for reduced motion
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Update navbar active state indicator
  function updateNav(targetRoute) {
    const isExploreRoute = targetRoute === 'explore' || targetRoute === 'beyond-the-frame' || targetRoute === 'beyond' || targetRoute === 'quiz' || targetRoute === 'guess-painting' || targetRoute === 'guess' || targetRoute === 'guess-the-original' || targetRoute === 'beyond-avarta' || targetRoute === 'museums';
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#explore' || link.id === 'nav-explore' || link.id === 'nav-explore-btn') {
        if (isExploreRoute) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      } else if (href === `#${targetRoute}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (typeof window.updateNavGlassIndicator === 'function') {
      window.updateNavGlassIndicator();
    }

    const beyondDropdownItem = document.getElementById('explore-beyond-frame');
    if (beyondDropdownItem) {
      if (targetRoute === 'beyond-the-frame' || targetRoute === 'beyond') {
        beyondDropdownItem.classList.add('active-item');
      } else {
        beyondDropdownItem.classList.remove('active-item');
      }
    }

    const quizDropdownItem = document.getElementById('explore-quiz');
    if (quizDropdownItem) {
      if (targetRoute === 'quiz') {
        quizDropdownItem.classList.add('active-item');
      } else {
        quizDropdownItem.classList.remove('active-item');
      }
    }

    const guessDropdownItem = document.getElementById('explore-guess-painting');
    if (guessDropdownItem) {
      if (targetRoute === 'guess-painting' || targetRoute === 'guess' || targetRoute === 'guess-the-original') {
        guessDropdownItem.classList.add('active-item');
      } else {
        guessDropdownItem.classList.remove('active-item');
      }
    }

    const beyondAvartaDropdownItem = document.getElementById('explore-beyond-avarta');
    if (beyondAvartaDropdownItem) {
      if (targetRoute === 'beyond-avarta' || targetRoute === 'museums') {
        beyondAvartaDropdownItem.classList.add('active-item');
      } else {
        beyondAvartaDropdownItem.classList.remove('active-item');
      }
    }

    if (window.avartaDock && typeof window.avartaDock.setActive === 'function') {
      const dockKey = isExploreRoute ? 'explore' : targetRoute;
      window.avartaDock.setActive(dockKey);
    }
  }

  // Helper to hide all views cleanly
  function hideAllViews() {
    [homeView, aboutView, collectionView, exploreView, beyondView, quizView, guessView, beyondAvartaView].forEach(v => {
      if (v) {
        v.classList.remove('active');
        v.setAttribute('aria-hidden', 'true');
      }
    });

    if (introContainer) {
      introContainer.style.display = 'none';
      if (window.jQuery && window.jQuery('#hero-ripple').data('ripples')) {
        try { window.jQuery('#hero-ripple').ripples('pause'); } catch (e) {}
      }
    }

    const skipBtn = document.getElementById('intro-skip-btn');
    if (skipBtn) {
      skipBtn.style.display = 'none';
    }

    const corridorCanvas = document.getElementById('corridor-canvas');
    if (corridorCanvas) {
      corridorCanvas.style.display = 'none';
      corridorCanvas.style.opacity = '0';
      corridorCanvas.style.visibility = 'hidden';
    }

    document.body.classList.remove(
      'page-home-mode',
      'page-about-mode',
      'page-explore-mode',
      'page-beyond-mode',
      'page-quiz-mode',
      'page-guess-mode',
      'page-beyond-avarta-mode',
      'page-collection-mode'
    );
  }

  // Switch the DOM views and body scroll modes
  function setView(targetRoute) {
    currentRoute = targetRoute;
    hideAllViews();

    if (targetRoute === 'collection') {
      document.body.classList.add('page-collection-mode');
      if (collectionView) {
        collectionView.classList.add('active');
        collectionView.removeAttribute('aria-hidden');
      }

      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
      }
      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }
      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.pause === 'function') {
        window.avartaCorridor.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.disable === 'function') {
        window.avartaCards.disable();
      }

      window.scrollTo(0, 0);
      ensureVerticalGallery();
    } else if (targetRoute === 'about') {
      if (aboutView) {
        aboutView.classList.add('active');
        aboutView.removeAttribute('aria-hidden');
      }

      document.body.classList.add('page-about-mode');

      const corridorCanvas = document.getElementById('corridor-canvas');
      if (corridorCanvas) {
        corridorCanvas.style.display = 'block';
        corridorCanvas.style.opacity = '1';
        corridorCanvas.style.visibility = 'visible';
      }

      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
      }
      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }

      window.scrollTo(0, 0);

      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.enable === 'function') {
        window.avartaCards.enable();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.resume === 'function') {
        window.avartaCorridor.resume();
        window.avartaCorridor.goToIndex(0);
      }
    } else if (targetRoute === 'explore') {
      if (exploreView) {
        exploreView.classList.add('active');
        exploreView.removeAttribute('aria-hidden');
      }

      document.body.classList.add('page-explore-mode');

      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
      }
      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }

      window.scrollTo(0, 0);

      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.pause === 'function') {
        window.avartaCorridor.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.disable === 'function') {
        window.avartaCards.disable();
      }
    } else if (targetRoute === 'beyond-the-frame' || targetRoute === 'beyond') {
      if (beyondView) {
        beyondView.classList.add('active');
        beyondView.removeAttribute('aria-hidden');
      }

      document.body.classList.add('page-beyond-mode');

      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
      }
      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }

      window.scrollTo(0, 0);

      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.pause === 'function') {
        window.avartaCorridor.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.disable === 'function') {
        window.avartaCards.disable();
      }
    } else if (targetRoute === 'quiz') {
      if (quizView) {
        quizView.classList.add('active');
        quizView.removeAttribute('aria-hidden');
      }

      document.body.classList.add('page-quiz-mode');

      if (window.avartaQuiz && typeof window.avartaQuiz.renderQuestion === 'function') {
        window.avartaQuiz.renderQuestion(true);
      }

      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
      }
      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }

      window.scrollTo(0, 0);

      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.pause === 'function') {
        window.avartaCorridor.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.disable === 'function') {
        window.avartaCards.disable();
      }
    } else if (targetRoute === 'guess-painting' || targetRoute === 'guess' || targetRoute === 'guess-the-original') {
      if (guessView) {
        guessView.classList.add('active');
        guessView.removeAttribute('aria-hidden');
      }

      document.body.classList.add('page-guess-mode');

      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
      }
      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }

      window.scrollTo(0, 0);

      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.pause === 'function') {
        window.avartaCorridor.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.disable === 'function') {
        window.avartaCards.disable();
      }
    } else if (targetRoute === 'beyond-avarta' || targetRoute === 'museums') {
      if (beyondAvartaView) {
        beyondAvartaView.classList.add('active');
        beyondAvartaView.removeAttribute('aria-hidden');
      }

      document.body.classList.add('page-beyond-avarta-mode');

      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
      }
      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }

      window.scrollTo(0, 0);

      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.pause === 'function') {
        window.avartaCorridor.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.disable === 'function') {
        window.avartaCards.disable();
      }
    } else {
      // Home route
      document.body.classList.add('page-home-mode');

      if (homeView) {
        homeView.classList.add('active');
        homeView.removeAttribute('aria-hidden');
      }

      const skipBtn = document.getElementById('intro-skip-btn');
      if (skipBtn) {
        skipBtn.style.display = 'block';
      }

      if (introContainer) {
        introContainer.style.display = 'flex';
        introContainer.style.opacity = '1';
        if (window.jQuery && window.jQuery('#hero-ripple').data('ripples')) {
          try { window.jQuery('#hero-ripple').ripples('play'); } catch (e) {}
        }
      }

      if (window.avartaFluid && typeof window.avartaFluid.pause === 'function') {
        window.avartaFluid.pause();
      }
      if (window.avartaCorridor && typeof window.avartaCorridor.pause === 'function') {
        window.avartaCorridor.pause();
      }
      if (window.avartaCards && typeof window.avartaCards.disable === 'function') {
        window.avartaCards.disable();
      }

      const corridorCanvas = document.getElementById('corridor-canvas');
      if (corridorCanvas) {
        corridorCanvas.style.opacity = '0';
        corridorCanvas.style.visibility = 'hidden';
      }

      const waterCanvas = document.getElementById('water-canvas');
      if (waterCanvas) {
        waterCanvas.style.opacity = '0';
        waterCanvas.style.visibility = 'hidden';
        waterCanvas.style.display = 'none';
      }

      if (ambientOverlay) {
        ambientOverlay.style.opacity = '0';
        ambientOverlay.style.visibility = 'hidden';
      }

      const warpOverlay = document.getElementById('portal-world-warp');
      if (warpOverlay && warpOverlay.classList.contains('warping')) {
        warpOverlay.classList.remove('warping');
        warpOverlay.classList.add('dissolving');
        setTimeout(() => {
          warpOverlay.classList.remove('dissolving');
        }, 850);
      }

      window.scrollTo(0, 0);
    }

    updateNav(targetRoute);
  }

  function resolveRouteFromHash(hash) {
    if (!hash || hash === '#' || hash === '#home') return 'home';
    if (hash === '#about') return 'about';
    if (hash === '#collection') return 'collection';
    if (hash === '#explore') return 'explore';
    if (hash === '#quiz') return 'quiz';
    if (hash === '#guess-painting' || hash === '#guess' || hash === '#guess-the-original') return 'guess-painting';
    if (hash === '#beyond-avarta' || hash === '#museums') return 'beyond-avarta';
    if (hash === '#beyond-the-frame' || hash === '#beyond') return 'beyond-the-frame';
    return 'home';
  }

  function getHashForRoute(route) {
    if (route === 'about') return '#about';
    if (route === 'collection') return '#collection';
    if (route === 'explore') return '#explore';
    if (route === 'quiz') return '#quiz';
    if (route === 'guess-painting' || route === 'guess' || route === 'guess-the-original') return '#guess-painting';
    if (route === 'beyond-avarta' || route === 'museums') return '#beyond-avarta';
    if (route === 'beyond-the-frame' || route === 'beyond') return '#beyond-the-frame';
    return '#home';
  }

  // Cinematic Fade-to-Black Page Transition
  function navigateTo(targetRoute, updateHistory = true) {
    if (window.CollectionDetailView && typeof window.CollectionDetailView.close === 'function' && window.CollectionDetailView.isOpen) {
      window.CollectionDetailView.close(true);
    }

    if (targetRoute === currentRoute) {
      if (targetRoute === 'about' && window.avartaCards) {
        window.avartaCards.goToCard(0);
      }
      return;
    }

    if (isTransitioning) return;

    if (updateHistory) {
      const hash = getHashForRoute(targetRoute);
      history.pushState({ route: targetRoute }, '', hash);
    }

    // Instant switch if user prefers reduced motion
    if (prefersReducedMotion() || !transitionOverlay) {
      setView(targetRoute);
      return;
    }

    isTransitioning = true;

    // Phase 1: Fade overlay to solid black (~450ms)
    transitionOverlay.classList.add('active');

    setTimeout(() => {
      // Phase 2: Underneath black screen, swap page DOM and reset scroll position
      setView(targetRoute);

      // Phase 3: Fade overlay back out (~550ms)
      setTimeout(() => {
        transitionOverlay.classList.remove('active');

        // Allow click interactions once fade out finishes
        setTimeout(() => {
          isTransitioning = false;
        }, 550);
      }, 50);
    }, 450);
  }

  // Intercept navigation links
  function initNavigation() {
    document.addEventListener('click', function (e) {
      // Check if clicking the portal gate toggle on Card 10
      const gateBtn = e.target.closest('#gate-enter-toggle');
      if (gateBtn) {
        e.preventDefault();
        gateBtn.classList.add('is-clicked');

        if (window.avartaCorridor && typeof window.avartaCorridor.enterWorldAnimation === 'function') {
          window.avartaCorridor.enterWorldAnimation(() => {
            window.location.href = 'categories.html';
          });
        } else {
          window.location.href = 'categories.html';
        }
        return;
      }

      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      const targetRoute = resolveRouteFromHash(hash);
      
      e.preventDefault();
      navigateTo(targetRoute);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function () {
      const hash = window.location.hash;
      const targetRoute = resolveRouteFromHash(hash);
      navigateTo(targetRoute, false);
    });

    // Initial route check on page load
    const initialHash = window.location.hash;
    setView(resolveRouteFromHash(initialHash));

    // Navbar glass tint on scroll
    const navbar = document.getElementById('site-navbar');
    window.addEventListener('scroll', function () {
      if (navbar) {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }, { passive: true });

    // Initialize hero background audio
    heroAudio.init();

    // Start background music on first user interaction (required by browsers)
    let heroAudioStarted = false;
    function startHeroAudioOnInteraction() {
      if (heroAudioStarted) return;
      heroAudioStarted = true;
      heroAudio.play();
      document.removeEventListener('click', startHeroAudioOnInteraction);
      document.removeEventListener('touchstart', startHeroAudioOnInteraction);
      document.removeEventListener('keydown', startHeroAudioOnInteraction);
    }
    document.addEventListener('click', startHeroAudioOnInteraction, { once: false });
    document.addEventListener('touchstart', startHeroAudioOnInteraction, { once: false });
    document.addEventListener('keydown', startHeroAudioOnInteraction, { once: false });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }

  // Expose global navigate method for external triggers if needed
  window.avartaNavigate = navigateTo;
})();

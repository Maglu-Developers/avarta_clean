/**
 * AVĀRTĀ — Stacked-Card Full-Screen Experience
 * Manages 3D deck-of-cards transitions, wheel/touch/key inputs,
 * side progress indicators, and accessibility.
 */

(function () {
  const TOTAL_CARDS = 11;
  let currentIndex = 0;
  let isAnimating = false;
  let isEnabled = false;

  // DOM Elements
  let cardsContainer = null;
  let cards = [];
  let progressFill = null;
  let progressCurrentText = null;
  let progressDots = [];

  // Cursor Spotlight State for Card 0 (Flashlight effect with lag/easing)
  let spotlightEl = null;
  let spotCurrentX = window.innerWidth * 0.5;
  let spotCurrentY = window.innerHeight * 0.5;
  let spotTargetX = window.innerWidth * 0.5;
  let spotTargetY = window.innerHeight * 0.5;
  let spotRafId = null;

  function updateSpotlight() {
    if (!spotlightEl) return;
    // Smooth organic lag behind actual cursor
    spotCurrentX += (spotTargetX - spotCurrentX) * 0.085;
    spotCurrentY += (spotTargetY - spotCurrentY) * 0.085;

    spotlightEl.style.setProperty('--spot-x', `${spotCurrentX.toFixed(1)}px`);
    spotlightEl.style.setProperty('--spot-y', `${spotCurrentY.toFixed(1)}px`);

    if (currentIndex === 0) {
      spotRafId = requestAnimationFrame(updateSpotlight);
    } else {
      spotRafId = null;
    }
  }

  function onMouseMoveSpotlight(e) {
    spotTargetX = e.clientX;
    spotTargetY = e.clientY;
    if (currentIndex === 0 && !spotRafId) {
      spotRafId = requestAnimationFrame(updateSpotlight);
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function updateCards(prevIndex, newIndex) {
    cards.forEach((card, i) => {
      card.classList.remove('card-past', 'card-current', 'card-future', 'direction-down', 'direction-up');

      if (i < newIndex) {
        card.classList.add('card-past');
        card.setAttribute('aria-hidden', 'true');
      } else if (i === newIndex) {
        card.classList.add('card-current');
        card.removeAttribute('aria-hidden');
        if (newIndex > prevIndex) {
          card.classList.add('direction-down');
        } else if (newIndex < prevIndex) {
          card.classList.add('direction-up');
        }
      } else {
        card.classList.add('card-future');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    // Update Progress Indicator
    if (progressFill) {
      const pct = (newIndex / (TOTAL_CARDS - 1)) * 100;
      progressFill.style.height = `${pct}%`;
    }

    if (progressCurrentText) {
      progressCurrentText.textContent = String(newIndex).padStart(2, '0');
    }

    progressDots.forEach((dot, i) => {
      if (i === newIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Advance 3D Art Gallery Corridor Camera in sync with card
    if (window.avartaCorridor && typeof window.avartaCorridor.goToIndex === 'function') {
      window.avartaCorridor.goToIndex(newIndex);
    }

    // Resume cursor spotlight loop when returning to Card 0
    if (newIndex === 0 && spotlightEl && !spotRafId) {
      spotRafId = requestAnimationFrame(updateSpotlight);
    }
  }

  function goToCard(targetIndex) {
    if (targetIndex < 0 || targetIndex >= TOTAL_CARDS) return;
    if (targetIndex === currentIndex && cards[currentIndex] && cards[currentIndex].classList.contains('card-current')) return;
    if (isAnimating) return;

    isAnimating = true;
    const prevIndex = currentIndex;
    currentIndex = targetIndex;

    updateCards(prevIndex, currentIndex);

    const animDuration = prefersReducedMotion() ? 100 : 850;
    setTimeout(() => {
      isAnimating = false;
    }, animDuration);
  }

  function nextCard() {
    if (currentIndex < TOTAL_CARDS - 1) {
      goToCard(currentIndex + 1);
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      goToCard(currentIndex - 1);
    }
  }

  // Wheel input management with trackpad inertial scroll debouncing
  let wheelAccumulator = 0;
  let wheelTimer = null;
  const WHEEL_THRESHOLD = 45;

  function onWheel(e) {
    if (!isEnabled || isAnimating) return;
    e.preventDefault();

    wheelAccumulator += e.deltaY;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      wheelAccumulator = 0;
    }, 200);

    if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
      if (wheelAccumulator > 0) {
        nextCard();
      } else {
        prevCard();
      }
      wheelAccumulator = 0;
    }
  }

  // Touch Swipe for Mobile
  let touchStartY = 0;
  let touchStartX = 0;
  const TOUCH_THRESHOLD = 40;

  function onTouchStart(e) {
    if (!isEnabled) return;
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }
  }

  function onTouchMove(e) {
    if (!isEnabled) return;
    if (e.touches.length === 1) {
      // Prevent browser pull-to-refresh
      e.preventDefault();
    }
  }

  function onTouchEnd(e) {
    if (!isEnabled || isAnimating) return;
    if (e.changedTouches.length === 1) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;

      // Ensure primarily vertical swipe
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > TOUCH_THRESHOLD) {
        if (deltaY > 0) {
          nextCard();
        } else {
          prevCard();
        }
      }
    }
  }

  // Keyboard navigation
  function onKeyDown(e) {
    if (!isEnabled || isAnimating) return;

    // Don't intercept if focus is inside an input/textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault();
      nextCard();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault();
      prevCard();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToCard(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToCard(TOTAL_CARDS - 1);
    }
  }

  function init() {
    cardsContainer = document.getElementById('card-stack');
    if (!cardsContainer) return;

    cards = Array.from(cardsContainer.querySelectorAll('.stack-card'));
    progressFill = document.getElementById('stack-progress-fill');
    progressCurrentText = document.getElementById('progress-num-current');
    progressDots = Array.from(document.querySelectorAll('.progress-dot'));

    // Progress dot click handlers
    progressDots.forEach((dot) => {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        const index = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(index)) {
          goToCard(index);
        }
      });
    });

    // Card 0 scroll indicator click
    const scrollDownBtn = document.getElementById('about-scroll-down');
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', function (e) {
        e.preventDefault();
        nextCard();
      });
    }

    // Card 1 scroll cue click (Discover the Idea)
    const card1Cue = document.getElementById('card1-scroll-cue');
    if (card1Cue) {
      card1Cue.addEventListener('click', function (e) {
        e.preventDefault();
        goToCard(2);
      });
      card1Cue.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToCard(2);
        }
      });
    }

    // Card 0 cursor spotlight initialization
    spotlightEl = document.getElementById('hero-cursor-spotlight');
    if (spotlightEl) {
      window.addEventListener('mousemove', onMouseMoveSpotlight, { passive: true });
      spotRafId = requestAnimationFrame(updateSpotlight);
    }

    // Attach passive/non-passive listeners
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    // Initial state setup
    currentIndex = 0;
    updateCards(-1, 0);
  }

  function enable() {
    isEnabled = true;
    currentIndex = 0;
    updateCards(-1, 0);
    if (spotlightEl && !spotRafId) {
      spotRafId = requestAnimationFrame(updateSpotlight);
    }
  }

  function disable() {
    isEnabled = false;
    if (spotRafId) {
      cancelAnimationFrame(spotRafId);
      spotRafId = null;
    }
  }

  // Expose global API for router
  window.avartaCards = {
    goToCard: goToCard,
    nextCard: nextCard,
    prevCard: prevCard,
    enable: enable,
    disable: disable,
    reset: function () {
      currentIndex = 0;
      updateCards(-1, 0);
    },
    getCurrentIndex: function () {
      return currentIndex;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

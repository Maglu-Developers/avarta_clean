/**
 * AVĀRTĀ — BEYOND THE FRAME & EXPLORE TOGGLE CONTROLLER
 * Fully responsive, interactive art interpretation module.
 */

(function (global) {
  'use strict';

  // Curated Masterpieces dataset for Beyond the Frame gallery
  const MASTERPIECES = [
    {
      id: 'starry_night',
      title: 'The Starry Night',
      artist: 'Vincent van Gogh',
      year: '1889',
      movement: 'Post-Impressionism',
      image: './assets/paintings/starry_night.jpg'
    },
    {
      id: 'girl_pearl_earring',
      title: 'Girl with a Pearl Earring',
      artist: 'Johannes Vermeer',
      year: '1665',
      movement: 'Dutch Golden Age',
      image: './assets/paintings/girl_pearl_earring.jpg'
    },
    {
      id: 'wanderer',
      title: 'Wanderer Above the Sea of Fog',
      artist: 'Caspar David Friedrich',
      year: '1818',
      movement: 'Romanticism',
      image: './assets/paintings/wanderer.jpg'
    },
    {
      id: 'the_kiss',
      title: 'The Kiss (Der Kuss)',
      artist: 'Gustav Klimt',
      year: '1908',
      movement: 'Vienna Secession',
      image: './assets/paintings/the_kiss.jpg'
    },
    {
      id: 'birth_of_venus',
      title: 'The Birth of Venus',
      artist: 'Sandro Botticelli',
      year: '1485',
      movement: 'Early Renaissance',
      image: './assets/paintings/birth_of_venus.jpg'
    },
    {
      id: 'great_wave',
      title: 'The Great Wave off Kanagawa',
      artist: 'Katsushika Hokusai',
      year: '1831',
      movement: 'Edo Period · Ukiyo-e',
      image: './assets/paintings/great_wave.jpg'
    },
    {
      id: 'mona_lisa',
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: '1503',
      movement: 'High Renaissance',
      image: './assets/paintings/mona_lisa.jpg'
    },
    {
      id: 'water_lilies',
      title: 'Water Lilies (Nymphéas)',
      artist: 'Claude Monet',
      year: '1916',
      movement: 'Impressionism',
      image: './assets/paintings/water_lilies.jpg'
    }
  ];

  class BeyondTheFrameController {
    constructor() {
      this.currentArtworkIndex = 0;
      this.maxWords = 50;
      this.submittedPerspectives = {}; // Cached interpretations by artwork ID

      this._initElements();
      this._bindEvents();
      this._bindExploreDropdown();
      this.renderCurrentArtwork();
    }

    _initElements() {
      // Containers
      this.viewContainer = document.getElementById('beyond-view');
      this.inputPanel = document.getElementById('beyondInputPanel');
      this.perspectiveCard = document.getElementById('beyondPerspectiveCard');

      // Painting Display
      this.artworkImg = document.getElementById('beyondArtworkImg');
      this.artworkTitle = document.getElementById('beyondArtworkTitle');
      this.artworkMeta = document.getElementById('beyondArtworkMeta');
      this.prevArtworkBtn = document.getElementById('beyondPrevArtworkBtn');
      this.nextArtworkBtn = document.getElementById('beyondNextArtworkBtn');
      this.prevArtworkBtnMobile = document.getElementById('beyondPrevArtworkBtnMobile');
      this.nextArtworkBtnMobile = document.getElementById('beyondNextArtworkBtnMobile');
      this.artCounter = document.getElementById('beyondArtCounter');

      // Input & Feedback
      this.textarea = document.getElementById('beyondTextarea');
      this.wordCounter = document.getElementById('beyondWordCounter');
      this.feedbackMsg = document.getElementById('beyondFeedbackMsg');
      this.submitBtn = document.getElementById('beyondSubmitBtn');

      // Presentation Card
      this.perspectiveText = document.getElementById('beyondPerspectiveText');
      this.resetBtn = document.getElementById('beyondResetBtn');

      // Explore Dropdown
      this.exploreWrapper = document.getElementById('nav-explore-wrapper');
      this.exploreBtn = document.getElementById('nav-explore-btn');
      this.exploreDropdown = document.getElementById('exploreDropdown');
      this.exploreBeyondLink = document.getElementById('explore-beyond-frame');
      this.exploreQuizLink = document.getElementById('explore-quiz');
      this.exploreGuessLink = document.getElementById('explore-guess-painting');
      this.exploreBeyondAvartaLink = document.getElementById('explore-beyond-avarta');
    }

    _bindEvents() {
      if (this.textarea) {
        this.textarea.addEventListener('input', () => this.handleTextareaInput());

        // Handle Paste: intelligently restrict pasted text to first 50 words
        this.textarea.addEventListener('paste', (e) => {
          e.preventDefault();
          const pastedText = (e.clipboardData || window.clipboardData).getData('text') || '';
          const words = pastedText.trim().split(/\s+/).filter(Boolean);

          const currentVal = this.textarea.value;
          const currentWords = currentVal.trim().split(/\s+/).filter(Boolean);
          const remainingSlots = Math.max(0, this.maxWords - currentWords.length);

          if (words.length > remainingSlots) {
            const allowedPastedWords = words.slice(0, remainingSlots);
            const textToInsert = (currentVal ? currentVal + ' ' : '') + allowedPastedWords.join(' ');
            this.textarea.value = textToInsert;
            this.showFeedback('Pasted text restricted to the 50-word limit.', false);
          } else {
            const textToInsert = (currentVal ? currentVal + ' ' : '') + pastedText;
            this.textarea.value = textToInsert;
          }
          this.handleTextareaInput();
        });

        // Handle keydown: prevent typing additional words when 50 words are reached
        this.textarea.addEventListener('keydown', (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            this.handleSubmit();
            return;
          }

          // Allow navigation, deletion, copy/select shortcuts
          const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End', 'Tab', 'Escape'
          ];
          if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
            return;
          }

          const currentWords = this.countWords(this.textarea.value);
          const isSpace = e.key === ' ' || e.key === 'Enter';

          if (currentWords >= this.maxWords && isSpace) {
            e.preventDefault();
            this.showFeedback('Maximum 50 words reached.', true);
          }
        });
      }

      if (this.submitBtn) {
        this.submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleSubmit();
        });
      }

      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleReset();
        });
      }

      if (this.prevArtworkBtn) {
        this.prevArtworkBtn.addEventListener('click', () => this.navigateArtwork(-1));
      }

      if (this.nextArtworkBtn) {
        this.nextArtworkBtn.addEventListener('click', () => this.navigateArtwork(1));
      }

      if (this.prevArtworkBtnMobile) {
        this.prevArtworkBtnMobile.addEventListener('click', () => this.navigateArtwork(-1));
      }

      if (this.nextArtworkBtnMobile) {
        this.nextArtworkBtnMobile.addEventListener('click', () => this.navigateArtwork(1));
      }
    }

    _bindExploreDropdown() {
      if (!this.exploreBtn || !this.exploreWrapper) return;

      // Open on hover for fast preview
      this.exploreWrapper.addEventListener('mouseenter', () => {
        this.exploreWrapper.classList.add('is-open');
        this.exploreBtn.setAttribute('aria-expanded', 'true');
      });

      this.exploreWrapper.addEventListener('mouseleave', () => {
        this.exploreWrapper.classList.remove('is-open');
        this.exploreBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle side-by-side cards dropdown when clicking Explore
      this.exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = this.exploreWrapper.classList.toggle('is-open');
        this.exploreBtn.setAttribute('aria-expanded', String(isOpen));
      });

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!this.exploreWrapper.contains(e.target)) {
          this.exploreWrapper.classList.remove('is-open');
          this.exploreBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.exploreWrapper.classList.contains('is-open')) {
          this.exploreWrapper.classList.remove('is-open');
          this.exploreBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Handle Beyond the Frame link click inside dropdown
      if (this.exploreBeyondLink) {
        this.exploreBeyondLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.exploreWrapper.classList.remove('is-open');
          this.exploreBtn.setAttribute('aria-expanded', 'false');
          if (typeof window.avartaNavigate === 'function') {
            window.avartaNavigate('beyond-the-frame');
          } else {
            window.location.hash = '#beyond-the-frame';
          }
        });
      }

      // Handle Quiz link click inside dropdown
      if (this.exploreQuizLink) {
        this.exploreQuizLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.exploreWrapper.classList.remove('is-open');
          this.exploreBtn.setAttribute('aria-expanded', 'false');
          if (typeof window.avartaNavigate === 'function') {
            window.avartaNavigate('quiz');
          } else {
            window.location.hash = '#quiz';
          }
        });
      }

      // Handle Guess the Original link click inside dropdown
      if (this.exploreGuessLink) {
        this.exploreGuessLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.exploreWrapper.classList.remove('is-open');
          this.exploreBtn.setAttribute('aria-expanded', 'false');
          if (typeof window.avartaNavigate === 'function') {
            window.avartaNavigate('guess-painting');
          } else {
            window.location.hash = '#guess-painting';
          }
        });
      }

      // Handle Beyond AVARTA link click inside dropdown
      if (this.exploreBeyondAvartaLink) {
        this.exploreBeyondAvartaLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.exploreWrapper.classList.remove('is-open');
          this.exploreBtn.setAttribute('aria-expanded', 'false');
          if (typeof window.avartaNavigate === 'function') {
            window.avartaNavigate('beyond-avarta');
          } else {
            window.location.hash = '#beyond-avarta';
          }
        });
      }
    }

    countWords(text) {
      if (!text) return 0;
      const trimmed = text.trim();
      if (!trimmed) return 0;
      // Match words separated by whitespace
      const words = trimmed.split(/\s+/).filter(Boolean);
      return words.length;
    }

    handleTextareaInput() {
      let text = this.textarea.value;
      const words = text.trim().split(/\s+/).filter(Boolean);
      let wordsCount = words.length;

      // If words exceed maxWords, restrict text cleanly to the first 50 words without abruptly deleting
      if (wordsCount > this.maxWords) {
        const truncatedWords = words.slice(0, this.maxWords);
        this.textarea.value = truncatedWords.join(' ');
        wordsCount = this.maxWords;
        this.showFeedback('Maximum 50 words reached.', true);
      } else {
        this.hideFeedback();
      }

      this.textarea.classList.remove('has-error');

      // Update Live Counter
      if (this.wordCounter) {
        this.wordCounter.textContent = `${wordsCount} / ${this.maxWords} words`;
        this.wordCounter.classList.remove('limit-near', 'limit-exceeded', 'limit-max');

        if (wordsCount >= this.maxWords) {
          this.wordCounter.classList.add('limit-max');
          this.showFeedback('Maximum 50 words reached.', false);
        } else if (wordsCount >= this.maxWords - 5) {
          this.wordCounter.classList.add('limit-near');
        }

        if (this.submitBtn) {
          this.submitBtn.disabled = (wordsCount === 0);
        }
      }
    }

    showFeedback(message, isError = false) {
      if (!this.feedbackMsg) return;
      this.feedbackMsg.textContent = message;
      this.feedbackMsg.className = `beyond-feedback-msg show ${isError ? 'error' : ''}`;
    }

    hideFeedback() {
      if (!this.feedbackMsg) return;
      this.feedbackMsg.className = 'beyond-feedback-msg';
      this.feedbackMsg.textContent = '';
    }

    handleSubmit() {
      const text = this.textarea.value.trim();
      const wordsCount = this.countWords(text);

      // 1. Empty check
      if (!text || wordsCount === 0) {
        this.showFeedback('Your perspective is waiting to be written.', false);
        this.textarea.classList.add('has-error');
        this.textarea.focus();
        return;
      }

      // 2. Word limit check
      if (wordsCount > this.maxWords) {
        this.showFeedback('Maximum 50 words reached.', true);
        this.textarea.classList.add('has-error');
        this.textarea.focus();
        return;
      }

      // 3. Save interpretation
      const currentArt = MASTERPIECES[this.currentArtworkIndex];
      this.submittedPerspectives[currentArt.id] = text;

      // 4. Reveal Perspective Card
      if (this.perspectiveText) {
        this.perspectiveText.textContent = `“${text}”`;
      }

      if (this.inputPanel) {
        this.inputPanel.style.display = 'none';
      }

      if (this.perspectiveCard) {
        this.perspectiveCard.classList.add('is-active');
        this.perspectiveCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    handleReset() {
      const currentArt = MASTERPIECES[this.currentArtworkIndex];
      delete this.submittedPerspectives[currentArt.id];

      if (this.textarea) {
        this.textarea.value = '';
        this.handleTextareaInput();
      }

      if (this.perspectiveCard) {
        this.perspectiveCard.classList.remove('is-active');
      }

      if (this.inputPanel) {
        this.inputPanel.style.display = 'flex';
        this.inputPanel.style.animation = 'beyondCardFadeIn 0.4s ease forwards';
      }

      this.hideFeedback();
      if (this.textarea) {
        this.textarea.focus();
      }
    }

    navigateArtwork(direction) {
      this.currentArtworkIndex = (this.currentArtworkIndex + direction + MASTERPIECES.length) % MASTERPIECES.length;
      this.renderCurrentArtwork();
    }

    setArtwork(artworkData) {
      if (!artworkData) return;
      // Find if artwork exists in list or add/update
      let matchIdx = MASTERPIECES.findIndex(m => m.id === artworkData.id || m.title === artworkData.title);
      if (matchIdx !== -1) {
        this.currentArtworkIndex = matchIdx;
      } else {
        MASTERPIECES.push({
          id: artworkData.id || 'custom_' + Date.now(),
          title: artworkData.title || 'Masterpiece',
          artist: artworkData.artist || 'Curated Artist',
          year: artworkData.year || 'Historic Era',
          movement: artworkData.movement || artworkData.category || 'Fine Art',
          image: artworkData.image || './assets/paintings/starry_night.jpg'
        });
        this.currentArtworkIndex = MASTERPIECES.length - 1;
      }
      this.renderCurrentArtwork();
    }

    renderCurrentArtwork() {
      const artwork = MASTERPIECES[this.currentArtworkIndex];
      if (!artwork) return;

      if (this.artworkImg) {
        this.artworkImg.style.opacity = '0';
        setTimeout(() => {
          this.artworkImg.src = artwork.image;
          this.artworkImg.alt = `${artwork.title} by ${artwork.artist}`;
          this.artworkImg.onload = () => {
            this.artworkImg.style.opacity = '1';
          };
        }, 150);
      }

      if (this.artworkTitle) {
        this.artworkTitle.textContent = artwork.title;
      }

      if (this.artworkMeta) {
        this.artworkMeta.textContent = `${artwork.artist} • ${artwork.year} • ${artwork.movement}`;
      }

      if (this.artCounter) {
        this.artCounter.textContent = `${this.currentArtworkIndex + 1} / ${MASTERPIECES.length}`;
      }

      // Check if user already submitted a perspective for this artwork
      const savedPerspective = this.submittedPerspectives[artwork.id];
      if (savedPerspective) {
        if (this.perspectiveText) this.perspectiveText.textContent = `“${savedPerspective}”`;
        if (this.inputPanel) this.inputPanel.style.display = 'none';
        if (this.perspectiveCard) this.perspectiveCard.classList.add('is-active');
      } else {
        if (this.perspectiveCard) this.perspectiveCard.classList.remove('is-active');
        if (this.inputPanel) this.inputPanel.style.display = 'flex';
        if (this.textarea) {
          this.textarea.value = '';
          this.handleTextareaInput();
        }
      }
    }
  }

  // Initialize once DOM is ready
  function init() {
    window.avartaBeyondTheFrame = new BeyondTheFrameController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);

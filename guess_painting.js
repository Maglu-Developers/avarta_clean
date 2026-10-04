/**
 * AVĀRTĀ AUCTION HOUSE — PAINT VS PRETEND
 * Private Art Authentication & Connoisseur Desk Controller
 * Fixed 16:9 stage, zero idle tint, single-click judgment, and 2.5s reveal timeline.
 */

(function (global) {
  'use strict';

  // 20 Curated Original vs AI-Generated Painting Pairs with authentic curatorial notes
  const PAINTING_PAIRS = [
    {
      id: 1,
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: '1503',
      originalImg: './assets/guess_paintings/original/1o.webp',
      aiImg: './assets/guess_paintings/ai/1ai.png',
      curatorNoteOriginal: "The authentic masterpiece displays Leonardo’s celebrated sfumato technique—up to thirty semi-translucent glazes layered with zero discernible brush strokes, producing the famous enigmatic gaze and soft atmospheric veil.",
      curatorNoteAi: "The synthetic rendering introduces hyper-symmetric facial contouring, over-sharpened garment embroideries, and lacks Leonardo’s subtle organic craquelure and multi-tiered glaze transitions."
    },
    {
      id: 2,
      title: 'The Starry Night',
      artist: 'Vincent van Gogh',
      year: '1889',
      originalImg: './assets/guess_paintings/original/2o.jpg',
      aiImg: './assets/guess_paintings/ai/2ai.png',
      curatorNoteOriginal: "Van Gogh’s original features visceral impasto—thick pigment ridges applied directly from the tube and sculpted with reed pens and palette knives, revealing individual bristle drag marks and physical paint peaks.",
      curatorNoteAi: "The pretend synthesis creates mathematically continuous swirling bands that mimic the composition but lack physical oil paste elevation, canvas weave resistance, and raw chromatic vibration."
    },
    {
      id: 3,
      title: 'Girl with a Pearl Earring',
      artist: 'Johannes Vermeer',
      year: '1665',
      originalImg: './assets/guess_paintings/original/3o.jpg',
      aiImg: './assets/guess_paintings/ai/3ai.png',
      curatorNoteOriginal: "Vermeer achieves the pearl’s luminosity with only two masterstrokes of lead white: a crisp upper highlight and a soft reflected glow catching the girl’s linen collar against shadowy chiaroscuro.",
      curatorNoteAi: "The generative variant smoothens the ultramarine blue turban folds into digital gradient vectors and exhibits photographic lighting uniformity alien to 17th-century camera obscura glazing."
    },
    {
      id: 4,
      title: 'The Kiss',
      artist: 'Gustav Klimt',
      year: '1908',
      originalImg: './assets/guess_paintings/original/4o.jpg',
      aiImg: './assets/guess_paintings/ai/4ai.png',
      curatorNoteOriginal: "Klimt’s Golden Phase triumph combines beaten gold leaf, silver leaf accents, and intricate Byzantine tesserae textures laid directly onto oil ground with exquisite tactile variety.",
      curatorNoteAi: "The pretend piece duplicates the geometric motifs but flattens the distinctive gold leaf patina, lacking Klimt’s hand-applied metal leaf fissures and rich gesso relief."
    },
    {
      id: 5,
      title: 'The Birth of Venus',
      artist: 'Sandro Botticelli',
      year: '1485',
      originalImg: './assets/guess_paintings/original/5o.jpg',
      aiImg: './assets/guess_paintings/ai/5ai.png',
      curatorNoteOriginal: "Botticelli painted this icon on fine canvas with egg tempera and alabaster powder, characterized by lyrical serpentine drafting, rhythmic hair ribbons, and crisp gothic linear purity.",
      curatorNoteAi: "The synthetic copy blends the figure’s contours with modern photographic softening, muddling Botticelli’s signature incised graphic outlines and delicate tempera transparency."
    },
    {
      id: 6,
      title: 'The Great Wave off Kanagawa',
      artist: 'Katsushika Hokusai',
      year: '1831',
      originalImg: './assets/guess_paintings/original/6o.jpg',
      aiImg: './assets/guess_paintings/ai/6ai.png',
      curatorNoteOriginal: "A masterwork woodblock print utilizing newly imported Prussian blue pigment. Genuine impressions feature razor-sharp keyblock chisel lines and subtle baren hand-rubbing grain in the sky.",
      curatorNoteAi: "The synthetic piece produces amorphous foam spray droplets and lacks the precise relief woodcarver cut lines and authentic multi-block registration edges."
    },
    {
      id: 7,
      title: 'The Scream',
      artist: 'Edvard Munch',
      year: '1893',
      originalImg: './assets/guess_paintings/original/7o.jpg',
      aiImg: './assets/guess_paintings/ai/7ai.png',
      curatorNoteOriginal: "Munch executed this agony using tempera and crayon on unprimed cardboard, creating frantic, unblended diagonal striations that preserve the artist’s raw psychological velocity.",
      curatorNoteAi: "The synthetic facsimile softens the raw crayon hatch marks into smooth digital curves, losing the gritty tactile friction of Munch’s fragile cardboard substrate."
    },
    {
      id: 8,
      title: 'Wanderer above the Sea of Fog',
      artist: 'Caspar David Friedrich',
      year: '1818',
      originalImg: './assets/guess_paintings/original/8o.jpg',
      aiImg: './assets/guess_paintings/ai/8ai.png',
      curatorNoteOriginal: "The definitive Romantic sublime. Friedrich's atmospheric perspective employs razor-sharp basalt precipices in the foreground against ethereal, translucent vapor glazes in the distant Elbe mountains.",
      curatorNoteAi: "The machine model generates repetitive cloud swirls that blur structural geological strata, lacking Friedrich's strict geometric symmetry and spiritual precision."
    },
    {
      id: 9,
      title: 'Water Lilies',
      artist: 'Claude Monet',
      year: '1916',
      originalImg: './assets/guess_paintings/original/9o.jpg',
      aiImg: './assets/guess_paintings/ai/9ai.png',
      curatorNoteOriginal: "Monet’s late impressionism exhibits broad, energetic scumbling and fractured pigment juxtaposed directly on the canvas to merge optically as shimmering water reflections.",
      curatorNoteAi: "The synthetic synthesis blurs water vegetation into continuous digital watercolor washes, failing to replicate Monet’s dense, dried impasto ridges and optical color mixing."
    },
    {
      id: 10,
      title: 'The Night Watch',
      artist: 'Rembrandt van Rijn',
      year: '1642',
      originalImg: './assets/guess_paintings/original/10o.jpg',
      aiImg: './assets/guess_paintings/ai/10ai.png',
      curatorNoteOriginal: "Rembrandt’s legendary chiaroscuro spotlights Captain Banning Cocq with rich lead-tin yellow impasto while maintaining translucent, warm amber-brown glazes within the deep shadow recessions.",
      curatorNoteAi: "The digital copy crushes the atmospheric shadows into uniform dead blacks and renders facial highlights with unnatural plastic gloss rather than Rembrandt's gritty lead impasto."
    },
    {
      id: 11,
      title: 'A Sunday on La Grande Jatte',
      artist: 'Georges Seurat',
      year: '1884',
      originalImg: './assets/guess_paintings/original/11o.jpg',
      aiImg: './assets/guess_paintings/ai/11ai.png',
      curatorNoteOriginal: "Pure scientific pointillism. Seurat deposited millions of distinct, unblended chromatic micro-dots designed to optically harmonize solely in the retina of the observing viewer.",
      curatorNoteAi: "The pretend piece displays random synthetic pixel clusters that disregard Seurat's strict divisionist color theory and lack the uniform circular tip of his dotting technique."
    },
    {
      id: 12,
      title: 'The School of Athens',
      artist: 'Raphael',
      year: '1511',
      originalImg: './assets/guess_paintings/original/12o.jpg',
      aiImg: './assets/guess_paintings/ai/12ai.png',
      curatorNoteOriginal: "High Renaissance fresco mastery featuring mathematically rigorous one-point perspective and harmonious Roman architectural coffered vaults framing Plato and Aristotle.",
      curatorNoteAi: "The synthetic recreation introduces perspective drift in the coffered arch ceiling and renders secondary philosophers with melted anatomical details and distorted drapery folds."
    },
    {
      id: 13,
      title: 'Liberty Leading the People',
      artist: 'Eugène Delacroix',
      year: '1830',
      originalImg: './assets/guess_paintings/original/13o.jpg',
      aiImg: './assets/guess_paintings/ai/13ai.png',
      curatorNoteOriginal: "Delacroix’s turbulent Romantic brushwork uses slashing diagonals, vibrant vermilion glazes on the Phrygian cap, and dynamic pigment dragging through the barricade gunpowder smoke.",
      curatorNoteAi: "The pretend synthesis displays digital Gaussian cloud noise rather than hand-dragged oil scumbles, flattening the dramatic atmospheric depth of the Parisian rebellion."
    },
    {
      id: 14,
      title: 'Las Meninas',
      artist: 'Diego Velázquez',
      year: '1656',
      originalImg: './assets/guess_paintings/original/14o.jpg',
      aiImg: './assets/guess_paintings/ai/14ai.png',
      curatorNoteOriginal: "Velázquez’s magical brush economy: up close, the Infanta’s dress dissolves into abstract calligraphy of loose silver strokes; step back, and it crystallizes into breathtaking realism.",
      curatorNoteAi: "The generative engine attempts to over-render every individual silver thread with rigid mechanical sharpness, entirely missing Velázquez’s optical impressionist genius."
    },
    {
      id: 15,
      title: 'Lady with an Ermine',
      artist: 'Leonardo da Vinci',
      year: '1489',
      originalImg: './assets/guess_paintings/original/15o.jpg',
      aiImg: './assets/guess_paintings/ai/15ai.png',
      curatorNoteOriginal: "Depicts Cecilia Gallerani in dynamic three-quarter rotation. Leonardo’s anatomical acuity is reflected in the ermine’s pristine white coat, painted with single-bristle sable brushes.",
      curatorNoteAi: "The synthetic version gives the ermine unnatural facial features and blends the hand’s tendon definition into smooth porcelain, erasing Leonardo’s underlying anatomical study."
    },
    {
      id: 16,
      title: 'The Milkmaid',
      artist: 'Johannes Vermeer',
      year: '1658',
      originalImg: './assets/guess_paintings/original/16o.webp',
      aiImg: './assets/guess_paintings/ai/16ai.png',
      curatorNoteOriginal: "Celebrated for Vermeer’s pointillé technique—minute flecks of bright yellow and lead-white paint capturing daylight bouncing off the textured rustic bread loaf crust.",
      curatorNoteAi: "The synthetic piece blurs the crust pointillé into flat yellow patches and misinterprets the rough earthenware terracotta pitcher with glossy, modern porcelain reflections."
    },
    {
      id: 17,
      title: 'The Blue Boy',
      artist: 'Thomas Gainsborough',
      year: '1770',
      originalImg: './assets/guess_paintings/original/17o.jpg',
      aiImg: './assets/guess_paintings/ai/17ai.png',
      curatorNoteOriginal: "Gainsborough’s virtuoso tribute to Van Dyck features dazzling calligraphic flourishes of cerulean, cobalt, and indigo glazes layered over warm umber undertones.",
      curatorNoteAi: "The synthetic costume lacks Gainsborough’s rapid, liquid brush cadence, substituting authentic silk satin weave with airbrushed digital sheen."
    },
    {
      id: 18,
      title: 'Primavera',
      artist: 'Sandro Botticelli',
      year: '1482',
      originalImg: './assets/guess_paintings/original/18o.webp',
      aiImg: './assets/guess_paintings/ai/18ai.png',
      curatorNoteOriginal: "Features more than five hundred meticulously cataloged botanical specimens on the forest floor, each executed in tempera grassa with scientific botanical fidelity.",
      curatorNoteAi: "The algorithmic imitation invents generalized, fantasy flower petals that fail to match any authentic 15th-century Tuscan flora species cataloged in the Uffizi original."
    },
    {
      id: 19,
      title: 'Portrait of Baldassare Castiglione',
      artist: 'Raphael',
      year: '1515',
      originalImg: './assets/guess_paintings/original/19o.jpg',
      aiImg: './assets/guess_paintings/ai/19ai.png',
      curatorNoteOriginal: "A triumph of understated elegance. Raphael harmonizes soft grey squirrel fur, black velvet, and pleated white linen with intimate, psychologically penetrating human warmth.",
      curatorNoteAi: "The synthetic rendering loses the tactile distinction between the fur pile and the matte velvet doublet, presenting uniform synthetic cloth texturing."
    },
    {
      id: 20,
      title: 'Portrait of Louis XIV',
      artist: 'Hyacinthe Rigaud',
      year: '1701',
      originalImg: './assets/guess_paintings/original/20o.jpg',
      aiImg: './assets/guess_paintings/ai/20ai.png',
      curatorNoteOriginal: "The definitive symbol of the Sun King: towering Baroque theatricality with authentic ermine black-tail tufts, deep royal blue velvet, and embroidered gold fleur-de-lis.",
      curatorNoteAi: "The algorithmic copy introduces repetitive geometric errors in the coronation fleur-de-lis patterns and lacks the heavy, light-absorbent weight of French royal coronation velvet."
    }
  ];

  class PaintVsPretendController {
    constructor() {
      this.pairs = [...PAINTING_PAIRS];
      this.totalRounds = 20;
      this.currentRound = 0;
      this.score = 0;
      this.answered = false;
      this.currentSides = { A: null, B: null, originalSide: 'A' };
      this.activeTimers = [];

      this._initElements();
      this._bindEvents();
      this.renderRound();
    }

    _initElements() {
      this.view = document.getElementById('guess-view');
      this.stageCard = document.getElementById('guessStageCard');
      this.lotPill = document.getElementById('stageLotPill');
      this.lotText = document.getElementById('guessLotText');

      // Progress elements
      this.progressBar = document.getElementById('stageProgressBar');
      this.progressNum = document.getElementById('stageProgressNum');

      // Stage Card (Holds Easels and Paintings)
      this.stageCard = document.getElementById('guessStageCard');

      // Mounts and Images
      this.cardA = document.getElementById('guessCardA');
      this.cardB = document.getElementById('guessCardB');
      this.imgA = document.getElementById('guessImgA');
      this.imgB = document.getElementById('guessImgB');
      this.badgeA = document.getElementById('guessBadgeA');
      this.badgeB = document.getElementById('guessBadgeB');

      // Reveal Dock elements
      this.verdictLine = document.getElementById('curatorVerdictLine');
      this.artworkMeta = document.getElementById('curatorArtworkMeta');
      this.verdictNote = document.getElementById('curatorVerdictNote');
      this.revealAction = document.getElementById('curatorRevealAction');
      this.nextBtn = document.getElementById('guessNextBtn');
      this.nextBtnText = document.getElementById('nextBtnText');

      // Certificate / Final Results Elements
      this.resultsCard = document.getElementById('guessResultsCard');
      this.scoreNumber = document.getElementById('guessScoreNumber');
      this.scorePercent = document.getElementById('guessScorePercent');
      this.correctCountEl = document.getElementById('guessCorrectCount');
      this.incorrectCountEl = document.getElementById('guessIncorrectCount');
      this.performanceQuote = document.getElementById('guessPerformanceQuote');
      this.playAgainBtn = document.getElementById('guessPlayAgainBtn');
    }

    _bindEvents() {
      // Direct Single Click on Painting A or B triggers immediate judgment
      if (this.cardA) {
        this.cardA.addEventListener('click', () => this.handleDirectJudgment('A'));
      }
      if (this.cardB) {
        this.cardB.addEventListener('click', () => this.handleDirectJudgment('B'));
      }

      // Next Lot action button
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.handleNextRound());
      }

      // Re-examine action in Certificate
      if (this.playAgainBtn) {
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
      }

      // Back toggle to explore sections
      const backToggle = document.getElementById('guessBackToggle');
      if (backToggle) {
        backToggle.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.avartaNavigate) {
            window.avartaNavigate('explore');
          } else {
            window.location.hash = '#explore';
          }
        });
      }

      // Return link in Curator's Ledger
      const returnExploreLink = document.getElementById('guessReturnExploreLink');
      if (returnExploreLink) {
        returnExploreLink.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.avartaNavigate) {
            window.avartaNavigate('explore');
          } else {
            window.location.hash = '#explore';
          }
        });
      }
    }

    _clearTimers() {
      if (this.activeTimers && this.activeTimers.length) {
        this.activeTimers.forEach(id => clearTimeout(id));
        this.activeTimers = [];
      }
    }

    renderRound() {
      this._clearTimers();

      const pair = this.pairs[this.currentRound];
      if (!pair) return;

      this.answered = false;

      // 50/50 randomized placement of original painting
      const isOriginalA = Math.random() < 0.5;
      this.currentSides = {
        A: isOriginalA ? { type: 'original', src: pair.originalImg } : { type: 'ai', src: pair.aiImg },
        B: isOriginalA ? { type: 'ai', src: pair.aiImg } : { type: 'original', src: pair.originalImg },
        originalSide: isOriginalA ? 'A' : 'B'
      };

      // Update Lot Counter (Format: LOT 01 / 20)
      const lotNum = String(this.currentRound + 1).padStart(2, '0');
      if (this.lotText) {
        this.lotText.textContent = `LOT ${lotNum} / ${this.totalRounds}`;
      }
      if (this.lotPill) {
        this.lotPill.style.display = this.currentRound === 0 ? 'none' : 'inline-flex';
      }

      // Update bottom progress line
      if (this.progressBar) {
        const percent = ((this.currentRound + 1) / this.totalRounds) * 100;
        this.progressBar.style.width = `${percent}%`;
      }
      if (this.progressNum) {
        this.progressNum.textContent = `${lotNum} / ${this.totalRounds}`;
      }

      // Reset Stage & View Classes
      if (this.view) {
        this.view.classList.remove('show-results');
      }
      if (this.stageCard) {
        this.stageCard.classList.remove('in-reveal', 'is-locked');
      }

      // Reset Mounts
      [this.cardA, this.cardB].forEach((card) => {
        if (card) {
          card.classList.remove('is-picked', 'is-other', 'stamp-active', 'show-counterpart');
        }
      });

      // Set Painting Images
      if (this.imgA) {
        this.imgA.src = this.currentSides.A.src;
        this.imgA.alt = `Lot ${this.currentRound + 1} Artwork A`;
      }
      if (this.imgB) {
        this.imgB.src = this.currentSides.B.src;
        this.imgB.alt = `Lot ${this.currentRound + 1} Artwork B`;
      }

      // Reset Stamp Badges
      if (this.badgeA) {
        this.badgeA.className = 'curator-seal-stamp';
      }
      if (this.badgeB) {
        this.badgeB.className = 'curator-seal-stamp';
      }

      // Reset Reveal Dock elements
      if (this.verdictLine) {
        this.verdictLine.classList.remove('is-visible');
        this.verdictLine.textContent = '';
      }
      if (this.artworkMeta) {
        this.artworkMeta.classList.remove('is-visible');
        this.artworkMeta.textContent = '';
      }
      if (this.verdictNote) {
        this.verdictNote.classList.remove('is-visible');
        this.verdictNote.textContent = '';
      }
      if (this.revealAction) {
        this.revealAction.classList.remove('is-visible');
      }

      // Reset Next button text
      if (this.nextBtnText) {
        this.nextBtnText.textContent = this.currentRound === this.totalRounds - 1 ? 'VIEW DOSSIER' : 'NEXT LOT';
      }

      // Ensure stage is visible and results hidden
      if (this.stageCard) this.stageCard.style.display = 'block';
      if (this.resultsCard) this.resultsCard.classList.remove('is-active');
    }

    handleDirectJudgment(choice) {
      // 1. Immediately lock input — ignore further clicks during reveal
      if (this.answered) return;
      this.answered = true;

      if (this.stageCard) {
        this.stageCard.classList.add('is-locked');
      }

      const pair = this.pairs[this.currentRound];
      const isCorrect = choice === this.currentSides.originalSide;

      // 2. Score tracking
      if (isCorrect) {
        this.score++;
      }

      const pickedCard = choice === 'A' ? this.cardA : this.cardB;
      const otherCard = choice === 'A' ? this.cardB : this.cardA;
      const isOriginalA = this.currentSides.originalSide === 'A';

      // Configure stamps
      if (this.badgeA) {
        this.badgeA.className = `curator-seal-stamp ${isOriginalA ? 'stamp-original' : 'stamp-pretend'}`;
        const titleSpan = this.badgeA.querySelector('.seal-title');
        if (titleSpan) titleSpan.textContent = isOriginalA ? 'ORIGINAL' : 'PRETEND';
      }
      if (this.badgeB) {
        this.badgeB.className = `curator-seal-stamp ${!isOriginalA ? 'stamp-original' : 'stamp-pretend'}`;
        const titleSpan = this.badgeB.querySelector('.seal-title');
        if (titleSpan) titleSpan.textContent = !isOriginalA ? 'ORIGINAL' : 'PRETEND';
      }

      // ------------------------------------------------------------------------
      // DIRECT FEEDBACK & AUTOMATIC TRANSITION (NO REMARKS, AUTO-ADVANCE)
      // ------------------------------------------------------------------------

      // Highlight picked painting and animate its stamp immediately
      if (pickedCard) {
        pickedCard.classList.add('is-picked', 'stamp-active');
      }

      // If user was incorrect, reveal the original painting's stamp too
      if (!isCorrect && otherCard) {
        otherCard.classList.add('show-counterpart', 'stamp-active');
      }

      // Automatically advance to the next lot after a brief 850ms feedback window
      this.activeTimers.push(setTimeout(() => {
        this.handleNextRound();
      }, 850));
    }

    handleNextRound() {
      if (!this.answered) return;

      this._clearTimers();

      if (this.currentRound < this.totalRounds - 1) {
        this.currentRound++;
        this.renderRound();
      } else {
        this.showResults();
      }
    }

    showResults() {
      this._clearTimers();

      const backToggle = document.getElementById('guessBackToggle');
      if (backToggle) backToggle.style.display = 'none';
      document.body.classList.add('show-results');

      if (this.stageCard) this.stageCard.style.display = 'none';
      if (this.view) this.view.classList.add('show-results');
      if (this.resultsCard) {
        this.resultsCard.classList.add('is-active');
      }

      const total = this.totalRounds;
      const correct = this.score;
      const incorrect = total - correct;
      const percentage = Math.round((correct / total) * 100);

      const pad = (n) => String(n).padStart(2, '0');

      let quote = '';
      if (correct >= 18) {
        quote = '“Masterful connoisseurship. You possess an extraordinary eye for genuine pigment and classical masterwork glaze.”';
      } else if (correct >= 14) {
        quote = '“Where imitation rivals mastery, discernment becomes the true art.”';
      } else if (correct >= 10) {
        quote = '“Keen perceptual instincts. Machine synthesis is becoming formidable, yet your curatorial eye held strong.”';
      } else {
        quote = '“Algorithmic imitation and fine art are blurring together. Continue training your eye in the AVĀRTĀ galleries.”';
      }

      if (this.performanceQuote) {
        this.performanceQuote.textContent = quote;
      }

      const waxSeal = document.getElementById('ledgerWaxSeal');
      if (waxSeal) waxSeal.classList.remove('stamped');

      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        if (this.scoreNumber) this.scoreNumber.textContent = `${pad(correct)} / ${pad(total)}`;
        if (this.scorePercent) this.scorePercent.textContent = `${percentage}% VERIFIED PROVENANCE`;
        if (this.correctCountEl) this.correctCountEl.textContent = pad(correct);
        if (this.incorrectCountEl) this.incorrectCountEl.textContent = pad(incorrect);
        if (waxSeal) waxSeal.classList.add('stamped');
        return;
      }

      // Smooth count-up animation over 900ms
      const startTime = performance.now();
      const duration = 900;

      const animateCount = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease out quadratic
        const ease = 1 - (1 - progress) * (1 - progress);

        const currentCorrect = Math.round(correct * ease);
        const currentIncorrect = Math.round(incorrect * ease);
        const currentPct = Math.round(percentage * ease);

        if (this.scoreNumber) this.scoreNumber.textContent = `${pad(currentCorrect)} / ${pad(total)}`;
        if (this.scorePercent) this.scorePercent.textContent = `${currentPct}% VERIFIED PROVENANCE`;
        if (this.correctCountEl) this.correctCountEl.textContent = pad(currentCorrect);
        if (this.incorrectCountEl) this.incorrectCountEl.textContent = pad(currentIncorrect);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          if (this.scoreNumber) this.scoreNumber.textContent = `${pad(correct)} / ${pad(total)}`;
          if (this.scorePercent) this.scorePercent.textContent = `${percentage}% VERIFIED PROVENANCE`;
          if (this.correctCountEl) this.correctCountEl.textContent = pad(correct);
          if (this.incorrectCountEl) this.incorrectCountEl.textContent = pad(incorrect);

          // Stamp wax seal in with bounce after score animation completes
          setTimeout(() => {
            if (waxSeal) waxSeal.classList.add('stamped');
          }, 150);
        }
      };

      requestAnimationFrame(animateCount);
    }

    restartGame() {
      this.currentRound = 0;
      this.score = 0;
      this.answered = false;

      const backToggle = document.getElementById('guessBackToggle');
      if (backToggle) backToggle.style.display = '';
      document.body.classList.remove('show-results');

      const waxSeal = document.getElementById('ledgerWaxSeal');
      if (waxSeal) waxSeal.classList.remove('stamped');

      if (this.resultsCard) {
        this.resultsCard.classList.remove('is-active');
      }
      if (this.stageCard) {
        this.stageCard.style.display = 'block';
      }
      if (this.view) {
        this.view.classList.remove('show-results');
      }

      this.renderRound();

      if (this.view) {
        this.view.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // Initialize once DOM is ready
  function init() {
    window.avartaGuessPainting = new PaintVsPretendController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);

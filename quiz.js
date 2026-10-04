/**
 * AVĀRTĀ — 20-QUESTION ART QUIZ IMMERSION CONTROLLER
 * Elegant interactive museum challenge.
 */

(function (global) {
  'use strict';

  // 20 Curated Art History & Masterpiece Questions Database
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      category: 'Renaissance Technique',
      question: 'Which painting technique, developed during the Renaissance, uses subtle, smoky gradations of tone and color without harsh outlines, famously seen in the Mona Lisa?',
      options: [
        { id: 'A', text: 'Sfumato' },
        { id: 'B', text: 'Chiaroscuro' },
        { id: 'C', text: 'Impasto' },
        { id: 'D', text: 'Grisaille' }
      ],
      correctId: 'A',
      explanation: 'Sfumato (derived from the Italian for "smoke") creates soft, imperceptible transitions between colors and tones.'
    },
    {
      id: 2,
      category: 'Post-Impressionism',
      question: 'Vincent van Gogh painted \'The Starry Night\' in 1889 while residing at which location?',
      options: [
        { id: 'A', text: 'Saint-Paul asylum in Saint-Rémy-de-Provence' },
        { id: 'B', text: 'Montmartre studio in Paris' },
        { id: 'C', text: 'The Yellow House in Arles' },
        { id: 'D', text: 'Auvers-sur-Oise clinic' }
      ],
      correctId: 'A',
      explanation: 'Van Gogh created The Starry Night from his barred east-facing window at the Saint-Paul asylum in Saint-Rémy.'
    },
    {
      id: 3,
      category: 'Dutch Golden Age',
      question: 'Which master artist painted the monumental civic guard masterpiece \'The Night Watch\' in 1642?',
      options: [
        { id: 'A', text: 'Johannes Vermeer' },
        { id: 'B', text: 'Rembrandt van Rijn' },
        { id: 'C', text: 'Frans Hals' },
        { id: 'D', text: 'Jan Steen' }
      ],
      correctId: 'B',
      explanation: 'Rembrandt van Rijn was commissioned by Captain Frans Banning Cocq to portray his civic guard company.'
    },
    {
      id: 4,
      category: 'Early Renaissance',
      question: 'In Sandro Botticelli\'s \'The Birth of Venus\', what carries the goddess as she arrives at the seashore?',
      options: [
        { id: 'A', text: 'A seafoam chariot' },
        { id: 'B', text: 'A giant scallop shell' },
        { id: 'C', text: 'A golden crested wave' },
        { id: 'D', text: 'A marble pedestal' }
      ],
      correctId: 'B',
      explanation: 'Venus is depicted arriving at the shores of Cyprus standing atop a giant scallop shell propelled by the Zephyrs.'
    },
    {
      id: 5,
      category: '19th Century Movements',
      question: 'Which art movement focused on capturing the fleeting impressions of natural light and atmosphere using rapid, visible brushstrokes?',
      options: [
        { id: 'A', text: 'Impressionism' },
        { id: 'B', text: 'Neoclassicism' },
        { id: 'C', text: 'Baroque' },
        { id: 'D', text: 'Constructivism' }
      ],
      correctId: 'A',
      explanation: 'Impressionism, originating in 19th-century France, prioritized atmospheric light, open composition, and visible brushwork.'
    },
    {
      id: 6,
      category: 'Vienna Secession',
      question: 'Gustav Klimt\'s iconic golden masterwork \'The Kiss\' (1907–1908) belongs to which artistic movement?',
      options: [
        { id: 'A', text: 'Dadaism' },
        { id: 'B', text: 'Vienna Secession' },
        { id: 'C', text: 'Bauhaus' },
        { id: 'D', text: 'Futurism' }
      ],
      correctId: 'B',
      explanation: 'The Kiss represents the pinnacle of Klimt\'s "Golden Phase" within the avant-garde Vienna Secession movement.'
    },
    {
      id: 7,
      category: 'High Renaissance',
      question: 'Where is Leonardo da Vinci\'s famous monumental fresco \'The Last Supper\' preserved today?',
      options: [
        { id: 'A', text: 'Sistine Chapel in Rome' },
        { id: 'B', text: 'Uffizi Gallery in Florence' },
        { id: 'C', text: 'Santa Maria delle Grazie in Milan' },
        { id: 'D', text: 'Musée du Louvre in Paris' }
      ],
      correctId: 'C',
      explanation: 'The Last Supper covers the refectory wall of the Convent of Santa Maria delle Grazie in Milan, Italy.'
    },
    {
      id: 8,
      category: 'Edo Period Art',
      question: 'Which Japanese master printmaker created \'The Great Wave off Kanagawa\' as part of \'Thirty-Six Views of Mount Fuji\'?',
      options: [
        { id: 'A', text: 'Utagawa Hiroshige' },
        { id: 'B', text: 'Katsushika Hokusai' },
        { id: 'C', text: 'Kitagawa Utamaro' },
        { id: 'D', text: 'Tōshūsai Sharaku' }
      ],
      correctId: 'B',
      explanation: 'Katsushika Hokusai created the ukiyo-e woodblock print in the early 1830s during the Edo period.'
    },
    {
      id: 9,
      category: 'Romanticism',
      question: '\'Wanderer above the Sea of Fog\' (1818), symbolizing sublime solitary contemplation, was painted by which German Romantic master?',
      options: [
        { id: 'A', text: 'Caspar David Friedrich' },
        { id: 'B', text: 'Albrecht Dürer' },
        { id: 'C', text: 'Hans Holbein' },
        { id: 'D', text: 'Lucas Cranach' }
      ],
      correctId: 'A',
      explanation: 'Caspar David Friedrich captured the Romantic sublime with a solitary traveler looking out over rugged mountain peaks.'
    },
    {
      id: 10,
      category: 'Dutch Masterpieces',
      question: 'Johannes Vermeer\'s \'Girl with a Pearl Earring\' is traditionally categorized as what specific type of portrait study?',
      options: [
        { id: 'A', text: 'Tronie' },
        { id: 'B', text: 'Vanitas' },
        { id: 'C', text: 'Pronkstilleven' },
        { id: 'D', text: 'Veduta' }
      ],
      correctId: 'A',
      explanation: 'A tronie in 17th-century Dutch art was an idealized study of facial expression and exotic costume rather than an individual portrait.'
    },
    {
      id: 11,
      category: 'Impressionism',
      question: 'Which French artist spent his later years painting the legendary \'Water Lilies\' (Nymphéas) series at his garden estate in Giverny?',
      options: [
        { id: 'A', text: 'Pierre-Auguste Renoir' },
        { id: 'B', text: 'Claude Monet' },
        { id: 'C', text: 'Édouard Manet' },
        { id: 'D', text: 'Camille Pissarro' }
      ],
      correctId: 'B',
      explanation: 'Claude Monet cultivated water lily gardens at his home in Giverny, painting over 250 canvases capturing fluid light and water reflections.'
    },
    {
      id: 12,
      category: 'Renaissance Frescoes',
      question: 'Which Pope commissioned Michelangelo to paint the vault ceiling of the Sistine Chapel between 1508 and 1512?',
      options: [
        { id: 'A', text: 'Pope Leo X' },
        { id: 'B', text: 'Pope Julius II' },
        { id: 'C', text: 'Pope Clement VII' },
        { id: 'D', text: 'Pope Paul III' }
      ],
      correctId: 'B',
      explanation: 'Pope Julius II, the "Warrior Pope", commissioned Michelangelo to decorate the ceiling of the Sistine Chapel.'
    },
    {
      id: 13,
      category: 'Baroque Aesthetics',
      question: 'What artistic term refers to the extreme and dramatic contrast between deep shadows and bright light popularized by Caravaggio?',
      options: [
        { id: 'A', text: 'Chiaroscuro' },
        { id: 'B', text: 'Gouache' },
        { id: 'C', text: 'Encaustic' },
        { id: 'D', text: 'Pointillism' }
      ],
      correctId: 'A',
      explanation: 'Chiaroscuro (Italian for "light-dark") produces theatrical volume and atmospheric tension in oil paintings.'
    },
    {
      id: 14,
      category: 'Neoclassicism',
      question: 'Which Neoclassical masterwork by Jacques-Louis David commemorates Napoleon Bonaparte crowning Joséphine at Notre-Dame Cathedral?',
      options: [
        { id: 'A', text: 'Oath of the Horatii' },
        { id: 'B', text: 'The Coronation of Napoleon' },
        { id: 'C', text: 'The Death of Marat' },
        { id: 'D', text: 'Napoleon Crossing the Alps' }
      ],
      correctId: 'B',
      explanation: 'The Coronation of Napoleon (1807), measuring nearly 10 meters wide, depicts the 1804 coronation ceremony at Notre-Dame.'
    },
    {
      id: 15,
      category: 'Classical Renaissance',
      question: 'In Raphael\'s fresco \'The School of Athens\', which two central philosophers are shown walking side by side through the grand vaulted hall?',
      options: [
        { id: 'A', text: 'Socrates and Pythagoras' },
        { id: 'B', text: 'Plato and Aristotle' },
        { id: 'C', text: 'Epicurus and Zeno' },
        { id: 'D', text: 'Heraclitus and Diogenes' }
      ],
      correctId: 'B',
      explanation: 'Plato (pointing toward the heavens) and Aristotle (gesturing toward the earth) stand at the focal vanishing point of the fresco.'
    },
    {
      id: 16,
      category: 'Art Mediums',
      question: 'Which painting method involves applying dry powder pigments mixed with pure water directly onto freshly spread wet lime plaster?',
      options: [
        { id: 'A', text: 'Buon Fresco' },
        { id: 'B', text: 'Tempera Grassa' },
        { id: 'C', text: 'Oil Glazing' },
        { id: 'D', text: 'Encaustic Wax' }
      ],
      correctId: 'A',
      explanation: 'Buon Fresco ("true fresco") chemically integrates pigment with the curing plaster wall as it dries.'
    },
    {
      id: 17,
      category: 'Romantic Masterpieces',
      question: 'Eugène Delacroix\'s 1830 painting \'Liberty Leading the People\' commemorates which historic event in France?',
      options: [
        { id: 'A', text: 'The French Revolution of 1789' },
        { id: 'B', text: 'The July Revolution of 1830' },
        { id: 'C', text: 'The Paris Commune of 1871' },
        { id: 'D', text: 'The Storming of the Bastille' }
      ],
      correctId: 'B',
      explanation: 'Delacroix painted the allegorical figure of Liberty (Marianne) leading citizens during the Trois Glorieuses (July Revolution of 1830).'
    },
    {
      id: 18,
      category: 'Neo-Impressionism',
      question: 'Georges Seurat pioneered Pointillism with which monumental 1884–1886 work portraying Parisians relaxing on an island in the Seine?',
      options: [
        { id: 'A', text: 'Bathers at Asnières' },
        { id: 'B', text: 'A Sunday on La Grande Jatte' },
        { id: 'C', text: 'The Circus' },
        { id: 'D', text: 'Young Woman Powdering Herself' }
      ],
      correctId: 'B',
      explanation: 'A Sunday on La Grande Jatte is Seurat\'s most celebrated masterpiece composed of tiny, distinct dots of pure pigment.'
    },
    {
      id: 19,
      category: 'Spanish Baroque',
      question: 'Which 1656 Spanish masterpiece by Diego Velázquez presents an intricate visual puzzle of the Infanta Margarita and the artist painting in his studio?',
      options: [
        { id: 'A', text: 'Las Meninas' },
        { id: 'B', text: 'The Surrender of Breda' },
        { id: 'C', text: 'The Waterseller of Seville' },
        { id: 'D', text: 'Portrait of Innocent X' }
      ],
      correctId: 'A',
      explanation: 'Las Meninas (The Ladies-in-Waiting) is regarded as one of the most intellectually analyzed paintings in Western art history.'
    },
    {
      id: 20,
      category: 'Artistic Symbolism',
      question: 'Which genre of symbolic still-life painting features skulls, fading flowers, and hourglasses to remind viewers of the transience of earthly life?',
      options: [
        { id: 'A', text: 'Trompe-l\'œil' },
        { id: 'B', text: 'Vanitas' },
        { id: 'C', text: 'Bodegón' },
        { id: 'D', text: 'Veduta' }
      ],
      correctId: 'B',
      explanation: 'Vanitas still-lifes (from the Latin for "emptiness") flourished in 16th and 17th-century Flanders and the Netherlands.'
    }
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  class QuizController {
    constructor() {
      this.questions = QUIZ_QUESTIONS;
      this.totalQuestions = this.questions.length;
      this.currentIndex = 0;
      this.selectedOptionId = null;
      this.userAnswers = []; // Records user responses
      this.score = 0;
      this.isTransitioning = false;

      this._initElements();
      this._bindEvents();
      this.renderQuestion(true);
    }

    _initElements() {
      this.view = document.getElementById('quiz-view');
      this.stageCard = document.getElementById('quizStageCard');
      this.resultsCard = document.getElementById('quizResultsCard');

      // Progress elements
      this.progressText = document.getElementById('quizProgressText');
      this.progressFill = document.getElementById('quizProgressFill');

      // Question elements
      this.categoryEl = document.getElementById('quizQuestionCategory');
      this.questionTextEl = document.getElementById('quizQuestionText');
      this.optionsContainer = document.getElementById('quizOptionsContainer');
      this.feedbackBox = document.getElementById('quizFeedbackBox');

      // Action buttons
      this.nextBtn = document.getElementById('quizNextBtn');
      this.selectionPrompt = document.getElementById('quizSelectionPrompt');

      // Results elements
      this.scoreNumber = document.getElementById('quizScoreNumber');
      this.scorePercent = document.getElementById('quizScorePercent');
      this.correctCountEl = document.getElementById('quizCorrectCount');
      this.incorrectCountEl = document.getElementById('quizIncorrectCount');
      this.performanceQuote = document.getElementById('quizPerformanceQuote');
      this.tryAgainBtn = document.getElementById('quizTryAgainBtn');
    }

    _bindEvents() {
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.handleNextQuestion());
      }

      if (this.tryAgainBtn) {
        this.tryAgainBtn.addEventListener('click', () => this.restartQuiz());
      }
    }

    renderQuestion(animate = true) {
      const q = this.questions[this.currentIndex];
      if (!q) return;

      this.selectedOptionId = null;

      // Unique question key to cleanly track question lifecycle
      if (this.stageCard) {
        this.stageCard.setAttribute('data-question-key', `question-${q.id}`);
        this.stageCard.classList.remove('has-answer', 'is-exiting', 'is-hidden');
      }

      // Update Progress Counter & Fill
      if (this.progressText) {
        this.progressText.textContent = `QUESTION ${this.currentIndex + 1} / ${this.totalQuestions}`;
      }
      if (this.progressFill) {
        const percent = ((this.currentIndex + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${percent}%`;
      }

      // Populate Question Info
      if (this.categoryEl) this.categoryEl.textContent = q.category;
      if (this.questionTextEl) this.questionTextEl.textContent = q.question;

      // Unmount old options and mount fresh options (.q-option with style="--i:index")
      if (this.optionsContainer) {
        this.optionsContainer.classList.remove('has-selection');
        this.optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'quiz-option-btn q-option';
          btn.style.setProperty('--i', idx);
          btn.setAttribute('data-id', opt.id);
          btn.setAttribute('aria-label', `Option ${opt.id}: ${opt.text}`);
          btn.innerHTML = `
            <span class="quiz-option-badge">${opt.id}</span>
            <span class="quiz-option-text">${opt.text}</span>
          `;
          btn.addEventListener('click', () => this.selectOption(opt.id));
          this.optionsContainer.appendChild(btn);
        });
      }

      // Reset Feedback & Controls
      if (this.feedbackBox) {
        this.feedbackBox.className = 'quiz-feedback-box';
        this.feedbackBox.textContent = '';
      }
      if (this.selectionPrompt) {
        this.selectionPrompt.textContent = 'Select an option to proceed';
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = true;
        this.nextBtn.innerHTML = this.currentIndex === this.totalQuestions - 1
          ? '<span>VIEW RESULTS</span><span class="quiz-btn-arrow">→</span>'
          : '<span>NEXT</span><span class="quiz-btn-arrow">→</span>';
      }

      // Trigger ENTER animation
      if (this.stageCard) {
        if (animate) {
          void this.stageCard.offsetWidth;
          this.stageCard.classList.add('is-entering');

          setTimeout(() => {
            if (this.stageCard) {
              this.stageCard.classList.remove('is-entering');
            }
            this.isTransitioning = false;
          }, 1200);
        } else {
          this.stageCard.classList.remove('is-entering');
          this.isTransitioning = false;
        }
      }
    }

    selectOption(optionId) {
      if (this.isTransitioning) return;
      if (this.selectedOptionId === optionId) return;

      this.selectedOptionId = optionId;

      // Add .has-answer to .q-block so other options dim
      if (this.stageCard) {
        this.stageCard.classList.add('has-answer');
      }

      if (this.optionsContainer) {
        this.optionsContainer.classList.add('has-selection');
        const optionBtns = this.optionsContainer.querySelectorAll('.q-option, .quiz-option-btn');
        optionBtns.forEach((btn) => {
          const id = btn.getAttribute('data-id');
          if (id === optionId) {
            btn.classList.add('is-selected', 'selected');
          } else {
            btn.classList.remove('is-selected', 'selected');
          }
        });
      }

      if (this.selectionPrompt) {
        this.selectionPrompt.textContent = 'Ready to continue';
      }

      if (this.nextBtn) {
        this.nextBtn.disabled = false;
      }
    }

    async handleNextQuestion() {
      if (this.isTransitioning || !this.selectedOptionId) return;

      const q = this.questions[this.currentIndex];
      const isCorrect = this.selectedOptionId === q.correctId;

      if (isCorrect) {
        this.score++;
      }

      this.userAnswers.push({
        questionId: q.id,
        selectedId: this.selectedOptionId,
        isCorrect: isCorrect
      });

      // Lock Next button while the sequence runs
      this.isTransitioning = true;
      if (this.nextBtn) {
        this.nextBtn.disabled = true;
      }

      const block = this.stageCard || document.querySelector('.q-block');

      // 1. EXIT (420ms)
      if (block) {
        block.classList.remove('is-entering', 'is-hidden');
        void block.offsetWidth;
        block.classList.add('is-exiting');
      }
      if (this.progressText) {
        this.progressText.classList.add('is-fading');
      }

      await sleep(420);

      // 2. EMPTY BEAT (200ms)
      if (block) {
        block.classList.remove('is-exiting');
        block.classList.add('is-hidden');
      }

      await sleep(200);

      // Check if finished
      if (this.currentIndex >= this.totalQuestions - 1) {
        if (this.progressText) {
          this.progressText.classList.remove('is-fading');
        }
        this.showResults();
        this.isTransitioning = false;
        return;
      }

      // 3. SHOW NEXT QUESTION
      this.currentIndex++;
      this.renderQuestion(false);

      if (this.progressText) {
        this.progressText.classList.remove('is-fading');
      }

      const newBlock = this.stageCard || document.querySelector('.q-block');
      if (newBlock) {
        newBlock.classList.remove('is-exiting', 'is-hidden', 'has-answer');
        void newBlock.offsetWidth;
        newBlock.classList.add('is-entering');
      }

      await sleep(1200);

      if (newBlock) {
        newBlock.classList.remove('is-entering');
      }
      this.isTransitioning = false;
    }

    showResults() {
      if (this.stageCard) {
        this.stageCard.style.display = 'none';
        this.stageCard.classList.remove('is-exiting', 'is-empty-beat', 'is-entering');
      }
      if (this.resultsCard) this.resultsCard.classList.add('is-active');

      const total = this.totalQuestions;
      const correct = this.score;
      const incorrect = total - correct;
      const percentage = Math.round((correct / total) * 100);

      if (this.scoreNumber) this.scoreNumber.textContent = `${correct} / ${total}`;
      if (this.scorePercent) this.scorePercent.textContent = `${percentage}%`;
      if (this.correctCountEl) this.correctCountEl.textContent = correct;
      if (this.incorrectCountEl) this.incorrectCountEl.textContent = incorrect;

      // Tiered Performance Message
      let message = '';
      if (correct >= 18) {
        message = '“Exceptional. Your eye for art is remarkable.”';
      } else if (correct >= 14) {
        message = '“Excellent. You have a strong knowledge of art.”';
      } else if (correct >= 10) {
        message = '“Good. There is more of the art world waiting to be discovered.”';
      } else {
        message = '“Every masterpiece has more to reveal. Explore further.”';
      }

      if (this.performanceQuote) {
        this.performanceQuote.textContent = message;
      }

      if (this.resultsCard) {
        this.resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    restartQuiz() {
      this.currentIndex = 0;
      this.score = 0;
      this.selectedOptionId = null;
      this.userAnswers = [];
      this.isTransitioning = false;

      if (this.resultsCard) {
        this.resultsCard.classList.remove('is-active');
      }
      if (this.stageCard) {
        this.stageCard.style.display = 'flex';
        this.stageCard.className = 'quiz-stage-card q-block';
      }
      if (this.progressText) {
        this.progressText.classList.remove('is-fading');
      }

      this.renderQuestion(true);

      if (this.view) {
        this.view.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // Initialize once DOM is ready
  function init() {
    window.avartaQuiz = new QuizController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);

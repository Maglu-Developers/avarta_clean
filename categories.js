/**
 * VISION [INDEX] — MASTER ARCHIVE & PAINTING LIBRARY ENGINE
 * Supports:
 * 1. Cinematic Parallax Landing Page (5 Masterpieces)
 * 2. 20-Category 3D Coverflow Home Screen
 * 3. Dedicated Painting Library with 20 Categories, Grid Explorer, and Lightbox
 */

(function () {
  'use strict';

  // ==========================================================================
  // CURATED ARTWORK FOCAL POSITIONS FOR ORNATE BAROQUE FRAMING
  // Calibrated to align key subjects/faces/compositional centers precisely in the aperture
  // ==========================================================================
  const ARTWORK_FOCAL_POSITIONS = {
    'historical': '42% 40%',      // Rembrandt's Night Watch - Captain & Lieutenant
    'mythological': '50% 35%',    // Botticelli's Birth of Venus - Venus on scallop shell
    'royalty': '45% 40%',         // Velázquez's Las Meninas - Infanta Margarita
    'battle': '50% 25%',          // Delacroix's Liberty - Liberty & tricolor flag
    'landscapes': '50% 40%',      // Friedrich's Wanderer - Wanderer over mist
    'seascapes': '44% 50%',       // Hokusai's Great Wave - Cresting claw & Mt Fuji
    'nature': '50% 50%',          // Monet's Water Lilies - Lily pond
    'wildlife': '50% 55%',        // Rousseau's Tiger - Leaping tiger in jungle
    'floral': '50% 50%',          // Van Gogh's Sunflowers - Golden sunflowers in vase
    'portraits': '50% 25%',       // Vermeer's Girl with Pearl Earring - Face, turban & pearl
    'figurative': '50% 25%',      // Klimt's The Kiss - Golden embrace & faces
    'romance': '54% 38%',         // Fragonard's The Swing - Lady on swing & flying shoe
    'drama': '38% 45%',           // Munch's The Scream - Agonized figure
    'spirituality': '48% 45%',   // Michelangelo's Creation of Adam - Touching fingertips
    'culture': '55% 45%',         // Seurat's Sunday on Grande Jatte - Strolling park figures
    'ancient': '50% 45%',         // Raphael's School of Athens - Plato & Aristotle under arch
    'architecture': '50% 40%',    // Bruegel's Tower of Babel - Tower ascending into clouds
    'fantasy': '50% 45%',         // Bosch's Garden of Earthly Delights - Surreal central garden
    'abstract': '50% 50%',        // Kandinsky's Composition VIII - Balanced geometric harmony
    'stilllife': '50% 45%'        // van Huysum's Still Life - Fruit basket & rich floral bouquet
  };

  function getArtworkPosition(catId) {
    return ARTWORK_FOCAL_POSITIONS[catId] || 'center center';
  }

  // ==========================================================================
  // 20 CURATED CATEGORIES & PAINTINGS DATABASE
  // ==========================================================================
  const CATEGORIES = [
    {
      id: 'historical',
      num: '01',
      name: 'Historical',
      titleMain: 'HISTORICAL',
      titleSub: '— CHRONICLES',
      tag: 'HISTORICAL',
      subtitle: 'Chronicles of human triumph, revolution, and epochal transformations.',
      image: './assets/categories/cat1_historical.jpg',
      audio: './audio/history.mp3',
      paintings: [
        {
          title: 'The Night Watch',
          artist: 'Rembrandt van Rijn',
          year: '1642',
          era: 'Dutch Golden Age',
          medium: 'Oil on canvas',
          museum: 'Rijksmuseum, Amsterdam',
          image: './assets/categories/cat1_historical.jpg',
          description: 'The Night Watch is one of Rembrandt\'s most celebrated works, known for its dramatic composition, masterful use of light and shadow, and the dynamic portrayal of a militia company.'
        }
      ]
    },
    {
      id: 'mythological',
      num: '02',
      name: 'Mythological',
      titleMain: 'MYTHOLOGICAL',
      titleSub: '— PANTHEON',
      tag: 'MYTHOLOGICAL',
      subtitle: 'Immortal deities, heroic allegories, and ancient folklore.',
      image: './assets/categories/cat2_mythological.jpg',
      audio: './audio/mystical.mp3',
      paintings: [
        {
          title: 'The Birth of Venus',
          artist: 'Sandro Botticelli',
          year: 'c. 1485',
          era: 'Early Renaissance',
          medium: 'Tempera on canvas',
          museum: 'Uffizi Gallery, Florence',
          image: './assets/categories/cat2_mythological.jpg',
          description: 'Venus emerging from the sea foam as a fully grown woman arriving at the seashore upon a giant scallop shell.'
        }
      ]
    },
    {
      id: 'royalty',
      num: '03',
      name: 'Royalty',
      titleMain: 'ROYALTY',
      titleSub: '— MONARCHY',
      tag: 'ROYALTY',
      subtitle: 'Regal portraits, coronation robes, and imperial court splendor.',
      image: './assets/categories/cat3_royalty.jpg',
      audio: './audio/royal.mp3',
      paintings: [
        {
          title: 'Portrait of Louis XIV',
          artist: 'Hyacinthe Rigaud',
          year: '1701',
          era: 'Baroque',
          medium: 'Oil on canvas',
          museum: 'Musée du Louvre, Paris',
          image: './assets/categories/cat3_royalty.jpg',
          description: 'The definitive grand state portrait of the Sun King in ceremonial coronation robes adorned with fleurs-de-lis.'
        }
      ]
    },
    {
      id: 'battle',
      num: '04',
      name: 'Battle & Warfare',
      titleMain: 'BATTLE & WARFARE',
      titleSub: '— MARTIAL',
      tag: 'BATTLE & WARFARE',
      subtitle: 'Epic clashes of civilizations, military valor, and heroic conquests.',
      image: './assets/categories/cat4_battle.jpg',
      audio: './audio/battle and warfare.mp3',
      paintings: [
        {
          title: 'Liberty Leading the People',
          artist: 'Eugène Delacroix',
          year: '1830',
          era: 'Romanticism',
          medium: 'Oil on canvas',
          museum: 'Musée du Louvre, Paris',
          image: './assets/categories/cat4_battle.jpg',
          description: 'An iconic commemoration of the July Revolution of 1830 personifying Liberty leading fighters into battle.'
        }
      ]
    },
    {
      id: 'landscapes',
      num: '05',
      name: 'Landscapes',
      titleMain: 'LANDSCAPES',
      titleSub: '— VISTAS',
      tag: 'LANDSCAPES',
      subtitle: 'Sublime mountain horizons, misty valleys, and romantic vistas.',
      image: './assets/categories/cat5_landscapes.jpg',
      audio: './audio/landscape.mp3',
      paintings: [
        {
          title: 'Wanderer above the Sea of Fog',
          artist: 'Caspar David Friedrich',
          year: '1818',
          era: 'Romanticism',
          medium: 'Oil on canvas',
          museum: 'Hamburger Kunsthalle, Germany',
          image: './assets/categories/cat5_landscapes.jpg',
          description: 'A solitary traveler standing atop a precipice gazing into the sublime mystery of a sea of fog.'
        }
      ]
    },
    {
      id: 'seascapes',
      num: '06',
      name: 'Seascapes',
      titleMain: 'SEASCAPES',
      titleSub: '— OCEANS',
      tag: 'SEASCAPES',
      subtitle: 'Towering ocean swells, tempestuous tides, and coastal poetry.',
      image: './assets/categories/cat6_seascapes.jpg',
      audio: './audio/seascape.mp3',
      paintings: [
        {
          title: 'The Great Wave off Kanagawa',
          artist: 'Katsushika Hokusai',
          year: 'c. 1831',
          era: 'Edo Period (Ukiyo-e)',
          medium: 'Woodblock print',
          museum: 'Tokyo National Museum / Met NYC',
          image: './assets/categories/cat6_seascapes.jpg',
          description: 'A towering cresting wave framing Mount Fuji with timeless dynamic Japanese composition.'
        }
      ]
    },
    {
      id: 'nature',
      num: '07',
      name: 'Nature',
      titleMain: 'NATURE',
      titleSub: '— COSMOS',
      tag: 'NATURE',
      subtitle: 'Lush water lilies, vibrant botanical groves, and organic nature harmonies.',
      image: './assets/categories/cat7_nature.jpg',
      audio: './audio/nature.mp3',
      paintings: [
        {
          title: 'Water Lilies (Nymphéas)',
          artist: 'Claude Monet',
          year: '1916',
          era: 'Impressionism',
          medium: 'Oil on canvas',
          museum: 'Musée de l\'Orangerie, Paris',
          image: './assets/categories/cat7_nature.jpg',
          description: 'Monet’s luminous impressionist depiction of water lilies floating gently upon the serene waters of Giverny.'
        }
      ]
    },
    {
      id: 'wildlife',
      num: '08',
      name: 'Wildlife',
      titleMain: 'WILDLIFE',
      titleSub: '— FAUNA',
      tag: 'WILDLIFE',
      subtitle: 'Fierce jungle predators, untamed creatures, and wilderness vitality.',
      image: './assets/categories/cat8_wildlife.jpg',
      audio: './audio/wildlife.mp3',
      paintings: [
        {
          title: 'Tiger in a Tropical Storm (Surprised!)',
          artist: 'Henri Rousseau',
          year: '1891',
          era: 'Post-Impressionism / Naïve',
          medium: 'Oil on canvas',
          museum: 'National Gallery, London',
          image: './assets/categories/cat8_wildlife.jpg',
          description: 'A tiger illuminated by a flash of lightning preparing to pounce in a lush windblown jungle.'
        }
      ]
    },
    {
      id: 'floral',
      num: '09',
      name: 'Floral Art',
      titleMain: 'FLORAL ART',
      titleSub: '— BOTANICAL',
      tag: 'FLORAL ART',
      subtitle: 'Golden sunflowers, delicate blossoms, and rich botanical still-lifes.',
      image: './assets/categories/cat9_floral.jpg',
      audio: './audio/floral.mp3',
      paintings: [
        {
          title: 'Sunflowers (Tournesols)',
          artist: 'Vincent van Gogh',
          year: '1888',
          era: 'Post-Impressionism',
          medium: 'Oil on canvas',
          museum: 'National Gallery, London',
          image: './assets/categories/cat9_floral.jpg',
          description: 'A vibrant symphony of yellows and ochres expressing gratitude and optimism through luminous flowers.'
        }
      ]
    },
    {
      id: 'portraits',
      num: '10',
      name: 'Portraits',
      titleMain: 'PORTRAITS',
      titleSub: '— FACES',
      tag: 'PORTRAITS',
      subtitle: 'Intimate human gazes, enigmatic expressions, and psychological depth.',
      image: './assets/categories/cat10_portraits.jpg',
      audio: './audio/portrait.mp3',
      paintings: [
        {
          title: 'Girl with a Pearl Earring',
          artist: 'Johannes Vermeer',
          year: 'c. 1665',
          era: 'Dutch Golden Age',
          medium: 'Oil on canvas',
          museum: 'Mauritshuis, The Hague, Netherlands',
          image: './assets/categories/cat10_portraits.jpg',
          description: 'Vermeer’s masterwork tronie capturing an alluring over-the-shoulder glance and gleaming oriental pearl.'
        }
      ]
    },
    {
      id: 'figurative',
      num: '11',
      name: 'Figurative Art',
      titleMain: 'FIGURATIVE ART',
      titleSub: '— HUMAN FORM',
      tag: 'FIGURATIVE ART',
      subtitle: 'Mastery of anatomy, expressive gesture, and Renaissance proportions.',
      image: './assets/categories/cat11_figurative.jpg',
      audio: './audio/figureative.mp3',
      paintings: [
        {
          title: 'Mona Lisa (La Gioconda)',
          artist: 'Leonardo da Vinci',
          year: '1503–1519',
          era: 'High Renaissance',
          medium: 'Oil on poplar panel',
          museum: 'Musée du Louvre, Paris',
          image: './assets/categories/cat11_figurative.jpg',
          description: 'The world’s most celebrated portrait, famed for its subtle sfumato technique and enigmatic smile.'
        }
      ]
    },
    {
      id: 'romance',
      num: '12',
      name: 'Romance & Love',
      titleMain: 'ROMANCE & LOVE',
      titleSub: '— DEVOTION',
      tag: 'ROMANCE & LOVE',
      subtitle: 'Passionate embraces, golden leaf symbolism, and eternal devotion.',
      image: './assets/categories/cat12_romance.jpg',
      audio: './audio/romantic.mp3',
      paintings: [
        {
          title: 'The Kiss (Der Kuss)',
          artist: 'Gustav Klimt',
          year: '1907–1908',
          era: 'Vienna Secession / Art Nouveau',
          medium: 'Oil and gold leaf on canvas',
          museum: 'Österreichische Galerie Belvedere, Vienna',
          image: './assets/categories/cat12_romance.jpg',
          description: 'The pinnacle of Klimt’s Golden Phase, depicting an ecstatic couple embracing on a meadow of wildflowers.'
        }
      ]
    },
    {
      id: 'drama',
      num: '13',
      name: 'Drama & Emotion',
      titleMain: 'DRAMA & EMOTION',
      titleSub: '— EXPRESSION',
      tag: 'DRAMA & EMOTION',
      subtitle: 'Raw psychological tension, angst, passion, and intense color contrast.',
      image: './assets/categories/cat13_drama.jpg',
      audio: './audio/dramatic.mp3',
      paintings: [
        {
          title: 'The Scream (Skrik)',
          artist: 'Edvard Munch',
          year: '1893',
          era: 'Expressionism',
          medium: 'Oil, tempera & pastel on cardboard',
          museum: 'National Museum, Oslo, Norway',
          image: './assets/categories/cat13_drama.jpg',
          description: 'An agonizing figure against a blood-red sky embodying modern human existential dread and psychological tension.'
        }
      ]
    },
    {
      id: 'spirituality',
      num: '14',
      name: 'Spirituality',
      titleMain: 'SPIRITUALITY',
      titleSub: '— SACRED',
      tag: 'SPIRITUALITY',
      subtitle: 'Divine touch, celestial frescoes, and transcendent sacred devotion.',
      image: './assets/categories/cat14_spirituality.jpg',
      audio: './audio/sspritual.mp3',
      paintings: [
        {
          title: 'The Creation of Adam',
          artist: 'Michelangelo Buonarroti',
          year: 'c. 1512',
          era: 'High Renaissance',
          medium: 'Fresco',
          museum: 'Sistine Chapel, Vatican Museums, Rome',
          image: './assets/categories/cat14_spirituality.jpg',
          description: 'The iconic moment God breathes life into Adam with the near-touching of their fingertips on the Sistine ceiling.'
        }
      ]
    },
    {
      id: 'culture',
      num: '15',
      name: 'Culture & Traditions',
      titleMain: 'CULTURE & TRADITIONS',
      titleSub: '— HERITAGE',
      tag: 'CULTURE & TRADITIONS',
      subtitle: 'Folk festivities, community celebrations, and timeless cultural heritage.',
      image: './assets/categories/cat15_culture.jpg',
      audio: './audio/cultural.mp3',
      paintings: [
        {
          title: 'A Sunday on La Grande Jatte',
          artist: 'Georges Seurat',
          year: '1884–1886',
          era: 'Pointillism / Post-Impressionism',
          medium: 'Oil on canvas',
          museum: 'Art Institute of Chicago',
          image: './assets/categories/cat15_culture.jpg',
          description: 'A monument of Neo-Impressionism portraying Parisian leisure culture and social tradition along the banks of the Seine.'
        }
      ]
    },
    {
      id: 'ancient',
      num: '16',
      name: 'Ancient Civilizations',
      titleMain: 'ANCIENT CIVILIZATIONS',
      titleSub: '— ANTIQUITY',
      tag: 'ANCIENT CIVILIZATIONS',
      subtitle: 'Philosophical harmony, classical architecture, and ancient intellect.',
      image: './assets/categories/cat16_ancient.jpg',
      audio: './audio/ancient.mp3',
      paintings: [
        {
          title: 'The School of Athens',
          artist: 'Raphael Sanzio',
          year: '1509–1511',
          era: 'High Renaissance',
          medium: 'Fresco',
          museum: 'Apostolic Palace, Vatican City, Rome',
          image: './assets/categories/cat16_ancient.jpg',
          description: 'Plato and Aristotle leading a grand assembly of antiquity’s greatest thinkers under monumental classical arches.'
        }
      ]
    },
    {
      id: 'architecture',
      num: '17',
      name: 'Architecture',
      titleMain: 'ARCHITECTURE',
      titleSub: '— MONUMENTS',
      tag: 'ARCHITECTURE',
      subtitle: 'Monumental towers, cathedral geometries, and urban perspectives.',
      image: './assets/categories/cat17_architecture.jpg',
      audio: './audio/architecture.mp3',
      paintings: [
        {
          title: 'The Tower of Babel',
          artist: 'Pieter Bruegel the Elder',
          year: '1563',
          era: 'Northern Renaissance',
          medium: 'Oil on panel',
          museum: 'Kunsthistorisches Museum, Vienna',
          image: './assets/categories/cat17_architecture.jpg',
          description: 'A colossal multi-tiered spiral citadel rising into the clouds with astonishing architectural masonry detail.'
        }
      ]
    },
    {
      id: 'fantasy',
      num: '18',
      name: 'Fantasy & Imagination',
      titleMain: 'FANTASY & IMAGINATION',
      titleSub: '— VISIONARY',
      tag: 'FANTASY & IMAGINATION',
      subtitle: 'Surreal dreamscapes, fantastical creatures, and visionary wonder.',
      image: './assets/categories/cat18_fantasy.jpg',
      audio: './audio/fantasy.mp3',
      paintings: [
        {
          title: 'The Garden of Earthly Delights',
          artist: 'Hieronymus Bosch',
          year: '1490–1510',
          era: 'Early Netherlandish',
          medium: 'Oil on oak triptych',
          museum: 'Museo del Prado, Madrid',
          image: './assets/categories/cat18_fantasy.jpg',
          description: 'An astounding surrealist visionary triptych teeming with bizarre hybrid creatures, towers, and symbolic wonder.'
        }
      ]
    },
    {
      id: 'abstract',
      num: '19',
      name: 'Abstract Art',
      titleMain: 'ABSTRACT ART',
      titleSub: '— ABSTRACTION',
      tag: 'ABSTRACT ART',
      subtitle: 'Pure color vibrations, dynamic geometric forms, and musical rhythm.',
      image: './assets/categories/cat19_abstract.jpg',
      audio: './audio/abstract.mp3',
      paintings: [
        {
          title: 'Composition VII',
          artist: 'Wassily Kandinsky',
          year: '1913',
          era: 'Abstract Expressionism / Bauhaus',
          medium: 'Oil on canvas',
          museum: 'State Tretyakov Gallery, Moscow',
          image: './assets/categories/cat19_abstract.jpg',
          description: 'A masterpiece of non-objective art orchestrating swirling colors, energetic lines, and spiritual resonance.'
        }
      ]
    },
    {
      id: 'stilllife',
      num: '20',
      name: 'Still Life',
      titleMain: 'STILL LIFE',
      titleSub: '— STILLNESS',
      tag: 'STILL LIFE',
      subtitle: 'Ripened fruits, delicate glass vessels, and contemplative stillness.',
      image: './assets/categories/cat20_stilllife.jpg',
      audio: './audio/still life.mp3',
      paintings: [
        {
          title: 'Basket of Fruit (Canestra di frutta)',
          artist: 'Caravaggio (Michelangelo Merisi)',
          year: 'c. 1599',
          era: 'Baroque',
          medium: 'Oil on canvas',
          museum: 'Pinacoteca Ambrosiana, Milan, Italy',
          image: './assets/categories/cat20_stilllife.jpg',
          description: 'A revolutionary still life elevated to high art, depicting wicker basket brimming with realistic fruit.'
        }
      ]
    }
  ];

  // Auction Estimates for 20 Curated Lots (Christie's & Sotheby's Previews)
  const AUCTION_ESTIMATES = {
    historical: '$140,000,000 – $180,000,000',
    mythological: '$120,000,000 – $160,000,000',
    royalty: '$35,000,000 – $45,000,000',
    battle: '$95,000,000 – $130,000,000',
    landscapes: '$60,000,000 – $80,000,000',
    seascapes: '$40,000,000 – $55,000,000',
    nature: '$75,000,000 – $100,000,000',
    wildlife: '$50,000,000 – $70,000,000',
    floral: '$110,000,000 – $150,000,000',
    portraits: '$180,000,000 – $240,000,000',
    figurative: '$850,000,000 – $1,200,000,000',
    romance: '$160,000,000 – $220,000,000',
    drama: '$120,000,000 – $150,000,000',
    spirituality: '$300,000,000 – $450,000,000',
    culture: '$130,000,000 – $175,000,000',
    ancient: '$200,000,000 – $280,000,000',
    architecture: '$80,000,000 – $110,000,000',
    fantasy: '$170,000,000 – $230,000,000',
    abstract: '$65,000,000 – $90,000,000',
    stilllife: '$85,000,000 – $120,000,000'
  };

  const ARTWORK_DIMENSIONS = {
    historical: '363 × 437 cm',
    mythological: '172.5 × 278.9 cm',
    royalty: '277 × 194 cm',
    battle: '260 × 325 cm',
    landscapes: '94.8 × 74.8 cm',
    seascapes: '25.7 × 37.8 cm',
    nature: '200 × 200 cm',
    wildlife: '129.8 × 161.9 cm',
    floral: '92.1 × 73 cm',
    portraits: '44.5 × 39 cm',
    figurative: '77 × 53 cm',
    romance: '180 × 180 cm',
    drama: '91 × 73.5 cm',
    spirituality: '280 × 570 cm',
    culture: '207.6 × 308 cm',
    architecture: '500 × 770 cm',
    celestial: '73.7 × 92.1 cm',
    surrealism: '24.1 × 33 cm',
    abstract: '140 × 201 cm',
    stilllife: '460 × 880 cm'
  };

  CATEGORIES.forEach(cat => {
    cat.estimate = AUCTION_ESTIMATES[cat.id] || '$50,000,000 – $80,000,000';
    if (cat.paintings && cat.paintings[0]) {
      cat.paintings[0].estimate = cat.estimate;
      cat.paintings[0].dimensions = cat.paintings[0].dimensions || ARTWORK_DIMENSIONS[cat.id] || '180 × 220 cm';
    }
  });

  // --- Global Application State ---
  const state = {
    currentView: 'home', // 'landing' | 'home' | 'library' | 'gallery'
    landingSlideIndex: 0,
    totalLandingSlides: 5,
    homeCardIndex: 0,
    activeLibraryCategory: 'all',
    searchQuery: '',
    isLandingAnimating: false,
    isHomeAnimating: false,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragDistance: 0,
    lastScrollTime: 0,
    // Vintage Diary State
    diaryIndex: 0,
    isDiaryFlipping: false,
    isDiaryClosed: false,
    // Art Auction Exhibition State
    auctionIndex: 0,
    isAuctionAnimating: false,
    // Audio state
    currentAudioCategoryId: null,
    isMuted: false
  };

  // ==========================================================================
  // BACKGROUND AUDIO ENGINE (Delegated to Global AudioManager)
  // ==========================================================================
  const audioEngine = {
    init() {
      if (window.avartaBgAudio && typeof window.avartaBgAudio.play === 'function') {
        window.avartaBgAudio.play();
      }
    },
    _playSource() {},
    playDefault() {
      if (window.avartaBgAudio && typeof window.avartaBgAudio.play === 'function') {
        window.avartaBgAudio.play();
      }
    },
    playForCategory() {
      if (window.avartaBgAudio && typeof window.avartaBgAudio.play === 'function') {
        window.avartaBgAudio.play();
      }
    },
    stop() {},
    pause() {
      // Intentionally do NOT pause background music on gallery view or category switches
      if (window.avartaBgAudio && typeof window.avartaBgAudio.play === 'function') {
        window.avartaBgAudio.play();
      }
    },
    toggleMute() {}
  };

  // --- DOM Elements ---
  const DOM = {
    body: document.body,
    landingView: document.getElementById('landingScreenView'),
    homeView: document.getElementById('homeScreenView'),
    libraryView: document.getElementById('libraryScreenView'),
    
    // Header
    viewIndicatorPill: document.getElementById('viewIndicatorPill'),
    headerHomeBtn: document.getElementById('headerHomeBtn'),
    headerLibraryBtn: document.getElementById('headerLibraryBtn'),
    
    // Landing Slides
    landingSlides: document.querySelectorAll('.landing-screen-view .slide'),
    scrollToHomeIndicator: document.getElementById('scrollToHomeIndicator'),
    
    // 3D Home Screen (Retro Royale Grand Royal Gallery)
    carouselScene: document.getElementById('carouselScene'),
    cardsTrack: document.getElementById('cardsTrack'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pagContainer: document.getElementById('carouselPagination'),
    currentCatNum: document.getElementById('currentCatNum'),
    currentCatName: document.getElementById('currentCatName'),
    returnToLandingBtn: document.getElementById('returnToLandingBtn'),
    openAllLibraryBtn: document.getElementById('openAllLibraryBtn'),
    ambientCurrent: document.getElementById('ambientBgCurrent'),
    ambientNext: document.getElementById('ambientBgNext'),
    pagArrowLeft: document.querySelector('.pagination-arrow-left'),
    pagArrowRight: document.querySelector('.pagination-arrow-right'),
    
    // Vintage Diary Archive
    libraryBackToHomeBtn: document.getElementById('libraryBackToHomeBtn'),
    libraryActiveCategoryHeading: document.getElementById('libraryActiveCategoryHeading'),
    libraryActiveCategorySubheading: document.getElementById('libraryActiveCategorySubheading'),
    vintageDiaryStage: document.getElementById('vintageDiaryStage'),
    vintageDiaryBook: document.getElementById('vintageDiaryBook'),
    vintageDiaryClosedBook: document.getElementById('vintageDiaryClosedBook'),
    diaryStampNum: document.getElementById('diaryStampNum'),
    diaryStampCat: document.getElementById('diaryStampCat'),
    diaryMainPolaroid: document.getElementById('diaryMainPolaroid'),
    diaryPolaroidImg: document.getElementById('diaryPolaroidImg'),
    diaryPolaroidTitle: document.getElementById('diaryPolaroidTitle'),
    diaryPolaroidArtist: document.getElementById('diaryPolaroidArtist'),
    diaryLeftPageNum: document.getElementById('diaryLeftPageNum'),
    diaryRightPageNum: document.getElementById('diaryRightPageNum'),
    diaryPrevArrowBtn: document.getElementById('diaryPrevArrowBtn'),
    diaryNextArrowBtn: document.getElementById('diaryNextArrowBtn'),
    diaryNoteTag: document.getElementById('diaryNoteTag'),
    diaryNoteTitle: document.getElementById('diaryNoteTitle'),
    diaryNoteSubtitle: document.getElementById('diaryNoteSubtitle'),
    diaryStoryText: document.getElementById('diaryStoryText'),
    diaryProvEra: document.getElementById('diaryProvEra'),
    diaryProvMedium: document.getElementById('diaryProvMedium'),
    diaryProvMuseum: document.getElementById('diaryProvMuseum'),
    diaryAnnotationText: document.getElementById('diaryAnnotationText'),
    diaryIndicatorCounter: document.getElementById('diaryIndicatorCounter'),
    diaryIndicatorTag: document.getElementById('diaryIndicatorTag'),
    diaryPageFlipLeaf: document.getElementById('diaryPageFlipLeaf'),
    flipFaceFront: document.getElementById('flipFaceFront'),
    flipFaceBack: document.getElementById('flipFaceBack'),
    
    // Inspect Lightbox Modal
    artworkInspectModal: document.getElementById('artworkInspectModal'),
    artworkModalBackdrop: document.getElementById('artworkModalBackdrop'),
    closeArtworkModalBtn: document.getElementById('closeArtworkModalBtn'),
    lightboxImage: document.getElementById('lightboxImage'),
    lightboxCategory: document.getElementById('lightboxCategory'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxArtist: document.getElementById('lightboxArtist'),
    lightboxDescription: document.getElementById('lightboxDescription'),
    lightboxEra: document.getElementById('lightboxEra'),
    lightboxMedium: document.getElementById('lightboxMedium'),
    lightboxMuseum: document.getElementById('lightboxMuseum'),

    // View 4: Royal Art Exhibition Chamber
    auctionView: document.getElementById('auctionGalleryView'),
    auctionTopBar: document.getElementById('auctionTopBar'),
    auctionProgressFill: document.getElementById('auctionProgressFill'),
    auctionCategoryName: document.getElementById('auctionCategoryName'),
    auctionLotCounter: document.getElementById('auctionLotCounter'),
    auctionExitBtn: document.getElementById('auctionExitBtn'),
    auctionStageContainer: document.getElementById('auctionStageContainer'),
    royalChamberDisplay: document.getElementById('royalChamberDisplay'),
    royalCanvasColumn: document.getElementById('royalCanvasColumn'),
    royalScrollColumn: document.getElementById('royalScrollColumn'),
    auctionFrame: document.getElementById('auctionFrame'),
    auctionPaintingImg: document.getElementById('auctionPaintingImg'),
    royalBrassPlaque: document.getElementById('royalBrassPlaque'),
    plaqueTitle: document.getElementById('plaqueTitle'),
    plaqueArtist: document.getElementById('plaqueArtist'),
    plaqueYear: document.getElementById('plaqueYear'),
    royalScrollAssembly: document.getElementById('royalScrollAssembly'),
    scrollArtworkTitle: document.getElementById('scrollArtworkTitle'),
    scrollArtistName: document.getElementById('scrollArtistName'),
    scrollYearTag: document.getElementById('scrollYearTag'),
    scrollMetaArtist: document.getElementById('scrollMetaArtist'),
    scrollMetaYear: document.getElementById('scrollMetaYear'),
    scrollMetaMedium: document.getElementById('scrollMetaMedium'),
    scrollMetaDimensions: document.getElementById('scrollMetaDimensions'),
    scrollMetaLocation: document.getElementById('scrollMetaLocation'),
    scrollNarrativeText: document.getElementById('scrollNarrativeText'),
    auctionPrevBtn: document.getElementById('auctionPrevBtn'),
    auctionNextBtn: document.getElementById('auctionNextBtn'),
    homeEnterGalleryActionBtn: document.getElementById('homeEnterGalleryActionBtn')
  };

  // --- Initialize App ---
  function init() {
    setupLandingSlides();
    build3DHomeCards();
    renderDiaryCategory(state.diaryIndex);
    setupInitialHomeBackdrop();
    updateHomeCarousel();
    bindGlobalEvents();

    // Check URL parameters for direct view routing (view=gallery opens Retro Royale Grand Gallery)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      const catParam = urlParams.get('category');
      if (viewParam === 'gallery' || window.location.hash === '#gallery') {
        switchView('home', catParam || 0);
      } else if (viewParam === 'auction' || window.location.hash === '#auction') {
        switchView('gallery', catParam || 0);
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }

    // Fetch backend auction lots catalog if available
    fetchAuctionLots();

    // Initialize Background Audio Engine
    audioEngine.init();

    // Smooth Entrance Reveal
    setTimeout(() => {
      DOM.body.classList.remove('is-loading');
      DOM.body.classList.add('is-loaded');
      if (state.currentView === 'landing' && DOM.landingSlides && DOM.landingSlides[0]) {
        animateLandingSlideIn(DOM.landingSlides[0], 1, true);
      }
    }, 150);
  }

  // ==========================================================================
  // VIEW SWITCHING (LANDING <-> 3D HOME <-> PAINTING LIBRARY <-> AUCTION EXHIBITION)
  // ==========================================================================
  function switchView(targetView, categoryId = null) {
    if (state.currentView === targetView && categoryId === null) return;

    state.currentView = targetView;
    DOM.body.classList.remove('view-landing', 'view-home', 'view-library', 'view-gallery');
    DOM.landingView.classList.remove('is-active-view');
    DOM.homeView.classList.remove('is-active-view');
    DOM.libraryView.classList.remove('is-active-view');
    if (DOM.auctionView) DOM.auctionView.classList.remove('is-active-view');

    if (targetView === 'landing') {
      DOM.body.classList.add('view-landing');
      DOM.landingView.classList.add('is-active-view');
      if (DOM.viewIndicatorPill) DOM.viewIndicatorPill.textContent = 'LANDING GALLERY';
      goToLandingSlide(0, 1, true);
      audioEngine.playDefault();
    } else if (targetView === 'home') {
      DOM.body.classList.add('view-home');
      DOM.homeView.classList.add('is-active-view');
      if (DOM.viewIndicatorPill) DOM.viewIndicatorPill.textContent = '3D CATEGORIES';
      if (DOM.royalNavGalleryBtn) DOM.royalNavGalleryBtn.classList.add('is-active');
      if (DOM.royalNavAuctionBtn) DOM.royalNavAuctionBtn.classList.remove('is-active');
      updateHomeCarousel();
      audioEngine.playDefault();
    } else if (targetView === 'library') {
      DOM.body.classList.add('view-library');
      DOM.libraryView.classList.add('is-active-view');
      if (DOM.viewIndicatorPill) DOM.viewIndicatorPill.textContent = 'CURATOR’S DIARY';
      if (DOM.royalNavGalleryBtn) DOM.royalNavGalleryBtn.classList.remove('is-active');
      if (DOM.royalNavAuctionBtn) DOM.royalNavAuctionBtn.classList.remove('is-active');

      if (categoryId && categoryId !== 'all') {
        const foundIdx = CATEGORIES.findIndex(c => c.id === categoryId);
        if (foundIdx !== -1) state.diaryIndex = foundIdx;
      }
      renderDiaryCategory(state.diaryIndex);
      audioEngine.playForCategory(CATEGORIES[state.diaryIndex].id);
    } else if (targetView === 'gallery') {
      DOM.body.classList.add('view-gallery');
      if (DOM.auctionView) DOM.auctionView.classList.add('is-active-view');
      if (DOM.viewIndicatorPill) DOM.viewIndicatorPill.textContent = 'AUCTION EXHIBITION';
      if (DOM.royalNavGalleryBtn) DOM.royalNavGalleryBtn.classList.remove('is-active');
      if (DOM.royalNavAuctionBtn) DOM.royalNavAuctionBtn.classList.add('is-active');

      if (categoryId !== null && categoryId !== undefined) {
        if (typeof categoryId === 'string') {
          const foundIdx = CATEGORIES.findIndex(c => c.id === categoryId);
          if (foundIdx !== -1) state.auctionIndex = foundIdx;
        } else if (typeof categoryId === 'number') {
          state.auctionIndex = Math.max(0, Math.min(CATEGORIES.length - 1, categoryId));
        }
      }
      renderAuctionLot(state.auctionIndex);
      // Quiet, high-end Christie's/Sotheby's exhibition atmosphere
      audioEngine.pause();
    }
  }

  // ==========================================================================
  // VIEW 1: LANDING PAGE SLIDESHOW
  // ==========================================================================
  function setupLandingSlides() {
    DOM.landingSlides.forEach((slide, index) => {
      if (index === 0) {
        slide.classList.add('is-active');
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
      } else {
        slide.classList.remove('is-active');
        slide.style.opacity = '0';
        slide.style.visibility = 'hidden';
      }
    });
  }

  function goToLandingSlide(targetIndex, direction = null, forceImmediate = false) {
    if (state.isLandingAnimating && !forceImmediate) return;

    // After scrolling all 5 images on landing page -> GO TO 3D HOME SCREEN!
    if (targetIndex >= state.totalLandingSlides) {
      switchView('home');
      return;
    }

    if (targetIndex < 0) {
      targetIndex = 0;
      return;
    }

    const fromIndex = state.landingSlideIndex;
    const toIndex = targetIndex;

    if (forceImmediate || fromIndex === toIndex) {
      DOM.landingSlides.forEach((slide, idx) => {
        if (idx === toIndex) {
          slide.classList.add('is-active');
          slide.style.opacity = '1';
          slide.style.visibility = 'visible';
          const title = slide.querySelector('.slide-main-title');
          const bg = slide.querySelector('.slide-bg');
          const badge = slide.querySelector('.slide-script-badge');
          if (title) { title.style.transform = 'none'; title.style.opacity = '1'; title.style.filter = 'none'; }
          if (bg) { bg.style.transform = 'scale(1)'; bg.style.filter = 'none'; }
          if (badge) { badge.style.transform = 'none'; badge.style.opacity = '1'; }
        } else {
          slide.classList.remove('is-active');
          slide.style.opacity = '0';
          slide.style.visibility = 'hidden';
        }
      });
      state.landingSlideIndex = toIndex;
      return;
    }

    state.isLandingAnimating = true;
    const dir = direction !== null ? direction : (toIndex > fromIndex ? 1 : -1);

    const currentSlide = DOM.landingSlides[fromIndex];
    const nextSlide = DOM.landingSlides[toIndex];

    animateLandingSlideOut(currentSlide, dir);
    animateLandingSlideIn(nextSlide, dir);

    state.landingSlideIndex = toIndex;

    setTimeout(() => {
      currentSlide.classList.remove('is-active');
      currentSlide.style.visibility = 'hidden';
      currentSlide.style.opacity = '0';

      const outTitle = currentSlide.querySelector('.slide-main-title');
      const outBg = currentSlide.querySelector('.slide-bg');
      const outBadge = currentSlide.querySelector('.slide-script-badge');

      if (outTitle) { outTitle.style.transform = ''; outTitle.style.opacity = ''; outTitle.style.filter = ''; }
      if (outBg) { outBg.style.transform = ''; outBg.style.filter = ''; }
      if (outBadge) { outBadge.style.transform = ''; outBadge.style.opacity = ''; }

      state.isLandingAnimating = false;
    }, 1100);
  }

  function animateLandingSlideOut(slide, direction) {
    const title = slide.querySelector('.slide-main-title');
    const bg = slide.querySelector('.slide-bg');
    const badge = slide.querySelector('.slide-script-badge');

    slide.style.zIndex = '5';
    slide.style.transition = 'opacity 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
    slide.style.opacity = '0.4';

    if (title) {
      title.style.transition = 'transform 1.05s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s ease, filter 0.8s ease';
      const scaleVal = direction > 0 ? 2.6 : 0.6;
      const yVal = direction > 0 ? -120 : 100;
      const xVal = direction > 0 ? -80 : 40;
      title.style.transform = `translate3d(${xVal}px, ${yVal}px, 0) scale(${scaleVal})`;
      title.style.opacity = '0';
      title.style.filter = 'blur(10px)';
    }

    if (bg) {
      bg.style.transition = 'transform 1.1s cubic-bezier(0.19, 1, 0.22, 1), filter 1s ease';
      const bgY = direction > 0 ? -8 : 8;
      bg.style.transform = `scale(1.2) translateY(${bgY}%)`;
      bg.style.filter = 'brightness(0.5) blur(4px)';
    }

    if (badge) {
      badge.style.transition = 'transform 0.75s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.6s ease';
      badge.style.transform = `translate3d(50px, ${direction > 0 ? -30 : 30}px, 0)`;
      badge.style.opacity = '0';
    }
  }

  function animateLandingSlideIn(slide, direction, isInitial = false) {
    slide.classList.add('is-active');
    slide.style.zIndex = '10';
    slide.style.visibility = 'visible';
    slide.style.opacity = '1';

    const title = slide.querySelector('.slide-main-title');
    const bg = slide.querySelector('.slide-bg');
    const badge = slide.querySelector('.slide-script-badge');

    if (isInitial) {
      if (title) { title.style.transform = 'translate3d(0, 0, 0) scale(1)'; title.style.opacity = '1'; title.style.filter = 'none'; }
      if (bg) { bg.style.transform = 'scale(1) translateY(0)'; bg.style.filter = 'brightness(1)'; }
      if (badge) { badge.style.transform = 'translate3d(0, 0, 0)'; badge.style.opacity = '1'; }
      return;
    }

    if (title) {
      const startScale = direction > 0 ? 0.75 : 1.8;
      const startY = direction > 0 ? 90 : -90;
      title.style.transition = 'none';
      title.style.transform = `translate3d(0, ${startY}px, 0) scale(${startScale})`;
      title.style.opacity = '0';
      title.style.filter = 'blur(12px)';
    }

    if (bg) {
      const startBgY = direction > 0 ? 10 : -10;
      bg.style.transition = 'none';
      bg.style.transform = `scale(1.22) translateY(${startBgY}%)`;
      bg.style.filter = 'brightness(0.4) blur(6px)';
    }

    if (badge) {
      badge.style.transition = 'none';
      badge.style.transform = 'translate3d(30px, 20px, 0)';
      badge.style.opacity = '0';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (title) {
          title.style.transition = 'transform 1.1s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.9s ease 0.1s, filter 0.9s ease 0.1s';
          title.style.transform = 'translate3d(0, 0, 0) scale(1)';
          title.style.opacity = '1';
          title.style.filter = 'blur(0px)';
        }

        if (bg) {
          bg.style.transition = 'transform 1.3s cubic-bezier(0.19, 1, 0.22, 1), filter 1.1s ease';
          bg.style.transform = 'scale(1.03) translateY(0)';
          bg.style.filter = 'brightness(1) blur(0px)';
        }

        if (badge) {
          badge.style.transition = 'transform 0.9s cubic-bezier(0.19, 1, 0.22, 1) 0.18s, opacity 0.8s ease 0.18s';
          badge.style.transform = 'translate3d(0, 0, 0)';
          badge.style.opacity = '1';
        }
      });
    });
  }

  // ==========================================================================
  // ==========================================================================
  // VIEW 2: 3D COVERFLOW HOME SCREEN (RETRO ROYALE GRAND ROYAL GALLERY)
  // ==========================================================================
  function build3DHomeCards() {
    DOM.cardsTrack.innerHTML = '';
    DOM.pagContainer.innerHTML = '';

    CATEGORIES.forEach((cat, index) => {
      // 1. Create 3D Baroque Framed Card
      const card = document.createElement('article');
      card.className = 'carousel-card';
      card.setAttribute('data-index', index);
      card.setAttribute('data-category-id', cat.id);
      card.id = `card-${index}`;

      card.innerHTML = `
        <!-- Sleek Brass Picture Light mounted above the frame -->
        <div class="card-picture-light-wrap" aria-hidden="true">
          <img src="./assets/brass_picture_light.png" alt="Brass Picture Light" class="card-picture-light-img" />
          <div class="card-picture-light-beam"></div>
        </div>

        <!-- Ornate Baroque Carved Gold Frame with Painting Artwork -->
        <div class="card-frame-container">
          <div class="card-painting-wrap">
            <div class="card-painting-artwork" style="background-image: url('${cat.image}'); background-position: ${getArtworkPosition(cat.id)};"></div>
            <div class="card-painting-glaze" aria-hidden="true"></div>
          </div>
          <img src="./assets/ornate_gold_frame.png" alt="Ornate Baroque Gold Frame" class="card-ornate-frame-img" />
        </div>

        <!-- Authentic Museum Cartouche Plaque -->
        <div class="card-museum-plaque">
          <span class="plaque-corner plaque-corner-tl">&#10010;</span>
          <span class="plaque-corner plaque-corner-tr">&#10010;</span>
          <span class="plaque-corner plaque-corner-bl">&#10010;</span>
          <span class="plaque-corner plaque-corner-br">&#10010;</span>
          <div class="plaque-inner">
            <span class="plaque-category-title">${cat.titleMain || cat.name.toUpperCase()}</span>
            <span class="plaque-lot-number">No. ${cat.num || String(index + 1).padStart(2, '0')}</span>
          </div>
        </div>

        <!-- Downward Reflection on Glossy Marble Floor -->
        <div class="card-floor-reflection" aria-hidden="true"></div>
      `;

      // Click ANY painting: immediately open the Royal Exhibition Details View!
      card.addEventListener('click', () => {
        state.homeCardIndex = index;
        switchView('gallery', cat.id);
      });

      DOM.cardsTrack.appendChild(card);

      // 2. Create Pagination Dot with Luxury Hover/Active Tooltip
      const dot = document.createElement('button');
      dot.className = `pag-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', index);
      dot.setAttribute('aria-label', `Category ${cat.name}`);
      dot.addEventListener('click', () => goToHomeCard(index));

      const tooltip = document.createElement('span');
      tooltip.className = 'dot-tooltip';
      tooltip.textContent = `${cat.titleMain || cat.name.toUpperCase()} • No. ${cat.num || String(index + 1).padStart(2, '0')}`;
      dot.appendChild(tooltip);

      DOM.pagContainer.appendChild(dot);
    });
  }

  function setupInitialHomeBackdrop() {
    if (DOM.ambientCurrent && CATEGORIES.length > 0) {
      DOM.ambientCurrent.style.backgroundImage = `url('${CATEGORIES[0].image}')`;
      DOM.ambientCurrent.style.opacity = '1';
    }
  }

  function updateAmbientBackdrop(index) {
    if (!DOM.ambientCurrent || !DOM.ambientNext || !CATEGORIES[index]) return;

    const newImage = `url('${CATEGORIES[index].image}')`;
    DOM.ambientNext.style.backgroundImage = newImage;
    DOM.ambientNext.style.opacity = '1';
    DOM.ambientNext.style.transform = 'scale(1.12)';

    setTimeout(() => {
      DOM.ambientCurrent.style.backgroundImage = newImage;
      DOM.ambientNext.style.opacity = '0';
      DOM.ambientNext.style.transform = 'scale(1.08)';
    }, 550);
  }

  function updateHomeCarousel() {
    const total = CATEGORIES.length;
    const current = state.homeCardIndex;
    const cards = DOM.cardsTrack.querySelectorAll('.carousel-card');
    const dots = DOM.pagContainer.querySelectorAll('.pag-dot');

    cards.forEach((card, index) => {
      let offset = index - current;
      if (offset > total / 2) offset -= total;
      else if (offset < -total / 2) offset += total;

      let transform = '';
      let opacity = 0;
      let zIndex = 1;
      let filter = 'brightness(0.18)';

      if (offset === 0) {
        transform = 'translate3d(0, 0, 0) rotateY(0deg) scale(1)';
        opacity = 1;
        zIndex = 20;
        filter = 'brightness(1.08) contrast(1.05)';
        card.classList.add('is-active');
      } else if (offset === -1) {
        transform = 'translate3d(calc(-108% - 18px), 8px, -65px) rotateY(8deg) scale(0.86)';
        opacity = 0.88;
        zIndex = 14;
        filter = 'brightness(0.74) contrast(0.98)';
        card.classList.remove('is-active');
      } else if (offset === 1) {
        transform = 'translate3d(calc(108% + 18px), 8px, -65px) rotateY(-8deg) scale(0.86)';
        opacity = 0.88;
        zIndex = 14;
        filter = 'brightness(0.74) contrast(0.98)';
        card.classList.remove('is-active');
      } else if (offset <= -2) {
        transform = 'translate3d(calc(-212% - 32px), 16px, -140px) rotateY(16deg) scale(0.72)';
        opacity = 0.65;
        zIndex = 8;
        filter = 'brightness(0.50) contrast(0.92)';
        card.classList.remove('is-active');
      } else if (offset >= 2) {
        transform = 'translate3d(calc(212% + 32px), 16px, -140px) rotateY(-16deg) scale(0.72)';
        opacity = 0.65;
        zIndex = 8;
        filter = 'brightness(0.50) contrast(0.92)';
        card.classList.remove('is-active');
      }

      if (Math.abs(offset) > 2) {
        transform = `translate3d(${offset < 0 ? -320 : 320}%, 24px, -240px) scale(0.5)`;
        opacity = 0;
        zIndex = 1;
      }

      card.style.transform = transform;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.filter = filter;
    });

    // Update Pagination Dots & Progress Fill
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === current);
    });

    const pagFill = document.getElementById('carouselProgressFill');
    if (pagFill && total > 1) {
      const pct = (current / (total - 1)) * 100;
      pagFill.style.width = `${pct}%`;
    }

    // Update Top Counter Badge
    if (DOM.currentCatNum) DOM.currentCatNum.textContent = String(current + 1).padStart(2, '0');
    if (DOM.currentCatName && CATEGORIES[current]) DOM.currentCatName.textContent = CATEGORIES[current].name.toUpperCase();

    // Update Ambient Blurred Backdrop
    updateAmbientBackdrop(current);
  }

  function goToHomeCard(targetIndex) {
    if (state.isHomeAnimating) return;
    let newIndex = targetIndex % CATEGORIES.length;
    if (newIndex < 0) newIndex += CATEGORIES.length;
    if (newIndex === state.homeCardIndex) return;

    state.isHomeAnimating = true;
    state.homeCardIndex = newIndex;
    updateHomeCarousel();

    setTimeout(() => {
      state.isHomeAnimating = false;
    }, 700);
  }

  // ==========================================================================
  // VIEW 3: VINTAGE DIARY ENGINE (20 CATEGORIES WITH INTERACTIVE PAGE FLIP)
  // ==========================================================================
  function renderDiaryCategory(index) {
    if (index < 0 || index >= CATEGORIES.length) return;
    const cat = CATEGORIES[index];
    const p = (cat.paintings && cat.paintings[0]) || {
      title: cat.name,
      artist: 'Master Artist',
      year: '',
      era: 'Classical',
      medium: 'Oil on canvas',
      museum: 'AVĀRTĀ National Collection',
      image: cat.image,
      description: cat.subtitle
    };

    const leftNum = (index * 2 + 1).toString().padStart(2, '0');
    const rightNum = (index * 2 + 2).toString().padStart(2, '0');
    const counterText = `${(index + 1).toString().padStart(2, '0')} / ${CATEGORIES.length.toString().padStart(2, '0')}`;

    // Update Left Page
    if (DOM.diaryStampNum) DOM.diaryStampNum.textContent = `№ ${cat.num}`;
    if (DOM.diaryStampCat) DOM.diaryStampCat.textContent = cat.name.toUpperCase();
    if (DOM.diaryPolaroidImg) {
      DOM.diaryPolaroidImg.src = p.image;
      DOM.diaryPolaroidImg.alt = p.title;
    }
    if (DOM.diaryPolaroidTitle) DOM.diaryPolaroidTitle.textContent = p.title.toUpperCase();
    if (DOM.diaryPolaroidArtist) DOM.diaryPolaroidArtist.textContent = `${p.artist} • ${p.year || 'Archive'}`;
    if (DOM.diaryLeftPageNum) DOM.diaryLeftPageNum.textContent = `P. ${leftNum}`;

    // Update Right Page
    const subClean = (cat.titleSub || cat.tag || '').replace(/^[—–-]\s*/, '').toUpperCase();
    if (DOM.diaryNoteTag) DOM.diaryNoteTag.textContent = `ARCHIVE ENTRY • VOL. ${cat.num}`;
    if (DOM.diaryNoteTitle) DOM.diaryNoteTitle.textContent = cat.titleMain;
    if (DOM.diaryNoteSubtitle) DOM.diaryNoteSubtitle.textContent = subClean;
    if (DOM.diaryStoryText) DOM.diaryStoryText.textContent = p.description || cat.subtitle;
    if (DOM.diaryProvEra) DOM.diaryProvEra.textContent = (p.era || 'Classical Masterpiece').toUpperCase();
    if (DOM.diaryProvMedium) DOM.diaryProvMedium.textContent = (p.medium || 'Oil on canvas').toUpperCase();
    if (DOM.diaryProvMuseum) DOM.diaryProvMuseum.textContent = (p.museum || 'AVĀRTĀ Curatorial Archive').toUpperCase();
    if (DOM.diaryAnnotationText) {
      const observations = [
        "Observation: Masterful compositional chiaroscuro capturing transformative epochal shifts.",
        "Observation: Luminous mythological grace and ethereal presence preserved in tempera.",
        "Observation: Regal ceremonial drapery and imperial majesty rendered with commanding fidelity.",
        "Observation: Dynamic turbulent diagonals expressing raw martial intensity and heroic sacrifice.",
        "Observation: Sacred monumental fresco harmony bridging earthly devotion and celestial light.",
        "Observation: Vivid folk vibrancy documenting living traditions and festive celebratory spirit.",
        "Observation: Swirling impasto brushwork translating cosmic rhythm and emotional transcendence.",
        "Observation: Atmospheric marine luminosity and tumultuous wave dynamics recorded en plein air.",
        "Observation: Romantic sublime contemplation before the infinite expanse of nature.",
        "Observation: Nuanced chiaroscuro and intimate psychological depth in gaze execution.",
        "Observation: Anatomical precision and majestic untamed power captured with vitality.",
        "Observation: Exquisite delicacy in petals, verdant flora, and seasonal bloom harmonies.",
        "Observation: Piercing existential vulnerability rendered with haunting expressive intensity.",
        "Observation: Gilded ornamental embrace fusing tactile tenderness and sacred eternity.",
        "Observation: Serene domestic radiance and quiet contemplation in ordinary moments.",
        "Observation: Classical intellectual harmony framed by monumental Roman vaulted arches.",
        "Observation: Astounding masonry perspective and towering structural citadel complexity.",
        "Observation: Visionary surrealist triptych teeming with bizarre symbolic marvels.",
        "Observation: Pure non-objective color vibrations echoing musical counterpoint.",
        "Observation: Dramatic tenebrism elevating humble natural bounty to transcendent art."
      ];
      DOM.diaryAnnotationText.textContent = observations[index] || "Observation recorded in gallery catalogue under natural raking light.";
    }
    if (DOM.diaryRightPageNum) DOM.diaryRightPageNum.textContent = `P. ${rightNum}`;

    // Update Header Counter
    if (DOM.diaryIndicatorCounter) DOM.diaryIndicatorCounter.textContent = counterText;
    if (DOM.diaryIndicatorTag) DOM.diaryIndicatorTag.textContent = cat.name.toUpperCase();
    if (DOM.vintageDiaryBook) DOM.vintageDiaryBook.setAttribute('data-category', cat.id);
  }

  function closeDiaryBook() {
    if (state.isDiaryFlipping || !DOM.vintageDiaryStage) return;
    state.isDiaryFlipping = true;
    state.isDiaryClosed = true;

    DOM.vintageDiaryStage.classList.add('is-closing-diary');

    setTimeout(() => {
      DOM.vintageDiaryStage.classList.remove('is-closing-diary');
      DOM.vintageDiaryStage.classList.add('is-closed');
      state.isDiaryFlipping = false;
      if (DOM.diaryIndicatorCounter) DOM.diaryIndicatorCounter.textContent = 'CLOSED • 20/20';
      if (DOM.diaryIndicatorTag) DOM.diaryIndicatorTag.textContent = 'JOURNAL COMPLETE';
      audioEngine.playDefault();
    }, 450);
  }

  function openDiaryBook(targetIndex = 0) {
    if (state.isDiaryFlipping || !DOM.vintageDiaryStage) return;
    state.isDiaryFlipping = true;
    state.isDiaryClosed = false;

    state.diaryIndex = targetIndex;
    renderDiaryCategory(state.diaryIndex);

    DOM.vintageDiaryStage.classList.remove('is-closed');
    DOM.vintageDiaryStage.classList.add('is-opening-diary');

    setTimeout(() => {
      DOM.vintageDiaryStage.classList.remove('is-opening-diary');
      state.isDiaryFlipping = false;
      audioEngine.playForCategory(CATEGORIES[state.diaryIndex].id);
    }, 450);
  }

  function flipDiary(direction) {
    if (state.isDiaryFlipping) return;

    if (state.isDiaryClosed) {
      // Swiping or clicking while closed re-opens the diary
      if (direction > 0) openDiaryBook(0);
      else openDiaryBook(CATEGORIES.length - 1);
      return;
    }

    if (!DOM.vintageDiaryBook) return;

    const total = CATEGORIES.length;

    if (direction > 0) {
      // If at the 20th category, close the book!
      if (state.diaryIndex >= total - 1) {
        closeDiaryBook();
        return;
      }

      state.isDiaryFlipping = true;
      const nextIdx = state.diaryIndex + 1;
      DOM.vintageDiaryBook.classList.add('is-flipping-next');

      setTimeout(() => {
        state.diaryIndex = nextIdx;
        renderDiaryCategory(state.diaryIndex);
        audioEngine.playForCategory(CATEGORIES[state.diaryIndex].id);
      }, 260);

      setTimeout(() => {
        DOM.vintageDiaryBook.classList.remove('is-flipping-next');
        state.isDiaryFlipping = false;
      }, 540);
    } else {
      // Backward turning
      if (state.diaryIndex <= 0) {
        // Already at category 1
        return;
      }

      state.isDiaryFlipping = true;
      const prevIdx = state.diaryIndex - 1;
      DOM.vintageDiaryBook.classList.add('is-flipping-prev');

      setTimeout(() => {
        state.diaryIndex = prevIdx;
        renderDiaryCategory(state.diaryIndex);
        audioEngine.playForCategory(CATEGORIES[state.diaryIndex].id);
      }, 260);

      setTimeout(() => {
        DOM.vintageDiaryBook.classList.remove('is-flipping-prev');
        state.isDiaryFlipping = false;
      }, 540);
    }
  }

  // ==========================================================================
  // MASTERPIECE INSPECT LIGHTBOX MODAL
  // ==========================================================================
  function openArtworkInspectModal(painting) {
    if (!DOM.artworkInspectModal) return;

    DOM.lightboxImage.src = painting.image;
    DOM.lightboxImage.alt = painting.title;
    DOM.lightboxCategory.textContent = `⚜ ${(painting.categoryTag || painting.categoryName || 'MASTERPIECE').toUpperCase()} ⚜`;
    DOM.lightboxTitle.textContent = painting.title;
    DOM.lightboxArtist.textContent = `${painting.artist} • ${painting.year}`;
    DOM.lightboxDescription.textContent = painting.description;
    DOM.lightboxEra.textContent = painting.era;
    DOM.lightboxMedium.textContent = painting.medium;
    DOM.lightboxMuseum.textContent = painting.museum;

    DOM.artworkInspectModal.classList.add('is-open');
  }

  function closeArtworkInspectModal() {
    if (DOM.artworkInspectModal) {
      DOM.artworkInspectModal.classList.remove('is-open');
    }
  }

  // ==========================================================================
  // VIEW 4: ART AUCTION EXHIBITION (SOTHEBY'S / CHRISTIE'S PREVIEW GALLERY)
  // ==========================================================================
  function fetchAuctionLots() {
    fetch('/api/lots')
      .then(res => res.json())
      .then(lots => {
        if (Array.isArray(lots) && lots.length > 0) {
          lots.forEach(lot => {
            const cat = CATEGORIES.find(c => c.id === lot.id);
            if (cat) {
              cat.estimate = lot.estimate;
              if (cat.paintings && cat.paintings[0]) {
                cat.paintings[0].estimate = lot.estimate;
              }
            }
          });
          if (state.currentView === 'gallery') {
            updateAuctionContent(state.auctionIndex);
          }
        }
      })
      .catch(() => {
        // Silently use predefined estimates
      });
  }

  function preloadNeighboringImages(currentIndex) {
    const nextIdx = (currentIndex + 1) % CATEGORIES.length;
    const prevIdx = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
    [nextIdx, prevIdx].forEach(idx => {
      const item = CATEGORIES[idx];
      if (item && item.image) {
        const img = new Image();
        img.src = item.image;
      }
    });
  }

  function updateAuctionContent(index) {
    const cat = CATEGORIES[index];
    if (!cat) return;

    const painting = (cat.paintings && cat.paintings[0]) ? cat.paintings[0] : {
      title: cat.name,
      artist: 'Master Artist',
      year: 'Historic Era',
      medium: 'Oil on canvas',
      dimensions: '180 × 220 cm',
      museum: 'Musée du Louvre, Paris',
      image: cat.image,
      estimate: cat.estimate
    };

    const paintingDimensions = painting.dimensions || (ARTWORK_DIMENSIONS && ARTWORK_DIMENSIONS[cat.id]) || '180 × 220 cm';
    const museumLocation = painting.museum || 'Private Curatorial Collection';

    // Category Name in Top Bar
    if (DOM.auctionCategoryName) {
      DOM.auctionCategoryName.textContent = `${cat.titleMain} ${cat.titleSub ? cat.titleSub.replace('— ', '') : ''}`.trim();
    }

    // Lot Counter (e.g. "LOT 01 OF 20")
    if (DOM.auctionLotCounter) {
      const totalStr = CATEGORIES.length < 10 ? '0' + CATEGORIES.length : String(CATEGORIES.length);
      DOM.auctionLotCounter.textContent = `LOT ${cat.num} OF ${totalStr}`;
    }

    // Thin Hairline Progress Bar Indicator across the 20 categories
    if (DOM.auctionProgressFill) {
      const progressPercent = ((index + 1) / CATEGORIES.length) * 100;
      DOM.auctionProgressFill.style.width = `${progressPercent}%`;
    }

    // Canvas Painting Image
    if (DOM.auctionPaintingImg) {
      DOM.auctionPaintingImg.src = painting.image;
      DOM.auctionPaintingImg.alt = `${painting.title} by ${painting.artist}`;
      DOM.auctionPaintingImg.style.objectPosition = getArtworkPosition(cat.id);
    }

    // Left Classical Brass Plaque
    if (DOM.plaqueTitle) {
      DOM.plaqueTitle.textContent = (painting.title || cat.name).toUpperCase();
    }
    if (DOM.plaqueArtist) {
      DOM.plaqueArtist.textContent = (painting.artist || 'MASTER ARTIST').toUpperCase();
    }
    if (DOM.plaqueYear) {
      DOM.plaqueYear.textContent = painting.year || 'HERITAGE';
    }

    // Right Antique Parchment Scroll
    if (DOM.scrollArtworkTitle) {
      DOM.scrollArtworkTitle.textContent = (painting.title || cat.name).toUpperCase();
    }
    if (DOM.scrollArtistName) {
      DOM.scrollArtistName.textContent = (painting.artist || 'MASTER ARTIST').toUpperCase();
    }
    if (DOM.scrollYearTag) {
      DOM.scrollYearTag.textContent = painting.year || 'HERITAGE';
    }
    if (DOM.scrollMetaArtist) {
      DOM.scrollMetaArtist.textContent = painting.artist || 'Master Artist';
    }
    if (DOM.scrollMetaYear) {
      DOM.scrollMetaYear.textContent = painting.year || 'Historic Era';
    }
    if (DOM.scrollMetaMedium) {
      DOM.scrollMetaMedium.textContent = painting.medium || 'Oil on canvas';
    }
    if (DOM.scrollMetaDimensions) {
      DOM.scrollMetaDimensions.textContent = paintingDimensions;
    }
    if (DOM.scrollMetaLocation) {
      DOM.scrollMetaLocation.textContent = museumLocation;
    }
    if (DOM.scrollNarrativeText) {
      DOM.scrollNarrativeText.textContent = painting.description || cat.subtitle || '';
    }

    preloadNeighboringImages(index);
  }

  function triggerScrollRollDown() {
    if (DOM.royalScrollAssembly) {
      DOM.royalScrollAssembly.classList.remove('is-rolling-down');
      void DOM.royalScrollAssembly.offsetWidth; // Force CSS animation restart
      DOM.royalScrollAssembly.classList.add('is-rolling-down');
    }
  }

  function renderAuctionLot(index) {
    state.auctionIndex = Math.max(0, Math.min(CATEGORIES.length - 1, index));
    if (DOM.royalCanvasColumn) {
      DOM.royalCanvasColumn.classList.remove('is-fading');
    }
    if (DOM.royalScrollColumn) {
      DOM.royalScrollColumn.classList.remove('is-fading');
    }
    updateAuctionContent(state.auctionIndex);
    triggerScrollRollDown();
  }

  function goToAuctionLot(targetIndex, direction = null) {
    if (state.isAuctionAnimating) return;

    let normalizedIndex = targetIndex;
    if (normalizedIndex >= CATEGORIES.length) normalizedIndex = 0;
    if (normalizedIndex < 0) normalizedIndex = CATEGORIES.length - 1;

    state.isAuctionAnimating = true;

    // Transition: Fade out both the canvas and scroll columns gently
    if (DOM.royalCanvasColumn) DOM.royalCanvasColumn.classList.add('is-fading');
    if (DOM.royalScrollColumn) DOM.royalScrollColumn.classList.add('is-fading');

    setTimeout(() => {
      state.auctionIndex = normalizedIndex;
      updateAuctionContent(state.auctionIndex);

      requestAnimationFrame(() => {
        if (DOM.royalCanvasColumn) DOM.royalCanvasColumn.classList.remove('is-fading');
        if (DOM.royalScrollColumn) DOM.royalScrollColumn.classList.remove('is-fading');
        triggerScrollRollDown();

        setTimeout(() => {
          state.isAuctionAnimating = false;
        }, 380);
      });
    }, 240);
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================
  function bindGlobalEvents() {
    // 1. Header & Navigation View Switches
    if (DOM.headerHomeBtn) DOM.headerHomeBtn.addEventListener('click', () => switchView('home'));
    if (DOM.headerLibraryBtn) DOM.headerLibraryBtn.addEventListener('click', () => switchView('library', 'all'));
    if (DOM.libraryBackToHomeBtn) DOM.libraryBackToHomeBtn.addEventListener('click', () => switchView('home'));
    if (DOM.returnToLandingBtn) {
      DOM.returnToLandingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          sessionStorage.setItem('avarta_skip_intro', 'true');
        } catch (err) {}
        window.location.href = 'index.html?skipIntro=true';
      });
    }
    if (DOM.openAllLibraryBtn) DOM.openAllLibraryBtn.addEventListener('click', () => switchView('library', 'all'));
    if (DOM.scrollToHomeIndicator) DOM.scrollToHomeIndicator.addEventListener('click', () => switchView('home'));



    // Pagination Arrow Buttons
    if (DOM.pagArrowLeft) {
      DOM.pagArrowLeft.addEventListener('click', () => goToHomeCard(state.homeCardIndex - 1));
    }
    if (DOM.pagArrowRight) {
      DOM.pagArrowRight.addEventListener('click', () => goToHomeCard(state.homeCardIndex + 1));
    }

    // Art Auction Exhibition / Gallery Action Button
    if (DOM.homeEnterGalleryActionBtn) {
      DOM.homeEnterGalleryActionBtn.addEventListener('click', () => {
        const cat = CATEGORIES[state.homeCardIndex];
        switchView('gallery', cat ? cat.id : 0);
      });
    }
    if (DOM.auctionExitBtn) {
      DOM.auctionExitBtn.addEventListener('click', () => {
        switchView('home');
      });
    }
    if (DOM.auctionPrevBtn) {
      DOM.auctionPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToAuctionLot(state.auctionIndex - 1, -1);
      });
    }
    if (DOM.auctionNextBtn) {
      DOM.auctionNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToAuctionLot(state.auctionIndex + 1, 1);
      });
    }

    // 1. Vintage Diary Interactive Polaroids & Inspection
    if (DOM.diaryMainPolaroid) {
      DOM.diaryMainPolaroid.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = CATEGORIES[state.diaryIndex];
        if (cat && cat.paintings && cat.paintings[0]) {
          openArtworkInspectModal(cat.paintings[0]);
        }
      });
    }

    // Direct Page Turn Click Zones (clicking anywhere on right page turns forward, left turns back)
    if (DOM.vintageDiaryBook) {
      DOM.vintageDiaryBook.addEventListener('click', (e) => {
        if (DOM.artworkInspectModal && DOM.artworkInspectModal.classList.contains('is-open')) return;
        if (state.isDiaryFlipping) return;
        if (e.target.closest('#diaryMainPolaroid') || e.target.closest('.modal-content')) return;

        const rect = DOM.vintageDiaryBook.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX > rect.width * 0.55) {
          flipDiary(1); // Clicked right page -> turn next
        } else if (clickX < rect.width * 0.45) {
          flipDiary(-1); // Clicked left page -> turn prev
        }
      });
    }

    // Closed Diary Book click listener to reopen
    if (DOM.vintageDiaryClosedBook) {
      DOM.vintageDiaryClosedBook.addEventListener('click', (e) => {
        e.stopPropagation();
        openDiaryBook(0);
      });
    }

    // 2. Mouse Wheel Scroll Handling across all views
    window.addEventListener('wheel', (e) => {
      if (DOM.artworkInspectModal && DOM.artworkInspectModal.classList.contains('is-open')) return;

      const now = Date.now();
      if (now - state.lastScrollTime < 550) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 18) return;

      state.lastScrollTime = now;

      if (state.currentView === 'landing') {
        if (delta > 0) goToLandingSlide(state.landingSlideIndex + 1, 1);
        else goToLandingSlide(state.landingSlideIndex - 1, -1);
      } else if (state.currentView === 'home') {
        if (delta > 0) goToHomeCard(state.homeCardIndex + 1);
        else goToHomeCard(state.homeCardIndex - 1);
      } else if (state.currentView === 'library') {
        // In Vintage Diary mode, scrolling turns pages like a book
        if (delta > 0) flipDiary(1);
        else flipDiary(-1);
      } else if (state.currentView === 'gallery') {
        if (delta > 0) goToAuctionLot(state.auctionIndex + 1, 1);
        else goToAuctionLot(state.auctionIndex - 1, -1);
      }
    }, { passive: true });

    // 3. Mouse Drag Gesture (Home 3D Carousel, Vintage Diary, & Auction Exhibition)
    window.addEventListener('mousedown', (e) => {
      if (DOM.artworkInspectModal && DOM.artworkInspectModal.classList.contains('is-open')) return;

      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.dragDistance = 0;
      if (state.currentView === 'home' && DOM.carouselScene) {
        DOM.carouselScene.classList.add('is-dragging');
      } else if (state.currentView === 'gallery' && DOM.auctionView) {
        DOM.auctionView.classList.add('is-dragging');
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isDragging) return;
      state.dragDistance = e.clientX - state.dragStartX;
    });

    window.addEventListener('mouseup', (e) => {
      if (!state.isDragging) return;
      state.isDragging = false;
      if (DOM.carouselScene) DOM.carouselScene.classList.remove('is-dragging');
      if (DOM.auctionView) DOM.auctionView.classList.remove('is-dragging');

      const deltaY = e.clientY - state.dragStartY;
      const deltaX = e.clientX - state.dragStartX;
      const primaryDelta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;

      if (state.currentView === 'landing') {
        if (Math.abs(primaryDelta) > 50) {
          if (primaryDelta < 0) goToLandingSlide(state.landingSlideIndex + 1, 1);
          else goToLandingSlide(state.landingSlideIndex - 1, -1);
        }
      } else if (state.currentView === 'home') {
        if (Math.abs(state.dragDistance) > 40) {
          if (state.dragDistance < 0) goToHomeCard(state.homeCardIndex + 1);
          else goToHomeCard(state.homeCardIndex - 1);
        }
      } else if (state.currentView === 'library') {
        // Drag swipe on Vintage Diary
        if (Math.abs(deltaX) > 35) {
          if (deltaX < 0) {
            flipDiary(1); // Swiped Left -> Turn Page Forward
          } else {
            flipDiary(-1); // Swiped Right -> Turn Page Back
          }
        }
      } else if (state.currentView === 'gallery') {
        // Swiping right changes to the next painting/category. Swiping left goes back to previous.
        if (Math.abs(deltaX) > 35) {
          if (deltaX > 0) {
            goToAuctionLot(state.auctionIndex + 1, 1);
          } else {
            goToAuctionLot(state.auctionIndex - 1, -1);
          }
        }
      }
    });

    // 4. Touch Swipe (Mobile & Touch Devices)
    window.addEventListener('touchstart', (e) => {
      if (DOM.artworkInspectModal && DOM.artworkInspectModal.classList.contains('is-open')) return;

      const touch = e.touches[0];
      state.dragStartY = touch.clientY;
      state.dragStartX = touch.clientX;
      state.dragDistance = 0;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      state.dragDistance = e.touches[0].clientX - state.dragStartX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (DOM.artworkInspectModal && DOM.artworkInspectModal.classList.contains('is-open')) return;

      const touch = e.changedTouches[0];
      const deltaY = touch.clientY - state.dragStartY;
      const deltaX = touch.clientX - state.dragStartX;
      const primaryDelta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;

      if (state.currentView === 'landing') {
        if (Math.abs(primaryDelta) > 40) {
          if (primaryDelta < 0) goToLandingSlide(state.landingSlideIndex + 1, 1);
          else goToLandingSlide(state.landingSlideIndex - 1, -1);
        }
      } else if (state.currentView === 'home') {
        if (Math.abs(state.dragDistance) > 35) {
          if (state.dragDistance < 0) goToHomeCard(state.homeCardIndex + 1);
          else goToHomeCard(state.homeCardIndex - 1);
        }
      } else if (state.currentView === 'library') {
        if (Math.abs(deltaX) > 30) {
          if (deltaX < 0) {
            flipDiary(1); // Swipe Left -> Turn Page Forward
          } else {
            flipDiary(-1); // Swipe Right -> Turn Page Back
          }
        }
      } else if (state.currentView === 'gallery') {
        // Swiping right changes to the next painting/category. Swiping left goes back to previous.
        if (Math.abs(deltaX) > 30) {
          if (deltaX > 0) {
            goToAuctionLot(state.auctionIndex + 1, 1);
          } else {
            goToAuctionLot(state.auctionIndex - 1, -1);
          }
        }
      }
    }, { passive: true });

    // 5. Keyboard Navigation across all views
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (DOM.artworkInspectModal && DOM.artworkInspectModal.classList.contains('is-open')) {
          closeArtworkInspectModal();
          return;
        }
        if (state.currentView === 'gallery') {
          switchView('home');
          return;
        }
      }
      if (DOM.artworkInspectModal && DOM.artworkInspectModal.classList.contains('is-open')) return;
      if (document.activeElement === DOM.librarySearchInput) return;

      if (state.currentView === 'gallery') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          goToAuctionLot(state.auctionIndex + 1, 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          goToAuctionLot(state.auctionIndex - 1, -1);
        }
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        if (state.currentView === 'landing') goToLandingSlide(state.landingSlideIndex + 1, 1);
        else if (state.currentView === 'home') goToHomeCard(state.homeCardIndex + 1);
        else if (state.currentView === 'library') flipDiary(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (state.currentView === 'landing') goToLandingSlide(state.landingSlideIndex - 1, -1);
        else if (state.currentView === 'home') goToHomeCard(state.homeCardIndex - 1);
        else if (state.currentView === 'library') flipDiary(-1);
      }
    });

    // 6. Home 3D Chevrons
    if (DOM.prevBtn) DOM.prevBtn.addEventListener('click', () => goToHomeCard(state.homeCardIndex - 1));
    if (DOM.nextBtn) DOM.nextBtn.addEventListener('click', () => goToHomeCard(state.homeCardIndex + 1));

    // 7. Library Search Input
    if (DOM.librarySearchInput) {
      DOM.librarySearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderLibraryGrid();
      });
    }

    // 8. Lightbox Modal Close
    if (DOM.closeArtworkModalBtn) DOM.closeArtworkModalBtn.addEventListener('click', closeArtworkInspectModal);
    if (DOM.artworkModalBackdrop) DOM.artworkModalBackdrop.addEventListener('click', closeArtworkInspectModal);
  }

  // Bootstrap on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

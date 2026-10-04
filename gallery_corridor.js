/**
 * AVĀRTĀ ® — 3D Dark-Luxury Palace & Museum Gallery Corridor Engine (Three.js)
 * Moody dark-luxury palace museum architecture combining elements of the Louvre's
 * gilded galleries, cathedral fluted marble columns, gilded coffered ceilings,
 * and dark polished veined marble flooring under intimate candlelight.
 *
 * NOTE: Scroll mechanics, card-stack logic, and camera Z milestones are strictly preserved.
 */

(function () {
  'use strict';

  // Royal palace art catalogue: 10 on Left Wall, 10 on Right Wall
  const PAINTINGS = [
    // ---------------- Left Wall (x = -7.4) ----------------
    {
      id: 'mona_lisa',
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci, c. 1503',
      wall: 'left',
      z: 18,
      w: 3.4,
      h: 4.8,
      src: 'assets/paintings/mona_lisa.jpg'
    },
    {
      id: 'blue_boy',
      title: 'The Blue Boy',
      artist: 'Thomas Gainsborough, 1770',
      wall: 'left',
      z: 5,
      w: 3.4,
      h: 5.2,
      src: 'assets/paintings/blue_boy.jpg'
    },
    {
      id: 'girl_pearl',
      title: 'Girl with a Pearl Earring',
      artist: 'Johannes Vermeer, 1665',
      wall: 'left',
      z: -8,
      w: 3.4,
      h: 4.6,
      src: 'assets/paintings/girl_pearl_earring.jpg'
    },
    {
      id: 'winterhalter',
      title: 'Empress Elisabeth of Austria',
      artist: 'Franz Xaver Winterhalter, 1865',
      wall: 'left',
      z: -21,
      w: 3.6,
      h: 5.2,
      src: 'assets/paintings/winterhalter.jpg'
    },
    {
      id: 'venus',
      title: 'The Birth of Venus',
      artist: 'Sandro Botticelli, c. 1485',
      wall: 'left',
      z: -34,
      w: 5.4,
      h: 3.8,
      src: 'assets/paintings/birth_of_venus.jpg'
    },
    {
      id: 'charles_i',
      title: 'Charles I at the Hunt',
      artist: 'Anthony van Dyck, 1635',
      wall: 'left',
      z: -47,
      w: 3.8,
      h: 5.0,
      src: 'assets/paintings/charles_i.jpg'
    },
    {
      id: 'the_scream',
      title: 'The Scream',
      artist: 'Edvard Munch, 1893',
      wall: 'left',
      z: -60,
      w: 3.4,
      h: 4.8,
      src: 'assets/paintings/the_scream.jpg'
    },
    {
      id: 'marie_antoinette',
      title: 'Marie Antoinette with a Rose',
      artist: 'Élisabeth Vigée Le Brun, 1783',
      wall: 'left',
      z: -73,
      w: 3.6,
      h: 5.0,
      src: 'assets/paintings/marie_antoinette.jpg'
    },
    {
      id: 'the_kiss',
      title: 'The Kiss',
      artist: 'Gustav Klimt, 1908',
      wall: 'left',
      z: -86,
      w: 3.8,
      h: 4.8,
      src: 'assets/paintings/the_kiss.jpg'
    },
    {
      id: 'lady_ermine',
      title: 'Lady with an Ermine',
      artist: 'Leonardo da Vinci, c. 1489',
      wall: 'left',
      z: -100,
      w: 3.4,
      h: 4.8,
      src: 'assets/paintings/lady_ermine.jpg'
    },
    {
      id: 'primavera',
      title: 'Primavera',
      artist: 'Sandro Botticelli, c. 1482',
      wall: 'left',
      z: -112,
      w: 5.2,
      h: 3.8,
      src: 'assets/paintings/primavera.jpg'
    },
    {
      id: 'delacroix',
      title: 'Liberty Leading the People',
      artist: 'Eugène Delacroix, 1830',
      wall: 'left',
      z: -124,
      w: 4.8,
      h: 4.0,
      src: 'assets/paintings/delacroix.jpg'
    },

    // ---------------- Right Wall (x = +7.4) ----------------
    {
      id: 'starry_night',
      title: 'The Starry Night',
      artist: 'Vincent van Gogh, 1889',
      wall: 'right',
      z: 18,
      w: 5.2,
      h: 4.2,
      src: 'assets/paintings/starry_night.jpg'
    },
    {
      id: 'castiglione',
      title: 'Baldassare Castiglione',
      artist: 'Raphael, 1514',
      wall: 'right',
      z: 5,
      w: 3.6,
      h: 4.8,
      src: 'assets/paintings/castiglione.jpg'
    },
    {
      id: 'milkmaid',
      title: 'The Milkmaid',
      artist: 'Johannes Vermeer, c. 1658',
      wall: 'right',
      z: -8,
      w: 3.4,
      h: 4.6,
      src: 'assets/paintings/milkmaid.jpg'
    },
    {
      id: 'las_meninas',
      title: 'Las Meninas',
      artist: 'Diego Velázquez, 1656',
      wall: 'right',
      z: -21,
      w: 4.4,
      h: 5.0,
      src: 'assets/paintings/las_meninas.jpg'
    },
    {
      id: 'wanderer',
      title: 'Wanderer above the Sea of Fog',
      artist: 'Caspar David Friedrich, 1818',
      wall: 'right',
      z: -34,
      w: 3.4,
      h: 4.8,
      src: 'assets/paintings/wanderer.jpg'
    },
    {
      id: 'louis_xiv',
      title: 'Portrait of Louis XIV',
      artist: 'Hyacinthe Rigaud, 1701',
      wall: 'right',
      z: -47,
      w: 3.8,
      h: 5.4,
      src: 'assets/paintings/louis_xiv.jpg'
    },
    {
      id: 'great_wave',
      title: 'The Great Wave off Kanagawa',
      artist: 'Katsushika Hokusai, c. 1831',
      wall: 'right',
      z: -60,
      w: 5.2,
      h: 3.8,
      src: 'assets/paintings/great_wave.jpg'
    },
    {
      id: 'water_lilies',
      title: 'Water Lilies',
      artist: 'Claude Monet, 1906',
      wall: 'right',
      z: -73,
      w: 5.2,
      h: 4.0,
      src: 'assets/paintings/water_lilies.jpg'
    },
    {
      id: 'night_watch',
      title: 'The Night Watch',
      artist: 'Rembrandt van Rijn, 1642',
      wall: 'right',
      z: -86,
      w: 5.2,
      h: 4.4,
      src: 'assets/paintings/night_watch.jpg'
    },
    {
      id: 'grande_jatte',
      title: 'A Sunday on La Grande Jatte',
      artist: 'Georges Seurat, 1884',
      wall: 'right',
      z: -100,
      w: 5.4,
      h: 3.8,
      src: 'assets/paintings/grande_jatte.jpg'
    },
    {
      id: 'school_of_athens',
      title: 'The School of Athens',
      artist: 'Raphael, 1509–1511',
      wall: 'right',
      z: -112,
      w: 5.4,
      h: 4.0,
      src: 'assets/paintings/school_of_athens.jpg'
    },
    {
      id: 'monet_garden',
      title: "The Artist's Garden at Giverny",
      artist: 'Claude Monet, 1900',
      wall: 'right',
      z: -124,
      w: 4.8,
      h: 4.0,
      src: 'assets/paintings/water_lilies.jpg'
    }
  ];

  // Rhythmic architectural column positions defining gallery bays
  const COLUMN_Z_POSITIONS = [24, -2, -28, -54, -80, -106, -132];

  // Sconce mounting positions along corridor (including near Card 10 enter gallery portal)
  const SCONCE_Z_POSITIONS = [11.5, -15, -41, -67, -93, -119, -138];

  // Calibrated camera Z milestones for Cards 0 through 10 (Strictly Preserved)
  const CARD_Z_POSITIONS = [
    26,    // Card 0: Entrance, framing first portraits
    13,    // Card 1: What is AVĀRTĀ
    0,     // Card 2: The Idea
    -13,   // Card 3: Our Purpose
    -26,   // Card 4: The Experience
    -40,   // Card 5: Difference
    -54,   // Card 6: Principle
    -68,   // Card 7: The Name
    -84,   // Card 8: Vision
    -102,  // Card 9: Audience
    -124   // Card 10: Closing / Standing in front of the Luminous Portal
  ];

  let container = null;
  let canvas = null;
  let renderer = null;
  let scene = null;
  let camera = null;

  let isInitialized = false;
  let isRunning = false;
  let rafId = null;

  let currentCardIndex = 0;
  let currentZ = CARD_Z_POSITIONS[0];
  let targetZ = CARD_Z_POSITIONS[0];
  let startZ = CARD_Z_POSITIONS[0];

  let isTransitioning = false;
  let transitionStartTime = 0;
  const TRANSITION_DURATION = 850;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  let walkBobY = 0;
  let walkSwayX = 0;

  let dustParticles = null;
  let portalMesh = null;
  let portalHalo = null;
  let portalLight = null;
  let sconceFlames = [];
  let cursorSpotLight = null;
  let gateLeftRef = null;
  let gateRightRef = null;

  // Cinematic Gallery Room Entrance Transition State
  let isWarping = false;
  let warpStartTime = 0;
  const WARP_DURATION = 2400;
  let warpStartZ = -124;
  const WARP_TARGET_Z = -146.5;
  const INITIAL_FOV = 56;
  let warpOnComplete = null;

  // 20-Second Cinematic Palace Gallery Entrance Animation State
  let isEntranceMode = false;
  let entranceStartTime = 0;
  const ENTRANCE_DURATION = 20000;
  let entranceOnComplete = null;
  let ambientLightRef = null;
  let depthLightRef = null;
  const corridorSconceLights = [];
  const paintingClothObjects = [];

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function easeOutCubicBezier(t) {
    const t2 = 1 - t;
    return 1 - Math.pow(t2, 3.2);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Procedural Rich Red Velvet Draped Fabric Texture
   */
  function createRedVelvetClothTexture() {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    // Rich crimson red velvet base
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#3d080e');
    grad.addColorStop(0.35, '#72121c');
    grad.addColorStop(0.7, '#4e0b12');
    grad.addColorStop(1, '#240407');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Realistic vertical drape folds and velvet sheen
    for (let x = 0; x < size; x += 18) {
      const foldGrad = ctx.createLinearGradient(x, 0, x + 18, 0);
      foldGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      foldGrad.addColorStop(0.45, 'rgba(255, 130, 140, 0.22)');
      foldGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
      ctx.fillStyle = foldGrad;
      ctx.fillRect(x, 0, 18, size);
    }

    // Antique Gold embroidered fringe / tassels at bottom edge
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, size - 22, size, 22);
    for (let fx = 0; fx < size; fx += 10) {
      ctx.fillStyle = '#6b4e14';
      ctx.fillRect(fx, size - 22, 2, 22);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  /**
   * Procedural Dark Obsidian & Champagne Gold Marble Floor Texture
   * Center runner of diagonal midnight slate & obsidian marble tiles with fine champagne gold brass inlay (Matching Explore Section Theme)
   */
  function createDarkMarbleFloorTexture() {
    const size = 1024;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    // Deep dark obsidian / midnight border base matching explore theme
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, size, size);

    // Center checkered runner area (x from 140 to 884)
    const runnerLeft = 140;
    const runnerRight = 884;
    const runnerWidth = runnerRight - runnerLeft;

    ctx.fillStyle = '#04060b';
    ctx.fillRect(runnerLeft, 0, runnerWidth, size);

    // Diagonal 45-degree checkered diamond tiles
    const tileSize = 68;
    ctx.save();
    ctx.beginPath();
    ctx.rect(runnerLeft, 0, runnerWidth, size);
    ctx.clip();

    ctx.translate(size / 2, 0);
    ctx.rotate(Math.PI / 4);

    const diagSpan = size * 1.5;
    for (let x = -diagSpan; x <= diagSpan; x += tileSize) {
      for (let y = -diagSpan; y <= diagSpan; y += tileSize) {
        const isWhite = ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0);
        if (isWhite) {
          // Polished midnight slate / dark obsidian marble tile with soft gold veining
          const creamGrad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
          creamGrad.addColorStop(0, '#141b2a');
          creamGrad.addColorStop(0.5, '#1e283c');
          creamGrad.addColorStop(1, '#111724');
          ctx.fillStyle = creamGrad;
        } else {
          // Deep black obsidian Belgian marble tile
          const darkGrad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
          darkGrad.addColorStop(0, '#05070d');
          darkGrad.addColorStop(0.5, '#0e1320');
          darkGrad.addColorStop(1, '#040509');
          ctx.fillStyle = darkGrad;
        }
        ctx.fillRect(x, y, tileSize, tileSize);

        // Fine champagne gold tile grout line
        ctx.strokeStyle = 'rgba(223, 194, 130, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
    ctx.restore();

    // Fine brass inlay border seams flanking the runner matching explore gold theme
    ctx.strokeStyle = '#dfc282';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(runnerLeft, 0);
    ctx.lineTo(runnerLeft, size);
    ctx.moveTo(runnerRight, 0);
    ctx.lineTo(runnerRight, size);
    ctx.stroke();

    // Subtle gold & calcite veining
    ctx.fillStyle = 'rgba(223, 194, 130, 0.06)';
    for (let i = 0; i < 3500; i++) {
      ctx.fillRect(Math.random() * size, Math.random() * size, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(c);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 16);
    return texture;
  }

  /**
   * Procedural Dark Obsidian Coffered Ceiling Texture
   * Deep obsidian slate ceiling beams with fine champagne gold fillet accents (Matching Explore Section Theme)
   */
  function createGildedCofferedCeilingTexture() {
    const size = 1024;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    // Dark obsidian ceiling base
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, size, size);

    // 4x4 Coffered panels
    const cofferSize = 220;
    const step = 256;
    const offset = 18;

    for (let gx = 0; gx < 4; gx++) {
      for (let gy = 0; gy < 4; gy++) {
        const cx = gx * step + offset;
        const cy = gy * step + offset;

        // Outer recessed shadow
        ctx.fillStyle = '#040508';
        ctx.fillRect(cx - 4, cy - 4, cofferSize + 8, cofferSize + 8);

        // Midnight obsidian beam molding
        ctx.strokeStyle = '#121827';
        ctx.lineWidth = 6;
        ctx.strokeRect(cx, cy, cofferSize, cofferSize);

        // Fine champagne gold inner accent line
        ctx.strokeStyle = '#dfc282';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 6, cy + 6, cofferSize - 12, cofferSize - 12);

        // Recessed inner panel matching explore background gradient
        const innerGrad = ctx.createRadialGradient(
          cx + cofferSize / 2, cy + cofferSize / 2, 10,
          cx + cofferSize / 2, cy + cofferSize / 2, cofferSize / 2
        );
        innerGrad.addColorStop(0, '#161e30');
        innerGrad.addColorStop(0.65, '#0b0f1a');
        innerGrad.addColorStop(1, '#05070d');
        ctx.fillStyle = innerGrad;
        ctx.fillRect(cx + 8, cy + 8, cofferSize - 16, cofferSize - 16);
      }
    }

    const texture = new THREE.CanvasTexture(c);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 16);
    return texture;
  }

  /**
   * Procedural Dark Luxury Obsidian Slate Gallery Wall Texture
   * Classical slate & obsidian paneled hallway with raised moldings, chair rails, and warm gold fillet trims (Matching Explore Section Theme)
   */
  function createAgedStoneWallTexture() {
    const w = 1024;
    const h = 1024;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');

    // Dark luxury obsidian slate wall base matching explore theme (#070a12)
    const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
    baseGrad.addColorStop(0, '#070a12');
    baseGrad.addColorStop(0.3, '#0d1220');
    baseGrad.addColorStop(0.65, '#090c16');
    baseGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // Fine vertical obsidian slate grain
    for (let x = 0; x < w; x += 3) {
      const alpha = Math.random() * 0.12 + 0.02;
      const isDark = Math.random() > 0.4;
      ctx.fillStyle = isDark ? `rgba(6, 9, 15, ${alpha})` : `rgba(223, 194, 130, 0.04)`;
      ctx.fillRect(x, 0, Math.random() * 2 + 1, h);
    }

    // Top Classical Cornice & Dentil Band (y = 0 to 120)
    const corniceGrad = ctx.createLinearGradient(0, 0, 0, 120);
    corniceGrad.addColorStop(0, '#05070d');
    corniceGrad.addColorStop(0.7, '#101625');
    corniceGrad.addColorStop(1, '#0b0f1a');
    ctx.fillStyle = corniceGrad;
    ctx.fillRect(0, 0, w, 120);

    ctx.fillStyle = '#dfc282';
    ctx.fillRect(0, 114, w, 4);

    // Upper Picture-Hanging Boiserie Panels (y = 140 to 680)
    const panelWidth = 440;
    const panelHeight = 520;
    const panelY = 150;

    [50, 534].forEach((px) => {
      // Recessed obsidian panel interior
      ctx.fillStyle = '#080b14';
      ctx.fillRect(px, panelY, panelWidth, panelHeight);

      // Deep outer shadow bevel
      ctx.strokeStyle = '#04060b';
      ctx.lineWidth = 12;
      ctx.strokeRect(px, panelY, panelWidth, panelHeight);

      // Raised obsidian molding
      ctx.strokeStyle = '#151c2b';
      ctx.lineWidth = 6;
      ctx.strokeRect(px + 6, panelY + 6, panelWidth - 12, panelHeight - 12);

      // Fine champagne gold fillet matching explore theme
      ctx.strokeStyle = '#dfc282';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px + 12, panelY + 12, panelWidth - 24, panelHeight - 24);

      // Inner dark obsidian chiaroscuro panel shading (Dark, atmospheric, moody theme)
      const panelShade = ctx.createRadialGradient(
        px + panelWidth / 2, panelY + panelHeight / 2, 40,
        px + panelWidth / 2, panelY + panelHeight / 2, panelWidth / 2
      );
      panelShade.addColorStop(0, 'rgba(12, 16, 26, 0.05)');
      panelShade.addColorStop(1, 'rgba(2, 3, 6, 0.95)');
      ctx.fillStyle = panelShade;
      ctx.fillRect(px + 14, panelY + 14, panelWidth - 28, panelHeight - 28);
    });

    // Middle Chair Rail / Dado Molding (y = 690 to 740)
    const dadoGrad = ctx.createLinearGradient(0, 690, 0, 740);
    dadoGrad.addColorStop(0, '#05070d');
    dadoGrad.addColorStop(0.35, '#141c2c');
    dadoGrad.addColorStop(0.7, '#0e1422');
    dadoGrad.addColorStop(1, '#05070c');
    ctx.fillStyle = dadoGrad;
    ctx.fillRect(0, 690, w, 50);

    ctx.fillStyle = '#dfc282';
    ctx.fillRect(0, 705, w, 3.5);

    // Lower Wainscot Paneling (y = 745 to 1024)
    ctx.fillStyle = '#080b13';
    ctx.fillRect(0, 745, w, 279);

    [50, 534].forEach((wx) => {
      ctx.fillStyle = '#06080e';
      ctx.fillRect(wx, 765, panelWidth, 230);

      ctx.strokeStyle = '#040509';
      ctx.lineWidth = 10;
      ctx.strokeRect(wx, 765, panelWidth, 230);

      ctx.strokeStyle = '#121826';
      ctx.lineWidth = 5;
      ctx.strokeRect(wx + 5, 770, panelWidth - 10, 220);

      ctx.strokeStyle = '#dfc282';
      ctx.lineWidth = 2;
      ctx.strokeRect(wx + 10, 775, panelWidth - 20, 210);
    });

    const texture = new THREE.CanvasTexture(c);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(16, 1);
    return texture;
  }

  /**
   * Grand Giant Royal Vintage Realistic Gate (Full Corridor Scale)
   * Replaces the entire arch with a monumental grand wrought-iron & champagne gold royal gate
   */
  function createRoyalVintageGate(goldMat, darkMarbleMat) {
    const gateMasterGroup = new THREE.Group();

    // Deep rich polished obsidian/navy wood material matching gallery corridor wainscoting
    const doorWoodMat = new THREE.MeshStandardMaterial({
      color: 0x18222d,
      roughness: 0.28,
      metalness: 0.45
    });

    // Champagne gold metal material for ornate door trims, filigree & handles
    const doorGoldMat = goldMat || new THREE.MeshStandardMaterial({
      color: 0xe5c158,
      roughness: 0.2,
      metalness: 0.88
    });

    // Translucent warm champagne amber glass for upper lattice windows
    const doorGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffedd0,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.42
    });

    // Grand Surround Gate Frame Dimensions (Spans full corridor: width = 14.2, height = 12.2)
    const totalHeight = 12.2;
    const gateLeafWidth = 5.65;
    const gateLeafHeight = 9.2;

    // 1. Grand Flanking Gate Pillars (Obsidian Marble with Gold Capitals & Pedestals)
    const pillarGeo = new THREE.BoxGeometry(1.4, totalHeight, 1.4);
    const leftPillar = new THREE.Mesh(pillarGeo, darkMarbleMat);
    leftPillar.position.set(-6.4, totalHeight / 2 - 4.5, 0);
    gateMasterGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, darkMarbleMat);
    rightPillar.position.set(6.4, totalHeight / 2 - 4.5, 0);
    gateMasterGroup.add(rightPillar);

    // Pillar Gold Trims & Capitals
    [-6.4, 6.4].forEach((px) => {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.65, 1.75), doorGoldMat);
      cap.position.set(px, 7.2, 0);
      gateMasterGroup.add(cap);

      const base = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.75, 1.85), doorGoldMat);
      base.position.set(px, -4.1, 0);
      gateMasterGroup.add(base);
    });

    // 2. Grand Overhead Arch Frame & Crest Pediment
    const archRadius = 5.7;
    const archTube = 0.52;
    const grandArchGeo = new THREE.TorusGeometry(archRadius, archTube, 16, 48, Math.PI);
    const grandArch = new THREE.Mesh(grandArchGeo, doorGoldMat);
    grandArch.position.set(0, 1.6, 0);
    gateMasterGroup.add(grandArch);

    // Lion-Head Keystone Crest Block at Top of Grand Gate
    const crestBlock = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 1.1), doorGoldMat);
    crestBlock.position.set(0, 7.2, 0.1);
    gateMasterGroup.add(crestBlock);

    const crestRosette = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 12), doorGoldMat);
    crestRosette.position.set(0, 7.2, 0.6);
    gateMasterGroup.add(crestRosette);

    // Flanking Torch Sconces on Grand Gate Pillars
    const leftSconce = createCandleSconce('left', doorGoldMat);
    leftSconce.group.position.set(-7.2, 1.2, 0.4);
    gateMasterGroup.add(leftSconce.group);

    const rightSconce = createCandleSconce('right', doorGoldMat);
    rightSconce.group.position.set(7.2, 1.2, 0.4);
    gateMasterGroup.add(rightSconce.group);

    // Helper to construct a Grand Royal Gallery Door Leaf (Left or Right)
    function buildDoorLeaf(isLeft) {
      const doorGroup = new THREE.Group();
      const hingeX = isLeft ? -5.7 : 5.7;
      doorGroup.position.set(hingeX, 0.1, 0);

      const doorContent = new THREE.Group();
      const contentOffsetX = isLeft ? gateLeafWidth / 2 : -gateLeafWidth / 2;
      doorContent.position.set(contentOffsetX, 0, 0);

      const frameThickness = 0.28;
      const frameDepth = 0.24;

      // --- A. HEAVY OUTER WOOD FRAME WITH GOLD INLAY TRIMS ---
      // Top Rail
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth, frameThickness, frameDepth), doorWoodMat);
      topRail.position.y = gateLeafHeight / 2;
      doorContent.add(topRail);

      const topRailGold = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth - 0.2, 0.05, frameDepth + 0.02), doorGoldMat);
      topRailGold.position.y = gateLeafHeight / 2 - frameThickness / 2;
      doorContent.add(topRailGold);

      // Bottom Rail
      const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth, frameThickness * 1.5, frameDepth), doorWoodMat);
      bottomRail.position.y = -gateLeafHeight / 2;
      doorContent.add(bottomRail);

      const bottomRailGold = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth - 0.2, 0.06, frameDepth + 0.02), doorGoldMat);
      bottomRailGold.position.y = -gateLeafHeight / 2 + (frameThickness * 1.5) / 2;
      doorContent.add(bottomRailGold);

      // Mid Horizontal Rail (Dividing lower wainscoting and upper glass lattice)
      const midRailY = -0.6;
      const midRail = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth, 0.42, frameDepth), doorWoodMat);
      midRail.position.y = midRailY;
      doorContent.add(midRail);

      const midRailGoldTop = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth - 0.2, 0.06, frameDepth + 0.03), doorGoldMat);
      midRailGoldTop.position.y = midRailY + 0.21;
      doorContent.add(midRailGoldTop);

      const midRailGoldBottom = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth - 0.2, 0.06, frameDepth + 0.03), doorGoldMat);
      midRailGoldBottom.position.y = midRailY - 0.21;
      doorContent.add(midRailGoldBottom);

      // Hinge Stile & Center Meeting Stile
      const hingeStileX = isLeft ? -gateLeafWidth / 2 : gateLeafWidth / 2;
      const centerStileX = isLeft ? gateLeafWidth / 2 : -gateLeafWidth / 2;

      const hingeStile = new THREE.Mesh(new THREE.BoxGeometry(frameThickness * 1.2, gateLeafHeight, frameDepth), doorWoodMat);
      hingeStile.position.x = hingeStileX;
      doorContent.add(hingeStile);

      const centerStile = new THREE.Mesh(new THREE.BoxGeometry(frameThickness * 1.2, gateLeafHeight, frameDepth), doorWoodMat);
      centerStile.position.x = centerStileX;
      doorContent.add(centerStile);

      // Vertical Gold Moulding Inlays on Stiles
      [-gateLeafWidth / 2, gateLeafWidth / 2].forEach(stX => {
        const stileGold = new THREE.Mesh(new THREE.BoxGeometry(0.05, gateLeafHeight - 0.4, frameDepth + 0.02), doorGoldMat);
        stileGold.position.x = stX;
        doorContent.add(stileGold);
      });

      // --- B. LOWER SECTION: SOLID WAINSCOTING PANELS WITH DOUBLE GOLD MOULDINGS ---
      const lowerHeight = 3.6;
      const lowerCenterY = -2.6;

      // Solid Wood Backing Board
      const lowerBoard = new THREE.Mesh(new THREE.BoxGeometry(gateLeafWidth - 0.5, lowerHeight, 0.14), doorWoodMat);
      lowerBoard.position.set(0, lowerCenterY, 0);
      doorContent.add(lowerBoard);

      // Two Beveled Recessed Gold Panel Frames
      const panelWidth = (gateLeafWidth - 1.1) / 2;
      const panelPositions = [-panelWidth / 2 - 0.15, panelWidth / 2 + 0.15];

      panelPositions.forEach(px => {
        // Outer Gold Frame
        const pOuter = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, lowerHeight - 0.5, 0.18), doorGoldMat);
        pOuter.position.set(px, lowerCenterY, 0.02);
        doorContent.add(pOuter);

        // Inner Wood Inset
        const pInner = new THREE.Mesh(new THREE.BoxGeometry(panelWidth - 0.22, lowerHeight - 0.72, 0.22), doorWoodMat);
        pInner.position.set(px, lowerCenterY, 0.03);
        doorContent.add(pInner);

        // Center Rosette Medallion
        const rosetteOuter = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.045, 8, 20), doorGoldMat);
        rosetteOuter.position.set(px, lowerCenterY, 0.15);
        doorContent.add(rosetteOuter);

        const rosetteCenter = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), doorGoldMat);
        rosetteCenter.position.set(px, lowerCenterY, 0.16);
        doorContent.add(rosetteCenter);
      });

      // --- C. UPPER SECTION: TRANSLUCENT AMBER GLASS & GOLD DIAMOND LATTICE ---
      const upperHeight = 4.6;
      const upperCenterY = 1.9;
      const latticeWidth = gateLeafWidth - 0.5;

      // Amber Translucent Glass Backing Panel
      const glassPane = new THREE.Mesh(new THREE.BoxGeometry(latticeWidth, upperHeight, 0.05), doorGlassMat);
      glassPane.position.set(0, upperCenterY, 0);
      doorContent.add(glassPane);

      // Gold Outer Framing for Upper Lattice Window
      const glassFrame = new THREE.Mesh(new THREE.BoxGeometry(latticeWidth, upperHeight, 0.12), doorGoldMat);
      glassFrame.position.set(0, upperCenterY, 0.01);
      const glassInnerWood = new THREE.Mesh(new THREE.BoxGeometry(latticeWidth - 0.2, upperHeight - 0.2, 0.14), doorWoodMat);
      glassInnerWood.position.set(0, upperCenterY, 0.01);
      doorContent.add(glassFrame);
      doorContent.add(glassInnerWood);

      // Elegant Diamond Trellis Lattice (Slanted Gold Mullions)
      const diamondGroup = new THREE.Group();
      diamondGroup.position.set(0, upperCenterY, 0.04);

      const numDiagonals = 6;
      const diagSpacing = latticeWidth / numDiagonals;

      for (let d = -numDiagonals; d <= numDiagonals; d++) {
        // Diagonal +45 deg
        const diagPositive = new THREE.Mesh(new THREE.BoxGeometry(0.045, upperHeight * 1.2, 0.03), doorGoldMat);
        diagPositive.position.x = d * diagSpacing;
        diagPositive.rotation.z = Math.PI / 4;
        diamondGroup.add(diagPositive);

        // Diagonal -45 deg
        const diagNegative = new THREE.Mesh(new THREE.BoxGeometry(0.045, upperHeight * 1.2, 0.03), doorGoldMat);
        diagNegative.position.x = d * diagSpacing;
        diagNegative.rotation.z = -Math.PI / 4;
        diamondGroup.add(diagNegative);
      }

      doorContent.add(diamondGroup);

      // Decorative Gilded Central Emblem / Wreath on Upper Lattice
      const emblemRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.055, 8, 24), doorGoldMat);
      emblemRing.position.set(0, upperCenterY, 0.1);
      doorContent.add(emblemRing);

      const emblemCore = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), doorGoldMat);
      emblemCore.position.set(0, upperCenterY, 0.12);
      doorContent.add(emblemCore);

      // --- D. SCULPTED LUXURY BRASS HANDLES & LOCK ESCUTCHEON ---
      const handleY = midRailY;
      const escutcheonX = isLeft ? gateLeafWidth / 2 - 0.24 : -gateLeafWidth / 2 + 0.24;

      // Polished Gold Escutcheon Plate
      const escutcheon = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.4, 0.1), doorGoldMat);
      escutcheon.position.set(escutcheonX, handleY, 0.12);
      doorContent.add(escutcheon);

      // Sculpted Vertical Gold Handle Bar
      const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 12), doorGoldMat);
      handleBar.position.set(escutcheonX, handleY, 0.25);
      doorContent.add(handleBar);

      // Top & Bottom Handle Mount Brackets
      [-0.4, 0.4].forEach(hy => {
        const mount = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), doorGoldMat);
        mount.position.set(escutcheonX, handleY + hy, 0.2);
        doorContent.add(mount);
      });

      doorGroup.add(doorContent);
      return doorGroup;
    }

    const leftGateGroup = buildDoorLeaf(true);
    const rightGateGroup = buildDoorLeaf(false);

    gateMasterGroup.add(leftGateGroup);
    gateMasterGroup.add(rightGateGroup);

    return {
      group: gateMasterGroup,
      leftGate: leftGateGroup,
      rightGate: rightGateGroup
    };
  }
  /**
   * Ornate Thick Baroque / Rococo Gold Leaf Picture Frame
   */
  function createBaroqueFrame(width, height) {
    const frameGroup = new THREE.Group();
    const border = 0.52;
    const depth = 0.38;

    // Antique gold leaf material with rich specular glint
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.22
    });

    // Dark antique gold inner bevel
    const darkGoldMat = new THREE.MeshStandardMaterial({
      color: 0x7a5e20,
      metalness: 0.88,
      roughness: 0.35
    });

    // Outer Baroque Frame Bars
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(width + border * 2, border, depth), goldMat);
    topBar.position.y = (height / 2) + (border / 2);
    frameGroup.add(topBar);

    const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(width + border * 2, border, depth), goldMat);
    bottomBar.position.y = -(height / 2) - (border / 2);
    frameGroup.add(bottomBar);

    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(border, height, depth), goldMat);
    leftBar.position.x = -(width / 2) - (border / 2);
    frameGroup.add(leftBar);

    const rightBar = new THREE.Mesh(new THREE.BoxGeometry(border, height, depth), goldMat);
    rightBar.position.x = (width / 2) + (border / 2);
    frameGroup.add(rightBar);

    // Carved Baroque Corner Cartouches / Rosettes
    const cornerSize = border * 1.35;
    const cornerDepth = depth * 1.25;
    const cornerGeo = new THREE.BoxGeometry(cornerSize, cornerSize, cornerDepth);
    const rosetteGeo = new THREE.SphereGeometry(border * 0.32, 8, 8);

    const cornerPositions = [
      [-(width / 2) - (border / 2), (height / 2) + (border / 2)],
      [(width / 2) + (border / 2), (height / 2) + (border / 2)],
      [-(width / 2) - (border / 2), -(height / 2) - (border / 2)],
      [(width / 2) + (border / 2), -(height / 2) - (border / 2)]
    ];

    cornerPositions.forEach(([cx, cy]) => {
      const cornerBlock = new THREE.Mesh(cornerGeo, goldMat);
      cornerBlock.position.set(cx, cy, 0.02);
      frameGroup.add(cornerBlock);

      const rosette = new THREE.Mesh(rosetteGeo, goldMat);
      rosette.position.set(cx, cy, cornerDepth / 2 + 0.02);
      frameGroup.add(rosette);
    });

    // Inner Bevel Liner
    const linerBorder = 0.16;
    const linerTop = new THREE.Mesh(new THREE.BoxGeometry(width, linerBorder, depth * 0.75), darkGoldMat);
    linerTop.position.y = (height / 2) - (linerBorder / 2);
    frameGroup.add(linerTop);

    const linerBottom = new THREE.Mesh(new THREE.BoxGeometry(width, linerBorder, depth * 0.75), darkGoldMat);
    linerBottom.position.y = -(height / 2) + (linerBorder / 2);
    frameGroup.add(linerBottom);

    const linerLeft = new THREE.Mesh(new THREE.BoxGeometry(linerBorder, height - linerBorder * 2, depth * 0.75), darkGoldMat);
    linerLeft.position.x = -(width / 2) + (linerBorder / 2);
    frameGroup.add(linerLeft);

    const linerRight = new THREE.Mesh(new THREE.BoxGeometry(linerBorder, height - linerBorder * 2, depth * 0.75), darkGoldMat);
    linerRight.position.x = (width / 2) - (linerBorder / 2);
    frameGroup.add(linerRight);

    // Backing Board
    const backing = new THREE.Mesh(
      new THREE.PlaneGeometry(width + border * 2, height + border * 2),
      new THREE.MeshBasicMaterial({ color: 0x05060a })
    );
    backing.position.z = -0.15;
    frameGroup.add(backing);

    return frameGroup;
  }

  /**
   * Classical Royal Palace Brass Placard
   */
  function createPlacard(title, artist) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 160;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 160);
    grad.addColorStop(0, '#1c160e');
    grad.addColorStop(0.5, '#3b2c17');
    grad.addColorStop(1, '#18120a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 160);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 144);
    ctx.strokeStyle = '#7a5e20';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, 480, 128);

    ctx.fillStyle = '#fffcf2';
    ctx.font = 'bold 32px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(title.toUpperCase(), 256, 68);

    ctx.fillStyle = '#dfc282';
    ctx.font = '500 22px "Space Grotesk", sans-serif';
    ctx.fillText(artist, 256, 116);

    const texture = new THREE.CanvasTexture(c);
    const placardMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 0.58),
      new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.9,
        roughness: 0.28
      })
    );
    return placardMesh;
  }

  /**
   * Tall Classical Fluted Column (Marble Shaft with Antique Gold Corinthian Capital)
   */
  function createFlutedColumn(goldMat, marbleMat) {
    const colGroup = new THREE.Group();

    // Plinth / Pedestal Base (Floor y = -4.5)
    const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.1, 1.35), marbleMat);
    baseBlock.position.y = -3.95;
    colGroup.add(baseBlock);

    const baseTrim = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.18, 1.45), goldMat);
    baseTrim.position.y = -3.35;
    colGroup.add(baseTrim);

    // Fluted Column Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.46, 0.52, 11.2, 24);
    const shaft = new THREE.Mesh(shaftGeo, marbleMat);
    shaft.position.y = 2.25;
    colGroup.add(shaft);

    // Decorative Gold Fillet Rings on Shaft
    const lowerRing = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.05, 8, 20), goldMat);
    lowerRing.rotation.x = Math.PI / 2;
    lowerRing.position.y = -3.1;
    colGroup.add(lowerRing);

    const upperRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 8, 20), goldMat);
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = 7.4;
    colGroup.add(upperRing);

    // Ornate Corinthian / Composite Capital
    const capitalBell = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.48, 0.65, 16), goldMat);
    capitalBell.position.y = 7.75;
    colGroup.add(capitalBell);

    const capitalAbacus = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.35, 1.5), goldMat);
    capitalAbacus.position.y = 8.18;
    colGroup.add(capitalAbacus);

    return colGroup;
  }

  /**
   * Transverse Semicircular Barrel Archway Beam
   * Springs between left and right column capitals, breaking hallway into grand museum bays
   */
  function createTransverseArch(corridorWidth, goldMat, stoneMat) {
    const archGroup = new THREE.Group();

    // Semicircular Vault Arch Beam
    const archRadius = (corridorWidth / 2) - 0.4;
    const archGeo = new THREE.TorusGeometry(archRadius, 0.38, 12, 32, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, stoneMat);
    archMesh.position.set(0, 7.6, 0);
    archGroup.add(archMesh);

    // Gilded Inner Molding Ribbon
    const goldArchGeo = new THREE.TorusGeometry(archRadius - 0.15, 0.08, 8, 32, Math.PI);
    const goldArchMesh = new THREE.Mesh(goldArchGeo, goldMat);
    goldArchMesh.position.set(0, 7.6, 0.02);
    archGroup.add(goldArchMesh);

    // Central Keystone Relief
    const keystone = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.75, 0.85), goldMat);
    keystone.position.set(0, 7.6 + archRadius + 0.1, 0);
    archGroup.add(keystone);

    return archGroup;
  }

  /**
   * Classical Brass Wall Sconce with Warm Pleated Silk Lampshades (Matching reference image)
   * Detailed antique brass backplate, curved arm, and twin warm glowing pleated lampshades.
   */
  function createCandleSconce(wallSide, goldMat) {
    const sconce = new THREE.Group();
    const isLeft = wallSide === 'left';
    const dir = isLeft ? 1 : -1;

    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xffeed2,
      emissive: 0xdf9838,
      emissiveIntensity: 0.82,
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const bulbCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfff8e8
    });

    // 1. Ornate Backplate
    const backplate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.36), goldMat);
    sconce.add(backplate);

    // 2. Curved Brass S-Arm
    const armGeo = new THREE.TorusGeometry(0.42, 0.042, 8, 20, Math.PI * 0.95);
    const arm = new THREE.Mesh(armGeo, goldMat);
    arm.position.set(dir * 0.36, 0.05, 0);
    arm.rotation.z = isLeft ? -Math.PI / 2 : Math.PI / 2;
    sconce.add(arm);

    // 3. Central Hub & Candle Cup
    const hubX = dir * 0.72;
    const hubY = 0.22;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.25, 12), goldMat);
    hub.position.set(hubX, hubY, 0);
    sconce.add(hub);

    // Twin Pleated Lampshades (Matching the dual shade sconces in reference image)
    [-0.22, 0.22].forEach((offsetZ) => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.32, 8), goldMat);
      stem.position.set(hubX, hubY + 0.16, offsetZ);
      sconce.add(stem);

      // Fluted Pleated Silk Shade
      const shadeGeo = new THREE.CylinderGeometry(0.16, 0.28, 0.42, 16, 1, true);
      const shade = new THREE.Mesh(shadeGeo, shadeMat);
      shade.position.set(hubX, hubY + 0.48, offsetZ);
      sconce.add(shade);

      // Glowing Filament Bulb
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), bulbCoreMat);
      bulb.position.set(hubX, hubY + 0.45, offsetZ);
      sconce.add(bulb);
      sconceFlames.push(bulb);
    });

    return { group: sconce, hubPos: new THREE.Vector3(hubX, hubY + 0.4, 0) };
  }

  /**
   * Warm Amber Globe / Lantern Pendant Chandelier (Matching reference image)
   * Ceiling rosette, drop-rod, brass lantern cap, equatorial ring, and luminous amber glass globe.
   */
  function createCeilingChandelier(goldMat) {
    const chandelier = new THREE.Group();

    // Warm luminous globe glass material
    const globeGlassMat = new THREE.MeshStandardMaterial({
      color: 0xfff0d0,
      emissive: 0xffaa40,
      emissiveIntensity: 0.88,
      roughness: 0.25,
      metalness: 0.05,
      transparent: true,
      opacity: 0.94
    });

    const bulbCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfff6dc
    });

    // Ceiling Mount Rosette at y = 8.4
    const rosetteGeo = new THREE.CylinderGeometry(0.45, 0.6, 0.18, 16);
    const rosette = new THREE.Mesh(rosetteGeo, goldMat);
    rosette.position.y = 8.4;
    chandelier.add(rosette);

    // Drop Rod / Chain from 8.4 down to 6.2
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8);
    const rod = new THREE.Mesh(rodGeo, goldMat);
    rod.position.y = 7.3;
    chandelier.add(rod);

    // Classical brass lantern cap
    const capGeo = new THREE.CylinderGeometry(0.28, 0.72, 0.38, 16);
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.y = 6.2;
    chandelier.add(cap);

    // Gilded brass equatorial ring
    const ringGeo = new THREE.TorusGeometry(0.76, 0.055, 8, 24);
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 5.65;
    chandelier.add(ring);

    // Luminous Warm Amber Glass Globe (Matching reference image)
    const globeGeo = new THREE.SphereGeometry(0.72, 24, 24);
    const globe = new THREE.Mesh(globeGeo, globeGlassMat);
    globe.position.y = 5.65;
    globe.scale.set(1.0, 1.25, 1.0);
    chandelier.add(globe);

    // Center radiant bulb filament
    const bulbGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const bulb = new THREE.Mesh(bulbGeo, bulbCoreMat);
    bulb.position.y = 5.65;
    chandelier.add(bulb);
    sconceFlames.push(bulb);

    // Bottom brass finial drop
    const finialGeo = new THREE.ConeGeometry(0.14, 0.35, 12);
    const finial = new THREE.Mesh(finialGeo, goldMat);
    finial.rotation.x = Math.PI;
    finial.position.y = 4.65;
    chandelier.add(finial);

    return chandelier;
  }

  function buildScene() {
    scene = new THREE.Scene();
    // Deep dark atmospheric moody obsidian theme background (#030408)
    scene.background = new THREE.Color(0x030408);
    scene.fog = new THREE.FogExp2(0x030408, 0.0048);

    const textureLoader = new THREE.TextureLoader();

    // Load Explore Page Background Image Texture to seamlessly match Explore section
    textureLoader.load('assets/explore_bg.png?v=studio_desk_v1', (exploreBgTex) => {
      exploreBgTex.encoding = THREE.sRGBEncoding;
      scene.background = exploreBgTex;
    });

    // Corridor Dimensions
    const corridorWidth = 15;
    const corridorHeight = 13;
    const corridorLength = 240;
    const corridorCenterZ = -75;

    // Common Gilded Champagne Gold & Polished Dark Obsidian Materials (Explore Section Theme)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfc282,
      roughness: 0.22,
      metalness: 0.94
    });

    const darkMarbleMat = new THREE.MeshStandardMaterial({
      color: 0x090c16,
      roughness: 0.25,
      metalness: 0.45
    });

    const stoneArchMat = new THREE.MeshStandardMaterial({
      color: 0x0d1220,
      roughness: 0.35,
      metalness: 0.3
    });

    // -------------------------------------------------------------------------
    // 1. Diamond Harlequin Checkered Marble Floor (Matching reference image)
    // -------------------------------------------------------------------------
    const floorTexture = createDarkMarbleFloorTexture();
    const floorGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.16,
      metalness: 0.42,
      color: 0xffffff
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -4.5, corridorCenterZ);
    scene.add(floor);

    // -------------------------------------------------------------------------
    // 2. Dark Walnut Coffered Wood Ceiling
    // -------------------------------------------------------------------------
    const ceilTexture = createGildedCofferedCeilingTexture();
    const ceilGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const ceilMat = new THREE.MeshStandardMaterial({
      map: ceilTexture,
      roughness: 0.72,
      metalness: 0.18,
      color: 0xffffff
    });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 8.5, corridorCenterZ);
    scene.add(ceiling);

    // -------------------------------------------------------------------------
    // 3. Antique Walnut Boiserie Walls
    // -------------------------------------------------------------------------
    const wallTexture = createAgedStoneWallTexture();
    const wallGeo = new THREE.PlaneGeometry(corridorLength, corridorHeight);
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.45,
      metalness: 0.12,
      color: 0xffffff
    });

    // Left Wall
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-corridorWidth / 2, 2.0, corridorCenterZ);
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(corridorWidth / 2, 2.0, corridorCenterZ);
    scene.add(rightWall);

    // Continuous 3D Baseboards and Crown Moldings
    const baseboardGeo = new THREE.BoxGeometry(0.35, 0.65, corridorLength);
    const leftBase = new THREE.Mesh(baseboardGeo, darkMarbleMat);
    leftBase.position.set(-corridorWidth / 2 + 0.17, -4.18, corridorCenterZ);
    scene.add(leftBase);

    const rightBase = new THREE.Mesh(baseboardGeo, darkMarbleMat);
    rightBase.position.set(corridorWidth / 2 - 0.17, -4.18, corridorCenterZ);
    scene.add(rightBase);

    const crownGeo = new THREE.BoxGeometry(0.48, 0.55, corridorLength);
    const leftCrown = new THREE.Mesh(crownGeo, goldMat);
    leftCrown.position.set(-corridorWidth / 2 + 0.24, 8.25, corridorCenterZ);
    scene.add(leftCrown);

    const rightCrown = new THREE.Mesh(crownGeo, goldMat);
    rightCrown.position.set(corridorWidth / 2 - 0.24, 8.25, corridorCenterZ);
    scene.add(rightCrown);

    // -------------------------------------------------------------------------
    // 4. Tall Walnut Pilasters & Transverse Ceiling Arches
    // -------------------------------------------------------------------------
    const colXOffset = (corridorWidth / 2) - 0.45;

    COLUMN_Z_POSITIONS.forEach((cz) => {
      // Left Fluted Column
      const leftCol = createFlutedColumn(goldMat, darkMarbleMat);
      leftCol.position.set(-colXOffset, 0, cz);
      scene.add(leftCol);

      // Right Fluted Column
      const rightCol = createFlutedColumn(goldMat, darkMarbleMat);
      rightCol.position.set(colXOffset, 0, cz);
      scene.add(rightCol);

      // Transverse Archway Beam across ceiling
      const arch = createTransverseArch(corridorWidth, goldMat, stoneArchMat);
      arch.position.set(0, 0, cz);
      scene.add(arch);
    });

    // -------------------------------------------------------------------------
    // 5. Dark Atmospheric Chiaroscuro Lighting (Moody Dark Luxury Theme)
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x0e1420, 0.45);
    scene.add(ambientLight);
    ambientLightRef = ambientLight;

    // Soft overall gallery depth wash matching explore page warm ambient glow (#dfc282)
    const depthLight = new THREE.DirectionalLight(0xedd296, 0.25);
    depthLight.position.set(0, 10, 15);
    scene.add(depthLight);
    depthLightRef = depthLight;

    // -------------------------------------------------------------------------
    // 6. Localized Lampshade Sconces & Warm Globe Lantern Chandeliers
    // -------------------------------------------------------------------------
    const wallXOffset = (corridorWidth / 2) - 0.06;
    corridorSconceLights.length = 0;

    SCONCE_Z_POSITIONS.forEach((sz) => {
      // Hanging Warm Globe Lantern Chandelier in Center of Vault
      const ceilingChandelier = createCeilingChandelier(goldMat);
      ceilingChandelier.position.set(0, 0, sz);
      scene.add(ceilingChandelier);

      const chandelierLight = new THREE.PointLight(0xffaa40, 2.8, 24, 1.6);
      chandelierLight.position.set(0, 5.6, sz);
      scene.add(chandelierLight);
      corridorSconceLights.push({ light: chandelierLight, z: sz });

      // Left Wall Sconce
      const leftSconce = createCandleSconce('left', goldMat);
      leftSconce.group.position.set(-wallXOffset, 1.85, sz);
      scene.add(leftSconce.group);

      // Right Wall Sconce
      const rightSconce = createCandleSconce('right', goldMat);
      rightSconce.group.position.set(wallXOffset, 1.85, sz);
      scene.add(rightSconce.group);

      // Warm Amber Candle Lights Illuminating Walls & Paintings
      const leftCandleLight = new THREE.PointLight(0xffb850, 2.4, 16, 1.7);
      leftCandleLight.position.set(-wallXOffset + 1.1, 2.35, sz);
      scene.add(leftCandleLight);
      corridorSconceLights.push({ light: leftCandleLight, z: sz });

      const rightCandleLight = new THREE.PointLight(0xffb850, 2.4, 16, 1.7);
      rightCandleLight.position.set(wallXOffset - 1.1, 2.35, sz);
      scene.add(rightCandleLight);
      corridorSconceLights.push({ light: rightCandleLight, z: sz });
    });

    // -------------------------------------------------------------------------
    // 7. Royal Masterpieces & Ornate Baroque Gold Frames with 3D Red Velvet Cloths
    // -------------------------------------------------------------------------
    paintingClothObjects.length = 0;
    const clothTexture = createRedVelvetClothTexture();

    PAINTINGS.forEach((p) => {
      const isLeft = p.wall === 'left';
      const pX = isLeft ? -wallXOffset : wallXOffset;
      const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
      const centerY = 1.85;

      const group = new THREE.Group();
      group.position.set(pX, centerY, p.z);
      group.rotation.y = rotY;

      // Ornate Baroque Frame
      const frame = createBaroqueFrame(p.w, p.h);
      group.add(frame);

      // Canvas Artwork
      const canvasGeo = new THREE.PlaneGeometry(p.w, p.h);
      const canvasMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.04
      });

      textureLoader.load(p.src, (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        canvasMat.map = tex;
        canvasMat.needsUpdate = true;
      });

      const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
      canvasMesh.position.z = 0.04;
      group.add(canvasMesh);

      // Royal Brass Placard
      const placard = createPlacard(p.title, p.artist);
      placard.position.set(0, -(p.h / 2) - 0.85, 0.05);
      group.add(placard);

      // Classical Brass Museum Picture Lamp
      const fixtureY = (p.h / 2) + 0.75;
      const fixtureStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8),
        goldMat
      );
      fixtureStem.position.set(0, fixtureY, 0.45);
      fixtureStem.rotation.x = Math.PI / 4;
      group.add(fixtureStem);

      const fixtureHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, Math.min(p.w * 0.65, 2.6), 12),
        goldMat
      );
      fixtureHead.position.set(0, fixtureY - 0.22, 0.7);
      fixtureHead.rotation.z = Math.PI / 2;
      group.add(fixtureHead);

      scene.add(group);

      // Focused Museum Spotlight Illuminating Each Artwork
      const spotLight = new THREE.PointLight(0xffdf9e, 1.7, 12, 1.6);
      spotLight.position.set(
        isLeft ? pX + 1.2 : pX - 1.2,
        centerY + (p.h / 2) + 0.35,
        p.z
      );
      scene.add(spotLight);

      paintingClothObjects.push({
        p: p,
        group: group,
        spotLight: spotLight,
        isRevealed: true,
        dropProgress: 1.0
      });
    });

    // -------------------------------------------------------------------------
    // 8. Monumental Full-Hall Grand Royal Vintage Gate (Replacing old arch)
    // -------------------------------------------------------------------------
    const portalZ = -145;
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, portalZ);

    const archGoldMat = new THREE.MeshStandardMaterial({
      color: 0xdfc282,
      roughness: 0.22,
      metalness: 0.94
    });

    // 3D Grand Royal Vintage Realistic Double Gate (Full Corridor Scale)
    const royalGate = createRoyalVintageGate(archGoldMat, darkMarbleMat);
    royalGate.group.position.set(0, 0, 0);
    portalGroup.add(royalGate.group);
    gateLeftRef = royalGate.leftGate;
    gateRightRef = royalGate.rightGate;

    // Radiant Ambient Golden Halo Rim around Grand Gate Threshold
    const glowGeo = new THREE.PlaneGeometry(15, 16);
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 512;
    glowCanvas.height = 512;
    const gctx = glowCanvas.getContext('2d');
    const grad = gctx.createRadialGradient(256, 256, 100, 256, 256, 256);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.5, 'rgba(245, 215, 120, 0.28)');
    grad.addColorStop(0.85, 'rgba(223, 194, 130, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 512, 512);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    portalHalo = new THREE.Mesh(glowGeo, glowMat);
    portalHalo.position.set(0, 1.8, -0.2);
    portalGroup.add(portalHalo);

    // Ethereal Golden Point Light Illuminating Behind Open Gate
    portalLight = new THREE.PointLight(0xffdf9a, 2.8, 75, 1.2);
    portalLight.position.set(0, 2.2, -0.5);
    portalGroup.add(portalLight);

    scene.add(portalGroup);

    // -------------------------------------------------------------------------
    // 9. Floating Particles (Removed per user request)
    // -------------------------------------------------------------------------
    dustParticles = null;

    // -------------------------------------------------------------------------
    // 10. Interactive Cursor Flashlight (Subtle Gallery Illumination on Card 0)
    // -------------------------------------------------------------------------
    cursorSpotLight = new THREE.PointLight(0xffebd2, 2.2, 22, 1.8);
    cursorSpotLight.position.set(0, 1.8, 23.5);
    scene.add(cursorSpotLight);
  }

  function onResize() {
    if (!renderer || !camera || !container) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (!isRunning) {
      renderer.render(scene, camera);
    }
  }

  function onMouseMove(e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function goToIndex(index) {
    if (index < 0 || index >= CARD_Z_POSITIONS.length) return;
    currentCardIndex = index;

    startZ = currentZ;
    targetZ = CARD_Z_POSITIONS[index];
    transitionStartTime = performance.now();
    isTransitioning = true;

    if (prefersReducedMotion()) {
      currentZ = targetZ;
      camera.position.z = currentZ;
      isTransitioning = false;
      if (renderer && scene) renderer.render(scene, camera);
    }
  }

  function enterWorldAnimation(callback) {
    if (isWarping) return;
    isWarping = true;
    warpStartTime = performance.now();
    warpStartZ = currentZ;
    warpOnComplete = callback;

    // Fade out card 10 elements so the archway entrance is unobstructed while stepping into the gallery room
    const activeCard = document.querySelector('.about-card.active, .about-card[data-card="10"]');
    if (activeCard) {
      activeCard.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      activeCard.style.opacity = '0';
      activeCard.style.transform = 'scale(1.03)';
    }

    const warpOverlay = document.getElementById('portal-world-warp');
    if (warpOverlay) {
      warpOverlay.classList.remove('dissolving');
      warpOverlay.classList.add('warping');
    }

    if (prefersReducedMotion()) {
      if (warpOverlay) warpOverlay.classList.add('reduced-motion');
      setTimeout(() => {
        if (typeof warpOnComplete === 'function') warpOnComplete();
        isWarping = false;
        if (warpOverlay) {
          warpOverlay.classList.remove('warping', 'reduced-motion');
        }
      }, 400);
      return;
    }
  }

  function animate(timestamp) {
    if (!isRunning) return;
    rafId = requestAnimationFrame(animate);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    if (isEntranceMode) {
      const elapsed = timestamp - entranceStartTime;
      const progress = Math.min(elapsed / ENTRANCE_DURATION, 1.0);

      // Phase 1 (0.0s - 2.0s): Abandoned Deep Darkness
      if (elapsed < 2000) {
        currentZ = 26;
        if (ambientLightRef) ambientLightRef.intensity = 0.04;
        if (depthLightRef) depthLightRef.intensity = 0.02;
      }

      // Phase 2 (2.0s - 4.2s): First Ceiling Chandelier & Front Sconces Power On at Z = 11.5
      if (elapsed >= 2000 && elapsed < 4200) {
        const light1Prog = Math.min((elapsed - 2000) / 2000, 1.0);
        corridorSconceLights.forEach(s => {
          if (s.z === SCONCE_Z_POSITIONS[0]) {
            s.light.intensity = 2.6 * light1Prog;
          }
        });
        if (ambientLightRef) {
          ambientLightRef.intensity = 0.04 + 0.22 * light1Prog;
        }
      }

      // Phase 3 (4.2s - 16.5s): Smooth 3D Autonomous Camera Glide Down the Grand Corridor & Return
      if (elapsed >= 4200 && elapsed < 16500) {
        const glideProgress = (elapsed - 4200) / 12300;

        // Dynamic camera path: 4.2s-13.5s forward walk (Z = 26 -> -78), 13.5s-16.5s smooth return glide to Z = 26
        if (glideProgress < 0.75) {
          const fwdT = glideProgress / 0.75;
          const easedFwd = easeInOutQuad(fwdT);
          currentZ = 26 + (-78 - 26) * easedFwd;
        } else {
          const retT = (glideProgress - 0.75) / 0.25;
          const easedRet = easeInOutQuad(retT);
          currentZ = -78 + (26 - (-78)) * easedRet;
        }

        // Realistic rhythmic walking head-bob and sway
        const walkSpeed = glideProgress * Math.PI * 14;
        const damp = (1.0 - Math.pow(Math.max(0, glideProgress - 0.8) / 0.2, 2));
        walkBobY = -Math.abs(Math.sin(walkSpeed)) * 0.11 * damp;
        walkSwayX = Math.sin(walkSpeed) * 0.045 * damp;

        // Ambient lighting warms up gradually
        if (ambientLightRef) {
          ambientLightRef.intensity = 0.26 + 0.62 * glideProgress;
        }
        if (depthLightRef) {
          depthLightRef.intensity = 0.02 + 0.38 * glideProgress;
        }
      }

      // Sequential Sconce & Ceiling Chandelier Power-On down the corridor
      if (elapsed >= 2000) {
        corridorSconceLights.forEach((s) => {
          if (currentZ <= s.z + 18.0 || elapsed >= 14000) {
            s.light.intensity = Math.min(2.6, s.light.intensity + 0.07);
          }
        });
      }

      // Simultaneous Red Velvet Cloth Slide/Fall & 3D Painting Reveal
      if (elapsed >= 3500) {
        paintingClothObjects.forEach(item => {
          if (currentZ <= item.p.z + 20.0 || elapsed >= 13500) {
            item.isRevealed = true;
          }
          if (item.isRevealed && item.dropProgress < 1.0) {
            item.dropProgress += 0.016;
            const easeDrop = Math.pow(item.dropProgress, 2.0);
            item.clothMesh.position.y = -easeDrop * (item.p.h * 1.4);
            item.clothMat.opacity = Math.max(0, 1.0 - easeDrop * 1.25);
            item.spotLight.intensity = Math.min(1.7, item.spotLight.intensity + 0.06);
          }
        });
      }

      // Phase 4 (16.5s - 20.0s): Grand settled gallery perspective & UI climax
      if (elapsed >= 16500) {
        currentZ = CARD_Z_POSITIONS[0]; // Settles at entrance hero framing (Z = 26)
        walkBobY = Math.sin(timestamp * 0.0015) * 0.02;
        walkSwayX = Math.cos(timestamp * 0.001) * 0.015;

        if (ambientLightRef) ambientLightRef.intensity = 0.88;
        if (depthLightRef) depthLightRef.intensity = 0.4;
        corridorSconceLights.forEach(s => { s.light.intensity = 2.6; });
        paintingClothObjects.forEach(item => {
          item.clothMat.opacity = 0;
          item.clothMesh.position.y = -item.p.h * 1.5;
          item.spotLight.intensity = 1.7;
          item.isRevealed = true;
          item.dropProgress = 1.0;
        });

        if (progress >= 1.0 && isEntranceMode) {
          isEntranceMode = false;
          if (typeof entranceOnComplete === 'function') {
            const cb = entranceOnComplete;
            entranceOnComplete = null;
            cb();
          }
        }
      }
    } else if (isWarping) {
      const elapsed = timestamp - warpStartTime;
      const progress = Math.min(elapsed / WARP_DURATION, 1.0);

      // Phase 1 (0.0 - 0.55): Royal Vintage Gate Unlatches & Opens Smoothly Outwards
      const gateOpenT = Math.min(progress / 0.55, 1.0);
      const gateEase = easeInOutQuad(gateOpenT);
      const openAngle = gateEase * (Math.PI * 0.56);
      if (gateLeftRef) gateLeftRef.rotation.y = -openAngle;
      if (gateRightRef) gateRightRef.rotation.y = openAngle;

      // Phase 2 (0.1 - 0.9): Radiant Golden Ethereal Light Shaft Erupts from Open Gate Threshold
      if (portalLight) {
        portalLight.intensity = 2.4 + Math.sin(progress * Math.PI) * 11.5;
      }
      if (portalHalo) {
        portalHalo.scale.setScalar(1.0 + Math.sin(progress * Math.PI) * 0.65);
      }

      // Phase 3 (0.15 - 1.0): Camera Dolleys Smoothly Forward Through the Open Royal Gate into the Gallery Sanctuary
      const camT = Math.max(0, (progress - 0.15) / 0.85);
      const camEased = easeOutCubicBezier(camT);
      currentZ = warpStartZ + (WARP_TARGET_Z - warpStartZ) * camEased;

      // Rhythmic subtle walking sway as user steps through the gate
      const walkFactor = Math.sin(progress * Math.PI);
      walkBobY = -Math.abs(Math.sin(progress * Math.PI * 2)) * 0.12 * walkFactor;
      walkSwayX = Math.sin(progress * Math.PI * 2) * 0.05 * walkFactor;

      if (progress >= 0.95 && warpOnComplete) {
        const cb = warpOnComplete;
        warpOnComplete = null;
        isWarping = false;
        currentZ = CARD_Z_POSITIONS[0];
        walkBobY = 0;
        walkSwayX = 0;

        if (gateLeftRef) gateLeftRef.rotation.y = 0;
        if (gateRightRef) gateRightRef.rotation.y = 0;

        const warpOverlay = document.getElementById('portal-world-warp');
        if (warpOverlay) {
          warpOverlay.classList.remove('warping');
          warpOverlay.classList.add('dissolving');
          setTimeout(() => {
            warpOverlay.classList.remove('dissolving');
          }, 850);
        }

        try {
          cb();
        } catch (e) {
          console.error('Warp callback error:', e);
        }
        return;
      }
    } else if (isTransitioning) {
      const elapsed = timestamp - transitionStartTime;
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1.0);
      const eased = easeOutCubicBezier(progress);

      currentZ = startZ + (targetZ - startZ) * eased;

      const walkFactor = Math.sin(progress * Math.PI);
      walkBobY = -Math.abs(Math.sin(progress * Math.PI * 2)) * 0.14 * walkFactor;
      walkSwayX = Math.sin(progress * Math.PI * 2) * 0.06 * walkFactor;

      if (progress >= 1.0) {
        currentZ = targetZ;
        isTransitioning = false;
        walkBobY = 0;
        walkSwayX = 0;
      }
    } else {
      const idleTime = timestamp * 0.0015;
      walkBobY = Math.sin(idleTime) * 0.02;
      walkSwayX = Math.cos(idleTime * 0.7) * 0.015;
    }

    camera.position.x = walkSwayX + (mouseX * 0.3);
    camera.position.y = 1.8 + walkBobY - (mouseY * 0.22);
    camera.position.z = currentZ;

    camera.rotation.y = -mouseX * 0.035;
    camera.rotation.x = -mouseY * 0.02;
    camera.rotation.z = -walkSwayX * 0.02;

    // Subtle chandelier bulb glow & light shimmer
    if (sconceFlames.length > 0) {
      const flicker = 1.0 + Math.sin(timestamp * 0.007) * 0.08;
      sconceFlames.forEach((f, i) => {
        const offsetFlicker = flicker + Math.sin(timestamp * 0.0085 + i * 0.7) * 0.06;
        f.scale.set(0.85 * offsetFlicker, 1.35 * offsetFlicker, 0.85 * offsetFlicker);
      });
    }

    if (dustParticles) {
      const positions = dustParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(timestamp * 0.001 + i) * 0.002;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    if (portalLight && currentCardIndex === 10) {
      portalLight.intensity = 2.4 + Math.sin(timestamp * 0.003) * 0.4;
    }

    // Subtle 3D gallery corridor illumination under user's cursor on Card 0
    if (cursorSpotLight) {
      if (currentCardIndex === 0 && !isWarping && !isEntranceMode) {
        cursorSpotLight.intensity = 2.4;
        cursorSpotLight.position.x = camera.position.x + mouseX * 4.8;
        cursorSpotLight.position.y = camera.position.y - mouseY * 3.2;
        cursorSpotLight.position.z = camera.position.z - 2.8;
      } else {
        cursorSpotLight.intensity = 0;
      }
    }

    renderer.render(scene, camera);
  }

  function startEntranceAnimation(onComplete) {
    if (!isInitialized) init();
    resume();

    isEntranceMode = true;
    entranceStartTime = performance.now();
    entranceOnComplete = onComplete;
    currentZ = 26;
    startZ = 26;
    targetZ = 26;
    camera.position.set(0, 1.8, 26);

    if (ambientLightRef) ambientLightRef.intensity = 0.04;
    if (depthLightRef) depthLightRef.intensity = 0.02;

    corridorSconceLights.forEach(s => { s.light.intensity = 0; });
    paintingClothObjects.forEach(item => {
      item.clothMesh.position.y = 0;
      item.clothMat.opacity = 1.0;
      item.spotLight.intensity = 0;
      item.isRevealed = false;
      item.dropProgress = 0.0;
    });
  }

  function finishEntranceAnimation() {
    isEntranceMode = false;
    currentZ = CARD_Z_POSITIONS[0];
    camera.position.set(0, 1.8, CARD_Z_POSITIONS[0]);
    walkBobY = 0;
    walkSwayX = 0;

    if (ambientLightRef) ambientLightRef.intensity = 0.88;
    if (depthLightRef) depthLightRef.intensity = 0.4;

    corridorSconceLights.forEach(s => { s.light.intensity = 2.6; });
    paintingClothObjects.forEach(item => {
      if (item.clothMesh) {
        item.clothMesh.visible = false;
      }
      item.spotLight.intensity = 1.7;
      item.isRevealed = true;
      item.dropProgress = 1.0;
    });

    if (typeof entranceOnComplete === 'function') {
      const cb = entranceOnComplete;
      entranceOnComplete = null;
      cb();
    }
  }

  function init() {
    if (isInitialized) return;

    canvas = document.getElementById('corridor-canvas');
    container = document.body;
    if (!canvas || typeof THREE === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // Moody dark-luxury private viewing exposure
    renderer.toneMappingExposure = 1.08;
    renderer.outputEncoding = THREE.sRGBEncoding;

    camera = new THREE.PerspectiveCamera(56, width / height, 0.1, 290);
    camera.position.set(0, 1.8, CARD_Z_POSITIONS[0]);

    buildScene();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    isInitialized = true;
    resume();
  }

  function resume() {
    if (!isInitialized) init();
    if (!isInitialized || isRunning) return;

    isRunning = true;
    if (canvas) {
      canvas.style.opacity = '1';
      canvas.style.visibility = 'visible';
    }
    onResize();
    rafId = requestAnimationFrame(animate);
  }

  function pause() {
    isRunning = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (canvas) {
      canvas.style.opacity = '0';
      canvas.style.visibility = 'hidden';
    }
  }

  window.avartaCorridor = {
    init: init,
    resume: resume,
    pause: pause,
    goToIndex: goToIndex,
    enterWorldAnimation: enterWorldAnimation,
    startEntranceAnimation: startEntranceAnimation,
    finishEntranceAnimation: finishEntranceAnimation,
    isEntranceActive: function () {
      return isEntranceMode;
    },
    resize: onResize,
    getCurrentZ: function () {
      return currentZ;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

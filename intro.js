/**
 * AVĀRTĀ ® — "THE FORGOTTEN GALLERY AWAKENS" 20-SECOND CINEMATIC ENTRANCE ANIMATION CONTROLLER
 * Powered directly by the 3D WebGL Palace Museum Corridor Engine (Matching About Us visuals).
 *
 * Sequence:
 *   0.0s - 2.0s  : Abandoned 3D Gallery in Deep Darkness (Faint moonlight silhouette, 3D red velvet cloths on all paintings)
 *   2.0s - 4.2s  : First Ceiling Chandelier Powers On: Warm amber flame & downward beam ignite; golden dust motes drift
 *   4.2s - 16.5s : Autonomous 3D Camera Glide: Continuous forward dolly walk through the 3D palace corridor
 *   4.8s - 15.0s : Ceiling lights power on one by one down the corridor; Simultaneously, 3D red velvet cloths slide/fall down slowly, revealing the paintings
 *   15.0s - 16.5s: Full 3D Palace Gallery reaches radiant golden illumination across marble floor and gilded ceiling
 *   16.5s - 17.4s: Camera smoothly settles at the grand focal perspective of the palace corridor
 *   17.4s        : AVĀRTĀ title materializes with glowing metallic antique-gold typography
 *   18.3s        : Tagline "Beyond the Frame, Within the Story" appears below
 *   18.9s        : "Enter the Gallery" toggle button appears below
 *   19.4s        : Top horizontal bar with four center-aligned toggles (Home, Collection, About Us, Explore) slides down
 *   20.0s        : Seamless handover to interactive mode with mouse fluid ripples and parallax
 */

(function () {
  'use strict';

  // ── FX State & Particle Canvas Engine ──
  let ctx = null;
  let canvas = null;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let isFXRunning = false;

  const dustParticles = [];
  const DUST_COUNT = 85;

  let isBeamActive = false;
  let beamProgress = 0.0;

  const cursorTrail = [];
  let mouseX = width * 0.5;
  let mouseY = height * 0.5;

  let isWarping = false;
  const warpStreaks = [];

  function initFXCanvas() {
    canvas = document.getElementById('intro-fx-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Populate Ambient Golden Dust Motes concentrated in chandelier spotlight beams
    dustParticles.length = 0;
    for (let i = 0; i < DUST_COUNT; i++) {
      const isCentral = Math.random() < 0.72;
      const spawnX = isCentral
        ? width * 0.5 + (Math.random() - 0.5) * width * 0.45
        : Math.random() * width;

      dustParticles.push({
        x: spawnX,
        y: Math.random() * height * 0.95,
        radius: Math.random() * 2.0 + 0.6,
        alpha: Math.random() * 0.5 + 0.15,
        speedY: (Math.random() * 0.15 + 0.03) * (Math.random() < 0.5 ? 1 : -1),
        speedX: (Math.random() - 0.5) * 0.12,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseAngle: Math.random() * Math.PI * 2,
        isCentral: isCentral
      });
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorTrail.length < 15) {
        cursorTrail.push({
          x: mouseX + (Math.random() - 0.5) * 6,
          y: mouseY + (Math.random() - 0.5) * 6,
          radius: Math.random() * 1.6 + 0.5,
          life: 1.0,
          decay: Math.random() * 0.035 + 0.025
        });
      }
    }, { passive: true });

    if (!isFXRunning) {
      isFXRunning = true;
      requestAnimationFrame(renderFX);
    }
  }

  function activateLightBeam() {
    isBeamActive = true;
  }

  function spawnWarpStreaks() {
    isWarping = true;
    warpStreaks.length = 0;
    const WARP_COUNT = 85;

    for (let i = 0; i < WARP_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      warpStreaks.push({
        angle: angle,
        dist: Math.random() * 100 + 20,
        speed: Math.random() * 12 + 9,
        len: Math.random() * 40 + 16,
        width: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.25
      });
    }
  }

  function renderFX() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    if (isBeamActive && beamProgress < 1.0) {
      beamProgress += 0.01;
    }

    // 1. Render Golden Dust Particles in the Light Beams
    for (let i = 0; i < dustParticles.length; i++) {
      const p = dustParticles[i];
      p.y += p.speedY;
      p.x += Math.sin(p.pulseAngle) * p.speedX;
      p.pulseAngle += p.pulseSpeed;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x += (dx / dist) * 0.35;
        p.y += (dy / dist) * 0.35;
      }

      if (p.y < 0) p.y = height * 0.95;
      if (p.y > height * 0.95) p.y = 10;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      // Particles in the active central beam illuminate warmly with gold glow
      const inCone = Math.abs(p.x - width * 0.5) < (width * 0.24 + p.y * 0.30);
      const intensity = inCone && isBeamActive ? (1.2 + beamProgress * 0.6) : 0.55;
      const currentAlpha = (Math.sin(p.pulseAngle) * 0.3 + 0.7) * p.alpha * intensity;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 230, 160, ${Math.min(currentAlpha, 1.0).toFixed(3)})`;
      ctx.shadowBlur = inCone ? 10 : 4;
      ctx.shadowColor = 'rgba(229, 193, 88, 0.75)';
      ctx.fill();
    }

    // 2. Render Subtle Cursor Light Trail
    for (let i = cursorTrail.length - 1; i >= 0; i--) {
      const ct = cursorTrail[i];
      ct.life -= ct.decay;
      if (ct.life <= 0) {
        cursorTrail.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(ct.x, ct.y, ct.radius * ct.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 180, ${(ct.life * 0.55).toFixed(2)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(229, 193, 88, 0.55)';
      ctx.fill();
    }

    // 3. Render Warp Streaks on Enter Gallery click
    if (isWarping) {
      for (let i = 0; i < warpStreaks.length; i++) {
        const ws = warpStreaks[i];
        ws.dist += ws.speed;
        ws.speed *= 1.08;

        const sx = width * 0.5 + Math.cos(ws.angle) * ws.dist;
        const sy = height * 0.44 + Math.sin(ws.angle) * ws.dist;
        const ex = sx + Math.cos(ws.angle) * ws.len;
        const ey = sy + Math.sin(ws.angle) * ws.len;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(255, 230, 160, ${ws.alpha.toFixed(2)})`;
        ctx.lineWidth = ws.width;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(229, 193, 88, 0.85)';
        ctx.stroke();
      }
    }

    requestAnimationFrame(renderFX);
  }

  // ── 1. Check if intro should be bypassed ──
  let skipIntroParam = false;
  let skipIntroSession = false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    skipIntroParam = urlParams.get('skipIntro') === 'true' || urlParams.get('skipIntro') === '1';
    skipIntroSession = sessionStorage.getItem('avarta_skip_intro') === 'true';
  } catch (e) {}

  const hasNoIntroClass = document.documentElement.classList.contains('no-intro');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (skipIntroParam || skipIntroSession || hasNoIntroClass || prefersReduced) {
    try {
      if (skipIntroSession) {
        sessionStorage.removeItem('avarta_skip_intro');
      }
      if (skipIntroParam && window.history.replaceState) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (e) {}

    function bypassIntro() {
      const el = document.getElementById('avarta-intro');
      if (el) {
        el.style.display = 'none';
        el.classList.add('intro-done');
      }
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-navbar-visible');

      const letterWraps = document.querySelectorAll('.hero-wordmark .letter-wrap');
      letterWraps.forEach(w => w.classList.add('visible'));

      const tagline = document.getElementById('hero-tagline');
      if (tagline) tagline.classList.add('visible');

      const cta = document.getElementById('hero-cta');
      if (cta) cta.classList.add('visible');

      if (window.avartaCorridor && typeof window.avartaCorridor.finishEntranceAnimation === 'function') {
        window.avartaCorridor.finishEntranceAnimation();
      }

      initFXCanvas();
      activateLightBeam();
      setupPostIntroFX();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bypassIntro);
    } else {
      bypassIntro();
    }
    return;
  }

  // ── 2. "THE FORGOTTEN GALLERY AWAKENS" Cinematic Video Sequence ──
  function initForgottenGallery() {
    const intro        = document.getElementById('avarta-intro');
    const introVideo   = document.getElementById('intro-video');
    const skipBtn      = document.getElementById('intro-skip-btn');
    const heroWordmark = document.getElementById('hero-wordmark');
    const heroTagline  = document.getElementById('hero-tagline');
    const heroCta      = document.getElementById('hero-cta');

    if (!intro) return;

    // Lock scroll during entrance reveal
    document.body.classList.add('intro-active');

    initFXCanvas();

    let finished = false;
    let heroRevealed = false;

    // Finish / Skip Handler
    function finishIntro() {
      if (finished) return;
      finished = true;

      if (introVideo) {
        try { introVideo.pause(); } catch (e) {}
      }

      // Notify Global Audio Manager to start background soundtrack immediately after video ends
      if (window.AudioManager && typeof window.AudioManager.onIntroFinished === 'function') {
        window.AudioManager.onIntroFinished();
      } else if (window.avartaBgAudio && typeof window.avartaBgAudio.play === 'function') {
        window.avartaBgAudio.play();
      }

      // Fully reveal all hero elements
      const letterWraps = heroWordmark ? heroWordmark.querySelectorAll('.letter-wrap') : [];
      letterWraps.forEach(w => w.classList.add('visible'));

      if (heroTagline) heroTagline.classList.add('visible');
      if (heroCta) heroCta.classList.add('visible');
      document.body.classList.add('intro-navbar-visible');

      intro.classList.add('intro-done');

      setTimeout(() => {
        intro.style.display = 'none';
        document.body.classList.remove('intro-active');
        setupPostIntroFX();
      }, 900);
    }

    function triggerHeroReveal() {
      if (heroRevealed || finished) return;
      heroRevealed = true;

      intro.classList.add('intro-done');

      const letterWraps = heroWordmark ? heroWordmark.querySelectorAll('.letter-wrap') : [];
      letterWraps.forEach((wrap, idx) => {
        setTimeout(() => {
          if (!finished) wrap.classList.add('visible');
        }, idx * 110);
      });

      setTimeout(() => {
        if (heroTagline && !finished) heroTagline.classList.add('visible');
      }, 700);

      setTimeout(() => {
        if (heroCta && !finished) heroCta.classList.add('visible');
      }, 1200);

      setTimeout(() => {
        if (!finished) document.body.classList.add('intro-navbar-visible');
      }, 1600);

      setTimeout(() => {
        finishIntro();
      }, 2400);
    }

    intro.addEventListener('click', finishIntro, { once: true });
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        finishIntro();
      });
    }

    // Show skip button softly
    setTimeout(() => {
      if (skipBtn && !finished) skipBtn.classList.add('visible');
    }, 400);

    // Start video playback cleanly without colliding effects
    if (introVideo) {
      introVideo.currentTime = 0;
      introVideo.play().catch(() => {});

      introVideo.addEventListener('timeupdate', () => {
        if (finished) return;
        // As the video approaches the settled end frame (~8.2s)
        if (introVideo.currentTime >= 8.2) {
          triggerHeroReveal();
        }
      });

      introVideo.addEventListener('ended', () => {
        finishIntro();
      });
    }

    // Safety fallback timer if video fails or is delayed
    setTimeout(() => {
      if (!finished && !heroRevealed) {
        triggerHeroReveal();
      }
    }, 9500);
  }

  // ── 3. Post-Intro Interactions: Mouse Parallax, Hover Reactions, & Warp Enter ──
  function setupPostIntroFX() {
    const heroCta = document.getElementById('hero-cta');
    const heroContent = document.getElementById('hero-content');

    // Subtle Mouse Parallax on Hero Typography
    window.addEventListener('mousemove', (e) => {
      if (document.body.classList.contains('intro-active')) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      if (heroContent) {
        heroContent.style.transform = `translate(calc(-50% + ${nx * 8}px), calc(-50% + ${ny * 6}px))`;
      }
    }, { passive: true });

    // CTA Button Hover Reaction
    if (heroCta) {
      // ENTER THE GALLERY: Warp Acceleration into Museum
      heroCta.addEventListener('click', (e) => {
        e.preventDefault();
        const targetHref = heroCta.getAttribute('href') || 'categories.html';

        spawnWarpStreaks();
        const pageTransition = document.getElementById('page-transition');

        if (window.avartaCorridor && typeof window.avartaCorridor.enterWorldAnimation === 'function') {
          window.avartaCorridor.enterWorldAnimation(() => {
            if (pageTransition) pageTransition.classList.add('active');
            setTimeout(() => {
              window.location.href = targetHref;
            }, 300);
          });
        } else {
          if (pageTransition) pageTransition.classList.add('active');
          setTimeout(() => {
            window.location.href = targetHref;
          }, 450);
        }
      });
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForgottenGallery);
  } else {
    initForgottenGallery();
  }
})();

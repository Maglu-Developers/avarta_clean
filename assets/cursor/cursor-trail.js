/**
 * Golden Sparkle Trail for Quill Cursor
 * - Lightweight canvas overlay with pointer-events: none
 * - Spawns subtle golden sparkle particles that fade out in ~600ms
 * - Zero CPU/GPU idle overhead: stops requestAnimationFrame when idle
 * - Strictly respects (hover: hover) and prefers-reduced-motion
 */
(function() {
  // Check compatibility: only desktop fine pointer and no reduced motion
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!hoverQuery.matches || motionQuery.matches) {
    return;
  }

  let canvas, ctx;
  let dpr = window.devicePixelRatio || 1;
  let particles = [];
  let animId = null;
  let lastX = 0, lastY = 0;
  let lastSpawnTime = 0;
  const LIFESPAN = 600; // ms
  const MAX_PARTICLES = 32;

  const GOLD_COLORS = [
    { r: 255, g: 215, b: 0 },    // Bright gold
    { r: 255, g: 236, b: 153 },  // Pale luminous gold
    { r: 229, g: 179, b: 118 },  // Warm amber gold
    { r: 255, g: 250, b: 220 }   // Shimmer highlight
  ];

  function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'quill-sparkle-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d', { alpha: true });
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
  }

  function resizeCanvas() {
    if (!canvas) return;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  }

  function spawnParticle(x, y) {
    if (particles.length >= MAX_PARTICLES) {
      particles.shift();
    }
    const color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.2 + Math.random() * 0.8;
    const size = 1.8 + Math.random() * 2.2;
    const isStar = Math.random() > 0.4;

    particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + 0.15,
      size,
      color,
      isStar,
      birth: performance.now(),
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.08
    });

    if (!animId) {
      animId = requestAnimationFrame(render);
    }
  }

  function drawSparkleStar(cx, cy, spikes, outerRadius, innerRadius, color, alpha, rot) {
    ctx.save();
    ctx.translate(cx * dpr, cy * dpr);
    ctx.rotate(rot);
    ctx.beginPath();
    let step = Math.PI / spikes;
    for (let i = 0; i < spikes * 2; i++) {
      let r = (i % 2 === 0) ? outerRadius * dpr : innerRadius * dpr;
      let a = i * step;
      let px = Math.cos(a) * r;
      let py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha.toFixed(3)})`;
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${(alpha * 0.8).toFixed(3)})`;
    ctx.shadowBlur = 4 * dpr;
    ctx.fill();
    ctx.restore();
  }

  function render(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = now - p.birth;

      if (age >= LIFESPAN) {
        particles.splice(i, 1);
        continue;
      }

      const progress = age / LIFESPAN;
      // Smooth fade out
      const alpha = Math.max(0, 1 - Math.pow(progress, 1.2));
      const scale = Math.max(0.2, 1 - progress * 0.6);

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      if (p.isStar) {
        drawSparkleStar(p.x, p.y, 4, p.size * scale, p.size * scale * 0.35, p.color, alpha, p.rotation);
      } else {
        // Soft glowing circle dot
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, p.size * scale * 0.8 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha.toFixed(3)})`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(alpha * 0.6).toFixed(3)})`;
        ctx.shadowBlur = 3 * dpr;
        ctx.fill();
      }
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(render);
    } else {
      animId = null;
    }
  }

  function onPointerMove(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const distSq = dx * dx + dy * dy;

    // Throttle spawning: moved at least 5px and interval >= 32ms
    if (distSq > 25 && now - lastSpawnTime >= 32) {
      spawnParticle(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      lastSpawnTime = now;
    }
  }

  function start() {
    if (!canvas) initCanvas();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  function stop() {
    window.removeEventListener('pointermove', onPointerMove);
    particles = [];
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Handle dynamic reduced motion preference changes
  motionQuery.addEventListener('change', function(e) {
    if (e.matches) {
      stop();
    } else if (hoverQuery.matches) {
      start();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

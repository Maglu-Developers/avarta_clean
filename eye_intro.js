/**
 * EYE INTRO — Wildlife film visual, plays before AVĀRTĀ peephole intro
 *
 * Sequence:
 *  0.0s  — Black screen; film starts loading
 *  0.4s  — Film fades in (fullscreen, object-fit:cover)
 *  1.2s  — Sphere particle animation starts pulsing on canvas
 *  1.4s  — Skip button appears
 *  5.0s  — AVĀRTĀ wordmark fades in at bottom
 *  7.5s  — Iris-contract animation (circle shrinks to nothing)
 *  8.0s  — Eye-intro hidden; AVĀRTĀ peephole intro launches
 *
 * The film used is the same CloudFront wildlife MP4 from Ethan Vale.
 * If it fails to load, the sphere canvas is shown over a dark bg.
 */
(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────────────────────── */
  var CDN  = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
  var FILM = CDN + 'hf_20260922_195107_ed3f055a-3a13-4a71-b743-e10310454246.mp4';

  // Duration eye-visual plays before handing off (ms). Adjust to taste.
  var EYE_DURATION = 8000;

  /* ── DOM ─────────────────────────────────────────────────────────────────── */
  var eyeEl  = document.getElementById('eye-intro');
  var filmEl = document.getElementById('eye-film');
  var cvs    = document.getElementById('eye-canvas');
  var titleEl= document.getElementById('eye-title');
  var skipEl = document.getElementById('eye-skip');
  var irisEl = document.getElementById('eye-iris-mask');

  if (!eyeEl) return; // guard

  document.body.classList.add('eye-active');

  var done = false;

  /* ── Sphere particle system ──────────────────────────────────────────────── */
  var ctx = cvs.getContext('2d');
  var W, H, RAF_ID;
  var GA = Math.PI * (3 - Math.sqrt(5)); // golden angle

  var N = 180; // particle count
  var pts = [];

  function buildSphere() {
    pts = [];
    var r = Math.min(W, H) * 0.32;
    for (var i = 0; i < N; i++) {
      var y    = 1 - (i / (N - 1)) * 2;
      var rad  = Math.sqrt(Math.max(0, 1 - y * y));
      var th   = i * GA;
      pts.push({
        x3: Math.cos(th) * rad,
        y3: y,
        z3: Math.sin(th) * rad,
        r: r
      });
    }
  }

  function resize() {
    W = cvs.width  = window.innerWidth;
    H = cvs.height = window.innerHeight;
    buildSphere();
  }

  resize();
  window.addEventListener('resize', resize);

  var rotX = 0, rotY = 0, spinSpeed = 0.0007;
  var startTime = null;

  function drawFrame(ts) {
    if (done) return;
    RAF_ID = requestAnimationFrame(drawFrame);
    if (!startTime) startTime = ts;
    var elapsed = ts - startTime;

    rotY += spinSpeed;
    rotX = Math.sin(elapsed * 0.00025) * 0.22;

    ctx.clearRect(0, 0, W, H);

    var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    var cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    // sort back-to-front
    var projected = pts.map(function (p) {
      // rotate Y
      var rx = p.x3 * cosY + p.z3 * sinY;
      var ry = p.y3;
      var rz = -p.x3 * sinY + p.z3 * cosY;
      // rotate X
      var ry2 = ry * cosX - rz * sinX;
      var rz2 = ry * sinX + rz * cosX;

      var persp = 1400;
      var scale = persp / (persp + rz2 * p.r);
      var sx = W / 2 + rx * p.r * scale;
      var sy = H / 2 - ry2 * p.r * scale;
      return { sx: sx, sy: sy, z: rz2, scale: scale };
    });
    projected.sort(function (a, b) { return a.z - b.z; });

    projected.forEach(function (p) {
      var alpha = 0.18 + 0.52 * ((p.z + 1) / 2);
      var pulse = 1 + 0.15 * Math.sin(elapsed * 0.003 + p.z * 3);
      var dotR  = Math.max(0.6, 1.4 * p.scale * pulse);

      ctx.beginPath();
      ctx.arc(p.sx, p.sy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(223,194,130,' + alpha.toFixed(3) + ')';
      ctx.fill();
    });

    // Subtle connectors for nearby particles
    var link_dist = Math.min(W, H) * 0.055;
    for (var i = 0; i < projected.length - 1; i++) {
      for (var j = i + 1; j < projected.length; j++) {
        var dx = projected[i].sx - projected[j].sx;
        var dy = projected[i].sy - projected[j].sy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < link_dist) {
          var a = 0.07 * (1 - dist / link_dist);
          ctx.beginPath();
          ctx.moveTo(projected[i].sx, projected[i].sy);
          ctx.lineTo(projected[j].sx, projected[j].sy);
          ctx.strokeStyle = 'rgba(223,194,130,' + a.toFixed(3) + ')';
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Iris contract animation ─────────────────────────────────────────────── */
  function contractIris(onDone) {
    irisEl.classList.add('contracting');
    var duration = 900;
    var start    = performance.now();

    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      // easeInCubic
      var et = t * t * t;
      // shrink the "hole": starts at ~150% (whole viewport) → 0%
      var pct = (1 - et) * 150;
      irisEl.style.clipPath = 'circle(' + pct.toFixed(1) + '% at 50% 50%)';
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        irisEl.style.clipPath = 'circle(0% at 50% 50%)';
        onDone && onDone();
      }
    }
    requestAnimationFrame(frame);
  }

  /* ── Hand-off to AVĀRTĀ intro ─────────────────────────────────────────────── */
  function handOff() {
    if (done) return;
    done = true;
    cancelAnimationFrame(RAF_ID);

    // Title fades out
    if (titleEl) { titleEl.style.opacity = '0'; }

    contractIris(function () {
      // hide eye intro
      eyeEl.classList.add('done');
      document.body.classList.remove('eye-active');

      // Trigger AVĀRTĀ peephole intro (it already loaded but was waiting)
      setTimeout(function () {
        eyeEl.style.display = 'none';
        // Fire the custom event that intro.js listens for
        document.dispatchEvent(new CustomEvent('eye-intro-done'));
      }, 700);
    });
  }

  /* ── Timeline ─────────────────────────────────────────────────────────────── */

  // 400ms: Film fades in
  setTimeout(function () {
    if (filmEl) filmEl.classList.add('visible');
  }, 400);

  // 1200ms: Sphere canvas fades in
  setTimeout(function () {
    cvs.classList.add('visible');
    requestAnimationFrame(drawFrame);
  }, 1200);

  // 1400ms: Skip button
  setTimeout(function () {
    if (skipEl) skipEl.classList.add('visible');
  }, 1400);

  // 5000ms: Wordmark fades in
  setTimeout(function () {
    if (titleEl) titleEl.classList.add('visible');
  }, 5000);

  // EYE_DURATION: Hand off
  var mainTimer = setTimeout(handOff, EYE_DURATION);

  // Skip button
  if (skipEl) {
    skipEl.addEventListener('click', function (e) {
      e.stopPropagation();
      clearTimeout(mainTimer);
      handOff();
    });
  }

  /* ── Film setup ───────────────────────────────────────────────────────────── */
  if (filmEl) {
    filmEl.muted = false;
    filmEl.defaultMuted = false;
    filmEl.playsInline = true;
    filmEl.setAttribute('webkit-playsinline', '');
    filmEl.src = FILM;
    filmEl.preload = 'auto';

    filmEl.addEventListener('play', function () {
      filmEl.playbackRate = 1.6; // slightly faster for dramatic effect
    });

    filmEl.addEventListener('error', function () {
      // Film failed — sphere alone is fine
      filmEl.style.display = 'none';
    });

    filmEl.addEventListener('ended', function () {
      // Loop once then hand off, or just hand off on natural end
      if (!done) handOff();
    });

    var playP = filmEl.play();
    if (playP) {
      playP.catch(function () {
        // Autoplay blocked — add a tap-to-start fallback
        function unblock() {
          filmEl.play().catch(function () {});
          document.removeEventListener('pointerdown', unblock);
          document.removeEventListener('keydown', unblock);
        }
        document.addEventListener('pointerdown', unblock, { once: true });
        document.addEventListener('keydown', unblock, { once: true });
      });
    }
  }

})();

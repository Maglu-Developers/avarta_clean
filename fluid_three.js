/**
 * AVĀRTĀ ® — Pure Static Background with Interactive Fluid Ripple Engine (Three.js WebGL)
 *
 * Features:
 * - High-resolution static hallway background matching the reference design
 * - GPU Navier-Stokes fluid ripple interaction on mouse movement and clicks
 * - Instant static loading with zero entrance animation or camera dollies
 */

(function () {
  'use strict';

  const canvas = document.getElementById('water-canvas');
  if (!canvas) return;

  // WebGL Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Orthographic Scene Setup for Fullscreen Quad
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // Ping-Pong Velocity Render Targets for Fluid Simulation
  const SIM_SIZE = 256;
  const isWebGL2 = renderer.capabilities.isWebGL2;
  const targetType = isWebGL2 ? THREE.HalfFloatType : THREE.FloatType;

  const targetOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: targetType,
    depthBuffer: false,
    stencilBuffer: false
  };

  let targetA = new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, targetOptions);
  let targetB = new THREE.WebGLRenderTarget(SIM_SIZE, SIM_SIZE, targetOptions);

  renderer.setClearColor(0x000000, 0.0);
  renderer.setRenderTarget(targetA);
  renderer.clear();
  renderer.setRenderTarget(targetB);
  renderer.clear();
  renderer.setRenderTarget(null);

  // Background Corridor Texture
  const textureLoader = new THREE.TextureLoader();
  let bgTexture = textureLoader.load('assets/intro_hallway.jpg', function (tex) {
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    updateAspectScale();
  });

  // Shader 1: Fluid Velocity Simulation (Advection + Vorticity + Mouse Splat)
  const velShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform vec2 uMouse;
      uniform vec2 uMouseVel;
      uniform float uAspect;
      uniform float uDissipation;

      void main() {
        vec2 texel = vec2(1.0 / 256.0);
        vec2 vel = texture2D(uVelocity, vUv).xy;

        // Fluid Self-Advection
        vec2 backUv = vUv - vel * texel * 2.2;
        vec2 advectedVel = texture2D(uVelocity, backUv).xy;

        // Vorticity / Swirl Force
        float L = texture2D(uVelocity, vUv - vec2(texel.x, 0.0)).y;
        float R = texture2D(uVelocity, vUv + vec2(texel.x, 0.0)).y;
        float B = texture2D(uVelocity, vUv - vec2(0.0, texel.y)).x;
        float T = texture2D(uVelocity, vUv + vec2(0.0, texel.y)).x;

        float curl = (R - L) - (T - B);
        vec2 swirlForce = vec2(abs(T) - abs(B), abs(L) - abs(R)) * curl * 0.26;
        vec2 newVel = (advectedVel + swirlForce) * uDissipation;

        // Mouse Velocity Splat
        vec2 p = vUv - uMouse;
        p.x *= uAspect;
        float dist = length(p);
        float radius = 0.14;

        if (dist < radius) {
          float force = smoothstep(0.0, 1.0, 1.0 - dist / radius);
          newVel += uMouseVel * force * 1.5;
        }

        gl_FragColor = vec4(newVel, 0.0, 1.0);
      }
    `,
    uniforms: {
      uVelocity: { value: targetA.texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVel: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: window.innerWidth / window.innerHeight },
      uDissipation: { value: 0.965 }
    }
  });

  // Shader 2: Static Background with Fluid Displacement Ripples
  const dispShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uTexture;
      uniform vec2 uUvScale;

      void main() {
        vec2 vel = texture2D(uVelocity, vUv).xy;

        // Aspect Ratio Fit (Object-Fit: Cover)
        vec2 coverUv = (vUv - 0.5) * uUvScale + 0.5;

        // Fluid displacement ripple on static background
        vec2 displacedUv = coverUv - vel * 0.08;
        displacedUv = clamp(displacedUv, vec2(0.001), vec2(0.999));

        // Sample static hallway texture
        vec4 color = texture2D(uTexture, displacedUv);

        // Subtle liquid shimmer on ripples
        float rippleStrength = length(vel);
        color.rgb += vec3(0.16, 0.12, 0.07) * rippleStrength * 0.5;

        gl_FragColor = color;
      }
    `,
    uniforms: {
      uVelocity: { value: targetA.texture },
      uTexture: { value: bgTexture },
      uUvScale: { value: new THREE.Vector2(1, 1) }
    }
  });

  // Fullscreen Mesh Quad
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const quadMesh = new THREE.Mesh(quadGeometry, dispShaderMaterial);
  scene.add(quadMesh);

  // Aspect Ratio Scale Calculation (Object-Fit: Cover)
  function updateAspectScale() {
    const screenAspect = window.innerWidth / window.innerHeight;
    const imgAspect = (bgTexture && bgTexture.image && bgTexture.image.width) 
      ? (bgTexture.image.width / bgTexture.image.height) 
      : (16 / 9);

    let scaleX = 1.0;
    let scaleY = 1.0;

    if (screenAspect > imgAspect) {
      scaleY = (imgAspect / screenAspect);
    } else {
      scaleX = (screenAspect / imgAspect);
    }

    dispShaderMaterial.uniforms.uUvScale.value.set(scaleX, scaleY);
    velShaderMaterial.uniforms.uAspect.value = screenAspect;
  }

  updateAspectScale();

  // Pointer Tracking for Interactive Fluid Ripples
  let mouseX = 0.5;
  let mouseY = 0.5;
  let prevMouseX = 0.5;
  let prevMouseY = 0.5;
  let mouseVelX = 0.0;
  let mouseVelY = 0.0;
  let isPointerMoving = false;

  function onPointerMove(clientX, clientY) {
    const nx = clientX / window.innerWidth;
    const ny = 1.0 - (clientY / window.innerHeight);

    if (!isPointerMoving) {
      prevMouseX = nx;
      prevMouseY = ny;
      isPointerMoving = true;
    }

    mouseX = nx;
    mouseY = ny;
  }

  window.addEventListener('mousemove', function (e) {
    onPointerMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('click', function (e) {
    onPointerMove(e.clientX, e.clientY);
    // Add extra pulse on click
    mouseVelX += (Math.random() - 0.5) * 0.06;
    mouseVelY += (Math.random() - 0.5) * 0.06;
  });

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateAspectScale();
  });

  let isPaused = false;

  // Animation Loop: Pure Fluid Ripple Processing
  function animate() {
    if (isPaused) return;

    if (isPointerMoving) {
      mouseVelX = (mouseX - prevMouseX);
      mouseVelY = (mouseY - prevMouseY);
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    } else {
      mouseVelX = 0.0;
      mouseVelY = 0.0;
    }

    // 1. Fluid Velocity Pass
    quadMesh.material = velShaderMaterial;
    velShaderMaterial.uniforms.uVelocity.value = targetA.texture;
    velShaderMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
    velShaderMaterial.uniforms.uMouseVel.value.set(mouseVelX, mouseVelY);

    renderer.setRenderTarget(targetB);
    renderer.render(scene, camera);

    let temp = targetA;
    targetA = targetB;
    targetB = temp;

    // 2. Static Background Ripple Display Pass
    quadMesh.material = dispShaderMaterial;
    dispShaderMaterial.uniforms.uVelocity.value = targetA.texture;

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  // Public API
  window.avartaFluid = {
    pause: function () {
      isPaused = true;
    },
    resume: function () {
      if (isPaused) {
        isPaused = false;
        animate();
      }
    }
  };

  animate();
})();

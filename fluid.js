/**
 * Navier-Stokes Style WebGL Fluid Distortion Engine
 * Real-time velocity advection & vorticity curl simulation that warps background image texture UVs.
 * Distortion scales with cursor velocity and decays smoothly over ~0.8s.
 */

(function () {
  const canvas = document.getElementById('water-canvas');
  let gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    console.warn('WebGL not available');
    document.body.style.backgroundImage = 'url("assets/intro_hallway.jpg")';
    document.body.style.backgroundSize = 'cover';
    return;
  }

  // Check float texture extensions
  const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  let floatExt = isWebGL2 ? gl.getExtension('EXT_color_buffer_float') : (gl.getExtension('OES_texture_float') || gl.getExtension('OES_texture_half_float'));
  gl.getExtension('OES_texture_float_linear');
  gl.getExtension('OES_texture_half_float_linear');

  // Simulation Grid Resolution
  const SIM_RES = 256;

  // Vertex Shader
  const vsSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_texCoord;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // 1. Velocity Advection, Force Injection & Vorticity Curl Shader
  const velocityFsSource = `
    precision highp float;
    uniform sampler2D u_velocity;
    uniform vec2 u_resolution;
    uniform vec4 u_splat; // x, y, dx, dy (normalized coords & velocity vector)
    uniform float u_dt;
    varying vec2 v_texCoord;

    void main() {
      vec2 texel = vec2(1.0 / u_resolution.x, 1.0 / u_resolution.y);

      // Self-advection (sample velocity back along velocity vector)
      vec2 currentVel = texture2D(u_velocity, v_texCoord).xy;
      vec2 backCoord = v_texCoord - currentVel * texel * u_dt * 1.8;
      vec2 advectedVel = texture2D(u_velocity, backCoord).xy;

      // Vorticity / Curl-noise calculation (calculates local rotational swirl)
      float L = texture2D(u_velocity, v_texCoord - vec2(texel.x, 0.0)).y;
      float R = texture2D(u_velocity, v_texCoord + vec2(texel.x, 0.0)).y;
      float B = texture2D(u_velocity, v_texCoord - vec2(0.0, texel.y)).x;
      float T = texture2D(u_velocity, v_texCoord + vec2(0.0, texel.y)).x;

      float curl = (R - L) - (T - B);
      vec2 curlForce = vec2(abs(T) - abs(B), abs(L) - abs(R)) * curl * 0.12;

      // Apply dissipation / decay (smooth relaxation back to 0 over ~0.8s)
      vec2 newVel = (advectedVel + curlForce) * 0.955;

      // Mouse velocity splat injection
      if (u_splat.z != 0.0 || u_splat.w != 0.0) {
        float dist = distance(v_texCoord, u_splat.xy);
        float radius = 0.065;
        if (dist < radius) {
          float impulse = (1.0 - dist / radius);
          // Smooth Gaussian force curve
          impulse = smoothstep(0.0, 1.0, impulse);
          newVel += u_splat.zw * impulse * 0.35;
        }
      }

      gl_FragColor = vec4(newVel, 0.0, 1.0);
    }
  `;

  // 2. Display Shader (Warps Starry Night texture using simulated fluid velocity field)
  const renderFsSource = `
    precision highp float;
    uniform sampler2D u_velocity;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_uvScale;
    varying vec2 v_texCoord;

    void main() {
      // Sample fluid velocity at current UV
      vec2 vel = texture2D(u_velocity, v_texCoord).xy;

      // Aspect-ratio cover mapping for full-bleed background
      vec2 coverUV = (v_texCoord - 0.5) * u_uvScale + 0.5;

      // Warp background image UV coords proportional to velocity vector
      // Creates whirlpool/swirl smearing effect trailing cursor velocity direction
      vec2 displacedUV = coverUV - vel * 0.04;

      // Clamp UV to prevent border artifacts
      displacedUV = clamp(displacedUV, vec2(0.001), vec2(0.999));

      // Sample Starry Night background using existing image colors only
      vec4 col = texture2D(u_image, displacedUV);

      gl_FragColor = col;
    }
  `;

  function createShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function createProgram(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const velFs = createShader(gl, gl.FRAGMENT_SHADER, velocityFsSource);
  const renderFs = createShader(gl, gl.FRAGMENT_SHADER, renderFsSource);

  const velProgram = createProgram(gl, vs, velFs);
  const renderProgram = createProgram(gl, vs, renderFs);

  // Screen Quad Buffer
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,  0, 1,
     1, -1,  1, 1,
    -1,  1,  0, 0,
    -1,  1,  0, 0,
     1, -1,  1, 1,
     1,  1,  1, 0
  ]), gl.STATIC_DRAW);

  // Ping-Pong Framebuffers & Textures for Velocity Field Simulation
  const velTextures = [];
  const velFramebuffers = [];

  const texType = (floatExt && isWebGL2) ? gl.FLOAT : gl.UNSIGNED_BYTE;

  for (let i = 0; i < 2; i++) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM_RES, SIM_RES, 0, gl.RGBA, texType, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    velTextures.push(tex);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    velFramebuffers.push(fbo);
  }

  let readIdx = 0;
  let writeIdx = 1;

  // Starry Night Image Texture
  const bgTexture = gl.createTexture();
  const bgImage = new Image();
  let imgWidth = 1000;
  let imgHeight = 800;

  bgImage.src = 'assets/intro_hallway.jpg';
  bgImage.onload = function () {
    imgWidth = bgImage.width;
    imgHeight = bgImage.height;

    gl.bindTexture(gl.TEXTURE_2D, bgTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bgImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  // Mouse Position & Velocity Tracking
  let mouseX = 0;
  let mouseY = 0;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;
  let isMoving = false;

  function updatePointer(px, py) {
    if (!isMoving) {
      prevMouseX = px;
      prevMouseY = py;
      isMoving = true;
      return;
    }
    mouseX = px;
    mouseY = py;

    // Calculate frame velocity delta
    mouseVelX = (mouseX - prevMouseX) / window.innerWidth;
    mouseVelY = (mouseY - prevMouseY) / window.innerHeight;

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }

  window.addEventListener('mousemove', function (e) {
    updatePointer(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let lastTime = performance.now();

  // Animation & Shader Execution Loop
  function render() {
    const now = performance.now();
    const dt = Math.min(0.033, (now - lastTime) / 1000.0);
    lastTime = now;

    // 1. Fluid Velocity Simulation Pass
    gl.viewport(0, 0, SIM_RES, SIM_RES);
    gl.bindFramebuffer(gl.FRAMEBUFFER, velFramebuffers[writeIdx]);

    gl.useProgram(velProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, velTextures[readIdx]);
    gl.uniform1i(gl.getUniformLocation(velProgram, 'u_velocity'), 0);

    gl.uniform2f(gl.getUniformLocation(velProgram, 'u_resolution'), SIM_RES, SIM_RES);
    gl.uniform1f(gl.getUniformLocation(velProgram, 'u_dt'), dt);

    // Normalized splat coords & velocity force
    const normX = mouseX / window.innerWidth;
    const normY = mouseY / window.innerHeight;

    gl.uniform4f(
      gl.getUniformLocation(velProgram, 'u_splat'),
      normX, normY, mouseVelX * 2.5, mouseVelY * 2.5
    );

    // Reset mouse velocity decay per frame
    mouseVelX *= 0.7;
    mouseVelY *= 0.7;

    const velPosAttr = gl.getAttribLocation(velProgram, 'a_position');
    const velTexAttr = gl.getAttribLocation(velProgram, 'a_texCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(velPosAttr);
    gl.vertexAttribPointer(velPosAttr, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(velTexAttr);
    gl.vertexAttribPointer(velTexAttr, 2, gl.FLOAT, false, 16, 8);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap velocity ping-pong FBOs
    readIdx = writeIdx;
    writeIdx = 1 - writeIdx;

    // 2. Render Displaced Image Pass to Screen Canvas
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.useProgram(renderProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, velTextures[readIdx]);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'u_velocity'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bgTexture);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'u_image'), 1);

    gl.uniform2f(gl.getUniformLocation(renderProgram, 'u_resolution'), canvas.width, canvas.height);

    // Calculate Aspect Cover Ratio matrix
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = imgWidth / imgHeight;
    let scaleX = 1.0;
    let scaleY = 1.0;

    if (canvasAspect > imgAspect) {
      scaleY = imgAspect / canvasAspect;
    } else {
      scaleX = canvasAspect / imgAspect;
    }

    gl.uniform2f(gl.getUniformLocation(renderProgram, 'u_uvScale'), scaleX, scaleY);

    const renPosAttr = gl.getAttribLocation(renderProgram, 'a_position');
    const renTexAttr = gl.getAttribLocation(renderProgram, 'a_texCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(renPosAttr);
    gl.vertexAttribPointer(renPosAttr, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(renTexAttr);
    gl.vertexAttribPointer(renTexAttr, 2, gl.FLOAT, false, 16, 8);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

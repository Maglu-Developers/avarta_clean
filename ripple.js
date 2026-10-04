/**
 * Ultra-Smooth WebGL Water Ripple Engine
 * Uses precision ping-pong heightmap buffers with GL_NEAREST sampling for crisp wave physics,
 * combined with GL_LINEAR refraction shader for Starry Night background distortion.
 */

(function () {
  const canvas = document.getElementById('water-canvas');
  let gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    console.warn('WebGL not supported');
    document.body.style.backgroundImage = 'url("assets/intro_hallway.jpg")';
    document.body.style.backgroundSize = 'cover';
    return;
  }

  // Float Texture Extension Check
  const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  let floatExt = isWebGL2 ? gl.getExtension('EXT_color_buffer_float') : gl.getExtension('OES_texture_float');

  // Heightmap simulation grid resolution
  const SIM_SIZE = 512;

  // Quad Vertex Shader
  const vsSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_texCoord;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Simulation Shader: Wave equation propagation
  const simFsSource = `
    precision highp float;
    uniform sampler2D u_current;
    uniform sampler2D u_previous;
    uniform vec2 u_resolution;
    uniform vec4 u_drop; // x, y, radius, strength
    varying vec2 v_texCoord;

    void main() {
      vec2 dx = vec2(1.0 / u_resolution.x, 0.0);
      vec2 dy = vec2(0.0, 1.0 / u_resolution.y);

      // Read neighboring height values
      float l = texture2D(u_current, v_texCoord - dx).r;
      float r = texture2D(u_current, v_texCoord + dx).r;
      float t = texture2D(u_current, v_texCoord + dy).r;
      float b = texture2D(u_current, v_texCoord - dy).r;

      float p = texture2D(u_previous, v_texCoord).r;

      // 2D Wave propagation equation
      float wave = (l + r + t + b) * 0.5 - p;
      wave *= 0.982; // Wave energy damping

      // Add ripple drop perturbation from cursor
      if (u_drop.z > 0.0) {
        float dist = distance(v_texCoord, u_drop.xy);
        if (dist < u_drop.z) {
          float factor = (1.0 - dist / u_drop.z);
          wave += (cos(factor * 3.14159265) + 1.0) * 0.5 * u_drop.w;
        }
      }

      gl_FragColor = vec4(wave, wave, wave, 1.0);
    }
  `;

  // Render Shader: Refraction distortion on Starry Night artwork
  const renderFsSource = `
    precision highp float;
    uniform sampler2D u_heightmap;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform vec2 u_uvScale;
    varying vec2 v_texCoord;

    void main() {
      vec2 dx = vec2(1.0 / u_resolution.x, 0.0);
      vec2 dy = vec2(0.0, 1.0 / u_resolution.y);

      // Compute height gradients (normal vector)
      float l = texture2D(u_heightmap, v_texCoord - dx).r;
      float r = texture2D(u_heightmap, v_texCoord + dx).r;
      float t = texture2D(u_heightmap, v_texCoord + dy).r;
      float b = texture2D(u_heightmap, v_texCoord - dy).r;

      vec2 normal = vec2(r - l, b - t);

      // Calculate cover UV coordinates for background image
      vec2 coverUV = (v_texCoord - 0.5) * u_uvScale + 0.5;

      // Displace texture UV by wave normal
      vec2 displacedUV = coverUV + normal * 0.015;

      // Sample background texture
      vec4 imgColor = texture2D(u_image, displacedUV);

      // Highlight wave crests with subtle light reflection
      float light = max(0.0, normal.x * 0.7 + normal.y * 0.7);
      vec3 highlight = vec3(0.4, 0.65, 0.95) * light * 0.12;

      // Increase brightness of background image
      vec3 brightened = imgColor.rgb * 1.45 + highlight;
      gl_FragColor = vec4(brightened, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function createProgram(gl, vs, fs) {
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const simFs = createShader(gl, gl.FRAGMENT_SHADER, simFsSource);
  const renderFs = createShader(gl, gl.FRAGMENT_SHADER, renderFsSource);

  const simProgram = createProgram(gl, vs, simFs);
  const renderProgram = createProgram(gl, vs, renderFs);

  // Quad Geometry
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

  // Heightmap textures setup with GL_NEAREST for exact wave propagation
  let textures = [];
  let framebuffers = [];

  const useFloat = !!floatExt;
  const texType = useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;

  for (let i = 0; i < 2; i++) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM_SIZE, SIM_SIZE, 0, gl.RGBA, texType, null);
    // CRITICAL: MUST BE GL_NEAREST FOR PING-PONG HEIGHTMAP SIMULATION
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    textures.push(tex);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    framebuffers.push(fbo);
  }

  let readIdx = 0;
  let writeIdx = 1;

  // Background Starry Night Texture
  const bgTexture = gl.createTexture();
  const bgImage = new Image();
  let imgLoaded = false;
  let imgW = 1000;
  let imgH = 800;

  bgImage.src = 'assets/intro_hallway.jpg';
  bgImage.onload = function () {
    imgLoaded = true;
    imgW = bgImage.width;
    imgH = bgImage.height;

    gl.bindTexture(gl.TEXTURE_2D, bgTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bgImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  // Drop impulses queue
  const drops = [];

  function addDrop(x, y, radius = 0.035, strength = 0.8) {
    drops.push({
      x: x / window.innerWidth,
      y: y / window.innerHeight,
      radius: radius,
      strength: strength
    });
  }

  // Pointer movement tracking with path interpolation
  let prevX = null;
  let prevY = null;

  function onPointerMove(px, py) {
    if (prevX === null || prevY === null) {
      prevX = px;
      prevY = py;
      addDrop(px, py, 0.025, 0.25);
      return;
    }

    const dx = px - prevX;
    const dy = py - prevY;
    const dist = Math.hypot(dx, dy);

    if (dist > 1.5) {
      const numPoints = Math.min(12, Math.max(1, Math.floor(dist / 6)));
      for (let i = 1; i <= numPoints; i++) {
        const ix = prevX + (dx * i) / numPoints;
        const iy = prevY + (dy * i) / numPoints;
        const str = Math.min(0.3, 0.1 + (dist / 80) * 0.15);
        addDrop(ix, iy, 0.02, str);
      }
    }

    prevX = px;
    prevY = py;
  }

  window.addEventListener('mousemove', function (e) {
    onPointerMove(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  // Ambient gentle wave generator
  let lastMove = Date.now();
  window.addEventListener('pointermove', function () { lastMove = Date.now(); });
  setInterval(function () {
    if (Date.now() - lastMove > 2000) {
      addDrop(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 0.02, 0.12);
    }
  }, 1500);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Main Render Loop
  function render() {
    // 1. Simulation Pass
    gl.viewport(0, 0, SIM_SIZE, SIM_SIZE);
    gl.useProgram(simProgram);

    // Process up to 5 drops per frame
    const currentDrops = drops.splice(0, Math.min(5, drops.length));

    if (currentDrops.length === 0) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[writeIdx]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[readIdx]);
      gl.uniform1i(gl.getUniformLocation(simProgram, 'u_current'), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[1 - readIdx]);
      gl.uniform1i(gl.getUniformLocation(simProgram, 'u_previous'), 1);

      gl.uniform2f(gl.getUniformLocation(simProgram, 'u_resolution'), SIM_SIZE, SIM_SIZE);
      gl.uniform4f(gl.getUniformLocation(simProgram, 'u_drop'), 0, 0, 0, 0);

      const simPos = gl.getAttribLocation(simProgram, 'a_position');
      const simTex = gl.getAttribLocation(simProgram, 'a_texCoord');
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(simPos);
      gl.vertexAttribPointer(simPos, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(simTex);
      gl.vertexAttribPointer(simTex, 2, gl.FLOAT, false, 16, 8);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      readIdx = writeIdx;
      writeIdx = 1 - writeIdx;
    } else {
      for (let drop of currentDrops) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[writeIdx]);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[readIdx]);
        gl.uniform1i(gl.getUniformLocation(simProgram, 'u_current'), 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[1 - readIdx]);
        gl.uniform1i(gl.getUniformLocation(simProgram, 'u_previous'), 1);

        gl.uniform2f(gl.getUniformLocation(simProgram, 'u_resolution'), SIM_SIZE, SIM_SIZE);
        gl.uniform4f(gl.getUniformLocation(simProgram, 'u_drop'), drop.x, drop.y, drop.radius, drop.strength);

        const simPos = gl.getAttribLocation(simProgram, 'a_position');
        const simTex = gl.getAttribLocation(simProgram, 'a_texCoord');
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.enableVertexAttribArray(simPos);
        gl.vertexAttribPointer(simPos, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(simTex);
        gl.vertexAttribPointer(simTex, 2, gl.FLOAT, false, 16, 8);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        readIdx = writeIdx;
        writeIdx = 1 - writeIdx;
      }
    }

    // 2. Render Pass
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.useProgram(renderProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[readIdx]);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'u_heightmap'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bgTexture);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'u_image'), 1);

    gl.uniform2f(gl.getUniformLocation(renderProgram, 'u_resolution'), canvas.width, canvas.height);

    // Aspect Ratio Cover Calculation
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = imgW / imgH;
    let scaleX = 1.0;
    let scaleY = 1.0;

    if (canvasAspect > imgAspect) {
      scaleY = imgAspect / canvasAspect;
    } else {
      scaleX = canvasAspect / imgAspect;
    }

    gl.uniform2f(gl.getUniformLocation(renderProgram, 'u_uvScale'), scaleX, scaleY);

    const renPos = gl.getAttribLocation(renderProgram, 'a_position');
    const renTex = gl.getAttribLocation(renderProgram, 'a_texCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(renPos);
    gl.vertexAttribPointer(renPos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(renTex);
    gl.vertexAttribPointer(renTex, 2, gl.FLOAT, false, 16, 8);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

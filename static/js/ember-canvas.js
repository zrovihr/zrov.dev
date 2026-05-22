(function () {
  'use strict';

  const canvas = document.getElementById('emberCanvas');
  if (!canvas) return;

  // ── Shaders (domain-warped FBM, phosphor palette) ──────────
  const VERT = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`;

  const FRAG = `precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_particles[20];
uniform int u_particleCount;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
         mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
v += a * vnoise(p);
p *= 2.05;
a *= 0.5;
  }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = vec2(uv.x * (u_res.x / u_res.y), uv.y) * 2.8;
  float t = u_time * 0.35;

  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.4)),
            fbm(p + vec2(5.2, 1.3) - vec2(t * 0.3, 0.0)));
  float n = fbm(p + 2.0 * q + vec2(t * 0.2, -t * 0.15));

  float v = smoothstep(0.40, 0.78, n);

  // Phosphor-green palette
  vec3 dark  = vec3(0.0, 0.02, 0.0);
  vec3 mid   = vec3(0.02, 0.18, 0.04);
  vec3 hot   = vec3(0.18, 1.00, 0.31);
  vec3 core  = vec3(0.55, 1.00, 0.65);

  vec3 col = mix(dark, mid, v);
  col = mix(col, hot,  smoothstep(0.55, 0.85, n));
  col = mix(col, core, smoothstep(0.78, 0.94, n) * 0.7);

  // Particle hot spots
  float glow = 0.0;
  for (int i = 0; i < 20; i++) {
if (i >= u_particleCount) break;
vec3 pt = u_particles[i];
if (pt.z <= 0.0) continue;
float dx = uv.x - pt.x;
float dy = (uv.y - pt.y) * (u_res.y / u_res.x);
float dist = sqrt(dx*dx + dy*dy);
float g = pt.z * exp(-dist * dist * 110.0);
glow += g;
  }
  col += glow * vec3(0.22, 1.00, 0.38);

  // Edge vignette
  float edge = smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x)
         * smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);

  gl_FragColor = vec4(col * edge, edge * 0.4);
}`;

  // ── WebGL init ────────────────────────────────────────────
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true, alpha: true });
  if (!gl) return;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[ember] compile:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[ember] link:', gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uParticles = gl.getUniformLocation(prog, 'u_particles');
  const uCount = gl.getUniformLocation(prog, 'u_particleCount');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // ── Particle state ────────────────────────────────────────
  const MAX = 20;
  const particles = [];
  for (let i = 0; i < MAX; i++) {
    particles.push({ x: 0, y: 0, r: 0, vx: 0, vy: 0, life: 0, maxLife: 0 });
  }

  function spawnParticle() {
    // Find a dead slot
    for (let i = 0; i < MAX; i++) {
      if (particles[i].life <= 0) {
        const p = particles[i];
        p.x = Math.random();
        p.y = 0.6 + Math.random() * 0.4; // spawn lower half
        p.r = 0; // will grow
        p.vx = (Math.random() - 0.5) * 0.04;
        p.vy = -(0.008 + Math.random() * 0.025); // drift upward
        p.life = 0;
        p.maxLife = 4.0 + Math.random() * 7.0;
        return;
      }
    }
  }

  // Bootstrap initial particles
  for (let i = 0; i < 8; i++) {
    const p = particles[i];
    p.x = Math.random();
    p.y = Math.random();
    p.r = 0.3 + Math.random() * 0.5;
    p.vx = (Math.random() - 0.5) * 0.02;
    p.vy = -(0.005 + Math.random() * 0.015);
    p.life = Math.random() * p.maxLife;
    p.maxLife = 4.0 + Math.random() * 8.0;
  }

  // ── Resize ────────────────────────────────────────────────
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.max(2, Math.floor(w * dpr));
    canvas.height = Math.max(2, Math.floor(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Main loop ─────────────────────────────────────────────
  let t0 = performance.now();
  let spawnTimer = 0;

  function frame(now) {
    const dt = Math.min((now - t0) / 1000, 0.1);
    t0 = now;

    // Spawn new particles
    spawnTimer += dt;
    const spawnInterval = 0.35;
    while (spawnTimer >= spawnInterval) {
      spawnTimer -= spawnInterval;
      spawnParticle();
    }

    // Update particles
    let aliveCount = 0;
    const raw = new Float32Array(MAX * 3);
    for (let i = 0; i < MAX; i++) {
      const p = particles[i];
      if (p.life > 0 || (p.life <= 0 && p.r > 0.01)) {
        p.life += dt;
        if (p.life > p.maxLife) {
          p.r *= 0.92; // fade out
          p.vy += 0.0003; // slow down
        } else {
          // Ramp up radius
          const targetR = 0.35 + Math.random() * 0.02;
          p.r += (targetR - p.r) * 2.0 * dt;
          // Flicker
          p.r += (Math.random() - 0.5) * 0.08 * dt;
          p.r = Math.max(0.05, Math.min(0.7, p.r));
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Kill if out of bounds or faded
        if (p.y < -0.15 || p.y > 1.15 || p.x < -0.15 || p.x > 1.15 || p.r < 0.02) {
          p.r = 0;
          p.life = 0;
        }

        if (p.r > 0.01) {
          raw[aliveCount * 3] = p.x;
          raw[aliveCount * 3 + 1] = p.y;
          raw[aliveCount * 3 + 2] = p.r;
          aliveCount++;
        }
      }
    }

    // Render
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, now / 1000);
    gl.uniform3fv(uParticles, raw);
    gl.uniform1i(uCount, aliveCount);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
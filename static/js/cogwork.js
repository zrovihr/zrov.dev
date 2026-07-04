// COGWORK BACKGROUND v2 — machinery drivetrain behind the page.
// Two clusters of meshing 3D wireframe gears + slider-crank piston + HUD
// tick-rings, all vector lines with depth fade. Canvas 2D, zero deps.
// Scrolling the page TURNS the drivetrain (rotation, not translation — v1
// translated with scroll and drifted offscreen). Anchors are viewport
// fractions, so the machinery is always in view at any window size.
// per Zan: background piece — low alpha, pointer-events none, occluded by
// panels (canvas z1 < main z2).
(function () {
  'use strict';

  var canvas = document.getElementById('cogworkCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- gear geometry: flat segment list [x1,y1,z1,x2,y2,z2,...] unit radius ----
  function buildGear(teeth, hubR, spokes) {
    var segs = [];
    var p = Math.PI * 2 / teeth;
    var F = [0.00, 0.30, 0.38, 0.62, 0.70];
    var R = [0.86, 0.86, 1.00, 1.00, 0.86];
    var H = 0.10; // half depth
    var pts = [], i, j, a;
    for (i = 0; i < teeth; i++) {
      for (j = 0; j < 5; j++) {
        a = (i + F[j]) * p;
        pts.push([Math.cos(a) * R[j], Math.sin(a) * R[j]]);
      }
    }
    var n = pts.length;
    function seg(x1, y1, z1, x2, y2, z2) { segs.push(x1, y1, z1, x2, y2, z2); }
    for (i = 0; i < n; i++) {
      var A = pts[i], B = pts[(i + 1) % n];
      seg(A[0], A[1], H, B[0], B[1], H);
      seg(A[0], A[1], -H, B[0], B[1], -H);
      if (i % 5 !== 0) seg(A[0], A[1], H, A[0], A[1], -H); // tooth risers only
    }
    for (i = 0; i < 36; i++) {
      var a1 = i / 36 * Math.PI * 2, a2 = (i + 1) / 36 * Math.PI * 2;
      var c1 = Math.cos(a1) * hubR, s1 = Math.sin(a1) * hubR;
      var c2 = Math.cos(a2) * hubR, s2 = Math.sin(a2) * hubR;
      seg(c1, s1, H, c2, s2, H);
      seg(c1, s1, -H, c2, s2, -H);
      if (i % 6 === 0) seg(c1, s1, H, c1, s1, -H);
    }
    for (i = 0; i < spokes; i++) {
      a = i / spokes * Math.PI * 2;
      var ca = Math.cos(a), sa = Math.sin(a);
      seg(ca * hubR, sa * hubR, H, ca * 0.86, sa * 0.86, H);
      seg(ca * hubR, sa * hubR, -H, ca * 0.86, sa * 0.86, -H);
    }
    return new Float32Array(segs);
  }

  // HUD ring: circle + radial ticks (every 5th long), flat at z=0
  function buildRing(radius, ticks) {
    var segs = [], i;
    for (i = 0; i < 90; i++) {
      var a1 = i / 90 * Math.PI * 2, a2 = (i + 1) / 90 * Math.PI * 2;
      segs.push(Math.cos(a1) * radius, Math.sin(a1) * radius, 0,
        Math.cos(a2) * radius, Math.sin(a2) * radius, 0);
    }
    for (i = 0; i < ticks; i++) {
      var a = i / ticks * Math.PI * 2;
      var len = (i % 5 === 0) ? 0.07 : 0.03;
      segs.push(Math.cos(a) * radius, Math.sin(a) * radius, 0,
        Math.cos(a) * (radius + len), Math.sin(a) * (radius + len), 0);
    }
    return new Float32Array(segs);
  }

  var PITCH = 0.93; // mean gear radius; meshing distance = sum of pitches

  // ---- the machine ----
  // cluster: anchor (viewport fractions), size (of min(W,H)), tilt, parallax
  // depth (near moves more with the mouse), spin = idle rad/s + scroll rad/px.
  // children mesh the root: placed at `angle`, ratio/phase derived.
  var CLUSTERS = [
    { // upper-right gear train, pulled toward center-left and up per Zan
      fx: 0.66, fy: 0.30, size: 0.26, tiltX: 0.48, tiltY: -0.26,
      parallax: 0.8, idle: -0.13, scrollK: -0.0016, pulseAt: 0,
      root: { teeth: 14, hub: 0.30, spokes: 6 },
      children: [
        { angle: -1.65, teeth: 8, hub: 0.34, spokes: 4 },
        { angle: 2.55, teeth: 6, hub: 0.38, spokes: 3 }
      ],
      rings: [
        { r: 1.30, ticks: 72, spin: 0.05 },
        { r: 1.44, ticks: 0, spin: -0.03, blip: true }
      ]
    },
    { // lower-left flywheel, raised off the bottom edge per Zan.
      // NOTE: it used to drive a slider-crank piston; removed — the rod +
      // block read as a buggy stray "connection line", not machinery
      fx: 0.14, fy: 0.62, size: 0.30, tiltX: 0.40, tiltY: 0.22,
      parallax: 1.4, idle: 0.10, scrollK: 0.0022, pulseAt: 3.5,
      root: { teeth: 18, hub: 0.26, spokes: 8 },
      children: [
        { angle: 0.95, teeth: 10, hub: 0.32, spokes: 4 }
      ],
      rings: []
    }
  ];

  // prebuild geometry
  CLUSTERS.forEach(function (c) {
    c.root.geom = buildGear(c.root.teeth, c.root.hub, c.root.spokes);
    c.children.forEach(function (ch) {
      ch.geom = buildGear(ch.teeth, ch.hub, ch.spokes);
      ch.scale = ch.teeth / c.root.teeth; // same tooth module as the root
    });
    c.rings.forEach(function (r) { r.geom = buildRing(r.r, r.ticks); });
  });

  // ---- state ----
  var W = 0, H = 0, DPR = 1;
  var t = 0;
  var mx = 0, my = 0, smx = 0, smy = 0;
  var BUCKETS = 8;
  var PULSE_PERIOD = 7; // seconds between power surges per cluster

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (reduced) draw();
  }

  // project a segment list; endpoints alternate, bucket by midpoint depth
  function collect(segs, spin, ctxp, paths) {
    var cs = Math.cos(spin), ss = Math.sin(spin);
    var px0 = 0, py0 = 0, z0 = 0;
    for (var i = 0; i < segs.length; i += 3) {
      var x = segs[i] * cs - segs[i + 1] * ss;
      var y = segs[i] * ss + segs[i + 1] * cs;
      var z = segs[i + 2];
      var y1 = y * ctxp.cA - z * ctxp.sA, z1 = y * ctxp.sA + z * ctxp.cA;
      var x2 = x * ctxp.cB + z1 * ctxp.sB, z2 = -x * ctxp.sB + z1 * ctxp.cB;
      var s = 4.2 / (4.2 + z2);
      var px = ctxp.cx + x2 * ctxp.R * s, py = ctxp.cy - y1 * ctxp.R * s;
      if ((i / 3) % 2 === 0) { px0 = px; py0 = py; z0 = z2; }
      else {
        var d = Math.max(0, Math.min(1, (1.2 - (z0 + z2) * 0.5) / 2.4));
        paths[Math.min(BUCKETS - 1, (d * BUCKETS) | 0)].push(px0, py0, px, py);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var scroll = window.scrollY || 0;

    CLUSTERS.forEach(function (c) {
      var R = Math.min(W, H) * c.size;
      var cx = W * c.fx + smx * 18 * c.parallax;
      var cy = H * c.fy + smy * 14 * c.parallax;
      var ta = c.tiltX + smy * 0.05, tb = c.tiltY + smx * 0.07;
      var ctxp = {
        cA: Math.cos(ta), sA: Math.sin(ta),
        cB: Math.cos(tb), sB: Math.sin(tb),
        cx: cx, cy: cy, R: R
      };
      var phi = c.idle * t + scroll * c.scrollK;

      var paths = [], b;
      for (b = 0; b < BUCKETS; b++) paths[b] = [];

      collect(c.root.geom, phi, ctxp, paths);

      c.children.forEach(function (ch) {
        var d = PITCH * (1 + ch.scale);
        var chp = {
          cA: ctxp.cA, sA: ctxp.sA, cB: ctxp.cB, sB: ctxp.sB,
          cx: 0, cy: 0, R: R * ch.scale
        };
        // child center: offset in the cluster plane, tilt-projected
        var ox = Math.cos(ch.angle) * d, oy = Math.sin(ch.angle) * d;
        var oy1 = oy * ctxp.cA, oz1 = oy * ctxp.sA;
        var ox2 = ox * ctxp.cB + oz1 * ctxp.sB;
        chp.cx = cx + ox2 * R;
        chp.cy = cy - oy1 * R;
        // mesh: opposite spin at tooth ratio, phased so a root tooth center
        // meets a child gap center on the line of centers
        var p1 = Math.PI * 2 / c.root.teeth;
        var chPhi = -(1 / ch.scale) * (phi - ch.angle + 0.5 * p1) + ch.angle + Math.PI;
        collect(ch.geom, chPhi, chp, paths);
      });

      c.rings.forEach(function (r) {
        if (r.geom.length) collect(r.geom, r.spin * t + scroll * 0.0004, ctxp, paths);
      });

      // pixel-exact containment: geometric clamps kept failing because
      // perspective magnifies the near side ~1.3x — so measure the actual
      // projected bounds and shift the whole cluster back inside the viewport
      var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, i, q;
      for (b = 0; b < BUCKETS; b++) {
        q = paths[b];
        for (i = 0; i < q.length; i += 2) {
          if (q[i] < minX) minX = q[i];
          if (q[i] > maxX) maxX = q[i];
          if (q[i + 1] < minY) minY = q[i + 1];
          if (q[i + 1] > maxY) maxY = q[i + 1];
        }
      }
      var M = 10, dx = 0, dy = 0;
      if (maxX - minX > W - 2 * M) dx = (W - minX - maxX) / 2; // too wide: center
      else if (minX < M) dx = M - minX;
      else if (maxX > W - M) dx = W - M - maxX;
      if (maxY - minY > H - 2 * M) dy = (H - minY - maxY) / 2;
      else if (minY < M) dy = M - minY;
      else if (maxY > H - M) dy = H - M - maxY;
      ctx.save();
      ctx.translate(dx, dy);

      // power surge: a brightness swell sweeping the cluster every PERIOD
      var pt = ((t + c.pulseAt) % PULSE_PERIOD);
      var pulse = 1 + 1.1 * Math.exp(-(pt - 1.2) * (pt - 1.2) / 0.16);

      for (b = 0; b < BUCKETS; b++) {
        var q = paths[b];
        if (!q.length) continue;
        var alpha = Math.min(0.3, (0.055 + 0.115 * (b / (BUCKETS - 1))) * pulse);
        ctx.beginPath();
        for (var i = 0; i < q.length; i += 4) {
          ctx.moveTo(q[i], q[i + 1]);
          ctx.lineTo(q[i + 2], q[i + 3]);
        }
        ctx.strokeStyle = 'rgba(46,255,78,' + (alpha * 0.45).toFixed(3) + ')';
        ctx.lineWidth = 3.2;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(46,255,78,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // scanner blip orbiting the outer ring, with a short fading trail
      c.rings.forEach(function (r) {
        if (!r.blip) return;
        for (var k = 0; k < 5; k++) {
          var ba = -t * 0.5 - k * 0.05;
          var bx = Math.cos(ba) * r.r, by = Math.sin(ba) * r.r;
          var by1 = by * ctxp.cA, bz1 = by * ctxp.sA;
          var bx2 = bx * ctxp.cB + bz1 * ctxp.sB;
          var sc = 4.2 / (4.2 - bx * ctxp.sB + bz1 * ctxp.cB);
          ctx.beginPath();
          ctx.arc(cx + bx2 * R * sc, cy - by1 * R * sc, k === 0 ? 2.6 : 1.6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(46,255,78,' + (0.5 / (k + 1)).toFixed(3) + ')';
          ctx.fill();
        }
      });

      ctx.restore(); // end containment translate
    });
  }

  var prev = 0;
  function tick(now) {
    var dt = prev ? Math.min(0.1, (now - prev) / 1000) : 0.016;
    prev = now;
    t += dt;
    smx += (mx - smx) * Math.min(1, 3 * dt);
    smy += (my - smy) * Math.min(1, 3 * dt);
    draw();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  if (!reduced) {
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX / W * 2 - 1;
      my = e.clientY / H * 2 - 1;
    }, { passive: true });
  }
  // reduced motion: static machine, no idle spin, no scroll coupling

  resize();
  if (reduced) draw();
  else requestAnimationFrame(tick);
})();

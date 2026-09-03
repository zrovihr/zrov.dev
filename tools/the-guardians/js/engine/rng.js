// Seeded PRNG. Every random decision in the engine routes through here so a game is fully
// reproducible from its seed. That is what lets the balance simulator replay a suspicious
// game exactly, and what lets a bug report be a single number.
// PURE MODULE: no DOM, no globals, no I/O.

// mulberry32: 32-bit state, good enough distribution for card shuffling and target rolls,
// and short enough to audit at a glance. Not cryptographic; nothing here needs that.
export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  next.int = (n) => Math.floor(next() * n);
  next.pick = (arr) => arr[next.int(arr.length)];

  // Fisher-Yates. Returns a new array; the engine never shuffles in place because state
  // snapshots must stay comparable across a replay.
  next.shuffle = (arr) => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = next.int(i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  // Exposed so state can be serialized mid-game and resumed bit-identically.
  next.getState = () => a;
  next.setState = (v) => { a = v >>> 0; };

  return next;
}

export function randomSeed() {
  return (Math.random() * 0xffffffff) >>> 0;
}

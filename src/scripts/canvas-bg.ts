/**
 * canvas-bg.ts — Animated canvas backgrounds for 3 themes.
 * Reads data-theme from <html> and switches rendering accordingly.
 */

const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
let W = 0, H = 0;

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

// ── Shared helpers ────────────────────────────────────────────
function rand(a: number, b: number) { return a + Math.random() * (b - a); }

// ── THEME A — Royal Codex (starfield + aurora + orbs + feathers) ─────────
interface Star    { x: number; y: number; r: number; phase: number; speed: number; }
interface Orb     { x: number; y: number; r: number; phase: number; speed: number; hue: number; }
interface Feather { x: number; y: number; size: number; rot: number; baseRot: number; phase: number; vx: number; vy: number; alpha: number; }

function makeFeather(randomY = false): Feather {
  const base = rand(-0.18, 0.18);
  return {
    x: Math.random(), y: randomY ? Math.random() : -0.08,
    size: rand(24, 52), rot: base, baseRot: base,
    phase: rand(0, Math.PI * 2),
    vx: rand(-0.00006, 0.00006), vy: rand(0.00015, 0.00038),
    alpha: rand(0.1, 0.32),
  };
}
function drawFeather(x: number, y: number, size: number, rot: number, alpha: number, col: string) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha;
  const h = size, w = size * 0.26;
  // Vane
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.52);
  ctx.bezierCurveTo( w * 0.9, -h * 0.22,  w * 1.15, h * 0.1,  w * 0.45, h * 0.48);
  ctx.quadraticCurveTo(0, h * 0.58, 0, h * 0.54);
  ctx.quadraticCurveTo(0, h * 0.58, -w * 0.45, h * 0.48);
  ctx.bezierCurveTo(-w * 1.15, h * 0.1, -w * 0.9, -h * 0.22, 0, -h * 0.52);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, -h/2, 0, h/2);
  g.addColorStop(0,    col + '00');
  g.addColorStop(0.12, col + 'dd');
  g.addColorStop(0.55, col + '99');
  g.addColorStop(0.9,  col + '33');
  g.addColorStop(1,    col + '00');
  ctx.fillStyle = g; ctx.fill();
  // Barbs
  const barbs = 7;
  for (let i = -barbs; i <= barbs; i++) {
    const by2 = i * (h * 0.07);
    const bx  = w * 0.85 * (1 - Math.abs(i / (barbs + 1)) * 0.5);
    const a2  = 0.22 * (1 - Math.abs(i / barbs));
    ctx.beginPath(); ctx.moveTo(0, by2); ctx.lineTo( bx, by2 - bx * 0.25);
    ctx.strokeStyle = col + Math.round(a2 * 255).toString(16).padStart(2,'0');
    ctx.lineWidth = 0.45; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, by2); ctx.lineTo(-bx, by2 - bx * 0.25);
    ctx.stroke();
  }
  // Quill
  ctx.beginPath(); ctx.moveTo(0, -h * 0.52); ctx.lineTo(0, h * 0.56);
  ctx.strokeStyle = col + 'aa'; ctx.lineWidth = 0.75; ctx.stroke();
  ctx.restore(); ctx.globalAlpha = 1;
}
const feathersA: Feather[] = Array.from({ length: 11 }, () => makeFeather(true));

const starsA: Star[] = Array.from({ length: 220 }, () => ({
  x: Math.random(), y: Math.random(),
  r: rand(0.3, 1.8),
  phase: rand(0, Math.PI * 2),
  speed: rand(0.4, 1.5),
}));
const orbsA: Orb[] = Array.from({ length: 6 }, () => ({
  x: rand(0.1, 0.9), y: rand(0.1, 0.8),
  r: rand(40, 90),
  phase: rand(0, Math.PI * 2),
  speed: rand(0.0004, 0.001),
  hue: rand(30, 55),
}));

function drawA(t: number) {
  ctx.clearRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#01030d');
  g.addColorStop(0.5, '#0a0d1a');
  g.addColorStop(1, '#121830');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Aurora
  for (let i = 0; i < 3; i++) {
    const ag = ctx.createLinearGradient(0, 0, 0, H * 0.45);
    const hue = 200 + i * 35;
    const a = 0.04 + Math.sin(t * 0.6 + i * 1.3) * 0.025;
    ag.addColorStop(0, `hsla(${hue},70%,40%,${a})`);
    ag.addColorStop(1, 'transparent');
    ctx.fillStyle = ag;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= W; x += 30) {
      const y = Math.sin(x / 180 + t * 0.4 + i * 1.1) * 50 + H * 0.18;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, 0); ctx.closePath(); ctx.fill();
  }

  // Stars
  starsA.forEach(s => {
    const a = 0.25 + Math.sin(t * s.speed + s.phase) * 0.5;
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,248,220,${Math.max(0, a)})`;
    ctx.fill();
  });

  // Orbs
  orbsA.forEach(o => {
    o.phase += o.speed;
    const ox = (o.x + Math.sin(o.phase) * 0.09) * W;
    const oy = (o.y + Math.cos(o.phase * 0.8) * 0.05) * H;
    const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r * 3.5);
    og.addColorStop(0, `hsla(${o.hue},80%,70%,0.22)`);
    og.addColorStop(0.4, `hsla(${o.hue},70%,50%,0.07)`);
    og.addColorStop(1, 'transparent');
    ctx.fillStyle = og;
    ctx.beginPath();
    ctx.arc(ox, oy, o.r * 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Feathers
  feathersA.forEach((f, i) => {
    f.phase += 0.008;
    f.x = ((f.x + f.vx + Math.sin(f.phase * 0.6) * 0.00025) + 1.1) % 1.1;
    f.y += f.vy;
    f.rot = f.baseRot + Math.sin(f.phase) * 0.14;
    if (f.y > 1.06) feathersA[i] = makeFeather(false);
    drawFeather(f.x * W, f.y * H, f.size, f.rot, f.alpha, '#c9a84c');
  });

  // Background image overlay if loaded
  const imgA = (window as any).__bgA;
  if (imgA?.complete) {
    ctx.globalAlpha = 0.15;
    ctx.drawImage(imgA, 0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

// ── THEME B — Pixel Kingdom ────────────────────────────────────
interface PCloud { x: number; y: number; w: number; speed: number; }
const px = () => Math.max(2, Math.floor(W / 220));

const pClouds: PCloud[] = Array.from({ length: 5 }, () => ({
  x: Math.random(), y: rand(0.05, 0.3), w: rand(60, 120), speed: rand(0.00005, 0.00015),
}));
const pStars = Array.from({ length: 90 }, () => ({
  x: Math.floor(rand(0, 240)), y: Math.floor(rand(0, 100)),
  on: Math.random() > 0.5, t: 0, rate: Math.floor(rand(60, 150)),
}));

function pixRect(x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawB(t: number) {
  ctx.clearRect(0, 0, W, H);
  const p = px();
  // Sky gradient
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#03010c');
  g.addColorStop(0.6, '#0e0920');
  g.addColorStop(1, '#1a0d38');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // Stars
  pStars.forEach(s => {
    s.t++;
    if (s.t >= s.rate) { s.on = !s.on; s.t = 0; }
    if (s.on) pixRect((s.x / 240) * W, (s.y / 100) * H * 0.6, p, p, s.y % 5 === 0 ? '#f0d060' : '#c8c8ff');
  });

  // Moon
  const mr = Math.max(18, W * 0.035);
  const mx = W * 0.78, my = H * 0.1;
  ctx.fillStyle = '#f0ecc8';
  ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0e0920';
  ctx.beginPath(); ctx.arc(mx - mr * 0.28, my - mr * 0.1, mr * 0.82, 0, Math.PI * 2); ctx.fill();

  // Clouds
  pClouds.forEach(c => {
    c.x = (c.x + c.speed) % 1.15;
    const cw = c.w * (W / 400), cx = (c.x - 0.1) * W, cy = c.y * H;
    const col = 'rgba(160,140,220,0.22)';
    pixRect(cx, cy, cw, p * 3, col);
    pixRect(cx + p * 2, cy - p * 3, cw * 0.35, p * 3, col);
    pixRect(cx + cw * 0.35, cy - p * 3, cw * 0.4, p * 3, col);
  });

  // Castle silhouette
  const cw = Math.min(W * 0.7, 700), ch = H * 0.42;
  const cx = (W - cw) / 2, cy = H - ch;
  ctx.fillStyle = '#080514';
  const parts = [
    [0.28, 0.25, 0.44, 0.75], [0.08, 0.38, 0.22, 0.62], [0.70, 0.38, 0.22, 0.62],
    [0.0, 0.58, 1.0, 0.42],
    [0.28, 0.14, 0.04, 0.13], [0.34, 0.14, 0.04, 0.13], [0.40, 0.14, 0.04, 0.13],
    [0.46, 0.14, 0.04, 0.13], [0.52, 0.14, 0.04, 0.13], [0.58, 0.14, 0.04, 0.13],
    [0.64, 0.14, 0.04, 0.13], [0.08, 0.27, 0.03, 0.13], [0.14, 0.27, 0.03, 0.13],
    [0.70, 0.27, 0.03, 0.13], [0.76, 0.27, 0.03, 0.13],
    [0.00, 0.48, 0.03, 0.12], [0.05, 0.48, 0.03, 0.12],
    [0.92, 0.48, 0.03, 0.12], [0.97, 0.48, 0.03, 0.12],
  ];
  parts.forEach(([x, y, w, h]) => ctx.fillRect(Math.round(cx + x * cw), Math.round(cy + y * ch), Math.round(w * cw), Math.round(h * ch)));

  // Glowing windows
  [[0.44, 0.48], [0.52, 0.48], [0.44, 0.58], [0.52, 0.58], [0.12, 0.52], [0.75, 0.52]].forEach(([wx, wy]) => {
    const x = cx + wx * cw, y = cy + wy * ch;
    const og = ctx.createRadialGradient(x, y, 0, x, y, p * 7);
    og.addColorStop(0, `rgba(255,200,60,${0.7 + Math.sin(t * 2 + wx * 10) * 0.2})`);
    og.addColorStop(1, 'transparent');
    ctx.fillStyle = og; ctx.fillRect(x - p * 7, y - p * 7, p * 14, p * 14);
    pixRect(x - p, y - p * 2, p * 2, p * 3, '#f8e060');
  });

  ctx.fillStyle = '#030108';
  ctx.fillRect(0, H - p * 5, W, p * 5);
}

// ── THEME C — Ink & Sakura ─────────────────────────────────────
interface Petal {
  x: number; y: number; r: number; rot: number; vx: number; vy: number;
  rSpeed: number; alpha: number; hue: number; sw: number; sp: number;
}

const petals: Petal[] = Array.from({ length: 65 }, () => makePetal(true));
function makePetal(randomY = false): Petal {
  return {
    x: Math.random(), y: randomY ? Math.random() : -0.04,
    r: rand(4, 10), rot: rand(0, Math.PI * 2), rSpeed: (Math.random() - 0.5) * 0.035,
    vx: (Math.random() - 0.5) * 0.0018, vy: rand(0.0004, 0.001),
    alpha: rand(0.3, 0.65), hue: rand(330, 355), sw: rand(0.001, 0.003), sp: rand(0, Math.PI * 2),
  };
}
const bokeh = Array.from({ length: 18 }, () => ({
  x: Math.random(), y: Math.random(), r: rand(8, 45), a: rand(0.02, 0.09), ph: Math.random() * Math.PI * 2,
}));

function drawC(t: number) {
  ctx.clearRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#01020b');
  g.addColorStop(0.4, '#060918');
  g.addColorStop(1, '#0a0f28');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // Background image overlay
  const imgC = (window as any).__bgC;
  if (imgC?.complete) {
    ctx.globalAlpha = 0.2;
    ctx.drawImage(imgC, 0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // Bokeh
  bokeh.forEach(b => {
    b.ph += 0.005;
    const bg = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, b.r);
    bg.addColorStop(0, `hsla(330,55%,75%,${b.a + Math.sin(b.ph) * 0.025})`);
    bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(b.x * W, b.y * H, b.r, 0, Math.PI * 2); ctx.fill();
  });

  // Stars
  for (let i = 0; i < 110; i++) {
    const sx = ((i * 137.5) % 1) * W, sy = ((i * 97.3) % 0.7) * H;
    const a = Math.max(0, 0.15 + Math.sin(t * 1.5 + i) * 0.2);
    ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230,220,245,${a})`; ctx.fill();
  }

  // Ground ink glow
  const ig = ctx.createLinearGradient(0, H * 0.65, 0, H);
  ig.addColorStop(0, 'transparent');
  ig.addColorStop(1, 'rgba(180,50,90,0.08)');
  ctx.fillStyle = ig; ctx.fillRect(0, H * 0.65, W, H * 0.35);

  // Petals
  petals.forEach((p, i) => {
    p.sp += p.sw; p.x += p.vx + Math.sin(p.sp) * 0.0008; p.y += p.vy; p.rot += p.rSpeed;
    if (p.y > 1.05) petals[i] = makePetal(false);
    if (p.x < -0.06 || p.x > 1.06) p.x = p.x < 0 ? 1.0 : 0.0;

    ctx.save();
    ctx.translate(p.x * W, p.y * H);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = `hsl(${p.hue},75%,80%)`;
    ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `hsl(${p.hue},55%,90%)`;
    ctx.beginPath(); ctx.ellipse(p.r * 0.08, 0, p.r * 0.5, p.r * 0.3, Math.PI / 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  });
}

// ── Main loop ──────────────────────────────────────────────────
let t = 0;
function frame() {
  t += 0.01;
  const theme = document.documentElement.dataset.theme || 'a';
  if      (theme === 'a') drawA(t);
  else if (theme === 'b') drawB(t);
  else if (theme === 'c') drawC(t);
  requestAnimationFrame(frame);
}
frame();

// Preload AI bg images
function preload(src: string, key: string) {
  const img = new Image();
  img.src = src;
  (window as any)[key] = img;
}
preload('/assets/bg/theme-a-bg.png', '__bgA');
preload('/assets/bg/theme-c-bg.png', '__bgC');

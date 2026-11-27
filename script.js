// ================= Intro typewriter =================
const lines = "Once upon a time, two little hearts…";
const typer = document.getElementById("typer");
const beginBtn = document.getElementById("begin");
let ti = 0;
(function type() {
  if (ti <= lines.length) {
    typer.textContent = lines.slice(0, ti++);
    setTimeout(type, ti < 3 ? 400 : 70);
  } else {
    typer.classList.add("done");
    beginBtn.classList.add("show");
  }
})();
setTimeout(() => beginBtn.classList.add("show"), 4500); // safety

// ================= Open =================
const intro = document.getElementById("intro");
const site = document.getElementById("site");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

beginBtn.addEventListener("click", () => {
  try { music.currentTime = 10; music.play().then(() => musicBtn.classList.add("playing")).catch(() => {}); } catch (e) {}
  if (navigator.vibrate) navigator.vibrate(120);
  typer.textContent = "…grew up, and are now getting engaged ♥";
  typer.classList.add("done");
  site.classList.add("show");
  setTimeout(() => intro.classList.add("gone"), 900);
  setTimeout(() => {
    intro.style.display = "none";
    document.body.classList.remove("locked");
    sparkleBurst();
    reveal();
    watchEnvelope();
    watchPolaroid();
    startPetals();
  }, 2400);
});

musicBtn.addEventListener("click", () => {
  if (music.paused) { music.play(); musicBtn.classList.add("playing"); }
  else { music.pause(); musicBtn.classList.remove("playing"); }
});

const COLORS = ["#f3d3cf", "#e79aa1", "#c0626a", "#c9a24a", "#f1dfae", "#ffffff"];
function sparkleBurst() {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 90, spread: 80, origin: { x: 0.2, y: 0.35 }, colors: COLORS });
  confetti({ particleCount: 90, spread: 80, origin: { x: 0.8, y: 0.35 }, colors: COLORS });
}

// ================= Live sky: lanterns, bokeh, hearts =================
const sky = document.getElementById("sky");
const sctx = sky.getContext("2d");
let W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
function resize() {
  W = window.innerWidth; H = window.innerHeight;
  sky.width = W * DPR; sky.height = H * DPR;
  sctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resize();
window.addEventListener("resize", resize);

const rand = (a, b) => a + Math.random() * (b - a);
const lanterns = [], bokeh = [], hearts = [];
const small = window.innerWidth < 600;
for (let i = 0; i < (small ? 12 : 20); i++) lanterns.push(newLantern(true));
for (let i = 0; i < (small ? 22 : 36); i++) bokeh.push(newBokeh());
function newLantern(init) {
  const s = rand(10, 22);
  return { x: rand(0, W), y: init ? rand(0, H) : H + rand(20, 120), s, vy: rand(.25, .6) * (s / 16), sway: rand(0, Math.PI * 2), sw: rand(.004, .012), a: rand(.45, .8), f: rand(0, 10) };
}
function newBokeh() {
  return { x: rand(0, W), y: rand(0, H), r: rand(2, 9), vx: rand(-.15, .15), vy: rand(-.25, -.05), a: rand(.08, .35), c: Math.random() < .5 ? "255,220,170" : "255,190,200", t: rand(0, 6) };
}
function drawLantern(l, t) {
  const x = l.x + Math.sin(l.sway + t * l.sw * 60) * 12, y = l.y, s = l.s;
  const flick = .85 + Math.sin(t * 8 + l.f) * .08 + Math.random() * .05;
  const g = sctx.createRadialGradient(x, y, 0, x, y, s * 3);
  g.addColorStop(0, `rgba(255,190,90,${.35 * l.a * flick})`);
  g.addColorStop(1, "rgba(255,150,60,0)");
  sctx.fillStyle = g; sctx.beginPath(); sctx.arc(x, y, s * 3, 0, Math.PI * 2); sctx.fill();
  sctx.save(); sctx.translate(x, y);
  const body = sctx.createLinearGradient(0, -s, 0, s);
  body.addColorStop(0, `rgba(255,230,170,${l.a})`);
  body.addColorStop(.6, `rgba(255,160,70,${l.a})`);
  body.addColorStop(1, `rgba(220,90,40,${l.a})`);
  sctx.fillStyle = body;
  sctx.beginPath();
  sctx.moveTo(-s * .55, -s * .9); sctx.quadraticCurveTo(0, -s * 1.15, s * .55, -s * .9);
  sctx.lineTo(s * .42, s * .8); sctx.quadraticCurveTo(0, s * .95, -s * .42, s * .8); sctx.closePath();
  sctx.fill();
  sctx.fillStyle = `rgba(255,255,220,${.7 * flick})`;
  sctx.beginPath(); sctx.ellipse(0, s * .55, s * .14, s * .2, 0, 0, Math.PI * 2); sctx.fill();
  sctx.restore();
}
function drawHeart(h) {
  sctx.save(); sctx.translate(h.x, h.y); sctx.scale(h.s, h.s); sctx.globalAlpha = h.a;
  sctx.fillStyle = "#e07a86";
  sctx.beginPath(); sctx.moveTo(0, 3);
  sctx.bezierCurveTo(-6, -2, -3, -8, 0, -4); sctx.bezierCurveTo(3, -8, 6, -2, 0, 3); sctx.fill();
  sctx.restore();
}
let running = true, last = 0;
document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });
function frame(ts) {
  if (!running) return;
  const t = ts / 1000;
  sctx.clearRect(0, 0, W, H);
  bokeh.forEach(b => {
    b.x += b.vx; b.y += b.vy; b.t += .01;
    if (b.y < -20) { b.y = H + 20; b.x = rand(0, W); }
    const a = b.a * (.6 + .4 * Math.sin(b.t * 2));
    const g = sctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.2);
    g.addColorStop(0, `rgba(${b.c},${a})`); g.addColorStop(1, `rgba(${b.c},0)`);
    sctx.fillStyle = g; sctx.beginPath(); sctx.arc(b.x, b.y, b.r * 2.2, 0, Math.PI * 2); sctx.fill();
  });
  lanterns.forEach((l, i) => {
    l.y -= l.vy;
    if (l.y < -60) lanterns[i] = newLantern(false);
    drawLantern(l, t);
  });
  if (Math.random() < .012) hearts.push({ x: rand(0, W), y: H + 10, s: rand(1.2, 2.4), vy: rand(.6, 1.2), a: .7, w: rand(0, 6) });
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i]; h.y -= h.vy; h.x += Math.sin(h.y / 40 + h.w) * .4; h.a -= .0015;
    if (h.y < -20 || h.a <= 0) hearts.splice(i, 1); else drawHeart(h);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ================= Petals & tap hearts =================
const petalBg = ["linear-gradient(135deg,#ffe3e0,#e79aa1)", "linear-gradient(135deg,#fff,#f3d3cf)", "linear-gradient(135deg,#f6c1c6,#c0626a)", "linear-gradient(135deg,#fff3d6,#e8c87a)"];
function petal(x, y, burst) {
  const p = document.createElement("div");
  p.className = "petal";
  const size = rand(9, 17);
  p.style.width = size + "px"; p.style.height = size * 1.3 + "px";
  p.style.left = (x ?? rand(0, window.innerWidth)) + "px";
  p.style.top = (y ?? -30) + "px";
  p.style.background = petalBg[Math.floor(Math.random() * petalBg.length)];
  p.style.setProperty("--dx", rand(-120, 120) + "px");
  p.style.setProperty("--dy", (burst ? rand(250, 700) : window.innerHeight + 60) + "px");
  p.style.setProperty("--rot", rand(-540, 540) + "deg");
  const dur = burst ? rand(2.5, 4.5) : rand(8, 13);
  p.style.animationDuration = dur + "s";
  document.getElementById("petals").appendChild(p);
  setTimeout(() => p.remove(), dur * 1000);
}
function startPetals() { setInterval(() => petal(), 1500); }
function shower() {
  for (let i = 0; i < 60; i++) setTimeout(() => petal(rand(0, window.innerWidth), rand(-80, -10), true), i * 25);
  if (navigator.vibrate) navigator.vibrate(60);
}
document.getElementById("showerBtn").addEventListener("click", shower);

document.addEventListener("click", e => {
  if (e.target.closest("a,button,.envelope")) return;
  const h = document.createElement("div");
  h.className = "tap-heart"; h.textContent = "♥";
  h.style.left = e.clientX + "px"; h.style.top = e.clientY + "px";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1400);
});

// ================= Polaroid develops =================
function watchPolaroid() {
  const pol = document.getElementById("polaroid");
  if (!pol) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { pol.classList.add("in"); io.disconnect(); }
  }), { threshold: .45 });
  io.observe(pol);
}

// ================= Envelope =================
const envelope = document.getElementById("envelope");
let envOpened = false;
function openEnvelope() {
  if (envOpened) return;
  envOpened = true;
  envelope.classList.add("open");
  document.getElementById("envHint").textContent = "See you there!";
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  setTimeout(() => {
    const r = envelope.getBoundingClientRect();
    if (typeof confetti === "function") confetti({ particleCount: 150, spread: 110, startVelocity: 40, origin: { y: Math.min(.9, Math.max(.1, (r.top + r.height * .3) / window.innerHeight)) }, colors: COLORS });
  }, 1500);
}
envelope.addEventListener("click", openEnvelope);
function watchEnvelope() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { setTimeout(openEnvelope, 350); io.disconnect(); }
  }), { threshold: .75 });
  io.observe(envelope);
}

// ================= Countdown (6:30 PM IST) =================
const target = new Date("2027-01-01T18:30:00+05:30").getTime();
const pad = n => String(n).padStart(2, "0");
function tick() {
  const d = Math.max(0, target - Date.now());
  document.getElementById("days").textContent = pad(Math.floor(d / 864e5));
  document.getElementById("hours").textContent = pad(Math.floor(d % 864e5 / 36e5));
  document.getElementById("minutes").textContent = pad(Math.floor(d % 36e5 / 6e4));
  document.getElementById("seconds").textContent = pad(Math.floor(d % 6e4 / 1e3));
}
tick(); setInterval(tick, 1000);

// ================= Diya blessing =================
const diya = document.getElementById("diya");
const msgs = ["Thank you for your blessings ♥", "Your love means the world ♥", "Shubh Aashirwad ♥"];
diya.addEventListener("click", () => {
  diya.classList.add("lit");
  document.getElementById("blessMsg").textContent = msgs[Math.floor(Math.random() * msgs.length)];
  const r = diya.getBoundingClientRect();
  if (typeof confetti === "function") confetti({ particleCount: 60, spread: 70, startVelocity: 30, origin: { x: (r.left + r.width / 2) / window.innerWidth, y: r.top / window.innerHeight }, colors: ["#ffd56b", "#ff9f43", "#fff3c4"] });
  if (navigator.vibrate) navigator.vibrate(80);
});

// ================= WhatsApp share =================
document.getElementById("shareBtn").href =
  "https://wa.me/?text=" + encodeURIComponent("💍 These kids are engaged! You're invited to Ishan & Aashka's engagement — Fri, 1 Jan 2027, 6:30 PM, Vadodara. Open the invite: " + location.href.split("?")[0]);

// ================= Scroll reveal =================
const items = document.querySelectorAll(".reveal");
function reveal() {
  items.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 70) el.classList.add("show"); });
}
window.addEventListener("scroll", reveal, { passive: true });

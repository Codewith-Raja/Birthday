const modal = document.querySelector(".promise-modal");
const openPromise = document.querySelector(".letter-button");
const closePromise = document.querySelector(".modal-close");
const celebrationModal = document.querySelector(".celebration-modal");
const openCelebration = document.querySelector(".celebrate-button");
const closeCelebration = document.querySelector(".celebration-close");
const canvas = document.querySelector(".ambient-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let width = 0;
let height = 0;
let animationFrame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticle(fromClick = false) {
  const colors = ["#c9415d", "#f6b43f", "#9bcfb5", "#fff4df"];
  return {
    x: fromClick ? width / 2 + (Math.random() - 0.5) * 140 : Math.random() * width,
    y: fromClick ? height * 0.55 + (Math.random() - 0.5) * 90 : height + Math.random() * 80,
    size: fromClick ? 7 + Math.random() * 9 : 4 + Math.random() * 6,
    speed: fromClick ? 1.8 + Math.random() * 2.4 : 0.35 + Math.random() * 0.85,
    drift: (Math.random() - 0.5) * 0.7,
    spin: Math.random() * Math.PI,
    spinSpeed: (Math.random() - 0.5) * 0.04,
    alpha: fromClick ? 0.95 : 0.28 + Math.random() * 0.36,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

function drawHeart(x, y, size, spin, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.scale(size / 18, size / 18);
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-12, -4, -10, -15, 0, -9);
  ctx.bezierCurveTo(10, -15, 12, -4, 0, 5);
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += particle.drift + Math.sin(particle.y * 0.01) * 0.22;
    particle.spin += particle.spinSpeed;
    particle.alpha *= particle.y < height * 0.16 ? 0.992 : 1;
    drawHeart(
      particle.x,
      particle.y,
      particle.size,
      particle.spin,
      particle.color,
      particle.alpha
    );
  });

  particles = particles.filter(
    (particle) => particle.y > -40 && particle.alpha > 0.05
  );

  if (particles.length < 44 && Math.random() > 0.72) {
    particles.push(createParticle());
  }

  animationFrame = requestAnimationFrame(animate);
}

function burstHearts() {
  for (let i = 0; i < 34; i += 1) {
    particles.push(createParticle(true));
  }
}

function showModal() {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  burstHearts();
  closePromise.focus();
}

function hideModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  openPromise.focus();
}

function showCelebration() {
  celebrationModal.hidden = false;
  document.body.style.overflow = "hidden";
  celebrationModal.classList.remove("is-celebrating");
  void celebrationModal.offsetWidth;
  celebrationModal.classList.add("is-celebrating");
  burstHearts();
  closeCelebration.focus();
}

function hideCelebration() {
  celebrationModal.hidden = true;
  celebrationModal.classList.remove("is-celebrating");
  document.body.style.overflow = "";
  openCelebration.focus();
}

openPromise.addEventListener("click", showModal);
closePromise.addEventListener("click", hideModal);
openCelebration.addEventListener("click", showCelebration);
closeCelebration.addEventListener("click", hideCelebration);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

celebrationModal.addEventListener("click", (event) => {
  if (event.target === celebrationModal) {
    hideCelebration();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    hideModal();
  }

  if (event.key === "Escape" && !celebrationModal.hidden) {
    hideCelebration();
  }
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
for (let i = 0; i < 28; i += 1) {
  particles.push(createParticle());
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  animate();
}

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});

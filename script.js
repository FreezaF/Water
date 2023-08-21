// Set up the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create an array to store the water particles
const particles = [];

// Variable to track if mouse is down
let isMouseDown = false;

// Particle counter
let particleCount = 0;

// Function to generate a random number within a range
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to generate a random color within a range
function randomColor(minHue, maxHue, saturation, lightness) {
  const hue = randomRange(minHue, maxHue);
  return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
}

// Function to create a water particle
function createParticle(x, y) {
  const particle = {
    x,
    y,
    radius: randomRange(1, 3),
    velocity: randomRange(1, 3),
    color: randomColor(190, 220, 80, 50),
    createdAt: Date.now()
  };
  particles.push(particle);
  particleCount++;
  updateCounter();
}

// Function to update the water particles
function updateParticles() {
  const currentTime = Date.now();
  particles.forEach((particle, index) => {
    particle.y += particle.velocity;
    if (particle.y > canvas.height) {
      particle.y = 0;
    }
    if (currentTime - particle.createdAt > 60000) {
      particles.splice(index, 1);
      particleCount--;
      updateCounter();
    }
  });
}

// Function to draw the water particles
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  });
}

// Function to handle window resize
function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Function to handle mouse down event
function handleMouseDown(e) {
  isMouseDown = true;
  createParticle(e.clientX, e.clientY);
}

// Function to handle mouse up event
function handleMouseUp() {
  isMouseDown = false;
}

// Function to handle mouse move event
function handleMouseMove(e) {
  if (isMouseDown) {
    createParticle(e.clientX, e.clientY);
  }
}

// Function to handle key press event
function handleKeyPress(e) {
  if (e.key === 'b' || e.key === 'B') {
    const burstCount = 50; // Number of particles in the burst
    const x = e.offsetX;
    const y = e.offsetY;
    for (let i = 0; i < burstCount; i++) {
      createParticle(x, y);
    }
  } else if (e.key === 'w' || e.key === 'W') {
    const spread = 20; // Spread of particles around the mouse cursor
    const x = e.clientX;
    const y = e.clientY;
    for (let i = 0; i < 10; i++) {
      const offsetX = randomRange(-spread, spread);
      const offsetY = randomRange(-spread, spread);
      createParticle(x + offsetX, y + offsetY);
    }
  }
}

// Function to update the counter display
function updateCounter() {
  const counterElement = document.getElementById('counter');
  counterElement.textContent = `Particles: ${particleCount}`;
}

// Event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
window.addEventListener('mousemove', handleMouseMove);
document.addEventListener('keydown', handleKeyPress);

// Animation loop
function animate() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

// Start the animation
animate();

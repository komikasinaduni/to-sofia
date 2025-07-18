// --- Carousel setup ---
const wrapper = document.querySelector('.polaroid-wrapper');
const track = wrapper.querySelector('.polaroids');
const originals = Array.from(track.querySelectorAll('.polaroid'));

// Clone polaroids for infinite effect
originals.forEach(orig => {
  const clone = orig.cloneNode(true);
  clone.classList.add('clone');
  track.appendChild(clone);
});

const itemCount = originals.length;
const style = getComputedStyle(track);
const gap = parseFloat(style.gap);
const itemWidth = originals[0].offsetWidth;
const step = itemWidth + gap;

let position = 0;

// --- Intro & video ---
const enterBtn = document.getElementById('enter-btn');
const leftCloud = document.querySelector('.left');
const rightCloud = document.querySelector('.right');
const bgMusic = document.getElementById('bg-music');
const video = document.getElementById('little-prince');
const overlay = document.querySelector('.camera-overlay');
const starContainer = document.querySelector('.stars');
const scrollPopup = document.getElementById('scroll-popup');
const polaroidSection = document.getElementById('polaroid-section');
const floatStarContainer = document.querySelector('.floating-stars');

enterBtn.addEventListener('click', e => {
  e.preventDefault();

  leftCloud.classList.add('open');
  rightCloud.classList.add('open');
  enterBtn.style.display = 'none';

  bgMusic.volume = 0.5;
  bgMusic.play()
    .then(() => document.querySelector('.vinyl').style.animationPlayState = 'running')
    .catch(console.error);

  video.style.display = 'block';
  overlay.style.display = 'block';

  setTimeout(() => {
    video.classList.add('show');
    video.play().catch(console.error);
  }, 100);
});

// Show scroll popup and polaroids when video ends
video.addEventListener('ended', () => {
  // Show scroll popup
  scrollPopup.classList.add('show');

  // Show polaroid section and remove hidden class
  polaroidSection.style.display = 'block';
  polaroidSection.classList.remove('hidden');

  // Unlock scroll on body
  document.body.classList.remove('lock-scroll');
  document.body.classList.add('allow-scroll');

  // Scroll smoothly to polaroid section
  polaroidSection.scrollIntoView({ behavior: 'smooth' });

  // Scatter lots of floating stars inside polaroid section
  floatStarContainer.innerHTML = ''; // clear previous stars if any
  let scatterIndex = 1;

  for (let i = 0; i < 300; i++) {
    const star = document.createElement('img');
    star.src = `Images/star${scatterIndex}.png`;
    star.classList.add('float-star');
    const size = 2 + Math.random() * 3;
    const top = Math.random() * 90; // %
    const left = Math.random() * 100; // %
    star.style.width = `${size}rem`;
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.position = 'absolute';
    floatStarContainer.appendChild(star);
    scatterIndex = (scatterIndex % 20) + 1;
  }
});

// Spawn stars over intro video when playing
let starIndex = 1, starCount = 0, maxStars = 21;
function spawnStar() {
  if (starCount >= maxStars) return;
  const s = document.createElement('img');
  s.src = `Images/star${starIndex}.png`;
  s.classList.add('star');
  if (Math.random() > 0.5) s.classList.add('sway');
  if (Math.random() > 0.5) s.classList.add('bounce');
  const size = 2.5 + Math.random() * 2.5;
  s.style.width = `${size}rem`;
  s.style.animationDuration = (1.5 + Math.random() * 2).toFixed(2) + 's';
  starContainer.appendChild(s);
  starIndex = (starIndex % 20) + 1;
  starCount++;
  setTimeout(spawnStar, 200);
}
video.addEventListener('play', spawnStar);

// --- Carousel arrows ---
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

function scrollToIdx(idx, smooth = true) {
  wrapper.scrollTo({ 
    left: idx * step, 
    behavior: smooth ? 'smooth' : 'auto' 
  });
}

rightBtn.addEventListener('click', () => {
  position++;
  scrollToIdx(position);
  if (position >= itemCount) {
    setTimeout(() => {
      scrollToIdx(position - itemCount, false);
      position -= itemCount;
    }, 600);
  }
});

leftBtn.addEventListener('click', () => {
  if (position <= 0) {
    scrollToIdx(itemCount, false);
    position = itemCount;
  }
  position--;
  scrollToIdx(position);
});

// Apply random rotation on polaroids initially
document.querySelectorAll('.polaroid').forEach(el => {
  const angle = (Math.random() - 0.5) * 15;
  el.style.setProperty('--rot', `${angle}deg`);
});

const envelopeWrapper = document.querySelector('.envelope-wrapper');

envelopeWrapper.addEventListener('click', () => {
  envelopeWrapper.classList.toggle('flap');
});

// —— scatter stars around the envelope —— 
(function scatterEnvelopeStars() {
  const container = document.querySelector('.envelope-stars');
  if (!container) return;
  let idx = 1;

  for (let i = 0; i < 150; i++) {
    const star = document.createElement('img');
    star.src = `Images/star${idx}.png`;
    // random choppy movement?
    if (Math.random() > .5) star.classList.add('sway');
    if (Math.random() > .5) star.classList.add('bounce');

    // random size
    const size = 2 + Math.random() * 3;
    star.style.width = `${size}rem`;

    // random position
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    star.style.top  = `${top}%`;
    star.style.left = `${left}%`;

    container.appendChild(star);

    idx = (idx % 20) + 1;
  }
})();
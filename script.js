/* script.js - Hard flip single-page diary
   Fully functioning and ensures first page (index=0) shows initially.
   - IMAGES array holds pages in reading order (0..N-1)
   - Final handwritten page is index = IMAGES.length
*/

(() => {
  // ---------- CONFIG ----------
  const IMAGES = [
    'images/p1.jpeg',
    'images/p2.jpeg',
    'images/p3.jpeg',
    'images/p4.jpeg',
    'images/p5.jpeg',
    'images/p6.jpeg',
    'images/p7.jpeg'
  ];
  // final page will be index = IMAGES.length
  // -----------------------------

  // Elements
  const openBtn = document.getElementById('openDiaryBtn');
  const surpriseBtn = document.getElementById('surpriseBtn');
  const overlay = document.getElementById('diaryOverlay');
  const backdrop = document.getElementById('diaryBackdrop');
  const closeOverlay = document.getElementById('closeOverlay');

  const flipper = document.getElementById('flipper');
  const frontFace = document.getElementById('frontFace');
  const backFace = document.getElementById('backFace');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageIndicator = document.getElementById('pageIndicator');
  const viewer = document.getElementById('viewer');

  // State
  let index = 0; // current visible page index (0 is first page)
  let total = IMAGES.length + 1;
  let isAnimating = false;

  // Helper: create node for an image page
  function makeImageNode(src, alt = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'page-inner';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.onerror = () => img.src = 'https://via.placeholder.com/800x1100?text=Page+Missing';
    wrapper.appendChild(img);
    return wrapper;
  }

  // Helper: final handwritten node
  function makeHandwritten() {
    const wrapper = document.createElement('div');
    wrapper.className = 'page-inner';
    const hw = document.createElement('div');
    hw.className = 'handwritten';
    hw.innerHTML = `<p>Ignore the bad handwriting… I wrote so much after 4–5 months just for you.</p>
                    <p>Happy Princess Day once again, my love ❤️</p>`;
    wrapper.appendChild(hw);
    return wrapper;
  }

  // Content for index i (0..IMAGES.length => final)
  function contentFor(i) {
    if (i < 0 || i > IMAGES.length) {
      const w = document.createElement('div');
      w.className = 'page-inner';
      return w;
    }
    if (i < IMAGES.length) return makeImageNode(IMAGES[i], `Page ${i+1}`);
    return makeHandwritten();
  }

  // Put a node into a face
  function setFace(faceEl, node) {
    faceEl.innerHTML = '';
    faceEl.appendChild(node);
  }

  // Update the page indicator display (1-based)
  function updateIndicator() {
    pageIndicator.textContent = `${Math.min(index + 1, total)} / ${total}`;
  }

  // Initialize faces to show the first page as front and next as back
  function initFaces() {
    setFace(frontFace, contentFor(index));
    setFace(backFace, contentFor(index + 1));
    updateIndicator();
  }

  // Open overlay
  function openDiary() {
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    // small delay to make backdrop fade-in smoother (CSS handles opacity)
    setTimeout(() => {
      // ensure faces reflect current index
      initFaces();
      // focus controls
      nextBtn.focus();
    }, 80);
  }

  // Close overlay: keep index and state but hide UI
  function closeDiary() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Flip forward (hard -180deg)
  function flipForward() {
    if (isAnimating) return;
    if (index >= total - 1) {
      // bounce feedback
      flipper.animate([{ transform: 'translateY(-6px)' }, { transform: 'translateY(0px)' }], { duration: 180 });
      return;
    }
    // Ensure faces show current and next
    setFace(frontFace, contentFor(index));
    setFace(backFace, contentFor(index + 1));

    isAnimating = true;
    // Add flipped class to rotate -180deg (CSS handles transform)
    flipper.classList.add('flipped');

    // Wait for CSS animation to finish, then swap content and reset
    const duration = getFlipDuration();
    setTimeout(() => {
      index = index + 1;
      // Reset the flipper to unflipped state, and set faces for new index
      flipper.classList.remove('flipped');
      setFace(frontFace, contentFor(index));
      setFace(backFace, contentFor(index + 1));
      updateIndicator();
      isAnimating = false;
    }, duration + 20);
  }

  // Flip backward (hard +180deg)
  function flipBackward() {
    if (isAnimating) return;
    if (index <= 0) {
      // small nudge
      flipper.animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0px)' }], { duration: 220 });
      return;
    }

    // To flip backward visually: we set frontFace to previous page and backFace to current, then animate flipper rotate +180deg with WA API
    setFace(frontFace, contentFor(index - 1));
    setFace(backFace, contentFor(index));

    isAnimating = true;
    const duration = getFlipDuration();

    // Animate flipper from 0 to +180deg (reverse of CSS -180)
    const anim = flipper.animate([
      { transform: 'rotateY(0deg)' },
      { transform: 'rotateY(180deg)' }
    ], { duration, easing: 'cubic-bezier(.2,.9,.2,1)' });

    anim.onfinish = () => {
      index = index - 1;
      // Reset inline transforms and set faces to new state
      flipper.style.transform = '';
      setFace(frontFace, contentFor(index));
      setFace(backFace, contentFor(index + 1));
      updateIndicator();
      isAnimating = false;
    };
  }

  // Read CSS variable --flip-duration (ms) fallback to 520
  function getFlipDuration() {
    const root = getComputedStyle(document.documentElement);
    const s = root.getPropertyValue('--flip-duration').trim();
    const v = parseInt(s) || 520;
    return v;
  }

  // Click/tap left/right halves for navigation
  flipper.addEventListener('click', (e) => {
    const rect = flipper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) flipForward();
    else flipBackward();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') flipForward();
    if (e.key === 'ArrowLeft') flipBackward();
    if (e.key === 'Escape') closeDiary();
  });

  // Buttons
  nextBtn.addEventListener('click', flipForward);
  prevBtn.addEventListener('click', flipBackward);
  closeOverlay.addEventListener('click', closeDiary);
  backdrop.addEventListener('click', closeDiary);

  // Open triggers
  openBtn.addEventListener('click', openDiary);
  surpriseBtn.addEventListener('click', () => {
    openDiary();
    setTimeout(() => flipForward(), 580);
  });

  // Touch swipe
  let sx = 0, sy = 0;
  flipper.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sx = t.clientX; sy = t.clientY;
  }, { passive: true });

  flipper.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      if (dx < 0) flipForward();
      else flipBackward();
    }
  });

  // Preload images + init faces
  function preload(list) {
    list.forEach(src => { const i = new Image(); i.src = src; });
  }
  preload(IMAGES);

  // On load set the initial faces so first page is shown
  document.addEventListener('DOMContentLoaded', () => {
    // ensure first page visible in landing view too (no overlay)
    setFace(frontFace, contentFor(index));
    setFace(backFace, contentFor(index + 1));
    updateIndicator();
  });
})();

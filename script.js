const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

function moveNoButton() {
  const margin = 15; // safety margin from edges

  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  const maxX = viewportWidth - btnWidth - margin;
  const maxY = viewportHeight - btnHeight - margin;

  // Clamp values to avoid negative positions
  const x = Math.max(margin, Math.random() * maxX);
  const y = Math.max(margin, Math.random() * maxY);

  noBtn.style.position = "fixed"; // 🔥 THIS is important
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.zIndex = 999;
}

// Desktop
noBtn.addEventListener("mouseenter", moveNoButton);

// Mobile
noBtn.addEventListener("touchstart", moveNoButton);

// YES click
yesBtn.addEventListener("click", () => {
  window.location.href = "yes.html";
});

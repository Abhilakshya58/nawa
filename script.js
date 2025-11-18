/* ---------------- LANDING HEARTS ---------------- */

const heartContainer = document.querySelector(".floating-hearts");
if (heartContainer) {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.className = "floating";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * 80 + "%";
    heart.style.animation = "floatUp 4s linear";
    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }, 1200);
}

/* ---------------- DIARY PAGE ---------------- */

const pages = [
  "images/p1.jpeg",
  "images/p2.jpeg",
  "images/p3.jpeg",
  "images/p4.jpeg",
  "images/p5.jpeg",
   "images/p6.jpeg",
    "images/p7.jpeg",
  "handwritten"
];

let current = 0;

const leftPage = document.getElementById("leftContent");
const rightPage = document.getElementById("rightContent");
const rightTurn = document.getElementById("rightPage");
const pageIndicator = document.getElementById("pageIndicator");

function renderPages() {
  leftPage.innerHTML = "";
  rightPage.innerHTML = "";

  // Left side
  if (current > 0) {
    const img = document.createElement("img");
    img.src = pages[current - 1] === "handwritten"
      ? ""
      : pages[current - 1];
    img.onerror = () => img.src = "";
    leftPage.appendChild(
      pages[current - 1] === "handwritten"
        ? createHandwrittenPage()
        : img
    );
  }

  // Right side
  if (pages[current] === "handwritten") {
    rightPage.appendChild(createHandwrittenPage());
  } else {
    const img = document.createElement("img");
    img.src = pages[current];
    rightPage.appendChild(img);
  }

  pageIndicator.textContent = `${current + 1} / ${pages.length}`;
}

function createHandwrittenPage() {
  const div = document.createElement("div");
  div.className = "handwritten";
  div.innerHTML = `
    Ignore the bad handwriting…<br><br>
    I wrote so much after 4–5 months just for you.<br><br>
    <b>Happy Princess Day once again, my love ❤️</b>
  `;
  return div;
}

document.getElementById("nextBtn").onclick = () => {
  if (current >= pages.length - 1) return;

  rightTurn.classList.add("flip");

  setTimeout(() => {
    current++;
    rightTurn.classList.remove("flip");
    renderPages();
  }, 1000);
};

document.getElementById("prevBtn").onclick = () => {
  if (current <= 0) return;

  rightTurn.classList.add("flip");
  rightTurn.style.transform = "rotateY(180deg)";

  setTimeout(() => {
    current--;
    rightTurn.classList.remove("flip");
    rightTurn.style.transform = "";
    renderPages();
  }, 1000);
};

// Initialize
if (leftPage) renderPages();

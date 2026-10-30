const films = [
  {
    title: "TWILIGHT BOOKSTORE", titleLines: ["TWILIGHT", "BOOKSTORE"], image: "assets/cards/01.jpg", genre: "3D PROJECT", year: "2021", director: "", minutes: "--",
    awardYear: "2021", portfolio: true,
    technologies: ["Maya", "Zbrush", "Substance Painter", "Rizom UV", "Photoshop", "Rendered with Arnold"], slug: "savoy"
  },
  {
    title: "FOG CITY FIRST SNOW", titleLines: ["FOG CITY", "FIRST SNOW"], image: "assets/cards/02.jpg", genre: "3D PROJECT", year: "2022", director: "", minutes: "--",
    awardYear: "2022", portfolio: true,
    technologies: ["Maya", "Zbrush", "Substance Painter", "Rizom UV", "Photoshop", "Rendered with UE"], slug: "moon-in-the-12th-house"
  },
  {
    title: "STREET AT DIFFERENT TIMES", titleLines: ["STREET AT", "DIFFERENT TIMES"], image: "assets/cards/03.png", genre: "3D PROJECT", year: "2025", director: "", minutes: "--",
    awardYear: "2025", portfolio: true,
    technologies: ["Rendered with UE5"], slug: "taboo"
  },
  {
    title: "独立游戏《古墓迷踪》", titleLines: ["独立游戏", "《古墓迷踪》"], titleClass: "is-chinese", image: "assets/cards/04.png", genre: "3D PROJECT", year: "2024", director: "", minutes: "--",
    awardYear: "2024", portfolio: true,
    technologies: ["Maya", "Zbrush", "Substance Painter", "Rizom UV", "Photoshop", "Rendered with UE4"], slug: "kafkas-last-trial"
  },
  {
    title: "MY PROJECT X", image: "assets/cards/05.png", genre: "DOCUMENTARY", year: "2024", director: "LIMOR PINHASOV", minutes: "88",
    awardYear: "2024", award: "NATIONAL COMPETITION OF DOCAVIV", awardLogo: "docaviv",
    reviews: [["CRITICAL ACCLAIM", '“A FASCINATING VOYAGE”'], ["CRITICAL ACCLAIM", '"A FILM BASED ON A TRUE STORY"'], ["CRITICAL ACCLAIM", '“RIVETING SOUNDTRACK”']], slug: "my-project-x"
  },
  {
    title: "ANA MAXIM", image: "assets/cards/06.jpg", genre: "SHORT FILM", year: "2024", director: "YONI HANDELSMAN", minutes: "24",
    awardYear: "2024", award: "THE CINEMA SOUTH FILM FESTIVAL", awardLogo: "armenpress",
    reviews: [["THE ARMENIAN REPORT", '"INSPIRING TRUE STORY"'], ["ARMENPRESS", '"BEST FEATURE FILM AT POMEGRANATE FESTIVAL"'], ["THE ARMENIAN REPORT", '"EMOTIONAL AND POWERFUL PORTRAYAL"']], slug: "ana-maxim"
  },
  {
    title: "OUTSIDER FREUD", image: "assets/cards/07.png", genre: "DOCUMENTARY", year: "2025", director: "YAIR QEDAR", minutes: "75",
    awardYear: "2024", award: "DOCUMENTARY", awardLogo: "IMDB",
    reviews: [["IMDB", '"A JOURNEY INTO FREUD\'S LIFE"'], ["THE JERUSALEM POST", '“EXPERIENCE OF MARGINALIZATION”'], ["THE HEBREWS PROJECT", '“DIMENSIONS OF FREUD\'S LEGACY”']], slug: "outsider-freud"
  },
  {
    title: "BY ANY MEANS", image: "assets/cards/08.png", genre: "FEATURE FILM", year: "2026", director: "ELEGANCE BRATTON", minutes: "104",
    awardYear: "2026", award: "FEATURE FILM", awardLogo: "",
    reviews: [["", '"A FILM BASED ON A TRUE STORY"'], ["", '"A NEW AMERICAN STORY"'], ["", '"BY ANY MEANS"']], slug: "by-any-means"
  },
  {
    title: "PROJECT 09", image: "assets/cards/09.png", genre: "FEATURE FILM", year: "2026", director: "SIENA FILM FOUNDATION", minutes: "--",
    awardYear: "2026", award: "SIENA FILM FOUNDATION", awardLogo: "",
    reviews: [["SIENA FILM FOUNDATION", '"PROJECT 09"'], ["OFFICIAL SELECTION", '"A NEW CINEMATIC STORY"'], ["SIENA FILM FOUNDATION", '"FILM 09"']], slug: "project-09"
  },
  {
    title: "PROJECT 10", image: "assets/cards/10.png", genre: "FEATURE FILM", year: "2026", director: "SIENA FILM FOUNDATION", minutes: "--",
    awardYear: "2026", award: "SIENA FILM FOUNDATION", awardLogo: "",
    reviews: [["SIENA FILM FOUNDATION", '"PROJECT 10"'], ["OFFICIAL SELECTION", '"THE TENTH FILM"'], ["SIENA FILM FOUNDATION", '"FILM 10"']], slug: "project-10"
  }
];

const slides = document.querySelector("#slides");
const menuTitle = document.querySelector("#menuTitle");
const menuThumb = document.querySelector("#menuThumb");
const menuCategory = document.querySelector("#menuCategory");
const menuYear = document.querySelector("#menuYear");
const menuMinutes = document.querySelector("#menuMinutes");
const drawerFilmList = document.querySelector("#drawerFilmList");
const stage = document.querySelector(".stage");
const cursor = document.querySelector("#scrollCursor");
const introScreen = document.querySelector("#introScreen");
const enterButton = document.querySelector("#enterButton");

let activeIndex = 0;
let position = activeIndex;
let dragging = false;
let dragStartY = 0;
let dragStartPosition = position;
let lastMoveAt = 0;
let lastMovePosition = position;
let dragVelocity = 0;
let animationFrame = 0;
let wheelTimer = 0;
let wheelFrame = 0;
let wheelVelocity = 0;
let wheelLastAt = 0;
let wheelLastEventAt = 0;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
const smoothstep = value => value * value * (3 - 2 * value);

function cyclicDistance(index, currentPosition) {
  const half = films.length / 2;
  return modulo(index - currentPosition + half, films.length) - half;
}

function trackMetrics() {
  const mobile = window.innerWidth < 768;
  const sideInset = mobile ? 16 : window.innerWidth * .04235;
  const cardWidth = Math.min(
    window.innerWidth - sideInset * 2,
    (window.innerHeight - (mobile ? 112 : 72)) * (16 / 9),
  );
  const cardHeight = cardWidth * (9 / 16);
  const gap = mobile ? 18 : Math.max(30, window.innerHeight * .042);
  const step = cardHeight + gap;
  return {
    step,
    anchor: (window.innerHeight - step) / 2,
    cardWidth,
    cardHeight,
    cardX: (window.innerWidth - cardWidth) / 2,
    cardY: gap / 2,
    radius: mobile ? 19 : 28,
    dragScale: mobile ? .78 : 3.45,
  };
}

function slideTemplate(film, index) {
  const isPortfolio = Boolean(film.portfolio);
  const titleContent = film.titleLines
    ? film.titleLines.map(line => `<span class="film-title-line">${line}</span>`).join("")
    : film.title;
  const sideContent = isPortfolio
    ? `<div class="technologies" aria-label="Software and rendering tools">${film.technologies.map(technology => `<span class="technology">${technology}</span>`).join("")}</div>`
    : film.reviews.map(([source, quote]) => `<div class="review"><span class="review-stars">★★★★★</span><span class="review-eyebrow">${source || "CRITICAL ACCLAIM"}</span><strong class="review-quote">${quote}</strong></div>`).join("");
  const awardContent = isPortfolio
    ? `<span class="award-year">${film.awardYear}</span>`
    : `<span class="award-year">${film.awardYear}</span><span class="award-name">${film.award}</span>${film.awardLogo ? `<span class="award-logo">${film.awardLogo}</span>` : ""}`;
  return `<article class="slide" data-index="${index}" aria-hidden="${index === activeIndex ? "false" : "true"}"
    ><div class="slide-shell"><img class="slide-image" src="${film.image}" alt="${film.title} film still" loading="eager" draggable="false" /><div class="slide-content"><div class="slide-details">
      <div class="award-block${isPortfolio ? " is-year-only" : ""}">${awardContent}</div>
      <div class="reviews${isPortfolio ? " is-technologies" : ""}">${sideContent}</div>
      <div class="film-info${isPortfolio ? " is-portfolio" : ""}"><span class="film-genre">${film.genre}</span><h1 class="film-title${film.titleClass ? ` ${film.titleClass}` : ""}">${titleContent}</h1><div class="film-meta"><div class="film-meta-row"><span>DIRECTOR</span><span>${film.director}</span></div><div class="film-meta-row"><span>YEAR</span><span>${film.year}</span></div><div class="film-meta-row"><span>CATEGORY</span><span>${film.genre}</span></div></div></div>
      <a class="explore" href="#${film.slug}" aria-label="Explore ${film.title}"><span>EXPLORE</span><span class="explore-arrow">→</span></a>
    </div></div></div></article>`;
}

function renderSlides() {
  slides.innerHTML = films.map(slideTemplate).join("");
  drawerFilmList.innerHTML = films.map((film, index) => `<button type="button" data-index="${index}">${film.title}</button>`).join("");
  drawerFilmList.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
    goToIndex(Number(button.dataset.index));
    closeMenu();
  }));
}

function updateChrome(index) {
  activeIndex = modulo(index, films.length);
  const film = films[activeIndex];
  document.querySelectorAll(".drawer-film-list button").forEach((button, i) => button.classList.toggle("is-active", i === activeIndex));
  menuTitle.textContent = film.title;
  menuThumb.src = film.image;
  menuCategory.textContent = film.genre;
  menuYear.textContent = film.year;
  menuMinutes.textContent = `MIN.${film.minutes}`;
}

function renderTrack() {
  const metrics = trackMetrics();
  const nearestIndex = modulo(Math.round(position), films.length);
  const slideElements = slides.querySelectorAll(".slide");

  slideElements.forEach((slide, index) => {
    const relative = cyclicDistance(index, position);
    const distance = Math.abs(relative);
    const focusLinear = 1 - clamp(distance / .9, 0, 1);
    const focus = smoothstep(focusLinear);
    const x = metrics.cardX;
    const y = metrics.cardY;
    const width = metrics.cardWidth;
    const height = metrics.cardHeight;
    const trackY = metrics.anchor + relative * metrics.step;
    const contentParallax = relative * metrics.cardHeight * .16;
    const contentOpacity = Math.pow(focus, .7);
    const cardScale = .965 + focus * .035;
    const image = slide.querySelector(".slide-image");
    const content = slide.querySelector(".slide-content");
    const details = slide.querySelector(".slide-details");

    slide.style.height = `${metrics.step}px`;
    slide.style.transform = `translate3d(0, ${trackY}px, 0)`;
    slide.style.zIndex = String(20 - Math.round(distance * 2));
    slide.classList.toggle("is-nearest", index === nearestIndex);
    slide.setAttribute("aria-hidden", String(index !== nearestIndex));

    [image, content].forEach(element => {
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.borderRadius = `${metrics.radius}px`;
      element.style.transform = `scale(${cardScale})`;
    });

    image.style.filter = `brightness(${.34 + focus * .5}) saturate(${.7 + focus * .17})`;
    content.style.opacity = String(contentOpacity);
    details.style.transform = `translate3d(0, ${contentParallax}px, 0)`;
  });
}

function stopAnimation() {
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
}

function stopWheelMotion() {
  cancelAnimationFrame(wheelFrame);
  wheelFrame = 0;
  wheelVelocity = 0;
  wheelLastAt = 0;
  wheelLastEventAt = 0;
}

function normalizeWheelDelta(event) {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function runWheelMotion(now = performance.now()) {
  if (!wheelLastAt) wheelLastAt = now;
  const elapsed = clamp(now - wheelLastAt, 1, 34);
  wheelLastAt = now;
  position += wheelVelocity * elapsed / 1000;
  renderTrack();
  wheelVelocity *= Math.pow(.0008, elapsed / 1000);

  if (Math.abs(wheelVelocity) > .035 || now - wheelLastEventAt < 110) {
    wheelFrame = requestAnimationFrame(runWheelMotion);
    return;
  }

  wheelFrame = 0;
  wheelVelocity = 0;
  animateTo(Math.round(position), undefined, 360);
}

function animateTo(target, onComplete, durationOverride) {
  stopAnimation();
  const start = position;
  const change = target - start;
  const duration = reducedMotion.matches ? 0 : durationOverride ?? clamp(470 + Math.abs(change) * 110, 520, 720);
  const startedAt = performance.now();

  if (!duration) {
    position = target;
    renderTrack();
    updateChrome(Math.round(position));
    onComplete?.();
    return;
  }

  const tick = now => {
    const progress = clamp((now - startedAt) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    position = start + change * eased;
    renderTrack();

    if (progress < 1) {
      animationFrame = requestAnimationFrame(tick);
    } else {
      position = target;
      renderTrack();
      updateChrome(Math.round(position));
      animationFrame = 0;
      onComplete?.();
    }
  };

  animationFrame = requestAnimationFrame(tick);
}

function goToIndex(index) {
  const delta = cyclicDistance(index, position);
  animateTo(position + delta);
}

function next(step) {
  animateTo(Math.round(position) + step);
}

const menuToggle = document.querySelector("#menuToggle");
const ticketButton = document.querySelector("#ticketButton");
const drawer = document.querySelector("#menuDrawer");
const backdrop = document.querySelector("#menuBackdrop");
const drawerClose = document.querySelector("#drawerClose");
function openMenu() { drawer.classList.add("is-open"); backdrop.classList.add("is-open"); menuToggle.classList.add("is-open"); menuToggle.setAttribute("aria-expanded", "true"); ticketButton.setAttribute("aria-expanded", "true"); drawer.setAttribute("aria-hidden", "false"); }
function closeMenu() { drawer.classList.remove("is-open"); backdrop.classList.remove("is-open"); menuToggle.classList.remove("is-open"); menuToggle.setAttribute("aria-expanded", "false"); ticketButton.setAttribute("aria-expanded", "false"); drawer.setAttribute("aria-hidden", "true"); }
menuToggle.addEventListener("click", () => drawer.classList.contains("is-open") ? closeMenu() : openMenu());
ticketButton.addEventListener("click", () => drawer.classList.contains("is-open") ? closeMenu() : openMenu());
drawerClose.addEventListener("click", closeMenu);
backdrop.addEventListener("click", closeMenu);

stage.addEventListener("wheel", event => {
  event.preventDefault();
  if (drawer.classList.contains("is-open") || Math.abs(event.deltaY) < 1) return;
  stopAnimation();
  const delta = clamp(normalizeWheelDelta(event), -160, 160);
  wheelVelocity = clamp(wheelVelocity + delta / 28, -5.2, 5.2);
  wheelLastEventAt = performance.now();
  if (!wheelFrame) wheelFrame = requestAnimationFrame(runWheelMotion);
  window.clearTimeout(wheelTimer);
  wheelTimer = window.setTimeout(() => {
    if (!wheelFrame) animateTo(Math.round(position));
  }, 150);
}, { passive: false });

stage.addEventListener("pointerdown", event => {
  if (event.button !== 0 || event.target.closest("a, button") || drawer.classList.contains("is-open")) return;
  event.preventDefault();
  stopAnimation();
  stopWheelMotion();
  window.clearTimeout(wheelTimer);
  dragging = true;
  dragStartY = event.clientY;
  dragStartPosition = position;
  lastMoveAt = performance.now();
  lastMovePosition = position;
  dragVelocity = 0;
  cursor.classList.add("is-dragging");
  stage.setPointerCapture?.(event.pointerId);
});

stage.addEventListener("pointermove", event => {
  if (window.innerWidth >= 768) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.remove("is-hidden");
  }
  if (!dragging) return;

  const now = performance.now();
  const metrics = trackMetrics();
  const nextPosition = dragStartPosition + (dragStartY - event.clientY) * metrics.dragScale / metrics.step;
  const elapsed = Math.max(1, now - lastMoveAt);
  const instantVelocity = (nextPosition - lastMovePosition) / elapsed;
  dragVelocity = dragVelocity * .68 + instantVelocity * .32;
  position = nextPosition;
  lastMoveAt = now;
  lastMovePosition = nextPosition;
  renderTrack();
});

function finishDrag(event) {
  if (!dragging) return;
  dragging = false;
  cursor.classList.remove("is-dragging");
  stage.releasePointerCapture?.(event.pointerId);
  const projection = clamp(dragVelocity * 70, -.32, .32);
  animateTo(Math.round(position + projection));
}

stage.addEventListener("pointerup", finishDrag);
stage.addEventListener("pointercancel", finishDrag);

document.addEventListener("keydown", event => {
  if (!document.body.classList.contains("site-entered")) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      enterSite();
    }
    return;
  }
  if (event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); next(1); }
  if (event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); next(-1); }
  if (event.key === "Escape") closeMenu();
});

stage.addEventListener("pointerenter", () => {
  if (window.innerWidth >= 768) cursor.classList.remove("is-hidden");
});
stage.addEventListener("pointerleave", () => {
  if (!dragging) cursor.classList.add("is-hidden");
});

function enterSite() {
  enterButton.blur();
  document.body.classList.add("site-entered");
  window.setTimeout(() => {
    introScreen.inert = true;
    introScreen.setAttribute("aria-hidden", "true");
  }, 850);
}

enterButton.addEventListener("click", enterSite);
window.addEventListener("resize", renderTrack);

renderSlides();
renderTrack();
updateChrome(activeIndex);

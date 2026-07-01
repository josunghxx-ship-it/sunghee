(() => {
  "use strict";

  const nav = document.getElementById("main-nav");
  const menu = document.getElementById("mobile-menu");
  const openButton = document.getElementById("hamburger");
  const closeButton = document.getElementById("close-menu");
  const menuLinks = menu.querySelectorAll(".menu-link");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastFocusedElement = null;

  const setMenuState = (isOpen) => {
    menu.classList.toggle("open", isOpen);
    menu.setAttribute("aria-hidden", String(!isOpen));
    openButton.setAttribute("aria-expanded", String(isOpen));
    openButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    document.body.classList.toggle("menu-open", isOpen);
    nav.toggleAttribute("inert", isOpen);
    main.toggleAttribute("inert", isOpen);
    footer.toggleAttribute("inert", isOpen);

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      closeButton.focus();
    } else if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  openButton.addEventListener("click", () => setMenuState(true));
  closeButton.addEventListener("click", () => setMenuState(false));
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) {
      setMenuState(false);
    }
  });

  const desktopMedia = window.matchMedia("(min-width: 961px)");
  desktopMedia.addEventListener("change", (event) => {
    if (event.matches && menu.classList.contains("open")) {
      setMenuState(false);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href").slice(1);
      if (!id) {
        event.preventDefault();
        return;
      }

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  let scrollFrameRequested = false;
  const updateNavigation = () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
    scrollFrameRequested = false;
  };

  window.addEventListener("scroll", () => {
    if (!scrollFrameRequested) {
      window.requestAnimationFrame(updateNavigation);
      scrollFrameRequested = true;
    }
  }, { passive: true });
  updateNavigation();

  const cards = document.querySelectorAll(".project-card");
  const fadeElements = document.querySelectorAll(".fade-up");

  if (!("IntersectionObserver" in window)) {
    cards[0]?.classList.add("active");
    fadeElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      cards.forEach((card) => card.classList.remove("active"));
      entry.target.classList.add("active");
    });
  }, { threshold: 0.5 });

  cards.forEach((card) => cardObserver.observe(card));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  fadeElements.forEach((element) => revealObserver.observe(element));
})();

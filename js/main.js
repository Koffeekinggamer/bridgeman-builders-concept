(function () {
  const nav = document.querySelector(".nav");
  const menuBtn = document.querySelector(".menu-btn");
  const panel = document.querySelector(".mobile-panel");

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuBtn && panel) {
    menuBtn.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        panel.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  const form = document.querySelector("#inquire-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const phone = data.get("phone") || "";
      const email = data.get("email") || "";
      const place = data.get("place") || "";
      const message = data.get("message") || "";
      const body = [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Land / place: ${place}`,
        "",
        message,
      ].join("\n");
      const mailto = `mailto:hello@bridgemanbuilders.com?subject=${encodeURIComponent(
        "Project inquiry — Bridgeman Builders"
      )}&body=${encodeURIComponent(body)}`;
      const success = document.querySelector(".form-success");
      if (success) success.classList.add("show");
      form.reset();
      window.location.href = mailto;
    });
  }

  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  document.querySelectorAll("[data-full]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = el.getAttribute("data-full") || el.querySelector("img")?.src;
      lightbox.classList.add("open");
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lightbox.classList.remove("open");
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-band]").forEach((root) => {
    const viewport = root.querySelector(".band-viewport");
    const track = root.querySelector(".band-track");
    if (!viewport || !track) return;

    const slides = [...track.children];
    if (!slides.length) return;
    slides.forEach((node) => track.appendChild(node.cloneNode(true)));

    if (reduceMotion) return;

    let current = 0;
    let target = 0;
    let vel = 0;
    let dragging = false;
    let lastPointer = 0;
    let lastTime = 0;
    let loop = 0;
    let auto = -0.28;
    let hovering = false;

    const measure = () => {
      loop = track.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);

    const wrap = () => {
      if (!loop) return;
      while (current <= -loop) {
        current += loop;
        target += loop;
      }
      while (current > 0) {
        current -= loop;
        target -= loop;
      }
    };

    const step = (dir) => {
      target += dir * Math.min(viewport.clientWidth * 0.72, 520);
      vel = dir * 18;
    };

    const prev = root.querySelector("[data-band-prev]");
    const next = root.querySelector("[data-band-next]");
    if (prev) prev.addEventListener("click", () => step(1));
    if (next) next.addEventListener("click", () => step(-1));

    root.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      root.classList.add("is-dragging");
      lastPointer = e.clientX;
      lastTime = performance.now();
      vel = 0;
      root.setPointerCapture(e.pointerId);
    });

    root.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastPointer;
      const dt = Math.max(8, now - lastTime);
      target += dx;
      vel = dx / dt * 16;
      lastPointer = e.clientX;
      lastTime = now;
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      target += vel * 8;
    };

    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);
    root.addEventListener("pointerleave", () => {
      hovering = false;
    });
    root.addEventListener("pointerenter", () => {
      hovering = true;
    });

    const tick = () => {
      if (!dragging && !hovering) target += auto;
      const follow = dragging ? 0.38 : 0.12;
      const nextPos = current + (target - current) * follow;
      vel = nextPos - current;
      current = nextPos;
      wrap();
      track.style.transform = `translate3d(${current}px, 0, 0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
})();

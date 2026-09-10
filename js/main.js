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
})();

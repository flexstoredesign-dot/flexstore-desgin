const FlextstoreEngine = (() => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll(".site-nav a");
  const year = document.querySelector("#year");
  const hero = document.querySelector(".hero");
  const heroVisual = document.querySelector(".hero-visual");
  const rocketWrap = document.querySelector(".rocket-wrap");
  const projectCards = document.querySelectorAll(".project-card");
  const projectVideos = document.querySelectorAll(".project-video");
  const posterShowcase = document.querySelector(".poster-showcase");
  const posterCards = document.querySelectorAll(".poster-card");
  const posterPreview = document.querySelector(".poster-preview");
  const posterPreviewFrame = document.querySelector(".poster-preview-frame");
  const posterPreviewImage = document.querySelector(".poster-preview-image");
  const posterPreviewLabel = document.querySelector(".poster-preview-label");
  const portfolioToggle = document.querySelector(".portfolio-preview-toggle");
  const portfolioPanel = document.querySelector(".portfolio-preview-panel");
  const portfolioIframeShell = document.querySelector(".portfolio-iframe-shell");

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreenQuery = window.matchMedia("(max-width: 767px)");

  let rafId = 0;
  let previewRect = null;
  let pointerState = { x: "50%", y: "20%" };
  const introSessionKey = "flextstoreIntroSeen";
  const introEnabled = true;

  const isReduced = () => reducedMotionQuery.matches;
  const isSmall = () => smallScreenQuery.matches;
  const canUseMotion = () => !isReduced();
  const canUseDesktopPointer = () => canUseMotion() && !isSmall();

  const initYear = () => {
    if (year) year.textContent = new Date().getFullYear();
  };

  const initHeader = () => {
    if (!menuToggle) return;
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  };

  const initRocketIntro = () => {
    if (!introEnabled || isReduced()) return;

    try {
      if (sessionStorage.getItem(introSessionKey)) return;
      sessionStorage.setItem(introSessionKey, "true");
    } catch (error) {
      // Private browsing/storage restrictions should not block the page.
    }

    const intro = document.createElement("div");
    intro.className = "rocket-intro";
    intro.setAttribute("aria-hidden", "true");

    const rocket = document.createElement("div");
    rocket.className = "intro-rocket";
    intro.appendChild(rocket);

    [
      ["12%", "76%", "18vw", "0s"],
      ["28%", "62%", "14vw", "0.12s"],
      ["46%", "42%", "20vw", "0.06s"],
      ["64%", "30%", "16vw", "0.18s"],
      ["76%", "58%", "12vw", "0.22s"]
    ].forEach(([x, y, width, delay]) => {
      const streak = document.createElement("span");
      streak.className = "intro-streak";
      streak.style.setProperty("--sx", x);
      streak.style.setProperty("--sy", y);
      streak.style.setProperty("--sw", width);
      streak.style.setProperty("--sd", delay);
      intro.appendChild(streak);
    });

    document.body.appendChild(intro);

    window.setTimeout(() => {
      intro.remove();
    }, 1800);
  };

  const schedulePointerGlow = (event) => {
    if (!canUseDesktopPointer()) return;

    pointerState = {
      x: `${Math.round((event.clientX / window.innerWidth) * 100)}%`,
      y: `${Math.round((event.clientY / window.innerHeight) * 100)}%`
    };

    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--mx", pointerState.x);
      document.documentElement.style.setProperty("--my", pointerState.y);
      rafId = 0;
    });
  };

  const initPointerEffects = () => {
    if (!canUseDesktopPointer()) return;

    window.addEventListener("pointermove", schedulePointerGlow, { passive: true });

    projectCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = `${Math.round(((event.clientX - rect.left) / rect.width) * 100)}%`;
        const y = `${Math.round(((event.clientY - rect.top) / rect.height) * 100)}%`;
        card.style.setProperty("--card-x", x);
        card.style.setProperty("--card-y", y);
      }, { passive: true });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--card-x");
        card.style.removeProperty("--card-y");
      });
    });

    if (hero && heroVisual && rocketWrap) {
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        heroVisual.style.transform = `rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
        rocketWrap.style.transform = `translateX(-50%) rotate(20deg) translate3d(${(x * 10).toFixed(1)}px, ${(y * 8).toFixed(1)}px, 0) scale(var(--rocket-scale))`;
      }, { passive: true });

      hero.addEventListener("pointerleave", () => {
        heroVisual.style.transform = "";
        rocketWrap.style.transform = "";
      });
    }
  };

  const showPosterPreview = (card) => {
    if (!posterShowcase || !posterPreview || !posterPreviewImage || !posterPreviewLabel) return;

    const poster = card.dataset.poster;
    const label = card.dataset.label;
    if (!poster || !label) return;

    posterCards.forEach((item) => item.classList.toggle("is-active", item === card));
    posterPreviewImage.src = poster;
    posterPreviewLabel.textContent = label;

    if (!isSmall() && !isReduced()) {
      posterShowcase.classList.add("preview-active");
      previewRect = posterPreviewFrame?.getBoundingClientRect() || posterPreview.getBoundingClientRect();
    }
  };

  const hidePosterPreview = () => {
    if (!posterShowcase || isSmall()) return;
    posterShowcase.classList.remove("preview-active");
    if (posterPreviewFrame) {
      posterPreviewFrame.style.removeProperty("--preview-rx");
      posterPreviewFrame.style.removeProperty("--preview-ry");
    }
  };

  const updatePreviewTilt = (event) => {
    if (!posterPreviewFrame || !posterShowcase?.classList.contains("preview-active") || !previewRect) return;

    const x = (event.clientX - previewRect.left) / previewRect.width - 0.5;
    const y = (event.clientY - previewRect.top) / previewRect.height - 0.5;

    requestAnimationFrame(() => {
      posterPreviewFrame.style.setProperty("--preview-ry", `${(x * 7).toFixed(2)}deg`);
      posterPreviewFrame.style.setProperty("--preview-rx", `${(-y * 5).toFixed(2)}deg`);
    });
  };

  const initPosterPreview = () => {
    if (!posterShowcase || !posterCards.length) return;

    posterCards.forEach((card) => {
      card.addEventListener("pointerenter", () => showPosterPreview(card), { passive: true });
      card.addEventListener("focus", () => showPosterPreview(card));
      card.addEventListener("click", () => showPosterPreview(card));
    });

    window.addEventListener("pointermove", updatePreviewTilt, { passive: true });
    posterShowcase.addEventListener("pointerleave", hidePosterPreview);
    posterShowcase.addEventListener("focusout", (event) => {
      if (!posterShowcase.contains(event.relatedTarget)) hidePosterPreview();
    });
  };

  const playVideo = (video) => {
    if (!video || !video.isConnected) return;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const pauseVideo = (video) => {
    if (!video || !video.isConnected || video.paused) return;
    video.pause();
  };

  const initVideos = () => {
    if (!projectVideos.length) return;

    projectVideos.forEach((video) => {
      const media = video.closest(".project-media");
      const poster = video.getAttribute("poster");

      video.addEventListener("canplay", () => {
        media?.classList.add("is-ready");
      }, { once: true });

      const markFailed = () => {
        if (!media) return;
        media.classList.remove("is-ready");
        media.classList.add("video-failed");
        if (poster) {
          media.style.backgroundImage = `linear-gradient(180deg, rgba(5, 7, 17, 0.1), rgba(5, 7, 17, 0.5)), url("${poster}")`;
        }
      };

      video.addEventListener("error", markFailed);
      video.querySelectorAll("source").forEach((source) => {
        source.addEventListener("error", markFailed);
      });

      pauseVideo(video);
    });

    if (!("IntersectionObserver" in window)) {
      projectVideos.forEach(playVideo);
      return;
    }

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      });
    }, {
      rootMargin: isSmall() ? "80px 0px" : "180px 0px",
      threshold: 0.18
    });

    projectVideos.forEach((video) => videoObserver.observe(video));
  };

  const initPortfolioPreview = () => {
    if (!portfolioToggle || !portfolioPanel || !portfolioIframeShell) return;

    portfolioToggle.addEventListener("click", () => {
      const isOpen = portfolioPanel.classList.toggle("is-open");
      portfolioPanel.setAttribute("aria-hidden", String(!isOpen));
      portfolioToggle.textContent = isOpen ? "Hide Drive Preview" : "Preview Drive Archive";

      if (!isOpen || portfolioIframeShell.querySelector("iframe")) return;

      const iframeSrc = portfolioToggle.dataset.iframeSrc;
      if (!iframeSrc) return;

      portfolioIframeShell.classList.remove("is-loaded");
      const iframe = document.createElement("iframe");
      iframe.src = iframeSrc;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.title = "Flextstore Design full portfolio preview";
      iframe.allow = "fullscreen";
      iframe.addEventListener("load", () => {
        portfolioIframeShell.classList.add("is-loaded");
      }, { once: true });
      portfolioIframeShell.appendChild(iframe);
    });
  };

  const initScrollAnimations = () => {
    if (!window.gsap) return;

    const gsap = window.gsap;
    const isMobile = isSmall();

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    if (isReduced()) {
      gsap.set(".site-header, .hero-badge, .hero h1, .hero-kicker, .hero-copy, .hero-actions, .hero-visual, .poster-card, .project-card, .portfolio-card, .archive-card, .service-card, .process-step, .why-content, .astronaut-visual, .final-cta", {
        opacity: 1,
        y: 0,
        clearProps: "transform"
      });
      return;
    }

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".site-header", { opacity: 0, y: -12, duration: 0.42 })
      .from(".hero-badge", { opacity: 0, y: 14, duration: 0.42 })
      .from(".hero h1", { opacity: 0, y: isMobile ? 18 : 30, filter: isMobile ? "none" : "blur(6px)", duration: isMobile ? 0.5 : 0.68 }, "-=0.16")
      .from(".hero-kicker, .hero-copy", { opacity: 0, y: 16, duration: 0.48, stagger: 0.08 }, "-=0.18")
      .from(".hero-actions .btn", { opacity: 0, y: 14, duration: 0.4, stagger: 0.07 }, "-=0.18")
      .from(".hero-visual", { opacity: 0, scale: isMobile ? 0.97 : 0.92, duration: isMobile ? 0.5 : 0.76 }, "-=0.5");

    const revealGroup = (selector, trigger, options = {}) => {
      if (!window.ScrollTrigger) return;
      gsap.from(selector, {
        scrollTrigger: {
          trigger,
          start: "top 80%",
          once: true
        },
        opacity: 0,
        y: isMobile ? 16 : 30,
        filter: isMobile ? "none" : "blur(4px)",
        duration: isMobile ? 0.42 : 0.58,
        stagger: isMobile ? 0.04 : 0.07,
        ease: "power3.out",
        ...options
      });
    };

    revealGroup(".poster-card", ".projects", { y: isMobile ? 12 : 20 });
    revealGroup(".project-card", ".projects");
    revealGroup(".portfolio-card, .archive-card", ".portfolio");
    revealGroup(".service-card", ".services");
    revealGroup(".process-step", ".process", { y: 24 });
    revealGroup(".why-content, .astronaut-visual", ".why", { stagger: 0.12 });
    revealGroup(".final-cta", ".final-cta");

    if (!isMobile) {
      gsap.to(".orbit-one", { rotate: 340, duration: 78, repeat: -1, ease: "none" });
      gsap.to(".orbit-two", { rotate: -332, duration: 96, repeat: -1, ease: "none" });
      gsap.to(".orbit-three", { rotate: 420, duration: 118, repeat: -1, ease: "none" });
      gsap.to(".orbit-four", { rotate: -300, duration: 136, repeat: -1, ease: "none" });
      gsap.to(".hero-nebula", { scale: 1.03, opacity: 0.78, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  };

  const init = () => {
    initYear();
    initRocketIntro();
    initHeader();
    initPointerEffects();
    initPosterPreview();
    initVideos();
    initPortfolioPreview();
    window.addEventListener("load", initScrollAnimations, { once: true });
  };

  return { init };
})();

FlextstoreEngine.init();

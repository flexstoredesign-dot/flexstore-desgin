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
  const langButtons = document.querySelectorAll(".lang-button");
  const metaDescription = document.querySelector('meta[name="description"]');

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreenQuery = window.matchMedia("(max-width: 767px)");

  let rafId = 0;
  let previewRect = null;
  let pointerState = { x: "50%", y: "20%" };
  let currentLanguage = "pl";
  const introSessionKey = "flextstoreIntroSeen";
  const languageStorageKey = "flextstoreLanguage";
  const introEnabled = true;

  const translations = {
    pl: {
      pageTitle: "Flextstore Design | Strony internetowe premium i sklepy Shopify",
      metaDescription: "Flextstore Design tworzy nowoczesne strony internetowe i sklepy Shopify dla marek, które chcą wyglądać profesjonalnie i sprzedawać skuteczniej.",
      navHome: "Start",
      navWork: "Realizacje",
      navServices: "Usługi",
      navProcess: "Proces",
      navContact: "Kontakt",
      whatsappShort: "WhatsApp",
      whatsappLong: "Napisz na WhatsApp",
      instagramHandle: "@flextstore.design",
      heroBadge: "PROJEKTUJEMY • TY ROŚNIESZ",
      heroTitle: '<span class="text-cyan">Strony internetowe premium</span> &amp;<br><span class="text-gradient">sklepy Shopify</span>',
      heroKicker: "Nowoczesne. Indywidualne. Nastawione na sprzedaż.",
      heroCopy: "Flextstore Design tworzy nowoczesne strony internetowe i sklepy Shopify dla marek, które chcą wyglądać profesjonalnie, działać szybciej i sprzedawać skuteczniej.",
      heroPrimary: "Zobacz projekty",
      launchCard: "Wysyłamy marki ponad limity",
      scrollExplore: "Przewiń dalej",
      projectsLabel: "NASZE REALIZACJE",
      projectsTitle: "Wybrane projekty",
      projectsSubtitle: "Realizacje dla marek, które chcą wyglądać lepiej i sprzedawać skuteczniej.",
      project1Title: "Strona dla psychologa",
      project1Type: "Strona usługowa",
      project1Badge: "Profesjonalny wizerunek online",
      project2Title: "Sklep Shopify",
      project2Type: "Projekt i wdrożenie Shopify",
      project2Badge: "Gotowy do sprzedaży",
      project3Title: "Strona Shopify",
      project3Type: "Shopify e-commerce development",
      project3Badge: "Optymalizacja konwersji",
      project4Title: "Sklep marki Shopify",
      project4Type: "Shopify store development",
      project4Badge: "Szybki, nowoczesny i skalowalny",
      poster1Alt: "Strona dla psychologa poster",
      poster2Alt: "Sklep Shopify poster",
      poster3Alt: "Strona Shopify poster",
      poster4Alt: "Sklep marki Shopify poster",
      project1PreviewAlt: "Strona dla psychologa preview",
      project2PreviewAlt: "Sklep Shopify preview",
      project3PreviewAlt: "Strona Shopify preview",
      project4PreviewAlt: "Sklep marki Shopify preview",
      previewLoading: "Ładowanie podglądu",
      shopifyPreview: "Podgląd Shopify",
      brandPreview: "Podgląd marki",
      portfolioLabel: "PORTFOLIO",
      portfolioTitle: "Pełne portfolio",
      portfolioSubtitle: "Zobacz wybrane sklepy Shopify, strony internetowe i dodatkowe realizacje w rozszerzonym archiwum.",
      portfolioButton: "Zobacz pełne portfolio",
      portfolioPreviewClosed: "Podgląd archiwum",
      portfolioPreviewOpen: "Ukryj podgląd",
      archive1Title: "Sklepy Shopify",
      archive1Subtitle: "Sklepy internetowe i storefronty Shopify",
      archive2Title: "Strony custom",
      archive2Subtitle: "Nowoczesne strony kodowane indywidualnie",
      archive3Title: "Strony usługowe",
      archive3Subtitle: "Psycholodzy, lokalne firmy i marki usługowe",
      archive4Title: "Inspiracje wizualne",
      archive4Subtitle: "Moodboardy, layouty i kierunki wizualne",
      drivePreviewTitle: "Podgląd portfolio Google Drive",
      driveOpen: "Otwórz w Google Drive",
      driveLoading: "Ładowanie archiwum portfolio...",
      driveNote: "Podgląd Google Drive może pokazywać domyślne ikony folderów. Dla najlepszego efektu otwórz pełne portfolio.",
      driveFallback: "Jeśli podgląd się nie załaduje, otwórz pełne portfolio w Google Drive.",
      servicesLabel: "USŁUGI",
      servicesTitle: "Co tworzę",
      service1Title: "Projektowanie stron custom",
      service1Text: "Indywidualne strony dopasowane do marki, celu i odbiorców.",
      service2Title: "Projektowanie sklepów Shopify",
      service2Text: "Sklepy budowane pod zaufanie, przejrzystość i sprzedaż.",
      service3Title: "E-commerce development",
      service3Text: "Wdrożenia z dopracowaną strukturą produktów, kolekcji i ścieżek zakupowych.",
      service4Title: "UI/UX design",
      service4Text: "Przejrzyste doświadczenia, które prowadzą użytkownika do działania.",
      service5Title: "Optymalizacja szybkości i SEO",
      service5Text: "Szybsze, czytelne i lepiej przygotowane technicznie strony.",
      service6Title: "Stałe wsparcie",
      service6Text: "Rozwój, poprawki i konsultacje po publikacji projektu.",
      processLabel: "PROCES",
      processTitle: "Jak wygląda współpraca",
      process1Title: "Analiza",
      process1Text: "Poznajemy cele, markę i kierunek projektu.",
      process2Title: "Plan",
      process2Text: "Układamy strukturę, treści i strategię konwersji.",
      process3Title: "Projekt",
      process3Text: "Tworzymy dopracowany system wizualny dopasowany do marki.",
      process4Title: "Wdrożenie",
      process4Text: "Kodujemy szybkie, responsywne i skalowalne doświadczenie.",
      process5Title: "Publikacja",
      process5Text: "Testujemy, dopracowujemy i pomagamy wystartować bez chaosu.",
      whyLabel: "DLACZEGO MY",
      whyTitle: "Dlaczego Flextstore Design?",
      why1: "Indywidualne projekty premium",
      why2: "Podejście nastawione na konwersję",
      why3: "Szybka realizacja",
      why4: "Przejrzysta komunikacja",
      why5: "Bezpieczny i uporządkowany proces",
      why6: "Shopify + custom code",
      ctaLabel: "GOTOWY NA START?",
      ctaTitle: "Zbudujmy coś <span>wyjątkowego</span>",
      ctaText: "Profesjonalna strona to nie koszt. To inwestycja w wizerunek i rozwój Twojej marki.",
      footerInstagram: "Instagram",
      footerPortfolio: "Pełne portfolio",
      footerCopyright: "© 2026 Flextstore Design. Wszelkie prawa zastrzeżone."
    },
    en: {
      pageTitle: "Flextstore Design | Premium Websites & Shopify Stores",
      metaDescription: "Flextstore Design creates premium custom websites and Shopify stores for ambitious brands, built for performance, conversion and scale.",
      navHome: "Home",
      navWork: "Work",
      navServices: "Services",
      navProcess: "Process",
      navContact: "Contact",
      whatsappShort: "WhatsApp",
      whatsappLong: "Message on WhatsApp",
      instagramHandle: "@flextstore.design",
      heroBadge: "WE DESIGN • YOU GROW",
      heroTitle: 'Premium <span class="text-cyan">Websites</span> &amp;<br><span class="text-gradient">Shopify Stores</span>',
      heroKicker: "Modern. Custom. High Converting.",
      heroCopy: "Flextstore Design creates premium websites and Shopify stores for ambitious brands. Built for performance. Designed to convert. Made to scale.",
      heroPrimary: "View Projects",
      launchCard: "Launching brands beyond limits",
      scrollExplore: "Scroll to explore",
      projectsLabel: "Our Work",
      projectsTitle: "Selected Projects",
      projectsSubtitle: "Real results for brands that aim higher.",
      project1Title: "Psychologist Website",
      project1Type: "Custom Website",
      project1Badge: "Premium service website",
      project2Title: "Shopify Store",
      project2Type: "Shopify Design & Development",
      project2Badge: "E-commerce ready to sell",
      project3Title: "Shopify Website",
      project3Type: "Shopify E-commerce Development",
      project3Badge: "Optimized for conversions",
      project4Title: "Shopify Brand Store",
      project4Type: "Shopify Store Development",
      project4Badge: "Fast, modern and scalable",
      poster1Alt: "Psychologist Website poster",
      poster2Alt: "Shopify Store poster",
      poster3Alt: "Shopify Website poster",
      poster4Alt: "Shopify Brand Store poster",
      project1PreviewAlt: "Psychologist Website preview",
      project2PreviewAlt: "Shopify Store preview",
      project3PreviewAlt: "Shopify Website preview",
      project4PreviewAlt: "Shopify Brand Store preview",
      previewLoading: "Preview Loading",
      shopifyPreview: "Shopify Preview",
      brandPreview: "Brand Preview",
      portfolioLabel: "Portfolio",
      portfolioTitle: "Full Portfolio Archive",
      portfolioSubtitle: "Explore selected Shopify stores, custom websites and visual references in one expanded portfolio archive.",
      portfolioButton: "View Full Portfolio",
      portfolioPreviewClosed: "Preview Drive Archive",
      portfolioPreviewOpen: "Hide Drive Preview",
      archive1Title: "Shopify Stores",
      archive1Subtitle: "E-commerce builds and Shopify storefronts",
      archive2Title: "Custom Websites",
      archive2Subtitle: "Premium coded websites and landing pages",
      archive3Title: "Service Websites",
      archive3Subtitle: "Psychologists, local businesses and service brands",
      archive4Title: "Visual References",
      archive4Subtitle: "Moodboards, layouts and selected visual direction",
      drivePreviewTitle: "Google Drive Portfolio Preview",
      driveOpen: "Open in Google Drive",
      driveLoading: "Loading portfolio archive...",
      driveNote: "Google Drive preview may display default folder icons. For the best experience, open the full portfolio.",
      driveFallback: "If the preview does not load, open the full portfolio in Google Drive.",
      servicesLabel: "Services",
      servicesTitle: "What We Do",
      service1Title: "Custom Website Design",
      service1Text: "Distinctive interfaces shaped around your brand, goals and audience.",
      service2Title: "Shopify Store Design",
      service2Text: "Premium storefronts crafted for trust, clarity and conversion.",
      service3Title: "E-commerce Development",
      service3Text: "Clean builds with product flows, collections and checkout paths that sell.",
      service4Title: "UI/UX Design",
      service4Text: "Polished journeys that make every interaction feel intentional.",
      service5Title: "Speed & SEO Optimization",
      service5Text: "Fast, discoverable pages with technical fundamentals handled properly.",
      service6Title: "Ongoing Support",
      service6Text: "Reliable improvements, fixes and guidance after launch.",
      processLabel: "Our Process",
      processTitle: "Our Proven Process",
      process1Title: "Discover",
      process1Text: "We define your goals, market and launch direction.",
      process2Title: "Plan",
      process2Text: "We map the structure, content and conversion strategy.",
      process3Title: "Design",
      process3Text: "We create a premium visual system that fits your brand.",
      process4Title: "Develop",
      process4Text: "We build a clean, responsive and scalable experience.",
      process5Title: "Launch",
      process5Text: "We test, polish and help your site go live with confidence.",
      whyLabel: "Why Choose Us",
      whyTitle: "Why Flextstore Design?",
      why1: "Premium & custom solutions",
      why2: "Conversion-focused approach",
      why3: "Fast delivery",
      why4: "Transparent communication",
      why5: "Safe and structured workflow",
      why6: "Shopify + custom code expertise",
      ctaLabel: "Ready to launch?",
      ctaTitle: "Let's Build Something <span>Extraordinary</span>",
      ctaText: "A premium website is not just an expense. It is an investment in your brand's future.",
      footerInstagram: "Instagram",
      footerPortfolio: "Full Portfolio",
      footerCopyright: "© 2026 Flextstore Design. All rights reserved."
    }
  };

  const isReduced = () => reducedMotionQuery.matches;
  const isSmall = () => smallScreenQuery.matches;
  const canUseMotion = () => !isReduced();
  const canUseDesktopPointer = () => canUseMotion() && !isSmall();

  const getCopy = (key, lang = currentLanguage) => translations[lang]?.[key] || translations.pl[key] || "";

  const applyLanguage = (lang) => {
    const nextLanguage = translations[lang] ? lang : "pl";
    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage;
    document.title = getCopy("pageTitle", nextLanguage);
    if (metaDescription) metaDescription.setAttribute("content", getCopy("metaDescription", nextLanguage));

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getCopy(element.dataset.i18n, nextLanguage);
      if (value) element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const value = getCopy(element.dataset.i18nHtml, nextLanguage);
      if (value) element.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      element.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((item) => item.trim());
        const value = getCopy(key, nextLanguage);
        if (attr && value) element.setAttribute(attr, value);
      });
    });

    langButtons.forEach((button) => {
      const isActive = button.dataset.lang === nextLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (portfolioToggle && portfolioPanel) {
      const isOpen = portfolioPanel.classList.contains("is-open");
      portfolioToggle.textContent = getCopy(isOpen ? "portfolioPreviewOpen" : "portfolioPreviewClosed", nextLanguage);
    }

    const activePoster = document.querySelector(".poster-card.is-active");
    if (activePoster && posterPreviewLabel) posterPreviewLabel.textContent = activePoster.dataset.label || "";
  };

  const initLanguage = () => {
    let savedLanguage = "pl";
    try {
      savedLanguage = localStorage.getItem(languageStorageKey) || "pl";
    } catch (error) {
      savedLanguage = "pl";
    }

    applyLanguage(savedLanguage);

    langButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextLanguage = button.dataset.lang || "pl";
        applyLanguage(nextLanguage);
        try {
          localStorage.setItem(languageStorageKey, nextLanguage);
        } catch (error) {
          // Storage availability should not affect language switching.
        }
      });
    });
  };

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
      portfolioToggle.textContent = getCopy(isOpen ? "portfolioPreviewOpen" : "portfolioPreviewClosed");

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
    initLanguage();
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

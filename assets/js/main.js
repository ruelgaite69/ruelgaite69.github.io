/* ============================================================
   Ruel B. Gaite — Portfolio interactions
   No dependencies. Vanilla JS only.
   ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ==========================================================
     1. Sticky nav + mobile menu
     ========================================================== */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", function () {
    const open = navLinks.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ==========================================================
     2. Scrollspy — highlight active nav link
     ========================================================== */
  const spySections = ["home", "about", "skills", "projects", "experience", "contact"];
  const spyLinks = {};
  document.querySelectorAll(".nav-link").forEach(function (link) {
    spyLinks[link.getAttribute("href").slice(1)] = link;
  });

  const spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.values(spyLinks).forEach(function (l) {
          l.classList.remove("is-active");
        });
        const link = spyLinks[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  spySections.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });

  /* ==========================================================
     3. Reveal on scroll
     ========================================================== */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(function (el) {
    if (prefersReducedMotion) el.classList.add("is-revealed");
    else revealObserver.observe(el);
  });

  /* ==========================================================
     4. Hero terminal — typewriter sequence
     ========================================================== */
  const terminalLines = document.getElementById("terminalLines");
  const caretLine = document.querySelector(".t-caret-line");

  // Script of lines to type after the static intro
  const script = [
    { type: "cmd", text: "ls ./stack" },
    { type: "out", text: "python  typescript  js  php  sql  supabase  node" },
    { type: "cmd", text: "cat about.txt" },
    { type: "out", text: "I build practical, modern web apps" },
    { type: "out", text: "that solve real-world problems." },
    { type: "cmd", text: "git push origin career" },
    { type: "ok", text: "committed to continuous learning" },
  ];

  function typeTerminal() {
    if (prefersReducedMotion) return; // keep the static intro only

    let li = 0;
    let ci = 0;

    function typeChar() {
      if (li >= script.length) return;

      const line = script[li];

      if (ci === 0) {
        const p = document.createElement("p");
        p.className = "t-line";
        if (line.type === "cmd") {
          p.innerHTML = '<span class="t-prompt">$</span> <span class="t-cmd"></span>';
        } else if (line.type === "ok") {
          p.innerHTML = '<span class="t-prompt">\u2713</span> <span class="t-out ok-out"></span>';
        } else {
          p.innerHTML = '<span class="t-out"></span>';
        }
        terminalLines.appendChild(p);
      }

      const target = terminalLines.lastElementChild.querySelector("span:last-child");
      const text = line.text;
      target.textContent = text.slice(0, ci + 1);
      ci++;

      if (ci < text.length) {
        setTimeout(typeChar, 28 + Math.random() * 40);
      } else {
        ci = 0;
        li++;
        setTimeout(typeChar, 260);
      }
    }

    // Start after a short beat so the hero has settled
    setTimeout(typeChar, 900);
  }

  // Move caret line after the typed block so it always sits at the "cursor"
  if (caretLine) typeTerminal();

  /* ==========================================================
     5. Project shots — subtle 3D tilt (desktop only)
     ========================================================== */
  if (finePointer && !prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (shot) {
      const browser = shot.querySelector(".browser");
      if (!browser) return;

      shot.addEventListener("mousemove", function (e) {
        const rect = shot.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        browser.style.setProperty("--tiltY", px * 5 + "deg");
        browser.style.setProperty("--tiltX", py * -5 + "deg");
      });
      shot.addEventListener("mouseleave", function () {
        browser.style.setProperty("--tiltY", "0deg");
        browser.style.setProperty("--tiltX", "0deg");
      });
    });
  }

  /* ==========================================================
     5b. Project screenshots — gallery + lightbox
     ----------------------------------------------------------
     Each project keeps its real screenshots in its own folder
     (assets/img/clinictooth/, assets/img/rsg/) named 1.png…4.png.
     Missing files are hidden automatically — no code changes needed.
     ========================================================== */
  const lightbox = (function () {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Project screenshot preview");
    box.innerHTML =
      '<button class="lightbox-btn lightbox-close" type="button" aria-label="Close preview">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      "</button>" +
      '<button class="lightbox-btn lightbox-prev" type="button" aria-label="Previous screenshot">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>' +
      "</button>" +
      '<button class="lightbox-btn lightbox-next" type="button" aria-label="Next screenshot">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>' +
      "</button>" +
      '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" alt="" />' +
      '<figcaption class="lightbox-caption"><span class="lb-name"></span><span class="lb-count"></span></figcaption>' +
      "</figure>";
    document.body.appendChild(box);

    const img = box.querySelector(".lightbox-img");
    const name = box.querySelector(".lb-name");
    const count = box.querySelector(".lb-count");
    let images = [];
    let title = "";
    let index = 0;
    let open = false;
    let lastFocus = null;
    let swapTimer = null;

    function render() {
      if (!images.length) return;
      index = (index + images.length) % images.length;
      const item = images[index];
      name.textContent = title;
      count.textContent = "Screenshot " + (index + 1) + " / " + images.length;
      img.alt = (title ? title + " — " : "") + "screenshot " + (index + 1) + " of " + images.length;

      const apply = function () {
        img.src = item.src;
        img.classList.remove("is-swapping");
      };
      if (!img.src) {
        apply();
        return;
      }
      // Smooth crossfade when cycling
      img.classList.add("is-swapping");
      window.clearTimeout(swapTimer);
      swapTimer = window.setTimeout(apply, 120);
    }

    function show(list, start, projectTitle, returnTo) {
      images = list;
      title = projectTitle || "";
      index = start || 0;
      render();
      lastFocus = returnTo && returnTo.focus ? returnTo : box.querySelector(".lightbox-close");
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      open = true;
      box.querySelector(".lightbox-close").focus();
    }

    function close() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      open = false;
      window.clearTimeout(swapTimer);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    box.querySelector(".lightbox-close").addEventListener("click", close);
    box.querySelector(".lightbox-prev").addEventListener("click", function () {
      index--;
      render();
    });
    box.querySelector(".lightbox-next").addEventListener("click", function () {
      index++;
      render();
    });
    // Keep Tab cycling inside the dialog while it's open
    box.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      const buttons = box.querySelectorAll("button");
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") {
        index--;
        render();
      } else if (e.key === "ArrowRight") {
        index++;
        render();
      }
    });

    return { show: show, close: close };
  })();

  document.querySelectorAll(".project-media").forEach(function (media) {
    const body = media.querySelector(".browser-body");
    const main = media.querySelector(".shot-main");
    const empty = media.querySelector(".shot-empty");
    const expand = media.querySelector(".shot-expand");
    // The title lives in the sibling .project-body, not inside .project-media
    const project = media.closest(".project");
    const titleEl = project && project.querySelector(".project-title");
    const projectTitle = titleEl ? titleEl.textContent.trim() : "";
    const extraShots = body && body.getAttribute("data-shots")
      ? body.getAttribute("data-shots")
          .split(",")
          .map(function (s) { return s.trim(); })
          .filter(Boolean)
      : [];

    // Loaded screenshots, in order: primary first, then data-shots.
    let images = [];
    let current = 0;
    let settled = false;

    function register(src) {
      if (!images.some(function (im) { return im.src === src; })) {
        images.push({ src: src });
      }
    }

    function finish() {
      if (settled) return;
      settled = true;
      const hasImages = images.length > 0;
      if (body) body.classList.toggle("is-empty", !hasImages);

      // If the primary file is missing, promote the first available shot.
      if (main && hasImages && main.classList.contains("is-missing")) {
        main.src = images[0].src;
        main.alt = projectTitle + " screenshot";
        main.classList.remove("is-missing");
        main.classList.add("is-loaded");
      }

      if (expand) {
        if (hasImages) {
          const n = images.length;
          const label = "View " + n + (n === 1 ? " screenshot" : " screenshots");
          expand.setAttribute("aria-label", projectTitle + " — " + label);
          expand.innerHTML =
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>' +
            label;
        } else {
          expand.style.display = "none";
        }
      }
    }

    function resolveMain() {
      if (!main) return;
      if (!main.complete) return; // still loading — wait for the event
      if (!main.classList.contains("is-missing") && main.naturalWidth > 0) {
        main.classList.add("is-loaded");
        register(main.src);
        if (empty) empty.style.display = "none";
      }
      done();
    }

    // Probe every screenshot in data-shots (including the primary) so the
    // lightbox lists all real files even before the lazy <img> has loaded.
    // register() dedupes by resolved URL, so probing the primary is harmless.
    const probes = extraShots;
    let toResolve = (main ? 1 : 0) + probes.length;

    function done() {
      toResolve--;
      if (toResolve === 0) finish();
    }

    probes.forEach(function (src) {
      const probe = new Image();
      probe.onload = function () {
        // Use probe.src (resolved URL) so the main image and this probe
        // produce identical src strings and register() can dedupe them.
        register(probe.src);
        done();
      };
      probe.onerror = function () {
        done();
      };
      probe.src = src;
    });

    if (main) {
      main.addEventListener("load", resolveMain);
      main.addEventListener("error", resolveMain);
      resolveMain(); // completes immediately if already loaded/cached
    }
    if (toResolve === 0) finish();

    // Safety net: settle with whatever has loaded if a probe stalls.
    window.setTimeout(function () {
      if (!settled) finish();
    }, 3000);

    function openAt(i) {
      if (!images.length) return;
      current = (i + images.length) % images.length;
      lightbox.show(images, current, projectTitle, expand || null);
    }

    if (expand) {
      expand.addEventListener("click", function () {
        openAt(current);
      });
    }
    if (body) {
      body.addEventListener("click", function (e) {
        if (e.target === body || e.target === main || e.target.closest(".shot-empty")) {
          openAt(current);
        }
      });
    }
  });

  /* ==========================================================
     5d. Profile photos (About card + hero avatar) — fade in
     once the file exists
     ========================================================== */
  document.querySelectorAll(".profile-img, .hero-avatar-img").forEach(function (img) {
    if (img.classList.contains("is-missing")) return;
    const show = function () {
      img.classList.add("is-loaded");
    };
    // Already loaded (cache / fast path) — apply immediately
    if (img.complete && img.naturalWidth > 0) {
      show();
    } else {
      img.addEventListener("load", show);
    }
  });

  /* ==========================================================
     6. Contact form — mailto composition
     ========================================================== */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      // Lightweight validation
      if (!name || !email || !message) {
        form.querySelector(".form-note").textContent =
          "Please fill in all fields before sending.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.querySelector(".form-note").textContent =
          "That email address doesn't look right — please check it.";
        return;
      }

      const subject = encodeURIComponent("Portfolio inquiry from " + name);
      const body = encodeURIComponent(
        "Hi Ruel,\n\n" + message + "\n\n— " + name + " (" + email + ")"
      );
      window.location.href =
        "mailto:ruelgaite@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  /* ==========================================================
     7. GitHub — live API with honest fallback
     ========================================================== */
  const GH_USER = "ruelgaite69";
  const GITHUB_PROFILE = "https://github.com/" + GH_USER;
  const gh = {
    avatar: document.getElementById("ghAvatar"),
    name: document.getElementById("ghName"),
    handle: document.getElementById("ghHandle"),
    bio: document.getElementById("ghBio"),
    repos: document.getElementById("ghRepos"),
    followers: document.getElementById("ghFollowers"),
    following: document.getElementById("ghFollowing"),
    grid: document.getElementById("repoGrid"),
    langs: document.getElementById("ghLangs"),
    langsBars: document.getElementById("langsBars"),
    note: document.getElementById("ghNote"),
  };

  const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    PHP: "#4f5d95",
    HTML: "#e34c26",
    CSS: "#563d7c",
    SQL: "#e38c00",
    Shell: "#89e051",
    "Jupyter Notebook": "#da5b0b",
    C: "#555555",
    "C++": "#f34b7d",
    Java: "#b07219",
    Go: "#00add8",
    Rust: "#dea584",
    "C#": "#178600",
    Dart: "#00b4ab",
  };

  function langColor(lang) {
    return LANG_COLORS[lang] || "#8b8b9c";
  }

  function ghIcon(kind) {
    if (kind === "star") {
      return '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>';
  }

  function renderRepoCard(repo) {
    const card = document.createElement("a");
    card.className = "repo-card";
    card.href = repo.html_url;
    card.target = "_blank";
    card.rel = "noopener";

    const lang = repo.language;
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;

    card.innerHTML =
      '<div class="repo-head">' +
      '<span class="repo-name">' +
      escapeHtml(repo.name) +
      "</span>" +
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
      "</div>" +
      '<p class="repo-desc">' +
      escapeHtml(repo.description || "No description provided.") +
      "</p>" +
      '<div class="repo-meta">' +
      (lang
        ? '<span><i class="dot" style="--c:' +
          langColor(lang) +
          '"></i>' +
          escapeHtml(lang) +
          "</span>"
        : "") +
      '<span>' + ghIcon("star") + stars + "</span>" +
      '<span>' + ghIcon("fork") + forks + "</span>" +
      "</div>";

    return card;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderSoonCard(title, desc) {
    const card = document.createElement("div");
    card.className = "repo-card is-soon";
    card.innerHTML =
      '<span class="repo-soon-badge">coming soon</span>' +
      '<span class="repo-soon-name">' + title + "</span>" +
      '<span class="repo-soon-desc">' + desc + "</span>";
    return card;
  }

  function renderLanguages(repos) {
    const counts = {};
    repos.forEach(function (r) {
      if (!r.language) return;
      counts[r.language] = (counts[r.language] || 0) + 1;
    });
    const total = Object.values(counts).reduce(function (a, b) {
      return a + b;
    }, 0);
    if (!total) return;

    gh.langs.hidden = false;
    gh.langsBars.innerHTML = "";

    Object.keys(counts)
      .sort(function (a, b) {
        return counts[b] - counts[a];
      })
      .slice(0, 5)
      .forEach(function (lang) {
        const pct = Math.round((counts[lang] / total) * 100);
        const row = document.createElement("div");
        row.className = "lang-item";
        row.innerHTML =
          '<span class="lang-name">' + escapeHtml(lang) + "</span>" +
          '<span class="lang-track"><span class="lang-fill" style="--lc:' +
          langColor(lang) +
          '"></span></span>' +
          '<span class="lang-pct">' + pct + "%</span>";
        gh.langsBars.appendChild(row);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            row.querySelector(".lang-fill").style.width = pct + "%";
          });
        });
      });
  }

  function renderSoonProjects() {
    gh.grid.appendChild(renderSoonCard("ClinicTooth", "Dental health management system for the Cavite Dental Chapter Organization."));
    gh.grid.appendChild(renderSoonCard("RSG Inventory Management System", "Web-based inventory management platform for construction heavy equipment trading & services."));
  }

  function renderFallback() {
    gh.grid.innerHTML = "";
    renderSoonProjects();
    gh.note.textContent =
      "Live GitHub data couldn't be loaded right now. This section connects automatically " +
      "once the API responds — meanwhile, here's what's on the way.";
  }

  async function loadGitHub() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch("https://api.github.com/users/" + GH_USER),
        fetch(
          "https://api.github.com/users/" +
            GH_USER +
            "/repos?sort=updated&per_page=6&type=public"
        ),
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API unavailable");

      const user = await userRes.json();
      const repos = await reposRes.json();

      // Profile
      gh.name.textContent = user.name || "Ruel B. Gaite";
      gh.handle.textContent = "@" + user.login;
      gh.bio.textContent =
        user.bio || "IT Developer · Building practical web apps, management systems, and tools.";
      gh.repos.textContent = user.public_repos;
      gh.followers.textContent = user.followers;
      gh.following.textContent = user.following;
      if (user.avatar_url) {
        const img = document.createElement("img");
        img.src = user.avatar_url;
        img.alt = "GitHub avatar for " + user.login;
        img.loading = "lazy";
        gh.avatar.textContent = "";
        gh.avatar.appendChild(img);
      }

      // Repos
      gh.grid.innerHTML = "";
      if (repos.length) {
        repos.forEach(function (repo) {
          gh.grid.appendChild(renderRepoCard(repo));
        });
        renderLanguages(repos);
        gh.note.textContent =
          "Live data from the GitHub API. Pushed repositories appear here automatically.";
      } else {
        // Account exists but no public repos yet — honest "on the way" state.
        renderSoonProjects();
        gh.note.textContent =
          "The profile is real — public repositories are on the way. This section updates " +
          "automatically the moment code is pushed.";
      }
    } catch (err) {
      renderFallback();
    }
  }
  loadGitHub();
})();

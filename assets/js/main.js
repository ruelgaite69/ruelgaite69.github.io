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
     5b. Project screenshots — auto-detect real images
     ========================================================== */
  function showShot(img) {
    img.classList.add("is-loaded");
    const shot = img.closest(".project-shot");
    const tag = shot && shot.querySelector(".shot-tag");
    if (tag) tag.textContent = "Live screenshot";
  }

  document.querySelectorAll(".project-img").forEach(function (img) {
    if (img.classList.contains("is-missing")) return;
    // Already loaded (cache / fast path) — apply immediately
    if (img.complete && img.naturalWidth > 0) {
      showShot(img);
    } else {
      img.addEventListener("load", function () {
        showShot(img);
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
  const GITHUB_PROFILE = "https://github.com/" + GH_USER;  /* ==========================================================
     5c. Project card links — fill PROJECT_LINKS in once
     repositories are public (or a live demo exists). Until then:
     • repo stays empty → button links to your GitHub profile
     • demo stays empty → Live Demo button is not rendered
     No dead links, no fake buttons.
     ========================================================== */
  const PROJECT_LINKS = {
    clinictooth: {
      repo: "", // e.g. "https://github.com/ruelgaite69/clinictooth"
      demo: "", // e.g. "https://clinictooth.app"
    },
    starkson: {
      repo: "", // e.g. "https://github.com/ruelgaite69/starkson-website"
      demo: "", // e.g. "https://starkson-packaging.com"
    },
    loonadev: {
      repo: "", // e.g. "https://github.com/ruelgaite69/loonadev"
      demo: "", // e.g. "https://loonadev.com"
    },
  };

  function applyProjectLinks() {
    document.querySelectorAll(".project[data-project]").forEach(function (project) {
      const key = project.dataset.project;
      const links = PROJECT_LINKS[key] || {};
      const actions = project.querySelector(".project-actions");
      if (!actions) return;

      const repoBtn = actions.querySelector(".btn-primary");
      if (repoBtn) repoBtn.href = links.repo || GITHUB_PROFILE;

      // Live Demo — only rendered when a URL is configured
      if (links.demo) {
        const demo = document.createElement("a");
        demo.className = "btn btn-ghost btn-sm";
        demo.href = links.demo;
        demo.target = "_blank";
        demo.rel = "noopener";
        demo.innerHTML =
          '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
          "Live Demo";
        if (repoBtn) repoBtn.insertAdjacentElement("afterend", demo);
        else actions.appendChild(demo);
      }

      // Drop the "on request" note once a real repository is linked
      const note = project.querySelector(".project-note");
      if (note && links.repo) note.remove();
    });
  }
  applyProjectLinks();
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

  function renderFallback() {
    gh.grid.innerHTML = "";
    gh.grid.appendChild(renderSoonCard("ClinicTooth", "Dental health management system for the Cavite Dental Chapter Organization."));
    gh.grid.appendChild(renderSoonCard("Starkson Packaging Website", "Company website developed during my internship at Starkson Packaging Inc."));
    gh.grid.appendChild(renderSoonCard("LoonaDev Projects", "Websites, web applications, and SaaS-oriented solutions built under LoonaDev."));
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
        gh.grid.appendChild(renderSoonCard("ClinicTooth", "Dental health management system for the Cavite Dental Chapter Organization."));
        gh.grid.appendChild(renderSoonCard("Starkson Packaging Website", "Company website developed during my internship at Starkson Packaging Inc."));
        gh.grid.appendChild(renderSoonCard("LoonaDev Projects", "Websites, web applications, and SaaS-oriented solutions built under LoonaDev."));
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

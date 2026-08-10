# Ruel B. Gaite — Portfolio

A premium, dark-themed developer portfolio built with **plain HTML, CSS, and JavaScript** —
no frameworks, no build step, no dependencies. Static by design, so it deploys anywhere and
loads fast.

**[ruelgaite69.github.io](https://ruelgaite69.github.io)** · GitHub: [ruelgaite69](https://github.com/ruelgaite69) · Email: ruelgaite@gmail.com

---

## ✨ Features

- Sticky navigation with scrollspy, smooth scrolling, and a mobile hamburger menu
- Animated terminal hero with a typewriter effect
- Scroll-reveal animations, subtle 3D tilt on project cards, ambient background glows
- Live GitHub section — pulls real profile stats and repositories from the GitHub API
  (with an honest, graceful fallback when the API is unavailable or repos aren't public yet)
- Project cards that auto-detect real screenshots (see [assets/img/README.md](assets/img/README.md))
- Fully responsive: desktop, laptop, tablet, and mobile
- Accessible: semantic markup, skip link, `aria` labels, `prefers-reduced-motion` support

## 📁 Project structure

```
.
├── index.html          # Single-page site (all sections)
├── assets/
│   ├── css/styles.css  # Design system, animations, responsive rules
│   ├── js/main.js      # Interactions + GitHub API integration
│   └── img/            # Screenshots + profile photo (see its README)
└── README.md
```

## 🖥️ Preview locally

Because there is no build step, any static file server works:

```bash
# Option 1 — Python
python -m http.server 8000
# then open http://localhost:8000

# Option 2 — VS Code Live Server extension (or any static server)
```

---

## 🚀 Deploy to GitHub Pages

### 1. Create a repository

- **User site (recommended):** name the repo exactly **`ruelgaite69.github.io`**.
  The site will be served at `https://ruelgaite69.github.io`.
- **Project site:** use any repo name (e.g. `portfolio`). The site will be served at
  `https://ruelgaite69.github.io/portfolio/`.

> Note: if you choose a project site, the GitHub section's repository links still work
> unchanged, but you may want to keep relative paths in mind for any future assets.

### 2. Push the site

```bash
# from this folder
git init
git add .
git commit -m "Initial commit: portfolio website"
git branch -M main
git remote add origin https://github.com/ruelgaite69/<REPO-NAME>.git
git push -u origin main
```

### 3. Enable Pages

1. On GitHub, open your repository → **Settings** → **Pages** (left sidebar, under
   *Code and automation*).
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. Wait a minute or two — your site is live at the URL shown on that page.

That's it. Since the site is static, GitHub serves it directly from the repo —
no Actions workflow needed. Future updates are just `git add . && git commit && git push`.

---

## 🌐 Connect a custom domain

1. **Buy a domain** from any registrar (Namecheap, GoDaddy, Cloudflare, Porkbun, etc.).

2. **Add DNS records at your registrar** (in the domain's DNS settings):

   | If your domain is… | Record type | Name/Host | Value/Target |
   |---|---|---|---|
   | Apex root (`example.com`) | `A` | `@` | `185.199.108.153`<br>`185.199.109.153`<br>`185.199.110.153`<br>`185.199.111.153` |
   | Subdomain (`www.example.com`) | `CNAME` | `www` | `ruelgaite69.github.io` |

3. **Tell GitHub about the domain:**

   - Repository → **Settings** → **Pages** → **Custom domain**.
   - Enter your domain (e.g. `www.example.com` or `example.com`) and click **Save**.
   - GitHub automatically creates a `CNAME` file in your repository for you —
     no need to create one manually.

4. **Wait for DNS to propagate** (can take a few minutes to a few hours).
   Once GitHub can verify the records, a green "DNS check successful" message appears.

5. **Enforce HTTPS** — back in **Settings → Pages**, tick **Enforce HTTPS** once it
   becomes available. GitHub provisions a free Let's Encrypt certificate automatically
   (this can take up to 24 hours the first time).

---

## ✏️ Updating your content

| What | Where |
| --- | --- |
| Name, headline, statement, buttons | Hero section in `index.html` |
| About text | `#about` section |
| Skills | `#skills` section |
| Projects (descriptions, features, tech) | `#projects` section |
| Project repo & live demo links | `PROJECT_LINKS` config at the top of `assets/js/main.js` (fill in once repos are public; empty = falls back to profile / hides the demo button) |
| Project screenshots | Drop files into `assets/img/` (see [assets/img/README.md](assets/img/README.md)) |
| Profile photo | Drop `graduation-photo.jpg` into `assets/img/` (About section + hero avatar) |
| GitHub section | Auto-fetches from `https://api.github.com/users/ruelgaite69` — no manual sync |
| Colors / theme | CSS variables at the top of `assets/css/styles.css` |

## ℹ️ Notes

- **GitHub API rate limit:** unauthenticated requests are limited to 60/hour per IP.
  The site handles failures gracefully, so this is unlikely to be noticed by visitors.
- **Accent color:** the whole theme is driven by 3 CSS variables (`--accent`,
  `--accent-2`, `--grad`) — changing the look is a 3-line edit.

## 📄 License

Free to use as a template for your own portfolio. Screenshots and project details
belong to their respective owners.

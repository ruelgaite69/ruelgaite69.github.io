# Project screenshots

Each featured project keeps its **real screenshots** in its own folder.
Drop the files in and they appear automatically — **no code changes needed.**

## Folders & naming

| Folder                    | Project                          | Files          |
| ------------------------- | -------------------------------- | -------------- |
| `assets/img/clinictooth/` | ClinicTooth (dental health system) | `1.jpeg`, `2.jpeg`, `3.jpeg`, `4.png`, `Front page.png` |
| `assets/img/rsg/`         | RSG Inventory Management System    | `1.jpeg`…`4.jpeg` |

Each folder has its own `README.md` describing which view each slot expects.

## Recommended format

- PNG or JPG, any sensible filename — the card references the actual filenames
- Landscape, ~1600 × 1000 (16:10) or wider
- Images display with `object-fit: cover` inside the browser frame (wide,
  top-aligned crops are ideal) and full-size in the click-to-expand lightbox

## Slot order (per project)

- Slot 1 (e.g. `1.jpeg`) — the **primary shot** (dashboard) → the only screenshot
  visible on the project card (large, polished browser frame)
- Remaining files — additional views → NOT shown on the page; they open in the
  click-to-explore **lightbox** (the card shows a `View N screenshots` button)

The full list per project lives in the `data-shots` attribute of each
`.browser-body` in `index.html` (comma-separated, first file = primary).

If a file is missing, that slot is hidden automatically and the card shows a
small "screenshot slot ready" hint instead — the site never shows a broken image.

## Lightbox auto-play

- The lightbox **auto-plays** through the project's screenshots (one every 4s).
- **Speed control** under the image: Slow / Normal / Fast (6s / 4s / 2s per shot).
- **Hover over the image** (or tap the play/pause button under it) to pause;
  the cycle resumes when the pointer leaves the image.
- Manual prev/next clicks or arrow keys restart the timer from that shot.
- The visitor's play/pause and speed choices are **remembered across opens**
  (localStorage) — no code changes needed.
- Single-screenshot projects and `prefers-reduced-motion` visitors get no autoplay.

## Profile photo

| File                   | Used for                                    |
| ---------------------- | ------------------------------------------- |
| `graduation-photo.jpg` | Your graduation photo (About section + hero avatar) |

- JPG or PNG, any size — one file powers both placements:
  - **About section:** 4:3 crop with `object-fit: cover`, biased toward the
    upper part of the image so the face stays in frame
  - **Hero avatar:** circular crop with a gradient ring, biased slightly up so
    the face sits in the circle
- If the file is missing, a gradient placeholder with your initial shows instead —
  the site never shows a broken image

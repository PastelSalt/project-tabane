---
title: Himawari · Release-aware download block
layer: ui-ux
origin: own-project
stack:
  - astro
feature:
  - download
status: proven
target: website
reuseNote: A free desktop app's site shows the right installer, its size, checksum and every earlier version, without anyone editing the page after a release.
liveSite:
  url: https://himawari-moekoworks.vercel.app/download
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/components/pages/DownloadPage.astro
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the Download page: the download button with version, date and size, install steps, a requirements table, the SmartScreen step with the SHA-256, and a list of earlier versions"
  phone:
    file: wireframe-phone.svg
    alt: "Phone wireframe of the Download page: the button and meta, the note to download on a computer, then the steps and requirements"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of the Himawari Download page: the installer button with version, date and size, and the install steps"
  - file: screenshot-phone.webp
    alt: Phone screenshot of the Himawari Download page, with the note to open it on a computer
related:
  - himawari-release-sync
  - himawari-download-confetti
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The download section on the home page (`Download.astro`) and the Download page (`DownloadPage.astro`), all drawn from `src/data/release.json`, which the release sync writes before every build.

- **The button and its meta:** "0.4.1 · 22 October 2026 · 146 MB" with silent dots (`ReleaseMeta`); the date in Manila time (`releaseDate(lang)`); the size in MiB as Windows shows it (1024 × 1024, `installerSize()`).
- **Download page:** the installer button, install steps, a requirements table (`Requirements`), the SmartScreen step with the installer's SHA-256 (`SmartScreen`), and **every earlier version** from `release.history`.
- **Links pinned to the release:** `atTag(path)` points links into the engine repository at the released tag.
- **On phones** (below 760 px) the block adds a note (`.dl__phone`): Himawari runs on Windows PCs, so open the page on your computer to download it.
- **The button bursts into confetti** on click (Motion ON only; `himawari-download-confetti`).
- **Both languages:** `DownloadPage.astro` renders either; `/ja/download` is a thin wrapper.

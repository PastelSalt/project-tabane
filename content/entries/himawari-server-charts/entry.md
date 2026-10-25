---
title: Himawari · Server-drawn admin charts
layer: ui-ux
origin: own-project
stack:
  - astro
feature:
  - dashboard
  - statistics
status: proven
target: website
reuseNote: "An admin page needs simple charts but runs no scripts: draw them as SVG on the server, with the numbers in a table too."
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/components/admin/BarChart.astro
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the admin statistics page: a bar chart of visitors per day with a dark views line over each bar, a table of the numbers below, and top-ten bar lists for pages and sources"
related:
  - himawari-admin-stats
  - kotoha-analytics-dashboard
  - himawari-scriptless-admin
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Two Astro components that draw the admin statistics on the server, because the admin panel runs no scripts (`BarChart.astro`, `BarList.astro`).

- **Bar chart:** an SVG 720 × 160 drawn from the points; visitors are sunflower bars and page views a dark line above each bar (or, with `viewsOnly`, the bars are views); a summary line with the totals.
- **Top-ten bars** (`BarList`): one row per item with its share drawn as a bar.
- **Accessible:** the numbers are also in a table below each chart, for screen readers and exact values.
- **No client JavaScript** at all; colours from the site's tokens (`admin.css` reuses them with no decoration).
- **No public view:** the charts are behind the admin sign-in, so this entry has a wireframe only.

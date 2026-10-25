---
title: Kotoha · Library-free SVG analytics dashboard
layer: ui-ux
origin: own-project
stack:
  - javascript
feature:
  - dashboard
  - statistics
status: proven
target: website
reuseNote: An admin dashboard should show site content and visitor statistics clearly, with charts in plain SVG and no library.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/admin/analytics.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the dashboard with a welcome card, five content tiles, a visitor KPI strip, a wide visits chart with a hover value, a range control and grouped breakdown cards"
related:
  - kotoha-cookieless-analytics
  - kotoha-admin-panel
  - himawari-admin-stats
  - himawari-server-charts
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The admin dashboard (refreshed 2026-10-25): what's on the site, what's waiting as a draft, and how visitors are doing, from data the API already returns.

- **Site content tiles:** one per section with the sidebar's icon, the published count, a draft pill only when there are drafts, and a thin published/draft split bar; the whole tile links to its page.
- **Visitors:** a compact Today / This week / This month strip (fixed periods), then the visits chart with Daily / Weekly / Monthly tabs and totals for the shown series, summed in the browser.
- **Visits chart in plain SVG:** drawn at the box's real pixel width (re-drawn by a `ResizeObserver` when the width changes by more than 30 px), so tick labels stay readable on phones; three grid lines; a value label on hover, tap and arrow keys (the box is focusable, the label is `aria-live`); `<title>`s stay for screen readers.
- **Details for 7 / 30 / 90 / 365 days:** the range control sits in the heading of the block it drives, together with Avg visit, Avg loading and the visit count; cards grouped Audience (devices, browsers, languages, countries), Traffic (sources, busiest hours) and Engagement (sections reached, video plays, official links, news links, gallery), with ranks and the busiest hour highlighted.
- **Loading and errors:** skeleton cards at final size, the old content dimmed with `aria-busy` on a range change, one state box with Retry.
- **Formatting:** `Intl` numbers (compact where useful) and Japan-time dates.

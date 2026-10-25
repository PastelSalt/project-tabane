---
title: Sample · Replicate the fan site
kind: replication-guide
goal: A working copy of the sample fan site, with countdown, scrapbook layout and gallery.
basedOn:
  entries:
    - sample-countdown-tiles
    - sample-schedule-api
    - sample-scrapbook-layout
    - sample-fan-art-gallery
  sites:
    - label: Sample fan site
      url: https://example.com/
status: verified
target: website
lastVerified: 2026-10-20
---

## Before you start

- Node.js installed
- The sample-site repository cloned locally

## Steps

### Copy the layout

Start from the scrapbook layout entry and set up the grid and tilts.

### Add the schedule

Add the schedule API and fill events.json with one test event.

### Add the countdown

Drop in the countdown tiles and point them at the schedule API.

### Add the gallery

Add the gallery grid and its credit lines.

## Gotchas

- Store event times in UTC, or the countdown is off by hours.
- Keep tilts small, or text gets hard to read.

## Finished looks like

The page shows a live countdown to the test event, tilted blocks and a working gallery.

# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/masmeng/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/masmeng/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Guide — an offline guide and tracker for all 55 PlayStation 5 trophies of GTA VI: a ~200-hour roadmap to the platinum, the one missable trophy flagged, a guide in our own words for every trophy with its sources cited beside it, and a checklist with progress saved in your browser, filters by kind, a spoiler setting for the 28 hidden trophies, and export/import of your progress.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the guide is plain static files under `app/` (no build step, no network).

To write the hand-in dossier:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How it works

- `app/data/trophies.json` — the official 55 trophies (names and descriptions as published on PlayStation Network, cross-checked on Exophase, PSNProfiles and TrueAchievements), each with a guide written in our own words, a kind (story / collectibles / activities), a missable flag, a hidden flag, a roadmap stage, and its sources.
- `app/index.html`, `app/style.css`, `app/app.js` — the guide page and tracker. Check off trophies as you earn them; progress is saved in localStorage, and you can export it to a file or import it back. The spoiler setting keeps the 28 hidden trophies covered (name, description and guide) until you earn them.
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.min.js`, a minified copy of the kit's library).
- `screenshots/` — 4 captures of the running guide.

## Facts the guide is built on

- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 27 visible, 28 hidden. All offline — 0 online trophies, no DLC needed for the platinum.
- Difficulty 4/10, about 200 hours, 1 playthrough, free-roam after the story, no mission replay. Cheats disable trophies and saving.
- Exactly one potentially missable trophy: Positive Mental Attitude (meditate at every spot) — the first meditation can only happen in Chapter 1 at Jason's house.
- The 100% checklist (A Long Road) is lenient, about 60% true completion: 100 optional missions, 200 of 277 vehicles scanned, 100 of 255 animals studied, 70 of 80 challenges.
- Four trophies had no confirmed unlock method at launch (In The Beginning…, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) — the guide says so honestly instead of inventing one.

---

<sub>Entered on [make.fun](https://make.fun/?ref=g2hsggv0&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

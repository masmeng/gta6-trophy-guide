# Leonida Trophy Guide

An offline guide and tracker for all 55 PlayStation 5 trophies of
Grand Theft Auto VI — one platinum, two gold, six silver and forty-six
bronze. Every trophy shows its official name, description and grade as
PlayStation publishes them, plus a guide written for this project that
names its sources (PowerPyx, GTABase, Exophase, PSNProfiles).

## What it does

- **Checklist tracker** — tick trophies off as you earn them. Progress
  is saved in the browser (localStorage) and can be exported to a JSON
  file and imported back.
- **Filters** — search by name, filter by kind (Story, Side quests,
  Collectibles, Activities, Crime, Money, Secrets), by grade, and a
  "Missable only" toggle.
- **Spoiler mode** — hides the names and descriptions of story trophies
  until you have earned them.
- **Roadmap** — three steps to the platinum, about 200 hours in total,
  with the 100% completion checklist summarised.
- **Missables** — flags Positive Mental Attitude as potentially
  missable: do the Chapter 1 meditation with Lucia before the story
  moves on.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Everything is
static files under `app/` — no build step, no network requests at
runtime, so it works with the network off.

## Build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` into the output directory
and writes `dossier.json` there.

## Sources

Trophy names, descriptions and grades follow the official list as
listed by Exophase and PSNProfiles. Unlock methods were written from
the PowerPyx and GTABase trophy guides, in our own words, and each
trophy's guide names the source it draws on. No Rockstar logo, artwork
or game screenshots are used anywhere in this project.

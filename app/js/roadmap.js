// roadmap.js — the three steps to the platinum and the missables
// section, rendered from the trophy data.

const STEPS = [
  {
    step: 1,
    title: 'Finish the story',
    time: '60–80 hours',
    body: 'Play through all five chapters. There are no mission gold medals, so nothing to replay for a grade. Progress toward the 100% checklist already counts during the story, even though the checklist itself only appears after the credits. Do the one potentially missable meditation in Chapter 1 (see below) and keep manual saves at the start and end of each chapter.',
  },
  {
    step: 2,
    title: 'The 100% completion checklist',
    time: 'About 100 hours',
    body: 'After the credits, open Progress, Stats, 100% Completion. You need any 70 of the 80 challenges, so the hardest ones can be skipped, and most collectibles are only partly required. The only tasks that demand everything are the robberies, underwater discoveries, shooting ranges, drone races and Bret\u2019s hunting quests. This step earns A Long Road, the gold trophy for 100% completion.',
  },
  {
    step: 3,
    title: 'Strangers & Freaks and cleanup',
    time: 'About 10 hours',
    body: 'Most trophies are already done after the checklist. Strangers & Freaks strands are not needed for 100%, so finish the eight counting strands now, then sweep up the remaining side quests, secrets and money trophies. When the last one pops, the platinum — Vice Got a Price! — is yours.',
  },
];

export function renderRoadmap(container) {
  container.textContent = '';
  for (const step of STEPS) {
    const card = document.createElement('article');
    card.className = 'roadmap-step';

    const time = document.createElement('p');
    time.className = 'step-time';
    time.textContent = `Step ${step.step} · ${step.time}`;

    const title = document.createElement('h3');
    title.textContent = step.title;

    const body = document.createElement('p');
    body.textContent = step.body;

    card.append(time, title, body);
    container.appendChild(card);
  }
}

export function renderMissables(container, trophies) {
  container.textContent = '';
  const flagged = trophies.filter((trophy) => trophy.missable);
  if (flagged.length === 0) {
    const note = document.createElement('p');
    note.textContent = 'No trophy in this guide is flagged missable.';
    container.appendChild(note);
    return;
  }
  for (const trophy of flagged) {
    const box = document.createElement('div');
    box.className = 'warning-box';

    const title = document.createElement('h3');
    title.textContent = `${trophy.name} — potentially missable`;

    const body = document.createElement('p');
    body.textContent = trophy.guide;

    const source = document.createElement('p');
    source.textContent = `Sources: ${trophy.sources.join(', ')}. Push Square reports no known missables, so this one is flagged potentially, not confirmed — do it in Chapter 1 and it costs nothing.`;

    box.append(title, body, source);
    container.appendChild(box);
  }
}

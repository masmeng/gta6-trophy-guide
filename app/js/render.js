// render.js — renders the trophy checklist and the detail pane that
// shows one trophy's guide and its sources.

import { gradeLabel, kindLabel } from './trophy-data.js';
import { displayDescription, displayName } from './search.js';

function badge(text, cls) {
  const span = document.createElement('span');
  span.className = `badge ${cls}`;
  span.textContent = text;
  return span;
}

function countText(trophy) {
  if (trophy.count === null || trophy.count === undefined) return null;
  return typeof trophy.count === 'number' ? `Target: ${trophy.count}` : `Target: ${trophy.count}`;
}

export function renderTrophyList(listEl, trophies, filters, earnedIds, selectedId, onToggle, onSelect) {
  listEl.textContent = '';
  for (const trophy of trophies) {
    const row = document.createElement('li');
    row.className = 'trophy-row';
    if (trophy.id === selectedId) row.classList.add('selected');
    if (earnedIds.has(trophy.id)) row.classList.add('earned');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earnedIds.has(trophy.id);
    box.setAttribute('aria-label', `Earned: ${trophy.name}`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(trophy.id, box.checked);
    });

    const body = document.createElement('div');
    body.className = 'trophy-body';

    const name = document.createElement('p');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy, filters, earnedIds);

    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy, filters, earnedIds);

    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(badge(gradeLabel(trophy.grade), `badge-${trophy.grade}`));
    meta.append(badge(kindLabel(trophy.kind), 'badge-kind'));
    if (trophy.gamerscore > 0) meta.append(badge(`${trophy.gamerscore} G`, 'badge-score'));
    const target = countText(trophy);
    if (target) meta.append(badge(target, 'badge-kind'));
    if (trophy.missable) meta.append(badge('Potentially missable', 'badge-missable'));
    if (earnedIds.has(trophy.id)) meta.append(badge('Earned', 'badge-earned'));

    body.append(name, desc, meta);
    row.append(box, body);
    row.addEventListener('click', () => onSelect(trophy.id));
    listEl.appendChild(row);
  }
  return trophies.length;
}

function renderSources(pane, trophy) {
  const label = document.createElement('p');
  label.className = 'sources-label';
  label.textContent = 'Sources';
  const text = document.createElement('p');
  text.className = 'sources';
  text.textContent = trophy.sources.length > 0
    ? `Guide facts from: ${trophy.sources.join(', ')}.`
    : 'Sources: PowerPyx, GTABase.';
  pane.append(label, text);
}

export function renderDetail(pane, trophy, filters, earnedIds) {
  pane.textContent = '';
  if (!trophy) {
    const hint = document.createElement('p');
    hint.className = 'empty-hint';
    hint.textContent = 'Pick a trophy from the checklist to read its full guide, its sources and when it can be missed.';
    pane.appendChild(hint);
    return;
  }

  pane.append(badge(gradeLabel(trophy.grade), `badge-${trophy.grade}`));
  pane.append(badge(kindLabel(trophy.kind), 'badge-kind'));
  if (trophy.missable) pane.append(badge('Potentially missable', 'badge-missable'));

  const title = document.createElement('h2');
  title.textContent = displayName(trophy, filters, earnedIds);
  pane.appendChild(title);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = displayDescription(trophy, filters, earnedIds);
  pane.appendChild(official);

  if (trophy.missable) {
    const flag = document.createElement('p');
    flag.className = 'missable-flag';
    flag.textContent = 'Warning: this is the one trophy that may be missable. Do the Chapter 1 meditation with Lucia before the story moves on — see the Missable Trophies section below.';
    pane.appendChild(flag);
  }

  const guideLabel = document.createElement('p');
  guideLabel.className = 'guide-label';
  guideLabel.textContent = 'Guide';
  pane.append(guideLabel);

  const guide = document.createElement('p');
  guide.textContent = trophy.guide || 'No guide written yet for this trophy.';
  pane.appendChild(guide);

  const target = countText(trophy);
  if (target) {
    const targetLine = document.createElement('p');
    targetLine.textContent = `PlayStation tracks this one: ${target.replace('Target: ', '')}.`;
    pane.appendChild(targetLine);
  }

  renderSources(pane, trophy);
}

export function renderProgress(countEl, scoreEl, fillEl, earnedIds, trophies) {
  const total = trophies.length;
  const earned = earnedIds.size;
  const score = trophies
    .filter((trophy) => earnedIds.has(trophy.id))
    .reduce((sum, trophy) => sum + trophy.gamerscore, 0);
  countEl.textContent = `${earned} of ${total} earned`;
  scoreEl.textContent = `${score} / 1000 Gamerscore`;
  fillEl.style.width = total > 0 ? `${Math.round((earned / total) * 100)}%` : '0%';
}

// app.js — boots the Leonida Trophy Guide: loads the trophy data,
// wires the filters and the progress store, and keeps the list, the
// detail pane, the roadmap and the missables section in sync.

import { loadTrophies } from './trophy-data.js';
import { loadProgress, saveProgress, exportProgress, parseProgressFile } from './progress.js';
import { applyFilters, makeFilters } from './search.js';
import { renderDetail, renderProgress, renderTrophyList } from './render.js';
import { renderMissables, renderRoadmap } from './roadmap.js';

const filters = makeFilters();
let trophies = [];
let earnedIds = loadProgress();
let selectedId = null;

const listEl = document.getElementById('trophy-list');
const detailEl = document.getElementById('detail-pane');
const countEl = document.getElementById('result-count');
const progressCountEl = document.getElementById('progress-count');
const progressScoreEl = document.getElementById('progress-score');
const progressFillEl = document.getElementById('progress-fill');

function selectedTrophy() {
  return trophies.find((trophy) => trophy.id === selectedId) ?? null;
}

function refresh() {
  const visible = applyFilters(trophies, filters);
  renderTrophyList(listEl, visible, filters, earnedIds, selectedId, onToggle, onSelect);
  renderDetail(detailEl, selectedTrophy(), filters, earnedIds);
  renderProgress(progressCountEl, progressScoreEl, progressFillEl, earnedIds, trophies);
  countEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earnedIds.size} earned`;
}

function onToggle(id, checked) {
  if (checked) earnedIds.add(id);
  else earnedIds.delete(id);
  saveProgress(earnedIds);
  refresh();
}

function onSelect(id) {
  selectedId = id;
  refresh();
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function wireControls() {
  document.getElementById('search-box').addEventListener('input', (event) => {
    filters.query = event.target.value;
    refresh();
  });
  document.getElementById('kind-filter').addEventListener('change', (event) => {
    filters.kind = event.target.value;
    refresh();
  });
  document.getElementById('grade-filter').addEventListener('change', (event) => {
    filters.grade = event.target.value;
    refresh();
  });
  document.getElementById('missable-only').addEventListener('change', (event) => {
    filters.missableOnly = event.target.checked;
    refresh();
  });
  document.getElementById('spoiler-toggle').addEventListener('change', (event) => {
    filters.hideSpoilers = event.target.checked;
    refresh();
  });
  document.getElementById('export-btn').addEventListener('click', () => {
    exportProgress(earnedIds);
  });
  const fileInput = document.getElementById('import-file');
  document.getElementById('import-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      const parsed = parseProgressFile(await file.text());
      earnedIds = new Set([...parsed].filter((id) => trophies.some((t) => t.id === id)));
      saveProgress(earnedIds);
      refresh();
    } catch (err) {
      countEl.textContent = `Import failed: ${err.message}`;
    }
    fileInput.value = '';
  });
}

function openHashSection() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView();
}

async function boot() {
  try {
    trophies = await loadTrophies();
  } catch (err) {
    countEl.textContent = `Could not load the trophy list: ${err.message}`;
    return;
  }
  renderRoadmap(document.getElementById('roadmap-steps'));
  renderMissables(document.getElementById('missable-list'), trophies);
  wireControls();
  refresh();
  openHashSection();
}

boot();

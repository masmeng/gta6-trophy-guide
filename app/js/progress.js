// progress.js — the earned-trophy store: localStorage plus JSON
// export and import. The file a reader exports is theirs alone; the
// app never sends it anywhere.

const STORAGE_KEY = 'leonida-trophy-guide-v1';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { earned: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.earned)) return { earned: [] };
    return { earned: parsed.earned.filter((id) => Number.isInteger(id)) };
  } catch {
    return { earned: [] };
  }
}

export function loadProgress() {
  return new Set(readStored().earned);
}

export function saveProgress(earnedIds) {
  const payload = { app: 'leonida-trophy-guide', version: 1, earned: [...earnedIds].sort((a, b) => a - b) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function exportProgress(earnedIds) {
  const payload = saveProgress(earnedIds);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'leonida-trophy-progress.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function parseProgressFile(text) {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('progress: that file holds no earned list');
  const ids = list.filter((id) => Number.isInteger(id));
  if (ids.length === 0 && list.length > 0) throw new Error('progress: no usable trophy ids in that file');
  return new Set(ids);
}

export function earnedGamerscore(trophies, earnedIds) {
  return trophies
    .filter((trophy) => earnedIds.has(trophy.id))
    .reduce((sum, trophy) => sum + trophy.gamerscore, 0);
}

// trophy-data.js — loads app/data/trophies.json and normalises each entry
// into the shape the tracker renders. No network beyond the app's own
// server: the JSON is a file under app/.

const DATA_URL = './data/trophies.json';

const KIND_LABELS = {
  story: 'Story',
  side: 'Side quests',
  collectible: 'Collectibles',
  activity: 'Activities',
  crime: 'Crime',
  money: 'Money',
  secret: 'Secrets',
};

const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export function kindLabel(kind) {
  return KIND_LABELS[kind] ?? 'Story';
}

export function gradeLabel(grade) {
  return GRADE_LABELS[grade] ?? 'Bronze';
}

function normaliseTrophy(raw, index) {
  return {
    id: typeof raw.id === 'number' ? raw.id : index + 1,
    name: String(raw.name ?? ''),
    description: String(raw.description ?? ''),
    grade: String(raw.grade ?? 'bronze').toLowerCase(),
    hidden: raw.hidden === true,
    kind: String(raw.kind ?? 'story').toLowerCase(),
    missable: raw.missable === true,
    gamerscore: typeof raw.gamerscore === 'number' ? raw.gamerscore : 0,
    count: raw.count ?? null,
    guide: String(raw.guide ?? ''),
    sources: Array.isArray(raw.sources) ? raw.sources.map(String) : [],
    stage: typeof raw.stage === 'number' ? raw.stage : 1,
  };
}

export async function loadTrophies() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`trophy-data: could not load ${DATA_URL} (${response.status})`);
  const payload = await response.json();
  const list = Array.isArray(payload) ? payload : payload.trophies;
  if (!Array.isArray(list)) throw new Error('trophy-data: trophies.json holds no trophies array');
  return list.map(normaliseTrophy);
}

export function gradeCounts(trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    if (counts[trophy.grade] !== undefined) counts[trophy.grade] += 1;
  }
  return counts;
}

export function totalGamerscore(trophies) {
  return trophies.reduce((sum, trophy) => sum + trophy.gamerscore, 0);
}

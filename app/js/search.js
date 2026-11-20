// search.js — the tracker's filters: text search plus kind, grade,
// missable-only and the spoiler setting. Spoiler mode hides a story
// trophy's name and description until it is earned.

export function makeFilters() {
  return {
    query: '',
    kind: 'all',
    grade: 'all',
    missableOnly: false,
    hideSpoilers: false,
  };
}

function matchesQuery(trophy, query) {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    trophy.name.toLowerCase().includes(needle) ||
    trophy.description.toLowerCase().includes(needle) ||
    trophy.guide.toLowerCase().includes(needle)
  );
}

export function applyFilters(trophies, filters) {
  return trophies.filter((trophy) => {
    if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.missableOnly && !trophy.missable) return false;
    return matchesQuery(trophy, filters.query);
  });
}

export function isSpoilerHidden(trophy, filters, earnedIds) {
  return filters.hideSpoilers && trophy.kind === 'story' && !earnedIds.has(trophy.id);
}

export function displayName(trophy, filters, earnedIds) {
  return isSpoilerHidden(trophy, filters, earnedIds) ? 'Hidden story trophy' : trophy.name;
}

export function displayDescription(trophy, filters, earnedIds) {
  return isSpoilerHidden(trophy, filters, earnedIds)
    ? 'Earn this trophy to reveal its name and description.'
    : trophy.description;
}

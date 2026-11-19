// Leonida Trophy Guide — tracker logic.
// Loads app/data/trophies.json, renders the 55 trophies, and keeps the
// earned checklist in localStorage so progress survives a reload.
// No network calls besides the local data file; no analytics, no cookies.

const DATA_URL = "data/trophies.json";
const STORE_KEY = "leonida-trophy-progress-v1";
const SPOILER_KEY = "leonida-spoiler-v1";

const listEl = document.getElementById("trophyList");
const resultLine = document.getElementById("resultLine");
const searchEl = document.getElementById("search");
const spoilerToggle = document.getElementById("spoilerToggle");
const progressText = document.getElementById("progressText");
const progressPct = document.getElementById("progressPct");
const progressFill = document.getElementById("progressFill");
const onlineNote = document.getElementById("onlineNote");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const resetBtn = document.getElementById("resetBtn");

let trophies = [];
let activeFilter = "all";
let earned = loadProgress();

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(earned));
  } catch {
    // Storage full or blocked: the page still works for this session.
  }
}

function earnedCount() {
  return trophies.filter((t) => earned[t.id]).length;
}

function stageCount(stage) {
  const inStage = trophies.filter((t) => t.stage === stage);
  const done = inStage.filter((t) => earned[t.id]).length;
  return `${done} / ${inStage.length} earned in this stage`;
}

function updateProgress() {
  const done = earnedCount();
  const total = trophies.length || 55;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressText.textContent = `${done} / ${total} earned`;
  progressPct.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;
  for (const stage of [1, 2, 3]) {
    const el = document.getElementById(`stageCount${stage}`);
    if (el) el.textContent = stageCount(stage);
  }
  const platinum = trophies.find((t) => t.grade === "platinum");
  const note = document.getElementById("platinumNote");
  if (note && platinum) {
    note.textContent = earned[platinum.id]
      ? "Platinum earned — you're a Leonida Legend."
      : "Earn the other 54 and the platinum, Vice Got a Price!, pops on its own.";
  }
}

function gradeLabel(grade) {
  if (grade === "platinum") return "Plat";
  if (grade === "gold") return "Gold";
  if (grade === "silver") return "Silv";
  return "Bron";
}

function kindLabel(kind) {
  if (kind === "story") return "Story";
  if (kind === "collectibles") return "Collectibles";
  return "Activities";
}

function stageLabel(stage) {
  if (stage === 1) return "Stage 1 · Story";
  if (stage === 2) return "Stage 2 · 100%";
  return "Stage 3 · Cleanup";
}

function matchesFilter(t, query) {
  const q = query.trim().toLowerCase();
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${kindLabel(t.kind)}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  switch (activeFilter) {
    case "all": return true;
    case "story": return t.kind === "story";
    case "missable": return t.missable === true;
    case "collectibles": return t.kind === "collectibles";
    case "activities": return t.kind === "activities";
    case "online": return false;
    case "earned": return Boolean(earned[t.id]);
    case "todo": return !earned[t.id];
    default: return true;
  }
}

function cardFor(t) {
  const article = document.createElement("article");
  article.className = "trophy";
  if (earned[t.id]) article.classList.add("earned");
  if (t.missable) article.classList.add("missable-flag");

  const spoilersOn = spoilerToggle.checked;
  const hiddenCovered = t.hidden && spoilersOn && !earned[t.id];

  const head = document.createElement("div");
  head.className = "trophy-head";
  const dot = document.createElement("span");
  dot.className = `grade-dot grade-${t.grade}`;
  dot.textContent = gradeLabel(t.grade);
  dot.title = `${t.grade} trophy`;
  head.appendChild(dot);

  const titleBox = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = hiddenCovered ? "Hidden trophy" : t.name;
  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = hiddenCovered ? "This trophy stays hidden until you unlock it." : t.description;
  titleBox.appendChild(title);
  titleBox.appendChild(desc);
  head.appendChild(titleBox);
  article.appendChild(head);

  const tags = document.createElement("div");
  tags.className = "tags";
  const tagKind = document.createElement("span");
  tagKind.className = "tag";
  tagKind.textContent = kindLabel(t.kind);
  tags.appendChild(tagKind);
  const tagStage = document.createElement("span");
  tagStage.className = "tag";
  tagStage.textContent = stageLabel(t.stage);
  tags.appendChild(tagStage);
  if (t.missable) {
    const tag = document.createElement("span");
    tag.className = "tag warn";
    tag.textContent = "Missable";
    tags.appendChild(tag);
  }
  if (t.unconfirmed) {
    const tag = document.createElement("span");
    tag.className = "tag warn";
    tag.textContent = "Unconfirmed";
    tags.appendChild(tag);
  }
  if (t.hidden) {
    const tag = document.createElement("span");
    tag.className = "tag spoiler";
    tag.textContent = "Hidden";
    tags.appendChild(tag);
  }
  article.appendChild(tags);

  if (hiddenCovered) {
    const cover = document.createElement("p");
    cover.className = "spoiler-cover";
    cover.textContent = "Spoiler hidden — earn this trophy in game to reveal its name and guide, or switch off the spoiler setting above.";
    article.appendChild(cover);
  } else {
    const guide = document.createElement("p");
    guide.className = "guide";
    if (t.missable) {
      const warn = document.createElement("strong");
      warn.textContent = "Missable — read this one first. ";
      guide.appendChild(warn);
    }
    guide.appendChild(document.createTextNode(t.guide));
    article.appendChild(guide);

    if (Array.isArray(t.sources) && t.sources.length) {
      const src = document.createElement("div");
      src.className = "sources";
      src.textContent = "Sources:";
      const ul = document.createElement("ul");
      for (const s of t.sources) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = s.url;
        a.textContent = s.name;
        a.target = "_blank";
        a.rel = "noopener";
        li.appendChild(a);
        ul.appendChild(li);
      }
      src.appendChild(ul);
      article.appendChild(src);
    }
  }

  const row = document.createElement("div");
  row.className = "earn-row";
  const box = document.createElement("input");
  box.type = "checkbox";
  box.id = `earn-${t.id}`;
  box.checked = Boolean(earned[t.id]);
  box.addEventListener("change", () => {
    if (box.checked) {
      earned[t.id] = new Date().toISOString().slice(0, 10);
    } else {
      delete earned[t.id];
    }
    saveProgress();
    render();
  });
  const label = document.createElement("label");
  label.htmlFor = box.id;
  label.textContent = "Earned";
  row.appendChild(box);
  row.appendChild(label);
  if (earned[t.id]) {
    const when = document.createElement("span");
    when.className = "earned-at";
    when.textContent = earned[t.id];
    row.appendChild(when);
  }
  article.appendChild(row);

  return article;
}

function render() {
  updateProgress();
  const query = searchEl.value;
  if (activeFilter === "online") {
    listEl.innerHTML = "";
    onlineNote.hidden = false;
    resultLine.textContent = "Online trophies: 0 of 55 — every trophy is offline single-player.";
    return;
  }
  onlineNote.hidden = true;
  const shown = trophies.filter((t) => matchesFilter(t, query));
  listEl.innerHTML = "";
  if (!shown.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No trophies match this filter. Try another filter or clear the search.";
    listEl.appendChild(empty);
  } else {
    for (const t of shown) listEl.appendChild(cardFor(t));
  }
  const done = earnedCount();
  resultLine.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${done} earned overall.`;
}

function exportProgress() {
  const payload = {
    app: "leonida-trophy-guide",
    exported: new Date().toISOString(),
    earned,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leonida-trophy-progress.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      const next = data && typeof data === "object" ? (data.earned || data) : null;
      if (!next || typeof next !== "object" || Array.isArray(next)) throw new Error("bad file");
      const validIds = new Set(trophies.map((t) => String(t.id)));
      const clean = {};
      for (const [key, value] of Object.entries(next)) {
        if (validIds.has(String(key)) && value) clean[key] = typeof value === "string" ? value : true;
      }
      earned = clean;
      saveProgress();
      render();
      resultLine.textContent = `Imported progress: ${earnedCount()} of ${trophies.length} trophies earned.`;
    } catch {
      resultLine.textContent = "That file could not be read as trophy progress. Export a progress file first, then import that same file.";
    }
  };
  reader.readAsText(file);
}

document.querySelectorAll(".filters .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filters .chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    render();
  });
});

searchEl.addEventListener("input", render);
spoilerToggle.addEventListener("change", () => {
  try {
    localStorage.setItem(SPOILER_KEY, spoilerToggle.checked ? "on" : "off");
  } catch {
    // Storage blocked: the toggle still works for this session.
  }
  render();
});
try {
  if (localStorage.getItem(SPOILER_KEY) === "off") spoilerToggle.checked = false;
} catch {
  // Storage blocked: keep the default (spoilers hidden).
}
exportBtn.addEventListener("click", exportProgress);
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", () => {
  if (importFile.files && importFile.files[0]) importProgress(importFile.files[0]);
  importFile.value = "";
});
resetBtn.addEventListener("click", () => {
  if (window.confirm("Clear all earned trophies? This cannot be undone.")) {
    earned = {};
    saveProgress();
    render();
  }
});

fetch(DATA_URL)
  .then((res) => {
    if (!res.ok) throw new Error(`trophies.json: HTTP ${res.status}`);
    return res.json();
  })
  .then((data) => {
    trophies = Array.isArray(data.trophies) ? data.trophies : [];
    render();
  })
  .catch((err) => {
    listEl.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = `Could not load the trophy list (${err.message}). Open this guide from its own folder so data/trophies.json loads.`;
    listEl.appendChild(empty);
    resultLine.textContent = "";
  });

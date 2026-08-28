// Wordly — frontend app logic. Plain JS, no frameworks.
// Talks to the Express API (see api.js) and renders four views:
// Dashboard, Today's Words, Review, Vocabulary.

/* ---------------------------------------------------------
   Small inline icon set (hand-drawn, minimal line style)
--------------------------------------------------------- */
const ICON_VOLUME = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>`;
const ICON_CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4 10-10"/></svg>`;
const ICON_CHECK_SM = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4 10-10"/></svg>`;
const ICON_BULB = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"/></svg>`;
const ICON_REFRESH = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 13.66-5.66L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.66 5.66L4 15.5"/><path d="M4 20v-4.5h4.5"/></svg>`;
const ICON_TARGET = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".7" fill="currentColor"/></svg>`;
const ICON_FLAME = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s5 4.5 5 9.5a5 5 0 0 1-10 0c0-1.2.5-2 1-2.7.3 1 1.2 1.7 2 1.2-.6-2 .3-4 2-5.5-.3 1.5 0 2.7 1 2.5C13.5 6.5 12 4.5 12 3Z"/></svg>`;
const ICON_SPARKLE = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="3.2"/></svg>`;
const ICON_CHEVRON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`;

/* ---------------------------------------------------------
   State
--------------------------------------------------------- */
const state = {
  today: null,
  review: null,
  learned: null,
  progress: null,
  grammar: null,
};

const mem = { queue: [], index: 0 };
let currentModalWord = null;
let currentGrammarLesson = null;
let searchDebounce = null;

/* ---------------------------------------------------------
   DOM refs
--------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

const els = {
  greetingText: $('greetingText'),
  streakText: $('streakText'),
  progressCount: $('progressCount'),
  progressFill: $('progressFill'),
  statRemaining: $('statRemaining'),
  statReview: $('statReview'),
  statLearned: $('statLearned'),
  continueBlock: $('continueBlock'),
  continueBadge: $('continueBadge'),
  continueWord: $('continueWord'),
  continueMeaning: $('continueMeaning'),
  continueBtn: $('continueBtn'),
  dashboardWordPreview: $('dashboardWordPreview'),
  dashReviewBlock: $('dashReviewBlock'),
  dashboardReviewPreview: $('dashboardReviewPreview'),

  todayHeading: $('todayHeading'),
  todayCount: $('todayCount'),
  todayWordGrid: $('todayWordGrid'),
  todayEmpty: $('todayEmpty'),
  startMemorizeBtn: $('startMemorizeBtn'),
  nextDayBanner: $('nextDayBanner'),
  nextDayIcon: $('nextDayIcon'),
  nextDayTitle: $('nextDayTitle'),
  nextDaySubtitle: $('nextDaySubtitle'),
  nextDayBtn: $('nextDayBtn'),

  reviewList: $('reviewList'),
  reviewEmpty: $('reviewEmpty'),

  grammarGrid: $('grammarGrid'),
  grammarEmpty: $('grammarEmpty'),
  grammarTopicInput: $('grammarTopicInput'),
  grammarGenerateBtn: $('grammarGenerateBtn'),
  grammarModal: $('grammarModal'),
  grammarModalCard: $('grammarModalCard'),
  grammarModalCategory: $('grammarModalCategory'),
  grammarModalTitle: $('grammarModalTitle'),
  grammarModalExplanation: $('grammarModalExplanation'),
  grammarModalRules: $('grammarModalRules'),
  grammarModalExamples: $('grammarModalExamples'),

  vocabSearch: $('vocabSearch'),
  vocabCount: $('vocabCount'),
  vocabGrid: $('vocabGrid'),
  vocabEmpty: $('vocabEmpty'),

  wordModal: $('wordModal'),
  modalCard: $('modalCard'),
  modalEyebrow: $('modalEyebrow'),
  modalWord: $('modalWord'),
  modalPron: $('modalPron'),
  modalListenBtn: $('modalListenBtn'),
  modalMeaning: $('modalMeaning'),
  modalHindi: $('modalHindi'),
  modalExample: $('modalExample'),
  modalExampleMeaningRow: $('modalExampleMeaningRow'),
  modalExampleMeaning: $('modalExampleMeaning'),
  modalTrick: $('modalTrick'),
  modalActions: $('modalActions'),

  memorizeOverlay: $('memorizeOverlay'),
  memProgressText: $('memProgressText'),
  memCard: $('memCard'),
  memQuestionBlock: $('memQuestionBlock'),
  memWord: $('memWord'),
  revealBtn: $('revealBtn'),
  memRevealBlock: $('memRevealBlock'),
  memRevealWord: $('memRevealWord'),
  memMeaning: $('memMeaning'),
  memHindi: $('memHindi'),
  memYesBtn: $('memYesBtn'),
  memNoBtn: $('memNoBtn'),

  toast: $('toast'),
  toastText: $('toastText'),

  notifBtn: $('notifBtn'),
  notifDot: $('notifDot'),
  notifPanel: $('notifPanel'),
  notifList: $('notifList'),

  hamburgerBtn: $('hamburgerBtn'),
  mobileMenu: $('mobileMenu'),
};

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

let toastTimer = null;
function showToast(msg) {
  els.toastText.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    showToast("This browser can't play audio pronunciation.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.92;
  window.speechSynthesis.speak(utter);
}

function findWordById(id) {
  const pools = [state.today?.words, state.review?.words, state.learned?.words];
  for (const pool of pools) {
    if (!pool) continue;
    const match = pool.find((w) => w._id === id);
    if (match) return match;
  }
  return null;
}

function findGrammarById(id) {
  return (state.grammar?.lessons || []).find((g) => g._id === id) || null;
}

/* ---------------------------------------------------------
   Data loading
--------------------------------------------------------- */
async function refreshAll() {
  try {
    const [today, review, learned, progress, grammar] = await Promise.all([
      api.getToday(),
      api.getReview(),
      api.getLearned(),
      api.getProgress(),
      api.getGrammar(),
    ]);
    state.today = today;
    state.review = review;
    state.learned = learned;
    state.progress = progress;
    state.grammar = grammar;

    renderDashboard();
    renderTodayView();
    renderReviewView();
    if (!els.vocabSearch.value.trim()) renderVocabGrid(state.learned.words);
    renderGrammarView();
    renderNotifications();
  } catch (err) {
    showToast(err.message || 'Could not reach the server.');
  }
}

/* ---------------------------------------------------------
   Word card / row builders
--------------------------------------------------------- */
function statusTagHTML(word) {
  if (word.status === 'learned') return '<span class="status-tag learned">Learned</span>';
  if (word.status === 'review') return '<span class="status-tag review">Review</span>';
  return '';
}

function wordCardHTML(word, index, opts = {}) {
  const { showActions = true, showTrick = true } = opts;
  return `
  <div class="word-card" data-id="${word._id}">
    ${statusTagHTML(word)}
    <div class="word-card-top">
      <span class="word-num">${String(index).padStart(2, '0')}</span>
      <button class="sound-btn" type="button" data-action="listen" data-word="${esc(word.word)}" aria-label="Listen to ${esc(word.word)}">${ICON_VOLUME}</button>
    </div>
    <h3>${esc(word.word)}</h3>
    <p class="word-pron">${esc(word.pronunciation)}</p>
    <p class="word-meaning">${esc(word.meaning)}</p>
    <span class="hindi-chip">Hindi: ${esc(word.hindiMeaning)}</span>
    <p class="word-example">&ldquo;${esc(word.example)}&rdquo;</p>
    ${word.exampleMeaning ? `<p class="word-example-meaning">${esc(word.exampleMeaning)}</p>` : ''}
    ${showTrick ? `
    <div class="memory-trick">
      ${ICON_BULB}
      <div><span class="mt-label">Memory trick</span>${esc(word.memoryTrick)}</div>
    </div>` : ''}
    ${showActions ? `
    <div class="word-card-actions">
      <button class="btn btn-ghost" type="button" data-action="open">Review</button>
      <button class="btn btn-primary" type="button" data-action="remember">${ICON_CHECK} Remembered</button>
    </div>` : ''}
  </div>`;
}

function miniRowHTML(word, num) {
  let status = '';
  if (word.status === 'learned') status = `<span class="mini-status">${ICON_CHECK_SM}</span>`;
  else if (word.status === 'review') status = `<span class="status-tag review" style="position:static;">Review</span>`;
  return `
  <div class="mini-row" data-id="${word._id}">
    <span class="mini-num">${String(num).padStart(2, '0')}</span>
    <span class="mini-word">${esc(word.word)}</span>
    <span class="mini-meaning">${esc(word.meaning)}</span>
    ${status}
  </div>`;
}

function reviewCardHTML(word) {
  return `
  <div class="review-card" data-id="${word._id}">
    <div class="review-card-main">
      <h3>${esc(word.word)}</h3>
      <p class="rc-meaning">${esc(word.meaning)}</p>
      <span class="rc-tag">Hindi: ${esc(word.hindiMeaning)} · reviewed ${word.reviewCount || 0}×</span>
    </div>
    <div class="review-card-actions">
      <button class="btn btn-primary btn-sm" type="button" data-action="remember">${ICON_CHECK} I Remember</button>
      <button class="btn btn-ghost btn-sm" type="button" data-action="review-again">${ICON_REFRESH} Review Again</button>
    </div>
  </div>`;
}

function grammarCardHTML(lesson) {
  return `
  <div class="grammar-card" data-id="${lesson._id}">
    <div class="grammar-card-top">
      <span class="category-badge${lesson.source === 'ai' ? ' ai' : ''}">${esc(lesson.category)}</span>
    </div>
    <h3>${esc(lesson.title)}</h3>
    <p>${esc(lesson.explanation)}</p>
    <span class="gc-footer">View lesson ${ICON_CHEVRON}</span>
  </div>`;
}

/* ---------------------------------------------------------
   Render: Dashboard
--------------------------------------------------------- */
function renderDashboard() {
  const p = state.progress;
  if (!p) return;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  els.greetingText.textContent = `${greeting} 👋`;
  els.streakText.textContent = p.streak > 0 ? `${p.streak} day streak` : 'Start your streak today';

  els.progressCount.textContent = `${p.todayLearned} / ${p.todayTotal}`;
  const pct = p.todayTotal ? Math.round((p.todayLearned / p.todayTotal) * 100) : 0;
  els.progressFill.style.width = `${pct}%`;

  els.statRemaining.textContent = p.todayRemaining;
  els.statReview.textContent = p.reviewCount;
  els.statLearned.textContent = p.learnedTotal;

  const nextWord = (state.today?.words || []).find((w) => w.status === 'new');
  if (nextWord) {
    els.continueBlock.style.display = '';
    els.continueBadge.textContent = String(nextWord.order).padStart(2, '0');
    els.continueWord.textContent = nextWord.word;
    els.continueMeaning.textContent = nextWord.meaning;
  } else {
    els.continueBlock.style.display = 'none';
  }

  const previewWords = (state.today?.words || []).slice(0, 3);
  els.dashboardWordPreview.innerHTML = previewWords.length
    ? `<div class="mini-list">${previewWords.map((w) => miniRowHTML(w, w.order)).join('')}</div>`
    : `<div class="empty-state"><p class="title">No words loaded yet</p><p class="sub">Run the seed script to add your first 30 words.</p></div>`;

  const reviewWords = (state.review?.words || []).slice(0, 3);
  if (reviewWords.length) {
    els.dashReviewBlock.style.display = '';
    els.dashboardReviewPreview.innerHTML = reviewWords.map(reviewCardHTML).join('');
  } else {
    els.dashReviewBlock.style.display = 'none';
  }
}

/* ---------------------------------------------------------
   Render: Today's Words
--------------------------------------------------------- */
function renderTodayView() {
  const data = state.today;
  if (!data) return;

  els.todayHeading.textContent = `Today's ${data.total} words · Day ${data.currentDay}`;
  els.todayCount.textContent = `${data.learned} / ${data.total} learned`;

  els.todayWordGrid.innerHTML = data.words.map((w, i) => wordCardHTML(w, i + 1)).join('');
  els.todayEmpty.style.display = data.words.length ? 'none' : 'block';

  const hasNew = data.remaining > 0;
  els.startMemorizeBtn.disabled = !hasNew;
  els.startMemorizeBtn.innerHTML = hasNew
    ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18l15-9L5 3Z"/></svg> Start Remember Mode`
    : `${ICON_CHECK} All words done for today`;

  renderNextDayBanner(hasNew);
}

function renderNextDayBanner(hasNew) {
  if (hasNew || !state.progress) {
    els.nextDayBanner.style.display = 'none';
    return;
  }

  const p = state.progress;
  els.nextDayBanner.style.display = '';

  if (p.canAdvanceDay) {
    els.nextDayBanner.dataset.mode = 'advance';
    els.nextDayIcon.innerHTML = ICON_CHECK;
    els.nextDayTitle.textContent = "Today's words are done 🎉";
    els.nextDaySubtitle.textContent = 'A new set is ready whenever you are.';
    els.nextDayBtn.innerHTML = `Start Day ${p.currentDay + 1}`;
  } else {
    els.nextDayBanner.dataset.mode = 'ai';
    els.nextDayIcon.innerHTML = ICON_SPARKLE;
    els.nextDayTitle.textContent = "Today's words are done 🎉";
    els.nextDaySubtitle.textContent = "Let AI write tomorrow's 30 words for you.";
    els.nextDayBtn.innerHTML = `${ICON_SPARKLE} Generate with AI`;
  }
}

/* ---------------------------------------------------------
   Render: Review
--------------------------------------------------------- */
function renderReviewView() {
  const words = state.review?.words || [];
  els.reviewList.innerHTML = words.map(reviewCardHTML).join('');
  els.reviewEmpty.style.display = words.length ? 'none' : 'block';
}

/* ---------------------------------------------------------
   Render: Grammar
--------------------------------------------------------- */
function renderGrammarView() {
  const lessons = state.grammar?.lessons || [];
  els.grammarGrid.innerHTML = lessons.map(grammarCardHTML).join('');
  els.grammarEmpty.style.display = lessons.length ? 'none' : 'block';
}

/* ---------------------------------------------------------
   Render: Vocabulary / Search
--------------------------------------------------------- */
function renderVocabGrid(words) {
  els.vocabGrid.innerHTML = words.map((w, i) => wordCardHTML(w, i + 1, { showActions: false, showTrick: false })).join('');
  els.vocabEmpty.style.display = words.length ? 'none' : 'block';
  const q = els.vocabSearch.value.trim();
  els.vocabCount.textContent = q
    ? `${words.length} result${words.length === 1 ? '' : 's'} for "${q}"`
    : `${words.length} word${words.length === 1 ? '' : 's'} learned`;
}

function bindSearch() {
  els.vocabSearch.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    const q = els.vocabSearch.value.trim();
    searchDebounce = setTimeout(async () => {
      try {
        if (!q) {
          renderVocabGrid(state.learned?.words || []);
          return;
        }
        const result = await api.search(q);
        renderVocabGrid(result.words);
      } catch (err) {
        showToast(err.message);
      }
    }, 250);
  });
}

/* ---------------------------------------------------------
   Notifications
--------------------------------------------------------- */
function buildNotifications() {
  const p = state.progress;
  if (!p) return [];
  const notes = [];

  if (p.todayRemaining > 0) {
    notes.push({ icon: ICON_TARGET, text: `You have ${p.todayRemaining} word${p.todayRemaining === 1 ? '' : 's'} left today.` });
  }
  if (p.todayTotal > 0 && p.todayRemaining > 0 && p.todayRemaining <= 5) {
    notes.push({ icon: ICON_CHECK, text: `Almost there — you're close to finishing today's vocabulary.` });
  }
  if (p.reviewCount > 0) {
    notes.push({ icon: ICON_REFRESH, text: `It's time to review ${p.reviewCount} word${p.reviewCount === 1 ? '' : 's'}.` });
  }
  if (p.streak >= 2) {
    notes.push({ icon: ICON_FLAME, text: `Keep your ${p.streak}-day learning streak going.` });
  }
  if (!notes.length) {
    notes.push({ icon: ICON_CHECK, text: "You're all caught up. Nice work!" });
  }
  return notes;
}

function renderNotifications() {
  const notes = buildNotifications();
  els.notifList.innerHTML = notes
    .map((n) => `<div class="notif-item">${n.icon || ''}<span>${esc(n.text)}</span></div>`)
    .join('');

  const p = state.progress;
  const actionable = p && (p.todayRemaining > 0 || p.reviewCount > 0);
  els.notifDot.classList.toggle('hidden', !actionable);
}

function toggleNotifPanel(forceClose = false) {
  if (forceClose) {
    els.notifPanel.classList.remove('open');
    return;
  }
  els.notifPanel.classList.toggle('open');
}

/* ---------------------------------------------------------
   View switching
--------------------------------------------------------- */
function showView(name) {
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${name}`));
  document.querySelectorAll('[data-view]').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === name));
  els.mobileMenu.classList.remove('open');
  toggleNotifPanel(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------------------------------------------------
   Word detail modal
--------------------------------------------------------- */
function modalActionsHTML(word) {
  if (word.status === 'review') {
    return `
      <button class="btn btn-primary" type="button" data-action="remember">${ICON_CHECK} I Remember</button>
      <button class="btn btn-ghost" type="button" data-action="review-again">${ICON_REFRESH} Review Again</button>`;
  }
  if (word.status === 'learned') {
    return `<button class="btn btn-ghost" type="button" data-action="forgot">${ICON_REFRESH} Practice again</button>`;
  }
  return `
    <button class="btn btn-primary" type="button" data-action="remember">${ICON_CHECK} I Remember</button>
    <button class="btn btn-ghost" type="button" data-action="forgot">Review Later</button>`;
}

function openModalById(id) {
  const word = findWordById(id);
  if (!word) return;
  currentModalWord = word;

  els.modalCard.dataset.id = word._id;
  els.modalEyebrow.textContent = word.status === 'learned' ? 'Learned word' : word.status === 'review' ? 'In review' : 'New word';
  els.modalWord.textContent = word.word;
  els.modalPron.textContent = word.pronunciation;
  els.modalMeaning.textContent = word.meaning;
  els.modalHindi.textContent = word.hindiMeaning;
  els.modalExample.textContent = `"${word.example}"`;
  if (word.exampleMeaning) {
    els.modalExampleMeaningRow.style.display = '';
    els.modalExampleMeaning.textContent = word.exampleMeaning;
  } else {
    els.modalExampleMeaningRow.style.display = 'none';
  }
  els.modalTrick.textContent = word.memoryTrick;
  els.modalActions.innerHTML = modalActionsHTML(word);

  els.wordModal.classList.add('open');
}

function closeModal() {
  els.wordModal.classList.remove('open');
  currentModalWord = null;
}

/* ---------------------------------------------------------
   Grammar detail modal
--------------------------------------------------------- */
function openGrammarModal(id) {
  const lesson = findGrammarById(id);
  if (!lesson) return;
  currentGrammarLesson = lesson;

  els.grammarModalCategory.textContent = lesson.category;
  els.grammarModalTitle.textContent = lesson.title;
  els.grammarModalExplanation.textContent = lesson.explanation;
  els.grammarModalRules.innerHTML = (lesson.rules || []).map((r) => `<li>${esc(r)}</li>`).join('');
  els.grammarModalExamples.innerHTML = (lesson.examples || [])
    .map((ex) => `<div class="example-item"><div class="ex-sentence">${esc(ex.sentence)}</div><div class="ex-meaning">${esc(ex.meaning)}</div></div>`)
    .join('');

  els.grammarModal.classList.add('open');
}

function closeGrammarModal() {
  els.grammarModal.classList.remove('open');
  currentGrammarLesson = null;
}

/* ---------------------------------------------------------
   Remember Mode (flashcard flow)
--------------------------------------------------------- */
function startMemorize(queue) {
  if (!queue.length) {
    showToast('No new words left today 🎉');
    return;
  }
  mem.queue = queue;
  mem.index = 0;
  els.memorizeOverlay.classList.add('open');
  showMemorizeCard();
}

function showMemorizeCard() {
  const word = mem.queue[mem.index];
  els.memProgressText.textContent = `Word ${mem.index + 1} of ${mem.queue.length}`;
  els.memWord.textContent = word.word;
  els.memRevealWord.textContent = word.word;
  els.memMeaning.textContent = word.meaning;
  els.memHindi.textContent = word.hindiMeaning;
  els.memQuestionBlock.classList.remove('hide');
  els.memRevealBlock.classList.remove('show');
}

function advanceMemorize() {
  mem.index += 1;
  if (mem.index < mem.queue.length) {
    showMemorizeCard();
  } else {
    finishMemorize();
  }
}

async function finishMemorize() {
  els.memorizeOverlay.classList.remove('open');
  showToast("Nice! You've gone through all of today's new words 🎉");
  await refreshAll();
}

function closeMemorize() {
  els.memorizeOverlay.classList.remove('open');
  refreshAll();
}

/* ---------------------------------------------------------
   Action dispatch (used by cards, review list, and modal)
--------------------------------------------------------- */
async function handleAction(id, action) {
  try {
    if (action === 'remember') {
      await api.remember(id);
      showToast('Marked as remembered 🎉');
    } else if (action === 'forgot') {
      await api.forgot(id);
      showToast('Moved to review');
    } else if (action === 'review-again') {
      await api.reviewAgain(id);
      showToast('Keep practicing — still in review');
    }
    await refreshAll();
  } catch (err) {
    showToast(err.message || 'Something went wrong');
  }
}

/* ---------------------------------------------------------
   Global click delegation
--------------------------------------------------------- */
function bindGlobalClicks() {
  document.addEventListener('click', (e) => {
    // Navigation (desktop nav, mobile nav, "See all" links)
    const navBtn = e.target.closest('[data-view]');
    if (navBtn) {
      showView(navBtn.dataset.view);
      return;
    }

    // Listen buttons
    const soundBtn = e.target.closest('.sound-btn');
    if (soundBtn) {
      e.stopPropagation();
      speak(soundBtn.dataset.word);
      soundBtn.classList.add('playing');
      setTimeout(() => soundBtn.classList.remove('playing'), 700);
      return;
    }

    // Action buttons (remember / forgot / review-again / open)
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      e.stopPropagation();
      const card = actionBtn.closest('[data-id]');
      if (!card) return;
      const id = card.dataset.id;
      const action = actionBtn.dataset.action;

      if (action === 'open') {
        openModalById(id);
        return;
      }

      const fromModal = !!actionBtn.closest('#wordModal');
      if (fromModal) closeModal();
      handleAction(id, action);
      return;
    }

    // Clicking a card/row body opens the detail modal
    const card = e.target.closest('.word-card, .mini-row, .review-card');
    if (card && card.dataset.id) {
      openModalById(card.dataset.id);
      return;
    }

    // Grammar cards open the grammar detail modal
    const gCard = e.target.closest('.grammar-card');
    if (gCard && gCard.dataset.id) {
      openGrammarModal(gCard.dataset.id);
      return;
    }

    // Close notification panel when clicking outside of it
    if (!e.target.closest('#notifPanel') && !e.target.closest('#notifBtn')) {
      toggleNotifPanel(true);
    }
  });
}

/* ---------------------------------------------------------
   Static bindings
--------------------------------------------------------- */
function bindStatic() {
  els.hamburgerBtn.addEventListener('click', () => els.mobileMenu.classList.toggle('open'));

  els.notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNotifPanel();
  });

  els.modalClose = $('modalClose');
  els.modalClose.addEventListener('click', closeModal);
  els.wordModal.addEventListener('click', (e) => {
    if (e.target === els.wordModal) closeModal();
  });
  els.modalListenBtn.addEventListener('click', () => {
    if (currentModalWord) speak(currentModalWord.word);
  });

  $('grammarModalClose').addEventListener('click', closeGrammarModal);
  els.grammarModal.addEventListener('click', (e) => {
    if (e.target === els.grammarModal) closeGrammarModal();
  });

  els.continueBtn.addEventListener('click', () => {
    const queue = (state.today?.words || []).filter((w) => w.status === 'new');
    startMemorize(queue);
  });

  els.startMemorizeBtn.addEventListener('click', () => {
    const queue = (state.today?.words || []).filter((w) => w.status === 'new');
    startMemorize(queue);
  });

  els.nextDayBtn.addEventListener('click', async () => {
    const mode = els.nextDayBanner.dataset.mode;
    const originalHTML = els.nextDayBtn.innerHTML;
    els.nextDayBtn.disabled = true;

    try {
      if (mode === 'ai') {
        els.nextDayBtn.innerHTML = `<span class="spinner"></span> Generating...`;
        const result = await api.generateNextDayWords();
        showToast(`AI wrote ${result.generated} new words for Day ${result.currentDay} 🎉`);
      } else {
        await api.nextDay();
        showToast('New words unlocked 🎉');
      }
      await refreshAll();
    } catch (err) {
      showToast(err.message);
      els.nextDayBtn.disabled = false;
      els.nextDayBtn.innerHTML = originalHTML;
    }
  });

  els.grammarGenerateBtn.addEventListener('click', async () => {
    const topic = els.grammarTopicInput.value.trim();
    if (!topic) {
      showToast('Type a grammar topic first.');
      return;
    }
    const originalHTML = els.grammarGenerateBtn.innerHTML;
    els.grammarGenerateBtn.disabled = true;
    els.grammarGenerateBtn.innerHTML = `<span class="spinner"></span> Generating...`;

    try {
      await api.generateGrammar(topic);
      showToast('New grammar lesson added 🎉');
      els.grammarTopicInput.value = '';
      await refreshAll();
    } catch (err) {
      showToast(err.message);
    } finally {
      els.grammarGenerateBtn.disabled = false;
      els.grammarGenerateBtn.innerHTML = originalHTML;
    }
  });

  els.grammarTopicInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') els.grammarGenerateBtn.click();
  });

  els.revealBtn.addEventListener('click', () => {
    els.memQuestionBlock.classList.add('hide');
    els.memRevealBlock.classList.add('show');
  });

  els.memYesBtn.addEventListener('click', async () => {
    const word = mem.queue[mem.index];
    els.memYesBtn.disabled = true;
    els.memNoBtn.disabled = true;
    els.memCard.classList.add('pop-check');
    try {
      await api.remember(word._id);
    } catch (err) {
      showToast(err.message);
    }
    setTimeout(() => {
      els.memCard.classList.remove('pop-check');
      els.memYesBtn.disabled = false;
      els.memNoBtn.disabled = false;
      advanceMemorize();
    }, 380);
  });

  els.memNoBtn.addEventListener('click', async () => {
    const word = mem.queue[mem.index];
    els.memYesBtn.disabled = true;
    els.memNoBtn.disabled = true;
    els.memCard.classList.add('shake');
    try {
      await api.forgot(word._id);
    } catch (err) {
      showToast(err.message);
    }
    setTimeout(() => {
      els.memCard.classList.remove('shake');
      els.memYesBtn.disabled = false;
      els.memNoBtn.disabled = false;
      advanceMemorize();
    }, 400);
  });

  $('memCloseBtn').addEventListener('click', closeMemorize);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeModal();
    closeGrammarModal();
    els.memorizeOverlay.classList.remove('open');
    toggleNotifPanel(true);
    els.mobileMenu.classList.remove('open');
  });
}

/* ---------------------------------------------------------
   Init
--------------------------------------------------------- */
async function init() {
  bindStatic();
  bindGlobalClicks();
  bindSearch();
  await refreshAll();
}

document.addEventListener('DOMContentLoaded', init);

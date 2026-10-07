// QUESTIONS and ESSAYS now live in questions.js so you can edit
// your quiz content without touching this file.

// ============================================================
//  SAVE / LOAD PROGRESS
//  Everything is kept in the browser's localStorage, so if the
//  page is refreshed (or closed and reopened) the player's name,
//  their answers and their score come back automatically.
//  To change what is stored, edit the saveProgress() function.
// ============================================================

const STORAGE_KEY = "fadQuiz.progress.v1";

function saveProgress() {
  const data = {
    name: playerName,
    email: playerEmail,
    howMet: howMet,
    screen: currentScreen,
    currentIndex: currentIndex,
    answers: answers,
    startedAt: startedAt,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage may be blocked (private mode) - the quiz still
    // works, it just will not survive a refresh.
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    /* ignore */
  }
}

// ---------- Build the combined quiz ----------
// Multiple-choice questions come first, then the essays. Each item
// gets a "type" so renderQuestion knows how to draw it.

const CHOICE_COUNT = QUESTIONS.length;

const ALL_ITEMS = [
  ...QUESTIONS.map((q) => ({ ...q, type: "choice" })),
  ...ESSAYS.map((e) => ({ ...e, type: "essay" })),
];

const TOTAL_ITEMS = ALL_ITEMS.length;

// ---------- Screen / element references ----------

const screens = {
  signin: document.getElementById("signin-screen"),
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
};

const signinForm = document.getElementById("signin-form");
const signinBtn = document.getElementById("signin-btn");
const nameInput = document.getElementById("player-name");
const emailInput = document.getElementById("player-email");
const metInput = document.getElementById("how-met");
const signinError = document.getElementById("signin-error");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const restartBtn = document.getElementById("restart-btn");
const signoutBtn = document.getElementById("signout-btn");
const signoutBtn2 = document.getElementById("signout-btn-2");

const welcomeName = document.getElementById("welcome-name");
const welcomeEmail = document.getElementById("welcome-email");
const welcomeMet = document.getElementById("welcome-met");

const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options");
const essayBox = document.getElementById("essay-box");
const essayInput = document.getElementById("essay-input");
const questionCounter = document.getElementById("question-counter");
const scoreCounter = document.getElementById("score-counter");
const progressBar = document.getElementById("progress-bar");
const feedback = document.getElementById("feedback");
const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const essayReview = document.getElementById("essay-review");

document.getElementById("total-questions").textContent = TOTAL_ITEMS;

// ---------- State ----------

let playerName = "";
let playerEmail = "";
let howMet = "";
let currentScreen = "signin";
let currentIndex = 0;
let answers = [];         // choice items: chosen option index (number)
                          // essay items: the typed text (string)
let startedAt = null;
let answered = false;

// ---------- Screen switching ----------

function showScreen(id) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[id].classList.add("active");
  currentScreen = id;
  saveProgress();
}

// ---------- Sign in ----------

function isValidEmail(value) {
  // Simple, deliberately lenient check: something@something.tld
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

async function handleSignIn(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  if (!name) {
    signinError.textContent = "Please enter your name first.";
    nameInput.focus();
    return;
  }

  const email = emailInput.value.trim();
  if (!email) {
    signinError.textContent = "Please enter your email.";
    emailInput.focus();
    return;
  }
  if (!isValidEmail(email)) {
    signinError.textContent = "That email doesn't look right. Please check it.";
    emailInput.focus();
    return;
  }

  playerName = name;
  playerEmail = email;
  howMet = metInput.value.trim();

  // Send the sign-in details to Web3Forms so you can see who played.
  signinError.textContent = "";
  signinBtn.disabled = true;
  signinBtn.textContent = "Sending…";

  const submitted = await submitToWeb3Forms({
    name: playerName,
    email: playerEmail,
    how_we_met: howMet,
  });

  signinBtn.disabled = false;
  signinBtn.textContent = "Continue";

  if (!submitted) {
    // Let the player continue even if the submission fails; the quiz
    // itself still works, they just may not appear in your results.
    signinError.textContent = "Saved locally, but the response could not be sent right now.";
  }

  welcomeName.textContent = playerName;
  welcomeEmail.textContent = playerEmail;
  welcomeMet.textContent = howMet || "—";

  if (!startedAt) startedAt = Date.now();
  showScreen("start");
}

// Posts a payload to the Web3Forms endpoint tied to the form.
// Returns true on success, false if the request failed.

async function submitToWeb3Forms(fields) {
  const accessKey = document.querySelector(
    '#signin-form input[name="access_key"]'
  );
  if (!accessKey) return false;

  const payload = {
    access_key: accessKey.value,
    subject: "New quiz player",
    from_name: "Fad' Quiz",
    ...fields,
  };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return !!(data && data.success);
  } catch (e) {
    return false;
  }
}

function signOut() {
  clearProgress();
  playerName = "";
  playerEmail = "";
  howMet = "";
  currentIndex = 0;
  answers = [];
  startedAt = null;
  nameInput.value = "";
  emailInput.value = "";
  metInput.value = "";
  signinError.textContent = "";
  showScreen("signin");
}

// ---------- Quiz ----------

function startQuiz() {
  currentIndex = 0;
  answers = [];
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const item = ALL_ITEMS[currentIndex];

  questionCounter.textContent = `Question ${currentIndex + 1} / ${TOTAL_ITEMS}`;
  scoreCounter.textContent = `Score: ${score()}`;
  progressBar.style.width = `${(currentIndex / TOTAL_ITEMS) * 100}%`;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.disabled = true;
  nextBtn.textContent = currentIndex === TOTAL_ITEMS - 1 ? "See Results" : "Next Question";

  questionText.textContent = item.question;

  // Back is only available after the first question.
  backBtn.disabled = currentIndex === 0;

  // Show only the panel that matches this question type.
  optionsBox.classList.add("hidden");
  essayBox.classList.add("hidden");

  if (item.type === "choice") {
    optionsBox.classList.remove("hidden");
    optionsBox.innerHTML = "";

    item.options.forEach((option, i) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.textContent = option;
      btn.addEventListener("click", () => selectAnswer(btn, i));
      optionsBox.appendChild(btn);
    });

    // If this question was already answered (e.g. when going back),
    // re-apply the choice so the player can review it.
    const saved = answers[currentIndex];
    if (saved !== null && saved !== undefined) {
      const buttons = Array.from(optionsBox.children);
      if (buttons[saved]) {
        selectAnswer(buttons[saved], saved);
      }
    }
  } else {
    essayBox.classList.remove("hidden");
    essayInput.value = typeof answers[currentIndex] === "string" ? answers[currentIndex] : "";
    essayInput.placeholder = item.placeholder || "Type your answer here…";
    // An essay counts as answered once the player has written something.
    markEssayAnswered();
  }
}

function selectAnswer(btn, choice) {
  if (answered) return;
  answered = true;

  const item = ALL_ITEMS[currentIndex];
  const optionButtons = Array.from(optionsBox.children);
  optionButtons.forEach((b) => (b.disabled = true));

  answers[currentIndex] = choice;

  if (choice === item.answer) {
    btn.classList.add("correct");
    feedback.textContent = "Correct!";
    feedback.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    optionButtons[item.answer].classList.add("correct");
    feedback.textContent = "Wrong! The correct answer is highlighted.";
    feedback.classList.add("wrong");
  }

  scoreCounter.textContent = `Score: ${score()}`;
  nextBtn.disabled = false;
  saveProgress();
}

function markEssayAnswered() {
  const hasText = essayInput.value.trim().length > 0;
  answered = hasText;
  nextBtn.disabled = !hasText;
  if (hasText) {
    feedback.textContent = "Answer saved.";
    feedback.className = "feedback saved";
  } else {
    feedback.textContent = "";
    feedback.className = "feedback";
  }
}

essayInput.addEventListener("input", () => {
  if (ALL_ITEMS[currentIndex] && ALL_ITEMS[currentIndex].type === "essay") {
    answers[currentIndex] = essayInput.value;
    markEssayAnswered();
    saveProgress();
  }
});

// Only multiple-choice questions are scored; essays are open-ended.

function score() {
  let total = 0;
  ALL_ITEMS.forEach((item, i) => {
    if (item.type === "choice") {
      const choice = answers[i];
      if (choice !== null && choice !== undefined && choice === item.answer) {
        total++;
      }
    }
  });
  return total;
}

function nextQuestion() {
  if (currentIndex < TOTAL_ITEMS - 1) {
    currentIndex++;
    saveProgress();
    renderQuestion();
    if (ALL_ITEMS[currentIndex].type === "essay") {
      essayInput.focus();
    }
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    saveProgress();
    renderQuestion();
  }
}

function showResults() {
  progressBar.style.width = "100%";
  const total = score();
  finalScore.textContent = `${total} / ${CHOICE_COUNT}`;

  const percent = CHOICE_COUNT ? (total / CHOICE_COUNT) * 100 : 0;
  if (percent === 100) {
    resultMessage.textContent = `Perfect score, ${playerName}! You know me too well.`;
  } else if (percent >= 60) {
    resultMessage.textContent = `Good job, ${playerName}! Keep practicing.`;
  } else {
    resultMessage.textContent = `Keep trying, ${playerName}. You'll get better.`;
  }

  renderEssayReview();
  submitResults();
  showScreen("result");
}

// Send the finished quiz (score + every answer) to Web3Forms so you
// can review what each player answered. Fire-and-forget: the player
// sees their results regardless of whether this succeeds.

function submitResults() {
  const lines = [];
  ALL_ITEMS.forEach((item, i) => {
    const label = `${i + 1}. ${item.question}`;
    if (item.type === "choice") {
      const chosen = answers[i];
      const choiceText =
        chosen !== null && chosen !== undefined && item.options[chosen]
          ? item.options[chosen]
          : "(no answer)";
      const correct = chosen === item.answer ? "CORRECT" : "WRONG";
      lines.push(`${label}\n   Answer: ${choiceText} (${correct})`);
    } else {
      lines.push(`${label}\n   Answer: ${(answers[i] || "").trim() || "(no answer)"}`);
    }
  });

  submitToWeb3Forms({
    name: playerName,
    email: playerEmail,
    how_we_met: howMet,
    score: `${score()} / ${CHOICE_COUNT}`,
    answers: lines.join("\n\n"),
  });
}

// List the essay questions with the player's answers side by side
// with your sample answers, so they can compare at the end.

function renderEssayReview() {
  essayReview.innerHTML = "";

  ALL_ITEMS.forEach((item, idx) => {
    if (item.type !== "essay") return;

    const playerAnswer = (answers[idx] || "").trim();

    const block = document.createElement("div");
    block.className = "essay-block";

    const q = document.createElement("p");
    q.className = "essay-review-q";
    q.textContent = item.question;
    block.appendChild(q);

    const yours = document.createElement("p");
    yours.className = "essay-review-a";
    yours.innerHTML = `<span class="essay-tag">You:</span> ${
      playerAnswer ? escapeHtml(playerAnswer) : "<em>(no answer)</em>"
    }`;
    block.appendChild(yours);

    const mine = document.createElement("p");
    mine.className = "essay-review-a sample";
    mine.innerHTML = `<span class="essay-tag">Me:</span> ${escapeHtml(item.sample)}`;
    block.appendChild(mine);

    essayReview.appendChild(block);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Restore a saved game ----------

function restore() {
  const data = loadProgress();
  if (!data || !data.name) {
    showScreen("signin");
    return;
  }

  playerName = data.name;
  playerEmail = data.email || "";
  howMet = data.howMet || "";
  currentIndex = Number(data.currentIndex) || 0;
  answers = Array.isArray(data.answers) ? data.answers : [];
  startedAt = data.startedAt || null;

  nameInput.value = playerName;
  emailInput.value = playerEmail;
  metInput.value = howMet;
  welcomeName.textContent = playerName;
  welcomeEmail.textContent = playerEmail;
  welcomeMet.textContent = howMet || "—";

  // Clamp the index so a stale save cannot point past the last question.
  if (currentIndex > TOTAL_ITEMS - 1) currentIndex = TOTAL_ITEMS - 1;

  if (data.screen === "quiz") {
    showScreen("quiz");
    // renderQuestion() already re-applies the saved answer for both
    // multiple-choice and essay questions.
    renderQuestion();
  } else if (data.screen === "result") {
    showScreen("result");
    const total = score();
    finalScore.textContent = `${total} / ${CHOICE_COUNT}`;
    const percent = CHOICE_COUNT ? (total / CHOICE_COUNT) * 100 : 0;
    if (percent === 100) {
      resultMessage.textContent = `Perfect score, ${playerName}! You know me too well.`;
    } else if (percent >= 60) {
      resultMessage.textContent = `Good job, ${playerName}! Keep practicing.`;
    } else {
      resultMessage.textContent = `Keep trying, ${playerName}. You'll get better.`;
    }
    renderEssayReview();
  } else {
    showScreen("start");
  }
}

// ---------- Events ----------

signinForm.addEventListener("submit", handleSignIn);
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
backBtn.addEventListener("click", prevQuestion);
restartBtn.addEventListener("click", () => showScreen("signin"));
signoutBtn.addEventListener("click", signOut);
signoutBtn2.addEventListener("click", signOut);

// Start where we left off (or at the sign-in screen the first time).
restore();

// ============================================================
//  FLOATING PIXEL OBJECTS
//  Spawns many random pixel-art objects that drift across the
//  background so it never looks static. Edit COUNT to change
//  how many objects are on screen, or edit the "pool" list to
//  change which objects appear (and how often).
// ============================================================

(function spawnPixelObjects() {
  const container = document.getElementById("bg-objects");
  if (!container) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Weighted pool: repeat a name to make it appear more often.
  const pool = [
    "coin", "coin", "coin", "coin",
    "star", "star", "star", "star",
    "diamond", "diamond", "diamond",
    "heart", "heart", "heart",
    "cloud", "cloud",
    "brick", "brick",
    "invader", "invader",
  ];

  const COUNT = 48;

  for (let i = 0; i < COUNT; i++) {
    const type = pool[Math.floor(Math.random() * pool.length)];

    // Wrapper handles the vertical drift.
    const obj = document.createElement("div");
    obj.className = "float-obj" + (Math.random() < 0.25 ? " down" : "");
    obj.style.left = (Math.random() * 100).toFixed(2) + "%";
    obj.style.setProperty("--tx", Math.round(Math.random() * 140) - 70 + "px");
    obj.style.opacity = (0.5 + Math.random() * 0.5).toFixed(2);

    // Middle layer holds the random size without animating, so the
    // drift transform on the wrapper is not overridden.
    const scaler = document.createElement("div");
    scaler.className = "scale-wrap";
    scaler.style.transform = "scale(" + (0.55 + Math.random() * 1.15).toFixed(2) + ")";

    // Inner shape does the spin / flip / wobble.
    const shape = document.createElement("div");
    shape.className = "shape " + type;

    if (reduced) {
      obj.style.animation = "none";
      obj.style.bottom = "auto";
      obj.style.top = (Math.random() * 85).toFixed(1) + "vh";
      shape.style.animation = "none";
    } else {
      const drift = 13 + Math.random() * 22;
      obj.style.animationDuration = drift.toFixed(1) + "s";
      obj.style.animationDelay = (-Math.random() * drift).toFixed(1) + "s";
      const spin = 2 + Math.random() * 5;
      shape.style.animationDuration = spin.toFixed(1) + "s";
      shape.style.animationDelay = (-Math.random() * spin).toFixed(1) + "s";
    }

    scaler.appendChild(shape);
    obj.appendChild(scaler);
    container.appendChild(obj);
  }
})();

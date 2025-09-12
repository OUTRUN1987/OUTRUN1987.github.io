// const { run } = require("@tauri-apps/cli");

const messages = [
  "Всем привет, чатик!",
  "А как игра называется?",
  "Боже, как же он хорош!",
  "ЧТО ЗА НАХЕР",
  "Игра говна",
  "Иди в жопу",
  "Стример тупой",
  "Кайф",
  "Ку",
  "Я кушать, не теряйте",
  "БАЛБЕС",
  "UwU UwU UwU Uwu"
];

const nicknames = ["Кто я?", "Лягушка", "Вася228", "xXx_НАГИБАТОР_xXx"];
const curseWords = ["тупой", "нахер", "говна", "жопу"];

let duration = localStorage.getItem("duration") || "medium";
let difficulty = localStorage.getItem("difficulty") || "medium";
let theme = localStorage.getItem("theme") || "terminal";

const durations = {
  short: 30_000,
  medium: 2 * 60 * 1000,
  long: 5 * 60 * 1000,
  extra: 10 * 60 * 1000,
  dev: 10_000
};

const difficulties = {
  easy: [3_000, 1_500],
  medium: [2_000, 1_000],
  hard: [1_000, 500],
  psycho: [500, 250]
};

let gameDuration = durations[duration];
let interval;
let stats = { success: 0, fail: 0, skipped: 0, reactionTimes: [] };
let played = false;


let lastCursedTime = null;
let lastMessage = null;
let isLastCursed = false;
let cursedAmount = 0;

function addMessage() {
  let msg = messages[Math.floor(Math.random() * messages.length)];
  let nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
  lastMessage = msg;

  isLastCursed = curseWords.some(c => msg.toLowerCase().includes(c));
  if (isLastCursed) {
    lastCursedTime = Date.now();
    cursedAmount++;
  }

  window.dispatchEvent(new CustomEvent("message-added", { detail: { nickname: nickname, msg: msg } }));
}

function moderateLastMessage() {
  if (isLastCursed) {
    stats.success++;
    if (lastCursedTime) {
      stats.reactionTimes.push(Date.now() - lastCursedTime);
    }
  } else {
    stats.fail++;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!played) {
      played = true;
      startGame();
      console.log("Game started");
      return;
    }
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("message-moderated"));

  }

  if (e.code === "Enter") {
    if (!played) {
      played = true;
      gameDuration = durations["dev"];
      startGame();
      return;
    }
  }
});

function endGame() {
  clearInterval(interval);

  stats.skipped = cursedAmount - stats.success;

  let avgReaction = stats.reactionTimes.length
    ? (stats.reactionTimes.reduce((a, b) => a + b, 0) / stats.reactionTimes.length).toFixed(0) + "мс"
    : "N/A";

  window.dispatchEvent(new CustomEvent("game-ended", {detail: { stats: stats, avgReaction: avgReaction }}));
}



function startGame() {
  let time = Math.random() * difficulties[difficulty][0];
  if (time < difficulties[difficulty][1]) {
    time += difficulties[difficulty][1];
  }

  interval = setInterval(() => {
    addMessage();
  }, time);

  setTimeout(endGame, gameDuration);
  startCountdown(gameDuration / 1000 - 1);
}
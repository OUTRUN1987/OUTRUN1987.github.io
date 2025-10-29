// const { run } = require("@tauri-apps/cli");

const messages = [
  // Обычные сообщения
  "Всем привет, чатик!",
  "А как игра называется?",
  "Боже, как же он хорош!",
  "Кайф",
  "Ку",
  "Я кушать, не теряйте",
  "БАЛБЕС",
  "UwU UwU UwU Uwu",
  "Первый раз на стриме",
  "Лайк если согласен",
  "Где донат?",
  "Красава!",
  "Топ стример",
  "Сколько тебе лет?",
  "Спасибо за стрим",
  "Го в дискорд",
  "Кто из Москвы?",
  "Ору с чата 😂",
  "GG WP",
  "Эпично",
  "Залетел на минутку",
  "Как дела, народ?",
  "Музон топ",
  "Мне нравится этот момент",
  "Жду продолжения",
  "Сделай громче",
  "F в чат",
  "Легенда",
  "Классный контент",
  "Подписался!",
  "Когда следующий стрим?",
  "Привет с Украины",
  "Cringe",
  "Based",
  "Рофл",
  "Кек",
  "POGGERS",
  "KEKW",
  "Монтаж топ",
  "Скилл конечно",
  "Уважаю",
  "Красавчик",
  "Го играть вместе",
  "Хороший вайб",
  "Полный отстой",
  
  // Матерные сообщения (примерно треть)
  "ЧТО ЗА НАХЕР",
  "Игра говна",
  "Иди в жопу",
  "Какая хрень",
  "Ты че дебил?",
  "Идиот чтоли",
  "Тупое видео",
  "Нахер это надо",
  "Отстойный стример",
  "Мразь ты",
  "Говно а не игра",
  "Дебильная озвучка",
  "Идиот",
  "Придурок ты вообще"
];

const nicknames = [
  "Кто я?", 
  "Лягушка", 
  "Вася228", 
  "xXx_НАГИБАТОР_xXx", 
  "Дюша",
  "Pr0_G4m3r",
  "Пет1шка",
  "xX_D4RK_L0RD_Xx",
  "NoObMaSt3R",
  "Б0Б0К",
  "КиберКотЛетка",
  "Dimych1337",
  "SaShaProfi228",
  "_S1LV3R_W0LF_",
  "Ма3ла",
  "D@rKn3sS",
  "ПростоНиктос",
  "Gh0stR1d3r",
  "Л3ntяй",
  "xXxR4mB0xXx",
  "Str1k3r_777",
  "Ж0pa",
  "Epic_Fail1337",
  "К3k_Pyc",
  "S0s1ska",
  "MrB00M",
  "Пацан_С_Раёна",
  "C4ptainObv1ous",
  "Tв0й_Б@тя"
];
const curseWords = [
  "тупой", 
  "нахер", 
  "говна", 
  "жопу", 
  "хрень", 
  "дебил", 
  "идиот", 
  "мразь", 
  "говно", 
  "дебильная", 
  "тупица", 
  "придурок",
  "идиот"
];

let duration = localStorage.getItem("duration") || "medium";
let difficulty = localStorage.getItem("difficulty") || "medium";
let theme = localStorage.getItem("theme") || "terminal";

const durations = {
  short: 30_000,
  medium: 60 * 1000,
  long: 2 * 60 * 1000,
  extra: 5 * 60 * 1000,
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
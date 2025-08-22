let maxHeight = 18;

window.addEventListener("game-ended", (e) => {
    const stats = e.detail.stats;
    const avgReaction = e.detail.avgReaction;
    const modal = document.getElementById("modal");

    const lines = [
        `Смена окончена!`,
        ``,
    ];

    if (stats.success > 0) {
        lines.push(`Ты правильно удалил ${stats.success} ${stats.success > 1 ? "сообщения" : "сообщение"}!`);
    } else {
        lines.push(`Представляешь, ни одного плохого сообщения`);
        lines.push(`в чате не было! Вот же повезло!`);
    }
    if (stats.fail > 0) {
        lines.push(`А вот ${stats.fail} ${stats.fail > 1 ? "сообщений" : "сообщение"} удалять не стоило...`);
    }
    if (stats.skipped > 0) {
        lines.push(`Ну и пропустил ты ${stats.skipped} ${stats.skipped > 1 ? "сообщений" : "сообщение"}.`);
    }

    lines.push(``);
    lines.push(`Среднее время реакции: ${avgReaction}`);
    lines.push(``);
    lines.push(`Удачи тебе, Модератор! UwU`);

    const width = Math.max(...lines.map(l => l.length)) + 2;

    const top = "┌" + "─".repeat(width) + "┐";
    const bottom = "└" + "─".repeat(width) + "┘";
    const content = lines.map(l => `│ ${l.padEnd(width - 1)}│`);

    modal.innerText = [top, ...content, bottom].join("\n");
    modal.style.display = "block";

    const sound = document.getElementById("clockend");
    sound.currentTime = 0;
    sound.play();
});

function hideWindow() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

window.addEventListener("message-added", (e) => {
    const nickname = e.detail.nickname;
    const msg = e.detail.msg;
    const frame = document.getElementById("terminal-frame");

    let lines = frame.innerText.split("\n");

    const top = lines.shift();
    const bottom = lines.pop();

    lines.splice(lines.length - 1, 0, `│   ${nickname.padEnd(lines[0].length - 6)} │`);
    lines.splice(lines.length - 1, 0, `│ > ${msg.padEnd(lines[0].length - 6)} │`);
    lines.splice(lines.length - 1, 0, `│${''.padEnd(lines[0].length - 2)}│`);

    while (lines.length > maxHeight) {
        lines.splice(2, 1);
    }

    frame.innerText = [top, ...lines, bottom].join("\n");

    const sound = document.getElementById("newmsg");
    sound.currentTime = 0;
    sound.play();
});

window.addEventListener("message-moderated", () => {
    const sound = document.getElementById("deletemsg");
    sound.currentTime = 0;
    sound.play();
});

function startCountdown(duration) {
    let timer = duration;
    const clock = document.getElementById("clock");

    const interval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        // Format with leading zeros
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        clock.innerHTML = minutes + "<span id='colon'>:</span>" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            clock.innerHTML = "00<span id='colon'>:</span>00";
        }
    }, 1000);
}

addEventListener("DOMContentLoaded", (event) => {
    let minutes = Math.floor(gameDuration / 1000 / 60);
    let seconds = gameDuration / 1000 % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    clock.innerHTML = minutes + "<span id='colon'>:</span>" + seconds;
})
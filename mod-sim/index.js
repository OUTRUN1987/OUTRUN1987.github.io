const duration = document.getElementById("duration");

duration.addEventListener("change", () => {
  switch (duration.value) {
    case "short":
      duration.style.background = "#4caf50"; // тёмно-зелёный
      duration.style.color = "#121212";      // светлый зелёный текст
      break;
    case "medium":
      duration.style.background = "#2196f3"; // тёмно-синий
      duration.style.color = "#121212";
      break;
    case "long":
      duration.style.background = "#ff9800"; // тёмно-оранжевый
      duration.style.color = "#121212";
      break;
    case "extra":
      duration.style.background = "#e91e63"; // фиолетовый
      duration.style.color = "#121212";
      break;
  }
});

const difficulty = document.getElementById("difficulty");

difficulty.addEventListener("change", () => {
  switch (difficulty.value) {
    case "easy":
      difficulty.style.background = "#4caf50"; // тёмно-зелёный
      difficulty.style.color = "#121212";      // светлый зелёный текст
      break;
    case "medium":
      difficulty.style.background = "#2196f3"; // тёмно-синий
      difficulty.style.color = "#121212";
      break;
    case "hard":
      difficulty.style.background = "#ff9800"; // тёмно-оранжевый
      difficulty.style.color = "#121212";
      break;
    case "psycho":
      difficulty.style.background = "#e91e63"; // фиолетовый
      difficulty.style.color = "#121212";
      break;
  }
});

const theme = document.getElementById("theme");

theme.addEventListener("change", () => {
  switch (theme.value) {
    case "terminal":
      theme.style.background = "#1e5f20ff"; // тёмно-зелёный
      theme.style.color = "#dfdfdf";      // светлый зелёный текст
      break;
    case "modern":
      theme.style.background = "#667eea"; // современный фиолетовый
      theme.style.color = "#ffffff";      // белый текст
      break;
  }
});
duration.value = localStorage.getItem("duration");
difficulty.value = localStorage.getItem("difficulty");
theme.value = localStorage.getItem("theme");

duration.dispatchEvent(new Event("change"));
difficulty.dispatchEvent(new Event("change"));
theme.dispatchEvent(new Event("change"));


function start() {
    localStorage.setItem("duration", duration.value);
    localStorage.setItem("difficulty", difficulty.value);
    localStorage.setItem("theme", theme.value);
    
    switch (localStorage.getItem("theme")) {
        case "terminal":
            window.location.href = "./terminal/terminal.html";
            break;
        case "modern":
            window.location.href = "./modern/modern.html";
            break;
    }
}
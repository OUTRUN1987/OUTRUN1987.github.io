let messageContainer;
let timerElement;
let startScreen;
let gameContainer;
let resultsModal;
let flagMode = false; // Initialize flagMode to false


document.addEventListener('DOMContentLoaded', function() {
    messageContainer = document.getElementById('chat-messages');
    timerElement = document.getElementById('timer');
    startScreen = document.getElementById('start-screen');
    gameContainer = document.getElementById('game-container');
    resultsModal = document.getElementById('results-modal');
    
    let minutes = Math.floor(gameDuration / 1000 / 60);
    let seconds = gameDuration / 1000 % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (timerElement) {
        timerElement.textContent = minutes + ":" + seconds;
    }
    console.log("DOM fully loaded and parsed");
});

function toggleFlagMode() {
    const checkbox = document.getElementById('flagModeToggle');
    flagMode = checkbox.checked;
    console.log(`Flag mode set to: ${flagMode}`);
}

function customStart() {
    console.log("Custom start button clicked");
    
    // Get the flag mode setting from the start screen
    const startToggle = document.getElementById('flagModeToggle');
    flagMode = startToggle.checked;
    
    // Hide start screen and show game
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    
    // Clear any existing messages
    messageContainer.innerHTML = '';
    updateTimer(gameDuration / 1000);
    
    // Set played to true to prevent spacebar from starting again
    played = true;
    
    // Trigger the actual game start
    triggerGameStart();
}

function triggerGameStart() {
    // Start the game logic from game.js
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

function updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function addMessageToChat(nickname, msg, isCursed = false) {
    console.log(`Adding message: ${msg} (Cursed: ${isCursed})`);
    const messageDiv = document.createElement('div');
    if (flagMode) {
        messageDiv.className = `message ${isCursed ? 'flagged' : 'normal'}`;
    } else {
        messageDiv.className = 'message normal';
    }

    messageDiv.innerHTML = `
        <div class="message-author">${nickname}</div>
        <div class="message-content">${msg}</div>
        <div class="message-time">${getCurrentTime()}</div>
    `;
    
    messageContainer.insertBefore(messageDiv, messageContainer.firstChild);
    
    const messages = messageContainer.children;
    if (messages.length > 8) {
        messageContainer.removeChild(messages[messages.length - 1]);
    }
    
    messageContainer.scrollTop = 0;
}

function showModeratedEffect() {
    const firstMessage = messageContainer.firstElementChild;
    if (firstMessage) {
        firstMessage.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (firstMessage.parentNode) {
                firstMessage.remove();
            }
        }, 300);
    }
}

function showResults(stats, avgReaction) {
    const statsGrid = document.getElementById('stats-grid');
    
    const accuracy = stats.success + stats.fail > 0 
        ? Math.round((stats.success / (stats.success + stats.fail)) * 100) 
        : 0;
    
    statsGrid.innerHTML = `
        <div class="stat-item">
            <div class="stat-value" style="color: var(--success);">${stats.success}</div>
            <div class="stat-label">Правильно удалено</div>
        </div>
        <div class="stat-item">
            <div class="stat-value" style="color: var(--danger);">${stats.fail}</div>
            <div class="stat-label">Неверно удалено</div>
        </div>
        <div class="stat-item">
            <div class="stat-value" style="color: var(--warning);">${stats.skipped}</div>
            <div class="stat-label">Пропущено</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${accuracy}%</div>
            <div class="stat-label">Точность</div>
        </div>
    `;
    
    if (avgReaction !== 'N/A') {
        statsGrid.innerHTML += `
            <div class="stat-item" style="grid-column: span 2;">
                <div class="stat-value" style="color: var(--primary);">${avgReaction}</div>
                <div class="stat-label">Среднее время реакции</div>
            </div>
        `;
    }
    
    resultsModal.style.display = 'flex';
}

// Game event listeners
window.addEventListener('game-ended', (e) => {
    const stats = e.detail.stats;
    const avgReaction = e.detail.avgReaction;
    
    setTimeout(() => {
        showResults(stats, avgReaction);
    }, 500);
});

window.addEventListener('message-added', (e) => {
    const nickname = e.detail.nickname;
    const msg = e.detail.msg;
    
    // Check if message contains curse words to determine styling
    const isCursed = curseWords.some(word => 
        msg.toLowerCase().includes(word.toLowerCase())
    );
    
    addMessageToChat(nickname, msg, isCursed);
});

window.addEventListener('message-moderated', () => {
    showModeratedEffect();
    moderateLastMessage(); // Call the function from game.js
});

// Timer countdown function
function startCountdown(duration) {
    let timer = duration;
    
    const interval = setInterval(() => {
        updateTimer(timer);
        
        if (--timer < 0) {
            clearInterval(interval);
            updateTimer(0);
        }
    }, 1000);
}

// Add some CSS animations for the moderation effect
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .message.moderated {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
        color: white;
        transform: scale(0.95);
    }
`;
document.head.appendChild(style);

// Override the spacebar game start for modern theme
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !played) {
        // Prevent the default game.js spacebar handler
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger our custom start instead
        customStart();
        return false;
    }
}, true); // Use capture phase to handle before game.js

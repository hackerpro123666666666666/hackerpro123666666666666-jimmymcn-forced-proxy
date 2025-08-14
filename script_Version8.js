// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tab => tab.style.display = 'none');
        btn.classList.add('active');
        const tab = document.getElementById(btn.dataset.tab);
        if(tab) tab.style.display = '';
    });
});

// Set default tab
(function() {
    const firstTab = document.querySelector('.tab-btn');
    if(firstTab) {
        firstTab.classList.add('active');
        const tab = document.getElementById(firstTab.dataset.tab);
        if(tab) tab.style.display = '';
    }
})();

// ========== Games Tab ==========
const gameUrls = {
    'retro-bowl': 'games/retro-bowl/index.html',
    'tetris': 'games/tetris/index.html',
    '2048': 'games/2048/index.html',
    'snake': 'games/snake/index.html',
    'pong': 'games/pong/index.html',
    'flappy-bird': 'games/flappy-bird/index.html'
};

const gameBtns = document.querySelectorAll('.game-tab-btn');
const gameFrame = document.getElementById('game-frame');

if(gameBtns && gameFrame) {
    gameBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gameBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const game = btn.getAttribute('data-game');
            if(gameUrls[game]) {
                gameFrame.src = gameUrls[game];
                gameFrame.title = btn.textContent;
            }
        });
    });
}

// ========== Proxy Form ==========
const proxyForm = document.getElementById('proxy-form');
const proxyQuery = document.getElementById('proxy-query');
const proxyFrame = document.getElementById('proxy-frame');
const engineNote = document.getElementById('engine-note');
const engineName = document.getElementById('engine-name');

// Supported engines
const engines = {
    duckduckgo: {
        name: "DuckDuckGo",
        search: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
    },
    google: {
        name: "Google",
        search: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`
    }
};

function getEngine() {
    return localStorage.getItem('searchEngine') || 'duckduckgo';
}
function setEngine(engine) {
    localStorage.setItem('searchEngine', engine);
}
function updateEngineNote() {
    const engine = getEngine();
    if(engineName) engineName.textContent = engines[engine].name;
}

// On form submit, update iframe
if(proxyForm && proxyQuery && proxyFrame) {
    proxyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const q = proxyQuery.value.trim();
        if(!q) return;
        let url = q;
        // Simple URL detection
        if(!/^https?:\/\//i.test(url) && !url.includes('.') && engines[getEngine()]) {
            // Treat as search term
            url = engines[getEngine()].search(q);
        } else if(!/^https?:\/\//i.test(url) && url.includes('.')) {
            url = 'https://' + url;
        }
        proxyFrame.src = url;
    });
}

// Show current engine on load
updateEngineNote();

// ========== Settings Tab ==========
const settingsForm = document.getElementById('settings-form');
const engineSelect = document.getElementById('search-engine-select');

if(engineSelect) {
    // Set select to saved engine
    engineSelect.value = getEngine();
    // On change, save engine
    if(settingsForm) {
        settingsForm.addEventListener('submit', function(e){
            e.preventDefault();
            const val = engineSelect.value;
            setEngine(val);
            updateEngineNote();
            alert('Search engine saved!');
        });
    }
}

// ========== Dark/Light Mode ==========
const themeToggle = document.getElementById('theme-toggle');
function setTheme(dark) {
    if(dark) {
        document.body.classList.add('dark');
        if(themeToggle) themeToggle.textContent = '☀️';
        localStorage.setItem('theme','dark');
    } else {
        document.body.classList.remove('dark');
        if(themeToggle) themeToggle.textContent = '🌙';
        localStorage.setItem('theme','light');
    }
}
if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark'));
    });
}
// On load, set theme from storage
(function(){
    const theme = localStorage.getItem('theme');
    setTheme(theme === 'dark');
})();

// ========== Optional: Apps tab does not need special JS ==========
// The "Apps" tab uses plain HTML buttons with window.open, no extra JS needed for its shortcuts.

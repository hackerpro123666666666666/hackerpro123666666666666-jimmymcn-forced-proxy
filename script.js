// Theme toggle logic
const themeBtn = document.getElementById('theme-toggle');
const htmlBody = document.body;
function setTheme(dark) {
    if(dark) {
        htmlBody.classList.add('dark');
        themeBtn.textContent = '☀️';
    } else {
        htmlBody.classList.remove('dark');
        themeBtn.textContent = '🌙';
    }
}
themeBtn.addEventListener('click', () => {
    const dark = !htmlBody.classList.contains('dark');
    setTheme(dark);
    localStorage.setItem('theme', dark ? "dark" : "light");
});
(function(){
    const saved = localStorage.getItem('theme');
    if(saved) {
        setTheme(saved === "dark");
    } else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme(true);
    }
})();

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tabContents.forEach(tc => tc.style.display = 'none');
        document.getElementById(btn.dataset.tab).style.display = '';
    });
});
tabBtns[0].classList.add('active');
tabContents[0].style.display = '';

// Search engine state
function getEngine() {
    return localStorage.getItem('searchEngine') || 'duckduckgo';
}
function setEngine(val) {
    localStorage.setItem('searchEngine', val);
}
function engineName(val) {
    return val === 'google' ? 'Google' : 'DuckDuckGo';
}
function updateEngineNote() {
    document.getElementById('engine-name').textContent = engineName(getEngine());
}
updateEngineNote();

// Proxy form logic
const proxyForm = document.getElementById('proxy-form');
const proxyQueryInput = document.getElementById('proxy-query');
const proxyFrame = document.getElementById('proxy-frame');
proxyForm.addEventListener('submit', e => {
    e.preventDefault();
    let query = proxyQueryInput.value.trim();
    let engine = getEngine();
    let url;
    if (/^(https?:\/\/)/i.test(query)) {
        url = query;
    } else {
        if (engine === 'duckduckgo') {
            url = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
        } else if (engine === 'google') {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        }
    }
    proxyFrame.src = url;
});

// Game tab logic
const gameTabs = document.querySelectorAll('.game-tab-btn');
const gameFrame = document.getElementById('game-frame');
// Map of games to their embed paths
const gameUrls = {
    'retro-bowl': 'games/retro-bowl/index.html',
    'tetris': 'games/tetris/index.html',
    '2048': 'games/2048/index.html'
};
gameTabs.forEach(btn => {
    btn.addEventListener('click', () => {
        gameTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        let game = btn.dataset.game;
        let url = gameUrls[game];
        gameFrame.src = url;
    });
});
// Default: load Retro Bowl
gameFrame.src = gameUrls['retro-bowl'];

// Settings logic
const settingsForm = document.getElementById('settings-form');
const searchEngineSelect = document.getElementById('search-engine-select');
searchEngineSelect.value = getEngine();
settingsForm.addEventListener('submit', e => {
    e.preventDefault();
    setEngine(searchEngineSelect.value);
    updateEngineNote();
    alert('Search engine updated!');
});

// --- Techstack Demos ---

// 1. Chrome Tabs Demo
window.openChromeTabsDemo = function() {
    const container = document.getElementById('tech-demo-container');
    container.innerHTML = `
        <h4>Chrome Tabs Demo</h4>
        <div id="chrome-tabs-demo" style="background:#222;border-radius:8px;padding:16px;max-width:500px;overflow-x:auto;">
            <div id="tabs-bar" style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px;"></div>
            <button onclick="addTab()">+ New Tab</button>
            <div id="tab-content" style="margin-top:1em;color:#fff;">Select a tab.</div>
        </div>
        <button onclick="closeDemo()">Close Demo</button>
    `;
    let tabs = [{title:"Tab 1", content:"Hello from Tab 1!"}];
    let active = 0;
    function renderTabs() {
        const bar = document.getElementById('tabs-bar');
        bar.innerHTML = "";
        tabs.forEach((t, i) => {
            let d = document.createElement('div');
            d.textContent = t.title;
            d.style = `padding:6px 12px;background:${i===active?'#4f8cff':'#444'};color:#fff;border-radius:6px;cursor:pointer;margin-right:2px;display:inline-flex;align-items:center;user-select:none;`;
            d.onclick = ()=>{active=i;renderTabs();};
            let closeBtn = document.createElement('span');
            closeBtn.textContent = " ×";
            closeBtn.style = "margin-left:7px;cursor:pointer;color:#ff6a00;";
            closeBtn.onclick = (e)=>{e.stopPropagation();tabs.splice(i,1);if(active>=tabs.length)active=tabs.length-1;renderTabs();};
            d.append(closeBtn);
            bar.append(d);
            // Dragabilly support
            new Dragabilly(d);
        });
        document.getElementById('tab-content').innerHTML = tabs[active]?.content||"No tabs open.";
    }
    window.addTab = function() {
        tabs.push({title:`Tab ${tabs.length+1}`, content:`Hello from Tab ${tabs.length+1}!`});
        active = tabs.length-1;
        renderTabs();
    }
    window.closeDemo = function() { container.innerHTML = ""; }
    renderTabs();
}

// 2. JSZip Demo
window.openJSZipDemo = function() {
    const container = document.getElementById('tech-demo-container');
    container.innerHTML = `
        <h4>JSZip Demo</h4>
        <p>Create a ZIP file in the browser and download it.</p>
        <button id="zip-btn">Create ZIP</button>
        <button onclick="closeDemo()">Close Demo</button>
        <a id="zip-link" style="margin-left:1em;display:none;" download="demo.zip">Download ZIP</a>
    `;
    document.getElementById('zip-btn').onclick = function() {
        let zip = new JSZip();
        zip.file("hello.txt", "This is a demo file!");
        zip.generateAsync({type:"blob"}).then(function(content){
            const link = document.getElementById('zip-link');
            link.href = URL.createObjectURL(content);
            link.style.display = "";
        });
    }
    window.closeDemo = function() { container.innerHTML = ""; }
}

// 3. JSCookie Demo
window.openJSCookieDemo = function() {
    const container = document.getElementById('tech-demo-container');
    container.innerHTML = `
        <h4>JS-cookie Demo</h4>
        <input id="cookie-key" placeholder="cookie name" style="margin-right:7px;">
        <input id="cookie-val" placeholder="cookie value" style="margin-right:7px;">
        <button onclick="setDemoCookie()">Set Cookie</button>
        <button onclick="getDemoCookie()">Get Cookie</button>
        <button onclick="closeDemo()">Close Demo</button>
        <div id="cookie-demo-result" style="margin-top:1em;"></div>
    `;
    window.setDemoCookie = function() {
        Cookies.set(document.getElementById('cookie-key').value, document.getElementById('cookie-val').value);
        document.getElementById('cookie-demo-result').textContent = "Cookie set!";
    }
    window.getDemoCookie = function() {
        document.getElementById('cookie-demo-result').textContent =
            "Cookie value: " + Cookies.get(document.getElementById('cookie-key').value);
    }
    window.closeDemo = function() { container.innerHTML = ""; }
}

// 4. Dragabilly Demo
window.openDragabillyDemo = function() {
    const container = document.getElementById('tech-demo-container');
    container.innerHTML = `
        <h4>Dragabilly Demo</h4>
        <div id="dragbox" style="width:90px;height:90px;background:#4f8cff;color:#fff;display:flex;align-items:center;justify-content:center;cursor:move;border-radius:10px;">Drag me!</div>
        <button onclick="closeDemo()">Close Demo</button>
    `;
    setTimeout(()=>{ new Dragabilly('#dragbox'); }, 50);
    window.closeDemo = function() { container.innerHTML = ""; }
}

// 5. Localforage Demo
window.openLocalforageDemo = function() {
    const container = document.getElementById('tech-demo-container');
    container.innerHTML = `
        <h4>Localforage Demo</h4>
        <input id="lf-key" placeholder="key" style="margin-right:7px;">
        <input id="lf-val" placeholder="value" style="margin-right:7px;">
        <button onclick="saveLF()">Save</button>
        <button onclick="loadLF()">Load</button>
        <button onclick="closeDemo()">Close Demo</button>
        <div id="lf-result" style="margin-top:1em;"></div>
    `;
    window.saveLF = function() {
        localforage.setItem(document.getElementById('lf-key').value, document.getElementById('lf-val').value).then(function(){
            document.getElementById('lf-result').textContent = "Saved!";
        });
    }
    window.loadLF = function() {
        localforage.getItem(document.getElementById('lf-key').value).then(function(val){
            document.getElementById('lf-result').textContent = "Loaded value: " + (val === null ? "(not set)" : val);
        });
    }
    window.closeDemo = function() { container.innerHTML = ""; }
}

// 6. Iro.js Demo
window.openIroDemo = function() {
    const container = document.getElementById('tech-demo-container');
    container.innerHTML = `
        <h4>Iro.js Color Picker Demo</h4>
        <div id="iro-picker"></div>
        <div id="color-result" style="margin-top:1em;"></div>
        <button onclick="closeDemo()">Close Demo</button>
    `;
    const picker = new iro.ColorPicker("#iro-picker", {
        width: 200,
        color: "#4f8cff"
    });
    picker.on('color:change', function(color){
        document.getElementById('color-result').textContent = "Hex: "+color.hexString;
    });
    window.closeDemo = function() { container.innerHTML = ""; }
}

// 7. FilerJS Demo (browser-only, basic/virtual)
window.openFilerDemo = function() {
    const container = document.getElementById('tech-demo-container');
    container.innerHTML = `
        <h4>FilerJS Demo (virtual FS)</h4>
        <button onclick="makeFile()">Create File</button>
        <button onclick="readFile()">Read File</button>
        <button onclick="closeDemo()">Close Demo</button>
        <div id="filer-result" style="margin-top:1em;"></div>
    `;
    // Use localStorage as a fake filesystem for this demo
    window.makeFile = function() {
        localStorage.setItem('filer-demo-file', 'Hello, virtual filesystem!');
        document.getElementById('filer-result').textContent = "File created!";
    }
    window.readFile = function() {
        var content = localStorage.getItem('filer-demo-file');
        document.getElementById('filer-result').textContent = "Read file: " + (content || "(no file)");
    }
    window.closeDemo = function() { container.innerHTML = ""; }
}

const samplingData = {
    modules: [
        {
            id: "sampling-basics",
            title: "Sampling Strategies",
            sections: [
                {
                    title: "Sampling Fundamentals",
                    type: "flip-cards",
                    cards: [
                        { frontTitle: "Understanding Sampling", frontText: "Why can't we check every single pixel?", backTitle: "Population vs Sample", backText: "Checking every pixel is impossible due to cost and time; we must use representative subsets." },
                        { frontTitle: "Stratified vs Random", frontText: "How do strategies differ in rare classes?", backTitle: "Class Representation", backText: "Stratified sampling ensures minority classes get adequate points, preventing them from being missed." }
                    ]
                }
            ]
        },
        {
            id: "pixel-grid-sim",
            title: "Pixel Grid Simulation",
            sections: [
                {
                    title: "Interactive Pixel Grid Sampling Simulator",
                    type: "pixel-grid-simulator"
                }
            ]
        },
        {
            id: "drag-match-game",
            title: "Sampling Drag & Match Game",
            sections: [
                {
                    title: "Sampling Methods Match (10 Statements & 5-Min Timer)",
                    type: "drag-match-game"
                }
            ]
        },
        {
            id: "sample-size-calc",
            title: "Sample Size Calculator",
            sections: [
                {
                    title: "Interactive Sample Size Simulator",
                    type: "calculator"
                }
            ]
        },
        {
            id: "sampling-quiz",
            title: "Quiz: Sampling",
            sections: [
                {
                    title: "Sampling Self-Assessment",
                    type: "timed-quiz",
                    questions: [
                        { q: "Which sampling method guarantees representation of rare classes?", options: ["Simple Random", "Stratified Random", "Systematic Grid", "Cluster"], answer: 1, timer: 30, explanation: "Stratified random sampling divides the area by class strata, guaranteeing representation for rare classes." }
                    ]
                }
            ]
        }
    ]
};

// --- RENDERER 1: Pixel Grid Simulation ---
// --- PAGE 2: Interactive Pixel Grid Simulation Module ---

function renderPixelGridSimulator(container) {
    container.innerHTML += `
        <div class="space-y-6 mt-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            
            <!-- Instructions Header -->
            <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                <h4 class="font-bold text-blue-900 text-base mb-1">📖 How to Use This Simulation:</h4>
                <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
                    <li><strong>Choose a Strategy:</strong> Select between Simple Random, Stratified Random, or Systematic Grid sampling using the buttons below.</li>
                    <li><strong>Analyze the Distribution:</strong> Observe how sample points (marked with <span class="font-bold text-yellow-600">✓</span>) land across different land cover classes (Forest, Water, Urban, Agriculture).</li>
                    <li><strong>Compare Representation:</strong> Note how random sampling might miss smaller classes, whereas stratified sampling guarantees balanced representation!</li>
                </ol>
            </div>

            <!-- Controls Panel -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <span class="text-xs font-bold text-slate-500 uppercase">Strategy 1</span>
                    <button onclick="runPixelSim('random')" class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow transition">
                        🎲 Simple Random
                    </button>
                    <p class="text-xs text-slate-500 mt-2">Equal chance for any pixel across the board.</p>
                </div>

                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <span class="text-xs font-bold text-slate-500 uppercase">Strategy 2</span>
                    <button onclick="runPixelSim('stratified')" class="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow transition">
                        📐 Stratified Random
                    </button>
                    <p class="text-xs text-slate-500 mt-2">Guarantees proportional samples per class.</p>
                </div>

                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                    <span class="text-xs font-bold text-slate-500 uppercase">Strategy 3</span>
                    <button onclick="runPixelSim('systematic')" class="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow transition">
                        📏 Systematic Grid
                    </button>
                    <p class="text-xs text-slate-500 mt-2">Uniform spatial spacing across the grid.</p>
                </div>
            </div>

            <!-- Legend Bar -->
            <div class="flex flex-wrap items-center justify-center gap-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                <span class="flex items-center gap-1.5"><div class="w-3.5 h-3.5 bg-emerald-600 rounded"></div> Forest</span>
                <span class="flex items-center gap-1.5"><div class="w-3.5 h-3.5 bg-blue-600 rounded"></div> Water</span>
                <span class="flex items-center gap-1.5"><div class="w-3.5 h-3.5 bg-red-600 rounded"></div> Urban</span>
                <span class="flex items-center gap-1.5"><div class="w-3.5 h-3.5 bg-yellow-500 rounded"></div> Agriculture</span>
                <span class="flex items-center gap-1.5"><div class="w-3.5 h-3.5 border-2 border-yellow-500 bg-slate-900 rounded"></div> Sampled Pixel (✓)</span>
            </div>

            <!-- Landscape Grid Canvas -->
            <div class="flex justify-center bg-slate-900 p-6 rounded-2xl shadow-inner">
                <div id="pixel-grid-canvas-container" class="grid grid-cols-12 gap-1 bg-slate-950 p-4 rounded-xl border border-slate-700"></div>
            </div>

            <!-- Real-time Feedback & Breakdown Stats -->
            <div id="pixel-sim-stats" class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium">
                👉 Click any of the three sampling buttons above to begin the simulation.
            </div>
        </div>
    `;
    
    // Initialize grid layout upon rendering
    setTimeout(initPixelGridDataset, 50);
}

// Global data states for the grid simulation
let landscapeGridData = [];
let sampledPixelKeys = new Set();

function initPixelGridDataset() {
    landscapeGridData = [];
    sampledPixelKeys.clear();
    const gridEl = document.getElementById('pixel-grid-canvas-container');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const landTypes = ['forest', 'water', 'urban', 'agri'];
    
    // Generate a 12x12 simulated population grid
    for (let r = 0; r < 12; r++) {
        landscapeGridData[r] = [];
        for (let c = 0; c < 12; c++) {
            // Create clustered realistic patterns
            let type;
            if (r < 4 && c < 4) type = 'forest';
            else if (r > 8 && c > 8) type = 'urban';
            else if (r === 5 || c === 5) type = 'water';
            else type = landTypes[Math.floor(Math.random() * landTypes.length)];

            landscapeGridData[r][c] = type;
            
            const cell = document.createElement('div');
            cell.id = `px-${r}-${c}`;
            cell.className = `w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                type === 'forest' ? 'bg-emerald-600 text-white' :
                type === 'water' ? 'bg-blue-600 text-white' :
                type === 'urban' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-slate-900'
            }`;
            cell.textContent = "";
            
            // Allow manual clicking to toggle individual pixels
            cell.onclick = () => {
                const key = `${r}-${c}`;
                if (sampledPixelKeys.has(key)) {
                    sampledPixelKeys.delete(key);
                    cell.style.border = "none";
                    cell.innerHTML = "";
                } else {
                    sampledPixelKeys.add(key);
                    cell.style.border = "3px solid #fbbf24";
                    cell.innerHTML = "✓";
                }
                updatePixelStatsText("Manual Custom Sampling");
            };
            
            gridEl.appendChild(cell);
        }
    }
}

function runPixelSim(strategy) {
    sampledPixelKeys.clear();
    initPixelGridDataset(); // Reset cell visuals

    let descriptionText = "";

    if (strategy === 'random') {
        // Simple Random: Drop 16 random points across the 144 pixels
        while (sampledPixelKeys.size < 16) {
            let r = Math.floor(Math.random() * 12);
            let c = Math.floor(Math.random() * 12);
            sampledPixelKeys.add(`${r}-${c}`);
        }
        descriptionText = `<strong>🎲 Simple Random Sampling (n=16):</strong> Points are scattered totally at random across the landscape. Notice how some land classes receive many samples while others might be underrepresented due to random chance.`;
    
    } else if (strategy === 'stratified') {
        // Stratified Random: Force equal samples per land type
        const types = ['forest', 'water', 'urban', 'agri'];
        types.forEach(type => {
            let matches = [];
            for (let r = 0; r < 12; r++) {
                for (let c = 0; c < 12; c++) {
                    if (landscapeGridData[r][c] === type) matches.push(`${r}-${c}`);
                }
            }
            // Shuffle matches
            matches.sort(() => Math.random() - 0.5);
            // Take up to 4 samples per stratum
            for (let i = 0; i < Math.min(4, matches.length); i++) {
                sampledPixelKeys.add(matches[i]);
            }
        });
        descriptionText = `<strong>📐 Stratified Random Sampling:</strong> The landscape was divided into strata by land cover class. Equal samples were forced into every class group, preventing rare categories from being missed.`;
    
    } else if (strategy === 'systematic') {
        // Systematic Grid: Every 3rd row and column
        for (let r = 1; r < 12; r += 3) {
            for (let c = 1; c < 12; c += 3) {
                sampledPixelKeys.add(`${r}-${c}`);
            }
        }
        descriptionText = `<strong>📏 Systematic Grid Sampling:</strong> Points are laid out in a strict geometric grid pattern at regular spatial intervals across the entire map region.`;
    }

    // Apply visual checkmarks to selected sample points
    sampledPixelKeys.forEach(key => {
        let cell = document.getElementById(`px-${key}`);
        if (cell) {
            cell.style.border = "3px solid #fbbf24";
            cell.innerHTML = "✓";
        }
    });

    updatePixelStatsText(descriptionText);
}

function updatePixelStatsText(strategyTitle) {
    const statsEl = document.getElementById('pixel-sim-stats');
    if (!statsEl) return;

    let counts = { forest: 0, water: 0, urban: 0, agri: 0 };
    sampledPixelKeys.forEach(key => {
        let [r, c] = key.split('-').map(Number);
        let t = landscapeGridData[r][c];
        if (counts[t] !== undefined) counts[t]++;
    });

    statsEl.innerHTML = `
        <div class="space-y-2">
            <p>${strategyTitle}</p>
            <div class="flex flex-wrap gap-4 text-xs font-bold pt-2 border-t border-slate-200">
                <span class="text-slate-600">Total Samples (n): <span class="text-slate-900">${sampledPixelKeys.size}</span></span>
                <span class="text-emerald-700">Forest Samples: ${counts.forest}</span>
                <span class="text-blue-700">Water Samples: ${counts.water}</span>
                <span class="text-red-700">Urban Samples: ${counts.urban}</span>
                <span class="text-yellow-700">Agri Samples: ${counts.agri}</span>
            </div>
        </div>
    `;
}


// --- RENDERER 2: Drag & Match Game (10 Statements & 5-Min Timer) ---
let dragGameInterval = null;
let timeLeft = 300; // 5 minutes
let matchedCount = 0;

function renderDragMatchGame(container) {
    timeLeft = 300;
    matchedCount = 0;

    container.innerHTML += `
        <div class="space-y-6 mt-4">
            <div class="flex flex-col md:flex-row justify-between items-center bg-slate-900 text-white p-4 rounded-2xl shadow">
                <div class="text-lg font-bold">⏱️ Time Left: <span id="drag-timer" class="text-yellow-400">05:00</span></div>
                <div class="text-lg font-bold">🎯 Matched: <span id="drag-score" class="text-emerald-400">0</span> / 10</div>
                <button onclick="startDragGameTimer()" class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">Start / Restart Game</button>
            </div>

            <p class="text-sm text-slate-600 font-medium">Click a statement below, then click either the <strong>Random Sampling</strong> box or <strong>Stratified Sampling</strong> box to match it!</p>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Statements Pool -->
                <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-800 mb-3">Unmatched Statements</h4>
                    <div id="statement-pool" class="space-y-2 max-h-96 overflow-y-auto pr-2"></div>
                </div>

                <!-- Drop Zones -->
                <div class="space-y-4">
                    <div onclick="dropStatement('random')" class="bg-orange-50 border-2 border-dashed border-orange-400 p-5 rounded-2xl cursor-pointer hover:bg-orange-100 transition min-h-[180px]">
                        <h4 class="font-bold text-orange-900 text-lg mb-1">🎲 Random Sampling Zone</h4>
                        <p class="text-xs text-orange-700 mb-3">Click here to assign selected statement to Random Sampling</p>
                        <div id="zone-random" class="space-y-2"></div>
                    </div>

                    <div onclick="dropStatement('stratified')" class="bg-red-50 border-2 border-dashed border-red-400 p-5 rounded-2xl cursor-pointer hover:bg-red-100 transition min-h-[180px]">
                        <h4 class="font-bold text-red-900 text-lg mb-1">📐 Stratified Sampling Zone</h4>
                        <p class="text-xs text-red-700 mb-3">Click here to assign selected statement to Stratified Sampling</p>
                        <div id="zone-stratified" class="space-y-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    initDragGameData();
}

let statementsList = [
    { id: 1, text: "Points are selected anywhere, completely random", category: "random", matched: false },
    { id: 2, text: "Points are selected randomly but within each class/stratum", category: "stratified", matched: false },
    { id: 3, text: "Class representation may be uneven across subsets", category: "random", matched: false },
    { id: 4, text: "Guarantees balanced representation for all classes", category: "stratified", matched: false },
    { id: 5, text: "Accuracy estimate can be biased if minority classes are missed", category: "random", matched: false },
    { id: 6, text: "Produces more accurate and reliable standard error estimates", category: "stratified", matched: false },
    { id: 7, text: "Simple implementation with minimal prior stratification needed", category: "random", matched: false },
    { id: 8, text: "Requires prior map data to define strata boundaries", category: "stratified", matched: false },
    { id: 9, text: "High variance possible when sampling rare land covers", category: "random", matched: false },
    { id: 10, text: "Optimal allocation reduces overall standard error", category: "stratified", matched: false }
];

let selectedCardId = null;

function initDragGameData() {
    statementsList.forEach(s => s.matched = false);
    matchedCount = 0;
    renderStatementPool();
}

function renderStatementPool() {
    const pool = document.getElementById('statement-pool');
    const rZone = document.getElementById('zone-random');
    const sZone = document.getElementById('zone-stratified');
    if (!pool) return;

    pool.innerHTML = '';
    rZone.innerHTML = '';
    sZone.innerHTML = '';

    statementsList.forEach(item => {
        if (!item.matched) {
            const div = document.createElement('div');
            div.className = `p-3 bg-white rounded-xl border cursor-pointer text-sm font-medium shadow-sm transition ${selectedCardId === item.id ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-slate-200 hover:bg-slate-100'}`;
            div.textContent = item.text;
            div.onclick = () => { selectedCardId = item.id; renderStatementPool(); };
            pool.appendChild(div);
        } else {
            const matchDiv = document.createElement('div');
            matchDiv.className = `p-2.5 rounded-lg text-xs font-semibold ${item.category === 'random' ? 'bg-orange-100 text-orange-900 border border-orange-300' : 'bg-red-100 text-red-900 border border-red-300'}`;
            matchDiv.textContent = `✓ ${item.text}`;
            if (item.category === 'random') rZone.appendChild(matchDiv);
            else sZone.appendChild(matchDiv);
        }
    });

    document.getElementById('drag-score').textContent = matchedCount;
}

function dropStatement(targetCategory) {
    if (selectedCardId === null) {
        alert("Please select a statement from the left panel first!");
        return;
    }
    const item = statementsList.find(s => s.id === selectedCardId);
    if (item && item.category === targetCategory) {
        item.matched = true;
        matchedCount++;
        selectedCardId = null;
        renderStatementPool();
        
        if (matchedCount === 10) {
            clearInterval(dragGameInterval);
            alert("🏆 Congratulations! You successfully matched all 10 statements!");
            // Log score into user profile
            if (!userScores[currentStudent]) userScores[currentStudent] = {};
            userScores[currentStudent]["sampling_drag_game"] = 20;
            localStorage.setItem("gis_user_scores", JSON.stringify(userScores));
            updateScoreDisplay();
        }
    } else {
        alert("❌ Incorrect category for this statement! Try the other zone.");
    }
}

function startDragGameTimer() {
    if (dragGameInterval) clearInterval(dragGameInterval);
    timeLeft = 300;
    initDragGameData();
    
    dragGameInterval = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        let s = (timeLeft % 60).toString().padStart(2, '0');
        const timerEl = document.getElementById('drag-timer');
        if (timerEl) timerEl.textContent = `${m}:${s}`;

        if (timeLeft <= 0) {
            clearInterval(dragGameInterval);
            alert("⏰ Time's up! Try again to complete all matches.");
        }
    }, 1000);
}

const calculationData = {
    modules: [
        {
            id: "error-metrics",
            title: "Accuracy Calculation",
            sections: [
                {
                    title: "Errors & Accuracies Explained",
                    type: "text-block",
                    content: "Omission errors occur when reference pixels are missed by the classifier (measured by Producer's Accuracy). Commission errors occur when pixels are falsely included in a class (measured by User's Accuracy). Overall accuracy and Kappa evaluate global map quality."
                }
            ]
        },
        {
            id: "classification-tool",
            title: "Interactive Matrix Tool",
            sections: [
                {
                    title: "Interactive Map Classification & Sampling Simulator",
                    type: "classification-simulator"
                }
            ]
        }
    ]
};

// Global simulator state variables
let gridSize = 15;
let classes = ['forest', 'water', 'urban', 'agriculture', 'grassland'];
let classNames = ['Forest', 'Water Bodies', 'Urban Areas', 'Agriculture', 'Grassland'];
let classColors = {
    'forest': { bg: 'bg-emerald-50', text: 'text-emerald-800', bar: 'bg-emerald-600' },
    'water': { bg: 'bg-blue-50', text: 'text-blue-800', bar: 'bg-blue-600' },
    'urban': { bg: 'bg-red-50', text: 'text-red-800', bar: 'bg-red-600' },
    'agriculture': { bg: 'bg-yellow-50', text: 'text-yellow-800', bar: 'bg-yellow-600' },
    'grassland': { bg: 'bg-lime-50', text: 'text-lime-800', bar: 'bg-lime-600' }
};

let classifiedGrid = [];
let referenceGrid = [];
let sampledCells = new Set();

function renderClassificationSimulator(container) {
    // Inject the complete layout into the modular container
    container.innerHTML += `
        <div class="space-y-8 mt-4">
            <!-- Top Grids & Controls Grid -->
            <div class="grid xl:grid-cols-12 gap-6">
                <!-- Classified Map -->
                <div class="xl:col-span-4 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
                    <h4 class="text-xl font-bold text-slate-800 mb-1">Classified Map</h4>
                    <p class="text-xs text-slate-500 mb-4 font-medium">Automated classification result (click cells to sample)</p>
                    <div class="flex justify-center overflow-x-auto">
                        <div id="classified-map" class="grid-container inline-grid border-2 border-slate-700 rounded-lg shadow-md bg-white"></div>
                    </div>
                </div>

                <!-- Ground Truth Map -->
                <div class="xl:col-span-4 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
                    <h4 class="text-xl font-bold text-slate-800 mb-1">Ground Truth (Reference)</h4>
                    <p class="text-xs text-slate-500 mb-4 font-medium">Actual land cover from field validation</p>
                    <div class="flex justify-center overflow-x-auto">
                        <div id="reference-map" class="grid-container inline-grid border-2 border-slate-700 rounded-lg shadow-md bg-white"></div>
                    </div>
                </div>

                <!-- Controls & Strategy Panel -->
                <div class="xl:col-span-4 space-y-4">
                    <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-md text-center">
                        <h4 class="text-sm font-semibold opacity-90 uppercase tracking-wider">Samples Collected</h4>
                        <div id="sample-count" class="text-5xl font-extrabold my-2">0</div>
                        <p class="text-xs opacity-80">Click cells or use strategies below</p>
                    </div>

                    <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                        <h4 class="font-bold text-slate-800 text-lg mb-2">Sampling Strategies</h4>
                        <button onclick="sampleRandom(10)" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-sm">Random Sampling (n=10)</button>
                        <button onclick="sampleRandom(30)" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-sm">Random Sampling (n=30)</button>
                        <button onclick="sampleStratified()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-sm">Stratified Random (10/class)</button>
                        <button onclick="sampleSystematic()" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-sm">Systematic Grid Sampling</button>
                        <button onclick="resetAllMaps()" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-sm">🔄 Reset All (New Maps)</button>
                        <button onclick="clearSamplesOnly()" class="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-sm">Clear Samples Only</button>
                    </div>
                </div>
            </div>

            <!-- Overall Accuracy Display Card -->
            <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 text-center shadow-lg">
                <h4 class="text-xl font-medium text-slate-300 mb-2">Overall Accuracy</h4>
                <div id="overall-accuracy" class="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-4">--%</div>
                <div class="max-w-xl mx-auto bg-slate-700 rounded-full h-4 overflow-hidden mb-3">
                    <div id="overall-bar" class="bg-gradient-to-r from-emerald-500 to-blue-500 h-full transition-all duration-500" style="width: 0%"></div>
                </div>
                <p id="accuracy-interpretation" class="text-sm font-medium text-slate-300">Collect samples to calculate accuracy metrics</p>
            </div>

            <!-- Confusion Matrix & Metrics Grid -->
            <div class="grid xl:grid-cols-2 gap-6">
                <!-- Confusion Matrix Table -->
                <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
                    <h4 class="text-xl font-bold text-slate-800 mb-4">Confusion Matrix</h4>
                    <table class="w-full border-collapse text-sm">
                        <thead>
                            <tr class="bg-slate-200 text-slate-700">
                                <th class="border border-slate-300 p-2 font-bold">Classified ↓ / Reference →</th>
                                <th class="border border-slate-300 p-2 bg-emerald-100 text-emerald-900">Forest</th>
                                <th class="border border-slate-300 p-2 bg-blue-100 text-blue-900">Water</th>
                                <th class="border border-slate-300 p-2 bg-red-100 text-red-900">Urban</th>
                                <th class="border border-slate-300 p-2 bg-yellow-100 text-yellow-900">Agri</th>
                                <th class="border border-slate-300 p-2 bg-lime-100 text-lime-900">Grass</th>
                            </tr>
                        </thead>
                        <tbody id="matrix-body">
                            <tr><td colspan="6" class="text-center p-6 text-slate-400 italic">Collect samples to generate confusion matrix</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Metrics Panel (Producer's, User's, Kappa) -->
                <div class="space-y-6">
                    <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h4 class="text-xl font-bold text-slate-800 mb-2">Producer's Accuracy (%)</h4>
                        <div id="producer-accuracy" class="space-y-2"><p class="text-slate-400 italic text-sm">No data yet</p></div>
                    </div>
                    <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h4 class="text-xl font-bold text-slate-800 mb-2">User's Accuracy (%)</h4>
                        <div id="user-accuracy" class="space-y-2"><p class="text-slate-400 italic text-sm">No data yet</p></div>
                    </div>
                    <div class="bg-gradient-to-br from-indigo-700 to-purple-800 text-white rounded-2xl p-6 shadow-sm">
                        <h4 class="text-lg font-bold mb-1">Kappa Coefficient (κ)</h4>
                        <div id="kappa" class="text-4xl font-extrabold mb-2">--</div>
                        <p class="text-xs opacity-90">Measures agreement beyond chance (&gt;0.80 = Almost Perfect)</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize map data and render grid UI
    initializeGrids();
    updateSimulatorDisplay();
}

function initializeGrids() {
    classifiedGrid = [];
    referenceGrid = [];
    sampledCells.clear();

    for (let i = 0; i < gridSize; i++) {
        referenceGrid[i] = [];
        classifiedGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            let classIdx;
            if (i < 5 && j < 5) classIdx = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * classes.length);
            else if (i > 10 && j > 10) classIdx = Math.random() < 0.6 ? 2 : Math.floor(Math.random() * classes.length);
            else classIdx = Math.floor(Math.random() * classes.length);
            
            referenceGrid[i][j] = classes[classIdx];

            // 80% accuracy match simulation
            if (Math.random() < 0.80) {
                classifiedGrid[i][j] = referenceGrid[i][j];
            } else {
                let ref = referenceGrid[i][j];
                let err = ref === 'forest' ? 'grassland' : (ref === 'urban' ? 'water' : classes[Math.floor(Math.random() * classes.length)]);
                classifiedGrid[i][j] = err;
            }
        }
    }
}

function renderGridUI(grid, containerId, clickable = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 35px)`;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${grid[i][j]}`;
            cell.style.width = '35px';
            cell.style.height = '35px';
            cell.style.border = '1px solid #334155';
            cell.style.cursor = clickable ? 'pointer' : 'default';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            
            if (sampledCells.has(`${i},${j}`)) {
                cell.classList.add('sampled');
                cell.style.border = '3px solid #fbbf24';
                cell.innerHTML = '<span style="color:white; font-weight:bold; font-size:14px;">✓</span>';
            }

            if (clickable) {
                cell.onclick = () => {
                    const key = `${i},${j}`;
                    if (sampledCells.has(key)) sampledCells.delete(key);
                    else sampledCells.add(key);
                    updateSimulatorDisplay();
                };
            }
            container.appendChild(cell);
        }
    }
}

function sampleRandom(n) {
    sampledCells.clear();
    while (sampledCells.size < n) {
        let r = Math.floor(Math.random() * gridSize);
        let c = Math.floor(Math.random() * gridSize);
        sampledCells.add(`${r},${c}`);
    }
    updateSimulatorDisplay();
}

function sampleStratified() {
    sampledCells.clear();
    classes.forEach(targetClass => {
        let matching = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (classifiedGrid[i][j] === targetClass) matching.push(`${i},${j}`);
            }
        }
        matching.sort(() => Math.random() - 0.5);
        for (let k = 0; k < Math.min(6, matching.length); k++) {
            sampledCells.add(matching[k]);
        }
    });
    updateSimulatorDisplay();
}

function sampleSystematic() {
    sampledCells.clear();
    for (let i = 1; i < gridSize; i += 3) {
        for (let j = 1; j < gridSize; j += 3) {
            sampledCells.add(`${i},${j}`);
        }
    }
    updateSimulatorDisplay();
}

function clearSamplesOnly() {
    sampledCells.clear();
    updateSimulatorDisplay();
}

function resetAllMaps() {
    initializeGrids();
    updateSimulatorDisplay();
}

function computeMatrixMetrics() {
    if (sampledCells.size === 0) return null;

    let matrix = {};
    classes.forEach(c => {
        matrix[c] = {};
        classes.forEach(r => { matrix[c][r] = 0; });
    });

    let correct = 0;
    sampledCells.forEach(key => {
        let [r, c] = key.split(',').map(Number);
        let cls = classifiedGrid[r][c];
        let ref = referenceGrid[r][c];
        matrix[cls][ref]++;
        if (cls === ref) correct++;
    });

    let overallAcc = (correct / sampledCells.size * 100).toFixed(1);
    let producerAcc = {}, userAcc = {};

    classes.forEach(cls => {
        let refTotal = 0, classTotal = 0;
        classes.forEach(c => {
            refTotal += matrix[c][cls];
            classTotal += matrix[cls][c];
        });
        producerAcc[cls] = refTotal > 0 ? (matrix[cls][cls] / refTotal * 100).toFixed(1) : 0;
        userAcc[cls] = classTotal > 0 ? (matrix[cls][cls] / classTotal * 100).toFixed(1) : 0;
    });

    let n = sampledCells.size;
    let po = correct / n;
    let pe = 0;
    classes.forEach(cls => {
        let rowSum = 0, colSum = 0;
        classes.forEach(c => {
            rowSum += matrix[cls][c];
            colSum += matrix[c][cls];
        });
        pe += (rowSum / n) * (colSum / n);
    });
    let kappa = pe < 1 ? ((po - pe) / (1 - pe)).toFixed(3) : '1.000';

    return { matrix, overallAccuracy: overallAcc, producerAcc, userAcc, kappa };
}

function updateSimulatorDisplay() {
    renderGridUI(classifiedGrid, 'classified-map', true);
    renderGridUI(referenceGrid, 'reference-map', false);

    const countEl = document.getElementById('sample-count');
    if (countEl) countEl.textContent = sampledCells.size;

    const res = computeMatrixMetrics();
    if (!res) return;

    document.getElementById('overall-accuracy').textContent = res.overallAccuracy + '%';
    document.getElementById('overall-bar').style.width = res.overallAccuracy + '%';
    document.getElementById('accuracy-interpretation').textContent = res.overallAccuracy >= 80 ? '✅ Excellent classification quality' : '⚠️ Acceptable classification quality';
    document.getElementById('kappa').textContent = res.kappa;

    // Build confusion matrix table
    let mHtml = '';
    classes.forEach((cls, i) => {
        mHtml += `<tr><th class="border border-slate-300 p-2 bg-slate-100 text-left font-bold ${classColors[cls].text}">${classNames[i]}</th>`;
        classes.forEach((ref, j) => {
            let val = res.matrix[cls][ref];
            let match = cls === ref;
            mHtml += `<td class="border border-slate-300 p-2 text-center font-semibold ${match ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'}">${val}</td>`;
        });
        mHtml += `</tr>`;
    });
    document.getElementById('matrix-body').innerHTML = mHtml;

    // Producer's & User's accuracy bars
    let pHtml = '', uHtml = '';
    classes.forEach((cls, i) => {
        pHtml += `<div class="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-sm"><span class="font-semibold text-slate-700">${classNames[i]}</span><span class="font-bold text-emerald-600">${res.producerAcc[cls]}%</span></div>`;
        uHtml += `<div class="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 text-sm"><span class="font-semibold text-slate-700">${classNames[i]}</span><span class="font-bold text-blue-600">${res.userAcc[cls]}%</span></div>`;
    });
    document.getElementById('producer-accuracy').innerHTML = pHtml;
    document.getElementById('user-accuracy').innerHTML = uHtml;
}

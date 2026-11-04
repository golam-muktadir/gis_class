const assessmentData = {
    modules: [
        {
            id: "error-matrix-worksheet",
            title: "Error Matrix Worksheet & Assessment",
            sections: [
                {
                    title: "Interactive Confusion Matrix & Metrics Calculation",
                    type: "advanced-error-worksheet"
                },
                {
                    title: "Assessment",
                    type: "timed-quiz",
                    questions: [
                        { 
                            q: "What does a Kappa coefficient of 0.75 indicate?", 
                            options: ["Poor agreement", "Moderate agreement", "Substantial agreement", "Almost perfect agreement"], 
                            answer: 2, 
                            timer: 30, 
                            explanation: "A Kappa value between 0.60 and 0.80 represents substantial agreement beyond chance." 
                        },
                        { 
                            q: "If a classifier labels 15 non-urban pixels as urban, what type of error is this?", 
                            options: ["Omission Error", "Commission Error", "Sampling Error", "Random Error"], 
                            answer: 1, 
                            explanation: "Commission error occurs when pixels are falsely included into a class they do not belong to (User's Accuracy perspective)." 
                        }
                    ]
                }
            ]
        }
    ]
};

// --- Advanced Error Matrix Worksheet Renderer ---
function renderAdvancedErrorWorksheet(container) {
    container.innerHTML += `
        <div class="space-y-6 mt-4">
            <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                <h4 class="font-bold text-blue-900 text-base mb-1">📊 Advanced Accuracy Assessment Worksheet</h4>
                <p class="text-sm text-blue-800">Fill in or verify the pixel counts for the multi-class confusion matrix below based on your reference data. The live engine will instantly compute Omission/Commission errors, Producer's/User's Accuracies, Overall Accuracy, and the Kappa Coefficient.</p>
            </div>

            <!-- Matrix Input Table -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <h4 class="font-bold text-slate-800 text-lg mb-3">Confusion Matrix Data Entry</h4>
                <table class="w-full border-collapse text-sm text-center">
                    <thead>
                        <tr class="bg-slate-100 text-slate-700">
                            <th class="border border-slate-300 p-2 text-left font-bold">Classified ↓ / Reference →</th>
                            <th class="border border-slate-300 p-2 bg-emerald-50">Forest</th>
                            <th class="border border-slate-300 p-2 bg-blue-50">Water</th>
                            <th class="border border-slate-300 p-2 bg-red-50">Urban</th>
                            <th class="border border-slate-300 p-2 bg-yellow-50">Agriculture</th>
                            <th class="border border-slate-300 p-2 bg-amber-50">Barren</th>
                            <th class="border border-slate-300 p-2 bg-teal-50">Wetlands</th>
                        </tr>
                    </thead>
                    <tbody id="editable-matrix-body">
                        <!-- Dynamically generated rows -->
                    </tbody>
                </table>
                <div class="mt-4 flex gap-4">
                    <button onclick="calculateWorksheetMetrics()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow">Compute Metrics</button>
                    <button onclick="resetWorksheetMatrix()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm">Reset Default Values</button>
                </div>
            </div>

            <!-- Computed Results Dashboard -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-slate-900 text-white p-5 rounded-2xl shadow">
                    <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Overall Accuracy</span>
                    <div id="ws-overall" class="text-3xl font-extrabold text-emerald-400 mt-2">--%</div>
                </div>
                <div class="bg-slate-900 text-white p-5 rounded-2xl shadow">
                    <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Kappa Coefficient ($\kappa$)</span>
                    <div id="ws-kappa" class="text-3xl font-extrabold text-blue-400 mt-2">--</div>
                </div>
                <div class="bg-slate-900 text-white p-5 rounded-2xl shadow">
                    <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Samples ($n$)</span>
                    <div id="ws-total-n" class="text-3xl font-extrabold text-yellow-400 mt-2">0</div>
                </div>
                <div class="bg-slate-900 text-white p-5 rounded-2xl shadow">
                    <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Correct Pixels</span>
                    <div id="ws-correct" class="text-3xl font-extrabold text-purple-400 mt-2">0</div>
                </div>
            </div>

            <!-- Detailed Metrics Breakdown Table -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <h4 class="font-bold text-slate-800 text-lg mb-3">Class-Level Performance & Error Breakdown</h4>
                <table class="w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-slate-100 text-slate-700">
                            <th class="border border-slate-300 p-2.5 text-left">Class Name</th>
                            <th class="border border-slate-300 p-2.5 text-center">Producer's Acc.</th>
                            <th class="border border-slate-300 p-2.5 text-center">Omission Error</th>
                            <th class="border border-slate-300 p-2.5 text-center">User's Acc.</th>
                            <th class="border border-slate-300 p-2.5 text-center">Commission Error</th>
                        </tr>
                    </thead>
                    <tbody id="ws-breakdown-body">
                        <tr><td colspan="5" class="text-center p-4 text-slate-400 italic">Click "Compute Metrics" to generate breakdown.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    setTimeout(initWorksheetGrid, 50);
}

const wsClasses = ['Forest', 'Water', 'Urban', 'Agriculture', 'Barren', 'Wetlands'];
let wsMatrixData = [
    [45, 2,  1,  3,  0,  1],
    [1,  50, 0,  0,  0,  2],
    [2,  1,  38, 4,  3,  0],
    [4,  0,  2,  42, 1,  0],
    [0,  0,  2,  1,  35, 2],
    [1,  3,  0,  0,  1,  40]
];

function initWorksheetGrid() {
    const tbody = document.getElementById('editable-matrix-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    wsClasses.forEach((rowName, rIdx) => {
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.className = "border border-slate-300 p-2 text-left font-bold text-slate-700 bg-slate-50";
        th.textContent = rowName;
        tr.appendChild(th);

        wsClasses.forEach((colName, cIdx) => {
            let td = document.createElement('td');
            td.className = "border border-slate-300 p-1.5";
            let input = document.createElement('input');
            input.type = "number";
            input.min = "0";
            input.value = wsMatrixData[rIdx][cIdx];
            input.className = "w-16 p-1.5 text-center border rounded font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none";
            input.id = `cell-${rIdx}-${cIdx}`;
            td.appendChild(input);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    calculateWorksheetMetrics();
}

function calculateWorksheetMetrics() {
    let size = wsClasses.length;
    let matrix = [];
    let totalN = 0;
    let correctCount = 0;

    for (let r = 0; r < size; r++) {
        matrix[r] = [];
        for (let c = 0; c < size; c++) {
            let val = parseInt(document.getElementById(`cell-${r}-${c}`).value) || 0;
            matrix[r][c] = val;
            totalN += val;
            if (r === c) correctCount += val;
        }
    }

    if (totalN === 0) {
        alert("Total sample size cannot be zero.");
        return;
    }

    let overallAcc = (correctCount / totalN * 100).toFixed(2);
    document.getElementById('ws-overall').textContent = overallAcc + '%';
    document.getElementById('ws-total-n').textContent = totalN;
    document.getElementById('ws-correct').textContent = correctCount;

    // Calculate Kappa
    let po = correctCount / totalN;
    let pe = 0;
    for (let i = 0; i < size; i++) {
        let rowSum = 0, colSum = 0;
        for (let j = 0; j < size; j++) {
            rowSum += matrix[i][j];
            colSum += matrix[j][i];
        }
        pe += (rowSum / totalN) * (colSum / totalN);
    }
    let kappa = pe < 1 ? ((po - pe) / (1 - pe)).toFixed(3) : '1.000';
    document.getElementById('ws-kappa').textContent = kappa;

    // Breakdown table calculation
    let breakdownHtml = '';
    wsClasses.forEach((className, i) => {
        let rowTotal = matrix[i].reduce((a, b) => a + b, 0);
        let colTotal = 0;
        for (let r = 0; r < size; r++) colTotal += matrix[r][i];

        let diag = matrix[i][i];
        let prodAcc = colTotal > 0 ? (diag / colTotal * 100).toFixed(1) : '0.0';
        let omErr = (100 - parseFloat(prodAcc)).toFixed(1);
        
        let userAcc = rowTotal > 0 ? (diag / rowTotal * 100).toFixed(1) : '0.0';
        let commErr = (100 - parseFloat(userAcc)).toFixed(1);

        breakdownHtml += `
            <tr class="border-b hover:bg-slate-50">
                <td class="border border-slate-300 p-2.5 font-bold text-slate-800">${className}</td>
                <td class="border border-slate-300 p-2.5 text-center font-semibold text-emerald-600">${prodAcc}%</td>
                <td class="border border-slate-300 p-2.5 text-center text-red-600">${omErr}%</td>
                <td class="border border-slate-300 p-2.5 text-center font-semibold text-blue-600">${userAcc}%</td>
                <td class="border border-slate-300 p-2.5 text-center text-orange-600">${commErr}%</td>
            </tr>
        `;
    });
    document.getElementById('ws-breakdown-body').innerHTML = breakdownHtml;

    // Log score update
    if (typeof currentStudent !== 'undefined' && currentStudent) {
        if (!userScores[currentStudent]) userScores[currentStudent] = {};
        userScores[currentStudent]["error_worksheet_completed"] = 25;
        localStorage.setItem("gis_user_scores", JSON.stringify(userScores));
        if (typeof updateScoreDisplay === 'function') updateScoreDisplay();
    }
}

function resetWorksheetMatrix() {
    initWorksheetGrid();
}

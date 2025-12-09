// --- Elements ---
const views = {
    analyze: document.getElementById('view-analyze'),
    build: document.getElementById('view-build'),
    profile: document.getElementById('view-profile')
};
// const analyzeHeader = document.getElementById('analyze-header');
const uploadForm = document.getElementById('upload-form');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const resultsContent = document.getElementById('results-content');
const resumePreview = document.getElementById('resume-preview');

// --- Navigation Logic ---
window.navigateTo = function(viewId) {
    // Hide all views
    Object.values(views).forEach(el => el.classList.add('hidden'));
    
    // Show selected view
    if(views[viewId]) {
        views[viewId].classList.remove('hidden');
    }
    
    // Reset specific states if going back to analyze
    if(viewId === 'analyze' && !resultsSection.classList.contains('hidden')) {
        // If results are already showing, keep them. Otherwise ensure form is visible.
    }
}

// --- Theme Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

if (localStorage.getItem('theme') === 'dark' || 
   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
}

themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
});


// --- Analysis Logic ---
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('file-input').files[0];
    if (!file) { alert("Please select a file."); return; }

    // 1. UI Transition: Hide Header & Form, Show Loading
    // analyzeHeader.classList.add('hidden');
    uploadForm.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    // 2. Setup Resume Preview (Left Side)
    const reader = new FileReader();
    reader.onload = function(e) {
        resumePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    const formData = new FormData(uploadForm);
    formData.append('f', file);

    try {
        const response = await fetch('http://localhost:8000/api/analyze', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Analysis failed');
        const data = await response.json();
        
        renderDashboard(data.res);

        // 3. UI Transition: Show Results
        loadingSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('flex'); // Ensure flex layout is active

    } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
        // Reset UI on error
        // analyzeHeader.classList.remove('hidden');
        uploadForm.classList.remove('hidden');
        loadingSection.classList.add('hidden');
    }
});

// --- Dashboard Builder ---
function renderDashboard(feedback) {
    resultsContent.innerHTML = '';
    
    resultsContent.innerHTML += renderSummary(feedback);
    resultsContent.innerHTML += renderATS(feedback.ATS);
    resultsContent.innerHTML += renderDetails(feedback);

    resultsContent.innerHTML += `
        <div class="mt-8 text-center pb-8">
             <button onclick="location.reload()" class="bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full font-bold hover:bg-blue-100 transition shadow-sm">
                Analyze Another Resume
            </button>
        </div>
    `;
    
    initAccordions();
}

function renderSummary(feedback) {
    const categories = [
        { title: 'Tone & Style', score: feedback.toneAndStyle.score },
        { title: 'Content', score: feedback.content.score },
        { title: 'Structure', score: feedback.structure.score },
        { title: 'Skills', score: feedback.skills.score },
    ];

    const categoryRows = categories.map(cat => {
        const colorClass = cat.score > 70 ? 'text-green-600' : cat.score > 49 ? 'text-yellow-600' : 'text-red-600';
        const badgeBg = cat.score > 70 ? 'bg-green-100 text-green-800' : cat.score > 49 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
        const icon = cat.score > 70 ? 'check.svg' : 'warning.svg';

        return `
            <div class="flex flex-row justify-between items-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl mb-3">
                <div class="flex items-center gap-3">
                    <p class="text-lg font-medium text-gray-700 dark:text-gray-200">${cat.title}</p>
                    <div class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${badgeBg}">
                        <img src="public/icons/${icon}" class="w-3 h-3" />
                        <span>${cat.score}/100</span>
                    </div>
                </div>
                <p class="text-xl font-bold ${colorClass}">${cat.score}/100</p>
            </div>
        `;
    }).join('');

    return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-6">
            <div class="flex flex-col md:flex-row items-center gap-8 mb-8">
                ${renderGauge(feedback.overallScore)}
                <div class="flex flex-col gap-1 text-center md:text-left">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Your Resume Score</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Calculated based on 4 key metrics.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${categoryRows}
            </div>
        </div>
    `;
}

function renderGauge(score) {
    const radius = 40;
    const circumference = Math.PI * radius;
    const percentage = score / 100;
    const dashOffset = circumference * (1 - percentage);

    return `
        <div class="relative w-40 h-20">
            <svg viewBox="0 0 100 50" class="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#fca5a5" />
                    </linearGradient>
                </defs>
                <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#e5e7eb" stroke-width="10" stroke-linecap="round" class="dark:stroke-slate-700" />
                <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="url(#gaugeGradient)" 
                      stroke-width="10" stroke-linecap="round" 
                      stroke-dasharray="${circumference}" 
                      stroke-dashoffset="${dashOffset}"
                      class="transition-all duration-1000 ease-out" />
            </svg>
            <div class="absolute inset-0 flex items-end justify-center">
                <span class="text-2xl font-bold -mb-1 dark:text-white">${score}/100</span>
            </div>
        </div>
    `;
}

function renderATS(atsData) {
    const score = atsData.score || 0;
    let gradient = 'from-red-100';
    let icon = 'ats-bad.svg';
    let subtitle = 'Needs Improvement';

    if (score > 69) { gradient = 'from-green-100'; icon = 'ats-good.svg'; subtitle = 'Great Job!'; } 
    else if (score > 49) { gradient = 'from-yellow-100'; icon = 'ats-warning.svg'; subtitle = 'Good Start'; }

    const tipsHtml = atsData.tips.map(t => `
        <div class="flex items-start gap-3 bg-white/60 dark:bg-slate-900/30 p-3 rounded-lg backdrop-blur-sm">
            <img src="public/icons/${t.type === 'good' ? 'check.svg' : 'warning.svg'}" class="w-5 h-5 mt-0.5" />
            <p class="${t.type === 'good' ? 'text-green-800 dark:text-green-400' : 'text-amber-800 dark:text-amber-400'} text-sm font-medium leading-relaxed">
                ${t.tip}
            </p>
        </div>
    `).join('');

    return `
        <div class="bg-gradient-to-b ${gradient} to-white dark:to-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-6">
            <div class="flex items-center gap-4 mb-4">
                <img src="public/icons/${icon}" class="w-12 h-12 shadow-sm rounded-full bg-white dark:bg-slate-800 p-1" />
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">ATS Score - ${score}/100</h2>
                    <p class="text-lg font-medium text-gray-700 dark:text-gray-300">${subtitle}</p>
                </div>
            </div>
            <div class="space-y-2">
                ${tipsHtml}
            </div>
        </div>
    `;
}

function renderDetails(feedback) {
    const sections = [
        { id: 'tone', title: 'Tone & Style', data: feedback.toneAndStyle },
        { id: 'content', title: 'Content', data: feedback.content },
        { id: 'struct', title: 'Structure', data: feedback.structure },
        { id: 'skills', title: 'Skills', data: feedback.skills },
    ];

    const accordionItems = sections.map(sec => {
        const badgeColor = sec.data.score > 69 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        const badgeIcon = sec.data.score > 69 ? 'check.svg' : 'warning.svg';

        const detailedTips = sec.data.tips.map(tip => `
            <div class="flex flex-col gap-2 p-4 rounded-xl border ${tip.type === 'good' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'}">
                <div class="flex items-center gap-2">
                     <img src="public/icons/${tip.type === 'good' ? 'check.svg' : 'warning.svg'}" class="w-5 h-5" />
                     <p class="font-bold ${tip.type === 'good' ? 'text-green-800 dark:text-green-400' : 'text-yellow-800 dark:text-yellow-400'}">${tip.tip}</p>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-400 pl-7 leading-relaxed">${tip.explanation || ''}</p>
            </div>
        `).join('');

        return `
            <div class="border-b border-gray-200 dark:border-slate-700 last:border-0">
                <button class="accordion-btn w-full flex items-center justify-between py-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition px-3 rounded-lg" data-target="${sec.id}">
                    <div class="flex items-center gap-4">
                        <span class="text-xl font-semibold text-gray-800 dark:text-white">${sec.title}</span>
                        <div class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${badgeColor}">
                            <img src="public/icons/${badgeIcon}" class="w-3 h-3" />
                            ${sec.data.score}/100
                        </div>
                    </div>
                    <img src="public/icons/back.svg" class="w-4 h-4 transform -rotate-90 transition-transform duration-200 accordion-icon dark:invert" />
                </button>
                <div id="${sec.id}" class="hidden space-y-4 pb-4 px-3 pt-2">
                    ${detailedTips}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <h3 class="text-2xl font-bold mb-6 dark:text-white">Detailed Breakdown</h3>
            <div class="flex flex-col">
                ${accordionItems}
            </div>
        </div>
    `;
}

function initAccordions() {
    document.querySelectorAll('.accordion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent accidental form submits or jumping
            const targetId = btn.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const icon = btn.querySelector('.accordion-icon');

            content.classList.toggle('hidden');
            if (content.classList.contains('hidden')) {
                icon.style.transform = 'rotate(-90deg)';
            } else {
                icon.style.transform = 'rotate(90deg)';
            }
        });
    });
}
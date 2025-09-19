document.addEventListener('DOMContentLoaded', function() {

    // --- 1. TRANSLATIONS & I18N SETUP ---

    const translations = {
        en: {
            title: `HarmonyO<span class="underline-target">S</span> Installation Stats`,
            subtitle: "HarmonyOS Installation Statistics and Growth Forecast",
            lastUpdated: "Latest Updated:",
            totalInstallations: "Total Installations",
            totalIncrease14Day: "14-Day Total Installation Increase",
            avgDailyIncrease14Day: "14-Day Average Daily Installation Increase",
            avgGrowthRate14Day: "14-Day Average Daily Installation Growth Rate",
            growthChartLabel: "HarmonyOS Installation Growth Chart",
            forecastChartLabel: "Forecast Timeline to Reach Milestone",
            milestone1: "Milestone 1",
            milestone2: "Milestone 2",
            milestone3: "Milestone 3",
            targetDate: "Target Date:",
            daysRemaining: "Days Remaining:",
            footerCredit: "Qwen & Gemini: Vibe Coding Coming.",
            loadingText: "Loading HarmonyOS Installation Stats",
            chartDate: "Date",
            chartInstallations: "Installations",
            forecastOptimistic: "Optimistic",
            forecastMostLikely: "Most Likely",
            forecastPessimistic: "Pessimistic",
            mostLikelyApprox: "Most Likely Approx."
        },
        zh: {
            title: `鸿蒙系统安<span class="underline-target">装</span>统计`,
            subtitle: "鸿蒙系统安装量统计与增长预测",
            lastUpdated: "最后更新:",
            totalInstallations: "总安装量",
            totalIncrease14Day: "14天总安装增量",
            avgDailyIncrease14Day: "14天日均安装增量",
            avgGrowthRate14Day: "14天日均安装增长率",
            growthChartLabel: "鸿蒙系统安装量增长图表",
            forecastChartLabel: "里程碑达成时间线预测",
            milestone1: "里程碑 1",
            milestone2: "里程碑 2",
            milestone3: "里程碑 3",
            targetDate: "预计日期:",
            daysRemaining: "剩余天数:",
            footerCredit: "Qwen & Gemini：Vibe 编程新范式。",
            loadingText: "正在加载鸿蒙系统安装统计数据",
            chartDate: "日期",
            chartInstallations: "安装量",
            forecastOptimistic: "乐观预测",
            forecastMostLikely: "最可能",
            forecastPessimistic: "保守预测",
            mostLikelyApprox: "最可能预测"
        }
    };

    // --- 2. DYNAMIC CONTENT RENDERING ---

    function renderAppContent() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div class="container">
                <header>
                    <h1 data-translate-key="title"></h1>
                    <p class="subtitle" data-translate-key="subtitle"></p>
                    <p class="last-updated"><span data-translate-key="lastUpdated"></span> <span id="last-updated-date">--</span></p>
                </header>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="total-installations">--</div>
                        <div class="stat-label" data-translate-key="totalInstallations"></div>
                    </div>
                </div>

                <div class="chart-container">
                    <div id="growth-chart"></div>
                    <div class="chart-label" data-translate-key="growthChartLabel"></div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value" id="total-increase">--</div>
                        <div class="stat-label" data-translate-key="totalIncrease14Day"></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="avg-daily-increase">--</div>
                        <div class="stat-label" data-translate-key="avgDailyIncrease14Day"></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value" id="avg-growth-rate">--</div>
                        <div class="stat-label" data-translate-key="avgGrowthRate14Day"></div>
                    </div>
                </div>

                <div class="chart-container">
                    <div id="forecast-chart"></div>
                    <div class="chart-label" data-translate-key="forecastChartLabel"></div>
                </div>

                <div class="milestone-grid">
                    <div class="milestone-card">
                        <div class="milestone-title" data-translate-key="milestone1"></div>
                        <div class="milestone-value" id="milestone-1b">--</div>
                        <div class="milestone-date"><span data-translate-key="targetDate"></span> <span id="date-1b">--</span></div>
                        <div class="milestone-days"><span data-translate-key="daysRemaining"></span> <span id="days-1b">--</span></div>
                    </div>
                    <div class="milestone-card">
                        <div class="milestone-title" data-translate-key="milestone2"></div>
                        <div class="milestone-value" id="milestone-2b">--</div>
                        <div class="milestone-date"><span data-translate-key="targetDate"></span> <span id="date-2b">--</span></div>
                        <div class="milestone-days"><span data-translate-key="daysRemaining"></span> <span id="days-2b">--</span></div>
                    </div>
                    <div class="milestone-card">
                        <div class="milestone-title" data-translate-key="milestone3"></div>
                        <div class="milestone-value" id="milestone-5b">--</div>
                        <div class="milestone-date"><span data-translate-key="targetDate"></span> <span id="date-5b">--</span></div>
                        <div class="milestone-days"><span data-translate-key="daysRemaining"></span> <span id="days-5b">--</span></div>
                    </div>
                </div>

                <footer>
                    <p data-translate-key="footerCredit"></p>
                    <p>© 2025 <a href="https://github.com/HYwooo/harmonyos-installation-stats/" target="_blank">HYwooo</a>. Raw data are acquired from harmony5.cn.</p>
                </footer>
            </div>
            <style>
                .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
                header { text-align: center; padding: 40px 0 20px 0; }
                h1 { font-size: 2.5rem; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 10px; display: inline-block; position: relative; }
                .underline-target { position: relative; }
                h1 .underline-target::after { 
                    content: ''; 
                    position: absolute; 
                    bottom: -8px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    width: 1.2em; /* Adjusted width to match a character */
                    height: 3px; 
                    background-color: var(--accent-color); 
                }
                .subtitle { font-size: 1.1rem; opacity: 0.7; font-weight: 400; }
                .last-updated { font-size: 0.9rem; opacity: 0.6; margin-top: 8px; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0 40px 0; }
                .stat-card { background: var(--container-background); border-radius: 12px; padding: 25px; text-align: center; backdrop-filter: blur(10px); border: 1px solid var(--container-border); transition: transform 0.3s ease; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
                .stat-card:hover { transform: translateY(-5px); }
                .stat-value { font-size: 2.2rem; font-weight: 700; margin: 10px 0; color: var(--accent-color); }
                .stat-label { font-size: 0.9rem; opacity: 0.7; font-weight: 400; }
                .chart-container { background: var(--container-background); border-radius: 12px; padding: 25px; margin: 40px 0; backdrop-filter: blur(10px); border: 1px solid var(--container-border); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
                .chart-label { font-size: 0.9rem; opacity: 0.7; font-weight: 400; text-align: center; margin-top: 15px; color: var(--chart-label-color); }
                #growth-chart, #forecast-chart { width: 100%; height: 400px; }
                .milestone-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
                .milestone-card { background: var(--container-background); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px); border: 1px solid var(--container-border); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
                .milestone-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 10px; }
                .milestone-value { font-size: 1.5rem; font-weight: 700; color: var(--accent-color); margin: 5px 0; }
                .milestone-date, .milestone-days { font-size: 0.9rem; opacity: 0.8; }
                footer { text-align: center; padding: 40px 0; font-size: 0.9rem; opacity: 0.6; }
                footer a { color: var(--accent-color); text-decoration: none; }
                footer a:hover { text-decoration: underline; }
                @media (max-width: 768px) {
                    .container { padding: 15px; }
                    h1 { font-size: 2rem; }
                    .stats-grid { grid-template-columns: 1fr; }
                    #growth-chart, #forecast-chart { height: 300px; }
                }
                @media (max-width: 480px) {
                    header { padding: 30px 0 15px 0; }
                    h1 { font-size: 1.7rem; }
                    .subtitle { font-size: 0.9rem; }
                }
            </style>
        `;
    }


    // --- 3. CORE APPLICATION LOGIC (Data fetching, chart drawing, etc.) ---
    
    let chartData = null;
    let forecastData = null;
    let currentLang = 'en';

    function initApp() {
        renderAppContent();
        setupLanguageSwitcher();
        
        // Animate loading spinner
        const spinner = document.querySelector('.spinner-circle');
        anime({ targets: spinner, rotate: '1turn', duration: 2000, easing: 'linear', loop: true });
        anime({ targets: '.spinner-circle', strokeDasharray: ["1, 150", "90, 150", "90, 150"], strokeDashoffset: [0, -35, -124], duration: 1500, easing: 'easeInOutSine', loop: true });

        // Load data and build charts
        fetch('https://gcore.jsdelivr.net/gh/HYwooo/harmonyos-installation-stats@master/harmony_install_stats.csv')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(csvText => {
                const data = parseCSV(csvText);
                chartData = data;
                createGrowthChart(data);
                calculateStats(data);
                hideLoadingOverlay();
            })
            .catch(error => {
                console.error('Error loading or parsing CSV: ', error);
                document.getElementById('growth-chart').innerHTML = `<div style="height: 300px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; opacity: 0.7;">Failed to load chart data</div>`;
                hideLoadingOverlay();
            });
    }

    function setupLanguageSwitcher() {
        const langButton = document.getElementById('lang-button');
        const langDropdown = document.getElementById('lang-dropdown');
        const currentLangSpan = document.getElementById('current-lang');

        // Determine initial language
        const savedLang = localStorage.getItem('preferredLanguage');
        const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
        const initialLang = savedLang || browserLang;
        
        switchLanguage(initialLang);

        langButton.addEventListener('click', () => {
            langDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!langButton.contains(event.target) && !langDropdown.contains(event.target)) {
                langDropdown.classList.remove('active');
            }
        });

        langDropdown.querySelectorAll('li[data-lang]').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.getAttribute('data-lang');
                switchLanguage(lang);
                langDropdown.classList.remove('active');
            });
        });
    }

    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update current language display in button
        document.getElementById('current-lang').textContent = lang.toUpperCase();
        
        // Redraw charts with new language labels if they exist
        if (chartData) {
            createGrowthChart(chartData);
            if (forecastData) createForecastChart(chartData, forecastData);
        }
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if(overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 800);
        }
    }
    
    // --- UTILITY AND DATA PROCESSING FUNCTIONS (largely from original file) ---

    function parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
        }
        return data;
    }

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function getNextMilestones(current) {
        const currentB = current / 1e9;
        const scale = Math.pow(10, Math.floor(Math.log10(currentB)));
        const firstDigit = Math.floor(currentB / scale);
        
        let m1, m2, m5;
        if (firstDigit < 1) { [m1, m2, m5] = [1, 2, 5]; } 
        else if (firstDigit < 2) { [m1, m2, m5] = [2, 5, 10]; } 
        else if (firstDigit < 5) { [m1, m2, m5] = [5, 10, 20]; } 
        else { [m1, m2, m5] = [10, 20, 50]; }
        
        return [m1 * scale * 1e9, m2 * scale * 1e9, m5 * scale * 1e9];
    }
    
    function calculateForecast(data) {
        if (data.length < 14) return null;

        const latest = data[data.length - 1];
        const currentInstallations = parseInt(latest.Installations);
        const currentDate = new Date(latest.Date);
        const [, milestone2] = getNextMilestones(currentInstallations);
        const targetMilestone = milestone2;
        
        const periodData = data.slice(-14);
        const growthRates = periodData.slice(1).map(p => parseFloat(p.Growth_Rate)).filter(r => !isNaN(r) && r > 0).sort((a, b) => a - b);
        if (growthRates.length === 0) return null;

        const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
        const optimisticRates = growthRates.slice(Math.ceil(growthRates.length * 0.5));
        const optimisticGrowthRate = optimisticRates.reduce((a, b) => a + b, 0) / optimisticRates.length;
        const pessimisticRates = growthRates.slice(0, Math.ceil(growthRates.length * 0.5));
        const pessimisticGrowthRate = pessimisticRates.reduce((a, b) => a + b, 0) / pessimisticRates.length;

        const calcDays = (rate) => Math.ceil(Math.log(targetMilestone / currentInstallations) / Math.log(1 + rate / 100));
        const daysToTargetMostLikely = calcDays(avgGrowthRate);
        const daysToTargetOptimistic = calcDays(optimisticGrowthRate);
        const daysToTargetPessimistic = calcDays(pessimisticGrowthRate);
        
        const calcDate = (days) => { let d = new Date(currentDate); d.setDate(d.getDate() + Math.max(0, days)); return d; };

        return {
            currentInstallations, currentDate, targetMilestone,
            daysToTargetMostLikely, daysToTargetOptimistic, daysToTargetPessimistic,
            dateMostLikely: calcDate(daysToTargetMostLikely),
            dateOptimistic: calcDate(daysToTargetOptimistic),
            datePessimistic: calcDate(daysToTargetPessimistic)
        };
    }
    
    function calculateStats(data) {
        if (data.length === 0) return;

        const latest = data[data.length - 1];
        document.getElementById('last-updated-date').textContent = latest.Date;
        document.getElementById('total-installations').textContent = formatNumber(parseInt(latest.Installations));

        if (data.length < 14) return;
        
        const periodData = data.slice(-14);
        const startValue = parseInt(periodData[0].Installations);
        const endValue = parseInt(latest.Installations);
        const totalIncrease = endValue - startValue;
        document.getElementById('total-increase').textContent = formatNumber(totalIncrease);

        const dailyIncreases = periodData.slice(1).map(p => parseInt(p.Daily_Increase));
        const avgDailyIncrease = dailyIncreases.reduce((a, b) => a + b, 0) / dailyIncreases.length;
        document.getElementById('avg-daily-increase').textContent = formatNumber(Math.round(avgDailyIncrease));

        const growthRates = periodData.slice(1).map(p => parseFloat(p.Growth_Rate)).filter(r => !isNaN(r));
        const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
        document.getElementById('avg-growth-rate').textContent = avgGrowthRate.toFixed(1) + '%';
        
        calculateMilestones(data);
        forecastData = calculateForecast(data);
        if (forecastData) createForecastChart(data, forecastData);
    }

    function calculateMilestones(data) {
        if (data.length < 14) return;
        const latest = data[data.length - 1];
        const currentInstallations = parseInt(latest.Installations);
        const [m1, m2, m5] = getNextMilestones(currentInstallations);
        document.getElementById('milestone-1b').textContent = formatNumber(m1);
        document.getElementById('milestone-2b').textContent = formatNumber(m2);
        document.getElementById('milestone-5b').textContent = formatNumber(m5);

        const periodData = data.slice(-14);
        const growthRates = periodData.slice(1).map(p => parseFloat(p.Growth_Rate)).filter(r => !isNaN(r) && r > 0);
        if (growthRates.length === 0) return;
        
        const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
        const growthFactor = 1 + avgGrowthRate / 100;
        
        const calcDays = (target) => Math.ceil(Math.log(target / currentInstallations) / Math.log(growthFactor));
        const days = [calcDays(m1), calcDays(m2), calcDays(m5)];

        const formatDate = (date) => date.toISOString().split('T')[0];
        const currentDate = new Date(latest.Date);

        [1, 2, 5].forEach((val, i) => {
            const d = new Date(currentDate);
            if (days[i] >= 0) {
                d.setDate(d.getDate() + days[i]);
                document.getElementById(`date-${val}b`).textContent = formatDate(d);
                document.getElementById(`days-${val}b`).textContent = days[i];
            } else {
                document.getElementById(`date-${val}b`).textContent = '--';
                document.getElementById(`days-${val}b`).textContent = '--';
            }
        });
    }

    // --- CHART CREATION FUNCTIONS ---
    
    function createGrowthChart(data) {
        const dates = data.map(row => row.Date);
        const installations = data.map(row => parseInt(row.Installations));
        const latest = data[data.length - 1];
        
        const trace = { x: dates, y: installations, mode: 'lines+markers', line: { shape: 'spline', color: 'var(--accent-color)' }, name: 'Installations' };
        
        const layout = {
            margin: { t: 20, b: 40, l: 60, r: 20 },
            xaxis: { title: translations[currentLang].chartDate, color: 'var(--chart-label-color)' },
            yaxis: { title: translations[currentLang].chartInstallations, color: 'var(--chart-label-color)' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            showlegend: false,
            annotations: [{
                x: latest.Date, y: parseInt(latest.Installations), text: `${formatNumber(parseInt(latest.Installations))}<br>${latest.Date}`,
                showarrow: true, arrowhead: 7, ax: 0, ay: -40, bgcolor: 'var(--container-background)', bordercolor: 'var(--accent-color)', borderwidth: 2,
                font: { color: 'var(--accent-color)', size: 12 }
            }]
        };
        Plotly.newPlot('growth-chart', [trace], layout, {responsive: true});
    }
    
    function createForecastChart(data, forecastData) {
        const historicalTrace = {
            x: data.map(row => row.Date), y: data.map(row => parseInt(row.Installations)),
            mode: 'lines', line: { shape: 'spline', color: 'var(--accent-color)' }, name: 'Historical'
        };

        const { currentDate, targetMilestone, dateOptimistic, dateMostLikely, datePessimistic } = forecastData;
        const currentY = forecastData.currentInstallations;
        const currentX = currentDate.toISOString().split('T')[0];
        const formatDate = (date) => date.toISOString().split('T')[0];

        const optimisticTrace = { x: [currentX, formatDate(dateOptimistic)], y: [currentY, targetMilestone], mode: 'lines', line: { dash: 'dot', color: '#32d74b' }, name: 'Optimistic' };
        const mostLikelyTrace = { x: [currentX, formatDate(dateMostLikely)], y: [currentY, targetMilestone], mode: 'lines', line: { dash: 'dot', color: '#0a84ff' }, name: 'Most Likely' };
        const pessimisticTrace = { x: [currentX, formatDate(datePessimistic)], y: [currentY, targetMilestone], mode: 'lines', line: { dash: 'dot', color: '#ff9f0a' }, name: 'Pessimistic' };

        const annotations = window.innerWidth > 768 ? [
            { x: formatDate(dateOptimistic), y: targetMilestone, text: `${translations[currentLang].forecastOptimistic}<br>${formatDate(dateOptimistic)}`, ax: 0, ay: -40, font: { color: '#32d74b' } },
            { x: formatDate(dateMostLikely), y: targetMilestone, text: `${translations[currentLang].forecastMostLikely}<br>${formatDate(dateMostLikely)}`, ax: 0, ay: 40, font: { color: '#0a84ff' } },
            { x: formatDate(datePessimistic), y: targetMilestone, text: `${translations[currentLang].forecastPessimistic}<br>${formatDate(datePessimistic)}`, ax: 0, ay: -40, font: { color: '#ff9f0a' } }
        ].map(a => ({ ...a, showarrow: true, arrowhead: 7, bgcolor: 'var(--container-background)', bordercolor: a.font.color })) : [];
        
        // Add a central label for mobile
        annotations.push({
            x: formatDate(dateMostLikely), y: targetMilestone, text: `${formatDate(dateMostLikely)}<br>${translations[currentLang].mostLikelyApprox}`,
            showarrow: true, arrowhead: 7, ax: 0, ay: -40, bgcolor: 'var(--container-background)', bordercolor: '#0a84ff', borderwidth: 2,
            font: { color: '#0a84ff', size: 12 }
        });

        const layout = {
            margin: { t: 20, b: 40, l: 60, r: 20 },
            xaxis: { title: translations[currentLang].chartDate, color: 'var(--chart-label-color)' },
            yaxis: { title: translations[currentLang].chartInstallations, color: 'var(--chart-label-color)' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            showlegend: false,
            annotations: annotations
        };
        Plotly.newPlot('forecast-chart', [historicalTrace, optimisticTrace, mostLikelyTrace, pessimisticTrace], layout, {responsive: true});
    }

    // --- START THE APP ---
    initApp();

    window.addEventListener('resize', () => {
        if (chartData) {
            Plotly.Plots.resize('growth-chart');
            if (forecastData) Plotly.Plots.resize('forecast-chart');
        }
    });
});

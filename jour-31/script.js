document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const timerDisplay = document.getElementById('timer');
    const phaseDisplay = document.getElementById('phase');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const cycleCountDisplay = document.getElementById('cycleCount');
    const workTimeInput = document.getElementById('workTime');
    const breakTimeInput = document.getElementById('breakTime');
    const themeBtn = document.getElementById('themeBtn');
    const alarmSound = document.getElementById('alarm');
    
    // Variables d'état
    let timer;
    let timeLeft = 0;
    let isRunning = false;
    let isWorkTime = true;
    let cyclesCompleted = 0;
    let workDuration = 25 * 60; // 25 minutes en secondes
    let breakDuration = 5 * 60; // 5 minutes en secondes
    
    // Initialisation
    updateDisplay(workDuration);
    updatePhaseDisplay();
    
    // Gestion du thème
    themeBtn.addEventListener('click', toggleTheme);
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeBtn.textContent = '🌙 Mode Sombre';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeBtn.textContent = '☀️ Mode Clair';
        }
    }
    
    // Gestion des changements de durée
    workTimeInput.addEventListener('change', () => {
        if (!isRunning) {
            workDuration = parseInt(workTimeInput.value) * 60;
            if (isWorkTime) {
                timeLeft = workDuration;
                updateDisplay(timeLeft);
            }
        }
    });
    
    breakTimeInput.addEventListener('change', () => {
        if (!isRunning) {
            breakDuration = parseInt(breakTimeInput.value) * 60;
            if (!isWorkTime) {
                timeLeft = breakDuration;
                updateDisplay(timeLeft);
            }
        }
    });
    
    // Boutons de contrôle
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    function startTimer() {
        if (!isRunning) {
            // Si le timer n'a pas encore commencé, initialiser le temps
            if (timeLeft === 0) {
                timeLeft = isWorkTime ? workDuration : breakDuration;
                updateDisplay(timeLeft);
            }
            
            isRunning = true;
            timer = setInterval(updateTimer, 1000);
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            workTimeInput.disabled = true;
            breakTimeInput.disabled = true;
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }
    
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isWorkTime = true;
        timeLeft = workDuration;
        
        updateDisplay(timeLeft);
        updatePhaseDisplay();
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        workTimeInput.disabled = false;
        breakTimeInput.disabled = false;
    }
    
    function updateTimer() {
        timeLeft--;
        updateDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            alarmSound.play();
            
            if (isWorkTime) {
                cyclesCompleted++;
                cycleCountDisplay.textContent = cyclesCompleted;
            }
            
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workDuration : breakDuration;
            updateDisplay(timeLeft);
            updatePhaseDisplay();
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            workTimeInput.disabled = false;
            breakTimeInput.disabled = false;
        }
    }
    
    function updateDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // Changement de couleur quand il reste peu de temps
        if (seconds <= 60) {
            timerDisplay.style.color = '#f44336';
        } else {
            timerDisplay.style.color = '';
        }
    }
    
    function updatePhaseDisplay() {
        if (isWorkTime) {
            phaseDisplay.textContent = 'Temps de travail';
            document.body.style.backgroundColor = '';
        } else {
            phaseDisplay.textContent = 'Pause';
            document.body.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        }
    }
});
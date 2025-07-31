// Liste des balises HTML communes
const htmlTags = [
    '<div>', '</div>', '<p>', '</p>', '<a>', '</a>', '<img>', '<ul>', '</ul>', '<li>', 
    '</li>', '<h1>', '</h1>', '<h2>', '</h2>', '<span>', '</span>', '<input>', '<button>', 
    '</button>', '<form>', '</form>', '<table>', '</table>', '<tr>', '</tr>', '<td>', '</td>', 
    '<header>', '</header>', '<footer>', '</footer>', '<section>', '</section>', '<article>', 
    '</article>', '<nav>', '</nav>', '<main>', '</main>', '<aside>', '</aside>'
];

// Variables du jeu
let currentTag = '';
let score = 0;
let remainingTags = 15;
let startTime;
let timerInterval;
let gameActive = false;
let correctTags = [];
let incorrectTags = [];

// Éléments DOM
const tagDisplay = document.getElementById('tag-display');
const userInput = document.getElementById('user-input');
const startBtn = document.getElementById('start-btn');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const remainingDisplay = document.getElementById('remaining');
const resultsSection = document.getElementById('results');
const totalTimeDisplay = document.getElementById('total-time');
const finalScoreDisplay = document.getElementById('final-score');
const accuracyDisplay = document.getElementById('accuracy');
const tagsDetail = document.getElementById('tags-detail');

// Démarrer le jeu
function startGame() {
    gameActive = true;
    score = 0;
    remainingTags = 15;
    correctTags = [];
    incorrectTags = [];
    
    scoreDisplay.textContent = score;
    remainingDisplay.textContent = remainingTags;
    userInput.value = '';
    userInput.focus();
    
    resultsSection.style.display = 'none';
    startBtn.textContent = 'En cours...';
    startBtn.disabled = true;
    
    // Démarrer le chrono
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
    
    // Afficher la première balise
    showRandomTag();
}

// Mettre à jour le chronomètre
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = elapsedTime;
}

// Afficher une balise aléatoire
function showRandomTag() {
    if (remainingTags <= 0) {
        endGame();
        return;
    }
    
    currentTag = htmlTags[Math.floor(Math.random() * htmlTags.length)];
    tagDisplay.textContent = currentTag;
    userInput.value = '';
}

// Vérifier la saisie de l'utilisateur
userInput.addEventListener('keydown', function(e) {
    if (!gameActive) return;
    
    if (e.key === 'Enter') {
        const userValue = userInput.value.trim();
        
        if (userValue === currentTag) {
            // Bonne réponse
            score += 10;
            correctTags.push(currentTag);
        } else {
            // Mauvaise réponse
            score = Math.max(0, score - 5);
            incorrectTags.push({
                expected: currentTag,
                entered: userValue
            });
        }
        
        // Mettre à jour l'affichage
        scoreDisplay.textContent = score;
        remainingTags--;
        remainingDisplay.textContent = remainingTags;
        
        // Afficher la prochaine balise ou terminer le jeu
        showRandomTag();
    }
});

// Terminer le jeu
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.round((correctTags.length / 10) * 100);
    
    // Afficher les résultats
    totalTimeDisplay.textContent = totalTime;
    finalScoreDisplay.textContent = score;
    accuracyDisplay.textContent = accuracy;
    
    // Afficher le détail des balises
    tagsDetail.innerHTML = '';
    
    // Balises correctes
    if (correctTags.length > 0) {
        const correctHeader = document.createElement('h4');
        correctHeader.textContent = 'Correctes:';
        tagsDetail.appendChild(correctHeader);
        
        correctTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'correct';
            tagElement.textContent = tag;
            tagsDetail.appendChild(tagElement);
        });
    }
    
    // Balises incorrectes
    if (incorrectTags.length > 0) {
        const incorrectHeader = document.createElement('h4');
        incorrectHeader.textContent = 'Incorrectes:';
        tagsDetail.appendChild(incorrectHeader);
        
        incorrectTags.forEach(item => {
            const tagElement = document.createElement('div');
            tagElement.className = 'incorrect';
            tagElement.innerHTML = `Attendu: <strong>${item.expected}</strong> - Saisi: <strong>${item.entered}</strong>`;
            tagsDetail.appendChild(tagElement);
        });
    }
    
    // Afficher la section des résultats
    resultsSection.style.display = 'block';
    startBtn.textContent = 'Recommencer';
    startBtn.disabled = false;
}

// Bouton de démarrage
startBtn.addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const currentDisplay = document.querySelector('.current-operation');
    const previousDisplay = document.querySelector('.previous-operation');
    const memoryIndicator = document.querySelector('.memory-indicator');
    const clearButton = document.querySelector('[data-action="clear"]');
    
    // Variables d'état
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let memoryValue = 0;
    let shouldResetScreen = false;
    
    // Mise à jour de l'affichage
    function updateDisplay() {
        currentDisplay.textContent = currentOperand;
        previousDisplay.textContent = previousOperand;
        
        // Mise à jour du bouton AC/C
        clearButton.textContent = currentOperand !== '0' ? 'C' : 'AC';
        
        // Mise à jour des opérateurs sélectionnés
        document.querySelectorAll('.orange').forEach(button => {
            button.classList.remove('selected');
        });
        
        if (operation) {
            const activeOperator = document.querySelector(`[data-action="${operation}"]`);
            if (activeOperator) activeOperator.classList.add('selected');
        }
    }
    
    // Réinitialiser l'écran
    function resetScreen() {
        currentOperand = '0';
        shouldResetScreen = false;
    }
    
    // Ajouter un chiffre
    function appendNumber(number) {
        // Si un calcul vient d'être effectué
        if (shouldResetScreen) resetScreen();
        
        // Gestion de la virgule décimale
        if (number === '.' && currentOperand.includes('.')) return;
        
        // Remplace le 0 initial ou ajoute le chiffre
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }
    
    // Choisir une opération
    function chooseOperation(op) {
        // Si aucun nombre n'est saisi, on ne fait rien
        if (currentOperand === '0' && previousOperand === '') return;
        
        // Si un calcul est en attente
        if (previousOperand !== '') {
            calculate();
        }
        
        // Définir l'opération
        operation = op;
        previousOperand = `${currentOperand} ${getOperationSymbol(op)}`;
        shouldResetScreen = true;
    }
    
    // Effectuer un calcul
    function calculate() {
        if (!operation || shouldResetScreen) return;
        
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        let result;
        
        switch (operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    result = 'Erreur';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }
        
        // Mettre à jour les valeurs
        currentOperand = result.toString();
        operation = null;
        previousOperand = '';
        shouldResetScreen = true;
    }
    
    // Obtenir le symbole d'opération
    function getOperationSymbol(op) {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }
    
    // Effacer tout
    function clearAll() {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
    }
    
    // Effacer l'entrée
    function clearEntry() {
        currentOperand = '0';
    }
    
    // Changer de signe
    function changeSign() {
        currentOperand = (parseFloat(currentOperand) * -1).toString();
    }
    
    // Calculer le pourcentage
    function calculatePercentage() {
        currentOperand = (parseFloat(currentOperand) / 100).toString();
    }
    
    // Gestion des événements des boutons
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });
    
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            
            switch (action) {
                case 'clear':
                    if (currentOperand !== '0') {
                        clearEntry();
                    } else {
                        clearAll();
                    }
                    break;
                case 'sign':
                    changeSign();
                    break;
                case 'percent':
                    calculatePercentage();
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    chooseOperation(action);
                    break;
                case 'calculate':
                    calculate();
                    break;
            }
            
            updateDisplay();
        });
    });
    
    // Touches clavier
    document.addEventListener('keydown', event => {
        if (/[0-9]/.test(event.key)) {
            appendNumber(event.key);
            updateDisplay();
        } else if (event.key === '.') {
            appendNumber('.');
            updateDisplay();
        } else if (event.key === '+' || event.key === '-') {
            chooseOperation(event.key === '+' ? 'add' : 'subtract');
            updateDisplay();
        } else if (event.key === '*') {
            chooseOperation('multiply');
            updateDisplay();
        } else if (event.key === '/') {
            chooseOperation('divide');
            updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            calculate();
            updateDisplay();
        } else if (event.key === 'Escape') {
            clearAll();
            updateDisplay();
        } else if (event.key === 'Backspace') {
            currentOperand = currentOperand.slice(0, -1) || '0';
            updateDisplay();
        }
    });
    
    // Initialisation
    updateDisplay();
    
    // Animation d'ouverture
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
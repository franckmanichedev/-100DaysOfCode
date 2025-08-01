document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');
    const generateBtn = document.getElementById('generateBtn');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const uppercase = document.getElementById('uppercase');
    const lowercase = document.getElementById('lowercase');
    const numbers = document.getElementById('numbers');
    const symbols = document.getElementById('symbols');
    const strengthBar = document.getElementById('strengthBar');
    const copyNotification = document.getElementById('copyNotification');
    
    // Caractères disponibles
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    // Mettre à jour l'affichage de la longueur
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
    
    // Copier le mot de passe
    copyBtn.addEventListener('click', function() {
        if (!passwordOutput.value) return;
        
        navigator.clipboard.writeText(passwordOutput.value).then(() => {
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
        });
    });
    
    // Générer un mot de passe
    generateBtn.addEventListener('click', generatePassword);
    
    // Générer au chargement
    generatePassword();
    
    function generatePassword() {
        // Vérifier qu'au moins une option est sélectionnée
        if (!uppercase.checked && !lowercase.checked && 
            !numbers.checked && !symbols.checked) {
            alert('Veuillez sélectionner au moins un type de caractère');
            return;
        }
        
        const length = parseInt(lengthSlider.value);
        let charset = '';
        let password = '';
        
        // Construire le jeu de caractères en fonction des options
        if (uppercase.checked) charset += charSets.uppercase;
        if (lowercase.checked) charset += charSets.lowercase;
        if (numbers.checked) charset += charSets.numbers;
        if (symbols.checked) charset += charSets.symbols;
        
        // Générer le mot de passe
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        // Afficher le mot de passe
        passwordOutput.value = password;
        
        // Calculer et afficher la force
        updateStrengthMeter(password);
    }
    
    function updateStrengthMeter(password) {
        // Calculer un score de force (0-100)
        let score = 0;
        const length = password.length;
        
        // Points pour la longueur
        score += Math.min(length * 3, 30); // Max 30 points
        
        // Points pour la diversité des caractères
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        const diversityCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
        score += (diversityCount - 1) * 15; // 0-45 points
        
        // Ajuster en fonction de la complexité
        if (length >= 12 && diversityCount >= 3) {
            score += 25;
        }
        
        // Limiter à 100
        score = Math.min(score, 100);
        
        // Mettre à jour la barre de force
        strengthBar.style.width = `${score}%`;
        
        // Changer la couleur en fonction du score
        if (score < 30) {
            strengthBar.style.backgroundColor = 'var(--danger)';
        } else if (score < 70) {
            strengthBar.style.backgroundColor = 'orange';
        } else {
            strengthBar.style.backgroundColor = 'var(--success)';
        }
    }
});
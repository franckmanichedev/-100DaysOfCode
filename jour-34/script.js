// Éléments DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const rateInfo = document.getElementById('rateInfo');
const convertedAmount = document.getElementById('convertedAmount');
const lastUpdate = document.getElementById('lastUpdate');
const errorMessage = document.getElementById('errorMessage');

// Variables d'état
let exchangeRates = {};
let lastUpdated = null;
const apiKey = 'c45e2e2409abf1df4ebf4952'; // Remplacez par votre clé API
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

// Devises populaires (peut être étendu)
const popularCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 
    'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 
    'RUB', 'INR', 'BRL', 'ZAR', 'DKK', 'PLN', 'THB', 'ILS', 
    'MYR', 'PHP', 'IDR', 'HUF', 'CZK', 'RON', 'HRK', 'BGN',
    'XAF'
];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadCurrencies();
    loadLastUsedCurrencies();
    fetchExchangeRates();
    
    // Conversion automatique quand les valeurs changent
    amountInput.addEventListener('input', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);
    
    // Bouton d'inversion
    swapBtn.addEventListener('click', swapCurrencies);
    
    // Bouton de conversion (recharge les taux si besoin)
    convertBtn.addEventListener('click', () => {
        if (Object.keys(exchangeRates).length === 0 || isDataStale()) {
            fetchExchangeRates();
        } else {
            convertCurrency();
        }
    });
});

// Charger les devises dans les selects
function loadCurrencies() {
    popularCurrencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        fromCurrencySelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = currency;
        option2.textContent = currency;
        toCurrencySelect.appendChild(option2);
    });
}

// Charger les dernières devises utilisées depuis localStorage
function loadLastUsedCurrencies() {
    const lastFrom = localStorage.getItem('lastFromCurrency');
    const lastTo = localStorage.getItem('lastToCurrency');
    
    if (lastFrom && popularCurrencies.includes(lastFrom)) {
        fromCurrencySelect.value = lastFrom;
    } else {
        fromCurrencySelect.value = 'EUR'; // Devise par défaut
    }
    
    if (lastTo && popularCurrencies.includes(lastTo)) {
        toCurrencySelect.value = lastTo;
    } else {
        toCurrencySelect.value = 'USD'; // Devise par défaut
    }
}

// Sauvegarder les devises utilisées dans localStorage
function saveLastUsedCurrencies() {
    localStorage.setItem('lastFromCurrency', fromCurrencySelect.value);
    localStorage.setItem('lastToCurrency', toCurrencySelect.value);
}

// Récupérer les taux de change depuis l'API
async function fetchExchangeRates() {
    try {
        showLoading(true);
        
        // En production, utilisez votre propre clé API
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Erreur de réseau');
        }
        
        const data = await response.json();
        
        if (data.result === 'error') {
            throw new Error(data['error-type']);
        }
        
        exchangeRates = data.conversion_rates;
        lastUpdated = new Date(data.time_last_update_utc);
        
        updateLastUpdateDisplay();
        convertCurrency();
        hideError();
    } catch (error) {
        console.error('Erreur:', error);
        showError('Impossible de récupérer les taux de change. Utilisation des taux locaux.');
        
        // Fallback avec des taux statiques (à remplacer ou supprimer en production)
        exchangeRates = {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.25,
            AUD: 1.35,
            CAD: 1.26,
            CHF: 0.92,
            CNY: 6.45
        };
        lastUpdated = new Date();
        
        updateLastUpdateDisplay();
        convertCurrency();
    } finally {
        showLoading(false);
    }
}

// Convertir la devise
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (isNaN(amount) || amount <= 0) {
        convertedAmount.textContent = '--';
        rateInfo.textContent = 'Taux de change : --';
        return;
    }
    
    if (Object.keys(exchangeRates).length === 0) {
        showError('Chargement des taux en cours...');
        return;
    }
    
    // Vérifier si les devises sont disponibles
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        showError('Devise non supportée');
        return;
    }
    
    // Calcul du taux de change
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const rate = toRate / fromRate;
    
    // Calcul du montant converti
    const result = amount * rate;
    
    // Affichage des résultats
    convertedAmount.textContent = result.toFixed(2);
    rateInfo.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
    
    // Sauvegarde des devises utilisées
    saveLastUsedCurrencies();
}

// Inverser les devises
function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency();
}

// Mettre à jour l'affichage de la dernière mise à jour
function updateLastUpdateDisplay() {
    if (lastUpdated) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        };
        lastUpdate.textContent = `Taux actualisés : ${lastUpdated.toLocaleDateString('fr-FR', options)}`;
    } else {
        lastUpdate.textContent = 'Taux actualisés : --';
    }
}

// Vérifier si les données sont périmées (plus de 24h)
function isDataStale() {
    if (!lastUpdated) return true;
    const now = new Date();
    const diffHours = (now - lastUpdated) / (1000 * 60 * 60);
    return diffHours > 24;
}

// Gestion des erreurs
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Affichage du chargement
function showLoading(isLoading) {
    if (isLoading) {
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Chargement...';
    } else {
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="bi bi-calculator"></i> Convertir';
    }
}

// Animation de rotation pour l'icône de chargement
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
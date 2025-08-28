// Éléments DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const errorMessage = document.getElementById('error-message');
const weatherInfo = document.getElementById('weather-info');
const unitButtons = document.querySelectorAll('.unit-btn');

// Éléments d'affichage
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const currentTemp = document.getElementById('currentTemp');
const feelsLike = document.getElementById('feelsLike');
const tempMax = document.getElementById('tempMax');
const tempMin = document.getElementById('tempMin');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecastContainer');

// Variables d'état
let currentUnit = 'metric';
const apiKey = 'd1e0beade9c4b49bb136cde6808d3374';

// Écouteurs d'événements
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

locationBtn.addEventListener('click', getLocationWeather);

unitButtons.forEach(button => {
    button.addEventListener('click', () => {
        unitButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentUnit = button.dataset.unit;
        
        // Recharger les données avec les nouvelles unités
        const currentCity = cityName.textContent;
        if (currentCity !== '--') {
            fetchWeather(currentCity);
        }
    });
});

// Fonction principale de recherche
function searchWeather() {
    const city = cityInput.value.trim();
    
    if (city === '') {
        showError('Veuillez entrer une ville');
        return;
    }
    
    fetchWeather(city);
}

// Obtenir la météo par géolocalisation
function getLocationWeather() {
    if (!navigator.geolocation) {
        showError('La géolocalisation n\'est pas supportée par votre navigateur');
        return;
    }
    
    locationBtn.disabled = true;
    locationBtn.innerHTML = '<i class="bi bi-hourglass"></i> Localisation...';
    searchBtn.innerHTML = '<i class="bi bi-hourglass"></i> Recherche...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
            locationBtn.disabled = false;
            locationBtn.innerHTML = '<i class="bi bi-geo-alt-fill"></i> Ma position';
            searchBtn.innerHTML = '<i class="bi bi-search"></i> Chercher';
        },
        (error) => {
            showError('Impossible d\'obtenir votre localisation');
            console.error('Erreur de géolocalisation:', error);
            locationBtn.disabled = false;
            locationBtn.innerHTML = '<i class="bi bi-geo-alt-fill"></i> Ma position';
            searchBtn.innerHTML = '<i class="bi bi-search"></i> Chercher';
        }
    );
}

// Fetch des données météo par ville
async function fetchWeather(city) {
    try {
        searchBtn.innerHTML = '<i class="bi bi-hourglass"></i> Recherche en cours...';
    
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&lang=fr&appid=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error('Ville non trouvée');
        }
        
        const data = await response.json();
        displayWeather(data);
        searchBtn.innerHTML = '<i class="bi bi-search"></i> Chercher';
        fetchForecast(data.coord.lat, data.coord.lon);
        hideError();
    } catch (error) {
        showError('Ville non trouvée. Vérifiez l\'orthographe.');
        searchBtn.innerHTML = '<i class="bi bi-search"></i> Chercher';
        console.error('Erreur:', error);
    }
}

// Fetch des données météo par coordonnées
async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&lang=fr&appid=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error('Erreur de localisation');
        }
        
        const data = await response.json();
        displayWeather(data);
        fetchForecast(lat, lon);
        hideError();
        cityInput.value = data.name;
    } catch (error) {
        showError('Impossible d\'obtenir les données météo pour votre position');
        console.error('Erreur:', error);
    }
}

// Fetch des prévisions
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&lang=fr&appid=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error('Erreur de prévisions');
        }
        
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Erreur de prévisions:', error);
    }
}

// Affichage des données météo actuelles
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    const date = new Date(data.dt * 1000);
    currentDate.textContent = date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
    });
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherDescription.textContent = data.weather[0].description;
    
    currentTemp.textContent = `${Math.round(data.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    feelsLike.textContent = `Ressenti: ${Math.round(data.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    tempMax.textContent = `Max: ${Math.round(data.main.temp_max)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    tempMin.textContent = `Min: ${Math.round(data.main.temp_min)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    humidity.textContent = `Humidité: ${data.main.humidity}%`;
    
    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';
    windSpeed.textContent = `Vent: ${Math.round(data.wind.speed)} ${windUnit}`;
    
    const visibilityUnit = currentUnit === 'metric' ? 'km' : 'miles';
    const visibilityValue = currentUnit === 'metric' 
        ? (data.visibility / 1000).toFixed(1) 
        : (data.visibility / 1609).toFixed(1);
    visibility.textContent = `Visibilité: ${visibilityValue} ${visibilityUnit}`;
    
    pressure.textContent = `Pression: ${data.main.pressure} hPa`;
    
    weatherInfo.style.display = 'block';
    weatherInfo.classList.add('animate__animated', 'animate__fadeIn');
}

// Affichage des prévisions
function displayForecast(data) {
    forecastContainer.innerHTML = '';
    
    // On prend une prévision par jour (toutes les 24h)
    const dailyForecasts = [];
    for (let i = 0; i < data.list.length; i += 8) {
        dailyForecasts.push(data.list[i]);
    }
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-card animate__animated animate__fadeIn';
        
        dayElement.innerHTML = `
            <span class="forecast-day">${date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
            <span class="forecast-desc">${forecast.weather[0].description}</span>
            <div class="forecast-temp">
                <span class="temp-max">${Math.round(forecast.main.temp_max)}°</span>
                <span class="temp-min">${Math.round(forecast.main.temp_min)}°</span>
            </div>
        `;
        
        forecastContainer.appendChild(dayElement);
    });
}

// Gestion des erreurs
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Chargement initial - tentative de géolocalisation
window.addEventListener('load', () => {
    getLocationWeather();
});
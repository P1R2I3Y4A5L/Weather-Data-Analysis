// Initialize BST
const weatherDataBST = new WeatherBST();

// Mock Data for fallback if no API key is provided
const MOCK_WEATHER = {
    'london': { temp: 15.2, humidity: 76, wind: 4.1, desc: 'scattered clouds' },
    'paris': { temp: 18.5, humidity: 60, wind: 3.2, desc: 'clear sky' },
    'tokyo': { temp: 22.1, humidity: 55, wind: 5.5, desc: 'broken clouds' },
    'new york': { temp: 12.0, humidity: 45, wind: 6.2, desc: 'light rain' },
    'sydney': { temp: 26.5, humidity: 40, wind: 2.1, desc: 'sunny' },
    'delhi': { temp: 34.2, humidity: 20, wind: 1.5, desc: 'haze' }
};

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const apiKeyInput = document.getElementById('api-key-input');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-msg');
const weatherDisplay = document.getElementById('weather-display');

const uiCityName = document.getElementById('city-name');
const uiCurrentTemp = document.getElementById('current-temp');
const uiWeatherDesc = document.getElementById('weather-description');
const uiHumidity = document.getElementById('current-humidity');
const uiWind = document.getElementById('current-wind');

const maxTempVal = document.getElementById('max-temp-val');
const maxTempCity = document.getElementById('max-temp-city');
const minTempVal = document.getElementById('min-temp-val');
const minTempCity = document.getElementById('min-temp-city');
const historyLog = document.getElementById('history-log');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) return;

    showLoading();
    hideError();

    const apiKey = apiKeyInput.value.trim();
    let data;

    try {
        if (apiKey) {
            data = await fetchRealWeather(city, apiKey);
        } else {
            data = await fetchMockWeather(city);
        }

        updateUI(data);
        updateAnalysis(data.city, data.temp);
        cityInput.value = ''; // clear input
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

async function fetchRealWeather(city, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) throw new Error("City not found");
        if (response.status === 401) throw new Error("Invalid API Key");
        throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return {
        city: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        desc: data.weather[0].description
    };
}

// Simulated fetch with mock data
async function fetchMockWeather(city) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const mock = MOCK_WEATHER[city.toLowerCase()];
            if (mock) {
                resolve({
                    city: city.charAt(0).toUpperCase() + city.slice(1),
                    temp: mock.temp,
                    humidity: mock.humidity,
                    wind: mock.wind,
                    desc: mock.desc
                });
            } else {
                reject(new Error("City not found in mock data. Try London, Paris, Tokyo, New York. Or provide an actual API Key."));
            }
        }, 600); // simulate network delay
    });
}

function updateUI(data) {
    uiCityName.textContent = data.city;
    uiCurrentTemp.textContent = data.temp.toFixed(1);
    uiWeatherDesc.textContent = data.desc;
    uiHumidity.textContent = `${data.humidity}%`;
    uiWind.textContent = `${data.wind} m/s`;
    
    weatherDisplay.classList.remove('hidden');
}

function updateAnalysis(city, temp) {
    // Insert into BST
    weatherDataBST.insert(city, temp);

    // Get Insights
    const minNode = weatherDataBST.getMinNode();
    const maxNode = weatherDataBST.getMaxNode();

    // Update Stats
    if (minNode) {
        minTempVal.textContent = `${minNode.temperature.toFixed(1)}°C`;
        minTempCity.textContent = minNode.city;
    }
    if (maxNode) {
        maxTempVal.textContent = `${maxNode.temperature.toFixed(1)}°C`;
        maxTempCity.textContent = maxNode.city;
    }

    // Update History Log (Sorted via InOrderTraversal)
    const sortedData = weatherDataBST.inOrderTraverse();
    renderHistoryLog(sortedData);
}

function renderHistoryLog(dataList) {
    historyLog.innerHTML = '';
    
    // Reverse the list if you want highest at top or keep as is for lowest at top
    // Let's do lowest to highest as traversed from standard BST
    dataList.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="city-col">${item.city}</span>
            <span class="temp-col">${item.temperature.toFixed(1)}°C</span>
        `;
        historyLog.appendChild(li);
    });
}

function showLoading() {
    loading.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}

function hideError() {
    errorMsg.classList.add('hidden');
}

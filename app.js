// OpenWeatherMap API key - put in the suitable place here
const API_KEY = "20a1c796747415568d39e6af0b6b0dac";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM elements
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const errorBox = document.getElementById("error");
const loadingBox = document.getElementById("loading");
const weatherCard = document.getElementById("weather-card");

const cityNameEl = document.getElementById("city-name");
const dateTimeEl = document.getElementById("date-time");
const weatherIconEl = document.getElementById("weather-icon");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const pressureEl = document.getElementById("pressure");
const windSpeedEl = document.getElementById("wind-speed");
const windDegEl = document.getElementById("wind-deg");
const visibilityEl = document.getElementById("visibility");
const cloudsEl = document.getElementById("clouds");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const countryEl = document.getElementById("country");
const coordsEl = document.getElementById("coords");
const minMaxEl = document.getElementById("min-max");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  getWeather(city);
});

async function getWeather(city) {
  hideError();
  weatherCard.classList.add("hidden");
  loadingBox.classList.remove("hidden");

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // OpenWeatherMap returns { cod: "404", message: "city not found" }
      throw new Error(data.message || "City not found.");
    }

    displayWeather(data);
  } catch (err) {
    showError("Error: " + err.message);
  } finally {
    loadingBox.classList.add("hidden");
  }
}

function displayWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  dateTimeEl.textContent = new Date().toLocaleString();

  const weather = data.weather[0];
  weatherIconEl.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  weatherIconEl.alt = weather.description;

  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = weather.description;

  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidityEl.textContent = `${data.main.humidity}%`;
  pressureEl.textContent = `${data.main.pressure} hPa`;
  windSpeedEl.textContent = `${data.wind.speed} m/s`;
  windDegEl.textContent = `${data.wind.deg ?? 0}° (${degToCompass(data.wind.deg)})`;
  visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  cloudsEl.textContent = `${data.clouds.all}%`;
  sunriseEl.textContent = formatTime(data.sys.sunrise, data.timezone);
  sunsetEl.textContent = formatTime(data.sys.sunset, data.timezone);
  countryEl.textContent = data.sys.country;
  coordsEl.textContent = `${data.coord.lat}, ${data.coord.lon}`;
  minMaxEl.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°C`;

  weatherCard.classList.remove("hidden");
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

function hideError() {
  errorBox.classList.add("hidden");
}

function degToCompass(deg) {
  if (deg === undefined || deg === null) return "N/A";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function formatTime(unixSeconds, timezoneOffsetSeconds) {
  // Convert to city local time using timezone offset
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toUTCString().slice(17, 22); // HH:MM
}

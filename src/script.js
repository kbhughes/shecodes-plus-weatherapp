
let dateTime = document.querySelector("#date-time");

let now = new Date();
let currentHour = now.getHours();
if (currentHour < 10) {
  currentHour = `0${currentHour}`;
}
let currentMinute = now.getMinutes();
if (currentMinute < 10) {
  currentMinute = `0${currentMinute}`;
}

let currentTime = `${currentHour}:${currentMinute}`;

let week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDay = week[now.getDay()];
dateTime.innerHTML = `${currentDay}, updated ${currentTime}`;

// Temperature Conversion

function convertFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#defaultTemp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function convertCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#defaultTemp");
  let celsiusConversion = (fahrenheitTemp - 32) * 5 / 9;
  temperatureElement.innerHTML = Math.round(celsiusConversion);
}

let fahrenheitTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertCelsius);

// Realtime Data

function searchCity(city) {
  let apiKey = `6a519c301ef89c219455ba379e04e37b`;  
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecast = response.data.list[0];

  forecastElement.innerHTML = `<div class="col-2">
          <p>Friday</p>
          <img 
          src = "https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" 
          />
          <strong>${Math.round(forecast.main.temp_max)}°</strong> / ${Math.round(forecast.main.temp_min)}°
        </div>`;
}

function displayWeather(response) {
  let newCity = response.data.name;
  let newCountry = response.data.sys.country;
  let newData = `${newCity} (${newCountry})`;
  let newImage = document.querySelector("#icon");

  fahrenheitTemp = response.data.main.temp;

  document.querySelector("#city").innerHTML = newData.toUpperCase();
  document.querySelector("#defaultTemp").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#temp-feel").innerHTML = Math.round(response.data.main.feels_like);
  document.querySelector("#humidity").innerHTML = Math.round(response.data.main.humidity);
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#description").innerHTML = response.data.weather[0].main;
  newImage.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = `6a519c301ef89c219455ba379e04e37b`; 
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let submitCity = document.querySelector("#search-form");
submitCity.addEventListener("submit", handleSubmit);


let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", getCurrentLocation);

searchCity("Atlanta");
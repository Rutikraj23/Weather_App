
// Step 1: Get HTML elements

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("city");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");

const error = document.getElementById("error");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecast");


// Step 2: API Key
const apiKey = "d74a3406544ffd4a627cc3601d47af5b";


// Step 3: Weather Function

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        error.innerText = "Please enter a city name";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found or API error");
        }

        const data = await response.json();

        // Display weather information

        cityName.innerText = data.name;

        temperature.innerText = data.main.temp + "°C";

        description.innerText = data.weather[0].description;
        
        weatherIcon.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        humidity.innerText = data.main.humidity + "%";

        wind.innerText = data.wind.speed + " m/s";

        feelsLike.innerText = data.main.feels_like + "°C";

        error.innerText = "";

        await getForecast(city);

    }

    catch (err) {

        error.innerText = err.message;

    }
}


// Step 4: Button Click Event

searchBtn.addEventListener("click", getWeather);



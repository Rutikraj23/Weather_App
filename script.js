
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


// Step 5: Get 5-Day Weather Forecast

async function getForecast(city) {

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    forecastContainer.replaceChildren();

    try {

        // Fetch forecast data
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Forecast data unavailable");
        }

        const data = await response.json();

        // Store one forecast for each date
        const dailyForecast = {};

        data.list.forEach(item => {

            const date = item.dt_txt.split(" ")[0];

            const hour = Number(
                item.dt_txt.split(" ")[1].slice(0, 2)
            );

            const distanceFromNoon = Math.abs(hour - 12);

            if (
                !dailyForecast[date] ||
                distanceFromNoon < dailyForecast[date].distance
            ) {

                dailyForecast[date] = {
                    item: item,
                    distance: distanceFromNoon
                };

            }

        });

        // Display five days
        Object.entries(dailyForecast)
            .slice(0, 5)
            .forEach(([date, forecast]) => {

                const item = forecast.item;

                // Create forecast card
                const card = document.createElement("div");

                card.className = "forecast-card";

                // Day and date
                const day = document.createElement("h3");

                day.innerText = new Date(date + "T00:00:00")
                    .toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric"
                    });

                // Weather icon
                const icon = document.createElement("img");

                icon.src =
                    `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

                icon.alt = item.weather[0].description;

                // Temperature
                const temp = document.createElement("p");

                temp.innerText =
                    Math.round(item.main.temp) + "°C";

                // Weather condition
                const condition = document.createElement("p");

                condition.innerText = item.weather[0].main;

                // Add elements to card
                card.append(day, icon, temp, condition);

                forecastContainer.appendChild(card);

            });

    }

    catch (err) {

        forecastContainer.innerText = err.message;

    }

}


var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#cityname');
var forecastContainerEl = document.querySelector('#forecast-container');
var citySearchTermEl = document.querySelector('#city-search-term');


var getCityForecasts = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=08c050bc124b048247b7377940b748b0'

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data, city);
                console.log(data);
            });
        } else {
            alert('ERROR: ' + city + ' does not have a forecast. Please input name of real city.')
        }
    })
}

var citySubmitHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityForecasts(cityName);
        cityInputEl.value = '';
    } else {
        alert('Please enter a city name to display forecasts');
    }
    console.log(event);
};

var displayWeather = function (weather, searchTerm) {
    forecastContainerEl.textContent = ''
    citySearchTermEl.textContent = searchTerm + ' (' + moment().format('l') + ')';

    var temp = weather.main.temp;
    var tempEl = document.createElement('div');
    var tempContainer = document.createElement("span");
    tempContainer.textContent = "Temp: " + temp;
    tempEl.appendChild(tempContainer);
    forecastContainerEl.appendChild(tempEl);

    var wind = weather.wind.speed;
    var windEl = document.createElement('div');
    var windContainer = document.createElement('span');
    windContainer.textContent = "Wind: " + wind;
    windEl.appendChild(windContainer);
    forecastContainerEl.appendChild(windEl);

    var humidity = weather.main.humidity;
    var humidityEl = document.createElement('div');
    var humidityContainer = document.createElement('span');
    humidityContainer.textContent = 'Humidity: ' + humidity;
    humidityEl.appendChild(humidityContainer);
    forecastContainerEl.appendChild(humidityEl);

    // var uvIndexEl = document.createElement('div');



};

userFormEl.addEventListener('submit', citySubmitHandler);



{/* <div id="temp"> Temp: </div>
<div id="wind"> Wind: </div>
<div id="humidity"> Humidity: </div>
<div id="uvIndex"> UV Index:</div> */}
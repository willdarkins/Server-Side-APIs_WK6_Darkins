var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#cityname');
var forecastContainerEl = document.querySelector('#forecast-container')
var citySearchTermEl = document.querySelector('#city-search-term')

var getCityForecasts = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=08c050bc124b048247b7377940b748b0'

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city);
        })
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
    citySearchTermEl.textContent = searchTerm + '' + ' (' + moment().format('l') + ')' + weather.weather.icon; 
};

userFormEl.addEventListener('submit', citySubmitHandler);
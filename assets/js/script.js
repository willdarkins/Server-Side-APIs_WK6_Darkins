var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#cityname');
var forecastContainerEl = document.querySelector('#forecast-container');
var citySearchTermEl = document.querySelector('#city-search-term');
var pastSearchEl = document.querySelector('#past-search')
var fiveDayEl = document.querySelector('#five-day-forecast')

var getCityForecasts = function (city) {
    var currentApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=08c050bc124b048247b7377940b748b0'

    fetch(currentApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayWeather(data, city);
                getUv(data.coord.lat, data.coord.lon);
            });
        } else {
            alert('ERROR: ' + city + ' does not have a forecast. Please input name of real city.')
        }
    })
}

var getUv = function (lat, lon) {
    var uvApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=&appid=08c050bc124b048247b7377940b748b0' 
    fetch(uvApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            })
        } else {
            console.log(response);
        }
        var uviIndex = lat.lon.current.uvi;
        var uviEl = document.createElement('div');
        var uviContainer = document.createElement('span');
        uviContainer.textContent = 'UV Index: ' + uviIndex;
        uviEl.appendChild(uviContainer);
        forecastContainerEl.append(uviEl);
    })
}


var getFiveDayForecast = function (city) {
    var fiveDayApiUrl = 'api.openweathermap.org/data/2.5/forecast?q='+ city +'&appid=08c050bc124b048247b7377940b748b0';

    fetch(fiveDayApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayFiveDay(data, city);
            })
        } else {
            alert('ERROR: ' + city + ' does not have five-day forecast. Please input name of real city.')
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
};

var displayWeather = function (weather, searchTerm) {
    forecastContainerEl.textContent = ''
    var weatherCartoon = weather.weather[0].icon;
    var weatherImage = document.createElement('img')
    weatherImage.src = 'https://openweathermap.org/img/w/' + weatherCartoon + '.png';
    var weatherHolder = document.createElement('span');
    weatherHolder.appendChild(weatherImage);
    citySearchTermEl.textContent = searchTerm + ' (' + moment().format('l') + ')';
    citySearchTermEl.appendChild(weatherHolder);

    var temp = weather.main.temp;
    var tempEl = document.createElement('div');
    var tempContainer = document.createElement("span");
    tempContainer.textContent = 'Temp: ' + temp + '°F';
    tempEl.appendChild(tempContainer);
    forecastContainerEl.appendChild(tempEl);

    var wind = weather.wind.speed;
    var windEl = document.createElement('div');
    var windContainer = document.createElement('span');
    windContainer.textContent = 'Wind: ' + wind + ' MPH';
    windEl.appendChild(windContainer);
    forecastContainerEl.appendChild(windEl);

    var humidity = weather.main.humidity;
    var humidityEl = document.createElement('div');
    var humidityContainer = document.createElement('span');
    humidityContainer.textContent = 'Humidity: ' + humidity + ' %';
    humidityEl.appendChild(humidityContainer);
    forecastContainerEl.appendChild(humidityEl);

};

var displayFiveDay = function(weather, searchTerm) {

}

userFormEl.addEventListener('submit', citySubmitHandler);

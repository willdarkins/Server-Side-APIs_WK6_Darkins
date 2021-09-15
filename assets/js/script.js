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

                var fiveDayTitle = document.createElement('h2')
                fiveDayTitle.textContent = '5-Day Forecast:'
                fiveDayTitle.style.color = 'black';
                fiveDayEl.appendChild(fiveDayTitle);
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
                var uviIndex = data.current.uvi;
                var uviEl = document.createElement('div');
                var uviContainer = document.createElement('span');
                var uviSpanNum = document.createElement('span')
                uviSpanNum.textContent = uviIndex
                uviContainer.textContent = 'UV Index: ' + uviSpanNum.textContent;
                uviEl.appendChild(uviContainer);
                forecastContainerEl.append(uviEl);
                if (uviIndex >= 0 && uviIndex < 3) {
                    uviContainer.style.backgroundColor = 'green'
                    uviContainer.style.color = 'white'
                }
                else if (uviIndex >= 3 && uviIndex < 5) {
                    uviContainer.style.backgroundColor = 'yellow'
                    uviContainer.style.color = 'white'
                }
                else if (uviIndex >= 5 && uviIndex < 7) {
                    uviSpanNum.style.backgroundColor = 'orange'
                    uviSpanNum.style.color = 'white'
                }
                else if (uviIndex >= 8 && uviIndex < 10) {
                    uviContainer.style.backgroundColor = 'orange'
                    uviContainer.style.color = 'white'
                }
                else {
                    uviContainer.style.backgroundColor = 'purple'
                    uviContainer.style.color = 'white'
                }
            })
        } else {
            console.log(response);
        }

    })
}

var getFiveDayForecast = function (city) {
    var fiveDayApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=08c050bc124b048247b7377940b748b0'

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
        getFiveDayForecast(cityName);
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
    humidityContainer.textContent = 'Humidity: ' + humidity + '%';
    humidityEl.appendChild(humidityContainer);
    forecastContainerEl.appendChild(humidityEl);

};

var displayFiveDay = function (weather) {
    
    var shouldSkip = false;
    
    for(i = 0; i < weather.list.length; i++) {

        var daytime = weather.list[i].dt_txt.split(" ");
        var time = daytime[1];
        var noon = weather.list[i];

        var forecastBox = document.createElement('div');
        fiveDayEl.appendChild(forecastBox);

        var date = document.createElement('span');
        date.textContent = 'test date';
        fiveDayEl.appendChild(date);

        var weatherCartoon = noon.weather[0].icon;
        var weatherImage = document.createElement('img')
        weatherImage.src = 'https://openweathermap.org/img/w/' + weatherCartoon + '.png';
        var weatherHolder = document.createElement('div');
        weatherHolder.appendChild(weatherImage);
        fiveDayEl.appendChild(weatherHolder);

        var fiveTemp = noon.main.temp;
        var fiveTempEl = document.createElement('div');
        var fiveTempContainer = document.createElement("span");
        fiveTempContainer.textContent = 'Temp: ' + fiveTemp + '°F';
        fiveTempEl.appendChild(fiveTempContainer);
        fiveDayEl.appendChild(fiveTempEl);

        var fiveWind = noon.wind.speed;
        var fiveWindEl = document.createElement('div');
        var fiveWindContainer = document.createElement('span');
        fiveWindContainer.textContent = 'Wind: ' + fiveWind + ' MPH';
        fiveWindEl.appendChild(fiveWindContainer);
        fiveDayEl.appendChild(fiveWindEl);

        var fiveHumidity = noon.main.humidity;
        var fiveHumidityEl = document.createElement('div');
        var fiveHumidityContainer = document.createElement('span');
        fiveHumidityContainer.textContent = 'Humidity: ' + fiveHumidity + '%';
        fiveHumidityEl.appendChild(fiveHumidityContainer);
        fiveDayEl.appendChild(fiveHumidityEl);
    }
}

userFormEl.addEventListener('submit', citySubmitHandler);




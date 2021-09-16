var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#cityname');
var forecastContainerEl = document.querySelector('#forecast-container');
var citySearchTermEl = document.querySelector('#city-search-term');
var pastSearchEl = document.querySelector('#past-search')
var fiveDayEl = document.querySelector('#five-day-forecast')
var forecastSquare = document.querySelector('#forecast-box')
var cities = [];

var saveCities = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var loadCities = function () {
    cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.forEach(city => {
        var savedCityButton = document.createElement('button');
        savedCityButton.textContent = city.text;
        savedCityButton.classList.add('btn');
        savedCityButton.style.backgroundColor = 'MediumTurquoise';
        pastSearchEl.appendChild(savedCityButton);

        savedCityButton.addEventListener('click', function (event) {
            city = event.target.textContent;
            forecastSquare.setAttribute('style', 'display: block')
            getCityForecasts(city);
            getFiveDayForecast(city);
            console.log(city);
        })
    })
    
}

var citySubmitHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityForecasts(cityName);
        getFiveDayForecast(cityName);
        forecastSquare.setAttribute('style', 'display:block');

        var savedCity = cityInputEl.value;
        var completeTask = {
            text: savedCity
        }
        cities.push(completeTask);
        saveCities()

        var savedCityButton = document.createElement('button');
        savedCityButton.textContent = savedCity;
        savedCityButton.classList.add('btn');
        savedCityButton.style.backgroundColor = 'MediumTurquoise';
        pastSearchEl.appendChild(savedCityButton);

        savedCityButton.addEventListener('click', function (event) {
            cityName = event.target.textContent;
            getCityForecasts(cityName);
            getFiveDayForecast(cityName);
        })

        cityInputEl.value = '';

    } else {
        alert('Please enter a city name to display forecasts');
    }
};

var getCityForecasts = function (city) {
    var currentApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=08c050bc124b048247b7377940b748b0'

    fetch(currentApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log('fired');
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
                    uviContainer.style.backgroundColor = 'Khaki'
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
    fiveDayEl.textContent = '';

    for (i = 0; i < weather.list.length; i++) {

        var daytime = weather.list[i].dt_txt.split(" ");
        var time = daytime[1];
        var noon = weather.list[i]

        var dateScript = weather.list[i].dt_txt.split(" ");
        var listDate = dateScript[0].split('-');
        var year = listDate[0];
        var month = listDate[1];
        var day = listDate[2];

        if (time === '12:00:00') {

            var weatherBox = document.createElement('div');
            weatherBox.style.border = 'solid black 2px';
            weatherBox.style.backgroundColor = 'SteelBlue';
            weatherBox.style.padding = '10px';
            fiveDayEl.appendChild(weatherBox);


            var date = document.createElement('span');
            date.textContent = month + '/' + day + '/' + year;
            date.classList.add('h4');
            date.style.color = 'white';
            weatherBox.appendChild(date);

            var weatherCartoon = noon.weather[0].icon;
            var weatherImage = document.createElement('img')
            weatherImage.src = 'https://openweathermap.org/img/w/' + weatherCartoon + '.png';
            var weatherHolder = document.createElement('div');
            weatherHolder.appendChild(weatherImage);
            weatherBox.appendChild(weatherHolder);

            var fiveTemp = noon.main.temp;
            var fiveTempEl = document.createElement('div');
            var fiveTempContainer = document.createElement("span");
            fiveTempContainer.textContent = 'Temp: ' + fiveTemp + '°F';
            fiveTempContainer.style.color = 'white';
            fiveTempEl.appendChild(fiveTempContainer);
            weatherBox.appendChild(fiveTempEl);

            var fiveWind = noon.wind.speed;
            var fiveWindEl = document.createElement('div');
            var fiveWindContainer = document.createElement('span');
            fiveWindContainer.textContent = 'Wind: ' + fiveWind + ' MPH';
            fiveWindContainer.style.color = 'white'
            fiveWindEl.appendChild(fiveWindContainer);
            weatherBox.appendChild(fiveWindEl);

            var fiveHumidity = noon.main.humidity;
            var fiveHumidityEl = document.createElement('div');
            var fiveHumidityContainer = document.createElement('span');
            fiveHumidityContainer.textContent = 'Humidity: ' + fiveHumidity + '%';
            fiveHumidityContainer.style.color = 'white';
            fiveHumidityEl.appendChild(fiveHumidityContainer);
            weatherBox.appendChild(fiveHumidityEl);
        }
    }
}

userFormEl.addEventListener('submit', citySubmitHandler);
loadCities();
var getCityForecasts = function(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=08c050bc124b048247b7377940b748b0'

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        })
    })
}

getCityForecasts('shanghai');
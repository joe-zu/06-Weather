
var today = new Date().toString().slice(0,15);

var cityNameEl = $('#city');
var currentDate = $('#current-date');
var forecastDiv = $('#forecast');
var tempEl = $('#temp');
var humidityEl = $('#humidity');
var windSpeedEl = $('#wind-speed');
var uvIndexEl = $('#uv-index');
var mainIcon = $('#main-icon');
var citySearch = $('#city-input');

var APIKey = "8dee4b0ee1ae4d9a2dcdb23ed4536c0c";


// Generate list of recently searched cities
if(localStorage.getItem('cities') !== null) {
    var localCityList = JSON.parse(localStorage.getItem('cities'))
    
    for(i = 0; i < localCityList.length; i++) {
        $('<li>').addClass('list-group-item').text(localCityList[i]).appendTo($("#city-list"))
    }
}
else {};

// MAIN FUNCTION
function displayWeatherForecast(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&cnt=5&appid=" + APIKey;
    // MAIN API CALL
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (response) {
            // console.log(response)

            var cityName = response.name;
            var mainWeatherIcon = response.weather[0].icon;
            var mainWeatherIconAlt = response.weather[0].description;

            //set data for main weather
            cityNameEl.text(cityName + '  (' + today + ')');
            tempEl.text(Math.floor(response.main.temp));
            humidityEl.text(response.main.humidity);
            windSpeedEl.text(Math.floor(response.wind.speed));
            mainIcon.attr('src', 'http://openweathermap.org/img/wn/' + mainWeatherIcon + '@2x.png').attr('alt', mainWeatherIconAlt);

            // LOCAL STORAGE

            //setting array if local storgae is empty
            if(localStorage.getItem('cities') == null) {
                localStorage.setItem('cities', '[]');
            }

            var cityList = JSON.parse(localStorage.getItem('cities'));
            //adds new city if not already existing
            if (cityList.indexOf(cityName) === -1){
                cityList.push(cityName);
            }
            

            localStorage.setItem('cities', JSON.stringify(cityList));
            
            var localCityList = JSON.parse(localStorage.getItem('cities'))
             for(i = 0; i < localCityList.length; i++) {
            $('<li>').addClass('list-group-item').text(localCityList[i]).appendTo($("#city-list"))
            }
            

            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            // UV API CALL
            var queryUvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey;
    
                $.ajax({
                    url: queryUvURL,
                    method: "GET"
                })

                    .then(function (response) {
                        var uvObject = response
            

                        // CHANGES UV BUTTON COLOR
                        uvIndexEl.text(uvObject.value)
                        $("#uv-index").removeClass()
                        if(uvObject.value < 3) {
                            $("#uv-index").addClass('btn btn-success')
                        }
                        else if(uvObject.value < 6) {
                            $("#uv-index").addClass('btn btn-warning')
                        }
                        else {
                            $("#uv-index").addClass('btn btn-danger')
                        }

                    });

        });
    //FORECAST API CALL
    $.ajax({
        url: queryForecastURL,
        method: "GET"
    })

        .then(function (response) {
            var forecast = response;
            // console.log(forecast);

            $('#five-day').empty();

            for(i = 0; i < 5; i++) {

                var forecastCard = $('<div>');
                forecastCard.addClass("card text-center text-white bg-secondary mb-3 col");
                forecastCard.attr("style", "max-width: 10rem;");

                var forecastCardBody = $('<div>');
                forecastCardBody.addClass("card-body").appendTo(forecastCard);

                var date = forecast.list[i].dt_txt.slice(0,10);
                $('<h5>').addClass("card-title").text(date).appendTo(forecastCardBody);

                var weatherIcon = forecast.list[i].weather[0].icon;
                var weatherIconAlt = forecast.list[i].weather[0].description;
                $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png').attr('alt', weatherIconAlt).appendTo(forecastCardBody);

                var forecastCardList = $('<ul>');
                forecastCardList.addClass('list-group list-group-flush');

                var forecastTemp = forecast.list[i].main.temp
                var forecastHumidity = forecast.list[i].main.humidity;

                $('<li>').text('Temp: ' + Math.floor(forecastTemp) + 'ºF').appendTo(forecastCardList);
                $('<li>').text('Humidity: ' + forecastHumidity + '%').appendTo(forecastCardList);
                forecastCardList.appendTo(forecastCardBody);


                forecastCard.appendTo($('#five-day'));  
            }
            
        });
    $('#forecast').show()
    $('#city-list').empty();
    
        
    
}


//SEARCH CLICK
$('#search').on('click', function() {
    event.preventDefault();
    if(citySearch[0].value) {
    displayWeatherForecast(citySearch[0].value)
    }
});

$('#city-list').on('click', '.list-group-item', function() {
    console.log($(this).text())
    displayWeatherForecast($(this).text())
})






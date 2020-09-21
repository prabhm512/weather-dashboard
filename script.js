$(document).ready(function() {
        
    var cityInput = $("#city-input");
    var cityList = $(".city-list");
    
    var cities = [];
    
    // Retrieves cities already that have already been searched for
    function getCityList() {
        
        var storedCities = JSON.parse(localStorage.getItem("cities"));
        
        if (storedCities !== null) {
            
            cities = storedCities;
        }
        
        // Initial Render
        for (i=cities.length-1; i>=0; i--) {
            var li = $("<li>");
            var num = cities.length-i;
            var button = $("<button>").attr("class", "button-"+num);
            button.append(cities[i]);
            li.append(button);
            cityList.append(li);
        }
    }
    
    getCityList();
    
    // Renders searched cities
    function renderCityList() {
        
        for (i=cities.length-1; i>=0; i--) {
                
            // Cities already rendered should not re-render
                
            if (cityList.children().length > i) {
                continue;
             }

             else {
                 // Render of newly searched city
                 var li = $("<li>");
                 var num = cities.length-i;
                 var button = $("<button>").attr("class", "button-"+num);
                 button.append(cities[i]);
                 li.append(button);
                 cityList.prepend(li);
             }
                       
         }   
         weatherDetails();
    }
    
    function setCityList() {
        
        // Do not allow cities to duplicate in array
        
        if (cities.length>0) {
            for (i=0; i<(cities.length-1); i++) {
                if (cities[i] === cityInput.val()) {
                    
                    // Removes last city of array if it is already in array
                    cities.splice(cities.length-1, 1);
                }
                
                else {
                    continue;
                }
            }
        }
        
        // Update local storage
        localStorage.setItem("cities", JSON.stringify(cities));
        
        renderCityList();
    }

    function weatherDetails() {

        var apiKey = "8121c6d84a8446a068b7f404eff68899";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput.val() + "&appid=" + apiKey;
        
        $.ajax({
            url: queryURL,
            method: "GET"
            
        }).then(function(response) {
            
            $(".display-5").text('');
            $(".lead").text('');

            // City Name
            var city = response.name;
            var heading = $(".display-5");
            heading.append(city + "  " + "(" + moment().format("D/M/YYYY") + ")");
            var iconCode = response.weather[0].icon;
            var img = $("<img>");
            img.attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
            heading.append(img);
            
            // City temperature in farenheit
            var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32 , 2);
            var newPara1 = $("<p>").attr("class", "lead");
            newPara1.append("Temperature: " + temp + " F");
            $(".jumbotron").append(newPara1);

            // City humidity

            var humidity = response.main.humidity;
            var newPara2 = $("<p>").attr("class", "lead");
            newPara2.append("Humidity: " + humidity + "%");
            $(".jumbotron").append(newPara2);

            // City wind speed
            var windSpeed = response.wind.speed;
            var newPara3 = $("<p>").attr("class", "lead");
            newPara3.append("Wind Speed: " + windSpeed + " MPH");
            $(".jumbotron").append(newPara3);
            
            // City latitude
            var lat = response.coord.lat;

            // City longitude
            var lon = response.coord.lon;
            
            // URL for UV Index
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey; 

            // Server call for UV Index
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function(response) {

                var newPara4 = $("<p>").attr("class", "lead");
                newPara4.append("UV Index: " + response.value);
                $(".jumbotron").append(newPara4);
            })

            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&exclude=current,minutely,hourly";

            // Server call for forecast
            $.ajax({
                url: queryURL, 
                method: "GET"
            }).then(function(response) {
                
                // Remove previous 5 day forecast
                $(".forecast-header").remove();

                    for (i=1; i<6; i++) {

                        var newForecast = $("<p>").attr("class", "forecast-header idx-"+i);

                        // Date in Unix UTC format
                        var unix_timestamp = response.daily[i].dt;

                        // Convert date to human readable form
                        var date = new Date(unix_timestamp*1000);

                        // Month is indexed at 0 in date object hence forecast is one month off. Fixes that.
                        var month = date.getMonth() + 1;

                        var newHeading = $("<p>").attr("class", "heading");
                        newHeading.append(date.getDate() + "/" + month + "/" + date.getFullYear());
                        newForecast.append(newHeading);

                        // Icons
                        var iconCode = response.daily[i].weather[0].icon;
                        var img = $("<img>");
                        img.attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");

                        // Render the icon
                        var newIcon = $("<p>").attr("class", "forecast-detail");
                        newIcon.append(img);
                        newForecast.append(newIcon);

                        // Render temperature
                        var newTemp = $("<p>").attr("class", "forecast-detail");
                        var tempFarenheit = Math.round((response.daily[i].temp.day - 273.15) * 1.80 + 32 , 2);
                        newTemp.append("Temp: " + tempFarenheit + " F");
                        newForecast.append(newTemp);

                        // Render humidity
                        var newHumidity = $("<p>").attr("class", "forecast-detail");
                        newHumidity.append("Humidity: " + response.daily[i].humidity + "%");
                        newForecast.append(newHumidity);

                        $(".forecast").append(newForecast);  
                    }
            })
        })
    }

    $(".submit-btn").on("click", function(event) {
        
        event.preventDefault();

        if (cityInput.val() !== "") {
            cities.push(cityInput.val());
        }

        setCityList();
    });

    // Stored city weather displayed on click
    
    $(".city-list > li > button").on("click", function(event) {
        event.preventDefault();

        cityInput.val($(this).text());

        setCityList();
    })
});

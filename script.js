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
            li.append(cities[i]);
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
                 li.append(cities[i]);
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
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput.val() + "&appid=8121c6d84a8446a068b7f404eff68899";
        
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
        })
        
        fiveDayForecast();
    }
   
    function fiveDayForecast() {

        $(".forecast").text('');
        
        var forecastDates = [];

            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput.val() + "&appid=8121c6d84a8446a068b7f404eff68899";

            $.ajax({
                url: queryURL, 
                method: "GET"
            }).then(function(response) {

                // Push unique forecast dates to array
                for (i=0; i<response.cnt-1; i++) {
                    if (response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(" ")) !== response.list[i+1].dt_txt.substr(0, response.list[i+1].dt_txt.indexOf(" "))) {
                        forecastDates.push(response.list[i].dt_txt.substr(0, response.list[i].dt_txt.indexOf(" ")));
                    }

                    if (forecastDates.length > 5) {
                        break;
                    }
                }
                
                for (i=0; i<5; i++) {
                    var newHeading = $("<h5>").attr("class", "forecast-header" + " idx-" + i);
                    $(".forecast").append(newHeading);
                    var date = forecastDates[i];
                    $(".idx-" + i).text(date);
            
                    // Icons
                    var iconCode = response.list[i].weather[0].icon;
                    var img = $("<img>");
                    img.attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
                    var newPara1 = $("<p>");
                    newPara1.append(img);
                    $(".idx-"+i).append(newPara1);
            
                    var temp = response.list[i].main.temp;
                    var newPara2 = $("<p>");
                    newPara2.append("Temp: " + temp + " F");
                    $(".idx-"+i).append(newPara2);
            
                    var humidity = response.list[i].main.humidity;
                    var newPara3 = $("<p>");
                    newPara3.append("Humidity: "+ humidity + "%");
                    $(".idx-"+i).append(newPara3);
                }
            })
        }

    $(".submit-btn").on("click", function(event) {
        
        event.preventDefault();

        if (cityInput.val() !== "") {
            cities.push(cityInput.val());
        }

        setCityList();
    });
});

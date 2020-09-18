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

            // City Name
            var city = response.name;
            var heading = $(".display-5");
            var iconCode = response.weather[0].icon;
            heading.append(city + "  " + "(" + moment().format("D/M/YYYY") + ")");
            var img = $("<img>");
            img.attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
            heading.append(img);
            
            // City temperature in farenheit
            var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32 , 2);
            var info = $(".lead");;
            info.append("Temperature: " + temp + " F");

            // City humidity

            var humidity = response.main.humidity;
            var newPara = $("<p>").attr("class", "lead");
            newPara.append("Humidity: " + humidity + "%");
            $(".jumbotron").append(newPara);

            // City wind speed
            var windSpeed = response.wind.speed;
            var newPara = $("<p>").attr("class", "lead");
            newPara.append("Wind Speed: " + windSpeed + " MPH");
            $(".jumbotron").append(newPara);
            
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey; 
            $.ajax({
                url: uvIndexURL,
                method: "GET"
            }).then(function(response) {

                var newPara = $("<p>").attr("class", "lead");
                newPara.append("UV Index: " + response.value);
                $(".jumbotron").append(newPara);
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
});

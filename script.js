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
            
            if (cityList.children().length >= i) {
                continue;
            }
            
            else {

                // Render of newly searched city
                var li = $("<li>");
                li.append(cities[i]);
                cityList.append(li);
    
            }

        }
    }
    
    function setCityList() {
        
        // Push searched city to array
        cities.push(cityInput.val());
        // Update local storage
        localStorage.setItem("cities", JSON.stringify(cities));
    
        renderCityList();
    }
    
    $(".submit-btn").on("click", setCityList);
})
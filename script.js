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
    
    $(".submit-btn").on("click", function() {

        cities.push(cityInput.val());
        setCityList(); 
    });
})
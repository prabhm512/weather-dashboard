var cityInput = $("#city-input");
var cityList = $(".city-list");

var cities = [];

function getCityList() {

    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {

        cities = storedCities;
    }
    renderCityList();
}

getCityList();

function renderCityList() {

    for (i=cities.length-1; i>=0; i--) {

        var li = $("<li>");
        li.append(cities[i]);
        cityList.append(li);
    }
}

function setCityList() {

    cities.push(cityInput.val());

    localStorage.setItem("cities", JSON.stringify(cities));

    renderCityList();
}

$(".submit-btn").on("click", setCityList);
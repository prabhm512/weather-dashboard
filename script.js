$(document).ready(function () {
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
    for (i = cities.length - 1; i >= 0; i--) {
      var li = $("<li>");
      var num = cities.length - i;
      var button = $("<button>").attr("class", "button-" + num);

      // First letter of string is always capital and the rest lower case.
      button.append(
        cities[i].substring(0, 1).toUpperCase() +
          cities[i].substring(1).toLowerCase()
      );
      li.append(button);
      cityList.append(li);
    }
  }

  getCityList();

  // Renders searched cities
  function renderCityList() {
    for (i = cities.length - 1; i >= 0; i--) {
      // Cities already rendered should not re-render

      if (cityList.children().length > i) {
        continue;
      } else {
        // Render of newly searched city
        var li = $("<li>");
        var button = $("<button>").attr("class", "button-" + i);

        // First letter of string is always capital and the rest lower case.
        button.append(
          cities[i].substring(0, 1).toUpperCase() +
            cities[i].substring(1).toLowerCase()
        );
        li.append(button);
        cityList.prepend(li);
      }
    }
  }

  function setCityList() {
    // Do not allow cities to duplicate in array

    if (cities.length > 0) {
      for (i = 0; i < cities.length - 1; i++) {
        if (cities[i].toUpperCase() === cityInput.val().toUpperCase()) {
          // Removes last city of array if it is already in array
          cities.splice(cities.length - 1, 1);
        } else {
          continue;
        }
      }
    }
  }

  function weatherDetails() {
    var apiKey = "8121c6d84a8446a068b7f404eff68899";
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityInput.val() +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
      statusCode: {
        404: function () {
          $(".display-5").text("");
          $(".lead").text("");
          $(".forecast-header").remove();
          $(".display-5").text("No city with this name exists :(");
          cities.pop();
          cityInput.val("");
        },
      },
    }).then(function (response) {
      $(".display-5").text("");
      $(".lead").text("");
      $(".uvi").text("");

      // City Name
      var city = response.name;
      var heading = $(".display-5");
      heading.append(city + "  " + "(" + moment().format("D/M/YYYY") + ")");
      var iconCode = response.weather[0].icon;
      var img = $("<img>");
      img.attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
      heading.append(img);

      // City temperature in farenheit
      var temp = Math.round((response.main.temp - 273.15) * 1.8 + 32, 2);
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
      var forecastURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey;

      // Server call for UV Index & Forecast
      $.ajax({
        url: forecastURL,
        method: "GET",
      }).then(function (response) {
        // UV Index
        var newPara4 = $("<p>").attr("class", "lead");
        newPara4.append("UV Index: ");

        // Allow styling of only UV Index value
        var uvi = $("<span>").attr("class", "uvi");
        uvi.append("&nbsp;" + response.current.uvi + "&nbsp;");
        newPara4.append(uvi);

        $(".jumbotron").append(newPara4);

        if (response.current.uvi >= 7.5) {
          $(".uvi").css({ "background-color": "red" });
        } else {
          $(".uvi").css({ "background-color": "green" });
        }

        // Remove previous 5 day forecast
        $(".forecast-header").remove();

        // Five day forecast
        for (i = 1; i < 6; i++) {
          var newForecast = $("<p>").attr("class", "forecast-header idx-" + i);

          // Date in Unix UTC format
          var unix_timestamp = response.daily[i].dt;

          // Convert date to human readable form
          var date = new Date(unix_timestamp * 1000);

          // Month is indexed at 0 in date object hence forecast is one month off. Fixes that.
          var month = date.getMonth() + 1;

          var newHeading = $("<p>").attr("class", "heading");
          newHeading.append(
            date.getDate() + "/" + month + "/" + date.getFullYear()
          );
          newForecast.append(newHeading);

          // Icons
          var iconCode = response.daily[i].weather[0].icon;
          var img = $("<img>");
          img.attr(
            "src",
            "http://openweathermap.org/img/w/" + iconCode + ".png"
          );

          // Render the icon
          var newIcon = $("<p>").attr("class", "forecast-detail");
          newIcon.append(img);
          newForecast.append(newIcon);

          // Render temperature
          var newTemp = $("<p>").attr("class", "forecast-detail");
          var tempFarenheit = Math.round(
            (response.daily[i].temp.day - 273.15) * 1.8 + 32,
            2
          );
          newTemp.append("Temp: " + tempFarenheit + " F");
          newForecast.append(newTemp);

          // Render humidity
          var newHumidity = $("<p>").attr("class", "forecast-detail");
          newHumidity.append("Humidity: " + response.daily[i].humidity + "%");
          newForecast.append(newHumidity);

          $(".forecast").append(newForecast);
        }
      });
      // Update local storage
      localStorage.setItem("cities", JSON.stringify(cities));

      renderCityList();
    });
  }

  $(".submit-btn").on("click", function (event) {
    event.preventDefault();

    cities.push(cityInput.val());

    setCityList();
    weatherDetails();

    // Fade out search menu
    $("#myNav").fadeOut();
  });

  // Stored city weather displayed on click

  for (i = 0; i <= cities.length; i++) {
    $(".button-" + i).on("click", function (event) {
      event.preventDefault();

      cityInput.val($(this).text());

      weatherDetails();

      // Fade out search menu
      $("#myNav").fadeOut();
    });
  }

  // Open search menu
  $(".openbtn").on("click", function () {
    // Allow actively generated button element to be clicked
    location.reload();
    // Fade in search menu
    $("#myNav").fadeIn();
  });
});

$(document).ready(function () {
  var currentDate = moment().format("M/D/YYYY");
  var weatherApiKey = "fa71042f3bd6f2175c35473b9ffdf2f4";
  // The function below creates an html block which displays the weather of the picked city for the next 5 days on the screen.
  function getFiveDaysWeather(obj) {
    //var city = localStorage.getItem("userInput");
    var sectionContainer = " ";
    for (let i = 4, j = 0; i < 40; i = i + 8, j++) {
      console.log();
      globalTime = moment().add(j + 1, "days");
      date = globalTime.format("M/D/YYYY");
      iconURL =
        "https://openweathermap.org/img/w/" +
        obj.list[i].weather[0].icon +
        ".png";
      tempForecast = Math.floor(1.8 * (obj.list[i].main.temp - 273) + 32);
      let section = `<div  class='cell medium-4 large-2'>
    <div id = 'fiveDayContainer'> <h5 id="current-city">  ${date}  </h5>
    <img id = "icon" src ="${iconURL}"> 
    <p id="temperature"> Temp: ${tempForecast} F </p>
    <p id="humidity"> Humidity: ${obj.list[i].main.humidity} % </p></div></div>`;
      sectionContainer = sectionContainer + section;
    }
    return sectionContainer;
  }
  //The function below creates an list element for each city.
  function displaySearchHistory(city) {
    var listEl = `<li class="list-group-item"> ${city}</li>`;
    $("#search-list").append(listEl);
  }
  // The function below represents the weather for the current day in the chosen city.
  function getTodayWeatherSection(
    cityName,
    todayDate,
    imgURL,
    cityTemp,
    cityHumid,
    cityWindSpeed,
    cityUV
  ) {
    return `<h1 id="current-city">${cityName} ( ${todayDate} ) <img id = "imgIcon" src ="${imgURL}"> </h1>  
<p id="temperature">Temperature: ${cityTemp} F </p>
<p id="humidity">Humidity: ${cityHumid}</p>
<p id="wind-speed">Wind Speed: ${cityWindSpeed} </p>
<p id="uv-index">UV Index: ${cityUV}</p>
<h4 id="five-day-weather" col-12 style='display:block'>Five Day Weather</h4><br>`;
  }

  // The Clear Search History button react on the click event and deletes all the cities of the list.
  $("#clear-all").on("click", function () {
    $("#search-list").empty();
    $("#page-content").empty();
  });

  // This function displays all the content of the introduced city on the screen(add the city to the list, displays the weather for current day and below the weather for the next five days).
  function displayAllContent(city) {
    $("#city-search").empty();
    $("#current-weather").empty();
    $("#five-day-weather").empty();
    weatherUrlAPI =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      weatherApiKey;
    $.ajax({
      url: weatherUrlAPI,
      method: "GET",
    })
      .then(function (response) {
        let uvAPI =
          "https://api.openweathermap.org/data/2.5/uvi?lat=" +
          response.coord.lat +
          "&lon=" +
          response.coord.lon +
          "&appid=" +
          weatherApiKey;

        return $.ajax({
          url: uvAPI,
          method: "GET",
        }).then(function (res) {
          displaySearchHistory(city);
          var todayWeatherSection = getTodayWeatherSection(
            response.name,
            currentDate,
            "https://openweathermap.org/img/w/" +
              response.weather[0].icon +
              ".png",
            (temperature = Math.floor(1.8 * (response.main.temp - 273) + 32)),
            response.main.humidity,
            response.wind.speed,
            res.value
          );
          $("#current-weather").append(todayWeatherSection);    
        }); 
      })
      .catch(function (error) {
        console.log(error);
        console.log("eroare");
      });
      
    //The section that display the weather for the next 5 days.
    var fiveDaysForecastAPI =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      weatherApiKey;
    $.ajax({
      url: fiveDaysForecastAPI,
      method: "GET",
    })
      .then(function (data) {
        $("#five-day").empty();
        var displayFiveDayWeather = getFiveDaysWeather(data);
        $("#five-day").append(displayFiveDayWeather);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // The function below displays the content on the page of a chosen city from the list ( the current day weather and the next five days wether).
  function displayListContent(city) {
    $("#city-search").empty();
    $("#current-weather").empty();
    $("#five-day-weather").empty();
    weatherUrlAPI =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      weatherApiKey;
    $.ajax({
      url: weatherUrlAPI,
      method: "GET",
    })
      .then(function (response) {
        let uvAPI =
          "https://api.openweathermap.org/data/2.5/uvi?lat=" +
          response.coord.lat +
          "&lon=" +
          response.coord.lon +
          "&appid=" +
          weatherApiKey;

        return $.ajax({
          url: uvAPI,
          method: "GET",
        }).then(function (res) {
          var todayWeatherSection = getTodayWeatherSection(
            response.name,
            currentDate,
            "https://openweathermap.org/img/w/" +
              response.weather[0].icon +
              ".png",
            (temperature = Math.floor(1.8 * (response.main.temp - 273) + 32)),
            response.main.humidity,
            response.wind.speed,
            res.value
          );
          $("#current-weather").append(todayWeatherSection);
        });
      })
      .catch(function (error) {
        console.log(error);
        console.log("eroare");
      });

    //The section that display the weather for the next 5 days.
    var fiveDaysForecastAPI =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      weatherApiKey;
    $.ajax({
      url: fiveDaysForecastAPI,
      method: "GET",
    })
      .then(function (data) {
        $("#five-day").empty();
        var displayFiveDayWeather = getFiveDaysWeather(data);
        $("#five-day").append(displayFiveDayWeather);
      })
      .catch(function (error) {
        console.log(error);
      });
      
  }

 
  //The search icon reacts on the click event and display the content on the screen.
  $("#run-search").on("click", function (event) {
    userInput = $("#city-search").val().trim();
    displayAllContent(userInput);
    $('input').val(''); 
  });//window.open("index.html", "_self");

  // The list text content (city name) reacts on the click event and displays the current weather an the next five days weather.
  $(".list-group").on("click", function (event) {
    displayListContent(event.originalEvent.srcElement.outerText);
  });
});

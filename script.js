$(document).ready(function () {
  var currentDate = moment().format("M/D/YYYY");
  var userInput;
  const cityHistoryList = [];
  var weatherApiKey = "fa71042f3bd6f2175c35473b9ffdf2f4";

  function getFiveDaysWeather(obj) {
    var sectionContainer = " ";
    for (let i = 4, j = 0; i < 40; i = i + 8, j++) {
      console.log();
      globalTime = moment().add(j + 1, "days");
      date = globalTime.format("M/D/YYYY");
      iconURL =
        "https://openweathermap.org/img/w/" +
        obj.list[i].weather[0].icon +
        ".png";
        tempForecast = Math.floor(1.8 * (obj.list[i].main.temp - 273) + 32)
      let section = `<div  class='cell medium-4 large-2'>

    <div id = 'fiveDayContainer'> <h5 id="current-city">  ${date}  </h5>
    <img id = "icon" src ="${iconURL}"> 
    <p id="temperature"> Temp: ${tempForecast} F </p>
    <p id="humidity"> Humidity: ${obj.list[i].main.humidity} % </p></div></div>`;
      sectionContainer = sectionContainer + section;
    }
    return sectionContainer;
  }

  function updateHistoryList() {
    cityHistoryList.push(userInput);
  }

  function displaySearchHistory() {
    var listEl = `<li class="list-group-item" id="inputCity"> ${userInput}</li>`  
    $("#search-list").append(listEl);
  }
  // var iconImage = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
  // iconImage.attr("width", 50);
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
<p id="wind-speed">Wind Speed:${cityWindSpeed} </p>
<p id="uv-index">UV Index: ${cityUV}</p>`
    
  }
  $("#clear-all").on("click", function () {
    $("#search-list").empty();
  })
  
  $("inputCity").on("click", function() {

  })

  function allContent () {
    $("#city-search").empty();
    updateHistoryList();
    displaySearchHistory();

    //Console user input in the browser.
    weatherUrlAPI =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      userInput +
      "&appid=" +
      weatherApiKey;
    $.ajax({
      url: weatherUrlAPI,
      method: "GET",
    }).then(function (response) {
      
      //updateHistoryList(userInput);
      //displaySearchHistory(cityHistoryList);

      let uvAPI =
        "http://api.openweathermap.org/data/2.5/uvi?lat=" +
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
          (imgURL =
            "https://openweathermap.org/img/w/" +
            response.weather[0].icon +
            ".png"),
          (temperature = Math.floor(1.8 * (response.main.temp - 273) + 32)),
          response.main.humidity,
          response.wind.speed,
          res.value

        );
        $("#current-weather").append(todayWeatherSection);
      });
    });
    $("#current-weather").empty();

    //The section that display the weather for the next 5 days.
    var fiveDaysForecastAPI =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      userInput +
      "&appid=" +
      weatherApiKey;
    $.ajax({
      url: fiveDaysForecastAPI,
      method: "GET",
    }).then(function (data) {
      $("#five-day").empty();
      var displayFiveDayWeather = getFiveDaysWeather(data);
      //iconURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
      $("#five-day").append(displayFiveDayWeather);
    });
  };

  $("#run-search").on("click", function (event) {
    event.preventDefault();
    userInput = $("#city-search").val().trim();
    allContent()
  });

  $("#search-list").on("click", function () {
    //event.preventDefault();
    newInput = $("#inputCity").innerHtml;
    allContent(newInput)
    //window.open("index.html", "_self");
  });
});
// dateIconURL =
//   "https://openweathermap.org/img/w/" +
//   response.daily[i].weather[0].icon +
//   ".png";

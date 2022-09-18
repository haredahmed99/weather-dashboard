var apiKey = "60febae823b8eccb276fbf44244f8a28";
var searchButton = document.getElementById('search-btn');
var today = moment();
var cityArray = [];

searchButton.addEventListener('click', getApi)

function getApi() {
  // fetch request gets coordinates based on city/user input
  var userInput = document.getElementById('location-search').value;
  var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&appid=' + apiKey;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var lat = data[0].lat
      var lon = data[0].lon
      var name = data[0].name
      
      renderCity(name);
      searchHistory(name);
      cityArray.push(name);
      console.log(cityArray);
      localStorage.setItem('cities', JSON.stringify(cityArray));

      var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&limit=1&units=imperial&appid=' + apiKey;
      // fetch request gets weather data based on city/user input
      fetch(weatherUrl)
      .then(function (weatherResponse){
        return weatherResponse.json();
      })
      .then(function(weatherData){

        renderCurrent(weatherData);
        renderFuture(weatherData);
      })
    });

    removeHidden();
}

function renderCity(data){
  var userCity = document.getElementById('city-name');
  userCity.textContent = data;
}

// renders current weather data
function renderCurrent(data){
  var timeId = document.getElementById('current-day')
  timeId.textContent = '(' + (today.format("M/D/YYYY")) + ')';

  var iconId = document.getElementById('weather-icon');
  var weatherIcon = data.current.weather[0].icon;
  iconId.src = 'https://openweathermap.org/img/w/' + weatherIcon + '.png';

  var tempData = data.current.temp;
  var windData = data.current.wind_speed;
  var humidityData = data.current.humidity;
  var uvData = data.current.uvi;

  var displayTemp = document.getElementById('temp');
  var displayWind = document.getElementById('wind');
  var displayHumidity = document.getElementById('humidity');
  var displayUv = document.getElementById('UV-Index');
  displayTemp.textContent = 'Temp: ' + tempData + ' F';
  displayWind.textContent = 'Wind: ' + windData + ' MPH';
  displayHumidity.textContent = 'Humidity: ' + humidityData + '%';
  displayUv.textContent = 'UV Index: ' + uvData;
  
  // sets colorblocking to UV index based on current conditions
  if(uvData > 5){
    displayUv.classList.add('severe')
  }else if(uvData > 2){
      displayUv.classList.add('moderate')
    }else{displayUv.classList.add('favorable')}
}

// renders future weather forecast
function renderFuture(data){

  for (var i = 1; i < 6; i++){
    var displayDate = document.getElementById('time' + i)
    var dt = data.daily[0 + i].dt;
    var unixFormat = moment.unix(dt).format("M/D/YYYY");
    displayDate.textContent = unixFormat;

    var displayIcon1 = document.getElementById('icon' + i)
    var futureIcon = data.daily[i].weather[0].icon;
    displayIcon1.src = 'https://openweathermap.org/img/w/' + futureIcon + '.png';

    var displayTemp1 = document.getElementById('temp' + i)
    var futureTemp = data.daily[i].temp.max;
    displayTemp1.textContent = 'Temp: ' + futureTemp + ' F';

    var displayWind1 = document.getElementById('wind' + i)
    var futureWind = data.daily[i].wind_speed;
    displayWind1.textContent = 'Wind: ' + futureWind + ' MPH';

    var displayHumidity1 = document.getElementById('humidity' + i)
    var futureHumidity = data.daily[i].humidity;
    displayHumidity1.textContent = 'Humidity: ' + futureHumidity + '%';
  }
}

// temporarily renders recent searches
function searchHistory(city){
  var cityBtn = document.createElement('button');
  var cityList = document.getElementById('search-list');
  cityBtn.textContent = city;
  cityBtn.classList.add('btn-primary', 'btn', 'city-btn', 'mt-1')
  cityList.append(cityBtn);

  cityBtn.addEventListener('click', function(e){
  var selectedCity = e.target.textContent;

  var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + '&appid=' + apiKey;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var lat = data[0].lat
      var lon = data[0].lon
      var name = data[0].name
      renderCity(name);

      var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&limit=1&units=imperial&appid=' + apiKey;

      fetch(weatherUrl)
      .then(function (weatherResponse){
        return weatherResponse.json();
      })
      .then(function(weatherData){

        renderCurrent(weatherData);
        renderFuture(weatherData);
      })
    });
})
}

function removeHidden() {
  var hiddenContainer = document.querySelector('.forecast-container')
  hiddenContainer.classList.remove('hidden');
};

// renders stored cities
function renderStorage (){
  var storedCities = JSON.parse(localStorage.getItem('cities'));
  console.log(storedCities);
  for (var i = 0; i < storedCities.length; i++){
  var cityBtn = document.createElement('button');
  var cityList = document.getElementById('search-list');
  cityBtn.textContent = storedCities[i];
  cityBtn.classList.add('btn-primary', 'btn', 'city-btn', 'mt-1')
  cityList.append(cityBtn);

  cityBtn.addEventListener('click', function(e){
  var selectedCity = e.target.textContent;
  console.log(selectedCity);

  var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + '&appid=' + apiKey;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var lat = data[0].lat
      var lon = data[0].lon
      var name = data[0].name
      renderCity(name);

      var weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&limit=1&units=imperial&appid=' + apiKey;

      fetch(weatherUrl)
      .then(function (weatherResponse){
        return weatherResponse.json();
      })
      .then(function(weatherData){

        renderCurrent(weatherData);
        renderFuture(weatherData);
      })
    });
    removeHidden();
    renderCity();
    renderCurrent();
    renderFuture();
})}
}

renderStorage();




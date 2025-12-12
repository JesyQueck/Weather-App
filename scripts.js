document.addEventListener('DOMContentLoaded', function () {
  const celBut = document.querySelector('.celBut');
  const fahBut = document.querySelector('.fahbut');
  const kmBut = document.querySelector('.kmBut');
  const mpBut = document.querySelector('.mpBut');
  const mmBut = document.querySelector('.mmBut');
  const inBut = document.querySelector('.inBut');
  const CelFah = document.querySelector('.cel-fah-value ');
  const humidityValue = document.querySelector('.humidity-value');
  const kmMphValue = document.querySelector('.km-mph-value');
  const precpValue = document.querySelector('.precp-value');
  const cityNameValue = document.querySelector('.countryName');
  const searchBtn = document.querySelector('.searchButton');
  const cityInput = document.querySelector('#cityInput');
  if (!searchBtn) {
    console.error(
      'Search button not found! Make sure you have an element with class "searchButton"'
    );
    return;
  }

  if (!cityInput) {
    console.error(
      'City input not found! Make sure you have an input with id "cityInput"'
    );
    return;
  }

  if (!CelFah) {
    console.error(
      'CelFah element not found! Make sure you have an element with class "cel-fah"'
    );
    return;
  }

  async function handleSearch() {
    const cityName = cityInput.value.trim();

    if (!cityName) {
      alert('Please enter a city name');
      return;
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;

    try {
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert('City not found!');
        return;
      }

      const latitude = geoData.results[0].latitude;
      const longitude = geoData.results[0].longitude;
      const cityName2 = geoData.results[0].name;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;

      const weatherResponse = await fetch(weatherUrl);
      const data = await weatherResponse.json();

      CelFah.textContent = `${Math.round(data.current.temperature_2m)}°C`;
      cityNameValue.textContent = `${cityName2}`;
      humidityValue.textContent = `${data.current.relative_humidity_2m}%`;
      precpValue.textContent = `${data.current.precipitation}mm`;
      kmMphValue.textContent = `${data.current.wind_speed_10m}km/h`;

      console.log('\nHourly Forecast (Next 24 Hours):');
      for (let i = 0; i < 24; i++) {
        const time = data.hourly.time[i];
        const temp = data.hourly.temperature_2m[i];
        console.log(`${time}: ${temp}°C`);
      }

      console.log('\nDaily Forecast:');
      data.daily.time.forEach((date, index) => {
        console.log(
          `${date}: Max ${data.daily.temperature_2m_max[index]}°C, Min ${data.daily.temperature_2m_min[index]}°C`
        );
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('Error fetching weather data');
    }
  }

  searchBtn.addEventListener('click', handleSearch);

  cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
});

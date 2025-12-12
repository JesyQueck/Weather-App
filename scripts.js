document.addEventListener('DOMContentLoaded', function () {
  const celBut = document.querySelector('.celBut');
  const fahBut = document.querySelector('.fahbut');
  const kmBut = document.querySelector('.kmBut');
  const mpBut = document.querySelector('.mpBut');
  const mmBut = document.querySelector('.mmBut');
  const inBut = document.querySelector('.inBut');
  const CelFah = document.querySelector('.cel-fah');
  const kmMph = document.querySelector('.km-mph');
  const searchBtn = document.querySelector('.searchButton');

  async function handleSearch() {
    searchBtn.value = cityName;

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

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;

      const weatherResponse = await fetch(weatherUrl);
      const data = await weatherResponse.json();

      console.log('Current Weather:');
      console.log(`Temperature: ${data.current.temperature_2m}°C`);
      console.log(`Humidity: ${data.current.relative_humidity_2m}%`);
      console.log(`Precipitation: ${data.current.precipitation}mm`);
      console.log(`Wind Speed: ${data.current.wind_speed_10m}km/h`);

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

  /* celBut.addEventListener('click', function () {
    CelFah.innerHTML = 'Celsius';
  });
   fahBut.addEventListener('click', function () {
    CelFah.innerHTML = 'Farenheit';
  });
  kmBut.addEventListener('click', function () {
    kmMph.innerHTML = 'kmmmm';
  });
  mmBut.addEventListener('click', function () {});
  mpBut.addEventListener('click', function () {});
  inBut.addEventListener('click', function () {}); */
});

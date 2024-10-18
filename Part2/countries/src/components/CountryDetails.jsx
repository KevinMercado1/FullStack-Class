import { useEffect, useState } from 'react';
import axios from 'axios';

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    const capital = country.capital[0];
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`
      )
      .then((response) => setWeather(response.data));
  }, [country.capital, api_key]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        style={{ width: '200px' }}
      />

      {weather && (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default CountryDetails;

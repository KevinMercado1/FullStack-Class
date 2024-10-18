import { useState } from 'react';
import CountryDetails from './CountryDetails';

const CountryList = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} />;
  }

  if (countries.length > 10) {
    return <p>Too many matches, please specify another filter.</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => setSelectedCountry(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  } else if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />;
  } else {
    return <p>No matches</p>;
  }
};

export default CountryList;

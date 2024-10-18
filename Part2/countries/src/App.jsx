import { useState, useEffect } from 'react';
import axios from 'axios';
import CountryList from './components/CountryList';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search.length > 0) {
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then((response) => {
          const filteredCountries = response.data.filter((country) =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
          );
          setCountries(filteredCountries);
        });
    }
  }, [search]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search countries..."
      />
      <CountryList countries={countries} />
    </div>
  );
};

export default App;

// src/components/CountryGrid.jsx
import CountryCard from './CountryCard';

function CountryGrid({ countries }) {
  return (
    <div className="country-grid">
      {countries.map((country) => (
        <CountryCard 
          key={country.id}
          flag={country.flag}
          name={country.name}
          capital={country.capital}
          population={country.population}
          language={country.language}
        />
      ))}
    </div>
  );
}

export default CountryGrid;
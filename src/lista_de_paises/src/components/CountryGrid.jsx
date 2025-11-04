// src/components/CountryGrid.jsx
import CountryCard from './CountryCard';

function CountryGrid({ countries, favorites, onToggleFavorite }) {
  return (
    <div className="country-grid">
      {countries.map((country) => (
        <CountryCard
        <CountryCard 

          key={country.cca3}
          cca3={country.cca3}
          flag={country.flag}
          name={country.name}
          capital={country.capital}

          population={country.population}
          region={country.region}
          subregion={country.subregion}
          isFavorite={favorites.includes(country.cca3)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default CountryGrid;
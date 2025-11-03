// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import useCountries from '../hooks/useCountries';

function Home() {
  const { countries, isLoading, error } = useCountries();
  const [search, setSearch] = useState('');
  const filtered = countries.filter(c => 
    c.name.common.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Lista de Países</h1>
      <input 
        placeholder="Buscar país..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="countries-grid">
        {filtered.map(country => (
          <div key={country.cca3} className="country-card">
            <img src={country.flags.png} alt={country.name.common} />
            <h3>{country.name.common}</h3>
            <p>🌎 {country.region}</p>
            <Link 
              to={`/pais/${country.cca3}`} 
              state={{ country }}
            >
              Ver detalhes
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
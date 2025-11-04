import { useEffect, useState } from 'react';
import CountryGrid from '../components/CountryGrid';

function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Buscar países da API do IBGE
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/paises');
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();
        
        // Mapear para o formato esperado (com fallbacks seguros)
        const mapped = data.map((country) => {
          const alpha2 = (country?.id?.['ISO-ALPHA-2'] || '').toLowerCase();
          const cca3 = country?.id?.['ISO-ALPHA-3'] || country?.id?.M49?.toString() || '';
          const name = country?.nome?.abreviado || country?.nome || 'N/A';
          const capital = country?.capital?.nome || 'N/A';
          const region = country?.localizacao?.regiao?.nome || '';
          const subregion = country?.localizacao?.['sub-regiao']?.nome || '';

          return {
            cca3,
            flag: alpha2 ? `https://flagcdn.com/${alpha2}.svg` : '',
            name,
            capital,
            region,
            subregion,
            population: 0,
          };
        });
        
        setCountries(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filtrar países
  const filteredCountries = countries.filter((country) => {
    const matchSearch = (country.name || '').toLowerCase().includes(search.toLowerCase());
    const matchRegion = !region || country.region === region;
    return matchSearch && matchRegion;
  });

  // Toggle favorito
  const toggleFavorite = (cca3) => {
    setFavorites(prev => 
      prev.includes(cca3) 
        ? prev.filter(code => code !== cca3)
        : [...prev, cca3]
    );
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">Erro ao carregar países: {error}</div>;

  return (
    <div>
      <header className="page-header">
        <h1>Lista de Países</h1>
        <div className="header-stats">
          <span>Total: {countries.length}</span>
          <span>Visíveis: {filteredCountries.length}</span>
          <span>⭐ Favoritos: {favorites.length}</span>
        </div>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar país..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={region} 
          onChange={(e) => setRegion(e.target.value)}
          className="region-select"
        >
          <option value="">Todas as regiões</option>
          <option value="África">África</option>
          <option value="Américas">Américas</option>
          <option value="Ásia">Ásia</option>
          <option value="Europa">Europa</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <CountryGrid 
        countries={filteredCountries}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default Home;

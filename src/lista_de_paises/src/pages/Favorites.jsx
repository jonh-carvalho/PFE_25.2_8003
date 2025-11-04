import { useEffect, useState } from 'react';
import CountryGrid from '../components/CountryGrid';

function Favorites() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Buscar países
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/paises');
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();
        
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

  // Filtrar apenas favoritos
  const favoriteCountries = countries.filter(country => 
    favorites.includes(country.cca3)
  );

  const toggleFavorite = (cca3) => {
    setFavorites(prev => 
      prev.includes(cca3) 
        ? prev.filter(code => code !== cca3)
        : [...prev, cca3]
    );
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">Erro: {error}</div>;

  return (
    <div>
      <header className="page-header">
        <h1>⭐ Meus Favoritos</h1>
        <div className="header-stats">
          <span>Total: {favoriteCountries.length}</span>
        </div>
      </header>

      {favoriteCountries.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não tem favoritos.</p>
          <p>Volte à página inicial e marque alguns países! 🌍</p>
        </div>
      ) : (
        <CountryGrid 
          countries={favoriteCountries}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}

export default Favorites;

// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import CountryGrid from './components/CountryGrid';
import './App.css';

function App() {
  // Estado 1: Dados dos países (simulando o que virá de API)
  const [countries] = useState([
    {
      id: 1,
      cca3: "BRA",
      name: "Brasil",
      capital: "Brasília",
      population: 215000000,
      region: "Americas",
      subregion: "South America",
      flag: "🇧🇷"
    },
    {
      id: 2,
      cca3: "ARG",
      name: "Argentina",
      capital: "Buenos Aires",
      population: 45000000,
      region: "Americas",
      subregion: "South America",
      flag: "🇦🇷"
    },
    {
      id: 3,
      cca3: "FRA",
      name: "França",
      capital: "Paris",
      population: 67000000,
      region: "Europe",
      subregion: "Western Europe",
      flag: "🇫🇷"
    },
    {
      id: 4,
      cca3: "JPN",
      name: "Japão",
      capital: "Tóquio",
      population: 125000000,
      region: "Asia",
      subregion: "Eastern Asia",
      flag: "🇯🇵"
    },
    {
      id: 5,
      cca3: "AUS",
      name: "Austrália",
      capital: "Canberra",
      population: 26000000,
      region: "Oceania",
      subregion: "Australia and New Zealand",
      flag: "🇦🇺"
    },
    {
      id: 6,
      cca3: "ZAF",
      name: "África do Sul",
      capital: "Pretória",
      population: 60000000,
      region: "Africa",
      subregion: "Southern Africa",
      flag: "🇿🇦"
    }
  ]);

  // Estado 2: Favoritos (array de códigos de países)
  const [favorites, setFavorites] = useState([]);

  // Estado 3: Região selecionada no filtro
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Estado 4: Termo de busca
  const [searchTerm, setSearchTerm] = useState('');

  // Estado 5: Modo de visualização
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Função para alternar favorito
  const toggleFavorite = (countryCode) => {
    setFavorites(prev => 
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)  // Remove
        : [...prev, countryCode]                     // Adiciona
    );
  };

  // Aplicar filtros combinados
  const getFilteredCountries = () => {
    let filtered = countries;

    // Filtro 1: Apenas favoritos (se ativado)
    if (showOnlyFavorites) {
      filtered = filtered.filter(country => favorites.includes(country.cca3));
    }

    // Filtro 2: Por região
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(country => country.region === selectedRegion);
    }

    // Filtro 3: Por busca textual
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(country =>
        country.name.toLowerCase().includes(search) ||
        country.capital.toLowerCase().includes(search) ||
        country.region.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const filteredCountries = getFilteredCountries();

  // Extrair regiões únicas para o filtro
  const regions = ['all', ...new Set(countries.map(c => c.region))];

  return (
    <div className="app">
      <Header 
        title="🌍 Lista de Países da América do Sul"
        subtitle="Gerenciamento de estados complexos em React"
        totalCountries={countries.length}
        favoriteCount={favorites.length}
        filteredCount={filteredCountries.length}
      />

      {/* Controles de Filtro */}
      <div className="controls">
        {/* Busca */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por país, capital ou região..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-btn"
              title="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro de Região */}
        <div className="filter-region">
          <label>🌍 Região:</label>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'Todas as regiões' : region}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Favoritos */}
        <button 
          className={`filter-btn ${showOnlyFavorites ? 'active' : ''}`}
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
        >
          {showOnlyFavorites ? '📋 Mostrar Todos' : '❤️ Mostrar Favoritos'}
        </button>

        {/* Limpar Filtros */}
        {(searchTerm || selectedRegion !== 'all' || showOnlyFavorites) && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('all');
              setShowOnlyFavorites(false);
            }}
            className="clear-all-btn"
          >
            🗑️ Limpar Filtros
          </button>
        )}
      </div>

      {/* Resultados */}
      <div className="results-info">
        <p>
          Exibindo <strong>{filteredCountries.length}</strong> de {countries.length} países
          {showOnlyFavorites && ' (somente favoritos)'}
          {searchTerm && ` - Busca: "${searchTerm}"`}
          {selectedRegion !== 'all' && ` - Região: ${selectedRegion}`}
        </p>
      </div>

      {/* Grid de Países */}
      {filteredCountries.length > 0 ? (
        <CountryGrid 
          countries={filteredCountries}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <div className="empty-state">
          <p className="empty-icon">🔍</p>
          <h3>Nenhum país encontrado</h3>
          <p>Tente ajustar os filtros de busca ou região.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('all');
              setShowOnlyFavorites(false);
            }}
            className="btn-reset"
          >
            Resetar Filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
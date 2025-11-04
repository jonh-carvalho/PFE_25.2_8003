<<<<<<< HEAD
// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
=======
// src/App.jsx - Carregamento Automático
import { useEffect, useState } from 'react';
import './App.css';
import CountryGrid from './components/CountryGrid';

function App() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: carregar países AUTOMATICAMENTE ao montar componente
  useEffect(() => {
    console.log('useEffect executado! Carregando países...');

    const loadCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/paises');

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Países carregados:', data.length);

        // Mapeia os dados do IBGE para o formato esperado
        const mapped = data.map(pais => ({
          cca3: pais.id['ISO-3166-1-ALPHA-3'],
          flag: `https://flagcdn.com/${pais.id['ISO-3166-1-ALPHA-2'].toLowerCase()}.svg`,
          name: pais.nome.abreviado,
          capital: pais.governo?.capital?.nome || 'N/A',
          population: 0,
          region: pais.localizacao.regiao.nome,
          subregion: pais.localizacao['sub-regiao']?.nome || 'N/A'
        }));

        setCountries(mapped);
        console.log('✅ Países mapeados:', mapped.length, 'países');

      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []); // Array vazio = executa apenas UMA VEZ na montagem

  const toggleFavorite = (countryCode) => {
    setFavorites(prev => 
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lista de Países do Mundo</h1>
        <p>Carregamento automático com useEffect</p>

        {/* Debug: sempre mostrar para testar */}
        <div className="header-stats">
          <span>{countries.length} países</span>
          <span>{favorites.length} favoritos</span>
        </div>
      </header>

      <main className="main-content">
        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Carregando países...</h2>
            <p>Buscando dados da API do IBGE</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Ops! Algo deu errado</h2>
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && (
          <CountryGrid 
            countries={countries}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
>>>>>>> a5d5339fbb9b00b92ea8960787370afed3f7af03
  );
}

export default App;

// src/App.jsx - Versão com Loading e Erro
import { useState } from 'react';
import CountryGrid from './components/CountryGrid';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCountries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Iniciando requisição para API do IBGE...');

      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/paises');

      console.log('Resposta recebida, status:', response.status);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      console.log('Dados processados:', data.length, 'países');

      // Mapeia os dados do IBGE para o formato do app
      const mapped = data.map(pais => ({
        cca3: pais.id['ISO-3166-1-ALPHA-3'],
        flag: `https://flagcdn.com/${pais.id['ISO-3166-1-ALPHA-2'].toLowerCase()}.svg`,
        name: pais.nome.abreviado,
        capital: pais.governo?.capital?.nome || 'N/A',
        population: 0, // API do IBGE não retorna população
        region: pais.localizacao.regiao.nome,
        subregion: pais.localizacao['sub-regiao']?.nome || 'N/A'
      }));

      setCountries(mapped);

    } catch (err) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
        <p>Conectado à API do IBGE</p>

        <button 
          onClick={loadCountries} 
          disabled={isLoading}
          className="load-btn"
        >
          {isLoading ? 'Carregando...' : 'Carregar Países'}
        </button>

        {countries.length > 0 && (
          <div className="header-stats">
            <span>{countries.length} países</span>
            <span>{favorites.length} favoritos</span>
          </div>
        )}
      </header>

      <main className="main-content">
        {isLoading && <Loading />}

        {error && (
          <ErrorMessage 
            message={error}
            onRetry={loadCountries}
          />
        )}

        {!isLoading && !error && countries.length > 0 && (
          <CountryGrid 
            countries={countries}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {!isLoading && !error && countries.length === 0 && (
          <div className="welcome-state">
            <h2>Bem-vindo!</h2>
            <p>Clique no botão acima para carregar dados de todos os países do mundo.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
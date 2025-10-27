// src/App.jsx
import { useState } from 'react';
import './App.css';
import CountryGrid from './components/CountryGrid';
import Header from './components/Header';
import AddCountryForm from './components/AddCountryForm';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

function App() {
 
  {/*const [countries, setCountries] = useState([
    { id: 1, flag: "🇧🇷", name: "Brasil", capital: "Brasília", population: "215 milhões", language: "Português" },
    { id: 2, flag: "🇦🇷", name: "Argentina", capital: "Buenos Aires", population: "45 milhões", language: "Espanhol" },
    { id: 3, flag: "🇨🇱", name: "Chile", capital: "Santiago", population: "19 milhões", language: "Espanhol" },
    { id: 4, flag: "🇺🇾", name: "Uruguai", capital: "Montevidéu", population: "3.5 milhões", language: "Espanhol" },
    { id: 5, flag: "🇵🇪", name: "Peru", capital: "Lima", population: "33 milhões", language: "Espanhol" },
    { id: 6, flag: "🇨🇴", name: "Colômbia", capital: "Bogotá", population: "51 milhões", language: "Espanhol" }
  ]);*/}

  // Armazena os IDs dos países favoritos
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [paises, setPaises] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const favoriteCount = favorites.length;

  const visibleCountries = showOnlyFavorites
    ? countries.filter((c) => favorites.includes(c.id))
    : countries;

  const addCountry = (newCountry) => {
    setCountries([...countries, newCountry]);
  }

  const toggleForm = () => {
    setShowForm(!showForm);
  };


  // Função que simula busca da API
  const buscarPaises = async () => {
    
    // Analisar a forma como se busca informações da API REST Countries
    const response = await fetch('https://restcountries.com/v3.1/all');
    const dadosSimulados = await response.json();
    setCarregando(true);
    setErro(null);

    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular possível erro (30% de chance)
      if (Math.random() < 0.3) {
        throw new Error('Erro de conexão com o servidor');
      }

      setPaises(dadosSimulados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  React.useEffect(() => {
    buscarPaises();
  }, []);

  return (
    <div className="app">
      
      {/*<Header 
        title="🌍 Lista de Países da América do Sul"
        subtitle="Explore países sul-americanos e suas informações"
        favoriteCount={favoriteCount}
      />
      */}

        <header className="app-header">
        <h1>🌍 Lista de Países</h1>
        <p>Dados obtidos via API REST Countries</p>

        {paises.length > 0 && (
          <div className="stats">
            <span>📊 {paises.length} países</span>
            <span>❤️ {favoritos.length} favoritos</span>
          </div>
        )}
      </header>
{/*
      <div className="controls">

        <button 
          className={`filter-btn ${showOnlyFavorites ? 'active' : ''}`}
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
        >
          {showOnlyFavorites ? 'Mostrar Todos' : 'Mostrar Favoritos'}
        </button>

        <button 
          className="toggle-form-btn"
          onClick={toggleForm}
        >
          {showForm ? 'Ocultar Formulário' : 'Adicionar País'}
        </button>
      </div>

      {showForm && (
        <AddCountryForm onAddCountry={addCountry} />
      )}
      
      <CountryGrid 
        countries={visibleCountries}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
*/}
<main className="main-content">
        {carregando && <Loading />}

        {erro && (
          <ErrorMessage 
            mensagem={erro} 
            onTentar={buscarPaises}
          />
        )}

        {!carregando && !erro && paises.length > 0 && (
          <div className="countries-grid">
            {paises.map(pais => (
              <CountryCard 
                key={pais.cca3}
                pais={pais}
                isFavorito={favoritos.includes(pais.cca3)}
                onToggleFavorito={() => toggleFavorito(pais.cca3)}
              />
            ))}
          </div>
        )}

        {!carregando && !erro && paises.length === 0 && (
          <div className="empty-state">
            <p>🌍 Nenhum país encontrado</p>
            <button onClick={buscarPaises}>Carregar Países</button>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
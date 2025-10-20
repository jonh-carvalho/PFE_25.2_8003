// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import CountryGrid from './components/CountryGrid';
import './App.css';

function App() {
  const [countries, setCountries] = useState([
    { id: 1, flag: "🇧🇷", name: "Brasil", capital: "Brasília", population: "215 milhões", language: "Português" },
    { id: 2, flag: "🇦🇷", name: "Argentina", capital: "Buenos Aires", population: "45 milhões", language: "Espanhol" },
    { id: 3, flag: "🇨🇱", name: "Chile", capital: "Santiago", population: "19 milhões", language: "Espanhol" },
    { id: 4, flag: "🇺🇾", name: "Uruguai", capital: "Montevidéu", population: "3.5 milhões", language: "Espanhol" },
    { id: 5, flag: "🇵🇪", name: "Peru", capital: "Lima", population: "33 milhões", language: "Espanhol" },
    { id: 6, flag: "🇨🇴", name: "Colômbia", capital: "Bogotá", population: "51 milhões", language: "Espanhol" }
  ]);

  const [favoriteCount, setFavoriteCount] = useState(0);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const updateFavoriteCount = (increment) => {
    setFavoriteCount(favoriteCount + (increment ? 1 : -1));
  };

  return (
    <div className="app">
      <Header 
        title="🌍 Lista de Países da América do Sul"
        subtitle="Explore países sul-americanos e suas informações"
        favoriteCount={favoriteCount}
      />
      
      <div className="controls">
        <button 
          className={`filter-btn ${showOnlyFavorites ? 'active' : ''}`}
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
        >
          {showOnlyFavorites ? 'Mostrar Todos' : 'Mostrar Favoritos'}
        </button>
      </div>
      
      <CountryGrid 
      countries={countries}
      // onFavoriteChange={updateFavoriteCount}
      //showOnlyFavorites={showOnlyFavorites}
      
      />
    </div>
  );
}

export default App;
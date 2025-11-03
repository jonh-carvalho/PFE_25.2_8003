// src/App.jsx
import { useState } from 'react';
import './App.css';
import AddCountryForm from './components/AddCountryForm';
import CountryGrid from './components/CountryGrid';
import Header from './components/Header';

function App() {
  const [countries, setCountries] = useState([
    { id: 1, flag: "🇧🇷", name: "Brasil", capital: "Brasília", population: "215 milhões", language: "Português" },
    { id: 2, flag: "🇦🇷", name: "Argentina", capital: "Buenos Aires", population: "45 milhões", language: "Espanhol" },
    { id: 3, flag: "🇨🇱", name: "Chile", capital: "Santiago", population: "19 milhões", language: "Espanhol" },
    { id: 4, flag: "🇺🇾", name: "Uruguai", capital: "Montevidéu", population: "3.5 milhões", language: "Espanhol" },
    { id: 5, flag: "🇵🇪", name: "Peru", capital: "Lima", population: "33 milhões", language: "Espanhol" },
    { id: 6, flag: "🇨🇴", name: "Colômbia", capital: "Bogotá", population: "51 milhões", language: "Espanhol" }
  ]);
  // Armazena os IDs dos países favoritos
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
  };

  const toggleForm = () => {
    setShowForm(!showForm);
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
    </div>
  );
}

export default App;
import {useState} from 'react';
// src/components/CountryCard.jsx
function CountryCard({ flag, name, capital, population, language }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  }

  return (
    <div className={`country-card ${isFavorite ? "favorite" : ""}`} onClick={toggleFavorite}>

      <div className="country-header">
        <span className="flag">{flag}</span>
        <h3>{name}</h3>
        <button 
          className="favorite-btn"
          onClick={toggleFavorite}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="country-info">
        <p><strong>Capital:</strong> {capital}</p>
        <p><strong>População:</strong> {population}</p>
        <p><strong>Idioma:</strong> {language}</p>
        {isFavorite && <p className="favorite-badge">⭐ Favorito</p>}
      </div>
    </div>
  );
}

export default CountryCard;
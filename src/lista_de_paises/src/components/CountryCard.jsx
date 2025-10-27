// src/components/CountryCard.jsx
function CountryCard({ id, flag, name, capital, population, language, isFavorite = false, onToggleFavorite }) {
  
  const handleCardClick = () => {
    onToggleFavorite?.(id);
  };

  return (
    {/*<div 
      className={`country-card ${isFavorite ? 'favorite' : ''}`}
      onClick={handleCardClick}
    >
      <div className="country-header">
        <span className="flag">{flag}</span>
        <h3>{name}</h3>
        <button 
          className="favorite-btn"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(id); }}
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
    </div> */}
    <div>
    <div className="country-card">
      <div className="country-flag">{pais.flag}</div>
      <div className="country-info">
        <h2>{pais.name.common}</h2>
        <p><strong>Capital:</strong> {pais.capital?.[0] || 'N/A'}</p>
        <p><strong>População:</strong> {pais.population.toLocaleString()}</p>
        <p><strong>Região:</strong> {pais.region}</p>

        <button 
          className={`favorite-btn ${isFavorito ? 'favorited' : ''}`}
          onClick={onToggleFavorito}
        >
          {isFavorito ? '❤️ Remover' : '🤍 Favoritar'}
        </button>
      </div>
    </div>
  );
}

export default CountryCard;
// src/components/CountryCard.jsx
function CountryCard({ 
  cca3, 
  flag, 
  name, 
  capital, 
  population, 
  region,
  subregion,
  isFavorite, 
  onToggleFavorite 
}) {
  const formatPopulation = (pop) => {
    return new Intl.NumberFormat('pt-BR').format(pop);
  };

  return (
    <div className={`country-card ${isFavorite ? 'favorite' : ''}`}>
      <div className="country-header">
        <span className="flag">{flag}</span>
        <h3>{name}</h3>
      </div>

      <div className="country-info">
        <div className="info-row">
          <span className="label">Capital:</span>
          <span className="value">{capital}</span>
        </div>
        <div className="info-row">
          <span className="label">População:</span>
          <span className="value">{formatPopulation(population)}</span>
        </div>
        <div className="info-row">
          <span className="label">Região:</span>
          <span className="value">{region}</span>
        </div>
        <div className="info-row">
          <span className="label">Sub-região:</span>
          <span className="value">{subregion}</span>
        </div>
      </div>

      <button 
        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
        onClick={() => onToggleFavorite(cca3)}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {isFavorite ? '❤️ Favorito' : '🤍 Favoritar'}
      </button>
    </div>
  );
}

export default CountryCard;
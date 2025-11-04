// src/components/CountryCard.jsx
<<<<<<< HEAD
function CountryCard({ cca3, flag, name, capital, region, subregion, isFavorite = false, onToggleFavorite }) {
  const handleToggle = (e) => {
    e?.stopPropagation?.();
    onToggleFavorite?.(cca3);
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="12">Sem bandeira</text></svg>';
=======
function CountryCard({ 
  cca3, 
  flag, 
  name, 
  capital, 
  region,
  subregion,
  isFavorite, 
  onToggleFavorite 
}) {
  const formatPopulation = (pop) => {
    if (!pop || pop === 0) return 'Não disponível';
    return new Intl.NumberFormat('pt-BR').format(pop);
>>>>>>> a5d5339fbb9b00b92ea8960787370afed3f7af03
  };

  return (
    <div className={`country-card ${isFavorite ? 'favorite' : ''}`}>
      <div className="country-header">
<<<<<<< HEAD
        {flag ? (
          <img className="flag-img" src={flag} alt={`Bandeira de ${name}`} onError={handleImgError} />
        ) : (
          <div className="flag-placeholder">🏳️</div>
        )}
        <h3>{name}</h3>
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={handleToggle}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="country-info">
        <p><strong>Capital:</strong> {capital}</p>
        <p><strong>Região:</strong> {region}{subregion ? ` (${subregion})` : ''}</p>
=======
        <img 
          src={flag} 
          alt={`Bandeira de ${name}`}
          className="flag-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/80x60?text=${name.charAt(0)}`;
          }}
        />
        <h3>{name}</h3>
      </div>

      <div className="country-info">
        <div className="info-row">
          <span className="label">Capital:</span>
          <span className="value">{capital}</span>
        </div>
        {/*<div className="info-row">
          <span className="label">População:</span>
          <span className="value">{formatPopulation(population)}</span>
        </div>
        */}
        <div className="info-row">
          <span className="label">Região:</span>
          <span className="value">{region}</span>
        </div>
        <div className="info-row">
          <span className="label">Sub-região:</span>
          <span className="value">{subregion}</span>
        </div>
>>>>>>> a5d5339fbb9b00b92ea8960787370afed3f7af03
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
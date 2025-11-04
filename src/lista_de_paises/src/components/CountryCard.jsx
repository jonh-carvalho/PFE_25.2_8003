// src/components/CountryCard.jsx
function CountryCard({ cca3, flag, name, capital, region, subregion, isFavorite = false, onToggleFavorite }) {
  const handleToggle = (e) => {
    e?.stopPropagation?.();
    onToggleFavorite?.(cca3);
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial" font-size="12">Sem bandeira</text></svg>';
  };

  return (
    <div className={`country-card ${isFavorite ? 'favorite' : ''}`}>
      <div className="country-header">
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
      </div>
    </div>
  );
}

export default CountryCard;
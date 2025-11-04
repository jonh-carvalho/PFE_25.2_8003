function CountryCard({
  cca3,
  flag,
  name,
  capital,
  region,
  subregion,
  isFavorite,
  onToggleFavorite,
}) {
  const formatPopulation = (pop) => {
    if (!pop || pop === 0) return "Não disponível";
    return new Intl.NumberFormat("pt-BR").format(pop);
  };

  return (
    <div className={`country-card ${isFavorite ? "favorite" : ""}`}>
      <div className="country-header">
        {flag ? (
          <img
            className="flag-img"
            src={flag}
            alt={`Bandeira de ${name}`}
            onError={handleImgError}
          />
        ) : (
          <div className="flag-placeholder">🏳️</div>
        )}
        <h3>{name}</h3>
        <button
          className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
          onClick={handleToggle}
          title={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="country-info">
        <p>
          <strong>Capital:</strong> {capital}
        </p>
        <p>
          <strong>Região:</strong> {region}
          {subregion ? ` (${subregion})` : ""}
        </p>

        <img
          src={flag}
          alt={`Bandeira de ${name}`}
          className="flag-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/80x60?text=${name.charAt(
              0
            )}`;
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
      </div>

      <button
        className={`favorite-btn ${isFavorite ? "favorited" : ""}`}
        onClick={() => onToggleFavorite(cca3)}
        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        {isFavorite ? "❤️ Favorito" : "🤍 Favoritar"}
      </button>
    </div>
  );
}

export default CountryCard;

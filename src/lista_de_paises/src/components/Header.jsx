// src/components/Header.jsx
function Header({ title, subtitle, totalCountries, favoriteCount, filteredCount }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}

      <div className="header-stats">
        <div className="stat-box">
          <span className="stat-value">{totalCountries}</span>
          <span className="stat-label">países</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{favoriteCount}</span>
          <span className="stat-label">favoritos</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{filteredCount}</span>
          <span className="stat-label">exibidos</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
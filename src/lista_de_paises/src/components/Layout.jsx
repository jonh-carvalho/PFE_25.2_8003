import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">🌍 Países do Mundo</div>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Início
          </NavLink>
          <NavLink 
            to="/favoritos"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            ⭐ Favoritos
          </NavLink>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          Dados fornecidos por{' '}
          <a 
            href="https://servicodados.ibge.gov.br/api/docs/paises" 
            target="_blank" 
            rel="noreferrer"
          >
            API do IBGE
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Layout;

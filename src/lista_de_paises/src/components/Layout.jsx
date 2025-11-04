<<<<<<< HEAD
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
=======
// src/components/Layout.jsx
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  const linkClass = ({ isActive }) => 
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">🌍 Países</div>
        <div className="links">
          <NavLink to="/" className={linkClass}>Início</NavLink>
          <NavLink to="/favoritos" className={linkClass}>Favoritos</NavLink>
        </div>
      </nav>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          Dados por <a href="https://restcountries.com" target="_blank" rel="noreferrer">REST Countries</a>
        </p>
      </footer>
    </div>
  );
}

export default Layout;
>>>>>>> a5d5339fbb9b00b92ea8960787370afed3f7af03

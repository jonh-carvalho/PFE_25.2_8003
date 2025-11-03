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
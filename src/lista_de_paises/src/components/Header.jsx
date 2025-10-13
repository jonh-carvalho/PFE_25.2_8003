// src/components/Header.jsx
function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

export default Header;
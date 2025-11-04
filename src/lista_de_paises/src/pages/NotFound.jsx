<<<<<<< HEAD
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Página não encontrada</h1>
      <p>A página que você procura não existe.</p>
      <Link to="/" className="back-link">
        ← Voltar para a Home
      </Link>
    </div>
  );
}

export default NotFound;
=======
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h1>404 - Página não encontrada</h1>
      <p>A rota acessada não existe.</p>
      <Link to="/">Voltar para a Home</Link>
    </div>
  );
}
>>>>>>> a5d5339fbb9b00b92ea8960787370afed3f7af03

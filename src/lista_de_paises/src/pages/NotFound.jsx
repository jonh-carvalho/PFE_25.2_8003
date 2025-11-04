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

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
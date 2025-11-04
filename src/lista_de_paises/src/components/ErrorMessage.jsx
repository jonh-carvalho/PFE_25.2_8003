// src/components/ErrorMessage.jsx
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h2>Ops! Algo deu errado</h2>
      <p className="error-message">{message}</p>
      <button onClick={onRetry} className="retry-btn">
        Tentar Novamente
      </button>
      <div className="error-tips">
        <p><strong>💡 Possíveis causas:</strong></p>
        <ul>
          <li>Verifique sua conexão com a internet</li>
          <li>A API pode estar temporariamente indisponível</li>
          <li>Firewall ou proxy bloqueando a requisição</li>
        </ul>
      </div>
    </div>
  );
}

export default ErrorMessage;
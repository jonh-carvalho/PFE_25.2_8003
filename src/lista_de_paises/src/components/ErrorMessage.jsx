// src/components/ErrorMessage.jsx
import React from 'react';

function ErrorMessage({ mensagem, onTentar }) {
  return (
    <div className="error-message">
      <h3>❌ Ops! Algo deu errado</h3>
      <p>{mensagem}</p>
      <button onClick={onTentar} className="retry-btn">
        🔄 Tentar Novamente
      </button>
    </div>
  );
}

export default ErrorMessage;
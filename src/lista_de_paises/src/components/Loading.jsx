// src/components/Loading.jsx
function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2>Carregando países...</h2>
      <p>Buscando dados de 250+ países da API do IBGE</p>
    </div>
  );
}

export default Loading;
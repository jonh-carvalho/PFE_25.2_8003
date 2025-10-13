// src/App.jsx
import Header from './components/Header';
import CountryGrid from './components/CountryGrid';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header 
        title="🌍 Lista de Países da América do Sul"
        subtitle="Explore países sul-americanos e suas informações"
      />
      <CountryGrid />
    </div>
  );
}

export default App;
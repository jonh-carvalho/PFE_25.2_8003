---
id: 10_useEffect
title: 10 - useEffect - Carregamento Automático
---

# 10 - useEffect: Carregamento Automático de Dados

Aprenda o hook mais importante para side effects no React! Vamos automatizar o carregamento de países e entender o ciclo de vida dos componentes.

---

## Objetivos do Módulo

- Automatizar o carregamento da API REST Countries usando `useEffect`
- Entender o ciclo de vida de componentes funcionais
- Implementar persistência de favoritos com `localStorage`
- Prevenir memory leaks com cleanup functions
- Criar hooks customizados reutilizáveis

---

## 1. O Problema: Carregamento Manual

No Módulo 09, precisávamos clicar num botão para carregar os países:

```jsx
// Problema: usuário precisa clicar para ver dados
function App() {
  const [countries, setCountries] = useState([]);
  
  const loadCountries = () => {
    fetch('https://restcountries.com/v3.1/all')
      .then(r => r.json())
      .then(data => setCountries(data));
  };

  return (
    <div>
      <button onClick={loadCountries}>Carregar Países</button>
    </div>
  );
}
```

### Queremos:

- Carregar automaticamente ao abrir a página
- Mostrar loading enquanto carrega
- Salvar favoritos mesmo após fechar o navegador

---

## 2. Introdução ao useEffect

### O que é useEffect?

`useEffect` é o hook que permite executar código em momentos específicos do ciclo de vida do componente.

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // Este código roda depois que o componente renderiza
  console.log('Componente montado ou atualizado!');
}, [dependências]);
```

### Quando usar useEffect?

- Requisições HTTP (APIs, fetch)
- localStorage/sessionStorage
- Timers (setTimeout, setInterval)
- Event listeners (scroll, resize, teclado)
- Manipulação do DOM (document.title, focus)

---

## 3. Padrões de Dependências

### 3.1 Array Vazio - Executa UMA VEZ

```jsx
useEffect(() => {
  console.log('Executa apenas quando componente MONTA');
}, []); // Array vazio = roda 1x só
```

**Uso:** Carregar dados iniciais, configurar subscriptions

### 3.2 Com Dependências - Executa quando MUDA

```jsx
const [search, setSearch] = useState('');

useEffect(() => {
  console.log('Search mudou para:', search);
}, [search]); // Roda quando 'search' muda
```

**Uso:** Reagir a mudanças de estado/props

### 3.3 Sem Array - Executa TODA RENDER

```jsx
useEffect(() => {
  console.log('Executa em TODA render');
}); // Cuidado! Pode causar loops
```

**Uso:** Raro, geralmente evitar

---

## 4. Carregamento Automático - Versão Simples

```jsx
// src/App.jsx - Carregamento Automático
import { useState, useEffect } from 'react';
import CountryGrid from './components/CountryGrid';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect: carregar países AUTOMATICAMENTE ao montar componente
  useEffect(() => {
    console.log('useEffect executado! Carregando países...');
    
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('https://restcountries.com/v3.1/all');
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Países carregados:', data.length);
        
        setCountries(data);
        
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []); // Array vazio = executa apenas UMA VEZ na montagem

  const toggleFavorite = (countryCode) => {
    setFavorites(prev => 
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lista de Países do Mundo</h1>
        <p>Carregamento automático com useEffect</p>
        
        {countries.length > 0 && (
          <div className="header-stats">
            <span>{countries.length} países</span>
            <span>{favorites.length} favoritos</span>
          </div>
        )}
      </header>

      <main className="main-content">
        {isLoading && <Loading />}
        
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={() => window.location.reload()}
          />
        )}
        
        {!isLoading && !error && (
          <CountryGrid 
            countries={countries}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
  );
}

export default App;
```

### O que mudou?

| Antes (Módulo 09) | Agora (Módulo 10) |
|-------------------|-------------------|
| Botão "Carregar Países" | Carrega automaticamente |
| onClick={loadCountries} | useEffect(() => {...}, []) |
| Usuário inicia ação | Componente inicia ação |

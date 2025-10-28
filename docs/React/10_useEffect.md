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

## De Onde Viemos e Para Onde Vamos

**Módulo 09:** Conectamos com API real usando botão manual  
**Módulo 10 (AGORA):** Automatizamos o carregamento ao abrir a página  
**Módulo 11:** Implementamos filtros e busca avançada

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

---

## 5. Persistência com localStorage

```jsx
// src/App.jsx - Com localStorage
import { useState, useEffect } from 'react';

function App() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar favoritos do localStorage na montagem
  useEffect(() => {
    console.log('Carregando favoritos salvos...');
    
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedFavorites) {
      const parsed = JSON.parse(savedFavorites);
      console.log('Favoritos restaurados:', parsed.length);
      setFavorites(parsed);
    }
  }, []); // Executa 1x na montagem

  // Salvar favoritos no localStorage sempre que mudam
  useEffect(() => {
    console.log('Salvando', favorites.length, 'favoritos...');
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]); // Executa toda vez que 'favorites' muda

  // Carregar países da API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  const toggleFavorite = (countryCode) => {
    setFavorites(prev => 
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  // ... resto do JSX
}
```

### Testando localStorage:

1. Abra o DevTools (F12)
2. Vá em Application > Local Storage
3. Favorite alguns países
4. Veja a chave `favorites` aparecer
5. Recarregue a página - favoritos permanecem!

---

## 6. Cleanup Functions - Prevenindo Memory Leaks

### O Problema:

Se o componente for desmontado DURANTE uma requisição, pode causar erros.

### A Solução: Cleanup Function

```jsx
// Solução: cancelar operação se componente desmontar
useEffect(() => {
  let isCancelled = false; // Flag de cancelamento

  const loadCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      
      // Só atualiza estado se componente ainda estiver montado
      if (!isCancelled) {
        setCountries(data);
      }
    } catch (error) {
      if (!isCancelled) {
        setError(error.message);
      }
    }
  };

  loadCountries();

  // Cleanup: marca como cancelado ao desmontar
  return () => {
    console.log('Cleanup: componente desmontando');
    isCancelled = true;
  };
}, []);
```

### Quando usar cleanup:

**Timers:**
```jsx
useEffect(() => {
  const timer = setTimeout(() => {...}, 1000);
  return () => clearTimeout(timer);
}, []);
```

**Intervals:**
```jsx
useEffect(() => {
  const interval = setInterval(() => {...}, 1000);
  return () => clearInterval(interval);
}, []);
```

**Event Listeners:**
```jsx
useEffect(() => {
  const handler = () => {...};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

---

## 7. Hook Customizado: useCountries

```jsx
// src/hooks/useCountries.js
import { useState, useEffect } from 'react';

function useCountries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const loadCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('https://restcountries.com/v3.1/all');
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!isCancelled) {
          setCountries(data);
        }

      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCountries();

    return () => {
      isCancelled = true;
    };
  }, []);

  const reload = () => {
    window.location.reload();
  };

  return { countries, isLoading, error, reload };
}

export default useCountries;
```

### Usando o Hook Customizado:

```jsx
// src/App.jsx - Versão Simplificada
import { useState, useEffect } from 'react';
import useCountries from './hooks/useCountries';
import CountryGrid from './components/CountryGrid';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

function App() {
  // Hook customizado encapsula toda lógica da API
  const { countries, isLoading, error, reload } = useCountries();
  
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos salvos
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Salvar favoritos sempre que mudam
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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
        
        {countries.length > 0 && (
          <div className="header-stats">
            <span>{countries.length} países</span>
            <span>{favorites.length} favoritos</span>
            <button onClick={reload}>Recarregar</button>
          </div>
        )}
      </header>

      <main className="main-content">
        {isLoading && <Loading />}
        {error && <ErrorMessage message={error} onRetry={reload} />}
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

---

## 8. Debugging useEffect

### Console Logs Estratégicos:

```jsx
useEffect(() => {
  console.log('useEffect EXECUTADO');
  console.log('Dependencies:', { favorites, searchTerm });
  
  // código do efeito
  
  return () => {
    console.log('Cleanup EXECUTADO');
  };
}, [favorites, searchTerm]);
```

---

## 9. Comparação: Antes vs Depois

### SEM useEffect (Módulo 09):

- Página vazia até clicar
- Favoritos perdidos ao recarregar
- Experiência ruim

### COM useEffect (Módulo 10):

- Carregamento automático
- Favoritos persistem
- Experiência profissional

---

## Resumo do Módulo 10

### O que Aprendemos

1. useEffect com array vazio [] - Executar código na montagem
2. useEffect com dependências - Reagir a mudanças
3. Cleanup functions - Prevenir memory leaks
4. localStorage - Persistir dados localmente
5. Custom hooks - Reutilizar lógica complexa

### Evolução do Projeto

| Aspecto | Módulo 09 | Módulo 10 |
|---------|-----------|-----------|
| Carregamento | Manual (botão) | Automático (useEffect) |
| Favoritos | Apenas na sessão | Persistem (localStorage) |
| Loading | Mostrado manualmente | Gerenciado por hook |
| Reutilização | Código no App.jsx | Hook customizado |
| Memory Leaks | Possíveis | Prevenidos (cleanup) |

### Próximos Passos (Módulo 11)

- Implementar busca por nome
- Filtrar por região
- Combinar múltiplos filtros
- Otimizar performance

### Conceitos-Chave

- **useEffect**: Hook para side effects
- **Dependencies Array**: Controla quando o efeito executa
- **Cleanup Function**: Função retornada para limpar recursos
- **localStorage**: API do navegador para armazenamento local
- **Custom Hook**: Função que encapsula lógica com hooks
- **Memory Leak**: Vazamento quando componente desmonta mas código continua executando

### Referências

- [React Docs - useEffect](https://react.dev/reference/react/useEffect)
- [MDN - localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## Exercícios Práticos

### Exercício 1: Contador de Visitas

```jsx
const [visits, setVisits] = useState(0);

useEffect(() => {
  const savedVisits = localStorage.getItem('visits');
  const count = savedVisits ? parseInt(savedVisits) + 1 : 1;
  setVisits(count);
  localStorage.setItem('visits', count.toString());
}, []);

return <p>Você visitou esta página {visits} vez(es)</p>;
```

### Exercício 2: Tempo na Página

```jsx
const [seconds, setSeconds] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setSeconds(s => s + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);

return <p>Você está aqui há {seconds} segundos</p>;
```

### Exercício 3: Custom Hook useLocalStorage

```jsx
// src/hooks/useLocalStorage.js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Uso:
function App() {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
}
```

---

**Parabéns!** Você dominou o `useEffect`, um dos hooks mais importantes do React! No próximo módulo, vamos adicionar filtros e busca avançada!

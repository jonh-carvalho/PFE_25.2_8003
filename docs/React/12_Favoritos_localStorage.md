---
id: 12_Favoritos_localStorage
title: 12 - Favoritos e Persistência com localStorage
---

# 12 - Favoritos e Persistência com localStorage

Aprenda a salvar dados no navegador! Vamos implementar um sistema completo de favoritos que persiste mesmo após fechar o navegador, usando **localStorage**.

---

## Objetivos do Módulo

- Implementar sistema de favoritos (adicionar/remover)
- Persistir favoritos com localStorage
- Sincronizar estado React com localStorage
- Criar filtro "Mostrar Apenas Favoritos"
- Entender armazenamento local do navegador

---

## De Onde Viemos e Para Onde Vamos

**Módulo 11:** Implementamos busca + filtros por região  
**Módulo 12 (AGORA):** Adicionamos favoritos persistentes  
**Módulo 13:** Otimizamos com useMemo, debounce e modal de detalhes

---

## 1. O Problema: Dados Temporários

No Módulo 11, tínhamos filtros funcionando, mas:

```jsx
const [favorites, setFavorites] = useState([]);

// Favoritar país
const toggleFavorite = (code) => {
  setFavorites(prev => 
    prev.includes(code) 
      ? prev.filter(c => c !== code)
      : [...prev, code]
  );
};
```

**Problema:** Ao recarregar a página, todos os favoritos são perdidos!

---

## 2. Introdução ao localStorage

### 2.1 O que é localStorage?

`localStorage` é uma API do navegador que permite armazenar dados localmente **sem data de expiração**.

```jsx
// Salvar dados
localStorage.setItem('chave', 'valor');

// Ler dados
const valor = localStorage.getItem('chave');

// Remover dados
localStorage.removeItem('chave');

// Limpar tudo
localStorage.clear();
```

### 2.2 Armazenando Arrays e Objetos

localStorage só aceita **strings**. Para arrays/objetos, use `JSON`:

```jsx
// Salvar array
const favoritos = ['BRA', 'USA', 'FRA'];
localStorage.setItem('favoritos', JSON.stringify(favoritos));

// Ler array
const salvos = localStorage.getItem('favoritos');
const array = salvos ? JSON.parse(salvos) : [];
```

### 2.3 Testando no DevTools

```
1. Abra DevTools (F12)
2. Vá em "Application" > "Local Storage"
3. Execute no Console:
   localStorage.setItem('teste', 'Hello World')
4. Veja o item aparecer
5. Recarregue a página - ainda está lá!
```

---

## 3. Implementando Favoritos Persistentes

### 3.1 Carregar Favoritos ao Iniciar

```jsx
// Carregar favoritos salvos quando componente montar
useEffect(() => {
  console.log('📦 Carregando favoritos salvos...');
  
  const saved = localStorage.getItem('countryFavorites');
  
  if (saved) {
    const parsed = JSON.parse(saved);
    console.log(`✅ ${parsed.length} favoritos restaurados`);
    setFavorites(parsed);
  } else {
    console.log('ℹ️ Nenhum favorito salvo anteriormente');
  }
}, []); // Array vazio = executa apenas 1x na montagem
```

### 3.2 Salvar Favoritos Sempre que Mudam

```jsx
// Salvar favoritos sempre que o estado mudar
useEffect(() => {
  console.log(`💾 Salvando ${favorites.length} favoritos...`);
  localStorage.setItem('countryFavorites', JSON.stringify(favorites));
}, [favorites]); // Executa toda vez que 'favorites' muda
```

### 3.3 Por que 2 useEffect Separados?

```jsx
// ❌ ERRADO - Causaria loop infinito
useEffect(() => {
  const saved = localStorage.getItem('countryFavorites');
  if (saved) {
    setFavorites(JSON.parse(saved)); // Muda favorites
  }
  localStorage.setItem('countryFavorites', JSON.stringify(favorites)); // Salva
}, [favorites]); // favorites mudou → executa novamente → loop!

// ✅ CORRETO - Separar responsabilidades
useEffect(() => {
  // Carregar apenas na montagem
  const saved = localStorage.getItem('countryFavorites');
  if (saved) setFavorites(JSON.parse(saved));
}, []); // Sem dependências = 1x só

useEffect(() => {
  // Salvar sempre que mudar
  localStorage.setItem('countryFavorites', JSON.stringify(favorites));
}, [favorites]); // Com dependência = toda vez que favorites muda
```

---

## 4. App Completo com Favoritos Persistentes

```jsx
// src/App.jsx - Com Favoritos Persistentes
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estados principais
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Carregar favoritos salvos (1x na montagem)
  useEffect(() => {
    console.log('📦 Carregando favoritos do localStorage...');
    const saved = localStorage.getItem('countryFavorites');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavorites(parsed);
        console.log(`✅ ${parsed.length} favoritos restaurados`);
      } catch (err) {
        console.error('❌ Erro ao parsear favoritos:', err);
        localStorage.removeItem('countryFavorites'); // Limpar dados corrompidos
      }
    }
  }, []);

  // Salvar favoritos sempre que mudarem
  useEffect(() => {
    console.log(`💾 Salvando ${favorites.length} favoritos no localStorage`);
    localStorage.setItem('countryFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Regiões disponíveis
  const regions = [
    { value: 'all', label: 'Todas as Regiões' },
    { value: 'Africa', label: 'África' },
    { value: 'Americas', label: 'Américas' },
    { value: 'Asia', label: 'Ásia' },
    { value: 'Europe', label: 'Europa' },
    { value: 'Oceania', label: 'Oceania' }
  ];

  // Filtrar países
  const filteredCountries = countries.filter(country => {
    // Filtro: mostrar apenas favoritos
    if (showOnlyFavorites) {
      const isFavorite = favorites.includes(country.cca3);
      if (!isFavorite) return false;
    }

    // Filtro: busca
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    // Filtro: região
    const matchesRegion = selectedRegion === 'all' || 
      country.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  // Toggle favorito
  const toggleFavorite = (countryCode) => {
    setFavorites(prev => {
      if (prev.includes(countryCode)) {
        // Remover dos favoritos
        console.log(`💔 Removendo ${countryCode} dos favoritos`);
        return prev.filter(code => code !== countryCode);
      } else {
        // Adicionar aos favoritos
        console.log(`❤️ Adicionando ${countryCode} aos favoritos`);
        return [...prev, countryCode];
      }
    });
  };

  // Limpar todos os favoritos
  const clearAllFavorites = () => {
    if (window.confirm('Tem certeza que deseja remover TODOS os favoritos?')) {
      setFavorites([]);
      console.log('🗑️ Todos os favoritos removidos');
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('all');
    setShowOnlyFavorites(false);
  };

  // Estados de loading/erro
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando países...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>❌ Erro ao carregar países</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Cabeçalho */}
      <header className="header">
        <h1>🌍 Lista de Países do Mundo</h1>
        <p className="subtitle">{countries.length} países disponíveis</p>
        
        {/* Estatísticas */}
        <div className="stats">
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <div>
              <div className="stat-value">{filteredCountries.length}</div>
              <div className="stat-label">Exibidos</div>
            </div>
          </div>
          
          <div className="stat-card favorite-stat">
            <span className="stat-icon">❤️</span>
            <div>
              <div className="stat-value">{favorites.length}</div>
              <div className="stat-label">Favoritos</div>
            </div>
          </div>
          
          {showOnlyFavorites && (
            <div className="stat-card active-filter">
              <span className="stat-icon">⭐</span>
              <div>
                <div className="stat-label">Apenas Favoritos</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Controles */}
      <div className="controls">
        {/* Busca */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-input-btn"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro de Região */}
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="region-select"
        >
          {regions.map(region => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>

        {/* Botão Favoritos */}
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`favorites-toggle ${showOnlyFavorites ? 'active' : ''}`}
          disabled={favorites.length === 0}
          title={favorites.length === 0 ? 'Nenhum favorito ainda' : 'Mostrar apenas favoritos'}
        >
          {showOnlyFavorites ? '⭐ Mostrando Favoritos' : '🤍 Mostrar Favoritos'}
          {favorites.length > 0 && (
            <span className="badge">{favorites.length}</span>
          )}
        </button>

        {/* Limpar Favoritos */}
        {favorites.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="clear-favorites-btn"
            title="Limpar todos os favoritos"
          >
            🗑️ Limpar Favoritos
          </button>
        )}

        {/* Limpar Filtros */}
        {(searchTerm || selectedRegion !== 'all' || showOnlyFavorites) && (
          <button onClick={clearFilters} className="clear-all-btn">
            ↺ Resetar Filtros
          </button>
        )}
      </div>

      {/* Informações dos Resultados */}
      <div className="results-info">
        {showOnlyFavorites ? (
          <p>⭐ Mostrando <strong>{filteredCountries.length}</strong> favoritos</p>
        ) : (
          <p>
            📊 Mostrando <strong>{filteredCountries.length}</strong> de {countries.length} países
          </p>
        )}
      </div>

      {/* Grid de Países */}
      <main className="main-content">
        {filteredCountries.length > 0 ? (
          <div className="countries-grid">
            {filteredCountries.map(country => {
              const isFavorite = favorites.includes(country.cca3);
              
              return (
                <div 
                  key={country.cca3} 
                  className={`country-card ${isFavorite ? 'favorited' : ''}`}
                >
                  <div className="flag-container">
                    <img 
                      src={country.flags.png} 
                      alt={`Bandeira de ${country.name.common}`}
                      className="flag-image"
                    />
                    {isFavorite && (
                      <div className="favorite-badge">⭐</div>
                    )}
                  </div>
                  
                  <div className="country-info">
                    <h3 className="country-name">{country.name.common}</h3>
                    
                    <div className="country-details">
                      <p>
                        <span className="icon">📍</span>
                        <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
                      </p>
                      <p>
                        <span className="icon">🌎</span>
                        <strong>Região:</strong> {country.region}
                      </p>
                      <p>
                        <span className="icon">👥</span>
                        <strong>População:</strong> {country.population.toLocaleString('pt-BR')}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFavorite(country.cca3)}
                      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    >
                      {isFavorite ? '❤️ Favoritado' : '🤍 Favoritar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {showOnlyFavorites ? '⭐' : '🔍'}
            </div>
            <h3>
              {showOnlyFavorites 
                ? 'Nenhum favorito ainda' 
                : 'Nenhum país encontrado'}
            </h3>
            <p>
              {showOnlyFavorites
                ? 'Clique no botão 🤍 em qualquer país para adicionar aos favoritos!'
                : 'Tente ajustar os filtros de busca ou região.'}
            </p>
            <button onClick={clearFilters} className="reset-btn">
              🔄 Resetar Filtros
            </button>
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <p>
          💾 Favoritos salvos localmente no navegador • 
          Dados da <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer">
            REST Countries API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
```

---

## 5. Estilos CSS Complementares

```css
/* src/App.css - Estilos para Favoritos */

/* Estatísticas */
.stats {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 15px;
  color: white;
}

.stat-card.favorite-stat {
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid rgba(255, 107, 107, 0.4);
}

.stat-card.active-filter {
  background: rgba(255, 193, 7, 0.2);
  border: 2px solid rgba(255, 193, 7, 0.4);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Botão Toggle Favoritos */
.favorites-toggle {
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.favorites-toggle:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.favorites-toggle.active {
  background: linear-gradient(135deg, #ffc107, #ff9800);
  color: white;
  border-color: transparent;
}

.favorites-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
}

/* Botão Limpar Favoritos */
.clear-favorites-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-favorites-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

/* Card de País Favoritado */
.country-card.favorited {
  border: 3px solid #ffc107;
  box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);
}

.favorite-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 193, 7, 0.95);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Botão Favoritar */
.favorite-btn {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.favorite-btn:hover {
  transform: scale(1.05);
  border-color: #ff6b6b;
}

.favorite-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border-color: transparent;
}

/* Responsividade */
@media (max-width: 768px) {
  .stats {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stat-card {
    justify-content: center;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .favorites-toggle, .clear-favorites-btn {
    width: 100%;
  }
}
```

---

## 6. Testando o Sistema de Favoritos

### 6.1 Teste Básico

```
1. Abra a aplicação
2. Clique em "🤍 Favoritar" em 3 países
3. Veja o contador de favoritos aumentar
4. Veja o botão mudar para "❤️ Favoritado"
5. Recarregue a página (F5)
6. ✅ Favoritos devem permanecer!
```

### 6.2 Teste de Persistência

```
1. Favorite 5 países
2. Feche a aba do navegador
3. Abra novamente a aplicação
4. ✅ Favoritos devem estar lá!
```

### 6.3 Teste do Filtro "Apenas Favoritos"

```
1. Favorite 3 países (Brasil, França, Japão)
2. Clique em "Mostrar Favoritos"
3. ✅ Deve exibir apenas os 3 países favoritados
4. Busque por "bra"
5. ✅ Deve exibir apenas Brasil (favorito + busca)
```

### 6.4 Teste de Limpeza

```
1. Favorite vários países
2. Clique em "🗑️ Limpar Favoritos"
3. Confirme a ação
4. ✅ Todos os favoritos devem ser removidos
5. Recarregue a página
6. ✅ Nenhum favorito deve aparecer
```

---

## 7. Inspecionando localStorage

### 7.1 Ver Dados Salvos

```javascript
// No Console do DevTools
localStorage.getItem('countryFavorites');
// Retorna: '["BRA","USA","FRA"]'

JSON.parse(localStorage.getItem('countryFavorites'));
// Retorna: ['BRA', 'USA', 'FRA']
```

### 7.2 Modificar Manualmente

```javascript
// Adicionar favorito manualmente
const favoritos = JSON.parse(localStorage.getItem('countryFavorites')) || [];
favoritos.push('JPN');
localStorage.setItem('countryFavorites', JSON.stringify(favoritos));
// Recarregue a página para ver mudança
```

### 7.3 Limpar Dados

```javascript
// Remover apenas favoritos
localStorage.removeItem('countryFavorites');

// Limpar TUDO do localStorage
localStorage.clear();
```

---

## 8. Limitações do localStorage

### 8.1 Tamanho Limitado

```jsx
// localStorage tem limite de ~5-10MB
// Para muitos dados, considere IndexedDB

// Verificar tamanho usado
const getAllLocalStorage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2) + ' KB';
};

console.log('Uso do localStorage:', getAllLocalStorage());
```

### 8.2 Apenas Strings

```jsx
// ❌ Não funciona - salva "[object Object]"
localStorage.setItem('user', { name: 'João', age: 25 });

// ✅ Correto - usar JSON.stringify
localStorage.setItem('user', JSON.stringify({ name: 'João', age: 25 }));

// Ler de volta
const user = JSON.parse(localStorage.getItem('user'));
```

### 8.3 Síncrono (Blocking)

```jsx
// localStorage é síncrono e pode travar UI com muitos dados
// Para operações pesadas, considere:
// - IndexedDB (assíncrono)
// - Web Workers
// - Debounce em salvamentos frequentes
```

---

## 9. Custom Hook: useLocalStorage

Vamos criar um hook reutilizável para localStorage:

```jsx
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // State para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Tentar carregar do localStorage
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      return initialValue;
    }
  });

  // Salvar no localStorage sempre que o valor mudar
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
```

### Usando o Hook:

```jsx
// src/App.jsx
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  // Uso simples - substituir useState + useEffect
  const [favorites, setFavorites] = useLocalStorage('countryFavorites', []);
  
  // Funciona exatamente como useState, mas persiste automaticamente!
  const toggleFavorite = (code) => {
    setFavorites(prev => 
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  // ... resto do código
}
```

---

## 10. Exercícios Práticos

### Exercício 1: Contador de Visitações

```jsx
const [visitCount, setVisitCount] = useLocalStorage('visitCount', 0);

useEffect(() => {
  setVisitCount(count => count + 1);
}, []);

return <p>Você visitou esta página {visitCount} vez(es)</p>;
```

### Exercício 2: Tema Escuro Persistente

```jsx
const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

useEffect(() => {
  document.body.classList.toggle('dark-mode', darkMode);
}, [darkMode]);

return (
  <button onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
  </button>
);
```

### Exercício 3: Histórico de Buscas

```jsx
const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);

const handleSearch = (term) => {
  if (term && !searchHistory.includes(term)) {
    setSearchHistory(prev => [term, ...prev].slice(0, 10)); // Max 10 itens
  }
};
```

---

## 11. Comparação: Antes vs Depois

| Aspecto | Módulo 11 | Módulo 12 |
|---------|-----------|-----------|
| Favoritos | ❌ Temporários | ✅ Persistentes |
| Reload Página | ❌ Perde dados | ✅ Mantém favoritos |
| Filtro Favoritos | ❌ Não tinha | ✅ Mostrar apenas favoritos |
| Contador | ❌ Não tinha | ✅ Badge com quantidade |
| Limpar Favoritos | ❌ Manual | ✅ Botão dedicado |
| localStorage | ❌ Não usava | ✅ Sincronização automática |

---

## Resumo do Módulo 12

### O que Aprendemos

1. ✅ **localStorage API** - Salvar/ler dados do navegador
2. ✅ **JSON stringify/parse** - Converter arrays/objetos
3. ✅ **useEffect para persistência** - Salvar automaticamente
4. ✅ **Filtro de favoritos** - Mostrar apenas selecionados
5. ✅ **Custom Hook useLocalStorage** - Reutilizar lógica

### Conceitos-Chave

- **localStorage**: Armazenamento local persistente
- **JSON.stringify()**: Converte objeto/array em string
- **JSON.parse()**: Converte string em objeto/array
- **useEffect com []**: Executar 1x na montagem (carregar)
- **useEffect com [deps]**: Executar quando deps mudam (salvar)

### Evolução do Projeto

```
Módulo 09: Conexão com API ✅
Módulo 10: Carregamento automático ✅
Módulo 11: Busca + Filtros ✅
Módulo 12: Favoritos persistentes ✅
Módulo 13: Otimizações avançadas (próximo)
```

### Próximos Passos (Módulo 13)

- Otimizar com useMemo
- Adicionar debounce na busca
- Criar modal com detalhes do país
- Implementar lazy loading

---

**Parabéns!** Você implementou um sistema completo de favoritos persistentes! Seus usuários agora podem marcar países favoritos e eles permanecerão salvos mesmo após fechar o navegador! 🎉

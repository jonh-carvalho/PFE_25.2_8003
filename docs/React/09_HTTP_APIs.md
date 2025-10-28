---
id: 09_HTTP_APIs
title: 09 - Conectando com APIs Reais
---
# 09 - **Conectando com APIs Reais**

Agora é hora de transformar nossa Lista de Países! Neste módulo, vamos **conectar com a API REST Countries real** e carregar dados de **250+ países do mundo**. Sem simulações, sem dados fake - apenas requisições HTTP reais aprendendo na prática!

---

## **Objetivos do Módulo**
- Fazer a primeira requisição HTTP com `fetch()`
- Conectar com a API REST Countries real
- Carregar dados de 250+ países do mundo
- Implementar estados de loading e erro
- Adaptar componentes para dados reais da API

---

## **🎯 De Onde Viemos e Para Onde Vamos**

**Módulo 08:** Gerenciamos estados complexos com dados locais (hardcoded)  
**Módulo 09 (AGORA):** Conectamos com API real e carregamos dados do mundo todo  
**Módulo 10:** Automatizamos o carregamento com `useEffect`

---

## **1. A API REST Countries**

### **🌐 O que é?**

REST Countries é uma **API gratuita** que fornece informações completas e atualizadas sobre todos os países do mundo. Sem necessidade de cadastro, chaves ou autenticação!

### **🔗 URL da API:**

```
https://restcountries.com/v3.1/all
```

### **📊 Exemplo de Resposta (1 país):**

```json
{
  "name": {
    "common": "Brazil",
    "official": "Federative Republic of Brazil"
  },
  "cca3": "BRA",
  "capital": ["Brasília"],
  "region": "Americas",
  "subregion": "South America",
  "population": 215353593,
  "area": 8515767,
  "flag": "🇧🇷",
  "flags": {
    "png": "https://flagcdn.com/w320/br.png",
    "svg": "https://flagcdn.com/br.svg"
  },
  "languages": {
    "por": "Portuguese"
  },
  "currencies": {
    "BRL": {
      "name": "Brazilian real",
      "symbol": "R$"
    }
  }
}
```

### **💡 Por que esta API é perfeita para aprender?**

- ✅ **Gratuita**: Sem limites ou custos
- ✅ **Sem autenticação**: Não precisa de API keys
- ✅ **Dados reais**: Informações atualizadas
- ✅ **CORS habilitado**: Funciona no navegador
- ✅ **Bem documentada**: Fácil de entender

---

## **2. Nossa Primeira Requisição HTTP**

### **🚀 Passo 1: Testando no Navegador**

Antes de integrar no React, vamos ver a API funcionando:

1. Abra o navegador
2. Cole na barra de endereços: `https://restcountries.com/v3.1/all`
3. Pressione Enter

Você verá um **array gigante de objetos JSON** com dados de todos os países! 🌍

### **🔧 Passo 2: Testando no Console do Navegador**

Abra o DevTools (F12) e cole no Console:

```javascript
fetch('https://restcountries.com/v3.1/all')
  .then(response => response.json())
  .then(data => {
    console.log('Total de países:', data.length);
    console.log('Primeiro país:', data[0]);
  });
```

**Resultado esperado:**
```
Total de países: 250
Primeiro país: {name: {...}, capital: [...], ...}
```

---

## **3. Integrando no React - Versão Simples**

Vamos começar com a versão mais simples possível - um botão que carrega os países:

```jsx
// src/App.jsx
import { useState } from 'react';
import CountryGrid from './components/CountryGrid';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Função para buscar países da API
  const loadCountries = () => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        console.log('Países carregados:', data.length);
        setCountries(data);
      })
      .catch(error => {
        console.error('Erro ao carregar países:', error);
      });
  };

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
        <h1>🌍 Lista de Países do Mundo</h1>
        <p>Dados reais da API REST Countries</p>
        
        {/* Botão para carregar */}
        <button onClick={loadCountries} className="load-btn">
          🌐 Carregar Países da API
        </button>
        
        {countries.length > 0 && (
          <p className="loaded-info">
            ✅ {countries.length} países carregados!
          </p>
        )}
      </header>

      {countries.length > 0 ? (
        <CountryGrid 
          countries={countries}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <div className="placeholder">
          <p>� Clique no botão acima para carregar os países</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

**🎉 Teste agora!** Clique no botão e veja os dados reais carregando!

---

## **4. Adicionando Estados de Loading e Erro**

Agora vamos melhorar com feedback visual durante o carregamento:

```jsx
// src/App.jsx - Versão com Loading e Erro
import { useState } from 'react';
import CountryGrid from './components/CountryGrid';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCountries = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🌐 Iniciando requisição para API...');
      
      const response = await fetch('https://restcountries.com/v3.1/all');
      
      console.log('📡 Resposta recebida, status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('✅ Dados processados:', data.length, 'países');
      
      setCountries(data);
      
    } catch (err) {
      console.error('❌ Erro:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1>🌍 Lista de Países do Mundo</h1>
        <p>Conectado à API REST Countries</p>
        
        <button 
          onClick={loadCountries} 
          disabled={isLoading}
          className="load-btn"
        >
          {isLoading ? '⏳ Carregando...' : '🌐 Carregar Países'}
        </button>
        
        {countries.length > 0 && (
          <div className="header-stats">
            <span>✅ {countries.length} países</span>
            <span>❤️ {favorites.length} favoritos</span>
          </div>
        )}
      </header>

      <main className="main-content">
        {isLoading && <Loading />}
        
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={loadCountries}
          />
        )}
        
        {!isLoading && !error && countries.length > 0 && (
          <CountryGrid 
            countries={countries}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
        
        {!isLoading && !error && countries.length === 0 && (
          <div className="welcome-state">
            <h2>🌍 Bem-vindo!</h2>
            <p>Clique no botão acima para carregar dados de todos os países do mundo.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

---

## **5. Componentes de Feedback Visual**

### **Loading Component**

```jsx
// src/components/Loading.jsx
function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2>🌐 Carregando países...</h2>
      <p>Buscando dados de 250+ países da API REST Countries</p>
    </div>
  );
}

export default Loading;
```

### **ErrorMessage Component**

```jsx
// src/components/ErrorMessage.jsx
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h2>Ops! Algo deu errado</h2>
      <p className="error-message">{message}</p>
      <button onClick={onRetry} className="retry-btn">
        🔄 Tentar Novamente
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
```

---

## **6. Adaptando Componentes para Dados Reais**

Os dados da API têm estrutura diferente dos nossos dados locais. Vamos adaptar:

### **CountryCard Adaptado**

```jsx
// src/components/CountryCard.jsx
function CountryCard({ 
  country,
  isFavorite, 
  onToggleFavorite 
}) {
  // Adaptar estrutura da API
  const name = country.name.common;
  const capital = country.capital?.[0] || 'N/A';
  const population = country.population;
  const region = country.region;
  const subregion = country.subregion || 'N/A';
  const flag = country.flag;
  const cca3 = country.cca3;

  const formatPopulation = (pop) => {
    return new Intl.NumberFormat('pt-BR').format(pop);
  };

  return (
    <div className={`country-card ${isFavorite ? 'favorite' : ''}`}>
      <div className="country-header">
        <span className="flag">{flag}</span>
        <h3>{name}</h3>
      </div>

      <div className="country-info">
        <div className="info-row">
          <span className="label">Capital:</span>
          <span className="value">{capital}</span>
        </div>
        <div className="info-row">
          <span className="label">População:</span>
          <span className="value">{formatPopulation(population)}</span>
        </div>
        <div className="info-row">
          <span className="label">Região:</span>
          <span className="value">{region}</span>
        </div>
        <div className="info-row">
          <span className="label">Sub-região:</span>
          <span className="value">{subregion}</span>
        </div>
      </div>

      <button 
        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
        onClick={() => onToggleFavorite(cca3)}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        {isFavorite ? '❤️ Favorito' : '🤍 Favoritar'}
      </button>
    </div>
  );
}

export default CountryCard;
```

### **CountryGrid Adaptado**

```jsx
// src/components/CountryGrid.jsx
function CountryGrid({ countries, favorites, onToggleFavorite }) {
  return (
    <div className="country-grid">
      {countries.map(country => (
        <CountryCard 
          key={country.cca3}
          country={country}
          isFavorite={favorites.includes(country.cca3)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default CountryGrid;
```

---

## **7. Estilizando os Estados Visuais**

```css
/* src/App.css - Adições para Loading e Erro */

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.loading-container p {
  color: #7f8c8d;
  font-size: 0.95rem;
}

/* Error State */
.error-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-container h2 {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.error-message {
  color: #7f8c8d;
  background: #fef5f5;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
  margin-bottom: 1.5rem;
  font-family: monospace;
}

.retry-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.retry-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.error-tips {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
  margin-top: 1rem;
}

.error-tips p {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #34495e;
}

.error-tips ul {
  list-style: none;
  padding: 0;
}

.error-tips li {
  padding: 0.4rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.error-tips li:before {
  content: "→ ";
  color: #3498db;
  font-weight: bold;
}

/* Welcome/Empty State */
.welcome-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.welcome-state h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

/* Header Stats */
.header-stats {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;
  font-size: 0.95rem;
}

.header-stats span {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Load Button */
.load-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.load-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.load-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loaded-info {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-weight: 500;
}
```

---

## **🎯 Resumo do Módulo 09**

### **✅ O que Aprendemos**

1. ✅ **Conectar com API real** usando `fetch()`
2. ✅ **Gerenciar estados de loading e erro** com `useState`
3. ✅ **Tratar respostas HTTP** verificando `response.ok`
4. ✅ **Processar dados JSON** reais de 250+ países
5. ✅ **Adaptar componentes** para estrutura da API
6. ✅ **Criar feedback visual** (loading, erro, sucesso)

### **📊 Evolução do Projeto**

| Aspecto | Antes (Módulo 08) | Agora (Módulo 09) |
|---------|-------------------|-------------------|
| **Dados** | Hardcoded locais | API REST Countries real |
| **Quantidade** | 5-10 países | 250+ países |
| **Estados** | Apenas countries/favorites | +loading +error |
| **Requisições** | Nenhuma | fetch() HTTP |
| **Tratamento** | Simples | Loading + Error handling |

### **� Próximos Passos (Módulo 10)**

- 🔄 Automatizar carregamento com `useEffect`
- ⚡ Carregar países ao abrir a página
- 🎯 Entender o ciclo de vida dos componentes
- � Gerenciar side effects

### **💡 Conceitos-Chave**

- **HTTP Request**: Solicitação de dados ao servidor
- **fetch()**: API JavaScript para requisições HTTP
- **async/await**: Sintaxe para lidar com operações assíncronas
- **try/catch/finally**: Estrutura para tratamento de erros
- **Loading State**: Estado visual enquanto aguarda resposta
- **Error Handling**: Captura e exibição de erros amigáveis

### **🔗 Referências**

- [REST Countries API](https://restcountries.com/)
- [MDN - Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [MDN - HTTP Status Codes](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)

---

## **📝 Exercícios Práticos**

### **Exercício 1: Teste no Console**
Abra o DevTools e execute:
```javascript
fetch('https://restcountries.com/v3.1/name/brazil')
  .then(r => r.json())
  .then(d => console.table(d[0]));
```

### **Exercício 2: Adicione um Contador**
Mostre quantos países foram carregados em tempo real durante o fetch.

### **Exercício 3: Filtre por Região na API**
Teste endpoint específico:
```javascript
fetch('https://restcountries.com/v3.1/region/europe')
```

### **Exercício 4: Mensagens Personalizadas**
Modifique `ErrorMessage` para mostrar dicas diferentes dependendo do tipo de erro (rede, servidor, timeout).

### **Exercício 5: Indicador de Velocidade**
Adicione um timer que mostra quanto tempo levou para carregar os dados:
```jsx
const [loadTime, setLoadTime] = useState(null);
// Calcule o tempo entre início e fim do fetch
```

---

**🎉 Parabéns!** Você conectou sua aplicação React com uma API real da internet! No próximo módulo, vamos automatizar esse carregamento usando o hook `useEffect`. 🚀
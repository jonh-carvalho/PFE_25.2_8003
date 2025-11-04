---
id: 14_Rotas_ReactRouter
title: 14 - Rotas com React Router
---

# 14 - Rotas com React Router

Vamos adicionar navegação entre páginas usando React Router: Home com lista de países, página de Favoritos e navegação com Navbar persistente.

---

## Objetivos do Módulo

- Configurar o React Router em um app React
- Criar rotas básicas: Home e Favoritos
- Usar NavLink para navegação com estilo ativo
- Implementar layout persistente com Navbar
- Tratar rotas inexistentes (404)
- Manter estado de favoritos entre rotas

---

## 1. Instalação

```bash
npm install react-router-dom
```

---

## 2. Estrutura de Páginas

Vamos organizar em páginas e um layout compartilhado:

```
src/
├── App.jsx
├── main.jsx
├── pages/
│   ├── Home.jsx       (lista com filtros - do Módulo 11)
│   ├── Favorites.jsx  (apenas favoritos)
│   └── NotFound.jsx   (404)
├── components/
│   ├── Layout.jsx     (Navbar + Outlet)
│   ├── CountryCard.jsx
│   └── CountryGrid.jsx
└── App.css
```

---

## 3. Configuração do Router no main.jsx

Envolva o `<App />` com `<BrowserRouter>`:

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 4. Configuração das Rotas no App.jsx

Use `<Routes>` e `<Route>` para definir as páginas. O `Layout` envolve todas as rotas:

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
```

**Explicação:**
- A rota com `element={<Layout />}` sem `path` é uma rota pai que renderiza o Layout
- `<Outlet />` dentro do Layout renderiza as rotas filhas (Home, Favorites, etc.)
- `path="*"` captura qualquer rota não definida (404)

---

## 5. Layout com Navbar e Outlet

O `Layout` contém a Navbar que aparece em todas as páginas e o `<Outlet />` que renderiza o conteúdo da rota atual:

```jsx
// src/components/Layout.jsx
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">🌍 Países do Mundo</div>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Início
          </NavLink>
          <NavLink 
            to="/favoritos"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            ⭐ Favoritos
          </NavLink>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          Dados fornecidos por{' '}
          <a 
            href="https://servicodados.ibge.gov.br/api/docs/paises" 
            target="_blank" 
            rel="noreferrer"
          >
            API do IBGE
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Layout;
```

**Pontos importantes:**
- `<NavLink>` aplica automaticamente classe `active` quando a rota está ativa
- `<Outlet />` é onde as páginas filhas (Home, Favorites) serão renderizadas
- A Navbar e o Footer aparecem em todas as páginas

---

## 6. Página Home com compartilhamento de estado

A Home reaproveita a lógica dos módulos 10 e 11 (fetch, filtros e favoritos):

```jsx
// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import CountryGrid from '../components/CountryGrid';

function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Buscar países da API do IBGE
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/paises');
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();
        
        // Mapear para o formato esperado
        const mapped = data.map(country => ({
          cca3: country.id['ISO-ALPHA-3'],
          flag: `https://flagcdn.com/${country.id['ISO-ALPHA-2'].toLowerCase()}.svg`,
          name: country.nome.abreviado,
          capital: country.capital?.nome || 'N/A',
          region: country.localizacao.regiao.nome,
          subregion: country.localizacao['sub-regiao'].nome,
          population: 0
        }));
        
        setCountries(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filtrar países
  const filteredCountries = countries.filter(country => {
    const matchSearch = country.name.toLowerCase().includes(search.toLowerCase());
    const matchRegion = !region || country.region === region;
    return matchSearch && matchRegion;
  });

  // Toggle favorito
  const toggleFavorite = (cca3) => {
    setFavorites(prev => 
      prev.includes(cca3) 
        ? prev.filter(code => code !== cca3)
        : [...prev, cca3]
    );
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">Erro ao carregar países: {error}</div>;

  return (
    <div>
      <header className="page-header">
        <h1>Lista de Países</h1>
        <div className="header-stats">
          <span>Total: {countries.length}</span>
          <span>Visíveis: {filteredCountries.length}</span>
          <span>⭐ Favoritos: {favorites.length}</span>
        </div>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar país..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={region} 
          onChange={(e) => setRegion(e.target.value)}
          className="region-select"
        >
          <option value="">Todas as regiões</option>
          <option value="África">África</option>
          <option value="Américas">Américas</option>
          <option value="Ásia">Ásia</option>
          <option value="Europa">Europa</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <CountryGrid 
        countries={filteredCountries}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default Home;
```

---

## 7. Página de Favoritos

Página simples que mostra apenas os países favoritados:

```jsx
// src/pages/Favorites.jsx
import { useEffect, useState } from 'react';
import CountryGrid from '../components/CountryGrid';

function Favorites() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Buscar países
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/paises');
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();
        
        const mapped = data.map(country => ({
          cca3: country.id['ISO-ALPHA-3'],
          flag: `https://flagcdn.com/${country.id['ISO-ALPHA-2'].toLowerCase()}.svg`,
          name: country.nome.abreviado,
          capital: country.capital?.nome || 'N/A',
          region: country.localizacao.regiao.nome,
          subregion: country.localizacao['sub-regiao'].nome,
          population: 0
        }));
        
        setCountries(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filtrar apenas favoritos
  const favoriteCountries = countries.filter(country => 
    favorites.includes(country.cca3)
  );

  const toggleFavorite = (cca3) => {
    setFavorites(prev => 
      prev.includes(cca3) 
        ? prev.filter(code => code !== cca3)
        : [...prev, cca3]
    );
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-container">Erro: {error}</div>;

  return (
    <div>
      <header className="page-header">
        <h1>⭐ Meus Favoritos</h1>
        <div className="header-stats">
          <span>Total: {favoriteCountries.length}</span>
        </div>
      </header>

      {favoriteCountries.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não tem favoritos.</p>
          <p>Volte à página inicial e marque alguns países! 🌍</p>
        </div>
      ) : (
        <CountryGrid 
          countries={favoriteCountries}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}

export default Favorites;
```

---

## 8. Página 404 (NotFound)

Página simples para rotas que não existem:

```jsx
// src/pages/NotFound.jsx
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
```

---

## 9. Estilos CSS para a Navbar e Layout

Adicione ao seu `App.css`:

```css
/* Navbar */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background: white;
  color: #667eea;
}

/* Layout */
.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: calc(100vh - 200px);
}

/* Footer */
.footer {
  background: #f5f5f5;
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
  border-top: 1px solid #e0e0e0;
}

.footer a {
  color: #667eea;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

/* Página 404 */
.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.not-found h1 {
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.back-link:hover {
  background: #5568d3;
}

/* Estado vazio */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-state p {
  font-size: 1.2rem;
  margin: 1rem 0;
}
```

---

## 10. Testando a Aplicação

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

**Testes a realizar:**

1. **Navegação:**
   - Clique em "Início" e "Favoritos" na Navbar
   - Observe que a Navbar permanece visível
   - Note o estilo ativo no link da página atual

2. **Estado entre rotas:**
   - Marque alguns países como favoritos na Home
   - Navegue para Favoritos e veja se eles aparecem
   - **Problema:** Os favoritos não são compartilhados entre as páginas!

3. **404:**
   - Digite uma URL inválida (ex: `/abc123`)
   - Deve aparecer a página 404

---

## 11. Problema: Estado Não Compartilhado

**Observação importante:** Cada página (Home e Favorites) tem seu próprio estado `favorites`. Quando navegamos entre elas, o estado é perdido!

**Solução no próximo módulo:**
- Elevar o estado para o `App.jsx` ou `Layout`
- Usar Context API para compartilhar estado global
- Usar localStorage para persistir favoritos

---

## 12. Resumo

✅ **O que aprendemos:**
- Instalar e configurar React Router
- Criar rotas com `<Routes>` e `<Route>`
- Usar `<NavLink>` para navegação com estilo ativo
- Implementar Layout persistente com `<Outlet />`
- Criar página 404 com rota curinga (`path="*"`)

⚠️ **Limitação atual:**
- Estado de favoritos não é compartilhado entre páginas

🎯 **Próximos passos:**
- Módulo 15: Context API para estado global
- Módulo 16: localStorage para persistência

---

## 13. Exercícios

1. **Contador na Navbar:**
   - Adicione um contador de favoritos na Navbar (ex: "⭐ 5")
   - Dica: Você precisará elevar o estado!

2. **Mais páginas:**
   - Crie uma página "Sobre" com informações do projeto
   - Adicione o link na Navbar

3. **Loading entre rotas:**
   - Adicione um indicador de loading ao trocar de página
   - Use `useNavigation` do React Router

4. **Breadcrumbs:**
   - Adicione navegação breadcrumb (ex: "Home > Favoritos")

---

## Recursos Adicionais

- [React Router Docs](https://reactrouter.com)
- [NavLink vs Link](https://reactrouter.com/en/main/components/nav-link)
- [Nested Routes](https://reactrouter.com/en/main/start/tutorial#nested-routes)

---

**Próximo:** [15 - Context API para Estado Global](./15_Context.md)

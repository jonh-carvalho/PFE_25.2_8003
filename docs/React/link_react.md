
# Como Usar Links no React Sem Router

## Usando Anchor Tags Tradicionais

```jsx
// Navegação tradicional (recarrega a página)
<a href="/about">Sobre</a>
<a href="/contact">Contato</a>
```

## Usando onClick com window.location

```jsx
function NavigationButton() {
    const handleNavigation = () => {
        window.location.href = '/about';
    };

    return <button onClick={handleNavigation}>Ir para Sobre</button>;
}
```

## Navegação com Hash (#)

```jsx
// Links internos na mesma página
<a href="#section1">Ir para Seção 1</a>
<a href="#section2">Ir para Seção 2</a>

// Componente de destino
<div id="section1">Conteúdo da Seção 1</div>
```

## Renderização Condicional Manual

```jsx
function App() {
    const [page, setPage] = useState('home');

    const renderPage = () => {
        switch(page) {
            case 'home': return <Home />;
            case 'about': return <About />;
            default: return <Home />;
        }
    };

    return (
        <div>
            <nav>
                <button onClick={() => setPage('home')}>Home</button>
                <button onClick={() => setPage('about')}>Sobre</button>
            </nav>
            {renderPage()}
        </div>
    );
}
```

## Considerações

- **Anchor tags**: Causam reload completo da página
- **window.location**: Também recarrega a página
- **Hash navigation**: Não recarrega, mas limitado a uma página
- **State management**: Mantém SPA, mas perde funcionalidade de histórico do navegador

**Recomendação**: Para aplicações reais, considere usar React Router para melhor experiência do usuário.

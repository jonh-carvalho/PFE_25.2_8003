// src/pages/Favorites.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import useCountries from '../hooks/useCountries';

function Favorites() {
  const { countries, isLoading, error } = useCountries();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('countryFavorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const favoriteCountries = countries.filter(c => 
    favorites.includes(c.cca3)
  );

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Favoritos ({favoriteCountries.length})</h1>
      {favoriteCountries.length === 0 ? (
        <p>Nenhum favorito. Volte à página inicial e marque alguns! 🙂</p>
      ) : (
        <ul className="favorites-list">
          {favoriteCountries.map(c => (
            <li key={c.cca3}>
              <Link to={`/pais/${c.cca3}`} state={{ country: c }}>
                {c.flag} {c.name.common}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
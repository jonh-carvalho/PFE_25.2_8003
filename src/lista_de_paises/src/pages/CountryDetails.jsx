// src/pages/CountryDetails.jsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function CountryDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const countryFromState = location.state?.country;

  const [country, setCountry] = useState(countryFromState || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!countryFromState);

  useEffect(() => {
    const fetchByCode = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        const data = await res.json();
        setCountry(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!countryFromState) fetchByCode();
  }, [code, countryFromState]);

  const population = useMemo(() => country ?
    new Intl.NumberFormat('pt-BR').format(country.population) : '—', [country]);

  if (loading) return <p>Carregando detalhes...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!country) return <p>País não encontrado.</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>⬅️ Voltar</button>
      <h1>{country.flag} {country.name.common}</h1>
      <img src={country.flags.png} alt={country.name.common} />
      <ul>
        <li>📍 Capital: {country.capital?.[0] || 'N/A'}</li>
        <li>🌎 Região: {country.region} ({country.subregion})</li>
        <li>👥 População: {population}</li>
        <li>📏 Área: {new Intl.NumberFormat('pt-BR').format(country.area)} km²</li>
      </ul>
    </div>
  );
}

export default CountryDetails;
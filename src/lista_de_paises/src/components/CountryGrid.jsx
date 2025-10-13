// src/components/CountryGrid.jsx
import CountryCard from './CountryCard';

function CountryGrid() {
  return (
    <div className="country-grid">
      <CountryCard 
        flag="🇧🇷"
        name="Brasil"
        capital="Brasília"
        population="215 milhões"
        language="Português"
      />
      <CountryCard 
        flag="🇦🇷"
        name="Argentina"
        capital="Buenos Aires"
        population="45 milhões"
        language="Espanhol"
      />
      <CountryCard 
        flag="🇨🇱"
        name="Chile"
        capital="Santiago"
        population="19 milhões"
        language="Espanhol"
      />
      <CountryCard 
        flag="🇺🇾"
        name="Uruguai"
        capital="Montevidéu"
        population="3.5 milhões"
        language="Espanhol"
      />
      <CountryCard 
        flag="🇵🇪"
        name="Peru"
        capital="Lima"
        population="33 milhões"
        language="Espanhol"
      />
      <CountryCard 
        flag="🇨🇴"
        name="Colômbia"
        capital="Bogotá"
        population="51 milhões"
        language="Espanhol"
      />
    </div>
  );
}

export default CountryGrid;
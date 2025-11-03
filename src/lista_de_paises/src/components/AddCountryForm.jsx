// src/components/AddCountryForm.jsx
import { useState } from 'react';

function AddCountryForm({ onAddCountry }) {
  const [formData, setFormData] = useState({
    name: '',
    capital: '',
    population: '',
    language: '',
    flag: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.capital.trim()) {
      newErrors.capital = 'Capital é obrigatória';
    }

    if (!formData.population.trim()) {
      newErrors.population = 'População é obrigatória';
    }

    if (!formData.language.trim()) {
      newErrors.language = 'Idioma é obrigatório';
    }

    if (!formData.flag.trim()) {
      newErrors.flag = 'Emoji da bandeira é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onAddCountry({
        id: Date.now(), // ID simples para demonstração
        flag: formData.flag,
        name: formData.name,
        capital: formData.capital,
        population: formData.population,
        language: formData.language
      });

      // Limpar formulário após envio
      setFormData({
        name: '',
        capital: '',
        population: '',
        language: '',
        flag: ''
      });

      alert('País adicionado com sucesso!');
    }
  };

  return (
    <form className="add-country-form" onSubmit={handleSubmit}>
      <h2>Adicionar Novo País</h2>

      <div className="form-group">
        <label htmlFor="flag">Bandeira (emoji):</label>
        <input
          type="text"
          id="flag"
          name="flag"
          value={formData.flag}
          onChange={handleInputChange}
          placeholder="🇧🇷"
          maxLength="2"
        />
        {errors.flag && <span className="error">{errors.flag}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="name">Nome do País:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Brasil"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="capital">Capital:</label>
        <input
          type="text"
          id="capital"
          name="capital"
          value={formData.capital}
          onChange={handleInputChange}
          placeholder="Brasília"
        />
        {errors.capital && <span className="error">{errors.capital}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="population">População:</label>
        <input
          type="text"
          id="population"
          name="population"
          value={formData.population}
          onChange={handleInputChange}
          placeholder="215 milhões"
        />
        {errors.population && <span className="error">{errors.population}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="language">Idioma:</label>
        <input
          type="text"
          id="language"
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          placeholder="Português"
        />
        {errors.language && <span className="error">{errors.language}</span>}
      </div>

      <button type="submit" className="submit-btn">
        Adicionar País
      </button>
    </form>
  );
}

export default AddCountryForm;
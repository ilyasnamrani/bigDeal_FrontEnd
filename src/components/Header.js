import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [titre, setTitre] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des catégories');

      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    if(event.target.value) {
      navigate(`/annonces-categorie/${event.target.value}`);
      localStorage.setItem("idCat",event.target.value);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (titre.trim() !== "") {
      try {
        const response = await fetch(`http://localhost:8000/api/annonces/titre?titre=${titre}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (response.ok) {
          const annonces = await response.json();
          navigate("/annonces-recherche", { state: { annonces, searchTerm: titre } });
        } else {
          navigate(`/annonces?titre=${encodeURIComponent(titre)}`);
        }
      } catch (error) {
        console.error("Erreur de recherche:", error);
        navigate(`/annonces?titre=${encodeURIComponent(titre)}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <h1>BigDeal</h1>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
        <button type="submit">Chercher</button>
      </form>

      <nav className="navbar-links">
        <Link to="/annonces/me">Mes annonces</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/messages/all">Messages</Link>

        <div className="category-dropdown">
          <label htmlFor="category-select">Catégorie:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={loading || error}
            className="category-select"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
          {selectedCategory && <p>Catégorie sélectionnée: {selectedCategory}</p>}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </nav>
    </header>
  );
};

export default Header;

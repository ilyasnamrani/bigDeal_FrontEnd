// src/pages/Index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Index.css"; // Si tu choisis un fichier CSS séparé

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="index-container">
      <h1 className="bigdeal-title">BigDeal</h1>

      <p className="bigdeal-description">
        Découvrez la marketplace ultime pour acheter et vendre vos produits en toute simplicité. 
        Rejoignez notre communauté et trouvez les meilleures offres près de chez vous !
      </p>

      <div className="button-group">
        <button className="btn login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn signup-btn" onClick={() => navigate("/register")}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Index;

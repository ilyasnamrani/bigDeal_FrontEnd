import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "C:/Users/dell/OneDrive/Bureau/marketplace_frontend/src/components/Header";
import "./Annonces.css"; // Utilisez le même CSS que pour Annonces

const AnnoncesRecherche = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { annonces, searchTerm } = location.state || { annonces: [], searchTerm: "" };

  if (!location.state) {
    return (
      <>
        <Header />
        <div className="annonces-container">
          <p className="error-state">Aucun terme de recherche fourni</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="annonces-container">
        <div className="search-results-header">
          <h1>Résultats de recherche pour "{searchTerm}"</h1>
          <p>{annonces.length} annonce(s) trouvée(s)</p>
        </div>
        
        <div className="annonces-grid">
          {annonces.length > 0 ? (
            annonces.map((annonce) => (
              <div className="annonce-card" key={annonce.id}>
                {/* Badge d'état */}
                <span className="annonce-etat">{annonce.etat}</span>
                
                {annonce.galerie ? (
                  <div className="annonce-slider">
                    {JSON.parse(annonce.galerie).map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:8000/storage/${img}`}
                        alt={`${annonce.titre} - ${index}`}
                        className="annonce-image"
                      />
                    ))}
                  </div>
                ) : (
                  annonce.image && (
                    <img
                      src={`http://localhost:8000/storage/${annonce.image}`}
                      alt={annonce.titre}
                      className="annonce-image"
                    />
                  )
                )}

                <div className="annonce-content">
                  <h2 className="annonce-titre">{annonce.titre}</h2>
                  <p className="annonce-desc">{annonce.description}</p>
                  <p className="annonce-prix">
                    {annonce.prix ? `${annonce.prix} MAD` : "Prix non indiqué"}
                  </p>
                  <p className="annonce-info">
                    {annonce.ville} | {annonce.region} | {annonce.etat}
                  </p>

                  <div className="annonce-actions">
                    <button
                      className="annonce-btn"
                      onClick={() => navigate("/message/create")}
                    >
                      ✉️ Envoyer un message
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Aucune annonce trouvée pour "{searchTerm}"</p>
              <button 
                onClick={() => navigate("/annonces")}
                className="profile-btn"
              >
                Voir toutes les annonces
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnnoncesRecherche;
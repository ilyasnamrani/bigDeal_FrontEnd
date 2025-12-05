import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "C:/Users/dell/OneDrive/Bureau/marketplace_frontend/src/components/Header";
import "./Annonces.css";

const Annonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/annonces", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur de chargement des annonces');
        }
        return res.json();
      })
      .then((data) => {
        setAnnonces(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSendMessage = (annonce) => {
    // Navigation vers la page de création de message avec les infos de l'annonce
    navigate("/message/create", { 
      state: { 
        annonceId: annonce.id,
        annonceInfo: annonce
      } 
    });
  };

  if (loading) return (
    <>
      <Header />
      <div className="annonces-container">
        <p className="loading-state">Chargement des annonces...</p>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className="annonces-container">
        <div className="annonces-grid">
          {annonces.map((annonce) => (
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

                <button 
                  className="annonce-btn" 
                  onClick={() => handleSendMessage(annonce)}
                >
                  ✉️ Envoyer un message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Annonces;
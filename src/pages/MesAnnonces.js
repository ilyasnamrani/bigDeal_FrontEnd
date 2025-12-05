import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigation
import Header from "C:/Users/dell/OneDrive/Bureau/marketplace_frontend/src/components/Header";
import "./Annonces.css";

const MesAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ init navigation

  useEffect(() => {
    fetch("http://localhost:8000/api/annonces/mes-annonces", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnnonces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Chargement des annonces...</p>;

  return (
    <>
      <Header /> {/* navbar ou header */}
       <button className="annonce-btn" onClick={() => navigate("/annonce/create")}>
                Crée une annonce
        </button>
      <div className="annonces-container">
        <div className="annonces-grid">
          {annonces.map((annonce) => (
            <div className="annonce-card" key={annonce.id}>
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

              <h2 className="annonce-titre">{annonce.titre}</h2>
              <p className="annonce-desc">{annonce.description}</p>
              <p className="annonce-prix">
                {annonce.prix ? `${annonce.prix} MAD` : "Prix non indiqué"}
              </p>
              <p className="annonce-info">
                {annonce.ville} | {annonce.region} | {annonce.etat}
              </p>

              {/* ✅ Bouton Envoyer un message */}
              <button
                className="annonce-btn"
                onClick={() => navigate("/annonce/:annonceId/update")}
              >
                Modifier
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MesAnnonces;

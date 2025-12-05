import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./ProfileInfo.css";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur de chargement du profil');
        }
        return res.json();
      })
      .then(data => {
        console.log("USER RENDER", data);
        setUser(data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <p className="loading-state">Chargement du profil...</p>
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <p className="error-state">{error}</p>
        </div>
      </div>
    </>
  );

  if (!user) return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <p className="error-state">Utilisateur introuvable</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Mon Profil</h1>
          <p><strong>Nom :</strong> {user.nom}</p>
          <p><strong>Prénom :</strong> {user.prenom}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Téléphone :</strong> {user.telephone}</p>
          <button
            className="profile-btn"
            onClick={() => navigate("/profileUpdate")}
          >
            Mettre à jour le profil
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // fichier CSS séparé

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    password_confirmation: "",
    status: "acheteur",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        else setMessage(data.message || "Erreur lors de l'inscription");
      } else {
        localStorage.setItem("auth_token", data.token);
        setMessage(data.message || "Inscription réussie");
        navigate("/");
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          password: "",
          password_confirmation: "",
          status: "acheteur",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Inscription</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} />
          {errors.nom && <p className="error">{errors.nom[0]}</p>}

          <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} />
          {errors.prenom && <p className="error">{errors.prenom[0]}</p>}

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email[0]}</p>}

          <input type="text" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} />
          {errors.telephone && <p className="error">{errors.telephone[0]}</p>}

          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password[0]}</p>}

          <input type="password" name="password_confirmation" placeholder="Confirmer le mot de passe" value={formData.password_confirmation} onChange={handleChange} />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="acheteur">Acheteur</option>
            <option value="vendeur">Vendeur</option>
          </select>

          <button type="submit" className="submit-btn">S'inscrire</button>
          {/* <button  className="submit-btn" onClick={navigate("/")}>Retour</button> */}
        </form>
      </div>
    </div>
  );
};

export default Register;

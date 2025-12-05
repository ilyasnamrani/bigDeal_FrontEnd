// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // fichier CSS séparé

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        else setMessage(data.message || "Erreur lors de la connexion");
      } else {
        localStorage.setItem("auth_token", data.token);
        setMessage(data.message || "Connexion réussie");
        navigate("/annonces");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur serveur");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Connexion</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email[0]}</p>}

          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password[0]}</p>}

          <button type="submit" className="submit-btn">Se connecter</button>
          {/* <button  className="submit-btn" onClick={navigate("/")}>Retour</button> */}

        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import './MessageForm.css';

const MessageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [annonceInfo, setAnnonceInfo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // États du formulaire
  const [formData, setFormData] = useState({
    contenu: '',
    image: null,
    receiver_id: '',
    annonce_id: ''
  });

  // Récupérer les données passées depuis la navigation
  useEffect(() => {
    if (location.state) {
      const { annonceId, annonceInfo } = location.state;
      setAnnonceInfo(annonceInfo);
      setFormData(prev => ({
        ...prev,
        annonce_id: annonceId
      }));
      
      // Charger les détails de l'annonce si non fournis
      if (annonceId && !annonceInfo) {
        fetchAnnonceInfo(annonceId);
      }
    }
  }, [location.state]);

  const fetchAnnonceInfo = async (annonceId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/annonces/${annonceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const annonceData = await response.json();
        setAnnonceInfo(annonceData);
      }
    } catch (error) {
      console.error('Erreur chargement annonce:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.contenu.trim() && !formData.image) {
      alert('Veuillez écrire un message ou sélectionner une image');
      return;
    }

    if (!formData.annonce_id) {
      alert('Erreur: Aucune annonce sélectionnée');
      return;
    }

    // Déterminer le receiver_id (vous devrez adapter cette logique)
    const receiverId = determineReceiverId();
    if (!receiverId) {
      alert('Impossible de déterminer le destinataire');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs
      formDataToSend.append('contenu', formData.contenu.trim());
      formDataToSend.append('receiver_id', receiverId);
      
      // Ajouter l'image si présente
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`http://localhost:8000/api/annonces/${formData.annonce_id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          // Ne pas mettre Content-Type pour FormData
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Message envoyé avec succès !');
        
        // Rediriger vers la page des messages de l'annonce
        navigate(`/annonces/${formData.annonce_id}/messages`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
      navigate("/messages/all")
    }
  };

  // Fonction pour déterminer le destinataire (à adapter selon votre logique métier)
  const determineReceiverId = () => {
    // Plusieurs stratégies possibles :
    
    // 1. Si vous avez déjà le receiver_id dans le state
    if (formData.receiver_id) {
      return formData.receiver_id;
    }
    
    // 2. Si l'annonce a un propriétaire
    if (annonceInfo && annonceInfo.user_id) {
      return annonceInfo.user_id;
    }
    // 3. Récupérer depuis le localStorage ou le contexte
    // (Vous devrez implémenter cette logique selon votre app)
    
    // Pour l'instant, retournez une valeur par défaut
    // Vous devrez adapter cette partie
    return 1; // Remplacez par la logique appropriée
  };

  const handleCancel = () => {
    if (formData.annonce_id) {
      navigate(`/messages/all`);
    } else {
      navigate(-1);
    }
  };


  return (
    <>
      <Header />
      <div className="message-form-container">
        <div className="message-form-card">
          <div className="form-header">
            <h1 className="form-title">
              {annonceInfo ? `Envoyer un message - ${annonceInfo.titre}` : 'Nouveau Message'}
            </h1>
            {annonceInfo && (
              <div className="annonce-preview">
                <p className="annonce-price">{annonceInfo.prix} MAD</p>
                <p className="annonce-description">{annonceInfo.description}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            {/* Contenu du message */}
            <div className="form-group">
              <label htmlFor="contenu" className="form-label">
                Votre message *
              </label>
              <textarea
                id="contenu"
                name="contenu"
                value={formData.contenu}
                onChange={handleInputChange}
                className="message-textarea"
                placeholder="Tapez votre message ici..."
                rows="6"
                maxLength="2000"
                required
              />
              <div className="char-counter">
                {formData.contenu.length}/2000 caractères
              </div>
            </div>

            {/* Upload d'image */}
            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Image (optionnelle)
              </label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="file-input"
                  accept="image/jpg, image/jpeg, image/png"
                />
                <label htmlFor="image" className="file-label">
                  <span className="file-icon">📎</span>
                  <span className="file-text">
                    {formData.image ? 'Changer l\'image' : 'Choisir une image'}
                  </span>
                </label>
                <small className="file-hint">
                  Formats acceptés: JPG, JPEG, PNG (max 2MB)
                </small>
              </div>

              {/* Prévisualisation de l'image */}
              {imagePreview && (
                <div className="image-preview-container">
                  <div className="image-preview">
                    <img src={imagePreview} alt="Aperçu" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Informations sur le destinataire (optionnel) */}
            <div className="form-group">
              <label htmlFor="receiver_id" className="form-label">
                Destinataire
              </label>
              <input
                type="text"
                id="receiver_id"
                name="receiver_id"
                value={formData.receiver_id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="ID du destinataire (si connu)"
              />
              <small className="field-hint">
                Laissé vide pour envoyer au propriétaire de l'annonce
              </small>
            </div>

            {/* Boutons d'action */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading || (!formData.contenu.trim() && !formData.image)}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Envoi en cours...
                  </>
                ) : (
                  '📤 Envoyer le message'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MessageForm;
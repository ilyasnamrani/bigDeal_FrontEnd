import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './AnnonceForm.css';

const AnnonceForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie_id: '',
    ville: '',
    etat: 'neuf',
    status: 'disponible',
    region: '',
    prix: '',
    image: null,
    galerie: []
  });

  // Charger les catégories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
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
      setFormData(prev => ({ ...prev, image: file }));
      
      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, galerie: files }));
    
    // Prévisualisations galerie
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...formData.galerie];
    const newPreviews = [...galleryPreviews];
    
    newGallery.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData(prev => ({ ...prev, galerie: newGallery }));
    setGalleryPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs texte
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categorie_id', formData.categorie_id);
      formDataToSend.append('ville', formData.ville);
      formDataToSend.append('etat', formData.etat);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('region', formData.region);
      formDataToSend.append('prix', formData.prix);

      // Ajouter l'image principale
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Ajouter les images de la galerie
      formData.galerie.forEach((file, index) => {
        formDataToSend.append(`galerie[${index}]`, file);
      });

      const response = await fetch('http://localhost:8000/api/annonces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          // Ne pas mettre Content-Type pour FormData
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Annonce créée avec succès !');
        navigate('/annonces/me');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message || 'Erreur lors de la création'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="annonce-form-container">
        <div className="annonce-form-card">
          <h1 className="form-title">Créer une Annonce</h1>
          
          <form onSubmit={handleSubmit} className="annonce-form">
            {/* Titre */}
            <div className="form-group">
              <label htmlFor="titre" className="form-label">Titre *</label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Titre de votre annonce"
                maxLength="150"
                required
              />
              <small className="char-count">{formData.titre.length}/150</small>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Décrivez votre produit..."
                maxLength="400"
                rows="4"
              />
              <small className="char-count">{formData.description.length}/400</small>
            </div>

            {/* Catégorie */}
            <div className="form-group">
              <label htmlFor="categorie_id" className="form-label">Catégorie *</label>
              <select
                id="categorie_id"
                name="categorie_id"
                value={formData.categorie_id}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div className="form-group">
              <label htmlFor="prix" className="form-label">Prix (MAD)</label>
              <input
                type="number"
                id="prix"
                name="prix"
                value={formData.prix}
                onChange={handleInputChange}
                className="form-input"
                placeholder="100"
                min="100"
                step="1"
              />
            </div>

            {/* État */}
            <div className="form-group">
              <label className="form-label">État *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="etat"
                    value="neuf"
                    checked={formData.etat === 'neuf'}
                    onChange={handleInputChange}
                  />
                  Neuf
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="etat"
                    value="occasion"
                    checked={formData.etat === 'occasion'}
                    onChange={handleInputChange}
                  />
                  Occasion
                </label>
              </div>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Statut *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="disponible"
                    checked={formData.status === 'disponible'}
                    onChange={handleInputChange}
                  />
                  Disponible
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="vendue"
                    checked={formData.status === 'vendue'}
                    onChange={handleInputChange}
                  />
                  Vendue
                </label>
              </div>
            </div>

            {/* Ville et Région */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ville" className="form-label">Ville</label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Ville"
                  maxLength="20"
                />
              </div>

              <div className="form-group">
                <label htmlFor="region" className="form-label">Région</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Région"
                  maxLength="20"
                />
              </div>
            </div>

            {/* Image principale */}
            <div className="form-group">
              <label htmlFor="image" className="form-label">Image principale</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="form-file"
                accept="image/png, image/jpg, image/jpeg"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="remove-image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Galerie d'images */}
            <div className="form-group">
              <label htmlFor="galerie" className="form-label">Galerie d'images</label>
              <input
                type="file"
                id="galerie"
                name="galerie"
                onChange={handleGalleryChange}
                className="form-file"
                accept="image/png, image/jpg, image/jpeg"
                multiple
              />
              
              {galleryPreviews.length > 0 && (
                <div className="gallery-previews">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="gallery-preview">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => removeGalleryImage(index)}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton de soumission */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer l\'annonce'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AnnonceForm;
import React from "react";
import { Router,Route } from "react-router-dom";
const AnnoncesParCategorie =() =>{
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
}
 export default AnnoncesParCategories
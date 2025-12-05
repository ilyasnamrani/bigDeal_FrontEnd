import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllConversations();
  }, []);

  const fetchAllConversations = async () => {
    try {
      console.log('🔍 Chargement de toutes les conversations...');
      
      const response = await fetch('http://localhost:8000/api/user/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Statut de la réponse:', response.status);

      if (response.ok) {
        const conversationsData = await response.json();
        console.log('📦 Conversations reçues:', conversationsData);
        
        setConversations(conversationsData);
      } else {
        throw new Error('Erreur lors du chargement des conversations');
      }
    } catch (err) {
      console.error('❌ Erreur fetch:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (annonceId, annonceInfo) => {
    if (!annonceId) {
      alert('Erreur: ID d\'annonce non disponible');
      return;
    }

    navigate("/message/create", { 
      state: { 
        annonceId: annonceId,
        annonceInfo: annonceInfo 
      } 
    });
  };

  const handleViewConversation = (annonceId) => {
    navigate(`/annonces/${annonceId}/messages`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getSenderName = (message) => {
    // Si vous avez les informations de l'expéditeur
    return message.sender?.name || message.sender?.prenom || 'Utilisateur';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="messages-container">
          <div className="loading-state">Chargement des conversations...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="messages-container">
          <div className="error-state">
            {error}
            <br />
            <button 
              onClick={() => navigate('/annonces')}
              className="back-btn"
              style={{ marginTop: '20px' }}
            >
              Retour aux annonces
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="messages-container">
        <div className="messages-card">
          {/* En-tête */}
          <div className="messages-header">
            <div className="annonce-info">
              <h1>Mes conversations</h1>
              <p className="messages-count">
                {conversations.length} conversation(s) trouvée(s)
              </p>
            </div>
            
            <div className="header-actions">
              <button 
                onClick={() => navigate('/annonces')}
                className="back-btn"
              >
                ← Retour aux annonces
              </button>
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="conversations-list">
            {conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div key={conversation.annonce?.id || index} className="conversation-item">
                  
                  {/* Carte de l'annonce */}
                  <div className="annonce-card">
                    <div className="annonce-header">
                      <h3>📋 Annonce concernée</h3>
                    </div>
                    <div className="annonce-content">
                      {conversation.annonce?.image && (
                        <img
                          src={`http://localhost:8000/storage/${conversation.annonce.image}`}
                          alt={conversation.annonce.titre}
                          className="annonce-image"
                        />
                      )}
                      <div className="annonce-info">
                        <h4>{conversation.annonce?.titre || 'Annonce sans titre'}</h4>
                        <p className="annonce-prix">
                          {conversation.annonce?.prix ? `${conversation.annonce.prix} MAD` : 'Prix non spécifié'}
                        </p>
                        <p className="annonce-location">
                          {conversation.annonce?.ville && `${conversation.annonce.ville}`}
                          {conversation.annonce?.region && `, ${conversation.annonce.region}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dernier message */}
                  {conversation.last_message && (
                    <div className="last-message-section">
                      <h4>💬 Dernier message</h4>
                      <div className="last-message">
                        <div className="message-sender">
                          De: {getSenderName(conversation.last_message)}
                        </div>
                        <p className="message-content">
                          {conversation.last_message.contenu}
                        </p>
                        <div className="message-time">
                          {formatDate(conversation.last_message.created_at)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Liste de tous les messages (aperçu) */}
                  <div className="all-messages-preview">
                    <h4>📨 Tous les messages ({conversation.messages_count})</h4>
                    <div className="messages-list-preview">
                      {conversation.messages.slice(0, 3).map((message, msgIndex) => (
                        <div key={message.id || msgIndex} className="message-preview-item">
                          <div className="message-preview-header">
                            <span className="sender">{getSenderName(message)}</span>
                            <span className="time">{formatDate(message.created_at)}</span>
                          </div>
                          <p className="message-preview-content">{message.contenu}</p>
                        </div>
                      ))}
                      {conversation.messages_count > 3 && (
                        <p className="more-messages">
                          ... et {conversation.messages_count - 3} autre(s) message(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="conversation-actions">
                    <button 
                      onClick={() => handleViewConversation(conversation.annonce?.id)}
                      className="view-conversation-btn"
                    >
                      👁️ Voir toute la conversation
                    </button>
                    <button 
                      onClick={() => handleReply(conversation.annonce?.id, conversation.annonce)}
                      className="reply-btn"
                    >
                      ✉️ Répondre
                    </button>
                  </div>

                  {/* Séparateur */}
                  <div className="conversation-separator"></div>
                </div>
              ))
            ) : (
              <div className="no-messages">
                <h3>📭 Aucune conversation</h3>
                <p>Vous n'avez pas encore reçu de messages sur vos annonces.</p>
                <p>Quand quelqu'un vous enverra un message, il apparaîtra ici.</p>
                <button 
                  onClick={() => navigate('/annonces/me')}
                  className="reply-btn-large"
                >
                  📋 Voir mes annonces
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
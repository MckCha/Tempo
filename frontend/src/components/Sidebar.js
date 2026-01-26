import React from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiMenu, FiX, FiCompass } from 'react-icons/fi';
import './Sidebar.css';

function Sidebar({
  conversations,
  activeConversation,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onToggle
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle mobile-toggle" onClick={onToggle}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FiCompass className="logo-icon" />
            <span className="logo-text">Tempo</span>
          </div>
          <button className="sidebar-toggle desktop-toggle" onClick={onToggle}>
            <FiMenu size={20} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={onNewConversation}>
          <FiPlus size={20} />
          <span>New Trip</span>
        </button>

        <div className="conversations-list">
          <h3 className="section-title">Recent Conversations</h3>
          {conversations.length === 0 ? (
            <div className="empty-state">
              <FiMessageSquare size={32} />
              <p>No conversations yet</p>
              <span>Start planning your next adventure!</span>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${activeConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <FiMessageSquare className="conversation-icon" />
                <div className="conversation-info">
                  <span className="conversation-title">{conversation.title}</span>
                  <span className="conversation-date">{formatDate(conversation.created_at)}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">T</div>
            <span className="user-name">Traveler</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

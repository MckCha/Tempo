import React from 'react';
import './TypingIndicator.css';

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">✈️</div>
      <div className="typing-bubble">
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="typing-text">Planning your adventure...</span>
      </div>
    </div>
  );
}

export default TypingIndicator;

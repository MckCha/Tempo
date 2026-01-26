import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMapPin } from 'react-icons/fi';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import './ChatWindow.css';

function ChatWindow({ messages, onSendMessage, isLoading, conversationTitle }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const quickPrompts = [
    { icon: '🏖️', text: 'Beach destinations' },
    { icon: '🏔️', text: 'Mountain getaways' },
    { icon: '🏛️', text: 'Cultural cities' },
    { icon: '🍜', text: 'Food tours' }
  ];

  return (
    <div className="chat-window">
      <header className="chat-header">
        <div className="header-content">
          <FiMapPin className="header-icon" />
          <h2>{conversationTitle || 'New Conversation'}</h2>
        </div>
      </header>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-icon">✈️</div>
            <h3>Ready to plan your adventure?</h3>
            <p>Ask me anything about travel destinations, itineraries, or tips!</p>
            <div className="quick-prompts">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="quick-prompt-btn"
                  onClick={() => onSendMessage(`Tell me about ${prompt.text.toLowerCase()}`)}
                >
                  <span className="prompt-icon">{prompt.icon}</span>
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form className="input-container" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Where would you like to go?"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
            disabled={!inputValue.trim() || isLoading}
          >
            <FiSend size={20} />
          </button>
        </div>
        <p className="input-hint">Press Enter to send, Shift + Enter for new line</p>
      </form>
    </div>
  );
}

export default ChatWindow;

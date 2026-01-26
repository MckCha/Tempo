import React from 'react';
import { FiUser } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import './Message.css';

function Message({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'} ${isError ? 'error' : ''}`}>
      <div className="message-avatar">
        {isUser ? (
          <FiUser size={18} />
        ) : (
          <span className="ai-avatar">✈️</span>
        )}
      </div>
      <div className="message-content">
        <div className="message-bubble">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

export default Message;

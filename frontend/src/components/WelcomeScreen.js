import React from 'react';
import { FiCompass, FiMap, FiSun, FiCamera } from 'react-icons/fi';
import './WelcomeScreen.css';

function WelcomeScreen({ onStartChat }) {
  const features = [
    {
      icon: <FiMap />,
      title: 'Custom Itineraries',
      description: 'Get personalized day-by-day travel plans tailored to your interests'
    },
    {
      icon: <FiCompass />,
      title: 'Destination Insights',
      description: 'Discover hidden gems and local favorites at any destination'
    },
    {
      icon: <FiSun />,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on weather, season, and your preferences'
    },
    {
      icon: <FiCamera />,
      title: 'Activity Planning',
      description: 'From adventure sports to cultural experiences, plan it all'
    }
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="hero-icon">
            <span className="globe">🌍</span>
            <span className="plane">✈️</span>
          </div>
          <h1>Welcome to <span className="brand">Tempo</span></h1>
          <p className="hero-subtitle">Your AI-Powered Travel Companion</p>
          <p className="hero-description">
            Plan your perfect trip with intelligent recommendations, personalized itineraries, 
            and expert travel advice - all through a simple conversation.
          </p>
          <button className="start-btn" onClick={onStartChat}>
            <span>Start Planning Your Adventure</span>
            <span className="btn-icon">→</span>
          </button>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="welcome-footer">
          <p>Just tell me where you want to go, and I'll handle the rest! 🎒</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;

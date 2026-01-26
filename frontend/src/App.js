import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import WelcomeScreen from './components/WelcomeScreen';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Create a new conversation
  const createNewConversation = () => {
    const newConversation = {
      id: uuidv4(),
      title: 'New Trip Planning',
      created_at: new Date().toISOString(),
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setMessages([]);
  };

  // Select a conversation
  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages || []);
  };

  // Delete a conversation
  const deleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
      setMessages([]);
    }
  };

  // Send a message
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: content,
      timestamp: new Date().toISOString()
    };

    // Add user message to state
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Update conversation title if it's the first message
    if (messages.length === 0 && activeConversation) {
      const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversation.id
            ? { ...c, title, messages: updatedMessages }
            : c
        )
      );
    }

    try {
      // Simulate AI response (replace with actual API call)
      const aiResponse = await simulateAIResponse(content);
      
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Update conversation with new messages
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversation?.id
            ? { ...c, messages: finalMessages }
            : c
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response (replace with actual API integration)
  const simulateAIResponse = async (userMessage) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      default: `I'd love to help you plan your trip! 🌍✈️\n\nTo get started, could you tell me:\n- **Where** would you like to go?\n- **When** are you planning to travel?\n- **How long** will your trip be?\n- Any specific **interests** or **activities** you enjoy?`,
      greeting: `Hello! Welcome to Tempo! 👋🌟\n\nI'm your AI travel companion, here to help you plan the perfect adventure. Whether you're dreaming of:\n\n🏖️ **Beach getaways**\n🏔️ **Mountain adventures**\n🏛️ **Cultural explorations**\n🍜 **Culinary journeys**\n\nI'm here to make it happen! What destination has been on your mind?`,
      destination: `Great choice! 🎉\n\nThat sounds like an amazing destination! Let me help you craft the perfect itinerary.\n\nHere are some things I can help you with:\n- 📍 Must-see attractions and hidden gems\n- 🍽️ Local restaurant recommendations\n- 🏨 Accommodation suggestions\n- 🚗 Transportation tips\n- 📅 Day-by-day itinerary planning\n\nWhat aspect would you like to explore first?`
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return responses.greeting;
    } else if (lowerMessage.includes('visit') || lowerMessage.includes('go to') || lowerMessage.includes('travel')) {
      return responses.destination;
    }
    return responses.default;
  };

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewConversation={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        {activeConversation ? (
          <ChatWindow
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            conversationTitle={activeConversation.title}
          />
        ) : (
          <WelcomeScreen onStartChat={createNewConversation} />
        )}
      </main>
    </div>
  );
}

export default App;

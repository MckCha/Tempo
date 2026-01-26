import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Conversations API
export const conversationService = {
  getAll: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  create: async (userId, itineraryId, sessionId) => {
    const response = await api.post('/conversations', {
      user_id: userId,
      itinerary_id: itineraryId,
      session_id: sessionId,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/conversations/${id}`);
    return response.data;
  },
};

// Messages API
export const messageService = {
  getAll: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  create: async (conversationId, role, tokens, content) => {
    const response = await api.post('/messages', {
      conversation_id: conversationId,
      role: role,
      tokens: tokens,
      content: content,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};

// Users API
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

// Itineraries API
export const itineraryService = {
  getAll: async () => {
    const response = await api.get('/itineraries');
    return response.data;
  },

  create: async (itineraryData) => {
    const response = await api.post('/itineraries', itineraryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/itineraries/${id}`);
    return response.data;
  },
};

export default api;

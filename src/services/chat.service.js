import api from './api';

export const sendMessage = async (sender, receiver, content) => {
  return api.post('/chat/send', { sender, receiver, content });
};

export const getMessages = async (user1, user2) => {
  return api.get(`/chat/${user1}/${user2}`);
};
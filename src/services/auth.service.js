import api from './api';

export const registerUser = async (name, email, password) => {
  return api.post('/auth/register', { name, email, password });
};

export const loginUser = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const getAllUsers = async () => {
  return api.get('/auth/users');
};
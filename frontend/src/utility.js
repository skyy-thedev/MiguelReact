// src/utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchAgendamentos = async () => {
  const response = await fetch(`${API_BASE_URL}/api/agendamentos/agendamentos`);
  return response.json();
};
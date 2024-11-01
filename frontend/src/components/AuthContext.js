import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';

// Criar o contexto
const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Erro ao analisar o cookie de usuário:', error);
      return null; // Retorne null se ocorrer um erro
    }
  });

  const login = (userData) => {
    setUser(userData);
    
    try {
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
      console.log('Usuário logado:', userData.name);
    } catch (error) {
      console.error('Erro ao armazenar o cookie de usuário:', error);
    }
  };
  
  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    console.log('Usuário deslogado');
  };  

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// Hook para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
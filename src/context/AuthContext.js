import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    username: '',
    password: ''
  });

  const login = (username, password) => {

    if (username === 'user' && password === 'password') {
      setAuth({
        isAuthenticated: true,
        username,
        password
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      username: '',
      password: ''
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}

// Custom Hook for using Auth Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  
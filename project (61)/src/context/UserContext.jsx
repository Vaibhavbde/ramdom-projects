import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Mohd Saad',
    email: 'saad@example.com',
    phone: '+91 9876543210',
    bio: 'Software Engineer & Builder 🚀',
    avatarUrl: '',
    isAuthenticated: false // Default to false for the login flow
  });

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const login = (email, password) => {
    // Mock login logic, actually update email
    if(password) {
      setUser(prev => ({ ...prev, email, isAuthenticated: true }));
    }
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isAuthenticated: false }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

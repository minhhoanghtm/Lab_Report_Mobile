import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface UserContextType {
  user: User | null;
  logout: () => void;
  login: (userData: User) => void;
}

export const defaultUser: User = {
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultUser);

  const logout = () => {
    setUser(null);
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

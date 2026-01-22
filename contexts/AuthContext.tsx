import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'client' | 'candidate' | 'partner' | null;

interface User {
  name: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    // Simulate user data based on role
    let mockUser: User = {
      name: 'Guest User',
      role: role,
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'
    };

    if (role === 'admin') mockUser = { name: 'Jackson Admin', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' };
    if (role === 'client') mockUser = { name: 'Dangote Industries', role: 'client', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop' };
    if (role === 'candidate') mockUser = { name: 'John Doe', role: 'candidate', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' };
    if (role === 'partner') mockUser = { name: 'Sarah Design', role: 'partner', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop' };

    setUser(mockUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
 // Context za avtentikacijo uporabnikov (funkcionalnost za avtentikacijo cez aplikacijo)
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { api, User } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Provider component, ki ovija aplikacijo in naredi auth objekt na voljo za vse child komponente.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Preveri za obstojeci auth token, nato fetchaj user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await api.getUserProfile();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    }
  }, []);

  /**
   * Avtentikacija uporabnika z email in geslom
   * Nastavi auth token in user data po uspesni avtentikaciji
   */
  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    
    if (!response.user || !response.token) {
      throw new Error('Invalid login response');
    }

    setIsAuthenticated(true);
    setUser(response.user);
  };

  /**
   * Registrira novega uporabnika in ga prijavi
   * Nastavi auth token in user data po uspesni avtentikaciji
   */
  const register = async (userData: any) => {
    const response = await api.register(userData);
    setIsAuthenticated(true);
    setUser(response.user);
  };

  
  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Vrnemo AuthContext.Provider z vrednostjo auth contexta
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

 // Hook za komponente, da dobijo dostop do auth contexta
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
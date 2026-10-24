import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; dev_code?: string }>;
  verifyOtp: (phone: string, code: string, fullName?: string) => Promise<void>;
  loginWithPassword: (identifier: string, password: string) => Promise<void>;
  registerWithPassword: (username: string, password: string, fullName?: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jaheshkar_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('jaheshkar_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/accounts/me/');
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('jaheshkar_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const sendOtp = async (phone: string) => {
    const res = await api.post('/accounts/send-otp/', { phone_number: phone });
    return res.data;
  };

  const verifyOtp = async (phone: string, code: string, fullName?: string) => {
    const res = await api.post('/accounts/verify-otp/', {
      phone_number: phone,
      code,
      full_name: fullName,
    });
    const newToken = res.data.token;
    localStorage.setItem('jaheshkar_token', newToken);
    setToken(newToken);
    setUser(res.data.user);
  };

  const loginWithPassword = async (identifier: string, password: string) => {
    const res = await api.post('/accounts/login/', {
      identifier,
      password,
    });
    const newToken = res.data.token;
    localStorage.setItem('jaheshkar_token', newToken);
    setToken(newToken);
    setUser(res.data.user);
  };

  const registerWithPassword = async (
    username: string,
    password: string,
    fullName?: string,
    phone?: string
  ) => {
    const res = await api.post('/accounts/register/', {
      username,
      password,
      full_name: fullName,
      phone_number: phone,
    });
    const newToken = res.data.token;
    localStorage.setItem('jaheshkar_token', newToken);
    setToken(newToken);
    setUser(res.data.user);
  };

  const logout = () => {
    api.post('/accounts/logout/').catch(() => {});
    localStorage.removeItem('jaheshkar_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        sendOtp,
        verifyOtp,
        loginWithPassword,
        registerWithPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

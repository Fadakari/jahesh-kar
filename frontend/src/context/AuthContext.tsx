import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sendOtp: (phone: string, extraData?: Record<string, any>) => Promise<any>;
  verifyOtp: (phone: string, code: string, fullName?: string, extraData?: Record<string, any>) => Promise<any>;
  loginWithPassword: (identifier: string, password: string) => Promise<any>;
  registerWithPassword: (username: string, password: string, fullName?: string, phone?: string) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('avazamouz_token') || localStorage.getItem('jaheshkar_token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const savedToken =
      localStorage.getItem('avazamouz_token') || localStorage.getItem('jaheshkar_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/accounts/me/');
      // Support either { user: {...} } or direct user object
      const userData = res.data?.user || res.data;
      if (userData && (userData.id || userData.username || userData.phone_number)) {
        setUser(userData);
      }
    } catch {
      localStorage.removeItem('avazamouz_token');
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

  // Decoupled Send OTP (compatible with any backend payload format)
  const sendOtp = async (phone: string, extraData: Record<string, any> = {}) => {
    const payload = {
      phone_number: phone,
      phone: phone,
      mobile: phone,
      ...extraData,
    };
    const res = await api.post('/accounts/send-otp/', payload);
    return res.data;
  };

  // Decoupled Verify OTP (handles JWT access tokens, Token auth, or Session IDs)
  const verifyOtp = async (
    phone: string,
    code: string,
    fullName?: string,
    extraData: Record<string, any> = {}
  ) => {
    const payload = {
      phone_number: phone,
      phone: phone,
      mobile: phone,
      code,
      otp: code,
      token: code,
      full_name: fullName,
      ...extraData,
    };

    const res = await api.post('/accounts/verify-otp/', payload);

    // Support standard token variations returned by different backend frameworks
    const newToken =
      res.data?.token ||
      res.data?.access ||
      res.data?.key ||
      res.data?.access_token ||
      res.data?.data?.token;

    if (newToken && typeof newToken === 'string') {
      localStorage.setItem('avazamouz_token', newToken);
      setToken(newToken);
    }

    if (res.data?.user) {
      setUser(res.data.user);
    } else {
      await refreshUser();
    }

    return res.data;
  };

  const loginWithPassword = async (identifier: string, password: string) => {
    const payload = {
      identifier,
      username: identifier,
      phone_number: identifier,
      password,
    };
    const res = await api.post('/accounts/login/', payload);

    const newToken =
      res.data?.token ||
      res.data?.access ||
      res.data?.key ||
      res.data?.access_token ||
      res.data?.data?.token;

    if (newToken && typeof newToken === 'string') {
      localStorage.setItem('avazamouz_token', newToken);
      setToken(newToken);
    }

    if (res.data?.user) {
      setUser(res.data.user);
    } else {
      await refreshUser();
    }

    return res.data;
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
      phone: phone,
    });

    const newToken =
      res.data?.token ||
      res.data?.access ||
      res.data?.key ||
      res.data?.access_token;

    if (newToken && typeof newToken === 'string') {
      localStorage.setItem('avazamouz_token', newToken);
      setToken(newToken);
    }

    if (res.data?.user) {
      setUser(res.data.user);
    } else {
      await refreshUser();
    }

    return res.data;
  };

  const logout = () => {
    api.post('/accounts/logout/').catch(() => {});
    localStorage.removeItem('avazamouz_token');
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

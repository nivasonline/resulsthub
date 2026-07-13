import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('resulthub_admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('resulthub_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((data) => {
        setAdmin(data);
        localStorage.setItem('resulthub_admin', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('resulthub_token');
        localStorage.removeItem('resulthub_admin');
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const { token, admin: adminData } = await authService.login(username, password);
    localStorage.setItem('resulthub_token', token);
    localStorage.setItem('resulthub_admin', JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('resulthub_token');
    localStorage.removeItem('resulthub_admin');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

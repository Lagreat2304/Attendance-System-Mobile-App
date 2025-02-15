import React, { createContext, useState, useContext, useEffect } from 'react';
import { storeUserData, getUserData, clearStorage, storeTokenData, getToken } from '../Utils/Storage';
import axios from 'axios';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await getUserData();
      const tokenData = await getToken();

      if (userData && tokenData) {
        const { token, expiry } = tokenData;
        console.log("Token Expiry:", expiry);

        if (isTokenExpired(expiry)) {
          console.log("Token expired, logging out.");
          await logout();
        } else {
          console.log("Token still valid, user authenticated.");
          setUser(userData);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTokenExpired = (expiry) => {
    const now = Date.now();
    console.log("Current Time:", now);
    return now >= expiry;
  };

  const login = async (form) => {
    try {
      const { email, password } = form;
      const response = await axios.post(`${BACKEND_URL}/student/login`, {
        email,
        password,
      });

      const userData = response.data;
      const token = userData.token;
      const expiry = Date.now() + 60000 * 10; 
      setUser(userData);
      await storeUserData(userData);
      await storeTokenData({ token, expiry });

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await clearStorage();
      delete axios.defaults.headers.common['Authorization']; 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login,
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

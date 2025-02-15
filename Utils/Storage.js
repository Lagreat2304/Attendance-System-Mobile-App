import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

export const storeTokenData = async ({ token, expiry }) => {
  try {
    await AsyncStorage.setItem('token', JSON.stringify({ token, expiry }));
  } catch (error) {
    console.error('Error storing token data:', error);
  }
};

export const getToken = async () => {
  try {
    const tokenData = await AsyncStorage.getItem('token');
    return tokenData ? JSON.parse(tokenData) : null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

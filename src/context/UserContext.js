import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProMatchUser = async () => {
      try {
        const storedProMatchUser = await AsyncStorage.getItem('currentUser');
        if (storedProMatchUser) {
          setUser(JSON.parse(storedProMatchUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadProMatchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

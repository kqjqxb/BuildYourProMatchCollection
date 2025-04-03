import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingProMatchScreen from './src/screens/OnboardingProMatchScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';
import LoadingProScreen from './src/screens/LoadingProScreen';


const Stack = createNativeStackNavigator();

const CopenhagenStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isProMatchOnbVisible, setProMatchOnbVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const [initializingProMatchApp, setInitializingNeshineNevsehirApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadProMatchUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedProMatchUser = await AsyncStorage.getItem(storageKey);
        const isProMatchOnbVisible = await AsyncStorage.getItem('isProMatchOnbVisible');

        if (storedProMatchUser) {
          setUser(JSON.parse(storedProMatchUser));
          setProMatchOnbVisible(false);
        } else if (isProMatchOnbVisible) {
          setProMatchOnbVisible(false);
        } else {
          setProMatchOnbVisible(true);
          await AsyncStorage.setItem('isProMatchOnbVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of promatch user', error);
      } finally {
        setInitializingNeshineNevsehirApp(false);
      }
    };
    loadProMatchUser();
  }, [setUser]);

  if (initializingProMatchApp) {
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#000000',
      }}>
        <ActivityIndicator size="large" color="#EDE72F" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={isProMatchOnbVisible ? 'OnboardingProMatchScreen' : 'LoadingProScreen'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingProMatchScreen" component={OnboardingProMatchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadingProScreen" component={LoadingProScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default CopenhagenStack;

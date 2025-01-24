/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import MovieListScreen from './src/screens/MovieListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import ArtistDetailScreen from './src/screens/ArtistDetailScreen';
import CommentsScreen from './src/screens/CommentsScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="MovieList" component={MovieListScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
          <Stack.Screen name="ArtistDetailScreen" component={ArtistDetailScreen} />
          <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App;

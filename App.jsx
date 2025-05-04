import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import {ToastProvider} from './src/context/ToastContext';
import {AuthProvider} from './src/context/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import HomeScreen from './src/screens/HomeScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import MovieListScreen from './src/screens/MovieListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import ArtistDetailScreen from './src/screens/ArtistDetailScreen';
import CommentsScreen from './src/screens/CommentsScreen';
import CastDetailsScreen from './src/screens/CastDetailsScreen';
import CollectionDetailsScreen from './src/screens/CollectionDetailsScreen';
import ListDetailScreen from './src/screens/ListDetailScreen';
import CreateListScreen from './src/screens/CreateListScreen';
import PublicUserProfile from './src/screens/PublicUserProfile';
import MovieWatchlistScreen from './src/screens/MovieWatchlistScreen';
import FollowingListScreen from './src/screens/FollowingListScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GluestackUIProvider config={config}>
      <ToastProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Verify" component={VerifyScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="MovieList" component={MovieListScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
              <Stack.Screen
                name="ArtistDetailScreen"
                component={ArtistDetailScreen}
              />
              <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
              <Stack.Screen name="CastDetails" component={CastDetailsScreen} />
              <Stack.Screen
                name="CollectionDetails"
                component={CollectionDetailsScreen}
              />
              <Stack.Screen
                name="ListDetails"
                component={ListDetailScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen name="CreateList" component={CreateListScreen} />
              <Stack.Screen
                name="PublicProfile"
                component={PublicUserProfile}
                options={{
                  animation: 'slide_from_bottom',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="MovieWatchlist"
                component={MovieWatchlistScreen}
              />
              <Stack.Screen
                name="FollowingList"
                component={FollowingListScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ToastProvider>
    </GluestackUIProvider>
  );
}

export default App;

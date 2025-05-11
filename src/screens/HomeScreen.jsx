import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';
import ListsScreen from './ListsScreen';
import MainHomeScreen from './MainHomeScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="DiscoverTab"
      screenOptions={({route}) => ({
        tabBarStyle: {
          display: 'none', // Hide the default tab bar
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="DiscoverTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Discover',
        }}
      />
      <Tab.Screen
        name="FeedTab"
        component={MainHomeScreen}
        options={{
          tabBarLabel: 'Feed',
        }}
      />
      <Tab.Screen
        name="ListsTab"
        component={ListsScreen}
        options={{
          tabBarLabel: 'Lists',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

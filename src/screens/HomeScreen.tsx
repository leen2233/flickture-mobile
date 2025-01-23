import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Box,
  Text,
  Center,
  Icon,
} from '@gluestack-ui/themed';
import {Home, Search, User} from 'lucide-react-native';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeTab = () => (
  <Center flex={1} backgroundColor="#040b1c">
    <Text color="#dc3f72" fontSize={24}>Home</Text>
  </Center>
);

const SearchTab = () => (
  <Center flex={1} backgroundColor="#040b1c">
    <Text color="#dc3f72" fontSize={24}>Search</Text>
  </Center>
);

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#270a39',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#dc3f72',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Icon as={Home} color={color} size="lg" />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchTab}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color}) => (
            <Icon as={Search} color={color} size="lg" />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <Icon as={User} color={color} size="lg" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen; 
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Box, Text, Center, Icon, Pressable} from '@gluestack-ui/themed';
import {Home, Search, User, List} from 'lucide-react-native';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';
import ListsScreen from './ListsScreen';
import MainHomeScreen from './MainHomeScreen';

const Tab = createBottomTabNavigator();

const HomeTab = () => (
  <Center flex={1} backgroundColor="#040b1c">
    <Text color="#dc3f72" fontSize={24}>
      Home
    </Text>
  </Center>
);

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: '#270a39',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          paddingHorizontal: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        headerShown: false,
        tabBarItemStyle: {
          margin: 0,
          padding: 0,
          marginHorizontal: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarButton: props => {
          const selected = props.accessibilityState?.selected;
          return (
            <Pressable
              style={{
                flex: 1,
                minHeight: 50,
                marginHorizontal: 8,
              }}
              onPress={props.onPress}>
              <Box
                backgroundColor={selected ? '#dc3f72' : 'transparent'}
                borderRadius={15}
                style={{
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}>
                <Box
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {props.children}
                </Box>
              </Box>
            </Pressable>
          );
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        component={MainHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => <Icon as={Home} color={color} size="lg" />,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color}) => <Icon as={Search} color={color} size="lg" />,
        }}
      />
      <Tab.Screen
        name="ListsTab"
        component={ListsScreen}
        options={{
          tabBarLabel: 'Lists',
          tabBarIcon: ({color}) => <Icon as={List} color={color} size="lg" />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => <Icon as={User} color={color} size="lg" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

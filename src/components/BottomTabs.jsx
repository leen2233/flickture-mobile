import React, {useEffect} from 'react';
import {Box, Text, Icon, Pressable} from '@gluestack-ui/themed';
import {Home, Search, User, List, Compass, Rss} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';

const TabButton = ({icon: IconComponent, label, selected, onPress}) => (
  <Pressable
    style={{
      flex: 1,
      minHeight: 50,
      marginHorizontal: 8,
    }}
    borderRadius={15}
    onPress={onPress}>
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
        <Icon
          as={IconComponent}
          color={selected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'}
          size="lg"
        />
        <Text
          color={selected ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'}
          fontSize={12}
          marginTop={0}>
          {label}
        </Text>
      </Box>
    </Box>
  </Pressable>
);

const BottomTabs = ({currentRoute = ''}) => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log(currentRoute);
  }, [currentRoute]);

  const handleNavigation = screenName => {
    // Navigate to Home first (which contains the tab navigator)
    navigation.navigate('Home', {
      screen: screenName,
    });
  };

  return (
    <Box
      style={{
        backgroundColor: '#151527',
        borderWidth: 0.1,
        borderBottomWidth: 0,
        borderColor: 'white',
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
        flexDirection: 'row',
      }}>
      <TabButton
        icon={Compass}
        label="Discover"
        selected={currentRoute === 'DiscoverTab'}
        onPress={() => handleNavigation('DiscoverTab')}
      />
      <TabButton
        icon={Rss}
        label="Feed"
        selected={currentRoute === 'FeedTab'}
        onPress={() => handleNavigation('FeedTab')}
      />
      <TabButton
        icon={List}
        label="Lists"
        selected={currentRoute === 'ListsTab'}
        onPress={() => handleNavigation('ListsTab')}
      />
      <TabButton
        icon={User}
        label="Profile"
        selected={currentRoute === 'ProfileTab'}
        onPress={() => handleNavigation('ProfileTab')}
      />
    </Box>
  );
};

export default BottomTabs;

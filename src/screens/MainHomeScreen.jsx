import React from 'react';
import {
  Box,
  Text,
  HStack,
  Pressable,
  ScrollView,
  Icon,
} from '@gluestack-ui/themed';
import {Bell} from 'lucide-react-native';

const MainHomeScreen = () => {
  const notificationCount = 3; // This will be dynamic based on actual notifications

  return (
    <Box flex={1} backgroundColor="#040b1c">
      {/* Header */}
      <Box padding={16} paddingTop={24} backgroundColor="#270a39">
        <HStack space="md" alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Text
            color="#dc3f72"
            fontSize={24}
            fontWeight="600"
            fontFamily="heading">
            Flickture
          </Text>

          {/* Notifications */}
          <Pressable
            onPress={() => {
              /* Handle notification press */
            }}
            position="relative"
            padding={8}>
            <Icon as={Bell} size={24} color="rgba(255,255,255,0.9)" />
            {notificationCount > 0 && (
              <Box
                position="absolute"
                top={6}
                right={6}
                backgroundColor="#dc3f72"
                borderRadius={8}
                minWidth={14}
                height={14}
                justifyContent="center"
                alignItems="center"
                paddingHorizontal={2}>
                <Text color="white" fontSize={8} fontWeight="600">
                  {notificationCount}
                </Text>
              </Box>
            )}
          </Pressable>
        </HStack>
      </Box>

      {/* Main Content */}
      <ScrollView flex={1}>
        <Box padding={16}>{/* Content will be added here */}</Box>
      </ScrollView>
    </Box>
  );
};

export default MainHomeScreen;

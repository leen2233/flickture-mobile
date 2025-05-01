import React from 'react';
import {Box, HStack, VStack, Text, Image, Button} from '@gluestack-ui/themed';

const UserListItem = ({user, isFollowing, onToggleFollow}) => {
  return (
    <Box
      width="100%"
      backgroundColor="#151527"
      padding={16}
      marginBottom={8}
      borderRadius={12}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.1)">
      <HStack space="md" alignItems="center">
        <Image
          source={{uri: user.avatar}}
          alt={user.username}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />
        <VStack flex={1}>
          <Text color="white" fontSize={16} fontWeight="600">
            {user.firstName} {user.lastName}
          </Text>
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
            @{user.username}
          </Text>
        </VStack>
        <Button
          variant={isFollowing ? 'outline' : 'solid'}
          backgroundColor={isFollowing ? 'transparent' : '#dc3f72'}
          borderColor="#dc3f72"
          borderWidth={1}
          size="sm"
          onPress={() => onToggleFollow(user.id)}>
          <Text color="white" fontSize={14}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default UserListItem;

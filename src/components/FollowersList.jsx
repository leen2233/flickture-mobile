import React, {useState, useEffect} from 'react';
import {
  Modal,
  VStack,
  ScrollView,
  Text,
  Pressable,
  Image,
  HStack,
  Button,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import axiosClient from '../lib/api';
import {Users} from 'lucide-react-native';

const FollowersList = ({isVisible, onClose, title, type, username}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingState, setFollowingState] = useState(new Set());
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get(
          `/auth/user/${username}/${type}/`,
        );
        setUsers(response.data);
        setFollowingState(
          new Set(
            response.data.filter(u => u.is_following).map(u => u.username),
          ),
        );
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchUsers();
    }
  }, [isVisible, username, type]);

  const handleFollow = async userToFollow => {
    try {
      const response = await axiosClient.post(
        `/auth/user/${userToFollow}/follow/`,
      );
      if (response.data.status === 'followed') {
        setFollowingState(prev => new Set([...prev, userToFollow]));
      } else if (response.data.status === 'unfollowed') {
        setFollowingState(prev => {
          const newState = new Set(prev);
          newState.delete(userToFollow);
          return newState;
        });
      }
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  const handleUserPress = username => {
    onClose();
    navigation.navigate('PublicProfile', {username});
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="full">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <ScrollView>
              <VStack space="md" padding={16}>
                {users.map(user => (
                  <Pressable
                    key={user.username}
                    onPress={() => handleUserPress(user.username)}>
                    <HStack space="md" alignItems="center" marginBottom={16}>
                      <Image
                        source={{
                          uri:
                            user.avatar ||
                            'https://flickture.leen2233.me/default-avatar.png',
                        }}
                        alt={user.username}
                        width={50}
                        height={50}
                        borderRadius={25}
                      />
                      <VStack flex={1}>
                        <Text color="white" fontSize={16} fontWeight="600">
                          {user.full_name || user.username}
                        </Text>
                        <Text
                          color="rgba(255, 255, 255, 0.7)"
                          fontSize={14}
                          numberOfLines={1}>
                          @{user.username}
                        </Text>
                      </VStack>
                      <Button
                        onPress={() => handleFollow(user.username)}
                        variant={
                          followingState.has(user.username)
                            ? 'outline'
                            : 'solid'
                        }
                        borderColor="#dc3f72"
                        backgroundColor={
                          followingState.has(user.username)
                            ? 'transparent'
                            : '#dc3f72'
                        }>
                        <HStack space="sm" alignItems="center">
                          <Users size={16} color="#fff" />
                          <Text color="white">
                            {followingState.has(user.username)
                              ? 'Following'
                              : 'Follow'}
                          </Text>
                        </HStack>
                      </Button>
                    </HStack>
                  </Pressable>
                ))}
              </VStack>
            </ScrollView>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default FollowersList;

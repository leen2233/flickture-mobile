import React, {useMemo} from 'react';
import {Modal, View} from 'react-native';
import {
  Box,
  Text,
  Input,
  InputSlot,
  InputIcon,
  InputField,
  FlatList,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import {Search} from 'lucide-react-native';
import UserListItem from './UserListItem';

const UserListModal = ({data, title, isFollowing, onToggleFollow, onClose}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',
            maxHeight: '80%',
            backgroundColor: '#270a39',
            borderRadius: 16,
            padding: 24,
          }}>
          <Text
            color="white"
            fontSize={20}
            fontWeight="600"
            textAlign="center"
            marginBottom={16}>
            {title}
          </Text>

          <Box marginBottom={16}>
            <Input
              variant="outline"
              size="md"
              borderColor="rgba(255, 255, 255, 0.1)"
              backgroundColor="rgba(255, 255, 255, 0.05)">
              <InputSlot pl="$3">
                <InputIcon>
                  <Search size={20} color="rgba(255, 255, 255, 0.5)" />
                </InputIcon>
              </InputSlot>
              <InputField
                color="white"
                placeholder="Search users..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>

          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <UserListItem
                user={item}
                isFollowing={isFollowing.has(item.id)}
                onToggleFollow={onToggleFollow}
              />
            )}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            style={{
              flexGrow: 0,
            }}
          />
          <Button
            onPress={onClose}
            backgroundColor="#dc3f72"
            marginTop={16}
            paddingHorizontal={24}
            borderRadius={8}
            alignSelf="center">
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default UserListModal; 
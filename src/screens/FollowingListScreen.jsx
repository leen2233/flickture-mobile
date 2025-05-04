import React, {useEffect, useState, useMemo} from 'react';
import {View, FlatList} from 'react-native';
import {
  Box,
  Text,
  Input,
  InputSlot,
  InputIcon,
  InputField,
  HStack,
  Spinner,
} from '@gluestack-ui/themed';
import {Search, ArrowLeft, Film} from 'lucide-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import UserListItem from '../components/UserListItem';
import axiosClient from '../lib/api';

const FollowingListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {username, type} = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async (pageNum = 1, search = '') => {
    try {
      setIsLoading(true);
      const endpoint =
        type === 'followers'
          ? `/auth/user/${username}/followers/`
          : `/auth/user/${username}/following/`;

      const response = await axiosClient.get(endpoint, {
        params: {
          page: pageNum,
          search: search,
        },
      });

      console.log(`Fetched ${type} for ${username}:`, response.data);

      if (pageNum === 1) {
        setUsers(response.data.results);
      } else {
        setUsers(prev => [...prev, ...response.data.results]);
      }

      setTotalCount(response.data.count);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.log('response', error.response);
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers(1, searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchUsers(page + 1, searchQuery);
    }
  };

  const handleUserPress = username => {
    navigation.navigate('PublicUserProfile', {username});
  };

  const renderHeader = () => (
    <Box padding={16} backgroundColor="#040b1c">
      <HStack space="md" alignItems="center" marginBottom={16}>
        <ArrowLeft
          color="white"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text color="white" fontSize={20} fontWeight="600">
          {type === 'followers' ? 'Followers' : 'Following'}
        </Text>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
          ({totalCount})
        </Text>
      </HStack>

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
      {users.length === 0 && !isLoading && (
        <Box padding={16} marginTop={30} alignItems="center">
          <Film size={24} color="rgba(255, 255, 255, 0.5)" />
          <Text color="rgba(255, 255, 255, 0.5)" marginTop={8}>
            No {type === 'followers' ? 'followers' : 'following'} users found
          </Text>
        </Box>
      )}
    </Box>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <Box padding={16} alignItems="center">
        <Spinner size="small" color="#dc3f72" />
      </Box>
    );
  };

  const handleFollowUser = async username => {
    const endpoint = `/auth/user/${username}/follow/`;

    const response = await axiosClient.get(endpoint);
    if (response.data.status === 'unfollowed') {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.username === username ? {...user, is_following: false} : user,
        ),
      );
    } else if (response.data.status === 'followed') {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.username === username ? {...user, is_following: true} : user,
        ),
      );
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#040b1c'}}>
      <FlatList
        data={users}
        keyExtractor={item => item.username}
        renderItem={({item}) => (
          <UserListItem
            user={item}
            onPress={() => handleUserPress(item.username)}
            onToggleFollow={handleFollowUser}
          />
        )}
        contentContainerStyle={{flexGrow: 1}}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default FollowingListScreen;

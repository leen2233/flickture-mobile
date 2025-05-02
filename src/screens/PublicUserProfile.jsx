import React, {useEffect, useState} from 'react';
import {
  Box,
  Center,
  HStack,
  VStack,
  Text,
  Image,
  Pressable,
  ScrollView,
  Button,
} from '@gluestack-ui/themed';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  Heart,
  ChevronRight,
  Film,
  Clock,
  BookMarked,
  Users,
} from 'lucide-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosClient from '../lib/api';
import MovieStatsModal from './MovieWatchlistScreen';
import FollowersList from '../components/FollowersList';
import {useAuth} from '../context/AuthContext';

const StatBox = ({label, value, onPress}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{flex: 1}}>
    <View style={{alignItems: 'center'}}>
      <Text color="#dc3f72" fontSize={24} fontWeight="600">
        {value}
      </Text>
      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const EmptyState = ({icon: Icon, message}) => (
  <Box
    padding={24}
    backgroundColor="rgba(255, 255, 255, .05)"
    borderRadius={12}
    borderWidth={1}
    borderStyle="dashed"
    borderColor="rgba(255, 255, 255, 0.2)"
    alignItems="center"
    justifyContent="center"
    gap={10}>
    <Icon size={24} color="rgba(255, 255, 255, 0.7)" />
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={16} textAlign="center">
      {message}
    </Text>
  </Box>
);

const MovieList = ({
  title,
  movies = [],
  count = 0,
  type,
  icon: Icon,
  emptyMessage,
}) => {
  const navigation = useNavigation();

  if (!movies?.length) {
    return (
      <Box marginBottom={24}>
        <HStack
          justifyContent="space-between"
          gap={8}
          alignItems="center"
          marginBottom={12}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Icon size={20} color="#dc3f72" />
            <Text color="white" fontSize={18} fontWeight="600">
              {title}
            </Text>
          </View>
        </HStack>
        <EmptyState icon={Film} message={emptyMessage} />
      </Box>
    );
  }

  return (
    <Box marginBottom={24}>
      <HStack
        justifyContent="space-between"
        gap={8}
        alignItems="center"
        marginBottom={12}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Icon size={20} color="#dc3f72" />
          <Text color="white" fontSize={18} fontWeight="600">
            {title}
          </Text>
        </View>
        {count > 5 && (
          <Pressable onPress={() => navigation.navigate('MovieList', {type})}>
            <HStack space="sm" alignItems="center">
              <Text color="#dc3f72" fontSize={14}>
                See all {count}
              </Text>
              <ChevronRight color="#dc3f72" size={16} />
            </HStack>
          </Pressable>
        )}
      </HStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="md" paddingBottom={8} paddingLeft={10}>
          {movies.slice(0, 5).map(item => (
            <Pressable
              key={item.movie.tmdb_id}
              onPress={() =>
                navigation.navigate('MovieDetail', {
                  tmdbId: item.movie.tmdb_id,
                  type: item.movie.type,
                })
              }>
              <VStack space="sm" width={120}>
                <Box width={120} height={180}>
                  <Image
                    source={{
                      uri:
                        item.movie.poster_preview_url ||
                        'https://flickture.leen2233.me/default-movie.png',
                    }}
                    alt={item.movie.title}
                    width={120}
                    height={180}
                    borderRadius={12}
                  />
                  {item.movie.is_favorite && (
                    <Box
                      position="absolute"
                      top={8}
                      right={8}
                      backgroundColor="rgba(0,0,0,0.7)"
                      padding={4}
                      borderRadius={20}>
                      <Heart size={16} color="#dc3f72" fill="#dc3f72" />
                    </Box>
                  )}
                </Box>
                <Text
                  color="white"
                  fontSize={14}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.movie.title}
                </Text>
              </VStack>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

const PublicUserProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {username} = route.params;
  const {user: currentUser} = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWatchedModal, setShowWatchedModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosClient.get(`/auth/user/${username}/`);
        setUser(response.data);
        setIsFollowing(response.data.is_following);
        setFollowerCount(response.data.follower_count);
      } catch (error) {
        setError(
          error.response?.data?.message || 'Failed to load user profile',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleFollow = async () => {
    try {
      const response = await axiosClient.post(`/auth/user/${username}/follow/`);
      if (response.data.status === 'followed') {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      } else if (response.data.status === 'unfollowed') {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  if (isLoading) {
    return (
      <Center flex={1} backgroundColor="#040b1c">
        <Text color="white">Loading profile...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center flex={1} backgroundColor="#040b1c">
        <Text color="white">{error}</Text>
      </Center>
    );
  }

  if (!user) {
    return (
      <Center flex={1} backgroundColor="#040b1c">
        <Text color="white">User not found</Text>
      </Center>
    );
  }

  const handleStatPress = type => {
    navigation.navigate('FollowingList', {
      username: user.username,
      type: type.toLowerCase(),
    });
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      <Box>
        <Box>
          <Image
            source={{
              uri:
                user.banner_image ||
                'https://flickture.leen2233.me/default-banner.png',
            }}
            alt="Profile Banner"
            width="100%"
            height={240}
          />
          {currentUser && currentUser.username !== user.username && (
            <HStack
              position="absolute"
              top={16}
              right={16}
              space="sm"
              backgroundColor="rgba(4, 11, 28, 0.6)"
              padding={8}
              borderRadius={12}>
              <Button
                onPress={handleFollow}
                variant={isFollowing ? 'outline' : 'solid'}
                borderColor="#dc3f72"
                backgroundColor={isFollowing ? 'transparent' : '#dc3f72'}>
                <HStack space="sm" alignItems="center">
                  <Users size={16} color="#fff" />
                  <Text color="white">
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </HStack>
              </Button>
            </HStack>
          )}
          <Box
            position="absolute"
            bottom={-50}
            left="50%"
            style={{transform: [{translateX: -50}]}}>
            <Image
              source={{
                uri:
                  user.avatar ||
                  'https://flickture.leen2233.me/default-avatar.png',
              }}
              alt="Profile"
              width={100}
              height={100}
              borderRadius={50}
              borderWidth={4}
              borderColor="#040b1c"
            />
          </Box>
        </Box>

        <Box
          padding={16}
          backgroundColor="#040b1c"
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: -20,
          }}>
          <Center marginTop={-60} marginBottom={12}>
            <Image
              source={{
                uri: user.avatar
                  ? user.avatar
                  : 'https://flickture.leen2233.me/default-avatar.png',
              }}
              alt="Profile Picture"
              width={100}
              height={100}
              borderRadius={50}
              borderWidth={4}
              borderColor="#040b1c"
              marginBottom={0}
            />
            <VStack space="xs" alignItems="center">
              <Text color="white" fontSize={24} fontWeight="600">
                {user.full_name}
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                @{user.username}
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                {user.about}
              </Text>
            </VStack>
          </Center>

          <Box
            backgroundColor="#151527"
            borderRadius={12}
            padding={12}
            marginBottom={24}>
            <HStack justifyContent="space-between">
              <StatBox
                label="Movies"
                value={user.movies_watched}
                onPress={() => setShowWatchedModal(true)}
              />
              <StatBox
                label="Following"
                value={user.following_count}
                onPress={() => handleStatPress('Following')}
              />
              <StatBox
                label="Followers"
                value={followerCount}
                onPress={() => handleStatPress('Followers')}
              />
            </HStack>
          </Box>

          <MovieList
            title="Recently Watched"
            movies={user.recently_watched}
            count={user.movies_watched}
            type="recently-watched"
            icon={Clock}
            emptyMessage="No movies watched yet"
          />
          <MovieList
            title="Want to Watch"
            movies={user.watchlist}
            count={user.watchlist?.length}
            type="want-to-watch"
            icon={BookMarked}
            emptyMessage="Watchlist is empty"
          />
          <MovieList
            title="Favorites"
            movies={user.favorites}
            count={user.favorites?.length}
            type="favorites"
            icon={Heart}
            emptyMessage="No favorite movies yet"
          />
        </Box>
      </Box>
    </ScrollView>
  );
};

export default PublicUserProfile;

const styles = StyleSheet.create({
  hiddenImage: {
    opacity: 0,
  },
});

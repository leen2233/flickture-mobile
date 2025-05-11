import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  HStack,
  ScrollView,
  Image,
  VStack,
  Button,
  Pressable,
  Center,
} from '@gluestack-ui/themed';
import {
  Heart,
  MessageCircle,
  Film,
  ListPlus,
  Users,
  Globe,
  Loader,
  UserPlus,
  Sparkles,
  Clock,
  Play,
} from 'lucide-react-native';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';
import {useAuth} from '../context/AuthContext';
import ImagePlaceholder from '../components/ImagePlaceholder';
import BottomTabs from '../components/BottomTabs';

const formatTimestamp = timestamp => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const MoviePreview = ({movie, type = 'movie', onPress}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Pressable onPress={onPress}>
      <Box
        backgroundColor="#040b1c"
        borderRadius={12}
        padding={12}
        marginBottom={12}
        borderWidth={1}
        borderColor="rgba(255, 255, 255, 0.1)">
        <HStack space="md">
          <Box width={80} height={120}>
            {!isImageLoaded && <ImagePlaceholder width={80} height={120} />}
            <Image
              source={{uri: movie.poster}}
              alt={movie.title}
              width={80}
              height={120}
              borderRadius={8}
              onLoad={() => setIsImageLoaded(true)}
              style={[!isImageLoaded && styles.hiddenImage]}
            />
          </Box>
          <VStack flex={1} space="xs">
            <Text color="white" fontSize={16} fontWeight="600">
              {movie.title}
            </Text>
            <HStack space="xs" alignItems="center">
              <Clock size={14} color="rgba(255, 255, 255, 0.5)" />
              <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                {movie.year}
              </Text>
              {movie.runtime && (
                <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                  • {movie.runtime}m
                </Text>
              )}
            </HStack>
            {movie.genres && (
              <HStack flexWrap="wrap" gap={4} mt={4}>
                {movie.genres.slice(0, 3).map((genre, index) => (
                  <Box
                    key={index}
                    backgroundColor="rgba(220, 63, 114, 0.1)"
                    borderRadius={4}
                    paddingHorizontal={6}
                    paddingVertical={2}>
                    <Text color="#dc3f72" fontSize={10}>
                      {genre}
                    </Text>
                  </Box>
                ))}
              </HStack>
            )}
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};

const ActivityCard = ({activity, onMoviePress}) => {
  const [isUserImageLoaded, setIsUserImageLoaded] = useState(false);
  const navigation = useNavigation();

  const renderActivityIndicator = () => {
    switch (activity.type) {
      case 'like':
        return (
          <HStack space="xs" alignItems="center">
            <Heart size={14} color="#dc3f72" fill="#dc3f72" />
            <Text fontSize={12} style={styles.likedIndicator}>
              Liked
            </Text>
          </HStack>
        );
      case 'watch':
        return (
          <HStack space="xs" alignItems="center">
            <Film size={14} color="#4CAF50" />
            <Text
              color="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              style={styles.watchedIndicator}>
              Watched
            </Text>
          </HStack>
        );
      case 'comment':
        return (
          <HStack space="xs" alignItems="center">
            <MessageCircle size={14} color="#2196F3" />
            <Text fontSize={12} style={styles.commentedIndicator}>
              Commented
            </Text>
          </HStack>
        );
      case 'list_create':
        return (
          <HStack space="xs" alignItems="center">
            <ListPlus size={14} color="#ff9800" />
            <Text fontSize={12} style={styles.listCreatedIndicator}>
              Created List
            </Text>
          </HStack>
        );
      case 'new_movie':
        return (
          <HStack space="xs" alignItems="center">
            <Sparkles size={14} color="#FFC107" />
            <Text
              color="rgba(255, 255, 255, 0.7)"
              fontSize={12}
              style={styles.newMovieIndicator}>
              New Movie
            </Text>
          </HStack>
        );
      case 'new_episode':
        return (
          <HStack space="xs" alignItems="center">
            <Play size={14} color="#9c27b0" />
            <Text color="#9c27b0" fontSize={12}>
              New Episode
            </Text>
          </HStack>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      backgroundColor="rgba(255, 255, 255, 0.05)"
      borderRadius={12}
      padding={12}
      marginBottom={12}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.1)">
      <VStack space="md">
        <HStack space="sm" alignItems="center" justifyContent="space-between">
          <Pressable
            onPress={() =>
              navigation.navigate('PublicProfile', {
                username: activity.user.username,
              })
            }>
            <HStack space="sm" alignItems="center" flex={1}>
              {activity.user && activity.user.avatar && (
                <Box width={32} height={32}>
                  {!isUserImageLoaded && (
                    <ImagePlaceholder width={32} height={32} />
                  )}

                  <Image
                    source={{uri: activity.user.avatar}}
                    alt={activity.user.name}
                    width={32}
                    height={32}
                    borderRadius={16}
                    onLoad={() => setIsUserImageLoaded(true)}
                    style={[!isUserImageLoaded && styles.hiddenImage]}
                  />
                </Box>
              )}
              {activity.user && activity.user.name && (
                <Text color="white" fontSize={14} fontWeight="600">
                  {activity.user.name}
                </Text>
              )}

              <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                {formatTimestamp(activity.timestamp)}
              </Text>
            </HStack>
          </Pressable>
          {renderActivityIndicator()}
        </HStack>

        {activity.type === 'comment' && (
          <Box
            backgroundColor="#040b1c"
            borderRadius={8}
            padding={12}
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.1)">
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
              {activity.comment}
            </Text>
          </Box>
        )}

        {(activity.type === 'like' ||
          activity.type === 'watch' ||
          activity.type === 'comment' ||
          activity.type === 'new_movie') && (
          <MoviePreview
            movie={activity.movie}
            onPress={() => onMoviePress(activity.movie)}
          />
        )}

        {activity.type === 'new_episode' && (
          <MoviePreview
            movie={activity.show}
            onPress={() => onMoviePress(activity.show)}
          />
        )}

        {activity.type === 'list_create' && (
          <Pressable
            onPress={() =>
              navigation.navigate('ListDetails', {
                listId: activity.list.id,
                listName: activity.list.title,
              })
            }>
            <Box
              backgroundColor="rgba(255, 255, 255, 0.05)"
              borderRadius={12}
              padding={12}>
              <HStack space="md" alignItems="center">
                <Image
                  source={{uri: activity.list.thumbnail}}
                  alt={activity.list.title}
                  width={60}
                  height={90}
                  borderRadius={8}
                />
                <VStack flex={1} space="xs">
                  <Text color="white" fontSize={16} fontWeight="600">
                    {activity.list.title}
                  </Text>
                  <Text
                    color="rgba(255, 255, 255, 0.5)"
                    fontSize={12}
                    numberOfLines={2}>
                    {activity.list.description}
                  </Text>
                  <HStack space="xs" alignItems="center">
                    <Film size={14} color="rgba(255, 255, 255, 0.5)" />
                    <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                      {activity.list.movie_count} movies
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          </Pressable>
        )}
      </VStack>
    </Box>
  );
};

const EmptyFeedMessage = ({isFollowing}) => (
  <Center flex={1} padding={16}>
    {isFollowing ? (
      <VStack space="md" alignItems="center">
        <UserPlus size={48} color="rgba(255, 255, 255, 0.3)" />
        <Text color="white" fontSize={18} fontWeight="600" textAlign="center">
          No Activity Yet
        </Text>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={14} textAlign="center">
          Start following other users and TV shows to see their activity here!
        </Text>
      </VStack>
    ) : (
      <VStack space="md" alignItems="center">
        <Globe size={48} color="rgba(255, 255, 255, 0.3)" />
        <Text color="white" fontSize={18} fontWeight="600" textAlign="center">
          Welcome to Flickture!
        </Text>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={14} textAlign="center">
          This is where you'll see activity from all users. Follow people to
          customize your feed!
        </Text>
      </VStack>
    )}
  </Center>
);

const MainHomeScreen = () => {
  const [activeTab, setActiveTab] = useState('following');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {user, fetchUser} = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      try {
        const userFetched = await fetchUser();
        if (!userFetched) {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigation.replace('Login', {
            message: 'Login expired, please login again',
          });
        } else {
          navigation.replace('Login');
        }
      }
    };

    checkAuth();
  }, []);

  const fetchActivities = async (pageNum = 1) => {
    if (loading || (!hasMore && pageNum > 1)) return;

    setLoading(true);
    try {
      const endpoint =
        activeTab === 'following' ? '/feed/?following=true' : '/feed/';
      const response = await api.get(endpoint, {
        params: {
          page: pageNum,
        },
      });

      if (pageNum === 1) {
        setActivities(response.data.results);
      } else {
        setActivities(prev => [...prev, ...response.data.results]);
      }

      setHasMore(!!response.data.next);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActivities([]);
    setPage(1);
    setHasMore(true);
    fetchActivities(1);
  }, [activeTab]);

  const handleMoviePress = movie => {
    console.log('Movie pressed:', movie, movie.tmdb_id, movie.type);
    navigation.navigate('MovieDetail', {
      tmdbId: movie.tmdb_id,
      type: movie.type || 'movie',
    });
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchActivities(page + 1);
    }
  };

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <Box padding={16} alignItems="center">
        <ActivityIndicator color="#dc3f72" />
      </Box>
    );
  };

  return (
    <Box flex={1} backgroundColor="#040b1c">
      {/* Header */}
      <Box
        padding={0}
        paddingTop={Platform.OS === 'ios' ? 20 : 15}
        backgroundColor="#151527"
        borderBottomStartRadius={22}
        borderBottomEndRadius={22}>
        <Box alignItems="center" marginBottom={16}>
          <Image
            source={require('../assets/logo-landscape.png')}
            alt="Flickture Logo"
            width={120}
            height={50}
            resizeMode="contain"
          />
        </Box>
      </Box>

      {/* Feed Content */}
      <ScrollView
        flex={1}
        contentContainerStyle={styles.feedContent}
        onScroll={({nativeEvent}) => {
          const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={16}>
        <HStack space="sm" padding={16}>
          <Pressable
            flex={1}
            onPress={() => setActiveTab('following')}
            backgroundColor={
              activeTab === 'following' ? '#dc3f72' : 'transparent'
            }
            borderWidth={1}
            borderColor="#dc3f72"
            borderRadius={20}
            padding={8}
            alignItems="center">
            <HStack space="xs" alignItems="center">
              <Users size={18} color="white" />
              <Text color="white" fontSize={14}>
                Following
              </Text>
            </HStack>
          </Pressable>

          <Pressable
            flex={1}
            onPress={() => setActiveTab('global')}
            backgroundColor={activeTab === 'global' ? '#dc3f72' : 'transparent'}
            borderWidth={1}
            borderColor="#dc3f72"
            borderRadius={20}
            padding={8}
            alignItems="center">
            <HStack space="xs" alignItems="center">
              <Globe size={18} color="white" />
              <Text color="white" fontSize={14}>
                Global
              </Text>
            </HStack>
          </Pressable>
        </HStack>
        {activities.length > 0 ? (
          <VStack padding={16} space="md">
            {activities.map((activity, index) => (
              <ActivityCard
                key={`${activity.id}-${index}`}
                activity={activity}
                onMoviePress={handleMoviePress}
              />
            ))}
            {renderFooter()}
          </VStack>
        ) : loading ? (
          <Center flex={1} padding={16}>
            <ActivityIndicator color="#dc3f72" />
          </Center>
        ) : (
          <EmptyFeedMessage isFollowing={activeTab === 'following'} />
        )}
      </ScrollView>
      <BottomTabs currentRoute="FeedTab" />
    </Box>
  );
};

const styles = StyleSheet.create({
  feedContent: {
    flexGrow: 1,
  },
  hiddenImage: {
    opacity: 0,
  },
  likedIndicator: {
    color: '#ff4b6e',
  },
  watchedIndicator: {
    color: '#4caf50',
  },
  commentedIndicator: {
    color: '#2196f3',
  },
  newEpisodeIndicator: {
    color: '#9c27b0',
  },
  listCreatedIndicator: {
    color: '#ff9800',
  },
  newMovieIndicator: {
    color: '#ffd700',
  },
});

export default MainHomeScreen;

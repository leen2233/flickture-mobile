import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Box,
  HStack,
  VStack,
  Pressable,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import {
  X,
  BookmarkPlus,
  Heart,
  Plus,
  Search,
  ArrowLeft,
} from 'lucide-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosClient from '../lib/api';

const formatTimeAgo = date => {
  const now = new Date();
  const past = new Date(date);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = now - past;

  if (elapsed < msPerMinute) {
    const seconds = Math.floor(elapsed / 1000);
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  } else if (elapsed < msPerHour) {
    const minutes = Math.floor(elapsed / msPerMinute);
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (elapsed < msPerMonth) {
    const days = Math.floor(elapsed / msPerDay);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (elapsed < msPerYear) {
    const months = Math.floor(elapsed / msPerMonth);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(elapsed / msPerYear);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
};

const FilterButton = ({label, isActive, onPress, icon}) => (
  <Pressable
    onPress={onPress}
    flexDirection="row"
    alignItems="center"
    gap={4}
    backgroundColor={isActive ? '#dc3f72' : 'rgba(255, 255, 255, 0.1)'}
    paddingHorizontal={12}
    paddingVertical={8}
    borderRadius={8}>
    {icon}
    <Text color="white" fontSize={14}>
      {label}
    </Text>
  </Pressable>
);

const MovieWatchlistScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {username} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [favoriteFilter, setFavoriteFilter] = useState('all');

  const fetchMovies = async (pageNum = 1, search = '') => {
    try {
      setIsLoading(true);
      const params = {
        page: pageNum,
        search: search,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (favoriteFilter !== 'all') {
        params.is_favorite = favoriteFilter === 'favorite';
      }

      const response = await axiosClient.get(
        `/auth/user/${username}/watchlist/`,
        {
          params,
        },
      );

      if (pageNum === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }

      setTotalCount(response.data.count);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
    fetchMovies(1, debouncedSearchQuery);
  }, [debouncedSearchQuery, statusFilter, favoriteFilter]);

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchMovies(page + 1, debouncedSearchQuery);
    }
  }, [isLoading, hasMore, page, debouncedSearchQuery]);

  const handleMoviePress = movie => {
    navigation.navigate('MovieDetail', {
      tmdbId: movie.tmdb_id,
      type: movie.type,
    });
  };

  const handleWatchlistToggle = async (e, movie) => {
    e.stopPropagation();
    try {
      if (!movie.status) {
        await axiosClient.post('/watchlist/', {
          tmdb_id: movie.tmdb_id,
          type: movie.type,
          status: 'watchlist',
        });
        setMovies(prev =>
          prev.map(item =>
            item.movie.tmdb_id === movie.tmdb_id
              ? {...item, status: 'watchlist'}
              : item,
          ),
        );
      } else {
        await axiosClient.delete(`/watchlist/${movie.type}/${movie.tmdb_id}/`);
        setMovies(prev =>
          prev.map(item =>
            item.movie.tmdb_id === movie.tmdb_id
              ? {...item, status: null}
              : item,
          ),
        );
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const handleWatchedToggle = async (e, watchlist) => {
    e.stopPropagation();
    try {
      await axiosClient.patch(
        `/watchlist/${watchlist.movie.type}/${watchlist.movie.tmdb_id}/`,
        {
          status: 'watched',
        },
      );
      setMovies(prev =>
        prev.map(item =>
          item.movie.tmdb_id === watchlist.movie.tmdb_id
            ? {...item, status: 'watched'}
            : item,
        ),
      );
    } catch (error) {
      console.error('Failed to mark as watched:', error);
    }
  };

  const handleFavoriteToggle = async (e, movie) => {
    e.stopPropagation();
    try {
      if (!movie.is_favorite) {
        await axiosClient.post('/favorites/', {
          type: movie.type,
          tmdb_id: movie.tmdb_id,
        });
        setMovies(prev =>
          prev.map(item =>
            item.movie.tmdb_id === movie.tmdb_id &&
            item.movie.type === movie.type
              ? {...item, movie: {...item.movie, is_favorite: true}}
              : item,
          ),
        );
      } else {
        await axiosClient.delete(`/favorites/${movie.type}/${movie.tmdb_id}/`);
        setMovies(prev =>
          prev.map(item =>
            item.movie.tmdb_id === movie.tmdb_id &&
            item.movie.type === movie.type
              ? {...item, movie: {...item.movie, is_favorite: false}}
              : item,
          ),
        );
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
        borderBottomWidth={1}
        borderBottomColor="rgba(255, 255, 255, 0.1)">
        <HStack alignItems="center" space="sm">
          <ArrowLeft
            color="white"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text color="white" fontSize={24} fontWeight="600">
            Movies
          </Text>
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
            {totalCount} {totalCount === 1 ? 'movie' : 'movies'}
          </Text>
        </HStack>
      </Box>

      <Box padding={16}>
        <Box
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderRadius={8}
          flexDirection="row"
          height={40}
          alignItems="center"
          paddingHorizontal={12}>
          <Search color="rgba(255, 255, 255, 0.5)" size={20} />
          <Input
            flex={1}
            backgroundColor="transparent"
            borderWidth={0}
            height="auto">
            <InputField
              color="white"
              placeholder={`Search in watchlist`}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </Box>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          space="sm"
          marginTop={12}>
          <HStack space="sm">
            <FilterButton
              label="All"
              isActive={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
            />
            <FilterButton
              label="Watched"
              isActive={statusFilter === 'watched'}
              onPress={() => setStatusFilter('watched')}
            />
            <FilterButton
              label="Watchlist"
              isActive={statusFilter === 'watchlist'}
              onPress={() => setStatusFilter('watchlist')}
            />
          </HStack>

          <FilterButton
            label="Favorites"
            isActive={favoriteFilter === 'favorite'}
            onPress={() =>
              setFavoriteFilter(
                favoriteFilter === 'favorite' ? 'all' : 'favorite',
              )
            }
            icon={
              <Heart
                size={16}
                color="white"
                fill={favoriteFilter === 'favorite' ? 'white' : 'none'}
              />
            }
          />
        </HStack>
      </Box>

      <ScrollView
        style={styles.movieList}
        onScroll={({nativeEvent}) => {
          const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20
          ) {
            handleEndReached();
          }
        }}
        scrollEventThrottle={400}>
        {movies.map(item => (
          <Pressable
            key={item.id}
            onPress={() => handleMoviePress(item.movie)}
            padding={12}
            flexDirection="row"
            gap={12}
            alignItems="center"
            backgroundColor="transparent"
            borderRadius={12}
            _pressed={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}>
            <Image
              source={{
                uri: item.movie.poster_preview_url || '/default-movie.png',
              }}
              style={styles.movieThumbnail}
            />
            <VStack flex={1} space="xs">
              <HStack alignItems="center" gap={10}>
                <Text color="white" fontSize={16}>
                  {item.movie.title.length > 21
                    ? `${item.movie.title.substring(0, 21)}...`
                    : item.movie.title}
                </Text>
                <Box
                  backgroundColor="rgba(255, 255, 255, 0.1)"
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={4}>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                    {item.movie.type}
                  </Text>
                </Box>
              </HStack>
              <HStack space="md" alignItems="center">
                {item.movie.year && (
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                    {item.movie.year}
                  </Text>
                )}
                {item.movie.rating && (
                  <Text color="#ffd700" fontSize={14}>
                    ★ {item.movie.rating.toFixed(1)}
                  </Text>
                )}
              </HStack>
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                {formatTimeAgo(item.updated_at)}
              </Text>
            </VStack>
            <HStack space="sm">
              {item.status === 'watched' ? (
                <TouchableOpacity
                  onPress={e => handleWatchedToggle(e, item)}
                  style={[styles.actionButton, styles.activeButton]}>
                  <BookmarkPlus color="#dc3f72" size={18} />
                </TouchableOpacity>
              ) : item.status === 'watchlist' ? (
                <TouchableOpacity
                  onPress={e => handleWatchedToggle(e, item)}
                  style={styles.actionButton}>
                  <BookmarkPlus color="rgba(255, 255, 255, 0.7)" size={18} />
                </TouchableOpacity>
              ) : (
                !item.status && (
                  <TouchableOpacity
                    onPress={e => handleWatchlistToggle(e, item)}
                    style={styles.actionButton}>
                    <Plus color="rgba(255, 255, 255, 0.7)" size={18} />
                  </TouchableOpacity>
                )
              )}
              <TouchableOpacity
                onPress={e => handleFavoriteToggle(e, item.movie)}
                style={[
                  styles.actionButton,
                  item.movie.is_favorite && styles.activeButton,
                ]}>
                <Heart
                  size={18}
                  color={
                    item.movie.is_favorite
                      ? '#dc3f72'
                      : 'rgba(255, 255, 255, 0.7)'
                  }
                  fill={item.movie.is_favorite ? '#dc3f72' : 'none'}
                />
              </TouchableOpacity>
            </HStack>
          </Pressable>
        ))}
        {isLoading && (
          <Box padding={16} alignItems="center">
            <ActivityIndicator color="#dc3f72" />
          </Box>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040b1c',
  },
  filterContainer: {
    marginTop: 12,
  },
  movieList: {
    flex: 1,
  },
  movieThumbnail: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: 'rgba(220, 63, 114, 0.1)',
  },
});

export default MovieWatchlistScreen;

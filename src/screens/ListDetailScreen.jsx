import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Image,
  Pressable,
  ScrollView,
  Button,
  ButtonText,
  ButtonIcon,
} from '@gluestack-ui/themed';
import {
  Heart,
  Share2,
  ArrowLeft,
  Plus,
  Check,
  Clock,
  Star,
} from 'lucide-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  StyleSheet,
  Share,
  ActivityIndicator,
} from 'react-native';
import sampleData from '../data/sample.json';

const TouchableItem = ({onPress, children, style}) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          'rgba(220, 63, 114, 0.2)',
          false,
        )}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }
  return (
    <TouchableHighlight
      onPress={onPress}
      style={style}
      underlayColor="rgba(220, 63, 114, 0.1)">
      {children}
    </TouchableHighlight>
  );
};

const MovieListItem = ({movie, onPress}) => {
  // Randomly assign statuses for demo purposes
  const statuses = ['none', 'watchlist', 'watched'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const isInFavorites = Math.random() > 0.5;

  const getStatusButton = () => {
    switch (status) {
      case 'watched':
        return (
          <TouchableItem
            style={[styles.statusButton, styles.watchedButton]}
            onPress={() => console.log('Already watched')}>
            <HStack space="sm" alignItems="center" padding={8}>
              <Check size={16} color="#4CAF50" />
              <Text color="#4CAF50" fontSize={12}>
                Watched
              </Text>
            </HStack>
          </TouchableItem>
        );
      case 'watchlist':
        return (
          <TouchableItem
            style={[styles.statusButton, styles.watchlistButton]}
            onPress={() => console.log('Mark as watched')}>
            <HStack space="sm" alignItems="center" padding={8}>
              <Clock size={16} color="#ff9800" />
              <Text color="#ff9800" fontSize={12}>
                Watch Next
              </Text>
            </HStack>
          </TouchableItem>
        );
      default:
        return (
          <TouchableItem
            style={[styles.statusButton, styles.addButton]}
            onPress={() => console.log('Add to watchlist')}>
            <HStack space="sm" alignItems="center" padding={8}>
              <Plus size={16} color="#dc3f72" />
              <Text color="#dc3f72" fontSize={12}>
                Add to Watchlist
              </Text>
            </HStack>
          </TouchableItem>
        );
    }
  };

  return (
    <Box
      backgroundColor="#270a39"
      borderRadius={16}
      marginBottom={16}
      overflow="hidden">
      <Pressable
        onPress={onPress}
        style={({pressed}) => [
          {
            transform: [{scale: pressed ? 0.98 : 1}],
            opacity: pressed ? 0.9 : 1,
          },
        ]}>
        <HStack space="md" padding={12}>
          <Image
            source={{uri: movie.poster}}
            alt={movie.title}
            width={100}
            height={150}
            borderRadius={12}
          />
          <VStack flex={1} space="xs" justifyContent="space-between">
            <VStack space="xs">
              <Text color="white" fontSize={18} fontWeight="600">
                {movie.title}
              </Text>
              <HStack space="sm" alignItems="center" flexWrap="wrap">
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  {movie.year}
                </Text>
                {movie.duration && (
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                    • {movie.duration}
                  </Text>
                )}
              </HStack>
              <HStack space="md" alignItems="center" marginTop={4}>
                {movie.rating && (
                  <HStack space="xs" alignItems="center">
                    <Star size={16} color="#dc3f72" fill="#dc3f72" />
                    <Text color="white" fontSize={14} fontWeight="600">
                      {movie.rating}
                    </Text>
                  </HStack>
                )}
                {isInFavorites && (
                  <HStack
                    space="xs"
                    alignItems="center"
                    backgroundColor="rgba(220, 63, 114, 0.1)"
                    paddingHorizontal={8}
                    paddingVertical={4}
                    borderRadius={12}>
                    <Heart size={14} color="#dc3f72" fill="#dc3f72" />
                    <Text color="#dc3f72" fontSize={12}>
                      Favorite
                    </Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
            {getStatusButton()}
          </VStack>
        </HStack>
      </Pressable>
    </Box>
  );
};

const ListDetailSkeleton = () => (
  <Box flex={1} backgroundColor="#040b1c">
    {/* Backdrop Skeleton */}
    <Box height={250} width="100%" backgroundColor="#270a39" />

    {/* Content */}
    <Box padding={16} marginTop={-40}>
      {/* Thumbnail and Info Skeleton */}
      <HStack space="md" marginBottom={24}>
        <Box
          width={120}
          height={180}
          borderRadius={12}
          backgroundColor="#270a39"
        />
        <VStack flex={1} space="xs">
          {/* Title Skeleton */}
          <Box
            width="80%"
            height={24}
            borderRadius={8}
            backgroundColor="#270a39"
          />

          {/* Description Skeleton */}
          <Box
            width="100%"
            height={48}
            borderRadius={8}
            backgroundColor="#270a39"
            marginTop={4}
          />

          {/* Metadata Skeleton */}
          <HStack space="sm" marginTop={8}>
            {[1, 2, 3].map(i => (
              <Box
                key={i}
                width={60}
                height={20}
                borderRadius={16}
                backgroundColor="#270a39"
              />
            ))}
          </HStack>
        </VStack>
      </HStack>

      {/* Like Button Skeleton */}
      <Box height={44} borderRadius={12} backgroundColor="#270a39" />

      {/* Movies List Skeleton */}
      <Box marginTop={24}>
        <Box
          width={100}
          height={24}
          borderRadius={8}
          backgroundColor="#270a39"
          marginBottom={16}
        />
        {[1, 2, 3].map(i => (
          <Box
            key={i}
            height={174}
            backgroundColor="#270a39"
            borderRadius={16}
            marginBottom={16}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

const ListDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {listId} = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find the list from sample data
        const foundList = [
          ...sampleData.user.lists,
          ...sampleData.featured.trending,
          ...sampleData.featured.staffPicks,
          ...sampleData.community.popular,
          ...sampleData.community.recent,
        ].find(l => l.id === listId);

        // Get sample movies
        const listMovies = sampleData.movies.recentlyWatched;

        setList(foundList);
        setMovies(listMovies);
      } catch (error) {
        console.error('Error loading list details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [listId]);

  const handleMoviePress = movieId => {
    navigation.navigate('MovieDetail', {movieId});
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  if (isLoading || !list) {
    return <ListDetailSkeleton />;
  }

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <ScrollView flex={1}>
        {/* Backdrop Image */}
        <Box height={250} width="100%">
          <Image
            source={{uri: list.thumbnail}}
            alt={list.name}
            style={styles.backdropImage}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(4, 11, 28, 0.5)"
          />
          <HStack
            position="absolute"
            top={Platform.OS === 'ios' ? 60 : 20}
            left={16}
            right={16}
            justifyContent="space-between">
            <Button variant="link" onPress={() => navigation.goBack()}>
              <ButtonIcon as={ArrowLeft} color="white" />
            </Button>
            <Button
              variant="link"
              onPress={() => {
                Share.share({
                  message: `Check out "${list.name}" on Flickture!`,
                  url: `https://flickture.com/lists/${list.id}`,
                });
              }}>
              <ButtonIcon as={Share2} color="white" />
            </Button>
          </HStack>
        </Box>

        {/* Content */}
        <Box padding={16} marginTop={-40}>
          {/* Thumbnail and Info */}
          <HStack space="md" marginBottom={24}>
            <Image
              source={{uri: list.thumbnail}}
              alt={list.name}
              width={120}
              height={180}
              borderRadius={12}
            />
            <VStack flex={1} space="xs">
              <Text color="white" fontSize={24} fontWeight="600">
                {list.name}
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                {list.description}
              </Text>
              <HStack space="sm" flexWrap="wrap" marginTop={8}>
                <HStack space="xs" alignItems="center">
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                    {list.moviesCount} movies
                  </Text>
                </HStack>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  •
                </Text>
                <HStack space="xs" alignItems="center">
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                    by {list.creator}
                  </Text>
                </HStack>
                {list.likes && (
                  <>
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                      •
                    </Text>
                    <HStack space="xs" alignItems="center">
                      <Heart size={14} color="#dc3f72" fill="#dc3f72" />
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                        {list.likes.toLocaleString()}
                      </Text>
                    </HStack>
                  </>
                )}
              </HStack>
            </VStack>
          </HStack>

          {/* Like Button */}
          <TouchableItem
            style={[
              styles.actionButton,
              styles.secondaryButton,
              isLiked && styles.activeButton,
            ]}
            onPress={handleLikeToggle}>
            <HStack space="sm" alignItems="center" padding={12}>
              <Heart
                size={20}
                fill={isLiked ? 'white' : 'none'}
                color={isLiked ? 'white' : '#dc3f72'}
              />
              <Text color={isLiked ? 'white' : '#dc3f72'}>
                {isLiked ? 'Liked' : 'Like'}
              </Text>
            </HStack>
          </TouchableItem>

          {/* Movies List */}
          <Text
            color="white"
            fontSize={20}
            fontWeight="600"
            marginTop={24}
            marginBottom={16}>
            Movies
          </Text>
          <VStack>
            {movies.map(movie => (
              <MovieListItem
                key={movie.id}
                movie={movie}
                onPress={() => handleMoviePress(movie.id)}
              />
            ))}
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  backdropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc3f72',
    overflow: 'hidden',
  },
  secondaryButton: {
    borderColor: '#dc3f72',
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#dc3f72',
    borderColor: '#dc3f72',
  },
  statusButton: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  watchedButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
  },
  watchlistButton: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: '#ff9800',
  },
  addButton: {
    backgroundColor: 'rgba(220, 63, 114, 0.1)',
    borderColor: '#dc3f72',
  },
  skeletonContainer: {
    flex: 1,
    backgroundColor: '#040b1c',
    padding: 16,
  },
  skeletonItem: {
    backgroundColor: '#270a39',
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default ListDetailScreen;

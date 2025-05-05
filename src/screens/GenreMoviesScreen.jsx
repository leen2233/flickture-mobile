import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {
  Box,
  Text,
  ScrollView,
  Pressable,
  Image,
  HStack,
  VStack,
  Icon,
} from '@gluestack-ui/themed';
import {ArrowLeft, Star, Heart, Film, Loader} from 'lucide-react-native';
import ImagePlaceholder from '../components/ImagePlaceholder';
import api from '../lib/api';

const MovieItem = ({movie, navigation}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('MovieDetail', {
          tmdbId: movie.tmdb_id,
          type: movie.type,
        });
      }}
      style={styles.movieItem}>
      <Box style={styles.posterContainer}>
        {!imageLoaded && <ImagePlaceholder width="100%" height={210} />}
        <Image
          source={{uri: movie.poster_preview_url || '/default-movie.png'}}
          alt={movie.title}
          style={[styles.posterImage, !imageLoaded && styles.hiddenImage]}
          onLoad={() => setImageLoaded(true)}
        />
        {movie.is_favorite && (
          <Box style={styles.favoriteIcon}>
            <Icon as={Heart} size="sm" color="#dc3f72" fill="#dc3f72" />
          </Box>
        )}
        <Box style={styles.overlay}>
          <HStack space="sm" style={styles.movieMeta}>
            {movie.rating > 0 && (
              <HStack space="xs" alignItems="center" style={styles.rating}>
                <Icon as={Star} size="sm" color="#FFD700" />
                <Text color="white" fontSize={14} fontWeight="600">
                  {movie.rating.toFixed(1)}
                </Text>
              </HStack>
            )}
            {movie.year && (
              <Text color="white" fontSize={14}>
                ({movie.year})
              </Text>
            )}
          </HStack>
        </Box>
      </Box>
      <Text
        color="#ffffff"
        fontSize={14}
        fontWeight="500"
        numberOfLines={1}
        mt="$2">
        {movie.title}
      </Text>
    </Pressable>
  );
};

const GenreMoviesScreen = ({route, navigation}) => {
  const {genreId, genreName} = route.params;
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [headerBackdrop, setHeaderBackdrop] = useState(null);
  const loadingRef = useRef(false);

  const fetchGenreMovies = async (page = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await api.get(`/genres/${genreId}/movies/?page=${page}`);
      if (page === 1) {
        setMovies(response.data.results || []);
        console.log(response.data.backdrop_url);
        if (response.data?.backdrop_url) {
          setHeaderBackdrop(response.data.backdrop_url);
        }
      } else {
        setMovies(prev => [...prev, ...(response.data.results || [])]);
      }

      setTotalPages(response.data.total_pages || 0);
      setTotalResults(response.data.total_results || 0);
    } catch (error) {
      console.error('Error fetching genre movies:', error);
      console.log(error.response);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchGenreMovies();
  }, [genreId]);

  const handleLoadMore = useCallback(() => {
    if (!loadingRef.current && currentPage < totalPages) {
      loadingRef.current = true;
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setIsLoadingMore(true);
      fetchGenreMovies(nextPage).finally(() => {
        loadingRef.current = false;
      });
    }
  }, [currentPage, totalPages]);

  const handleScroll = useCallback(
    ({nativeEvent}) => {
      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
      const paddingToBottom = 50;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      if (isCloseToBottom && !loadingRef.current) {
        handleLoadMore();
      }
    },
    [handleLoadMore],
  );

  if (isLoading) {
    return (
      <Box
        flex={1}
        backgroundColor="#040b1c"
        alignItems="center"
        justifyContent="center">
        <Icon as={Loader} size="xl" color="#ffffff" />
        <Text color="#ffffff" mt="$4">
          Loading movies...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        flex={1}
        backgroundColor="#040b1c"
        alignItems="center"
        justifyContent="center">
        <Icon as={Film} size="xl" color="#ffffff" />
        <Text color="#ffffff" mt="$4">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <Box height={200} style={styles.header}>
        {headerBackdrop && (
          <Image
            source={{uri: headerBackdrop}}
            alt="Genre backdrop"
            style={styles.headerBackdrop}
          />
        )}
        <Box style={styles.headerOverlay} />
        <Box style={styles.navBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon as={ArrowLeft} size="lg" color="#ffffff" />
          </Pressable>
        </Box>
        <Box style={styles.headerContent}>
          <Text color="#ffffff" fontSize={32} fontWeight="700" mb="$2">
            {genreName} Movies
          </Text>
          <HStack space="sm" alignItems="center">
            <Box style={styles.statBadge}>
              <Icon as={Film} size="sm" color="#ffffff" />
              <Text color="#ffffff" fontSize={14}>
                {totalResults.toLocaleString()} movies
              </Text>
            </Box>
          </HStack>
        </Box>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <Box style={styles.grid}>
          {movies.map(movie => (
            <Box key={movie.id} style={styles.gridItem}>
              <MovieItem movie={movie} navigation={navigation} />
            </Box>
          ))}
        </Box>

        {isLoadingMore && (
          <Box alignItems="center" py="$6">
            <Icon as={Loader} size="lg" color="#ffffff" />
          </Box>
        )}
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    backgroundColor: '#151527',
  },
  headerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 2,
  },
  headerContent: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '30%',
  },
  movieItem: {
    width: '100%',
  },
  posterContainer: {
    position: 'relative',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#151527',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  hiddenImage: {
    opacity: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  rating: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});

export default GenreMoviesScreen;

import React, {useEffect, useState, useCallback} from 'react';
import {
  Box,
  ScrollView,
  Text,
  Image,
  VStack,
  HStack,
  Pressable,
  Spinner,
} from '@gluestack-ui/themed';
import {
  Film,
  Instagram,
  Twitter,
  Star,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Platform,
  StyleSheet,
  Linking,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import ArtistHeader from '../components/ArtistHeader';
import ImagePlaceholder from '../components/ImagePlaceholder';
import api from '../lib/api';

const StatItem = ({icon, label, value}) => (
  <VStack alignItems="center" space="xs" flex={1}>
    {icon}
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={12} textAlign="center">
      {label}
    </Text>
    <Text color="white" fontSize={16} fontWeight="600" textAlign="center">
      {value}
    </Text>
  </VStack>
);

const ArtistDetailSkeleton = () => (
  <Box flex={1} backgroundColor="#040b1c">
    {/* Header Image Skeleton */}
    <Box height={400} width="100%" backgroundColor="#151527">
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height={200}
        style={{
          backgroundColor: '#040b1c',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      />
    </Box>

    {/* Content */}
    <VStack space="xl" padding={16} marginTop={-60}>
      {/* Name and Follow Button Skeleton */}
      <HStack justifyContent="space-between" alignItems="center">
        <Box
          width={200}
          height={32}
          backgroundColor="#151527"
          borderRadius={8}
        />
        <Box
          width={100}
          height={36}
          backgroundColor="#151527"
          borderRadius={12}
        />
      </HStack>

      {/* Stats Skeleton */}
      <Box
        backgroundColor="#151527"
        padding={16}
        borderRadius={16}
        marginBottom={24}>
        <HStack justifyContent="space-around">
          {[1, 2, 3].map(i => (
            <VStack key={i} alignItems="center" space="xs">
              <Box
                width={20}
                height={20}
                borderRadius={10}
                backgroundColor="rgba(255, 255, 255, 0.1)"
              />
              <Box
                width={40}
                height={12}
                borderRadius={6}
                backgroundColor="rgba(255, 255, 255, 0.1)"
              />
              <Box
                width={30}
                height={14}
                borderRadius={7}
                backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </VStack>
          ))}
        </HStack>
      </Box>

      {/* Biography Skeleton */}
      <VStack space="md">
        <Box
          width={120}
          height={24}
          backgroundColor="#151527"
          borderRadius={8}
        />
        <Box height={100} backgroundColor="#151527" borderRadius={12} />
      </VStack>

      {/* Personal Info Skeleton */}
      <VStack space="md">
        <Box
          width={150}
          height={24}
          backgroundColor="#151527"
          borderRadius={8}
        />
        <VStack space="sm">
          {[1, 2, 3].map(i => (
            <HStack key={i} space="md" alignItems="center">
              <Box
                width={24}
                height={24}
                borderRadius={12}
                backgroundColor="#151527"
              />
              <Box
                flex={1}
                height={20}
                backgroundColor="#151527"
                borderRadius={8}
              />
            </HStack>
          ))}
        </VStack>
      </VStack>
    </VStack>
  </Box>
);

const MovieCard = ({movie}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigation = useNavigation();

  // Get poster URL from available sources
  const posterUrl =
    movie.poster_preview_url || movie.poster || movie.poster_path;

  return (
    <Pressable
      key={movie.id}
      onPress={() => navigation.navigate('MovieDetail', {movie})}
      style={styles.movieCard}>
      <Box width="100%" height={200}>
        {!isImageLoaded && <ImagePlaceholder width="100%" height={200} />}
        {posterUrl ? (
          <Image
            source={{uri: posterUrl}}
            alt={movie.title}
            style={[styles.moviePoster, !isImageLoaded && styles.hiddenImage]}
            onLoad={() => setIsImageLoaded(true)}
          />
        ) : (
          <Box
            width="100%"
            height="100%"
            backgroundColor="#151527"
            alignItems="center"
            justifyContent="center">
            <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
              No Image
            </Text>
          </Box>
        )}
      </Box>
      <VStack space="xs" padding={8}>
        <Text color="white" fontSize={14} fontWeight="600" numberOfLines={1}>
          {movie.title}
        </Text>
        <HStack space="xs" alignItems="center">
          <Star size={12} color="#dc3f72" />
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
            {movie.rating?.toFixed(1) || 'N/A'}
          </Text>
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
            • {movie.year || 'N/A'}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
};

const ArtistDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const {artistId} = route.params;
  const [artist, setArtist] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchArtist = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/persons/${artistId}`);
      console.log(response.data);
      setArtist(response.data);
    } catch (err) {
      console.log(error.response, 'Error fetching artist');
      console.error('Error fetching artist:', err);
    }
  };

  const fetchFilmography = async (page = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await api.get(
        `/persons/${artistId}/filmography/?page=${page}`,
      );
      console.log(response.data);

      if (page === 1) {
        setMovies(response.data.results);
      } else {
        setMovies(prev => [...prev, ...response.data.results]);
      }

      setHasNextPage(!!response.data.next);
      setCurrentPage(page);
    } catch (err) {
      console.log(error.response, 'Error fetching filmography');
      console.error('Error fetching filmography:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchArtist();
    fetchFilmography();
  }, [artistId]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasNextPage) {
      fetchFilmography(currentPage + 1);
    }
  };

  const onScroll = ({nativeEvent}) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isCloseToBottom) {
      handleLoadMore();
    }
  };

  if (isLoading || !artist || !movies.length) {
    return <ArtistDetailSkeleton />;
  }

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setIsImageModalVisible(false)}>
          <Image
            source={{uri: artist.profile_path}}
            alt={artist.name}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsImageModalVisible(false)}>
            <Text style={styles.closeButtonText} color="white">
              ×
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        <ArtistHeader
          imageUrl={artist.profile_path}
          name={artist.name}
          tmdbId={artist.tmdb_id}
          navigation={navigation}
          onImagePress={() => setIsImageModalVisible(true)}
        />

        <VStack space="xl" padding={16} marginTop={-60}>
          {/* Artist Name and Follow Button */}
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="white" fontSize={32} fontWeight="600">
                {artist.name}
              </Text>
            </HStack>
          </VStack>

          {/* Stats */}
          <Box
            backgroundColor="#151527"
            padding={16}
            borderRadius={16}
            marginBottom={24}>
            <HStack justifyContent="space-around">
              <StatItem
                icon={<Film size={20} color="#dc3f72" />}
                label="Movies"
                value={movies.length}
              />
              <StatItem
                icon={<Briefcase size={20} color="#dc3f72" />}
                label="Known For"
                value={artist.known_for_department}
              />
              <StatItem
                icon={<Heart size={20} color="#dc3f72" />}
                label="Followers"
                value={artist.followers.length}
              />
            </HStack>
          </Box>

          {/* Biography */}
          {artist.biography && (
            <VStack space="md">
              <Text color="white" fontSize={20} fontWeight="600">
                Biography
              </Text>
              <Text
                color="rgba(255, 255, 255, 0.7)"
                fontSize={16}
                lineHeight={24}>
                {artist.biography}
              </Text>
            </VStack>
          )}

          {/* Personal Info */}
          <VStack space="md">
            <Text color="white" fontSize={20} fontWeight="600">
              Personal Info
            </Text>
            <VStack space="sm">
              {artist.birthday && (
                <HStack space="md" alignItems="center">
                  <Calendar size={20} color="#dc3f72" />
                  <VStack>
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                      Birthday
                    </Text>
                    <Text color="white" fontSize={14}>
                      {artist.birthday}
                    </Text>
                  </VStack>
                </HStack>
              )}
              {artist.place_of_birth && (
                <HStack space="md" alignItems="center">
                  <MapPin size={20} color="#dc3f72" />
                  <VStack>
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                      Place of Birth
                    </Text>
                    <Text color="white" fontSize={14}>
                      {artist.place_of_birth}
                    </Text>
                  </VStack>
                </HStack>
              )}
            </VStack>
          </VStack>

          {/* Filmography */}
          <VStack space="md">
            <Text color="white" fontSize={20} fontWeight="600">
              Filmography
            </Text>
            <Box>
              <HStack flexWrap="wrap" marginHorizontal={-6}>
                {movies.map(movie => (
                  <Box
                    key={movie.id}
                    paddingHorizontal={6}
                    marginBottom={12}
                    width="33.33%">
                    <MovieCard movie={movie} />
                  </Box>
                ))}
              </HStack>
              {isLoadingMore && (
                <Box py={4} alignItems="center">
                  <Spinner size="small" color="#dc3f72" />
                </Box>
              )}
            </Box>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#151527',
  },
  knownForContainer: {
    paddingRight: 16,
  },
  movieCard: {
    width: '100%',
    backgroundColor: '#151527',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 63, 114, 0.1)',
  },
  moviePoster: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default ArtistDetailScreen;

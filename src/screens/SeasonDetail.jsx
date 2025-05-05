import React, {useState, useEffect} from 'react';
import {
  Box,
  ScrollView,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  ButtonIcon,
  ButtonText,
  Spinner,
} from '@gluestack-ui/themed';
import {ArrowLeft, Share2, Copy} from 'lucide-react-native';
import {
  Platform,
  TouchableOpacity,
  View,
  Pressable,
  StyleSheet,
  Share,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import ImagePlaceholder from '../components/ImagePlaceholder';
import api from '../lib/api';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const EpisodeSkeleton = () => (
  <Box
    backgroundColor="#151527"
    borderRadius={12}
    marginBottom={8}
    overflow="hidden"
    padding={16}>
    <VStack space="md">
      <HStack justifyContent="space-between" alignItems="center">
        <Box
          width={30}
          height={14}
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderRadius={4}
        />
        <Box
          width={60}
          height={14}
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderRadius={4}
        />
      </HStack>
      <Box
        width="80%"
        height={20}
        backgroundColor="rgba(255, 255, 255, 0.1)"
        borderRadius={4}
      />
      <HStack space="md">
        <Box
          width={80}
          height={14}
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderRadius={4}
        />
        <Box
          width={60}
          height={14}
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderRadius={4}
        />
      </HStack>
    </VStack>
  </Box>
);

const SeasonDetailSkeleton = () => (
  <Box flex={1} bg="#040b1c">
    <Box height={200} backgroundColor="#151527" />
    <Box padding={16} marginTop={-40}>
      <VStack space="md">
        <Box
          width="80%"
          height={24}
          backgroundColor="#151527"
          borderRadius={8}
        />
        <Box
          width="100%"
          height={60}
          backgroundColor="#151527"
          borderRadius={8}
        />
      </VStack>
    </Box>

    <Box paddingHorizontal={16} paddingVertical={8}>
      <HStack space="sm">
        {[1, 2, 3].map(i => (
          <Box
            key={i}
            width={100}
            height={32}
            backgroundColor="#151527"
            borderRadius={8}
          />
        ))}
      </HStack>
    </Box>

    <Box flex={1} padding={16}>
      {[1, 2, 3, 4, 5].map(i => (
        <EpisodeSkeleton key={i} />
      ))}
    </Box>
  </Box>
);

const SeasonDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {tmdbId, type} = route.params;
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isBackdropLoaded, setIsBackdropLoaded] = useState(false);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/movies/${tmdbId}/${type}`);
        setMovie(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          'Failed to load movie details. Please try again later.';
        setError(errorMessage);
        console.error('Movie detail error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [tmdbId, type]);

  useEffect(() => {
    if (!movie || !movie.season_number) return;
    let _seasons = [];
    for (let i = 1; i <= movie.season_number; i++) {
      _seasons.push(i);
    }
    setSeasons(_seasons);
    // Always set to first season on initial load
    setCurrentSeason(1);
  }, [movie]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setIsLoadingEpisodes(true);
        setError(null);
        const response = await api.get(
          `/movies/${tmdbId}/season/${currentSeason}`,
        );
        const episodesData = response.data;
        setEpisodes(episodesData);
        // Set first episode when episodes are loaded
        if (episodesData && episodesData.length > 0) {
          setCurrentEpisode(episodesData[0]);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          'Failed to load episodes. Please try again later.';
        setError(errorMessage);
        console.error('Episodes error:', err);
      } finally {
        setIsLoadingEpisodes(false);
      }
    };

    if (movie && movie.type === 'tv') {
      fetchEpisodes();
    }
  }, [currentSeason, tmdbId, movie]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${movie.title} on Flickture!
https://flickture.leen2233.me/${type}/${tmdbId}`,
        url: `https://flickture.leen2233.me/${type}/${tmdbId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return <SeasonDetailSkeleton />;
  }

  if (error) {
    return (
      <Box flex={1} bg="#040b1c" alignItems="center" justifyContent="center">
        <Text color="white">{error}</Text>
        <Button
          onPress={() => {
            setError(null);
            setIsLoading(true);
            fetchMovieDetails();
          }}
          mt="$4">
          <ButtonText>Try Again</ButtonText>
        </Button>
      </Box>
    );
  }

  if (!movie) return null;

  return (
    <Box flex={1} bg="#040b1c">
      {/* Backdrop */}
      <Box height={200}>
        {(!isBackdropLoaded || !currentEpisode?.still_url) && (
          <ImagePlaceholder width="100%" height={200} />
        )}
        {currentEpisode?.still_url && (
          <Image
            source={{uri: currentEpisode.still_url}}
            alt={currentEpisode.name}
            style={[
              styles.backdropImage,
              !isBackdropLoaded && styles.hiddenImage,
            ]}
            onLoad={() => setIsBackdropLoaded(true)}
          />
        )}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(4, 11, 28, 0.5)"
        />
        <Button
          position="absolute"
          top={Platform.OS === 'ios' ? 60 : 20}
          left={16}
          variant="link"
          onPress={() => navigation.goBack()}>
          <ButtonIcon as={ArrowLeft} color="white" />
        </Button>
        <Button
          position="absolute"
          top={Platform.OS === 'ios' ? 60 : 20}
          right={16}
          variant="link"
          onPress={handleShare}>
          <ButtonIcon as={Share2} color="white" />
        </Button>
      </Box>

      {/* Episode Info - Fixed Position */}
      <Box padding={16} marginTop={-40}>
        {currentEpisode && (
          <VStack space="md">
            <Text color="white" fontSize={24} fontWeight="600">
              {currentEpisode.name}
            </Text>
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
              {currentEpisode.overview}
            </Text>
          </VStack>
        )}
      </Box>

      {/* Seasons Selector - Fixed Position */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        paddingHorizontal={16}
        marginRight={18}
        paddingVertical={8}>
        <HStack space="sm" paddingRight={20}>
          {seasons.map(season => (
            <TouchableOpacity
              key={season}
              onPress={() => setCurrentSeason(season)}
              disabled={isLoadingEpisodes}
              style={[
                styles.seasonButton,
                currentSeason === season && styles.activeSeason,
                isLoadingEpisodes && styles.disabledButton,
              ]}>
              <Text
                color={
                  currentSeason === season
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.7)'
                }
                fontSize={14}>
                Season {season}
              </Text>
            </TouchableOpacity>
          ))}
        </HStack>
      </ScrollView>

      {/* Episodes List - Scrollable */}
      <Box flex={200}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.episodesContainer}>
          {isLoadingEpisodes
            ? [...Array(5)].map((_, i) => <EpisodeSkeleton key={i} />)
            : episodes.map(episode => (
                <Pressable
                  key={episode.episode_number}
                  onPress={() => setCurrentEpisode(episode)}
                  style={({pressed}) => {
                    return [
                      styles.episodeItem,
                      currentEpisode?.episode_number === episode.episode_number
                        ? styles.activeEpisode
                        : null,
                      pressed ? styles.pressedEpisode : null,
                    ];
                  }}>
                  <VStack space="xs" padding={16}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                        #{episode.episode_number}
                      </Text>
                      <HStack space="sm" alignItems="center">
                        <Text color="white" fontSize={14}>
                          {episode.vote_average.toFixed(1)}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                          / 10
                        </Text>
                      </HStack>
                    </HStack>
                    <Text color="white" fontSize={16} fontWeight="600">
                      {episode.name}
                    </Text>
                    <HStack space="md" marginTop={4}>
                      <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                        {episode.air_date}
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                        {episode.runtime} min
                      </Text>
                    </HStack>
                  </VStack>
                </Pressable>
              ))}
        </ScrollView>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  backdropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hiddenImage: {
    opacity: 0,
  },
  seasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeSeason: {
    backgroundColor: '#dc3f72',
    borderColor: '#dc3f72',
  },
  episodesContainer: {
    padding: 16,
  },
  episodeItem: {
    backgroundColor: '#151527',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  activeEpisode: {
    backgroundColor: '#dc3f72',
  },
  pressedEpisode: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default SeasonDetail;

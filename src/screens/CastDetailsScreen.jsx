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
  Pressable,
  Spinner,
} from '@gluestack-ui/themed';
import {ArrowLeft, User2, Star, Clock, Calendar} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, Dimensions, Animated} from 'react-native';
import ImagePlaceholder from '../components/ImagePlaceholder';
import api from '../lib/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = 12;
const NUM_COLUMNS = 3;
const ITEM_WIDTH =
  (SCREEN_WIDTH - (32 + GRID_SPACING * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

const ArtistCard = ({artist, role, department}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        const artistId = artist.tmdb_id;
        navigation.navigate('ArtistDetailScreen', {artistId});
      }}>
      <VStack alignItems="center" space="sm" width={ITEM_WIDTH}>
        <Box
          width={ITEM_WIDTH}
          height={ITEM_WIDTH * 1.5}
          borderRadius={12}
          overflow="hidden"
          backgroundColor="#270a39">
          {!isImageLoaded && (
            <ImagePlaceholder width={ITEM_WIDTH} height={ITEM_WIDTH * 1.5} />
          )}
          {artist.image ? (
            <Image
              source={{uri: artist.image}}
              alt={artist.name}
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * 1.5}
              onLoad={() => setIsImageLoaded(true)}
              style={[styles.artistImage, !isImageLoaded && styles.hiddenImage]}
            />
          ) : (
            <Box
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * 1.5}
              alignItems="center"
              justifyContent="center"
              backgroundColor="#270a39">
              <User2 size={40} color="rgba(255, 255, 255, 0.3)" />
            </Box>
          )}
          {department && (
            <Box
              position="absolute"
              top={8}
              left={8}
              backgroundColor="rgba(220, 63, 114, 0.9)"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={8}>
              <Text color="white" fontSize={10} fontWeight="600">
                {department}
              </Text>
            </Box>
          )}
        </Box>
        <VStack alignItems="center" space="xs" paddingHorizontal={4}>
          <Text
            color="white"
            fontSize={14}
            fontWeight="600"
            textAlign="center"
            numberOfLines={1}>
            {artist.name}
          </Text>
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={12}
            textAlign="center"
            numberOfLines={2}
            height={32}>
            {role}
          </Text>
        </VStack>
      </VStack>
    </Pressable>
  );
};

const LoadingSkeleton = () => {
  const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [fadeAnim]);

  const SkeletonCard = () => (
    <Box
      paddingHorizontal={GRID_SPACING / 2}
      marginBottom={GRID_SPACING}
      width={`${100 / NUM_COLUMNS}%`}>
      <VStack alignItems="center" space="sm" width={ITEM_WIDTH}>
        <Animated.View
          style={{
            width: ITEM_WIDTH,
            height: ITEM_WIDTH * 1.5,
            borderRadius: 12,
            backgroundColor: '#270a39',
            opacity: fadeAnim,
          }}
        />
        <VStack alignItems="center" space="xs" width="100%">
          <Animated.View
            style={{
              width: '80%',
              height: 14,
              borderRadius: 7,
              backgroundColor: '#270a39',
              opacity: fadeAnim,
            }}
          />
          <Animated.View
            style={{
              width: '60%',
              height: 12,
              borderRadius: 6,
              backgroundColor: '#270a39',
              opacity: fadeAnim,
            }}
          />
        </VStack>
      </VStack>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor="#040b1c">
      {/* Backdrop Skeleton */}
      <Animated.View
        style={{
          height: 300,
          backgroundColor: '#270a39',
          opacity: fadeAnim,
        }}
      />

      {/* Content Section */}
      <Box padding={16} marginTop={-90}>
        {/* Title and Details Skeleton */}
        <VStack space="md" marginBottom={24}>
          <VStack space="xs">
            <Animated.View
              style={{
                width: '70%',
                height: 24,
                borderRadius: 12,
                backgroundColor: '#270a39',
                opacity: fadeAnim,
              }}
            />
            <Animated.View
              style={{
                width: '50%',
                height: 16,
                borderRadius: 8,
                backgroundColor: '#270a39',
                opacity: fadeAnim,
                marginTop: 8,
              }}
            />
            <HStack space="sm" marginTop={8}>
              <Animated.View
                style={{
                  width: 40,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: '#270a39',
                  opacity: fadeAnim,
                }}
              />
              <Animated.View
                style={{
                  width: 80,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: '#270a39',
                  opacity: fadeAnim,
                }}
              />
              <Animated.View
                style={{
                  width: 100,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: '#270a39',
                  opacity: fadeAnim,
                }}
              />
            </HStack>
          </VStack>
        </VStack>

        {/* Cast and Crew Section */}
        <VStack space="md" marginBottom={24}>
          <HStack justifyContent="space-between" alignItems="center">
            <Animated.View
              style={{
                width: 120,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#270a39',
                opacity: fadeAnim,
              }}
            />
            <Animated.View
              style={{
                width: 80,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#270a39',
                opacity: fadeAnim,
              }}
            />
          </HStack>
          <Box>
            <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
              {Array(9)
                .fill(0)
                .map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
            </HStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

const CastDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {tmdbId, type} = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const [castAndCrew, setCastAndCrew] = useState([]);
  const [isBackdropLoaded, setIsBackdropLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch movie details
        const movieResponse = await api.get(`/movies/${tmdbId}/${type}`);
        setMovieData(movieResponse.data);

        // Fetch cast and crew
        const castResponse = await api.get(`/movies/${tmdbId}/${type}/cast/`);
        const castData = castResponse.data.results || [];
        setCastAndCrew(castData);
      } catch (error) {
        console.error('Error loading cast details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [tmdbId, type]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <ScrollView flex={1}>
        {/* Backdrop Image */}
        <Box height={300}>
          {isBackdropLoaded || <ImagePlaceholder width="100%" height={300} />}
          <Image
            source={{uri: movieData.backdrop_url || movieData.poster_url}}
            alt={movieData.title}
            style={[
              styles.backdropImage,
              !isBackdropLoaded && styles.hiddenImage,
            ]}
            onLoad={() => setIsBackdropLoaded(true)}
          />

          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(4, 11, 28, 0.5)"
          />
          <Button
            position="absolute"
            top={Platform.OS === 'ios' ? 60 : 20}
            left={16}
            variant="link"
            onPress={() => navigation.goBack()}>
            <ButtonIcon as={ArrowLeft} color="white" />
          </Button>
        </Box>

        {/* Content */}
        <Box padding={16} marginTop={-90}>
          {/* Title and Details */}
          <VStack space="md" marginBottom={24}>
            <VStack space="xs">
              <Text color="white" fontSize={24} fontWeight="600">
                {movieData.title.length > 30
                  ? `${movieData.title.slice(0, 30)}...`
                  : movieData.title}
              </Text>
              {movieData.originalTitle &&
                movieData.originalTitle !== movieData.title && (
                  <Text color="rgba(255, 255, 255, 0.5)" fontSize={16}>
                    {movieData.originalTitle}
                  </Text>
                )}
              <HStack space="sm" flexWrap="wrap">
                <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                  {movieData.year}
                </Text>
                {movieData.runtime && (
                  <>
                    <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                      •
                    </Text>
                    <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                      {movieData.runtime} min
                    </Text>
                  </>
                )}
                <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                  •
                </Text>
                <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                  Rating: {movieData.rating}
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Cast and Crew Section */}
          <VStack space="md" marginBottom={24}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="white" fontSize={20} fontWeight="600">
                Cast & Crew
              </Text>
              <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                {castAndCrew.length}{' '}
                {castAndCrew.length === 1 ? 'person' : 'people'}
              </Text>
            </HStack>
            <Box>
              <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
                {castAndCrew.map((member, index) => (
                  <Box
                    key={index}
                    paddingHorizontal={GRID_SPACING / 2}
                    marginBottom={GRID_SPACING}
                    width={`${100 / NUM_COLUMNS}%`}>
                    <ArtistCard
                      artist={{
                        name: member.person.name,
                        image: member.person.profile_path,
                        tmdb_id: member.person.tmdb_id,
                      }}
                      role={member.character}
                      department={member.department}
                    />
                  </Box>
                ))}
              </HStack>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  artistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default CastDetailsScreen;

import React from 'react';
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
import {ArrowLeft, Heart, Share2} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, Dimensions, Animated, Share} from 'react-native';
import sampleData from '../data/sample.json';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = 12;
const NUM_COLUMNS = 3;
const ITEM_WIDTH =
  (SCREEN_WIDTH - (32 + GRID_SPACING * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

const MovieCard = ({movie}) => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate('MovieDetail', {movie})}>
      <VStack alignItems="center" space="sm" width={ITEM_WIDTH}>
        <Box
          width={ITEM_WIDTH}
          height={ITEM_WIDTH * 1.5}
          borderRadius={12}
          overflow="hidden"
          backgroundColor="#270a39">
          <Image
            source={{uri: movie.poster}}
            alt={movie.title}
            width={ITEM_WIDTH}
            height={ITEM_WIDTH * 1.5}
            style={styles.movieImage}
          />
        </Box>
        <VStack alignItems="center" space="xs" paddingHorizontal={4}>
          <Text
            color="white"
            fontSize={14}
            fontWeight="600"
            textAlign="center"
            numberOfLines={2}>
            {movie.title}
          </Text>
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={12}
            textAlign="center">
            {movie.year}
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
    <Box flex={1}>
      {/* Backdrop Skeleton */}
      <Animated.View
        style={{
          height: 250,
          backgroundColor: '#270a39',
          opacity: fadeAnim,
        }}
      />

      {/* Content Skeleton */}
      <Box marginTop={-40} padding={16}>
        {/* Title and Overview Skeleton */}
        <VStack space="md" marginBottom={24}>
          <Animated.View
            style={{
              width: '70%',
              height: 28,
              borderRadius: 14,
              backgroundColor: '#270a39',
              opacity: fadeAnim,
            }}
          />
          <VStack space="sm">
            {[1, 2, 3].map(i => (
              <Animated.View
                key={i}
                style={{
                  width: '100%',
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#270a39',
                  opacity: fadeAnim,
                }}
              />
            ))}
          </VStack>
        </VStack>

        {/* Movies Grid Skeleton */}
        <VStack space="md">
          <Animated.View
            style={{
              width: 120,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#270a39',
              opacity: fadeAnim,
            }}
          />
          <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <SkeletonCard key={index} />
              ))}
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

const CollectionDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {collectionId} = route.params;
  const [isLoading, setIsLoading] = React.useState(true);
  const [collection, setCollection] = React.useState(null);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleShare = () => {
    Share.share({
      message: `Check out ${collection.name} on Flickture!`,
      url: `https://flickture.com/collection/${collectionId}`,
    });
  };

  // Load data with delay
  React.useEffect(() => {
    const loadData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get collection data from sample.json
      const collectionData = sampleData.collections[collectionId];
      setCollection(collectionData);
      setIsLoading(false);
    };

    loadData();
  }, [collectionId]);

  if (!collection && !isLoading) {
    return (
      <Box
        flex={1}
        backgroundColor="#040b1c"
        alignItems="center"
        justifyContent="center">
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
          Collection not found
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <ScrollView flex={1}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Backdrop */}
            <Box height={250} width="100%">
              <Image
                source={{uri: collection.backdrop}}
                alt={collection.name}
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

            {/* Content */}
            <Box padding={16} marginTop={-40}>
              {/* Title, Thumbnail and Overview */}
              <HStack space="md" marginBottom={24}>
                <Image
                  source={{uri: collection.thumbnail}}
                  alt={collection.name}
                  width={120}
                  height={180}
                  borderRadius={12}
                />
                <VStack flex={1} space="md">
                  <HStack space="sm" alignItems="center" flexWrap="wrap">
                    <Text color="white" fontSize={24} fontWeight="600" flex={1}>
                      {collection.name}
                    </Text>
                    <Box
                      backgroundColor={isFavorite ? '#dc3f72' : 'transparent'}
                      padding={8}
                      borderRadius={20}
                      borderWidth={1}
                      borderColor="#dc3f72">
                      <Pressable onPress={() => setIsFavorite(!isFavorite)}>
                        <Heart
                          size={20}
                          color={isFavorite ? 'white' : '#dc3f72'}
                          fill={isFavorite ? 'white' : 'transparent'}
                        />
                      </Pressable>
                    </Box>
                  </HStack>
                  {collection.overview && (
                    <Text
                      color="rgba(255, 255, 255, 0.7)"
                      fontSize={14}
                      lineHeight={20}
                      numberOfLines={5}>
                      {collection.overview}
                    </Text>
                  )}
                </VStack>
              </HStack>

              {/* Movies Grid */}
              <VStack space="md">
                <HStack justifyContent="space-between" alignItems="center">
                  <Text color="white" fontSize={20} fontWeight="600">
                    Movies
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                    {collection.movies.length}{' '}
                    {collection.movies.length === 1 ? 'movie' : 'movies'}
                  </Text>
                </HStack>
                <Box>
                  <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
                    {collection.movies.map((movie, index) => (
                      <Box
                        key={index}
                        paddingHorizontal={GRID_SPACING / 2}
                        marginBottom={GRID_SPACING}
                        width={`${100 / NUM_COLUMNS}%`}>
                        <MovieCard movie={movie} />
                      </Box>
                    ))}
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </>
        )}
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
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default CollectionDetailsScreen;

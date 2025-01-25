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
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '@gluestack-ui/themed';
import {ArrowLeft, Search, Star} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = 12;
const NUM_COLUMNS = 3;
const ITEM_WIDTH =
  (SCREEN_WIDTH - (32 + GRID_SPACING * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

const MovieCard = ({movie}) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate('MovieDetail', {movie})}
      width={ITEM_WIDTH}>
      <VStack space="sm">
        <Image
          source={{uri: movie.poster}}
          alt={movie.title}
          width={ITEM_WIDTH}
          height={ITEM_WIDTH * 1.5}
          borderRadius={12}
        />
        <VStack space="xs">
          <Text color="white" fontSize={14} fontWeight="600" numberOfLines={1}>
            {movie.title}
          </Text>
          <HStack space="xs" alignItems="center">
            <Star size={12} color="#dc3f72" />
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
              {movie.rating}
            </Text>
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
              • {movie.year}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Pressable>
  );
};

const LoadingSkeleton = () => {
  const skeletonCards = Array(9).fill(0); // Show 9 skeleton cards initially

  return (
    <Box flex={1} backgroundColor="#040b1c" padding={16}>
      <VStack space="md">
        {/* Header Skeleton */}
        <Box
          width={150}
          height={24}
          backgroundColor="#270a39"
          borderRadius={8}
          marginBottom={16}
        />

        {/* Grid Skeleton */}
        <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
          {skeletonCards.map((_, index) => (
            <Box
              key={index}
              width={`${100 / NUM_COLUMNS}%`}
              paddingHorizontal={GRID_SPACING / 2}
              marginBottom={GRID_SPACING}>
              <VStack space="sm">
                <Box
                  width={ITEM_WIDTH}
                  height={ITEM_WIDTH * 1.5}
                  borderRadius={12}
                  backgroundColor="#270a39"
                />
                <VStack space="xs">
                  <Box
                    width="80%"
                    height={14}
                    borderRadius={7}
                    backgroundColor="#270a39"
                  />
                  <Box
                    width="60%"
                    height={12}
                    borderRadius={6}
                    backgroundColor="#270a39"
                  />
                </VStack>
              </VStack>
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

const ArtistMoviesScreen = ({route}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMovieData(route.params.movies);
      setIsLoading(false);
    };

    loadMovies();
  }, [route.params.movies]);

  const filteredMovies = movieData.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <VStack
        space="md"
        padding={16}
        paddingTop={Platform.OS === 'ios' ? 60 : 20}>
        <HStack space="md" alignItems="center">
          <Button variant="link" onPress={() => navigation.goBack()}>
            <ButtonIcon as={ArrowLeft} color="white" />
          </Button>
          <Text color="white" fontSize={20} fontWeight="600">
            {route.params.artistName}'s Films
          </Text>
        </HStack>

        <Input
          variant="rounded"
          size="md"
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderWidth={0}>
          <InputSlot pl="$3">
            <InputIcon as={Search} color="rgba(255, 255, 255, 0.5)" />
          </InputSlot>
          <InputField
            color="white"
            placeholder="Search movies"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </VStack>

      <ScrollView flex={1} contentContainerStyle={{padding: 16}}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom={16}>
          <Text color="white" fontSize={16}>
            {filteredMovies.length}{' '}
            {filteredMovies.length === 1 ? 'movie' : 'movies'}
          </Text>
        </HStack>

        <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
          {filteredMovies.map((movie, index) => (
            <Box
              key={index}
              paddingHorizontal={GRID_SPACING / 2}
              marginBottom={GRID_SPACING}
              width={`${100 / NUM_COLUMNS}%`}>
              <MovieCard movie={movie} />
            </Box>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default ArtistMoviesScreen;

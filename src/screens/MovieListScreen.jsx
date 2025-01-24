import React, {useState, useEffect} from 'react';
import {
  Box,
  Input,
  InputField,
  Icon,
  VStack,
  Text,
  Image,
  Pressable,
  FlatList,
} from '@gluestack-ui/themed';
import {Search} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import sampleData from '../data/sample.json';

const MovieCard = ({movie}) => {
  const navigation = useNavigation();
  
  return (
    <Pressable onPress={() => navigation.navigate('MovieDetail', { movie })}>
      <Box
        flexDirection="row"
        backgroundColor="#270a39"
        padding={12}
        borderRadius={12}
        marginBottom={12}>
        <Image
          source={{uri: movie.poster}}
          alt={movie.title}
          width={80}
          height={120}
          borderRadius={8}
        />
        <VStack marginLeft={12} flex={1} justifyContent="center">
          <Text color="white" fontSize={16} fontWeight="600" marginBottom={4}>
            {movie.title}
          </Text>
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={14} marginBottom={4}>
            {movie.year}
          </Text>
          <Text color="#dc3f72" fontSize={14}>
            Rating: {movie.rating}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
};

const MovieListScreen = ({route}) => {
  const {listType} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    // Get the appropriate movie list based on listType
    let movieList = [];
    switch (listType) {
      case 'Recently Watched':
        movieList = sampleData.movies.recentlyWatched;
        break;
      case 'Want to Watch':
        movieList = sampleData.movies.watchlist;
        break;
      case 'Favorites':
        movieList = sampleData.movies.favorites;
        break;
      default:
        movieList = [];
    }
    setMovies(movieList);
    setFilteredMovies(movieList);
  }, [listType]);

  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  return (
    <Box flex={1} backgroundColor="#040b1c" padding={16}>
      {/* Header */}
      <Text color="white" fontSize={24} fontWeight="600" marginBottom={16}>
        {listType}
      </Text>

      {/* Search Bar */}
      <Box
        marginBottom={16}
        borderRadius="$xl"
        borderColor="#341251"
        borderWidth={1}
        backgroundColor="#270a39">
        <Input height="$12">
          <Box justifyContent="center" ml="$3">
            <Icon as={Search} color="#dc3f72" size="lg" />
          </Box>
          <InputField
            placeholder={`Search in ${listType}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            color="#f16b33"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            fontSize={16}
            px="$3"
          />
        </Input>
      </Box>

      {/* Movie List */}
      <FlatList
        data={filteredMovies}
        renderItem={({item}) => <MovieCard movie={item} />}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

export default MovieListScreen; 
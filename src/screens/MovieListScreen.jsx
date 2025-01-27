import React, {useState, useEffect} from 'react';
import {
  Box,
  Input,
  InputField,
  Icon,
  Text,
  FlatList,
  Image,
} from '@gluestack-ui/themed';
import {Search} from 'lucide-react-native';
import sampleData from '../data/sample.json';
import MovieCard from '../components/MovieCard';
import ImagePlaceholder from '../components/ImagePlaceholder';
import {StyleSheet} from 'react-native';

const MovieListScreen = ({route}) => {
  const {listType} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});

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

  const handleUpdateStatus = (movieId, action) => {
    switch (action) {
      case 'markAsWatched':
        // Add to recently watched and remove from watchlist
        // You would typically make an API call here
        console.log('Marked as watched:', movieId);
        break;
      case 'remove':
        // Remove from current list
        const updatedMovies = movies.filter(movie => movie.id !== movieId);
        setMovies(updatedMovies);
        setFilteredMovies(
          updatedMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        );
        break;
      case 'unfavorite':
        // Remove from favorites
        console.log('Removed from favorites:', movieId);
        break;
      default:
        break;
    }
  };

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
        renderItem={({item}) => (
          <Box
            flexDirection="row"
            marginBottom={16}
            backgroundColor="#270a39"
            borderRadius={12}
            padding={8}>
            <Box flex={1}>
              <MovieCard
                movie={item}
                listType={listType}
                onUpdateStatus={handleUpdateStatus}
              />
            </Box>
          </Box>
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  hiddenImage: {
    opacity: 0,
  },
});

export default MovieListScreen;

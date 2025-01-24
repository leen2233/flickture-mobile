import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Input,
  InputField,
  Icon,
  ScrollView,
  Pressable,
  VStack,
  HStack,
  Image,
} from '@gluestack-ui/themed';
import {Search, Clock, X} from 'lucide-react-native';
import {Keyboard} from 'react-native';
import sampleData from '../data/sample.json';

const genres = [
  {id: 1, name: 'Action', color: '#FF6B6B'},
  {id: 2, name: 'Drama', color: '#4ECDC4'},
  {id: 3, name: 'Science Fiction', color: '#45B7D1'},
  {id: 4, name: 'Crime', color: '#96CEB4'},
  {id: 5, name: 'Adventure', color: '#FF9999'},
  {id: 6, name: 'War', color: '#9D50BB'},
  {id: 7, name: 'History', color: '#FFB6C1'},
  {id: 8, name: 'Thriller', color: '#87CEEB'},
];

// New component for search suggestions
const SearchSuggestions = ({
  recentSearches,
  searchQuery,
  onSelectSearch,
  onRemoveSearch,
}) => {
  const filteredSearches = recentSearches
    .filter(search =>
      search.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 5); // Only show last 5 items

  if (filteredSearches.length === 0) return null;

  return (
    <Box backgroundColor="#270a39" borderRadius="$lg" mt="$2" py="$2">
      <VStack space="sm">
        {filteredSearches.map(search => (
          <Pressable
            key={search}
            onPress={() => onSelectSearch(search)}
            px="$4"
            py="$2">
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space="sm" alignItems="center" flex={1}>
                <Icon as={Clock} size="sm" color="rgba(255, 255, 255, 0.5)" />
                <Text color="#ffffff" fontSize={16} numberOfLines={1}>
                  {search}
                </Text>
              </HStack>
              <Pressable
                onPress={e => {
                  e.stopPropagation();
                  onRemoveSearch(search);
                }}
                p="$2">
                <Icon as={X} size="sm" color="rgba(255, 255, 255, 0.5)" />
              </Pressable>
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </Box>
  );
};

const MovieRow = ({title, movies}) => (
  <Box mb="$6">
    <Text color="#ffffff" fontSize={20} fontWeight="600" mb="$3" px="$4">
      {title}
    </Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack space="sm" px="$4">
        {movies.map(movie => (
          <Pressable key={movie.id} mr="$4">
            <Box width={140}>
              <Image
                source={{uri: movie.poster}}
                alt={movie.title}
                width={140}
                height={210}
                borderRadius="$lg"
                mb="$2"
              />
              <VStack>
                <Text
                  color="#ffffff"
                  fontSize={14}
                  fontWeight="600"
                  numberOfLines={2}>
                  {movie.title}
                </Text>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                  {movie.year} • {movie.rating}⭐
                </Text>
              </VStack>
            </Box>
          </Pressable>
        ))}
      </HStack>
    </ScrollView>
  </Box>
);

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Inception',
    'The Matrix',
    'Leonardo DiCaprio',
    'Christopher Nolan',
    'Sci-Fi movies',
  ]);

  // Combine all movies from different sections
  const allMovies = [
    ...sampleData.movies.recentlyWatched,
    ...sampleData.movies.watchlist,
    ...sampleData.movies.favorites,
  ];

  // Filter movies by genre
  const getMoviesByGenre = genreName => {
    return allMovies.filter(
      movie => movie.genres && movie.genres.includes(genreName),
    );
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      // Add to recent searches if it's a new search
      setRecentSearches(prev => {
        const newSearches = prev.filter(item => item !== query);
        return [query, ...newSearches].slice(0, 10); // Keep only last 10 searches
      });
    }
  };

  const removeRecentSearch = searchTerm => {
    setRecentSearches(prev => prev.filter(item => item !== searchTerm));
  };

  const handleUnfocus = () => {
    setIsInputFocused(false);
    Keyboard.dismiss();
  };

  return (
    <Box flex={1} backgroundColor="#040b1c">
      {isInputFocused && (
        <Pressable
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          onPress={handleUnfocus}
          zIndex={1}
        />
      )}

      <Box p="$4" position="relative" zIndex={2}>
        <Input
          backgroundColor="#270a39"
          borderWidth={0}
          borderRadius="$lg"
          height={45}
          display="flex"
          flexDirection="row"
          alignItems="center">
          <Icon as={Search} color="#dc3f72" size="lg" ml="$3" />
          <InputField
            color="#ffffff"
            placeholder="Search movies..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            fontSize={16}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setIsInputFocused(true)}
          />
        </Input>

        {isInputFocused && (
          <Box
            position="absolute"
            top="100%"
            left="$4"
            right="$4"
            zIndex={1000}>
            <SearchSuggestions
              recentSearches={recentSearches}
              searchQuery={searchQuery}
              onSelectSearch={search => {
                setSearchQuery(search);
                handleUnfocus();
              }}
              onRemoveSearch={removeRecentSearch}
            />
          </Box>
        )}
      </Box>

      {!isInputFocused && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box p="$4">
            <Text color="#ffffff" fontSize={20} fontWeight="600" mb="$3">
              Genres
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="sm">
                {genres.map(genre => (
                  <Pressable
                    key={genre.id}
                    onPress={() => setSelectedGenre(genre.name)}>
                    <Box
                      backgroundColor={
                        selectedGenre === genre.name ? genre.color : '#270a39'
                      }
                      borderRadius="$lg"
                      px="$4"
                      py="$2"
                      mr="$2">
                      <Text color="#ffffff" fontSize={16}>
                        {genre.name}
                      </Text>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          </Box>

          {/* Popular Movies */}
          <MovieRow
            title="Popular Movies"
            movies={sampleData.movies.recentlyWatched.slice(0, 5)}
          />

          {/* Action Movies */}
          <MovieRow title="Action Movies" movies={getMoviesByGenre('Action')} />

          {/* Drama Movies */}
          <MovieRow title="Drama Movies" movies={getMoviesByGenre('Drama')} />

          {/* Science Fiction Movies */}
          <MovieRow
            title="Sci-Fi Movies"
            movies={getMoviesByGenre('Science Fiction')}
          />

          {/* Crime Movies */}
          <MovieRow title="Crime Movies" movies={getMoviesByGenre('Crime')} />

          {/* War Movies */}
          <MovieRow title="War Movies" movies={getMoviesByGenre('War')} />
        </ScrollView>
      )}
    </Box>
  );
};

export default SearchScreen;

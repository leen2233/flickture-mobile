import React, {useState, useEffect, useRef} from 'react';
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
import {Search, Clock, X, Image as ImageIcon} from 'lucide-react-native';
import {Keyboard, ActivityIndicator, StyleSheet} from 'react-native';
import sampleData from '../data/sample.json';
import ImagePlaceholder from '../components/ImagePlaceholder';

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
  onSearchSubmit,
}) => {
  const filteredSearches = recentSearches
    .filter(search => search.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  if (filteredSearches.length === 0) return null;

  const handleSelectSearch = search => {
    onSelectSearch(search);
    onSearchSubmit(search);
  };

  return (
    <Box backgroundColor="#270a39" borderRadius="$lg" mt="$2" py="$2">
      <VStack space="sm">
        {filteredSearches.map(search => (
          <Pressable
            key={search}
            onPress={() => handleSelectSearch(search)}
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

// Update SearchResults component to include loading state for images
const SearchResults = ({results}) => {
  const [loadedImages, setLoadedImages] = useState({});

  if (!results) return null;

  const sections = [
    {title: 'Movies', data: results.movies || []},
    {title: 'TV Shows', data: results.tvShows || []},
    {title: 'Persons', data: results.persons || []},
  ];

  return (
    <VStack space="xl" py="$4">
      {sections.map(
        section =>
          section.data.length > 0 && (
            <Box key={section.title}>
              <Text
                color="#ffffff"
                fontSize={20}
                fontWeight="600"
                mb="$3"
                px="$4">
                {section.title}
              </Text>
              <VStack space="sm">
                {section.data.map(item => (
                  <Pressable key={item.id} onPress={() => {}} px="$4" py="$2">
                    <HStack space="md" alignItems="center">
                      <Box width={60} height={90}>
                        {!loadedImages[item.id] && (
                          <ImagePlaceholder width={60} height={90} />
                        )}
                        <Image
                          source={{uri: item.image}}
                          alt={item.title || item.name}
                          width={60}
                          height={90}
                          borderRadius="$md"
                          onLoad={() =>
                            setLoadedImages(prev => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                          style={[
                            styles.image,
                            !loadedImages[item.id] && styles.hiddenImage,
                          ]}
                        />
                      </Box>
                      <VStack flex={1} space="xs">
                        <Text
                          color="#ffffff"
                          fontSize={16}
                          fontWeight="600"
                          numberOfLines={1}>
                          {item.title || item.name}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                          {item.subtitle}
                        </Text>
                      </VStack>
                    </HStack>
                  </Pressable>
                ))}
              </VStack>
            </Box>
          ),
      )}
    </VStack>
  );
};

// Add new SearchResultsSkeleton component after SearchResults component
const SearchResultsSkeleton = () => (
  <VStack space="xl" py="$4">
    {[1, 2, 3].map(section => (
      <Box key={section}>
        {/* Section Title Skeleton */}
        <Box
          width={120}
          height={24}
          backgroundColor="#270a39"
          borderRadius="$md"
          mb="$3"
          mx="$4"
        />

        <VStack space="sm">
          {[1, 2, 3].map(item => (
            <Box key={item} px="$4" py="$2">
              <HStack space="md" alignItems="center">
                {/* Image Skeleton */}
                <Box
                  width={60}
                  height={90}
                  backgroundColor="#270a39"
                  borderRadius="$md"
                />
                <VStack flex={1} space="xs">
                  {/* Title Skeleton */}
                  <Box
                    width="80%"
                    height={20}
                    backgroundColor="#270a39"
                    borderRadius="$sm"
                  />
                  {/* Subtitle Skeleton */}
                  <Box
                    width="60%"
                    height={16}
                    backgroundColor="#270a39"
                    borderRadius="$sm"
                  />
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    ))}
  </VStack>
);

// Update MovieRow component to include loading state for images
const MovieRow = ({title, movies}) => {
  const [loadedImages, setLoadedImages] = useState({});

  return (
    <Box mb="$6">
      <Text color="#ffffff" fontSize={20} fontWeight="600" mb="$3" px="$4">
        {title}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="sm" px="$4">
          {movies.map(movie => (
            <Pressable key={movie.id} mr="$4">
              <Box width={140}>
                <Box width={140} height={210}>
                  {!loadedImages[movie.id] && (
                    <ImagePlaceholder width={140} height={210} />
                  )}
                  <Image
                    source={{uri: movie.poster}}
                    alt={movie.title}
                    width={140}
                    height={210}
                    borderRadius="$lg"
                    onLoad={() =>
                      setLoadedImages(prev => ({...prev, [movie.id]: true}))
                    }
                    style={[
                      styles.image,
                      !loadedImages[movie.id] && styles.hiddenImage,
                    ]}
                  />
                </Box>
                <VStack mt="$2">
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
};

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
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

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
      setRecentSearches(prev => {
        const newSearches = prev.filter(item => item !== query);
        return [query, ...newSearches].slice(0, 10);
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

  // Update handleSearchSubmit to dismiss keyboard immediately
  const handleSearchSubmit = customQuery => {
    const queryToSearch = customQuery || searchQuery;
    if (queryToSearch.trim()) {
      setIsSearching(true);
      setIsInputFocused(false); // Hide suggestions immediately
      Keyboard.dismiss(); // Dismiss keyboard immediately
      // Simulate API call delay
      setTimeout(() => {
        setSearchResults({
          movies: [
            {
              id: 1,
              title: 'Inception',
              subtitle: '2010 • Action, Sci-Fi',
              image: 'https://example.com/inception.jpg',
            },
            {
              id: 2,
              title: 'Interstellar',
              subtitle: '2014 • Sci-Fi, Adventure',
              image: 'https://example.com/interstellar.jpg',
            },
          ],
          tvShows: [
            {
              id: 1,
              title: 'Breaking Bad',
              subtitle: '2008-2013 • Drama, Crime',
              image: 'https://example.com/breaking-bad.jpg',
            },
          ],
          persons: [
            {
              id: 1,
              name: 'Christopher Nolan',
              subtitle: 'Director, Writer',
              image: 'https://example.com/nolan.jpg',
            },
          ],
        });
        setIsSearching(false);
        handleUnfocus();
      }, 1500);
    }
  };

  // Update handleClearSearch function
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    // Focus input and show keyboard
    setIsInputFocused(true);
    // Small delay to ensure the input is mounted
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Add ref for the input field
  const inputRef = useRef(null);

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
            ref={inputRef}
            color="#ffffff"
            placeholder="Search movies..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            fontSize={16}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setIsInputFocused(true)}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={handleClearSearch}
              p="$3"
              mr="$1"
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon as={X} color="rgba(255, 255, 255, 0.5)" size="sm" />
            </Pressable>
          )}
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
              }}
              onRemoveSearch={removeRecentSearch}
              onSearchSubmit={handleSearchSubmit}
            />
          </Box>
        )}
      </Box>

      {!isInputFocused && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {isSearching ? (
            <SearchResultsSkeleton />
          ) : searchResults ? (
            <SearchResults results={searchResults} />
          ) : (
            <Box p="$4">
              <Text color="#ffffff" fontSize={20} fontWeight="600" mb="$3">
                Genres
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="sm">
                  {genres.map(genre => (
                    <Pressable
                      key={genre.id}
                      onPress={() => {
                        setSelectedGenre(genre.name);
                        handleUnfocus();
                        Keyboard.dismiss();
                      }}>
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
          )}

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

// Add to the styles at the bottom of the file
const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hiddenImage: {
    opacity: 0,
  },
  // ... existing styles ...
});

export default SearchScreen;

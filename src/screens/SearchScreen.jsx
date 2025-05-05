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
  Center,
} from '@gluestack-ui/themed';
import {
  Search,
  Clock,
  X,
  Image as ImageIcon,
  Trophy,
  Calendar,
} from 'lucide-react-native';
import {Keyboard, ActivityIndicator, StyleSheet} from 'react-native';
import ImagePlaceholder from '../components/ImagePlaceholder';
import {Flame} from 'lucide-react-native';
import api from '../lib/api';
import {useNavigation} from '@react-navigation/native';
import BottomTabs from '../components/BottomTabs';

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
    <Box backgroundColor="#151527" borderRadius="$lg" mt="$2" py="$2">
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

const SearchResults = ({results}) => {
  const [loadedImages, setLoadedImages] = useState({});
  const navigation = useNavigation();

  if (!results) return null;

  if (results.length === 0) {
    return (
      <Center flex={1} py="$12">
        <Icon as={Search} size="xl" color="rgba(255, 255, 255, 0.3)" mb="$4" />
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={16} textAlign="center">
          No results found
        </Text>
      </Center>
    );
  }

  return (
    <VStack space="xl" py="$4">
      {results.map((item, index) => (
        <Pressable
          key={`${item.type}-${item.tmdb_id}`}
          onPress={() => {
            if (item.type === 'movie' || item.type === 'tv') {
              navigation.navigate('MovieDetail', {
                tmdbId: item.tmdb_id,
                type: item.type,
              });
            }
          }}
          px="$4"
          py="$2">
          <HStack space="md" alignItems="center">
            <Box width={60} height={90}>
              {!loadedImages[item.tmdb_id] && (
                <ImagePlaceholder width={60} height={90} />
              )}
              {item.type === 'person' ? (
                <Image
                  source={{uri: item.profile_path || '/default-avatar.png'}}
                  alt={item.name}
                  width={60}
                  height={90}
                  borderRadius="$md"
                  onLoad={() =>
                    setLoadedImages(prev => ({
                      ...prev,
                      [item.tmdb_id]: true,
                    }))
                  }
                  style={[
                    styles.image,
                    !loadedImages[item.tmdb_id] && styles.hiddenImage,
                  ]}
                />
              ) : (
                <Image
                  source={{
                    uri:
                      item.poster_preview_url ||
                      (item.type === 'tv'
                        ? '/default-tv.png'
                        : '/default-movie.png'),
                  }}
                  alt={item.title}
                  width={60}
                  height={90}
                  borderRadius="$md"
                  onLoad={() =>
                    setLoadedImages(prev => ({
                      ...prev,
                      [item.tmdb_id]: true,
                    }))
                  }
                  style={[
                    styles.image,
                    !loadedImages[item.tmdb_id] && styles.hiddenImage,
                  ]}
                />
              )}
            </Box>
            <VStack flex={1} space="xs" justifyContent="center">
              <HStack alignItems="center" space="sm">
                <Text
                  color="#ffffff"
                  fontSize={16}
                  fontWeight="600"
                  numberOfLines={1}>
                  {(item.type === 'person' ? item.name : item.title).slice(
                    0,
                    28,
                  ) +
                    ((item.type === 'person' ? item.name : item.title).length >
                    28
                      ? '...'
                      : '')}
                </Text>
                <Text
                  color="rgba(255, 255, 255, 0.5)"
                  fontSize={12}
                  style={styles.typeText}>
                  {item.type === 'tv'
                    ? 'TV Series'
                    : item.type === 'person'
                    ? 'Person'
                    : 'Movie'}
                </Text>
              </HStack>
              {item.type === 'person' ? (
                <>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                    {item.known_for_department}
                  </Text>
                  {item.known_for && item.known_for.length > 0 && (
                    <Text
                      color="rgba(255, 255, 255, 0.5)"
                      fontSize={12}
                      numberOfLines={1}>
                      Known for: {item.known_for.map(m => m.title).join(', ')}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <HStack space="sm" alignItems="center">
                    {item.year && (
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                        {item.year}
                      </Text>
                    )}
                    {item.rating > 0 && (
                      <HStack space="xs" alignItems="center">
                        <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                          {item.rating.toFixed(1)}⭐
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                          ({item.vote_count.toLocaleString()})
                        </Text>
                      </HStack>
                    )}
                  </HStack>
                  {item.overview && (
                    <Text
                      color="rgba(255, 255, 255, 0.5)"
                      fontSize={12}
                      numberOfLines={2}>
                      {item.overview}
                    </Text>
                  )}
                </>
              )}
            </VStack>
          </HStack>
        </Pressable>
      ))}
    </VStack>
  );
};

const SearchResultsSkeleton = () => (
  <VStack space="xl" py="$4">
    {[1, 2, 3].map(section => (
      <Box key={section}>
        <Box
          width={120}
          height={24}
          backgroundColor="#151527"
          borderRadius="$md"
          mb="$3"
          mx="$4"
        />
        <VStack space="sm">
          {[1, 2, 3].map(item => (
            <Box key={item} px="$4" py="$2">
              <HStack space="md" alignItems="center">
                <Box
                  width={60}
                  height={90}
                  backgroundColor="#151527"
                  borderRadius="$md"
                />
                <VStack flex={1} space="xs">
                  <Box
                    width="80%"
                    height={20}
                    backgroundColor="#151527"
                    borderRadius="$sm"
                  />
                  <Box
                    width="60%"
                    height={16}
                    backgroundColor="#151527"
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

const MovieRow = ({navigation, icon, title, movies}) => {
  const [loadedImages, setLoadedImages] = useState({});

  return (
    <Box mb="$6">
      <HStack space="sm" alignItems="center" mb="$3" px="$4">
        {icon}
        <Text color="#ffffff" fontSize={20} fontWeight="600">
          {title}
        </Text>
      </HStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="sm" px="$4">
          {movies.map(movie => (
            <Pressable
              key={movie.id}
              mr="$4"
              onPress={() => {
                navigation.navigate('MovieDetail', {
                  tmdbId: movie.tmdb_id,
                  type: movie.type,
                });
              }}>
              <Box width={140}>
                <Box width={140} height={210}>
                  {!loadedImages[movie.id] && (
                    <ImagePlaceholder width={140} height={210} />
                  )}
                  {movie.poster_preview_url && (
                    <Image
                      source={{uri: movie.poster_preview_url}}
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
                  )}
                </Box>
                <VStack mt="$2" justifyContent="center">
                  <Text
                    color="#ffffff"
                    fontSize={14}
                    fontWeight="600"
                    numberOfLines={2}
                    textAlignVertical="center">
                    {movie.title}
                  </Text>
                  <Text
                    color="rgba(255, 255, 255, 0.7)"
                    fontSize={12}
                    textAlignVertical="center">
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
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState({
    popular: [],
    nowPlaying: [],
    topRated: [],
    upcoming: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres/');
        const genresData = response.data.results.map(genre => ({
          id: genre.id,
          tmdb_id: genre.tmdb_id,
          name: genre.name,
          color: getRandomColor(genre.id),
        }));
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovieLists = async () => {
      try {
        const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
          api.get('/movies/discover/?category=popular'),
          api.get('/movies/discover/?category=now_playing'),
          api.get('/movies/discover/?category=top_rated'),
          api.get('/movies/discover/?category=upcoming'),
        ]);

        setMovies({
          popular: popular.data.results,
          nowPlaying: nowPlaying.data.results,
          topRated: topRated.data.results,
          upcoming: upcoming.data.results,
        });
      } catch (error) {
        console.error('Error fetching movie lists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieLists();
  }, []);

  const getRandomColor = id => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FF9999',
      '#9D50BB',
      '#FFB6C1',
      '#87CEEB',
    ];
    return colors[id % colors.length];
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

  const handleSearchSubmit = async customQuery => {
    const queryToSearch = customQuery || searchQuery;
    if (queryToSearch.trim()) {
      setIsSearching(true);
      setIsInputFocused(false);
      Keyboard.dismiss();

      try {
        const response = await api.get(
          `/movies/search/multi/?query=${encodeURIComponent(queryToSearch)}`,
        );
        setSearchResults(response.data.results);

        // Update recent searches
        if (queryToSearch.trim() !== '') {
          setRecentSearches(prev => {
            const newSearches = prev.filter(item => item !== queryToSearch);
            return [queryToSearch, ...newSearches].slice(0, 10);
          });
        }
      } catch (error) {
        console.error('Error searching:', error);
        // You might want to show an error toast here
      } finally {
        setIsSearching(false);
        handleUnfocus();
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setIsInputFocused(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

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
          backgroundColor="#151527"
          borderWidth={0.2}
          borderRadius={25}
          height={45}
          display="flex"
          flexDirection="row"
          alignItems="center">
          <Icon as={Search} color="#ffffff" size="lg" ml="$3" />
          <InputField
            ref={inputRef}
            color="#ffffff"
            placeholder="Search movies..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            fontSize={16}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setIsInputFocused(true)}
            onSubmitEditing={() => handleSearchSubmit()}
            returnKeyType="search"
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
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
            <>
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
                          navigation.navigate('GenreMovies', {
                            genreId: genre.tmdb_id,
                            genreName: genre.name,
                          });
                          setSelectedGenre(genre.name);
                          handleUnfocus();
                          Keyboard.dismiss();
                        }}>
                        <Box
                          backgroundColor={
                            selectedGenre === genre.name
                              ? genre.color
                              : '#151527'
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

              {isLoading ? (
                <SearchResultsSkeleton />
              ) : (
                <>
                  <MovieRow
                    navigation={navigation}
                    icon={<Flame color={'#dc3f72'} size={20} />}
                    title="Popular Movies"
                    movies={movies.popular}
                  />
                  <MovieRow
                    navigation={navigation}
                    icon={<Clock color={'#dc3f72'} size={20} />}
                    title="Now Playing"
                    movies={movies.nowPlaying}
                  />
                  <MovieRow
                    navigation={navigation}
                    icon={<Trophy color={'#dc3f72'} size={20} />}
                    title="Top Rated"
                    movies={movies.topRated}
                  />
                  <MovieRow
                    navigation={navigation}
                    icon={<Calendar color={'#dc3f72'} size={20} />}
                    title="Upcoming"
                    movies={movies.upcoming}
                  />
                </>
              )}
            </>
          )}
        </ScrollView>
      )}
      <BottomTabs currentRoute="SearchTab" />
    </Box>
  );
};

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
  typeText: {
    backgroundColor: '#dc3f72',
    color: 'white',
    paddingBottom: 2,
    paddingTop: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 4,
    whiteSpace: 'nowrap',
    fontWeight: 500,
  },
});

export default SearchScreen;

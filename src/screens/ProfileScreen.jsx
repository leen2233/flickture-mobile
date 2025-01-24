import React from 'react';
import {
  Box,
  Button,
  ButtonText,
  Center,
  HStack,
  VStack,
  Text,
  Image,
  Pressable,
  ScrollView,
} from '@gluestack-ui/themed';
import {Edit2, ChevronRight, Settings} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import sampleData from '../data/sample.json';

const StatBox = ({label, value}) => (
  <Box alignItems="center" flex={1}>
    <Text color="#dc3f72" fontSize={24} fontWeight="600">
      {value}
    </Text>
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
      {label}
    </Text>
  </Box>
);

const MovieList = ({title, count, movies, onSeeAll}) => {
  const navigation = useNavigation();

  return (
    <Box marginBottom={24}>
      <HStack justifyContent="space-between" alignItems="center" marginBottom={12}>
        <Text color="white" fontSize={20} fontWeight="600">
          {title}
        </Text>
        <Pressable onPress={onSeeAll}>
          <HStack space="sm" alignItems="center">
            <Text color="#dc3f72" fontSize={14}>
              See all {count}
            </Text>
            <ChevronRight color="#dc3f72" size={16} />
          </HStack>
        </Pressable>
      </HStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="md" paddingBottom={8}>
          {movies.map(movie => (
            <Pressable
              key={movie.id}
              onPress={() => navigation.navigate('MovieDetail', { movie })}>
              <VStack space="sm" width={120}>
                <Image
                  source={{uri: movie.poster}}
                  alt={movie.title}
                  width={120}
                  height={180}
                  borderRadius={12}
                />
                <Text
                  color="white"
                  fontSize={14}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {movie.title}
                </Text>
              </VStack>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {user, movies} = sampleData;

  const navigateToList = (listType) => {
    navigation.navigate('MovieList', {listType});
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      <Box padding={16}>
        {/* Header with Edit Button */}
        <HStack justifyContent="flex-end" marginBottom={16} space="sm">
          <Button
            variant="outline"
            borderColor="#dc3f72"
            padding={8}
            onPress={() => navigation.navigate('EditProfile')}>
            <Edit2 color="#dc3f72" size={16} />
          </Button>
          <Button
            variant="outline"
            borderColor="#dc3f72"
            padding={8}
            onPress={() => navigation.navigate('Settings')}>
            <Settings color="#dc3f72" size={16} />
          </Button>
        </HStack>

        {/* Profile Info */}
        <HStack space="md" marginTop={32} marginBottom={12} alignItems="center">
          <Image
            source={{uri: user.avatar}}
            alt="Profile Picture"
            size="sm"
            borderRadius={20}
          />
          <VStack>
            <Text color="white" fontSize={20} fontWeight="600">
              {`${user.firstName} ${user.lastName}`}
            </Text>
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
              @{user.username}
            </Text>
          </VStack>
        </HStack>

        {/* Stats */}
        <Box
          backgroundColor="#270a39"
          borderRadius="$xl"
          padding={12}
          marginBottom={24}>
          <HStack justifyContent="space-between">
            <StatBox label="Movies" value={user.stats.moviesWatched} />
            <StatBox label="Following" value={user.stats.following} />
            <StatBox label="Followers" value={user.stats.followers} />
          </HStack>
        </Box>

        {/* Movie Lists */}
        <MovieList
          title="Recently Watched"
          count={movies.recentlyWatched.length}
          movies={movies.recentlyWatched}
          onSeeAll={() => navigateToList('Recently Watched')}
        />
        <MovieList
          title="Want to Watch"
          count={movies.watchlist.length}
          movies={movies.watchlist}
          onSeeAll={() => navigateToList('Want to Watch')}
        />
        <MovieList
          title="Favorites"
          count={movies.favorites.length}
          movies={movies.favorites}
          onSeeAll={() => navigateToList('Favorites')}
        />
      </Box>
    </ScrollView>
  );
};

export default ProfileScreen; 
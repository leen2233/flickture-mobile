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
      <HStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom={12}>
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
              onPress={() => navigation.navigate('MovieDetail', {movie})}>
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

  const navigateToList = listType => {
    navigation.navigate('MovieList', {listType});
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      <Box>
        {/* Banner with overlaid buttons */}
        <Box>
          <Image
            source={{uri: user.banner || 'https://picsum.photos/1600/900'}}
            alt="Profile Banner"
            width="100%"
            height={240}
          />
          {/* Buttons overlaid on banner */}
          <HStack
            position="absolute"
            top={16}
            right={16}
            space="sm"
            backgroundColor="rgba(4, 11, 28, 0.6)"
            padding={8}
            borderRadius={12}>
            <Pressable
              onPress={() => navigation.navigate('EditProfile')}
              flexDirection="row"
              alignItems="center"
              paddingHorizontal={12}
              paddingVertical={8}
              borderRadius={8}
              borderWidth={1}
              width={50}
              justifyContent="center"
              borderColor="#dc3f72">
              <Edit2 color="#dc3f72" size={16} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              flexDirection="row"
              alignItems="center"
              paddingHorizontal={12}
              paddingVertical={8}
              borderRadius={8}
              borderWidth={1}
              width={50}
              justifyContent="center"
              borderColor="#dc3f72">
              <Settings color="#dc3f72" size={16} />
            </Pressable>
          </HStack>
        </Box>

        {/* Rest of content */}
        <Box
          padding={16}
          backgroundColor="#040b1c"
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: -20,
          }}>
          {/* Avatar and Info - positioned with negative margin to overlap banner */}
          <Center marginTop={-60} marginBottom={12}>
            <Image
              source={{uri: user.avatar}}
              alt="Profile Picture"
              width={100}
              height={100}
              borderRadius={50}
              borderWidth={4}
              borderColor="#040b1c"
              marginBottom={0}
            />
            <VStack space="xs" alignItems="center">
              <Text color="white" fontSize={24} fontWeight="600">
                {`${user.firstName} ${user.lastName}`}
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                @{user.username}
              </Text>
            </VStack>
          </Center>

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
      </Box>
    </ScrollView>
  );
};

export default ProfileScreen;

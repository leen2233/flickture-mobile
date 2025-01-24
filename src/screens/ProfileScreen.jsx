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
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '@gluestack-ui/themed';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {Edit2, ChevronRight, Settings, Search} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import sampleData from '../data/sample.json';
import MovieListModal from '../components/MovieListModal';
import UserListModal from '../components/UserListModal';

const StatBox = ({label, value, onPress}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{flex: 1}}>
    <View style={{alignItems: 'center'}}>
      <Text color="#dc3f72" fontSize={24} fontWeight="600">
        {value}
      </Text>
      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
        {label}
      </Text>
    </View>
  </TouchableOpacity>
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
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({
    title: '',
    value: '',
    type: '',
    data: [],
  });
  const [followingState, setFollowingState] = React.useState(
    new Set(sampleData.user.following),
  );

  const handleStatPress = (title, value, type) => {
    let data = [];
    if (type === 'followers') {
      data = sampleData.user.followersList || [];
    } else if (type === 'following') {
      data = sampleData.user.followingList || [];
    } else if (type === 'movies') {
      data = sampleData.movies.recentlyWatched || [];
    }

    setModalContent({title, value, type, data});
    setModalVisible(true);
  };

  const handleToggleFollow = userId => {
    setFollowingState(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const navigateToList = listType => {
    navigation.navigate('MovieList', {listType});
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      {modalVisible &&
        (modalContent.type === 'followers' ||
          modalContent.type === 'following') && (
          <UserListModal
            data={modalContent.data}
            title={modalContent.title}
            isFollowing={followingState}
            onToggleFollow={handleToggleFollow}
            onClose={() => setModalVisible(false)}
          />
        )}

      {modalVisible && modalContent.type === 'movies' && (
        <MovieListModal
          data={modalContent.data || movies.recentlyWatched}
          title={modalContent.title}
          onClose={() => setModalVisible(false)}
        />
      )}

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
              <StatBox
                label="Movies"
                value={user.stats.moviesWatched}
                onPress={() =>
                  handleStatPress('Movies', user.stats.moviesWatched, 'movies')
                }
              />
              <StatBox
                label="Following"
                value={user.stats.following}
                onPress={() =>
                  handleStatPress(
                    'Following',
                    user.stats.following,
                    'following',
                  )
                }
              />
              <StatBox
                label="Followers"
                value={user.stats.followers}
                onPress={() =>
                  handleStatPress(
                    'Followers',
                    user.stats.followers,
                    'followers',
                  )
                }
              />
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

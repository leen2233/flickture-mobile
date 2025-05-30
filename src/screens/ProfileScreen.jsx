import React, {useEffect, useState} from 'react';
import {
  Box,
  Center,
  HStack,
  VStack,
  Text,
  Image,
  Pressable,
  ScrollView,
} from '@gluestack-ui/themed';
import {View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {
  Edit2,
  ChevronRight,
  Settings,
  Search,
  Plus,
  Clock,
  Bookmark,
  BookMarked,
  Heart,
  Film,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import sampleData from '../data/sample.json';
import MovieListModal from '../components/MovieListModal';
import UserListModal from '../components/UserListModal';
import ImagePlaceholder from '../components/ImagePlaceholder';
import {useAuth} from '../context/AuthContext';
import BottomTabs from '../components/BottomTabs';

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

const MovieList = ({icon, title, count, items, onSeeAll}) => {
  const navigation = useNavigation();
  const [loadedImages, setLoadedImages] = useState({});

  const getEmptyStateMessage = () => {
    switch (title) {
      case 'Recently Watched':
        return 'No movies watched yet. Start watching!';
      case 'Want to Watch':
        return 'Your watchlist is empty. Start adding movies!';
      case 'Favorites':
        return 'No favorite movies yet. Mark some movies as favorites!';
      default:
        return 'No movies found';
    }
  };

  return (
    <Box marginBottom={24}>
      <HStack
        justifyContent="space-between"
        gap={8}
        alignItems="center"
        marginBottom={12}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {icon}
          <Text color="white" fontSize={18} fontWeight="600">
            {title}
          </Text>
        </View>
        {count > 0 && (
          <Pressable onPress={onSeeAll}>
            <HStack space="sm" alignItems="center">
              <Text color="#dc3f72" fontSize={14}>
                See all {count}
              </Text>
              <ChevronRight color="#dc3f72" size={16} />
            </HStack>
          </Pressable>
        )}
      </HStack>
      {!items || items.length === 0 ? (
        <Box
          padding={24}
          backgroundColor="rgba(255, 255, 255, .05)"
          borderRadius={12}
          borderWidth={1}
          borderStyle="dashed"
          borderColor="rgba(255, 255, 255, 0.2)"
          alignItems="center"
          justifyContent="center"
          gap={10}>
          <Film fontSize={14} color={'rgba(255, 255, 255, 0.7)'} />
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={16}
            textAlign="center">
            {getEmptyStateMessage()}
          </Text>
        </Box>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="md" paddingBottom={8} paddingLeft={10}>
            {items.map(item => (
              <Pressable
                key={item.movie.id}
                onPress={() =>
                  navigation.navigate('MovieDetail', {
                    tmdbId: item.movie.tmdb_id,
                    type: item.movie.type,
                  })
                }>
                <VStack space="sm" width={120}>
                  <Box width={120} height={180}>
                    {!loadedImages[item.movie.id] && (
                      <ImagePlaceholder width={120} height={180} />
                    )}
                    <Image
                      source={{uri: item.movie.poster_preview_url}}
                      alt={item.movie.title}
                      width={120}
                      height={180}
                      borderRadius={12}
                      onLoad={() =>
                        setLoadedImages(prev => ({
                          ...prev,
                          [item.movie.id]: true,
                        }))
                      }
                      style={[
                        !loadedImages[item.movie.id] && styles.hiddenImage,
                      ]}
                    />
                  </Box>
                  <Text
                    color="white"
                    fontSize={14}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.movie.title}
                  </Text>
                </VStack>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>
      )}
    </Box>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [followingState, setFollowingState] = React.useState(
    new Set(sampleData.user.following),
  );
  const {user, fetchUser} = useAuth();
  const [movieModalVisible, setMovieModalVisible] = useState(false);

  const handleStatPress = type => {
    navigation.navigate('FollowingList', {
      username: user.username,
      type: type.toLowerCase(),
    });
  };

  useEffect(() => {
    const updateUser = async () => {
      await fetchUser();
    };
    const unsubscribe = navigation.addListener('focus', () => {
      updateUser();
    });

    return unsubscribe;
  }, [navigation, fetchUser]);

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

  const handleSeeAll = () => {
    navigation.navigate('MovieWatchlist', {
      username: user.username,
    });
  };

  useEffect(() => {
    console.log('modal', movieModalVisible);
  }, [movieModalVisible]);

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <ScrollView flex={1} backgroundColor="#040b1c" marginBottom={30}>
        <Box>
          {/* Banner with overlaid buttons */}
          <Box>
            <Image
              source={{
                uri:
                  user?.banner_image ||
                  'https://flickture.leen2233.me/default-banner.png',
              }}
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
            {/* Avatar and Info */}
            <Center marginTop={-60} marginBottom={12}>
              <Image
                source={{
                  uri: user.avatar
                    ? user.avatar
                    : 'https://flickture.leen2233.me/default-avatar.png',
                }}
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
                  {user.full_name}
                </Text>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                  @{user.username}
                </Text>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                  {user.about}
                </Text>
              </VStack>
            </Center>

            {/* Stats */}
            <Box
              backgroundColor="#151527"
              borderRadius={12}
              padding={12}
              marginBottom={24}>
              <HStack justifyContent="space-between">
                <StatBox
                  label="Movies"
                  value={user.movies_watched}
                  onPress={handleSeeAll}
                />
                <StatBox
                  label="Following"
                  value={user.following_count}
                  onPress={() => handleStatPress('Following')}
                />
                <StatBox
                  label="Followers"
                  value={user.follower_count}
                  onPress={() => handleStatPress('Followers')}
                />
              </HStack>
            </Box>

            {/* Movie Lists */}
            {user.recently_watched && (
              <MovieList
                icon={<Clock color={'#d33f72'} size={20} />}
                title="Recently Watched"
                count={user.movies_watched}
                items={user.recently_watched}
                onSeeAll={() => {
                  handleSeeAll();
                }}
              />
            )}

            <MovieList
              icon={<BookMarked color={'#d33f72'} size={20} />}
              title="Want to Watch"
              count={user.watchlist_count}
              items={user.watchlist}
              onSeeAll={() => {
                handleSeeAll();
              }}
            />
            <MovieList
              icon={<Heart color={'#d33f72'} size={20} />}
              title="Favorites"
              count={user.favorites_count}
              items={user.favorites}
              onSeeAll={() => {
                handleSeeAll();
              }}
            />
          </Box>
        </Box>
      </ScrollView>
      <BottomTabs currentRoute="ProfileTab" />
    </Box>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  hiddenImage: {
    opacity: 0,
  },
});

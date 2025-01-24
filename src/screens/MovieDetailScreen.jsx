import React, {useState} from 'react';
import {
  Box,
  ScrollView,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  ButtonIcon,
  ButtonText,
  Divider,
  Pressable,
} from '@gluestack-ui/themed';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Star,
  Plus,
  Check,
  BookmarkPlus,
  BookmarkCheck,
  Share2,
  MessageCircle,
  User,
  ChevronRight,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { CastMember } from '../types';

const TouchableItem = ({onPress, children, style}) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          'rgba(220, 63, 114, 0.2)',
          false,
        )}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }
  return (
    <TouchableHighlight
      onPress={onPress}
      style={style}
      underlayColor="rgba(220, 63, 114, 0.1)">
      {children}
    </TouchableHighlight>
  );
};

const MetadataItem = ({icon, label, value}) => (
  <VStack alignItems="center" space="xs">
    {icon}
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
      {label}
    </Text>
    <Text color="white" fontSize={14} fontWeight="600">
      {value}
    </Text>
  </VStack>
);

const CastList = ({cast}) => {
  const navigation = useNavigation();
  const displayCast = cast.slice(0, 10);

  const handleArtistPress = (artist) => {
    const artistId = artist.name.toLowerCase().replace(/\s+/g, '-');
    navigation.navigate('ArtistDetailScreen', { artistId });
  };

  return (
    <VStack space="md">
      <HStack justifyContent="space-between" alignItems="center">
        <Text color="white" fontSize={20} fontWeight="600">
          Cast
        </Text>
        {cast.length > 10 && (
          <Pressable onPress={() => navigation.navigate('CastListScreen', { cast })}>
            <HStack space="sm" alignItems="center">
              <Text color="#dc3f72" fontSize={14}>
                See all {cast.length}
              </Text>
              <ChevronRight color="#dc3f72" size={16} />
            </HStack>
          </Pressable>
        )}
      </HStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="md" paddingVertical={8}>
          {displayCast.map((actor, index) => (
            <Pressable key={index} onPress={() => handleArtistPress(actor)}>
              <VStack alignItems="center" space="sm" width={100}>
                <Box
                  width={100}
                  height={150}
                  borderRadius={12}
                  overflow="hidden"
                  backgroundColor="#270a39">
                  <Image
                    source={{uri: actor.image}}
                    alt={actor.name}
                    width={100}
                    height={150}
                    style={styles.castImage}
                  />
                </Box>
                <VStack alignItems="center" space="xs">
                  <Text
                    color="white"
                    fontSize={14}
                    fontWeight="600"
                    textAlign="center"
                    numberOfLines={1}
                    width={100}>
                    {actor.name}
                  </Text>
                  <Text
                    color="rgba(255, 255, 255, 0.7)"
                    fontSize={12}
                    textAlign="center"
                    numberOfLines={1}
                    width={100}>
                    {actor.character}
                  </Text>
                </VStack>
              </VStack>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </VStack>
  );
};

const MovieDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const movie = {
    ...route.params.movie,
    backdrop: route.params.movie.backdrop?.replace('/w500/', '/original/'),
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
    if (isWatched) setIsWatched(false);
  };

  const handleWatchedToggle = () => {
    setIsWatched(!isWatched);
    if (!isInWatchlist) setIsInWatchlist(true);
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      {/* Backdrop Image */}
      <Box height={250} width="100%">
        <Image
          source={{uri: movie.backdrop || movie.poster}}
          alt={movie.title}
          style={styles.backdropImage}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(4, 11, 28, 0.5)"
        />
        <Button
          position="absolute"
          top={Platform.OS === 'ios' ? 60 : 20}
          left={16}
          variant="link"
          onPress={() => navigation.goBack()}>
          <ButtonIcon as={ArrowLeft} color="white" />
        </Button>
      </Box>

      {/* Content */}
      <Box padding={16} marginTop={-40}>
        {/* Poster and Title */}
        <HStack space="md" marginBottom={24}>
          <Image
            source={{uri: movie.poster}}
            alt={movie.title}
            width={120}
            height={180}
            borderRadius={12}
          />
          <VStack flex={1} space="xs">
            <Text color="white" fontSize={24} fontWeight="600">
              {movie.title}
            </Text>
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <Text color="rgba(255, 255, 255, 0.5)" fontSize={16}>
                {movie.originalTitle}
              </Text>
            )}
            {movie.overview && (
              <Text
                color="rgba(255, 255, 255, 0.7)"
                fontSize={14}
                numberOfLines={3}
                marginTop={4}>
                {movie.overview}
              </Text>
            )}
            {movie.genres && (
              <HStack space="sm" flexWrap="wrap" marginTop={8}>
                {movie.genres.map((genre) => (
                  <Box
                    key={genre}
                    backgroundColor="#270a39"
                    paddingHorizontal={12}
                    paddingVertical={4}
                    borderRadius={16}
                    marginBottom={4}>
                    <Text color="white" fontSize={12}>
                      {genre}
                    </Text>
                  </Box>
                ))}
              </HStack>
            )}
          </VStack>
        </HStack>

        {/* Metadata */}
        <HStack
          space="lg"
          justifyContent="space-around"
          backgroundColor="#270a39"
          padding={16}
          borderRadius={16}
          marginBottom={24}>
          <MetadataItem
            icon={<Calendar size={20} color="#dc3f72" />}
            label="Year"
            value={movie.year.toString()}
          />
          {movie.duration && (
            <MetadataItem
              icon={<Clock size={20} color="#dc3f72" />}
              label="Duration"
              value={movie.duration}
            />
          )}
          <MetadataItem
            icon={<Star size={20} color="#dc3f72" />}
            label="Rating"
            value={movie.rating.toString()}
          />
          <MetadataItem
            icon={<MessageCircle size={20} color="#dc3f72" />}
            label="Comments"
            value={(movie.comments || 0).toString()}
          />
        </HStack>

        {/* Action Buttons */}
        <HStack space="md" marginBottom={24}>
          <TouchableItem
            style={[styles.actionButton, isWatched && styles.activeButton]}
            onPress={handleWatchedToggle}>
            <HStack space="sm" alignItems="center" padding={12}>
              {isWatched ? (
                <Check size={20} color={isWatched ? 'white' : '#dc3f72'} />
              ) : (
                <Plus size={20} color={isWatched ? 'white' : '#dc3f72'} />
              )}
              <Text color={isWatched ? 'white' : '#dc3f72'}>
                {isWatched ? 'Watched' : 'Mark as Watched'}
              </Text>
            </HStack>
          </TouchableItem>
          <TouchableItem
            style={[styles.actionButton, isInWatchlist && styles.activeButton]}
            onPress={handleWatchlistToggle}>
            <HStack space="sm" alignItems="center" padding={12}>
              {isInWatchlist ? (
                <BookmarkCheck
                  size={20}
                  color={isInWatchlist ? 'white' : '#dc3f72'}
                />
              ) : (
                <BookmarkPlus
                  size={20}
                  color={isInWatchlist ? 'white' : '#dc3f72'}
                />
              )}
              <Text color={isInWatchlist ? 'white' : '#dc3f72'}>
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Text>
            </HStack>
          </TouchableItem>
        </HStack>

        {/* Overview */}
        {movie.overview && (
          <VStack space="md" marginBottom={24}>
            <Text color="white" fontSize={20} fontWeight="600">
              Overview
            </Text>
            <Text
              color="rgba(255, 255, 255, 0.7)"
              fontSize={16}
              lineHeight={24}>
              {movie.overview}
            </Text>
          </VStack>
        )}

        {/* Cast & Crew */}
        <VStack space="xl">
          {movie.director && (
            <HStack space="md" alignItems="center">
              <User size={20} color="#dc3f72" />
              <VStack>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                  Director
                </Text>
                <Text color="white" fontSize={16}>
                  {movie.director}
                </Text>
              </VStack>
            </HStack>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <Box marginTop={8}>
              <CastList cast={movie.cast} />
            </Box>
          )}
        </VStack>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backdropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  castImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc3f72',
    overflow: 'hidden',
  },
  activeButton: {
    backgroundColor: '#dc3f72',
    borderColor: '#dc3f72',
  },
});

export default MovieDetailScreen;

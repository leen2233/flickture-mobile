import React, {useState, useEffect} from 'react';
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
  Heart,
  ListPlus,
  Trash2,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  StyleSheet,
  TouchableOpacity,
  Share,
  Modal,
  StatusBar,
} from 'react-native';
import RatingModal from '../components/RatingModal';

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

const MetadataItem = ({icon, label, value, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <VStack alignItems="center" space="xs">
      {icon}
      <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
        {label}
      </Text>
      <Text color="white" fontSize={14} fontWeight="600">
        {value}
      </Text>
    </VStack>
  </TouchableOpacity>
);

const CastList = ({cast, director, crew}) => {
  const navigation = useNavigation();
  const displayCast = cast.slice(0, 8);

  const handleArtistPress = artist => {
    const artistId = artist.name.toLowerCase().replace(/\s+/g, '-');
    navigation.navigate('ArtistDetailScreen', {artistId});
  };

  return (
    <VStack space="md">
      <HStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom={12}>
        <Text color="white" fontSize={20} fontWeight="600">
          Cast
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate('CastDetails', {cast, director, crew})
          }>
          <HStack space="sm" alignItems="center">
            <Text color="#dc3f72" fontSize={14}>
              See all {cast.length}
            </Text>
            <ChevronRight color="#dc3f72" size={16} />
          </HStack>
        </Pressable>
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

const CollectionSection = ({collection}) => {
  const navigation = useNavigation();

  return (
    <VStack space="md" marginBottom={24}>
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom={12}>
        <VStack flex={1} marginRight={8}>
          <Text color="white" fontSize={20} fontWeight="600" numberOfLines={2}>
            Part of: {collection.name}
          </Text>
        </VStack>
        <Pressable
          onPress={() =>
            navigation.navigate('CollectionDetails', {
              collectionId: collection.id,
            })
          }>
          <HStack space="sm" alignItems="center" minWidth={100}>
            <Text color="#dc3f72" fontSize={14}>
              See collection
            </Text>
            <ChevronRight color="#dc3f72" size={16} />
          </HStack>
        </Pressable>
      </HStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="md" paddingVertical={8}>
          {collection.movies.slice(0, 4).map(movie => (
            <Pressable
              key={movie.id}
              onPress={() => navigation.push('MovieDetail', {movie})}>
              <VStack alignItems="center" space="sm" width={100}>
                <Box
                  width={100}
                  height={150}
                  borderRadius={12}
                  overflow="hidden"
                  backgroundColor="#270a39">
                  <Image
                    source={{uri: movie.poster}}
                    alt={movie.title}
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
                    numberOfLines={2}
                    width={100}>
                    {movie.title}
                  </Text>
                  <Text
                    color="rgba(255, 255, 255, 0.7)"
                    fontSize={12}
                    textAlign="center">
                    {movie.year}
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

const ListsSection = ({lists}) => (
  <VStack space="md" marginBottom={24}>
    <Text color="white" fontSize={20} fontWeight="600">
      Appears in Lists
    </Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack space="md" paddingVertical={8}>
        {lists.map(list => (
          <Pressable
            key={list.id}
            onPress={() =>
              navigation.navigate('MovieListScreen', {listId: list.id})
            }>
            <VStack alignItems="center" space="sm" width={150}>
              <Box
                width={150}
                height={100}
                borderRadius={12}
                overflow="hidden"
                backgroundColor="#270a39">
                <Image
                  source={{uri: list.thumbnail}}
                  alt={list.name}
                  width={150}
                  height={100}
                  style={styles.listThumbnail}
                />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  padding={8}
                  backgroundColor="rgba(0, 0, 0, 0.7)">
                  <Text color="white" fontSize={12} fontWeight="600">
                    by {list.creator}
                  </Text>
                </Box>
              </Box>
              <VStack alignItems="center" space="xs">
                <Text
                  color="white"
                  fontSize={14}
                  fontWeight="600"
                  textAlign="center"
                  numberOfLines={2}
                  width={150}>
                  {list.name}
                </Text>
                <Text
                  color="rgba(255, 255, 255, 0.7)"
                  fontSize={12}
                  textAlign="center">
                  {list.moviesCount} movies
                </Text>
              </VStack>
            </VStack>
          </Pressable>
        ))}
      </HStack>
    </ScrollView>
  </VStack>
);

const MovieDetailSkeleton = () => (
  <Box flex={1} backgroundColor="#040b1c">
    {/* Backdrop Skeleton */}
    <Box height={250} width="100%" backgroundColor="#270a39" />

    {/* Content Skeleton */}
    <Box padding={16} marginTop={-40}>
      <HStack space="md" marginBottom={24}>
        {/* Poster Skeleton */}
        <Box
          width={120}
          height={180}
          borderRadius={12}
          backgroundColor="#270a39"
        />

        <VStack flex={1} space="xs">
          {/* Title Skeleton */}
          <Box
            width="80%"
            height={24}
            borderRadius={8}
            backgroundColor="#270a39"
          />
          <Box
            width="60%"
            height={16}
            borderRadius={8}
            backgroundColor="#270a39"
            marginTop={4}
          />

          {/* Overview Skeleton */}
          <Box
            width="100%"
            height={60}
            borderRadius={8}
            backgroundColor="#270a39"
            marginTop={8}
          />

          {/* Genres Skeleton */}
          <HStack space="sm" marginTop={8}>
            {[1, 2, 3].map(i => (
              <Box
                key={i}
                width={60}
                height={24}
                borderRadius={16}
                backgroundColor="#270a39"
              />
            ))}
          </HStack>
        </VStack>
      </HStack>

      {/* Metadata Skeleton */}
      <Box
        backgroundColor="#270a39"
        padding={16}
        borderRadius={16}
        marginBottom={24}>
        <HStack justifyContent="space-around">
          {[1, 2, 3, 4].map(i => (
            <VStack key={i} alignItems="center" space="xs">
              <Box
                width={20}
                height={20}
                borderRadius={10}
                backgroundColor="rgba(255, 255, 255, 0.1)"
              />
              <Box
                width={40}
                height={12}
                borderRadius={6}
                backgroundColor="rgba(255, 255, 255, 0.1)"
              />
              <Box
                width={30}
                height={14}
                borderRadius={7}
                backgroundColor="rgba(255, 255, 255, 0.1)"
              />
            </VStack>
          ))}
        </HStack>
      </Box>

      {/* Action Buttons Skeleton */}
      <HStack space="md" marginBottom={24}>
        {[1, 2].map(i => (
          <Box
            key={i}
            flex={1}
            height={44}
            borderRadius={12}
            backgroundColor="#270a39"
          />
        ))}
      </HStack>
    </Box>
  </Box>
);

const MovieDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const loadMovieData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const movie = {
        ...route.params.movie,
        backdrop: route.params.movie.backdrop?.replace('/w500/', '/original/'),
      };

      setMovieData(movie);
      setIsLoading(false);
    };

    loadMovieData();
  }, [route.params.movie]);

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
    if (isWatched) setIsWatched(false);
  };

  const handleWatchedToggle = () => {
    if (!isWatched) {
      setIsRatingModalVisible(true);
    } else {
      setIsWatched(false);
    }
  };

  const handleFavoriteToggle = () => {
    setIsInFavorites(!isInFavorites);
  };

  const handleRemoveFromWatchlist = () => {
    setIsInWatchlist(false);
  };

  const handleRatingSubmit = ({rating, comment}) => {
    console.log('Rating:', rating, 'Comment:', comment);
    setIsWatched(true);
    if (!isInWatchlist) setIsInWatchlist(true);
  };

  const handleImagePress = imageUrl => {
    setModalImage(imageUrl);
    setIsImageModalVisible(true);
  };

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  return (
    <>
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setIsImageModalVisible(false)}>
          <Image
            source={{uri: modalImage}}
            alt="Full screen image"
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsImageModalVisible(false)}>
            <Text style={styles.closeButtonText} color="white">
              ×
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <ScrollView flex={1} backgroundColor="#040b1c">
        {/* Backdrop Image */}
        <Box height={250} width="100%">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              handleImagePress(movieData.backdrop || movieData.poster)
            }>
            <Image
              source={{uri: movieData.backdrop || movieData.poster}}
              alt={movieData.title}
              style={styles.backdropImage}
            />
          </TouchableOpacity>
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
          <Button
            position="absolute"
            top={Platform.OS === 'ios' ? 60 : 20}
            right={16}
            variant="link"
            onPress={() => {
              Share.share({
                message: `Check out ${movieData.title} on Flickture!`,
                url: `https://flickture.com/movie/${movieData.id}`,
              });
            }}>
            <ButtonIcon as={Share2} color="white" />
          </Button>
        </Box>

        {/* Content */}
        <Box padding={16} marginTop={-40}>
          {/* Poster and Title */}
          <HStack space="md" marginBottom={24}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleImagePress(movieData.poster)}>
              <Image
                source={{uri: movieData.poster}}
                alt={movieData.title}
                width={120}
                height={180}
                borderRadius={12}
              />
            </TouchableOpacity>
            <VStack flex={1} space="xs">
              <Text color="white" fontSize={24} fontWeight="600">
                {movieData.title}
              </Text>
              {movieData.originalTitle &&
                movieData.originalTitle !== movieData.title && (
                  <Text color="rgba(255, 255, 255, 0.5)" fontSize={16}>
                    {movieData.originalTitle}
                  </Text>
                )}
              {movieData.overview && (
                <Text
                  color="rgba(255, 255, 255, 0.7)"
                  fontSize={14}
                  numberOfLines={3}
                  marginTop={4}>
                  {movieData.overview}
                </Text>
              )}
              {movieData.genres && (
                <HStack space="sm" flexWrap="wrap" marginTop={8}>
                  {movieData.genres.map(genre => (
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
              value={movieData.year.toString()}
              onPress={() =>
                navigation.navigate('YearScreen', {year: movieData.year})
              }
            />
            {movieData.duration && (
              <MetadataItem
                icon={<Clock size={20} color="#dc3f72" />}
                label="Duration"
                value={movieData.duration}
                onPress={() =>
                  navigation.navigate('DurationScreen', {
                    duration: movieData.duration,
                  })
                }
              />
            )}
            <MetadataItem
              icon={<Star size={20} color="#dc3f72" />}
              label="Rating"
              value={movieData.rating.toString()}
              onPress={() =>
                navigation.navigate('RatingScreen', {rating: movieData.rating})
              }
            />
            <MetadataItem
              icon={<MessageCircle size={20} color="#dc3f72" />}
              label="Comments"
              value={(movieData.comments || 0).toString()}
              onPress={() =>
                navigation.navigate('CommentsScreen', {movieId: movieData.id})
              }
            />
          </HStack>

          {/* Action Buttons */}
          <VStack space="md" marginBottom={24}>
            <HStack space="md">
              {!isWatched ? (
                <>
                  {!isInWatchlist ? (
                    <TouchableItem
                      style={styles.actionButton}
                      onPress={handleWatchlistToggle}>
                      <HStack space="sm" alignItems="center" padding={12}>
                        <BookmarkPlus size={20} color="#dc3f72" />
                        <Text color="#dc3f72">Add to Watchlist</Text>
                      </HStack>
                    </TouchableItem>
                  ) : (
                    <TouchableItem
                      style={[styles.actionButton, styles.activeButton]}
                      onPress={handleWatchedToggle}>
                      <HStack space="sm" alignItems="center" padding={12}>
                        <Plus size={20} color="white" />
                        <Text color="white">Mark as Watched</Text>
                      </HStack>
                    </TouchableItem>
                  )}
                </>
              ) : (
                <TouchableItem
                  style={[styles.actionButton, styles.activeButton]}
                  onPress={handleWatchedToggle}>
                  <HStack space="sm" alignItems="center" padding={12}>
                    <Check size={20} color="white" />
                    <Text color="white">Watched</Text>
                  </HStack>
                </TouchableItem>
              )}
            </HStack>

            <HStack space="md">
              <TouchableItem
                style={[
                  styles.actionButton,
                  styles.secondaryButton,
                  isInFavorites && styles.activeButton,
                ]}
                onPress={handleFavoriteToggle}>
                <HStack space="sm" alignItems="center" padding={12}>
                  <Heart
                    size={20}
                    fill={isInFavorites ? 'white' : 'none'}
                    color={isInFavorites ? 'white' : '#dc3f72'}
                  />
                  <Text color={isInFavorites ? 'white' : '#dc3f72'}>
                    {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
                  </Text>
                </HStack>
              </TouchableItem>

              <TouchableItem
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() =>
                  navigation.navigate('AddToList', {movieId: movieData.id})
                }>
                <HStack space="sm" alignItems="center" padding={12}>
                  <ListPlus size={20} color="#dc3f72" />
                  <Text color="#dc3f72">Add to List</Text>
                </HStack>
              </TouchableItem>
            </HStack>

            {isInWatchlist && !isWatched && (
              <TouchableItem
                style={[styles.actionButton, styles.dangerButton]}
                onPress={handleRemoveFromWatchlist}>
                <HStack space="sm" alignItems="center" padding={12}>
                  <Trash2 size={20} color="#f44336" />
                  <Text color="#f44336">Remove from Watchlist</Text>
                </HStack>
              </TouchableItem>
            )}
          </VStack>

          {/* Overview */}
          {movieData.overview && (
            <VStack space="md" marginBottom={24}>
              <Text color="white" fontSize={20} fontWeight="600">
                Overview
              </Text>
              <Text
                color="rgba(255, 255, 255, 0.7)"
                fontSize={16}
                lineHeight={24}>
                {movieData.overview}
              </Text>
            </VStack>
          )}

          {/* Cast & Crew */}
          <VStack space="xl" marginBottom={24}>
            {movieData.director && (
              <HStack space="md" alignItems="center">
                <User size={20} color="#dc3f72" />
                <VStack>
                  <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                    Director
                  </Text>
                  <Text color="white" fontSize={16}>
                    {movieData.director}
                  </Text>
                </VStack>
              </HStack>
            )}

            {movieData.cast && movieData.cast.length > 0 && (
              <Box marginTop={8}>
                <CastList
                  cast={movieData.cast}
                  director={movieData.director}
                  crew={movieData.crew}
                />
              </Box>
            )}
          </VStack>

          {/* Collection Section */}
          {movieData.collection && (
            <CollectionSection collection={movieData.collection} />
          )}

          {/* Lists Section */}
          {movieData.appearsIn && movieData.appearsIn.length > 0 && (
            <ListsSection lists={movieData.appearsIn} />
          )}
        </Box>
      </ScrollView>

      <RatingModal
        visible={isRatingModalVisible}
        onClose={() => setIsRatingModalVisible(false)}
        onSubmit={handleRatingSubmit}
      />
    </>
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
  secondaryButton: {
    borderColor: '#dc3f72',
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#dc3f72',
    borderColor: '#dc3f72',
  },
  dangerButton: {
    borderColor: '#f44336',
    backgroundColor: 'transparent',
  },
  listThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default MovieDetailScreen;

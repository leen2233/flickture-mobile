import React, {useState} from 'react';
import {
  Box,
  ScrollView,
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  Button,
  ButtonText,
  ButtonIcon,
  Image,
  Pressable,
  Input,
  InputField,
  Spinner,
} from '@gluestack-ui/themed';
import {
  ArrowLeft,
  Star,
  Clock,
  MessageCircle,
  Heart,
  ChevronDown,
  ChevronUp,
  Send,
  Filter,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Animated,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import ImagePlaceholder from '../components/ImagePlaceholder';
import api from '../lib/api';

const timeAgo = timestamp => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60)
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  if (minutes < 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

const RatingStars = ({rating}) => (
  <HStack space="xs">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={16}
        color={i <= rating ? '#dc3f72' : 'rgba(255, 255, 255, 0.3)'}
        fill={i <= rating ? '#dc3f72' : 'none'}
      />
    ))}
  </HStack>
);

const ActionButton = ({
  onPress,
  icon,
  text,
  icon2,
  color = 'rgba(255, 255, 255, 0.7)',
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        minWidth: 80,
        paddingVertical: 8,
        // paddingHorizontal: 12,
      }}>
      <Animated.View
        style={{
          transform: [{scale}],
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 20,
          padding: 8,
        }}>
        <HStack space="sm" alignItems="center" justifyContent="center">
          {icon}
          <Text color={color} fontSize={13} fontWeight="500">
            {text}
          </Text>
          {icon2}
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

const CommentItem = ({
  id,
  user,
  rating,
  content,
  created_at,
  responses = [],
  initialLikes = 0,
  initialLiked = false,
  tmdbId,
  type,
  movieId,
  fetchComments,
  scrollToInput,
}) => {
  const [isLiked, setIsLiked] = React.useState(initialLiked);
  const [likes, setLikes] = React.useState(initialLikes);
  const [isLiking, setIsLiking] = React.useState(false);
  ``;
  const [showResponses, setShowResponses] = React.useState(false);
  const [showMainInput, setShowMainInput] = React.useState(false);
  const [responseText, setResponseText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [localResponses, setLocalResponses] = React.useState(responses);
  const [isLoadingResponses, setIsLoadingResponses] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef(null);
  const [activeResponseId, setActiveResponseId] = React.useState(null);
  const responseInputRefs = React.useRef({});
  const [inputKey, setInputKey] = React.useState(0);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await api.post(
        `/movies/${tmdbId}/${type}/comments/${id}/like/`,
      );
      const {liked, likes_count} = response.data;

      setIsLiked(liked);
      setLikes(likes_count);
    } catch (error) {
      console.error('Error liking comment:', error);
      // You might want to show an error toast here
    } finally {
      setIsLiking(false);
    }
  };

  const toggleResponses = async () => {
    setShowResponses(!showResponses);

    if (!showResponses) {
      setIsLoadingResponses(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Simulate loading responses
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoadingResponses(false);
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  React.useEffect(() => {
    if (showMainInput && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showMainInput]);

  const handleResponseButtonClick = (username, responseId) => {
    if (activeResponseId === responseId) {
      setActiveResponseId(null);
      setResponseText('');
      Keyboard.dismiss();
    } else {
      setShowMainInput(false);
      setActiveResponseId(responseId);
      setResponseText(`@${username} `);
      setInputKey(prev => prev + 1);
      scrollToInput();
    }
  };

  const handleMainResponseClick = () => {
    if (showMainInput) {
      setShowMainInput(false);
      Keyboard.dismiss();
    } else {
      setShowMainInput(true);
      setActiveResponseId(null);
      setResponseText('');
      setInputKey(prev => prev + 1);
      scrollToInput();
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;

    setIsSubmitting(true);

    console.log('Submitting response:', responseText.trim(), id, movieId);
    try {
      const response = await api.post(`/movies/${tmdbId}/${type}/comments/`, {
        content: responseText.trim(),
        parent: id,
        movie: movieId,
      });

      const newComment = response.data;

      if (activeResponseId !== null) {
        // If this is a response to an existing comment
        setLocalResponses(prev => [...prev, newComment]);
        setShowResponses(true);
      } else {
        // If this is a new main comment, it will be fetched with the next comments refresh
        fetchComments(1); // Refresh the comments list
      }

      // Reset all input states
      setIsSubmitting(false);
      setResponseText('');
      setShowMainInput(false);
      setActiveResponseId(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setIsSubmitting(false);
      // You might want to show an error toast here
    }
  };

  return (
    <VStack space="sm" padding={16} paddingBottom={0}>
      <HStack space="md" alignItems="center">
        <Image
          source={{uri: user.avatar}}
          alt={user.username}
          width={48}
          height={48}
          borderRadius={24}
          borderColor="#dc3f72"
          borderWidth={2}
        />
        <VStack flex={1}>
          <Text color="white" fontSize={16} fontWeight="600">
            {user.username}
          </Text>
          <HStack space="md" alignItems="center">
            <RatingStars rating={rating} />
            <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
              {timeAgo(created_at)}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
        {content}
      </Text>

      {/* Action Buttons */}
      <HStack
        space="sm"
        marginBottom={showMainInput ? 8 : 0}
        alignItems="center"
        justifyContent="space-between">
        <ActionButton
          onPress={toggleResponses}
          icon={
            <HStack space="xs" alignItems="center">
              <MessageCircle size={18} color="rgba(255, 255, 255, 0.7)" />
            </HStack>
          }
          text={`${localResponses.length} ${
            localResponses.length <= 1 ? 'Response' : 'Responses'
          }`}
          icon2={
            localResponses.length > 0 && showResponses ? (
              <ChevronUp size={16} color="rgba(255, 255, 255, 0.7)" />
            ) : localResponses.length > 0 ? (
              <ChevronDown size={16} color="rgba(255, 255, 255, 0.7)" />
            ) : null
          }
        />

        <ActionButton
          onPress={handleLike}
          icon={
            isLiking ? (
              <Spinner
                size="small"
                color={isLiked ? '#dc3f72' : 'rgba(255, 255, 255, 0.7)'}
              />
            ) : (
              <Heart
                size={18}
                color={isLiked ? '#dc3f72' : 'rgba(255, 255, 255, 0.7)'}
                fill={isLiked ? '#dc3f72' : 'none'}
              />
            )
          }
          text={`${likes} ${likes === 1 ? 'Like' : 'Likes'}`}
          color={isLiked ? '#dc3f72' : 'rgba(255, 255, 255, 0.7)'}
        />

        <ActionButton
          onPress={handleMainResponseClick}
          icon={<MessageCircle size={18} color="#dc3f72" />}
          text={showMainInput ? 'Close' : 'Write Response'}
          color="#dc3f72"
        />
      </HStack>

      {/* Main Response Input */}
      {showMainInput && (
        <HStack
          space="sm"
          alignItems="center"
          backgroundColor="#270a39"
          padding={12}
          borderRadius={12}>
          <Input
            flex={1}
            variant="rounded"
            size="md"
            backgroundColor="rgba(255, 255, 255, 0.1)"
            borderWidth={0}>
            <InputField
              key={inputKey}
              autoFocus={true}
              color="white"
              placeholder="Write your response..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={responseText}
              onChangeText={setResponseText}
              onSubmitEditing={handleSubmitResponse}
            />
          </Input>
          <Button
            variant="solid"
            backgroundColor={
              responseText.trim() ? '#dc3f72' : 'rgba(255, 255, 255, 0.1)'
            }
            borderRadius={20}
            onPress={handleSubmitResponse}
            disabled={!responseText.trim() || isSubmitting}
            padding={8}
            width={44}
            height={44}>
            {isSubmitting ? (
              <Spinner color="white" size="small" />
            ) : (
              <Send size={20} color="white" />
            )}
          </Button>
        </HStack>
      )}

      {/* Responses Section */}
      {localResponses.length > 0 && (
        <Animated.View
          style={{
            opacity: slideAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}>
          {showResponses && (
            <VStack space="sm" marginTop={12} paddingLeft={16}>
              {isLoadingResponses ? (
                <Box
                  padding={12}
                  backgroundColor="#270a39"
                  borderRadius={12}
                  height={80}
                  alignItems="center"
                  justifyContent="center">
                  <VStack space="sm" alignItems="center">
                    <Spinner color="#dc3f72" size="small" />
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize={13}>
                      Loading responses...
                    </Text>
                  </VStack>
                </Box>
              ) : (
                localResponses.map((response, index) => (
                  <VStack key={index}>
                    <VStack
                      space="xs"
                      padding={12}
                      backgroundColor="#270a39"
                      borderRadius={12}>
                      <HStack space="sm" alignItems="center">
                        <Image
                          source={{uri: response.user.avatar}}
                          alt={response.user.username}
                          width={32}
                          height={32}
                          borderRadius={16}
                          borderColor="#dc3f72"
                          borderWidth={1}
                        />
                        <VStack flex={1}>
                          <Text color="white" fontSize={14} fontWeight="600">
                            {response.user.username}
                          </Text>
                          <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                            {timeAgo(response.created_at)}
                          </Text>
                        </VStack>
                        <ActionButton
                          onPress={() =>
                            handleResponseButtonClick(
                              response.user.username,
                              index,
                            )
                          }
                          icon={<MessageCircle size={16} color="#dc3f72" />}
                          text={activeResponseId === index ? 'Close' : 'Reply'}
                          color="#dc3f72"
                        />
                      </HStack>
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize={13}>
                        {response.content}
                      </Text>
                    </VStack>

                    {/* Response Input for this specific response */}
                    {activeResponseId === index && (
                      <HStack
                        space="sm"
                        alignItems="center"
                        backgroundColor="#270a39"
                        padding={12}
                        borderRadius={12}
                        marginTop={8}>
                        <Input
                          flex={1}
                          variant="rounded"
                          size="md"
                          backgroundColor="rgba(255, 255, 255, 0.1)"
                          borderWidth={0}>
                          <InputField
                            key={inputKey}
                            autoFocus={true}
                            color="white"
                            placeholder="Write your response..."
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={responseText}
                            onChangeText={setResponseText}
                            onSubmitEditing={() => {
                              handleSubmitResponse(response.id);
                            }}
                          />
                        </Input>
                        <Button
                          variant="solid"
                          backgroundColor={
                            responseText.trim()
                              ? '#dc3f72'
                              : 'rgba(255, 255, 255, 0.1)'
                          }
                          borderRadius={20}
                          onPress={handleSubmitResponse}
                          disabled={!responseText.trim() || isSubmitting}
                          padding={8}
                          width={44}
                          height={44}>
                          {isSubmitting ? (
                            <Spinner color="white" size="small" />
                          ) : (
                            <Send size={20} color="white" />
                          )}
                        </Button>
                      </HStack>
                    )}
                  </VStack>
                ))
              )}
            </VStack>
          )}
        </Animated.View>
      )}
    </VStack>
  );
};

const MovieHeader = ({movie}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigation = useNavigation();
  return (
    <Box>
      <Box height={350} width="100%" position="relative">
        {!isImageLoaded && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(39, 10, 57, 0.5)"
          />
        )}
        <Image
          source={{uri: movie.backdrop_url}}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            backgroundColor: 'rgba(4, 11, 28, 0.8)',
          }}
        />

        {/* Header with back button */}
        <HStack
          padding={16}
          paddingTop={Platform.OS === 'ios' ? 60 : 20}
          space="md"
          alignItems="center">
          <Button
            variant="link"
            onPress={() => navigation.goBack()}
            padding={0}
            margin={0}>
            <ButtonIcon as={ArrowLeft} color="white" />
          </Button>
          <Text color="white" fontSize={20} fontWeight="600">
            Comments & Reviews
          </Text>
        </HStack>

        {/* Movie Info */}
        <VStack
          space="xs"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          padding={16}>
          <Text color="white" fontSize={24} fontWeight="600">
            {movie.title}
          </Text>
          <HStack space="md" alignItems="center" flexWrap="wrap">
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
              {movie.year}
            </Text>
            <HStack space="xs" alignItems="center">
              <Star size={16} color="#dc3f72" fill="#dc3f72" />
              <Text color="white" fontSize={14}>
                {movie.rating}
              </Text>
            </HStack>
            <HStack space="xs" alignItems="center">
              <Clock size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                {movie.duration}
              </Text>
            </HStack>
            <HStack space="xs" alignItems="center">
              <MessageCircle size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                {movie.comments}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

const FilterSection = ({
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
}) => {
  const ratings = [0, 5, 4, 3, 2, 1];
  const sortOptions = [
    {label: 'Most Recent', value: 'date'},
    {label: 'Most Liked', value: 'likes'},
    {label: 'Highest Rating', value: 'rating'},
  ];

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <VStack space="sm" padding={16}>
      <Pressable onPress={toggleFilters}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          paddingVertical={4}>
          <HStack space="md" alignItems="center">
            <Filter size={16} color="rgba(255, 255, 255, 0.7)" />
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
              Filters
            </Text>
          </HStack>
          <HStack space="xs" alignItems="center">
            <Text color="#dc3f72" fontSize={14}>
              {showFilters ? 'Hide' : 'Show'}
            </Text>
            <ChevronDown
              size={16}
              color="#dc3f72"
              style={{
                transform: [{rotate: showFilters ? '180deg' : '0deg'}],
              }}
            />
          </HStack>
        </HStack>
      </Pressable>

      {showFilters && (
        <VStack space="md" marginTop={8}>
          <VStack space="sm">
            <Text color="white" fontSize={14} fontWeight="600">
              Rating
            </Text>
            <HStack space="sm">
              {ratings.map(rating => (
                <Pressable
                  key={rating}
                  onPress={() => setSelectedRating(rating)}
                  style={{
                    backgroundColor:
                      selectedRating === rating
                        ? '#dc3f72'
                        : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 20,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    minWidth: 44,
                    alignItems: 'center',
                  }}>
                  <Text
                    color={
                      selectedRating === rating
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.7)'
                    }
                    fontSize={13}>
                    {rating === 0 ? 'All' : `${rating}★`}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </VStack>

          <VStack space="sm">
            <Text color="white" fontSize={14} fontWeight="600">
              Sort By
            </Text>
            <HStack space="sm">
              {sortOptions.map(option => (
                <Pressable
                  key={option.value}
                  onPress={() => setSortBy(option.value)}
                  style={{
                    backgroundColor:
                      sortBy === option.value
                        ? '#dc3f72'
                        : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 20,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                  }}>
                  <Text
                    color={
                      sortBy === option.value
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.7)'
                    }
                    fontSize={13}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};

const LoadingIndicator = () => (
  <Box
    position="absolute"
    top={25}
    left={0}
    right={0}
    zIndex={999}
    alignItems="center"
    paddingTop={4}>
    <HStack
      space="sm"
      alignItems="center"
      backgroundColor="rgba(220, 63, 114, 0.9)"
      paddingHorizontal={16}
      paddingVertical={8}
      borderRadius={20}>
      <Spinner color="white" size="small" />
      <Text color="white" fontSize={14} fontWeight="500">
        Loading more comments...
      </Text>
    </HStack>
  </Box>
);

const EndMessage = () => (
  <Box padding={16} alignItems="center">
    <VStack space="xs" alignItems="center">
      <MessageCircle size={24} color="rgba(255, 255, 255, 0.5)" />
      <Text color="rgba(255, 255, 255, 0.5)" fontSize={14} textAlign="center">
        You've reached the end of comments
      </Text>
    </VStack>
  </Box>
);

const InitialLoadingState = () => (
  <VStack space="lg" padding={16}>
    {[1, 2, 3].map(i => (
      <Box
        key={i}
        backgroundColor="#270a39"
        padding={16}
        borderRadius={12}
        opacity={0.7}>
        <HStack space="md" alignItems="center" marginBottom={12}>
          <Box
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor="rgba(255, 255, 255, 0.1)"
          />
          <VStack space="xs" flex={1}>
            <Box
              width={120}
              height={16}
              borderRadius={8}
              backgroundColor="rgba(255, 255, 255, 0.1)"
            />
            <Box
              width={80}
              height={12}
              borderRadius={6}
              backgroundColor="rgba(255, 255, 255, 0.1)"
            />
          </VStack>
        </HStack>
        <Box
          width="100%"
          height={32}
          borderRadius={8}
          backgroundColor="rgba(255, 255, 255, 0.1)"
        />
      </Box>
    ))}
  </VStack>
);

const CommentsScreen = ({route}) => {
  const navigation = useNavigation();
  const {tmdbId, type, movie} = route.params;
  const [selectedRating, setSelectedRating] = React.useState(0);
  const [sortBy, setSortBy] = React.useState('date');
  const [showFilters, setShowFilters] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const scrollViewRef = React.useRef(null);

  // We'll fetch this from API too in a real implementation
  const moviee = {
    id: 1,
    title: 'Inception',
    originalTitle: 'Inception',
    poster: 'https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
    year: 2010,
    rating: 8.8,
    duration: '148 min',
    overview:
      "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception, the implantation of another person's idea into a target's subconscious.",
    comments: 324,
  };

  const [allComments, setAllComments] = React.useState([]);

  const fetchComments = React.useCallback(
    async (pageNum = 1) => {
      if (isLoading || (!hasMore && pageNum > 1)) return;

      try {
        if (pageNum === 1) {
          setIsInitialLoading(true);
        } else {
          setIsLoading(true);
        }

        const response = await api.get(
          `/movies/${tmdbId}/${type}/comments/?page=${pageNum}&rating=${selectedRating}&sort_by=${sortBy}`,
        );
        console.log(response, 'resposne');

        const newComments = response.data.results;

        if (pageNum === 1) {
          setAllComments(newComments);
        } else {
          setAllComments(prev => [...prev, ...newComments]);
        }

        setHasMore(!!response.data.next);
        setPage(pageNum);
      } catch (error) {
        console.error('Error fetching comments:', error);
        console.log(error.response);
        // You might want to show an error toast here
      } finally {
        setIsInitialLoading(false);
        setIsLoading(false);
      }
    },
    [tmdbId, selectedRating, sortBy, isLoading, hasMore],
  );

  // Initial load of comments
  React.useEffect(() => {
    fetchComments(1);
  }, [selectedRating, sortBy]);

  const handleScroll = React.useCallback(
    ({nativeEvent}) => {
      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
      const paddingToBottom = 20;

      const currentPosition = layoutMeasurement.height + contentOffset.y;
      const totalHeight = contentSize.height;
      const isCloseToBottom = currentPosition >= totalHeight - paddingToBottom;

      if (isCloseToBottom && !isLoading && hasMore) {
        fetchComments(page + 1);
      }
    },
    [fetchComments, isLoading, hasMore, page],
  );

  // No need for filteredAndSortedComments since API handles filtering and sorting
  const comments = allComments;

  const scrollToInput = (yOffset = 300) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: yOffset,
        animated: true,
      });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <Box flex={1} backgroundColor="#040b1c">
        {isLoading && <LoadingIndicator />}

        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 20}}>
          <MovieHeader movie={movie} />
          <FilterSection
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {isInitialLoading ? (
            <InitialLoadingState />
          ) : (
            <VStack space="sm">
              {comments.map(comment => (
                <React.Fragment key={comment.id}>
                  <CommentItem
                    {...comment}
                    initialLikes={comment.likes_count}
                    initialLiked={comment.is_liked}
                    tmdbId={tmdbId}
                    type={type}
                    movieId={movie.id}
                    fetchComments={fetchComments}
                    scrollToInput={scrollToInput}
                  />
                  <Divider bg="rgba(255, 255, 255, 0.1)" />
                </React.Fragment>
              ))}
              {!hasMore && <EndMessage />}
              {isLoading && (
                <Box padding={16} alignItems="center">
                  <Spinner color="#dc3f72" size="small" />
                </Box>
              )}
            </VStack>
          )}
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  poster: {
    width: 100,
    height: 150,
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default CommentsScreen;

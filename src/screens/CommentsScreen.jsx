import React from 'react';
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
import {StyleSheet, Platform, Animated} from 'react-native';

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
        </HStack>
      </Animated.View>
    </Pressable>
  );
};

const CommentItem = ({
  user,
  rating,
  comment,
  date,
  responses = [],
  initialLikes = 0,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(initialLikes);
  const [showResponses, setShowResponses] = React.useState(false);
  const [showResponseInput, setShowResponseInput] = React.useState(false);
  const [responseText, setResponseText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [localResponses, setLocalResponses] = React.useState(responses);
  const [isLoadingResponses, setIsLoadingResponses] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
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
    if (showResponseInput && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showResponseInput]);

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add the new response to the local state
    const newResponse = {
      user: {
        username: 'You', // This would come from your auth context
        avatar: 'https://i.pravatar.cc/300?img=5', // This would be the logged-in user's avatar
      },
      comment: responseText.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setLocalResponses(prev => [...prev, newResponse]);
    setShowResponses(true);

    // Reset the input state
    setIsSubmitting(false);
    setResponseText('');
    setShowResponseInput(false);
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
              {date}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
        {comment}
      </Text>

      {/* Action Buttons */}
      <HStack
        space="sm"
        marginBottom={showResponseInput ? 8 : 0}
        alignItems="center"
        justifyContent="space-between">
        <ActionButton
          onPress={toggleResponses}
          icon={
            <HStack space="xs" alignItems="center">
              <MessageCircle size={18} color="rgba(255, 255, 255, 0.7)" />
              {localResponses.length > 0 && showResponses ? (
                <ChevronUp size={16} color="rgba(255, 255, 255, 0.7)" />
              ) : localResponses.length > 0 ? (
                <ChevronDown size={16} color="rgba(255, 255, 255, 0.7)" />
              ) : null}
            </HStack>
          }
          text={`${localResponses.length} ${
            localResponses.length === 1 ? 'Response' : 'Responses'
          }`}
        />

        <ActionButton
          onPress={handleLike}
          icon={
            <Heart
              size={18}
              color={isLiked ? '#dc3f72' : 'rgba(255, 255, 255, 0.7)'}
              fill={isLiked ? '#dc3f72' : 'none'}
            />
          }
          text={`${likes} ${likes === 1 ? 'Like' : 'Likes'}`}
          color={isLiked ? '#dc3f72' : 'rgba(255, 255, 255, 0.7)'}
        />

        <ActionButton
          onPress={() => setShowResponseInput(!showResponseInput)}
          icon={<MessageCircle size={18} color="#dc3f72" />}
          text={showResponseInput ? 'Close' : 'Write Response'}
          color="#dc3f72"
        />
      </HStack>

      {/* Response Input */}
      {showResponseInput && (
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
              ref={inputRef}
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
                  <VStack
                    key={index}
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
                      <VStack>
                        <Text color="white" fontSize={14} fontWeight="600">
                          {response.user.username}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                          {response.date}
                        </Text>
                      </VStack>
                    </HStack>
                    <Text color="rgba(255, 255, 255, 0.7)" fontSize={13}>
                      {response.comment}
                    </Text>
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

const MovieHeader = ({movie}) => (
  <VStack space="md" padding={16} backgroundColor="#270a39">
    <HStack space="md">
      <Image
        source={{uri: movie.poster}}
        alt={movie.title}
        style={styles.poster}
        borderRadius={12}
      />
      <VStack flex={1} space="xs">
        <Text color="white" fontSize={20} fontWeight="600">
          {movie.title}
        </Text>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
          {movie.year}
        </Text>
        <HStack space="md" alignItems="center">
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
    </HStack>
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={14} numberOfLines={3}>
      {movie.overview}
    </Text>
  </VStack>
);

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
    <VStack space="sm" padding={16} backgroundColor="#270a39">
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
  const {movieId} = route.params;
  const [selectedRating, setSelectedRating] = React.useState(0);
  const [sortBy, setSortBy] = React.useState('date');
  const [showFilters, setShowFilters] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  // This would normally come from an API, using sample data for now
  const movie = {
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

  // Base comments data
  const baseComments = [
    {
      id: 1,
      user: {
        username: 'CinematicDreams',
        avatar: 'https://i.pravatar.cc/300?img=1',
      },
      rating: 5,
      comment:
        'A masterpiece that pushes the boundaries of storytelling and visual effects.',
      date: '2024-03-15',
      likes: 24,
      responses: [
        {
          user: {
            username: 'MovieBuff',
            avatar: 'https://i.pravatar.cc/300?img=3',
          },
          comment: 'Totally agree! The visual effects were groundbreaking.',
          date: '2024-03-15',
        },
        {
          user: {
            username: 'FilmCritic',
            avatar: 'https://i.pravatar.cc/300?img=4',
          },
          comment: 'The dream sequences were particularly impressive.',
          date: '2024-03-15',
        },
      ],
    },
    {
      id: 2,
      user: {
        username: 'FilmBuff42',
        avatar: 'https://i.pravatar.cc/300?img=2',
      },
      rating: 4,
      comment: 'Incredible performances and a mind-bending plot.',
      date: '2024-03-14',
      likes: 18,
      responses: [],
    },
    {
      id: 3,
      user: {
        username: 'MovieLover',
        avatar: 'https://i.pravatar.cc/300?img=6',
      },
      rating: 5,
      comment: 'This movie changed how I think about cinema. Pure brilliance!',
      date: '2024-03-13',
      likes: 15,
      responses: [],
    },
  ];

  // State for all loaded comments
  const [allComments, setAllComments] = React.useState([]);

  // Initial load of comments
  React.useEffect(() => {
    const loadInitialComments = async () => {
      // Simulate initial API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAllComments(baseComments);
      setIsInitialLoading(false);
    };

    loadInitialComments();
  }, []);

  const loadMoreComments = React.useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate new comments based on base comments
    const newComments = baseComments.map(comment => ({
      ...comment,
      id: comment.id + page * baseComments.length,
      date: new Date(
        new Date(comment.date).getTime() - page * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split('T')[0],
    }));

    setAllComments(prev => [...prev, ...newComments]);
    setPage(prev => prev + 1);

    // Stop after 3 pages
    if (page >= 3) {
      setHasMore(false);
    }

    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  const handleScroll = React.useCallback(
    ({nativeEvent}) => {
      const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
      const paddingToBottom = 20; // Reduced padding to trigger earlier

      // Calculate scroll position percentage
      const currentPosition = layoutMeasurement.height + contentOffset.y;
      const totalHeight = contentSize.height;
      const isCloseToBottom = currentPosition >= totalHeight - paddingToBottom;

      if (isCloseToBottom && !isLoading && hasMore) {
        loadMoreComments();
      }
    },
    [loadMoreComments, isLoading, hasMore],
  );

  const filteredAndSortedComments = React.useMemo(() => {
    let filtered = [...allComments];

    // Apply rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(comment => comment.rating === selectedRating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'rating':
          return b.rating - a.rating;
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [allComments, selectedRating, sortBy]);

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <HStack
        padding={16}
        paddingTop={Platform.OS === 'ios' ? 60 : 20}
        space="md"
        alignItems="center"
        backgroundColor="#270a39">
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

      {isLoading && <LoadingIndicator />}

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
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
            {filteredAndSortedComments.map(comment => (
              <React.Fragment key={comment.id}>
                <CommentItem {...comment} initialLikes={comment.likes} />
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
  );
};

const styles = StyleSheet.create({
  poster: {
    width: 100,
    height: 150,
  },
});

export default CommentsScreen;

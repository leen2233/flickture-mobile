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
  Pressable,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Spinner,
} from '@gluestack-ui/themed';
import {ArrowLeft, Search, User2} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, Dimensions, Animated} from 'react-native';
import ImagePlaceholder from '../components/ImagePlaceholder';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = 12;
const NUM_COLUMNS = 3;
const ITEM_WIDTH =
  (SCREEN_WIDTH - (32 + GRID_SPACING * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

const ArtistCard = ({artist, role, department}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        const artistId = artist.name.toLowerCase().replace(/\s+/g, '-');
        navigation.navigate('ArtistDetailScreen', {artistId});
      }}>
      <VStack alignItems="center" space="sm" width={ITEM_WIDTH}>
        <Box
          width={ITEM_WIDTH}
          height={ITEM_WIDTH * 1.5}
          borderRadius={12}
          overflow="hidden"
          backgroundColor="#270a39">
          {!isImageLoaded && (
            <ImagePlaceholder width={ITEM_WIDTH} height={ITEM_WIDTH * 1.5} />
          )}
          {artist.image ? (
            <Image
              source={{uri: artist.image}}
              alt={artist.name}
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * 1.5}
              onLoad={() => setIsImageLoaded(true)}
              style={[styles.artistImage, !isImageLoaded && styles.hiddenImage]}
            />
          ) : (
            <Box
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * 1.5}
              alignItems="center"
              justifyContent="center"
              backgroundColor="#270a39">
              <User2 size={40} color="rgba(255, 255, 255, 0.3)" />
            </Box>
          )}
          {department && (
            <Box
              position="absolute"
              top={8}
              left={8}
              backgroundColor="rgba(220, 63, 114, 0.9)"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={8}>
              <Text color="white" fontSize={10} fontWeight="600">
                {department}
              </Text>
            </Box>
          )}
        </Box>
        <VStack alignItems="center" space="xs" paddingHorizontal={4}>
          <Text
            color="white"
            fontSize={14}
            fontWeight="600"
            textAlign="center"
            numberOfLines={1}>
            {artist.name}
          </Text>
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={12}
            textAlign="center"
            numberOfLines={2}
            height={32}>
            {role}
          </Text>
        </VStack>
      </VStack>
    </Pressable>
  );
};

const CrewSection = ({title, crew}) => {
  if (!crew || crew.length === 0) return null;

  return (
    <VStack space="md" marginBottom={24}>
      <HStack justifyContent="space-between" alignItems="center">
        <Text color="white" fontSize={20} fontWeight="600">
          {title}
        </Text>
        <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
          {crew.length} {crew.length === 1 ? 'person' : 'people'}
        </Text>
      </HStack>
      <Box>
        <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
          {crew.map((person, index) => (
            <Box
              key={index}
              paddingHorizontal={GRID_SPACING / 2}
              marginBottom={GRID_SPACING}
              width={`${100 / NUM_COLUMNS}%`}>
              <ArtistCard
                artist={person}
                role={person.role || person.job}
                department={person.department}
              />
            </Box>
          ))}
        </HStack>
      </Box>
    </VStack>
  );
};

const LoadingSkeleton = () => {
  const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [fadeAnim]);

  const SkeletonCard = () => (
    <Box
      paddingHorizontal={GRID_SPACING / 2}
      marginBottom={GRID_SPACING}
      width={`${100 / NUM_COLUMNS}%`}>
      <VStack alignItems="center" space="sm" width={ITEM_WIDTH}>
        <Animated.View
          style={{
            width: ITEM_WIDTH,
            height: ITEM_WIDTH * 1.5,
            borderRadius: 12,
            backgroundColor: '#270a39',
            opacity: fadeAnim,
          }}
        />
        <VStack alignItems="center" space="xs" width="100%">
          <Animated.View
            style={{
              width: '80%',
              height: 14,
              borderRadius: 7,
              backgroundColor: '#270a39',
              opacity: fadeAnim,
            }}
          />
          <Animated.View
            style={{
              width: '60%',
              height: 12,
              borderRadius: 6,
              backgroundColor: '#270a39',
              opacity: fadeAnim,
            }}
          />
        </VStack>
      </VStack>
    </Box>
  );

  const SkeletonSection = ({count = 6}) => (
    <VStack space="md" marginBottom={24}>
      <HStack justifyContent="space-between" alignItems="center">
        <Animated.View
          style={{
            width: 120,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#270a39',
            opacity: fadeAnim,
          }}
        />
      </HStack>
      <Box>
        <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
          {Array(count)
            .fill(0)
            .map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </HStack>
      </Box>
    </VStack>
  );

  return (
    <VStack space="md">
      <SkeletonSection count={9} />
      <SkeletonSection count={3} />
      <SkeletonSection count={6} />
    </VStack>
  );
};

const CastDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {cast, director, crew = []} = route.params;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  // Load data with delay
  React.useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Organize crew by department
  const directors = [
    ...(director
      ? [
          {
            name: director,
            image: 'https://via.placeholder.com/300x450',
            role: 'Director',
            department: 'Directing',
          },
        ]
      : []),
    ...crew.filter(person => person.department === 'Directing'),
  ];

  const writers = crew.filter(person => person.department === 'Writing');
  const producers = crew.filter(person => person.department === 'Production');
  const otherCrew = crew.filter(
    person =>
      !['Directing', 'Writing', 'Production'].includes(person.department),
  );

  // Filter cast and crew based on search
  const filteredCast = cast.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box flex={1} backgroundColor="#040b1c">
      {/* Header */}
      <VStack
        space="md"
        padding={16}
        paddingTop={Platform.OS === 'ios' ? 60 : 20}>
        <HStack space="md" alignItems="center">
          <Button variant="link" onPress={() => navigation.goBack()}>
            <ButtonIcon as={ArrowLeft} color="white" />
          </Button>
          <Text color="white" fontSize={20} fontWeight="600">
            Cast & Crew
          </Text>
        </HStack>

        {/* Search Bar */}
        <Input
          variant="rounded"
          size="md"
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderWidth={0}>
          <InputSlot pl="$3">
            <InputIcon as={Search} color="rgba(255, 255, 255, 0.5)" />
          </InputSlot>
          <InputField
            color="white"
            placeholder="Search cast & crew"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </VStack>

      <ScrollView flex={1} contentContainerStyle={{padding: 16}}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Cast Section */}
            <VStack space="md" marginBottom={24}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color="white" fontSize={20} fontWeight="600">
                  Cast
                </Text>
                <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                  {filteredCast.length}{' '}
                  {filteredCast.length === 1 ? 'person' : 'people'}
                </Text>
              </HStack>
              <Box>
                <HStack flexWrap="wrap" marginHorizontal={-GRID_SPACING / 2}>
                  {filteredCast.map((actor, index) => (
                    <Box
                      key={index}
                      paddingHorizontal={GRID_SPACING / 2}
                      marginBottom={GRID_SPACING}
                      width={`${100 / NUM_COLUMNS}%`}>
                      <ArtistCard
                        artist={actor}
                        role={actor.character}
                        department="Acting"
                      />
                    </Box>
                  ))}
                </HStack>
              </Box>
            </VStack>

            {/* Crew Sections */}
            {directors.length > 0 && (
              <CrewSection title="Directing" crew={directors} />
            )}
            {writers.length > 0 && (
              <CrewSection title="Writing" crew={writers} />
            )}
            {producers.length > 0 && (
              <CrewSection title="Production" crew={producers} />
            )}
            {otherCrew.length > 0 && (
              <CrewSection title="Crew" crew={otherCrew} />
            )}
          </>
        )}
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  artistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default CastDetailsScreen;

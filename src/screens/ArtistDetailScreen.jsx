import React, {useEffect, useState} from 'react';
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
  Divider,
} from '@gluestack-ui/themed';
import {
  ArrowLeft,
  Award,
  Film,
  Instagram,
  Twitter,
  Star,
  MapPin,
  Calendar,
  Share2,
  Globe,
  Ruler,
  Briefcase,
  GraduationCap,
  Heart,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Platform,
  StyleSheet,
  Linking,
  Modal,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import sampleData from '../data/sample.json';
import ArtistHeader from '../components/ArtistHeader';
import ArtistStats from '../components/ArtistStats';
import ArtistPersonalInfo from '../components/ArtistPersonalInfo';

const StatItem = ({icon, label, value}) => (
  <VStack alignItems="center" space="xs" flex={1}>
    {icon}
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={12} textAlign="center">
      {label}
    </Text>
    <Text color="white" fontSize={16} fontWeight="600" textAlign="center">
      {value}
    </Text>
  </VStack>
);

const ArtistDetailSkeleton = () => (
  <Box flex={1} backgroundColor="#040b1c">
    {/* Header Image Skeleton */}
    <Box height={400} width="100%" backgroundColor="#270a39">
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height={200}
        style={{
          backgroundColor: '#040b1c',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      />
    </Box>

    {/* Content */}
    <VStack space="xl" padding={16} marginTop={-60}>
      {/* Name and Follow Button Skeleton */}
      <HStack justifyContent="space-between" alignItems="center">
        <Box
          width={200}
          height={32}
          backgroundColor="#270a39"
          borderRadius={8}
        />
        <Box
          width={100}
          height={36}
          backgroundColor="#270a39"
          borderRadius={12}
        />
      </HStack>

      {/* Stats Skeleton */}
      <Box
        backgroundColor="#270a39"
        padding={16}
        borderRadius={16}
        marginBottom={24}>
        <HStack justifyContent="space-around">
          {[1, 2, 3].map(i => (
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

      {/* Biography Skeleton */}
      <VStack space="md">
        <Box
          width={120}
          height={24}
          backgroundColor="#270a39"
          borderRadius={8}
        />
        <Box height={100} backgroundColor="#270a39" borderRadius={12} />
      </VStack>

      {/* Personal Info Skeleton */}
      <VStack space="md">
        <Box
          width={150}
          height={24}
          backgroundColor="#270a39"
          borderRadius={8}
        />
        <VStack space="sm">
          {[1, 2, 3].map(i => (
            <HStack key={i} space="md" alignItems="center">
              <Box
                width={24}
                height={24}
                borderRadius={12}
                backgroundColor="#270a39"
              />
              <Box
                flex={1}
                height={20}
                backgroundColor="#270a39"
                borderRadius={8}
              />
            </HStack>
          ))}
        </VStack>
      </VStack>
    </VStack>
  </Box>
);

const ArtistDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const [artist, setArtist] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArtistData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const {artistId} = route.params;
        const artistData = sampleData.artists[artistId];
        if (artistData) {
          setArtist(artistData);
          setIsFollowing(artistData.isFollowing);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadArtistData();
  }, [route.params]);

  const handleSocialMediaPress = url => {
    Linking.openURL(url);
  };

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
    // Here you would typically make an API call to update the follow status
  };

  if (isLoading) {
    return <ArtistDetailSkeleton />;
  }

  if (!artist) {
    return (
      <Box
        flex={1}
        backgroundColor="#040b1c"
        justifyContent="center"
        alignItems="center">
        <Text color="white" fontSize={16} marginBottom={16}>
          Artist not found
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="#040b1c">
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
            source={{uri: artist?.image}}
            alt={artist?.name}
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

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <ArtistHeader
          artist={artist}
          navigation={navigation}
          onImagePress={() => setIsImageModalVisible(true)}
        />

        <VStack space="xl" padding={16} marginTop={-60}>
          {/* Artist Name and Follow Button */}
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="white" fontSize={32} fontWeight="600">
                {artist.name}
              </Text>
              <Button
                backgroundColor={isFollowing ? 'transparent' : '#dc3f72'}
                borderColor="#dc3f72"
                borderWidth={1}
                borderRadius={12}
                height={36}
                onPress={handleFollowPress}>
                <Text color="white" fontSize={14}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </Button>
            </HStack>
          </VStack>

          <ArtistStats stats={artist.stats} />

          {/* Biography */}
          {artist.biography && (
            <VStack space="md">
              <Text color="white" fontSize={20} fontWeight="600">
                Biography
              </Text>
              <Text
                color="rgba(255, 255, 255, 0.7)"
                fontSize={16}
                lineHeight={24}>
                {artist.biography}
              </Text>
            </VStack>
          )}

          <ArtistPersonalInfo artist={artist} />

          {/* Social Media */}
          {artist.socialMedia && (
            <VStack space="md">
              <Text color="white" fontSize={20} fontWeight="600">
                Social Media
              </Text>
              <HStack space="md">
                {artist.socialMedia.instagram && (
                  <Button
                    flex={1}
                    backgroundColor="#270a39"
                    borderRadius={12}
                    height={48}
                    onPress={() =>
                      handleSocialMediaPress(
                        `https://instagram.com/${artist.socialMedia.instagram}`,
                      )
                    }>
                    <HStack space="sm" alignItems="center">
                      <Instagram size={20} color="#dc3f72" />
                      <Text color="white" fontSize={16}>
                        Instagram
                      </Text>
                    </HStack>
                  </Button>
                )}
                {artist.socialMedia.twitter && (
                  <Button
                    flex={1}
                    backgroundColor="#270a39"
                    borderRadius={12}
                    height={48}
                    onPress={() =>
                      handleSocialMediaPress(
                        `https://twitter.com/${artist.socialMedia.twitter}`,
                      )
                    }>
                    <HStack space="sm" alignItems="center">
                      <Twitter size={20} color="#dc3f72" />
                      <Text color="white" fontSize={16}>
                        Twitter
                      </Text>
                    </HStack>
                  </Button>
                )}
              </HStack>
            </VStack>
          )}

          {/* Known For Section */}
          {artist.knownFor && artist.knownFor.length > 0 && (
            <VStack space="md">
              <Text color="white" fontSize={20} fontWeight="600">
                Known For
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.knownForContainer}>
                {artist.knownFor.map(movie => (
                  <Pressable
                    key={movie.id}
                    onPress={() => navigation.navigate('MovieDetail', {movie})}
                    style={styles.movieCard}>
                    <Image
                      source={{uri: movie.poster}}
                      alt={movie.title}
                      style={styles.moviePoster}
                    />
                    <VStack space="xs" padding={8}>
                      <Text
                        color="white"
                        fontSize={14}
                        fontWeight="600"
                        numberOfLines={1}>
                        {movie.title}
                      </Text>
                      <HStack space="xs" alignItems="center">
                        <Star size={12} color="#dc3f72" />
                        <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                          {movie.rating}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
                          • {movie.year}
                        </Text>
                      </HStack>
                    </VStack>
                  </Pressable>
                ))}
              </ScrollView>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#270a39',
  },
  knownForContainer: {
    paddingRight: 16,
  },
  movieCard: {
    width: 150,
    backgroundColor: '#270a39',
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 63, 114, 0.1)',
  },
  moviePoster: {
    width: '100%',
    height: 200,
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

export default ArtistDetailScreen;

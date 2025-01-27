import React, {useState} from 'react';
import {
  Box,
  Icon,
  VStack,
  Text,
  Image,
  Pressable,
  HStack,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import {Check, X} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import ImagePlaceholder from './ImagePlaceholder';
import {StyleSheet} from 'react-native';

const MovieCard = ({movie, listType, onUpdateStatus}) => {
  const navigation = useNavigation();
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderStatusButtons = () => {
    switch (listType) {
      case 'Recently Watched':
        return (
          <Button
            size="sm"
            variant="outline"
            borderColor="#dc3f72"
            onPress={() => onUpdateStatus(movie.id, 'remove')}>
            <ButtonText color="#dc3f72" fontSize={12}>
              Remove
            </ButtonText>
          </Button>
        );
      case 'Want to Watch':
        return (
          <HStack space="sm">
            <Button
              size="sm"
              variant="outline"
              borderColor="#4CAF50"
              onPress={() => onUpdateStatus(movie.id, 'markAsWatched')}>
              <Icon as={Check} color="#4CAF50" size="sm" mr={4} />
              <ButtonText color="#4CAF50" fontSize={12}>
                Mark as Watched
              </ButtonText>
            </Button>
            <Button
              size="sm"
              variant="outline"
              borderColor="#f44336"
              onPress={() => onUpdateStatus(movie.id, 'remove')}>
              <Icon as={X} color="#f44336" size="sm" mr={4} />
              <ButtonText color="#f44336" fontSize={12}>
                Remove
              </ButtonText>
            </Button>
          </HStack>
        );
      case 'Favorites':
        return (
          <Button
            size="sm"
            variant="outline"
            borderColor="#f44336"
            onPress={() => onUpdateStatus(movie.id, 'unfavorite')}>
            <ButtonText color="#f44336" fontSize={12}>
              Remove from Favorites
            </ButtonText>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Pressable onPress={() => navigation.navigate('MovieDetail', {movie})}>
      <Box
        flexDirection="column"
        backgroundColor="#270a39"
        padding={12}
        borderRadius={12}
        marginBottom={12}>
        <HStack space="md">
          <Box width={80} height={120}>
            {!imageLoaded && <ImagePlaceholder width={80} height={120} />}
            <Image
              source={{uri: movie.poster}}
              alt={movie.title}
              width={80}
              height={120}
              borderRadius={8}
              onLoad={() => setImageLoaded(true)}
              style={[!imageLoaded && styles.hiddenImage]}
            />
          </Box>
          <VStack flex={1} justifyContent="space-between">
            <VStack space="xs">
              <Text color="white" fontSize={16} fontWeight="600">
                {movie.title}
              </Text>
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                {movie.year}
              </Text>
              <Text color="#dc3f72" fontSize={14}>
                Rating: {movie.rating}
              </Text>
              {movie.duration && (
                <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                  Duration: {movie.duration}
                </Text>
              )}
            </VStack>
          </VStack>
        </HStack>

        <Box mt={12}>{renderStatusButtons()}</Box>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  hiddenImage: {
    opacity: 0,
    position: 'absolute',
  },
});

export default MovieCard;

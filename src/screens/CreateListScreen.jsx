import React, {useState, useEffect} from 'react';
import {
  Box,
  Center,
  HStack,
  VStack,
  Text,
  Image,
  Pressable,
  ScrollView,
  FormControl,
  Button,
  ButtonText,
  ButtonIcon,
  Input,
  InputField,
  InputIcon,
} from '@gluestack-ui/themed';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  ArrowLeft,
  Plus,
  Search,
  Image as ImageIcon,
  X,
  Star,
} from 'lucide-react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PrimaryButton, FormInput, FormTextArea} from '../elements';

const MovieItem = ({movie, onRemove}) => (
  <Box
    backgroundColor="#270a39"
    borderRadius={12}
    padding={12}
    marginBottom={12}
    borderWidth={1}
    borderColor="rgba(255, 255, 255, 0.1)">
    <HStack space="md" alignItems="center">
      <Image
        source={{uri: movie.poster}}
        alt={movie.title}
        width={60}
        height={90}
        borderRadius={8}
      />
      <VStack flex={1}>
        <Text color="white" fontSize={16} fontWeight="600">
          {movie.title}
        </Text>
        <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
          {movie.year}
        </Text>
      </VStack>
      <TouchableOpacity onPress={() => onRemove(movie.id)}>
        <Box
          backgroundColor="rgba(244, 67, 54, 0.1)"
          padding={8}
          borderRadius={20}>
          <X size={20} color="#f44336" />
        </Box>
      </TouchableOpacity>
    </HStack>
  </Box>
);

const SearchMovieModal = ({visible, onClose, onSelect}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate search with sample data
  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter sample movies based on search query
      const results = sampleData.movies.recentlyWatched.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(results);
      setIsLoading(false);
    };

    searchMovies();
  }, [searchQuery]);

  const MovieSearchItem = ({movie}) => (
    <Box
      backgroundColor="#270a39"
      borderRadius={12}
      padding={12}
      marginBottom={12}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.1)">
      <HStack space="md" alignItems="center">
        <Image
          source={{uri: movie.poster}}
          alt={movie.title}
          width={60}
          height={90}
          borderRadius={8}
        />
        <VStack flex={1} space="xs">
          <Text color="white" fontSize={16} fontWeight="600">
            {movie.title}
          </Text>
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
            {movie.year}
          </Text>
          {movie.rating && (
            <HStack space="xs" alignItems="center">
              <Star size={14} color="#dc3f72" fill="#dc3f72" />
              <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                {movie.rating}
              </Text>
            </HStack>
          )}
        </VStack>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            onSelect(movie);
            onClose();
          }}>
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </HStack>
    </Box>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.searchModalContainer}>
        <View style={styles.searchModalContent}>
          {/* Header */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom={16}>
            <Text color="white" fontSize={20} fontWeight="600">
              Add Movie
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </HStack>

          {/* Search Input */}
          <Box
            backgroundColor="#270a39"
            borderRadius={12}
            marginBottom={16}
            padding={4}>
            <Input variant="unstyled" size="md" height={48}>
              <InputIcon as={Search} color="#dc3f72" marginLeft={8} />
              <InputField
                color="white"
                placeholder="Search movies..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>

          {/* Results */}
          <ScrollView style={styles.searchResults}>
            {isLoading ? (
              <Box padding={20} alignItems="center">
                <ActivityIndicator color="#dc3f72" />
              </Box>
            ) : searchResults.length > 0 ? (
              searchResults.map(movie => (
                <MovieSearchItem key={movie.id} movie={movie} />
              ))
            ) : searchQuery ? (
              <Box padding={20} alignItems="center">
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                  No movies found
                </Text>
              </Box>
            ) : (
              <Box padding={20} alignItems="center">
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={16}>
                  Start typing to search movies
                </Text>
              </Box>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const CreateListScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [backdrop, setBackdrop] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [activeImageType, setActiveImageType] = useState(null); // 'backdrop' or 'thumbnail'
  const [errors, setErrors] = useState({});
  const [showSearchModal, setShowSearchModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'List name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!thumbnail) {
      newErrors.thumbnail = 'Please select a thumbnail image';
    }

    if (!backdrop) {
      newErrors.backdrop = 'Please select a backdrop image';
    }

    if (movies.length === 0) {
      newErrors.movies = 'Add at least one movie to the list';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
    }, 2000);
  };

  const handleImagePicker = type => {
    setActiveImageType(type);
    setShowImagePicker(true);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Flickture needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Camera permission err:', err);
        return false;
      }
    }
    return true;
  };

  const handleImageSelection = async method => {
    setShowImagePicker(false);

    if (method === 'camera') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
      includeBase64: true,
    };

    try {
      const result =
        method === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);

      if (result.didCancel || result.errorCode) {
        return;
      }

      if (result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (activeImageType === 'backdrop') {
          setBackdrop(imageUri);
          if (errors.backdrop) {
            setErrors(prev => ({...prev, backdrop: ''}));
          }
        } else if (activeImageType === 'thumbnail') {
          setThumbnail(imageUri);
          if (errors.thumbnail) {
            setErrors(prev => ({...prev, thumbnail: ''}));
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleAddMovies = () => {
    setShowSearchModal(true);
  };

  const handleRemoveMovie = movieId => {
    setMovies(prev => prev.filter(movie => movie.id !== movieId));
  };

  return (
    <>
      <ScrollView flex={1} backgroundColor="#040b1c">
        <Box>
          {/* Backdrop Section */}
          <Box position="relative" height={240}>
            {backdrop ? (
              <Image
                source={{uri: backdrop}}
                alt="List Backdrop"
                width="100%"
                height="100%"
              />
            ) : (
              <Box
                width="100%"
                height="100%"
                backgroundColor="#270a39"
                justifyContent="center"
                alignItems="center">
                <ImageIcon size={48} color="rgba(255, 255, 255, 0.3)" />
                <Text color="rgba(255, 255, 255, 0.5)" marginTop={8}>
                  Select Backdrop Image
                </Text>
              </Box>
            )}
            <Pressable
              position="absolute"
              bottom={16}
              right={16}
              backgroundColor="rgba(4, 11, 28, 0.6)"
              padding={12}
              borderRadius={12}
              borderWidth={1}
              borderColor="#dc3f72"
              onPress={() => handleImagePicker('backdrop')}>
              <Camera color="#dc3f72" size={20} />
            </Pressable>

            {/* Back Button */}
            <Pressable
              position="absolute"
              top={16}
              left={16}
              backgroundColor="rgba(4, 11, 28, 0.6)"
              padding={12}
              borderRadius={12}
              onPress={() => navigation.goBack()}>
              <ArrowLeft color="white" size={24} />
            </Pressable>
          </Box>

          {/* Content */}
          <Box
            padding={16}
            backgroundColor="#040b1c"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginTop: -20,
            }}>
            {/* Thumbnail Section */}
            <Center marginTop={-50} marginBottom={24}>
              <Box position="relative">
                {thumbnail ? (
                  <Image
                    source={{uri: thumbnail}}
                    alt="List Thumbnail"
                    width={100}
                    height={150}
                    borderRadius={12}
                    borderWidth={4}
                    borderColor="#040b1c"
                  />
                ) : (
                  <Box
                    width={100}
                    height={150}
                    borderRadius={12}
                    backgroundColor="#270a39"
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={4}
                    borderColor="#040b1c">
                    <ImageIcon size={32} color="rgba(255, 255, 255, 0.3)" />
                  </Box>
                )}
                <Pressable
                  position="absolute"
                  bottom={-10}
                  right={-10}
                  backgroundColor="#270a39"
                  padding={8}
                  borderRadius={20}
                  borderWidth={2}
                  borderColor="#dc3f72"
                  onPress={() => handleImagePicker('thumbnail')}>
                  <Camera color="#dc3f72" size={20} />
                </Pressable>
              </Box>
            </Center>

            {/* Form */}
            <VStack space="xl">
              <FormInput
                value={name}
                onChangeText={text => {
                  setName(text);
                  if (errors.name) {
                    setErrors(prev => ({...prev, name: ''}));
                  }
                }}
                label="List Name"
                error={errors.name}
              />

              <FormTextArea
                value={description}
                onChangeText={text => {
                  setDescription(text);
                  if (errors.description) {
                    setErrors(prev => ({...prev, description: ''}));
                  }
                }}
                label="Description"
                placeholder="Write about your list..."
                error={errors.description}
              />

              {/* Movies Section */}
              <VStack space="md">
                <Text color="white" fontSize={16} fontWeight="600">
                  Movies
                </Text>
                {movies.map(movie => (
                  <MovieItem
                    key={movie.id}
                    movie={movie}
                    onRemove={handleRemoveMovie}
                  />
                ))}
                <Button
                  onPress={handleAddMovies}
                  variant="outline"
                  borderColor="#dc3f72"
                  borderRadius={12}>
                  <ButtonIcon as={Plus} color="#dc3f72" marginRight={8} />
                  <ButtonText color="#dc3f72">Add Movie</ButtonText>
                </Button>
                {errors.movies && (
                  <Text color="#f44336" fontSize={12}>
                    {errors.movies}
                  </Text>
                )}
              </VStack>

              {/* Create Button */}
              <PrimaryButton onPress={handleCreate} isLoading={isLoading}>
                Create List
              </PrimaryButton>
            </VStack>
          </Box>
        </Box>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImagePicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text color="white" fontSize={20} fontWeight="600">
                Choose Image Source
              </Text>
              <TouchableOpacity
                onPress={() => setShowImagePicker(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <Text
              color="rgba(255, 255, 255, 0.7)"
              style={styles.modalDescription}>
              Select where you want to pick the image from
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={() => handleImageSelection('camera')}>
                <Text style={styles.outlineButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.filledButton]}
                onPress={() => handleImageSelection('gallery')}>
                <Text style={styles.filledButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Search Movie Modal */}
      <SearchMovieModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelect={movie => {
          if (!movies.find(m => m.id === movie.id)) {
            setMovies(prev => [...prev, movie]);
            if (errors.movies) {
              setErrors(prev => ({...prev, movies: ''}));
            }
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#270a39',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 24,
    fontWeight: '600',
  },
  modalDescription: {
    marginBottom: 24,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#dc3f72',
    backgroundColor: 'transparent',
  },
  filledButton: {
    backgroundColor: '#dc3f72',
  },
  outlineButtonText: {
    color: '#dc3f72',
    fontSize: 16,
    fontWeight: '600',
  },
  filledButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  searchModalContent: {
    flex: 1,
    backgroundColor: '#040b1c',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  searchResults: {
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#dc3f72',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CreateListScreen;

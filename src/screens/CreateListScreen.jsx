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
import {PrimaryButton, FormInput, FormTextArea} from '../elements';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useToast} from '../context/ToastContext';
import ImagePlaceholder from '../components/ImagePlaceholder';
import api from '../lib/api';

const MovieItem = ({movie, onRemove}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <Box
      backgroundColor="#151527"
      borderRadius={12}
      padding={12}
      marginBottom={12}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.1)">
      <HStack space="md" alignItems="center">
        <Box width={60} height={90}>
          {!isImageLoaded && <ImagePlaceholder width={60} height={90} />}
          <Image
            source={{uri: movie.poster_preview_url}}
            alt={movie.title}
            width={60}
            height={90}
            borderRadius={8}
            onLoad={() => setIsImageLoaded(true)}
            style={[!isImageLoaded && styles.hiddenImage]}
          />
        </Box>
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
};

const SearchMovieModal = ({visible, onClose, onSelect, selectedMovies}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  useEffect(() => {
    const searchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(
          `/movies/search/multi/?query=${encodeURIComponent(searchQuery)}`,
        );
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchMovies, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleSelect = movie => {
    const formattedMovie = {
      id: movie.tmdb_id,
      tmdb_id: movie.tmdb_id,
      type: movie.type,
      title: movie.title,
      year: movie.year,
      poster_preview_url: movie.poster_preview_url,
      rating: movie.rating,
    };
    onSelect(formattedMovie);
    setSearchQuery('');
    onClose();
  };

  const MovieSearchItem = ({movie}) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const isSelected = selectedMovies.some(m => m.tmdb_id === movie.tmdb_id);
    const posterUrl = movie.poster_preview_url;

    return (
      <Box
        backgroundColor="#151527"
        borderRadius={12}
        padding={12}
        marginBottom={12}
        borderWidth={1}
        borderColor="rgba(255, 255, 255, 0.1)">
        <HStack space="md" alignItems="center">
          <Box width={60} height={90}>
            {!isImageLoaded && <ImagePlaceholder width={60} height={90} />}
            {posterUrl && (
              <Image
                source={{uri: posterUrl}}
                alt={movie.title}
                width={60}
                height={90}
                borderRadius={8}
                onLoad={() => setIsImageLoaded(true)}
                style={[!isImageLoaded && styles.hiddenImage]}
              />
            )}
          </Box>
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
            style={[
              styles.selectButton,
              isSelected && styles.selectButtonDisabled,
            ]}
            onPress={() => handleSelect(movie)}
            disabled={isSelected}>
            <Text
              style={[
                styles.selectButtonText,
                isSelected && styles.selectButtonTextDisabled,
              ]}>
              {isSelected ? 'In List' : 'Select'}
            </Text>
          </TouchableOpacity>
        </HStack>
      </Box>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.searchModalContainer} pointerEvents="box-none">
        <View style={styles.searchModalContent} pointerEvents="box-none">
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

          <Box
            backgroundColor="#151527"
            borderRadius={12}
            marginBottom={16}
            padding={4}>
            <Input
              variant="unstyled"
              size="md"
              height={48}
              display="flex"
              alignItems="center">
              <InputIcon as={Search} color="#dc3f72" marginLeft={8} />
              <InputField
                ref={inputRef}
                color="white"
                placeholder="Search movies..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>

          <ScrollView
            style={styles.searchResults}
            keyboardShouldPersistTaps="handled">
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

const CreateListScreen = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [backdrop, setBackdrop] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [activeImageType, setActiveImageType] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSearchModal, setShowSearchModal] = useState(false);
  const {showSuccess, showError} = useToast();

  const isEditMode = route.params?.editMode;
  const listData = route.params?.list;

  useEffect(() => {
    if (isEditMode && listData) {
      setName(listData.name);
      setDescription(listData.description);
      // Don't require image selection in edit mode if images already exist
      if (listData.backdrop) {
        setErrors(prev => ({...prev, backdrop: ''}));
      }
      if (listData.thumbnail) {
        setErrors(prev => ({...prev, thumbnail: ''}));
      }
      console.log(listData.movies[0]);
      setBackdrop(listData.backdrop);
      setThumbnail(listData.thumbnail);
      setMovies(listData.movies || []);
    }
  }, [isEditMode, listData]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'List name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Only require images in create mode or if they were changed in edit mode
    if (!isEditMode) {
      if (!thumbnail) {
        newErrors.thumbnail = 'Please select a thumbnail image';
      }
      if (!backdrop) {
        newErrors.backdrop = 'Please select a backdrop image';
      }
    }

    if (movies.length === 0) {
      newErrors.movies = 'Add at least one movie to the list';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      // Only append images if they're new (start with file://) or if we're creating a new list
      if (thumbnail && (!isEditMode || thumbnail.startsWith('file://'))) {
        formData.append('thumbnail', {
          uri: thumbnail,
          type: 'image/jpeg',
          name: 'thumbnail.jpg',
        });
      }

      if (backdrop && (!isEditMode || backdrop.startsWith('file://'))) {
        formData.append('backdrop', {
          uri: backdrop,
          type: 'image/jpeg',
          name: 'backdrop.jpg',
        });
      }

      const movieIds = movies.map(movie => ({
        tmdb_id: movie.tmdb_id,
        type: movie.type,
      }));
      formData.append('movie_ids', JSON.stringify(movieIds));

      let response;
      if (isEditMode) {
        response = await api.patch(`/lists/${listData.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showSuccess('List updated successfully!');
      } else {
        response = await api.post('/lists/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showSuccess('List created successfully!');
      }

      navigation.replace('ListDetails', {
        listId: response.data.id,
        listName: response.data.name,
      });
    } catch (err) {
      console.error(
        isEditMode ? 'Error updating list:' : 'Error creating list:',
        err,
      );
      showError(isEditMode ? 'Failed to update list' : 'Failed to create list');
    } finally {
      setIsLoading(false);
    }
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

    try {
      let result;
      const cropperOptions = {
        width: activeImageType === 'thumbnail' ? 400 : 1200,
        height: activeImageType === 'thumbnail' ? 600 : 675,
        cropping: true,
        cropperCircleOverlay: false,
        mediaType: 'photo',
        cropperToolbarTitle:
          activeImageType === 'thumbnail'
            ? 'Crop List Thumbnail'
            : 'Crop List Backdrop',
        cropperToolbarColor: '#151527',
        cropperStatusBarColor: '#040b1c',
        cropperToolbarWidgetColor: '#ffffff',
        cropperActiveWidgetColor: '#dc3f72',
        cropperTintColor: '#dc3f72',
        loadingLabelText: 'Processing...',
        enableRotationGesture: true,
      };

      if (method === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
          console.log('Camera permission denied');
          return;
        }
        result = await ImageCropPicker.openCamera(cropperOptions);
      } else {
        result = await ImageCropPicker.openPicker(cropperOptions);
      }

      if (result.path) {
        if (activeImageType === 'backdrop') {
          setBackdrop(result.path);
          if (errors.backdrop) {
            setErrors(prev => ({...prev, backdrop: ''}));
          }
        } else if (activeImageType === 'thumbnail') {
          setThumbnail(result.path);
          if (errors.thumbnail) {
            setErrors(prev => ({...prev, thumbnail: ''}));
          }
        }
      }
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        console.error('Error picking image:', error);
      }
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
                backgroundColor="#151527"
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
            <Text
              position="absolute"
              top={Platform.OS === 'ios' ? 60 : 24}
              left={0}
              right={0}
              textAlign="center"
              color="white"
              fontSize={18}
              fontWeight="600">
              {isEditMode ? 'Edit List' : 'Create List'}
            </Text>
          </Box>

          <Box
            padding={16}
            backgroundColor="#040b1c"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              marginTop: -20,
            }}>
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
                    backgroundColor="#151527"
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
                  backgroundColor="#271515270a39"
                  padding={8}
                  borderRadius={20}
                  borderWidth={2}
                  borderColor="#dc3f72"
                  onPress={() => handleImagePicker('thumbnail')}>
                  <Camera color="#dc3f72" size={20} />
                </Pressable>
              </Box>
            </Center>

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
                placeholder="Enter a name for your list..."
                error={errors.name}
                marginTop={8}
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
                marginTop={4}
              />

              <VStack space="md" marginTop={8}>
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
                  borderRadius={12}
                  marginTop={4}>
                  <ButtonIcon as={Plus} color="#dc3f72" marginRight={8} />
                  <ButtonText color="#dc3f72">Add Movie</ButtonText>
                </Button>
                {errors.movies && (
                  <Text color="#f44336" fontSize={12}>
                    {errors.movies}
                  </Text>
                )}
              </VStack>

              <PrimaryButton
                onPress={handleCreate}
                isLoading={isLoading}
                marginTop={16}>
                {isEditMode ? 'Update List' : 'Create List'}
              </PrimaryButton>
            </VStack>
          </Box>
        </Box>
      </ScrollView>

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
              style={styles.modalDescription}
              color="rgba(255, 255, 255, 0.7)">
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

      <SearchMovieModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        selectedMovies={movies}
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
    backgroundColor: '#151527',
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
  selectButtonDisabled: {
    backgroundColor: 'rgba(220, 63, 114, 0.3)',
  },
  selectButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default CreateListScreen;

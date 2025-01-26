import React, {useState} from 'react';
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
} from '@gluestack-ui/themed';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Camera, ArrowLeft, Calendar} from 'lucide-react-native';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {PrimaryButton, FormInput, FormTextArea} from '../elements';
import sampleData from '../data/sample.json';
import ImageCropPicker from 'react-native-image-crop-picker';

const EditProfileScreen = ({navigation}) => {
  // Initialize state with sample data
  const {user} = sampleData;
  const [fullName, setFullName] = useState(
    `${user.firstName} ${user.lastName}`,
  );
  const [username, setUsername] = useState(user.username);
  const [birthday, setBirthday] = useState(new Date());
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [banner, setBanner] = useState(
    user.banner || 'https://picsum.photos/1600/900',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [activeImageType, setActiveImageType] = useState(null); // 'avatar' or 'banner'
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!bio.trim()) {
      newErrors.bio = 'Please write something about yourself';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
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

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: birthday,
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          setBirthday(selectedDate);
        }
      },
      mode: 'date',
      maximumDate: new Date(),
    });
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            message:
              'Flickture needs access to your camera to take profile photos',
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
    return true; // iOS permissions are handled by info.plist
  };

  const handleImageSelection = async method => {
    setShowImagePicker(false);

    try {
      let result;
      const cropperOptions = {
        width: activeImageType === 'avatar' ? 400 : 1200,
        height: activeImageType === 'avatar' ? 400 : 675,
        cropping: true,
        cropperCircleOverlay: activeImageType === 'avatar',
        mediaType: 'photo',
        // Theme customization
        cropperToolbarTitle:
          activeImageType === 'avatar'
            ? 'Crop Profile Picture'
            : 'Crop Banner Image',
        cropperToolbarColor: '#270a39',
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
        if (activeImageType === 'avatar') {
          setAvatar(result.path);
        } else if (activeImageType === 'banner') {
          setBanner(result.path);
        }
      }
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        console.error('Error picking image:', error);
      }
    }
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      <Box>
        {/* Banner Section */}
        <Box position="relative">
          <Image
            source={{uri: banner}}
            alt="Profile Banner"
            width="100%"
            height={240}
          />
          <Pressable
            position="absolute"
            bottom={32}
            right={16}
            backgroundColor="rgba(4, 11, 28, 0.6)"
            padding={12}
            borderRadius={12}
            borderWidth={1}
            borderColor="#dc3f72"
            onPress={() => handleImagePicker('banner')}>
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
          {/* Avatar Section - positioned to overlap banner */}
          <Center marginTop={-30} marginBottom={24}>
            <Box position="relative">
              <Image
                source={{uri: avatar}}
                alt="Profile Picture"
                width={100}
                height={100}
                borderRadius={50}
                borderWidth={4}
                borderColor="#040b1c"
              />
              <Pressable
                position="absolute"
                bottom={0}
                right={0}
                backgroundColor="#270a39"
                padding={8}
                borderRadius={20}
                borderWidth={2}
                borderColor="#dc3f72"
                onPress={() => handleImagePicker('avatar')}>
                <Camera color="#dc3f72" size={20} />
              </Pressable>
            </Box>
          </Center>

          {/* Form */}
          <VStack space="xl">
            <FormInput
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors(prev => ({...prev, fullName: ''}));
                }
              }}
              label={
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  Full Name
                </Text>
              }
              error={errors.fullName}
            />

            <FormInput
              value={username}
              onChangeText={text => {
                setUsername(text);
                if (errors.username) {
                  setErrors(prev => ({...prev, username: ''}));
                }
              }}
              label={
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  Username
                </Text>
              }
              autoCapitalize="none"
              error={errors.username}
            />

            <FormControl>
              <FormControl.Label>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  Birthday
                </Text>
              </FormControl.Label>
              <Pressable onPress={showDatePicker}>
                <Box
                  borderRadius={12}
                  borderColor="#341251"
                  borderWidth={1}
                  backgroundColor="#270a39"
                  padding={16}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text color="white" fontSize={16}>
                    {formatDate(birthday)}
                  </Text>
                  <Calendar color="#dc3f72" size={20} />
                </Box>
              </Pressable>
            </FormControl>

            <FormTextArea
              value={bio}
              onChangeText={text => {
                setBio(text);
                if (errors.bio) {
                  setErrors(prev => ({...prev, bio: ''}));
                }
              }}
              label="Biography"
              placeholder="Write something about yourself..."
              error={errors.bio}
            />

            {/* Save Button */}
            <PrimaryButton
              onPress={handleSave}
              isLoading={isLoading}
              marginTop={24}>
              Save Changes
            </PrimaryButton>
          </VStack>
        </Box>
      </Box>

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
    </ScrollView>
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
    color: 'rgba(255, 255, 255, 0.7)',
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
});

export default EditProfileScreen;

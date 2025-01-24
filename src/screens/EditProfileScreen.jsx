import React, {useState} from 'react';
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  HStack,
  VStack,
  Text,
  Image,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Textarea,
  TextareaInput,
} from '@gluestack-ui/themed';
import {Camera, ArrowLeft} from 'lucide-react-native';
import sampleData from '../data/sample.json';

const EditProfileScreen = ({navigation}) => {
  // Initialize state with sample data
  const {user} = sampleData;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [banner, setBanner] = useState(user.banner || 'https://picsum.photos/1600/900');

  const handleSave = () => {
    // TODO: Implement save logic
    navigation.goBack();
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
            bottom={16}
            right={16}
            backgroundColor="rgba(4, 11, 28, 0.6)"
            padding={12}
            borderRadius={12}
            borderWidth={1}
            borderColor="#dc3f72">
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
                borderColor="#dc3f72">
                <Camera color="#dc3f72" size={20} />
              </Pressable>
            </Box>
          </Center>

          {/* Form */}
          <VStack space="xl">
            <FormControl>
              <FormControl.Label>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  First Name
                </Text>
              </FormControl.Label>
              <Input
                size="xl"
                borderRadius={12}
                borderColor="#341251"
                borderWidth={1}
                backgroundColor="#270a39">
                <InputField
                  value={firstName}
                  onChangeText={setFirstName}
                  color="white"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControl.Label>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  Last Name
                </Text>
              </FormControl.Label>
              <Input
                size="xl"
                borderRadius={12}
                borderColor="#341251"
                borderWidth={1}
                backgroundColor="#270a39">
                <InputField
                  value={lastName}
                  onChangeText={setLastName}
                  color="white"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControl.Label>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  Username
                </Text>
              </FormControl.Label>
              <Input
                size="xl"
                borderRadius={12}
                borderColor="#341251"
                borderWidth={1}
                backgroundColor="#270a39">
                <InputField
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  color="white"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControl.Label>
                <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                  Biography
                </Text>
              </FormControl.Label>
              <Textarea
                size="xl"
                minHeight={120}
                borderRadius={12}
                borderColor="#341251"
                borderWidth={1}
                backgroundColor="#270a39">
                <TextareaInput
                  value={bio}
                  onChangeText={setBio}
                  color="white"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  placeholder="Write something about yourself..."
                />
              </Textarea>
            </FormControl>

            {/* Save Button */}
            <Button
              backgroundColor="#dc3f72"
              size="xl"
              borderRadius={12}
              onPress={handleSave}
              marginTop={8}>
              <ButtonText fontSize={16}>Save Changes</ButtonText>
            </Button>
          </VStack>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default EditProfileScreen; 
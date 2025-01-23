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
import {Camera} from 'lucide-react-native';

const EditProfileScreen = ({navigation}: any) => {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [username, setUsername] = useState('johndoe');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    // TODO: Implement save logic
    navigation.goBack();
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      <Box padding={16}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center" marginBottom={24}>
          <Text color="white" fontSize={24} fontWeight="600">
            Edit Profile
          </Text>
          <Button
            backgroundColor="#dc3f72"
            size="sm"
            borderRadius="$lg"
            onPress={handleSave}>
            <ButtonText>Save</ButtonText>
          </Button>
        </HStack>

        {/* Avatar Section */}
        <Center marginBottom={24}>
          <Box position="relative">
            <Image
              source={{
                uri: 'https://ui-avatars.com/api/?name=John+Doe&background=dc3f72&color=fff',
              }}
              alt="Profile Picture"
              size="2xl"
              borderRadius={100}
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
              <Camera color="#dc3f72" size={24} />
            </Pressable>
          </Box>
        </Center>

        {/* Form */}
        <VStack space="xl">
          <FormControl>
            <FormControl.Label>
              <Text color="rgba(255, 255, 255, 0.7)">First Name</Text>
            </FormControl.Label>
            <Input
              size="xl"
              borderRadius="$lg"
              borderColor="#341251"
              borderWidth={1}
              backgroundColor="#270a39">
              <InputField
                value={firstName}
                onChangeText={setFirstName}
                color="#f16b33"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Text color="rgba(255, 255, 255, 0.7)">Last Name</Text>
            </FormControl.Label>
            <Input
              size="xl"
              borderRadius="$lg"
              borderColor="#341251"
              borderWidth={1}
              backgroundColor="#270a39">
              <InputField
                value={lastName}
                onChangeText={setLastName}
                color="#f16b33"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Text color="rgba(255, 255, 255, 0.7)">Username</Text>
            </FormControl.Label>
            <Input
              size="xl"
              borderRadius="$lg"
              borderColor="#341251"
              borderWidth={1}
              backgroundColor="#270a39">
              <InputField
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                color="#f16b33"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Text color="rgba(255, 255, 255, 0.7)">Biography</Text>
            </FormControl.Label>
            <Textarea
              size="xl"
              minHeight={120}
              borderRadius="$lg"
              borderColor="#341251"
              borderWidth={1}
              backgroundColor="#270a39">
              <TextareaInput
                value={bio}
                onChangeText={setBio}
                color="#f16b33"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                placeholder="Write something about yourself..."
              />
            </Textarea>
          </FormControl>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default EditProfileScreen; 
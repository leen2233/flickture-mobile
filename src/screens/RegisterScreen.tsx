import React, {useState} from 'react';
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  Heading,
  Input,
  InputField,
  VStack,
  Text,
  Link,
  LinkText,
} from '@gluestack-ui/themed';

const RegisterScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Implement registration logic here
    console.log('Register pressed', {name, email, password, confirmPassword});
  };

  return (
    <Center flex={1} padding={16} backgroundColor="#040b1c">
      <VStack space="xl" width="100%">
        <Box alignItems="center" marginBottom={30}>
          <Heading size="2xl" color="#dc3f72">
            Create{'  Account'}
          </Heading>
          <Text size="sm" color="rgba(255, 255, 255, 0.7)">
            Sign up to get started
          </Text>
        </Box>

        <FormControl>
          <Input
            size="xl"
            marginBottom={0}
            borderRadius="$xl"
            borderColor="#341251"
            borderWidth={1}
            backgroundColor="#270a39">
            <InputField
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              color="#f16b33"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </Input>
        </FormControl>

        <FormControl>
          <Input
            size="xl"
            marginBottom={0}
            borderRadius="$xl"
            borderColor="#341251"
            borderWidth={1}
            backgroundColor="#270a39">
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              color="#f16b33"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </Input>
        </FormControl>

        <FormControl>
          <Input
            size="xl"
            marginBottom={0}
            borderRadius="$xl"
            borderColor="#341251"
            borderWidth={1}
            backgroundColor="#270a39">
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              color="#f16b33"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </Input>
        </FormControl>

        <FormControl>
          <Input
            size="xl"
            marginBottom={20}
            borderRadius="$xl"
            borderColor="#341251"
            borderWidth={1}
            backgroundColor="#270a39">
            <InputField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              color="#f16b33"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </Input>
        </FormControl>

        <Button
          size="lg"
          backgroundColor="#dc3f72"
          borderRadius="$xl"
          onPress={handleRegister}
          marginBottom={0}
          $hover={{
            backgroundColor: '#f16b33',
          }}>
          <ButtonText fontSize={16} fontWeight="600" color="white">
            Sign Up
          </ButtonText>
        </Button>

        <Center flexDirection="row">
          <Text size="sm" color="rgba(255, 255, 255, 0.7)">
            Already have an account?{' '}
          </Text>
          <Link onPress={() => navigation?.navigate('Login')}>
            <LinkText color="#dc3f72" fontWeight="600">
              Sign In
            </LinkText>
          </Link>
        </Center>
      </VStack>
    </Center>
  );
};

export default RegisterScreen;

import React, {useState} from 'react';
import {
  Box,
  Center,
  VStack,
  Text,
  Image,
  HStack,
  Pressable,
} from '@gluestack-ui/themed';
import {PrimaryButton, FormInput} from '../elements';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Home');
    }, 3000);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Google login pressed');
  };

  return (
    <Center flex={1} padding={16} backgroundColor="#040b1c">
      <VStack space="xl" width="100%">
        <Box alignItems="center" marginBottom={32}>
          <Image
            source={require('../assets/logo.png')}
            alt="Flickture Logo"
            size="xl"
            marginBottom={12}
            resizeMode="contain"
          />
        </Box>

        <FormInput
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (errors.email) {
              setErrors(prev => ({...prev, email: ''}));
            }
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <FormInput
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) {
              setErrors(prev => ({...prev, password: ''}));
            }
          }}
          placeholder="Password"
          isPassword={true}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          marginBottom={25}
          error={errors.password}
        />

        <PrimaryButton onPress={handleLogin} isLoading={isLoading}>
          Sign In
        </PrimaryButton>

        <PrimaryButton
          variant="outline"
          onPress={handleGoogleLogin}
          marginBottom={16}>
          <HStack space="sm" alignItems="center">
            <Image
              source={require('../assets/google-icon.png')}
              alt="Google Icon"
              size="sm"
              width={20}
              height={20}
              resizeMode="contain"
            />
            <Text color="white" fontSize={16} fontWeight="600">
              Continue with Google
            </Text>
          </HStack>
        </PrimaryButton>

        <Center flexDirection="row">
          <Text size="sm" color="rgba(255, 255, 255, 0.7)">
            New to Flickture?{' '}
          </Text>
          <Pressable
            onPress={() => navigation?.navigate('Register')}
            $active={{
              opacity: 0.7,
            }}>
            <Text color="#dc3f72" fontWeight="600">
              Join now
            </Text>
          </Pressable>
        </Center>
      </VStack>
    </Center>
  );
};

export default LoginScreen;

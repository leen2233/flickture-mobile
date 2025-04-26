import React, {useEffect, useState} from 'react';
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
import {useAuth} from '../context/AuthContext';
import {useToast} from '../context/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const {login, loading, user, fetchUser} = useAuth();
  const {showSuccess} = useToast();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        console.log('user found');
        navigation.replace('Home');
      }
      console.log('checking user');
      console.log(await AsyncStorage.getItem('token'), 'checked');
      if (await AsyncStorage.getItem('token')) {
        console.log('token found');
        if (await fetchUser()) {
          console.log('user found');
          navigation.replace('Home');
        }
      }
    };

    checkUser();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = 'Username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    const success = await login(username, password);
    if (success) {
      showSuccess('Login successful');
      navigation.replace('Home');
    }
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
          value={username}
          onChangeText={text => {
            setUsername(text);
            if (errors.username) {
              setErrors(prev => ({...prev, username: ''}));
            }
          }}
          placeholder="Username"
          keyboardType="text"
          autoCapitalize="none"
          error={errors.username}
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

        <PrimaryButton onPress={handleLogin} isLoading={loading}>
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

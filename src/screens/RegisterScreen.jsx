import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Center,
  Heading,
  VStack,
  Text,
  Pressable,
} from '@gluestack-ui/themed';
import {PrimaryButton, FormInput} from '../elements';
import {useAuth} from '../context/AuthContext';
import api from '../lib/api';

const RegisterScreen = ({navigation}) => {
  const {fetchUser} = useAuth();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = 'Username is required';
    }

    if (!name) {
      newErrors.name = 'Name is required';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register/', {
        username,
        email,
        password,
        full_name: name,
      });

      const {token} = response.data;
      await AsyncStorage.setItem('token', token);
      await fetchUser();
      navigation.navigate('Home');
    } catch (error) {
      const serverErrors = error.response?.data || {};
      const newErrors = {};

      if (serverErrors.username) {
        newErrors.username = serverErrors.username[0];
      }
      if (serverErrors.email) {
        newErrors.email = serverErrors.email[0];
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
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

        <FormInput
          value={username}
          onChangeText={text => {
            setUsername(text);
            if (errors.username) {
              setErrors(prev => ({...prev, username: ''}));
            }
          }}
          placeholder="Username"
          autoCapitalize="none"
          error={errors.username}
        />

        <FormInput
          value={name}
          onChangeText={text => {
            setName(text);
            if (errors.name) {
              setErrors(prev => ({...prev, name: ''}));
            }
          }}
          placeholder="Full Name"
          error={errors.name}
        />

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
          error={errors.password}
        />

        <FormInput
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors(prev => ({...prev, confirmPassword: ''}));
            }
          }}
          placeholder="Confirm Password"
          isPassword={true}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          marginBottom={20}
          error={errors.confirmPassword}
        />

        <PrimaryButton onPress={handleRegister} isLoading={isLoading}>
          Sign Up
        </PrimaryButton>

        <Center flexDirection="row">
          <Text size="sm" color="rgba(255, 255, 255, 0.7)">
            Already have an account?{' '}
          </Text>
          <Pressable
            onPress={() => navigation?.navigate('Login')}
            $active={{
              opacity: 0.7,
            }}>
            <Text color="#dc3f72" fontWeight="600">
              Sign In
            </Text>
          </Pressable>
        </Center>
      </VStack>
    </Center>
  );
};

export default RegisterScreen;

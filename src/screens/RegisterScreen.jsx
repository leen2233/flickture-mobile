import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Center,
  Heading,
  VStack,
  Text,
  Pressable,
  HStack,
  Spinner,
  Image,
} from '@gluestack-ui/themed';
import {PrimaryButton, FormInput} from '../elements';
import {useAuth} from '../context/AuthContext';
import api from '../lib/api';
import {useToast} from '../context/ToastContext';
import {RefreshCcw} from 'lucide-react-native';

const RegisterScreen = ({navigation}) => {
  const {fetchUser} = useAuth();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [captchaKey, setCaptchaKey] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const {showError} = useToast();

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const response = await api.get('/auth/captcha');
      const {captcha_key, captcha_image} = response.data;
      setCaptchaKey(captcha_key);
      setCaptchaImage(captcha_image);
      setCaptchaInput('');
      setErrors(prev => {
        return {...prev, captcha_input: '', captcha_key: ''};
      });
    } catch (error) {
      console.error('Failed to load CAPTCHA:', error);
      showError('Failed to load CAPTCHA');
    } finally {
      setCaptchaLoading(false);
    }
  };

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

    if (!captchaInput) {
      newErrors.captcha_input = 'Please enter the CAPTCHA';
    }

    if (!captchaKey) {
      newErrors.captcha_key = 'CAPTCHA key is missing';
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
        captcha_input: captchaInput,
        captcha_key: captchaKey,
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

      // Handle CAPTCHA-specific errors
      if (serverErrors.captcha_input) {
        newErrors.captcha_input = Array.isArray(serverErrors.captcha_input)
          ? serverErrors.captcha_input[0]
          : serverErrors.captcha_input;
      }

      if (serverErrors.captcha_key) {
        newErrors.captcha_key = Array.isArray(serverErrors.captcha_key)
          ? serverErrors.captcha_key[0]
          : serverErrors.captcha_key;
      }

      if (serverErrors.error) {
        showError(serverErrors.error);
      } else if (!newErrors.captcha_input && !newErrors.captcha_key) {
        showError('Failed to login. Please try again.');
      }

      setErrors(newErrors);

      if (
        newErrors.captcha_input ||
        newErrors.captcha_key ||
        serverErrors.error
      ) {
        loadCaptcha();
      }
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
          error={errors.confirmPassword}
        />

        {/* CAPTCHA Section */}
        <HStack
          space="md"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={20}>
          <Box flex={5}>
            <FormInput
              value={captchaInput}
              onChangeText={text => {
                setCaptchaInput(text);
                if (errors.captcha_input) {
                  setErrors(prev => ({...prev, captcha_input: ''}));
                }
              }}
              placeholder="Enter CAPTCHA"
              keyboardType="default"
              autoCapitalize="characters"
              error={errors.captcha_input}
              // marginBottom={16}
            />
          </Box>
          <Box flex={2}>
            {captchaLoading ? (
              <Box
                height={45}
                backgroundColor="rgba(255, 255, 255, 0.1)"
                borderRadius={8}
                alignItems="center"
                justifyContent="center">
                <Spinner color="#dc3f72" />
              </Box>
            ) : captchaImage ? (
              <Image
                source={{uri: captchaImage}}
                alt="CAPTCHA"
                width="100%"
                height={45}
                borderRadius={8}
                resizeMode="contain"
                backgroundColor="rgba(255, 255, 255, 0.9)"
              />
            ) : (
              <Box
                height={60}
                backgroundColor="rgba(255, 255, 255, 0.1)"
                borderRadius={8}
                alignItems="center"
                justifyContent="center">
                <Text size="sm" color="rgba(255, 255, 255, 0.7)">
                  Failed to load CAPTCHA
                </Text>
              </Box>
            )}
          </Box>

          <Pressable
            onPress={loadCaptcha}
            disabled={captchaLoading}
            backgroundColor="rgba(255, 255, 255, 0.1)"
            borderRadius={8}
            $active={{
              opacity: 0.7,
            }}
            $disabled={{
              opacity: 0.5,
            }}>
            <Text fontSize={18}>
              <RefreshCcw color={'white'} />
            </Text>
          </Pressable>
        </HStack>

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

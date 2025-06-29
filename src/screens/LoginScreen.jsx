import React, {useEffect, useState} from 'react';
import {
  Box,
  Center,
  VStack,
  HStack,
  Text,
  Image,
  Pressable,
  Spinner,
} from '@gluestack-ui/themed';
import {PrimaryButton, FormInput} from '../elements';
import {useAuth} from '../context/AuthContext';
import {useToast} from '../context/ToastContext';
import api from '../lib/api';
import {RefreshCcw} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaKey, setCaptchaKey] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const {showSuccess, showError} = useToast();
  const {fetchUser} = useAuth();

  useEffect(() => {
    if (route.params?.message) {
      showError(route.params.message);
    }
    loadCaptcha();
  }, [route.params]);

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

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/login/', {
        login: username,
        password: password,
        captcha_input: captchaInput,
        captcha_key: captchaKey,
      });
      console.log('Login response:', response.data);
      const {token} = response.data;
      await AsyncStorage.setItem('token', token);
      await fetchUser();
      showSuccess('Login successful');
      navigation.replace('Home');
    } catch (error) {
      console.error('Login error:', error.response.data);
      const errorData = error.response?.data || {};
      const newErrors = {};

      // Handle CAPTCHA-specific errors
      if (errorData.captcha_input) {
        newErrors.captcha_input = Array.isArray(errorData.captcha_input)
          ? errorData.captcha_input[0]
          : errorData.captcha_input;
      }

      if (errorData.captcha_key) {
        newErrors.captcha_key = Array.isArray(errorData.captcha_key)
          ? errorData.captcha_key[0]
          : errorData.captcha_key;
      }

      if (errorData.error) {
        showError(errorData.error);
      } else if (!newErrors.captcha_input && !newErrors.captcha_key) {
        showError('Failed to login. Please try again.');
      }

      setErrors(newErrors);

      // If CAPTCHA is wrong or there's an error, reload CAPTCHA
      if (newErrors.captcha_input || newErrors.captcha_key || errorData.error) {
        loadCaptcha();
      }
    } finally {
      setLoading(false);
    }
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
          error={errors.password}
        />

        {/* CAPTCHA Section */}
        <VStack space="sm">
          <HStack space="md" alignItems="center" justifyContent="space-between">
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
        </VStack>

        <PrimaryButton
          onPress={handleLogin}
          isLoading={loading || captchaLoading}
          disabled={loading || captchaLoading}>
          Sign In
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

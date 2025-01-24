import React, {useState} from 'react';
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  Input,
  InputField,
  VStack,
  Text,
  Link,
  LinkText,
  Image,
} from '@gluestack-ui/themed';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('Home');
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

        <FormControl marginBottom={0}>
          <Input
            size="xl"
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

        <FormControl marginBottom={25}>
          <Input
            size="xl"
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

        <Button
          size="lg"
          backgroundColor="#dc3f72"
          borderRadius="$xl"
          onPress={handleLogin}
          marginBottom={0}
          $hover={{
            backgroundColor: '#f16b33',
          }}>
          <ButtonText fontSize={16} fontWeight="600" color="white">
            Sign In
          </ButtonText>
        </Button>

        <Center flexDirection="row">
          <Text size="sm" color="rgba(255, 255, 255, 0.7)">
            New to Flickture?{' '}
          </Text>
          <Link onPress={() => navigation?.navigate('Register')}>
            <LinkText color="#dc3f72" fontWeight="600">
              Join now
            </LinkText>
          </Link>
        </Center>
      </VStack>
    </Center>
  );
};

export default LoginScreen; 
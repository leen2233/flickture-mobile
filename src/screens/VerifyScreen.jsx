import React, {useState, useRef, useEffect} from 'react';
import {
  Box,
  Button,
  ButtonText,
  ButtonSpinner,
  Center,
  FormControl,
  Heading,
  Input,
  InputField,
  VStack,
  Text,
  HStack,
  Pressable,
} from '@gluestack-ui/themed';
import {Keyboard} from 'react-native';

const RESEND_TIMEOUT = 45; // 45 seconds timeout

const VerifyScreen = ({navigation}) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const timerRef = useRef(null);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [countdown]);

  const handleCodeChange = (text, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1) {
      if (index < 3) {
        // Move to next input
        inputRefs[index + 1].current?.focus();
      } else {
        // Last input filled, close keyboard
        Keyboard.dismiss();
      }
    } else if (text.length === 0 && index > 0) {
      // Empty input, move to previous
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Current input is empty and backspace pressed, move to previous input
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 4) {
      return; // Don't proceed if code is incomplete
    }
    setIsLoading(true);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Verification code:', verificationCode);
    // Implement verification logic here

    setIsLoading(false);
    navigation.navigate('EditProfile'); // Navigate to EditProfile screen after verification
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    // Implement resend logic here
    console.log('Resending code...');
    setCountdown(RESEND_TIMEOUT);
  };

  return (
    <Center flex={1} padding={16} backgroundColor="#040b1c">
      <VStack space="xl" width="100%">
        <Box alignItems="center" marginBottom={30}>
          <Heading size="2xl" color="#dc3f72">
            Verify Email
          </Heading>
          <Text
            size="sm"
            color="rgba(255, 255, 255, 0.7)"
            textAlign="center"
            marginTop={8}>
            Please enter the 4-digit code sent to your email
          </Text>
        </Box>

        <HStack space="md" justifyContent="center" marginBottom={30}>
          {[0, 1, 2, 3].map(index => (
            <FormControl key={index} width={55}>
              <Input
                size="xl"
                borderRadius="$xl"
                borderColor={code[index] ? '#dc3f72' : '#341251'}
                borderWidth={2}
                backgroundColor="#270a39"
                height={70}
                $focus={{
                  borderColor: '#dc3f72',
                  borderWidth: 2,
                }}>
                <InputField
                  ref={inputRefs[index]}
                  value={code[index]}
                  onChangeText={text => handleCodeChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  color="#ffffff"
                  fontSize={26}
                  fontWeight="bold"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  height="100%"
                  selectTextOnFocus={true}
                />
              </Input>
            </FormControl>
          ))}
        </HStack>

        <Button
          size="lg"
          backgroundColor="#dc3f72"
          borderRadius="$xl"
          onPress={handleVerify}
          marginBottom={16}
          opacity={code.join('').length === 4 ? 1 : 0.7}
          disabled={code.join('').length !== 4 || isLoading}
          $hover={{
            backgroundColor: '#f16b33',
          }}
          $active={{
            backgroundColor: '#b32e59',
            transform: [{scale: 0.98}],
          }}>
          {isLoading ? (
            <ButtonSpinner color="white" />
          ) : (
            <ButtonText fontSize={16} fontWeight="600" color="white">
              Verify
            </ButtonText>
          )}
        </Button>

        <Center>
          <Text size="sm" color="rgba(255, 255, 255, 0.7)">
            Didn't receive the code?{' '}
            {countdown > 0 ? (
              <Text color="rgba(255, 255, 255, 0.5)">
                Wait {countdown}s to resend
              </Text>
            ) : (
              <Pressable
                onPress={handleResend}
                $active={{
                  opacity: 0.7,
                }}>
                <Text color="#dc3f72" fontWeight="600">
                  Resend
                </Text>
              </Pressable>
            )}
          </Text>
        </Center>
      </VStack>
    </Center>
  );
};

export default VerifyScreen;

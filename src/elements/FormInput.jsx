import React from 'react';
import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
  FormControl,
  Text,
} from '@gluestack-ui/themed';
import {EyeIcon, EyeOffIcon} from 'lucide-react-native';

const FormInput = ({
  value,
  onChangeText,
  placeholder,
  type = 'text',
  label,
  marginBottom = 0,
  isPassword = false,
  showPassword,
  setShowPassword,
  keyboardType,
  autoCapitalize,
  error,
}) => {
  const getInputProps = () => {
    const props = {
      value,
      onChangeText,
      color: 'white',
      placeholderTextColor: 'rgba(255, 255, 255, 0.5)',
    };

    if (isPassword) {
      props.secureTextEntry = !showPassword;
    }

    if (keyboardType) {
      props.keyboardType = keyboardType;
    }

    if (autoCapitalize) {
      props.autoCapitalize = autoCapitalize;
    }

    return props;
  };

  return (
    <FormControl marginBottom={marginBottom} isInvalid={!!error}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      <Input
        size="xl"
        borderRadius="$xl"
        borderColor={error ? '#f44336' : '#341251'}
        borderWidth={1}
        backgroundColor="#270a39"
        $invalid={{
          borderColor: '#f44336',
          borderWidth: 1,
        }}
        $focus={{
          borderColor: error ? '#f44336' : '#dc3f72',
          borderWidth: 1,
        }}>
        <InputField placeholder={placeholder} {...getInputProps()} />
        {isPassword && (
          <InputSlot pr="$4" onPress={() => setShowPassword(!showPassword)}>
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color="white" />
          </InputSlot>
        )}
      </Input>
      {error && (
        <FormControl.Error>
          <Text color="#f44336" fontSize={12} marginTop={4}>
            {error}
          </Text>
        </FormControl.Error>
      )}
    </FormControl>
  );
};

export default FormInput;

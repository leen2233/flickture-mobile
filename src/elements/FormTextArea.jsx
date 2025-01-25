import React from 'react';
import {FormControl, Textarea, TextareaInput, Text} from '@gluestack-ui/themed';

const FormTextArea = ({
  value,
  onChangeText,
  placeholder,
  label,
  marginBottom = 0,
  minHeight = 120,
  error,
}) => {
  return (
    <FormControl marginBottom={marginBottom} isInvalid={!!error}>
      {label && (
        <FormControl.Label>
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
            {label}
          </Text>
        </FormControl.Label>
      )}
      <Textarea
        size="xl"
        minHeight={minHeight}
        borderRadius={12}
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
        <TextareaInput
          value={value}
          onChangeText={onChangeText}
          color="white"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder={placeholder}
        />
      </Textarea>
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

export default FormTextArea;

import React from 'react';
import {Button, ButtonText, ButtonSpinner} from '@gluestack-ui/themed';

const PrimaryButton = ({
  onPress,
  isLoading,
  isDisabled,
  variant = 'solid', // 'solid' | 'outline'
  children,
  marginBottom = 0,
  marginTop = 0,
  size = 'lg',
}) => {
  const getButtonStyle = () => {
    if (variant === 'outline') {
      return {
        backgroundColor: '#270a39',
        borderColor: '#341251',
        borderWidth: 1,
      };
    }
    return {
      backgroundColor: '#dc3f72',
    };
  };

  return (
    <Button
      size={size}
      borderRadius="$xl"
      onPress={onPress}
      marginBottom={marginBottom}
      marginTop={marginTop}
      isDisabled={isDisabled || isLoading}
      {...getButtonStyle()}
      $hover={{
        backgroundColor: variant === 'outline' ? '#341251' : '#f16b33',
      }}
      $active={{
        backgroundColor: variant === 'outline' ? '#1a0726' : '#b32e59',
        transform: [{scale: 0.98}],
      }}>
      {isLoading ? (
        <ButtonSpinner color="white" />
      ) : (
        <ButtonText fontSize={16} fontWeight="600" color="white">
          {children}
        </ButtonText>
      )}
    </Button>
  );
};

export default PrimaryButton;

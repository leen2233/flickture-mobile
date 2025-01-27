import React, {useEffect} from 'react';
import {Box, Text, HStack, Pressable} from '@gluestack-ui/themed';
import {X, CheckCircle} from 'lucide-react-native';
import {Animated, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const SuccessToast = ({message, onClose, duration = 3000}) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    // Slide in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();

    // Auto hide after duration
    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY}],
        },
      ]}>
      <Box
        width="100%"
        backgroundColor="#4CAF50"
        borderRadius={12}
        padding={16}
        shadowColor="#000"
        shadowOffset={{width: 0, height: 2}}
        shadowOpacity={0.25}
        shadowRadius={4}
        elevation={5}>
        <HStack space="md" alignItems="center" justifyContent="space-between">
          <HStack space="sm" alignItems="center" flex={1}>
            <CheckCircle color="white" size={24} />
            <Text color="white" fontSize={14} flex={1}>
              {message}
            </Text>
          </HStack>
          <Pressable onPress={hideToast}>
            <X color="white" size={20} />
          </Pressable>
        </HStack>
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    width: width,
  },
});

export default SuccessToast;

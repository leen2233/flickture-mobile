import React from 'react';
import {Box, Button, ButtonIcon, HStack} from '@gluestack-ui/themed';
import {ArrowLeft, Share2} from 'lucide-react-native';
import {Platform, TouchableOpacity, StyleSheet} from 'react-native';
import {Image} from '@gluestack-ui/themed';

const ArtistHeader = ({artist, navigation, onImagePress}) => {
  return (
    <Box height={400}>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="#270a39"
      />
      <TouchableOpacity activeOpacity={0.9} onPress={onImagePress}>
        <Image
          source={{uri: artist.image}}
          alt={artist.name}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={{
          linearGradient: {
            colors: ['rgba(39, 10, 57, 0.5)', '#040b1c'],
            start: [0, 0],
            end: [0, 1],
          },
        }}
      />
      <HStack
        position="absolute"
        top={Platform.OS === 'ios' ? 60 : 20}
        width="100%"
        justifyContent="space-between"
        paddingHorizontal={16}>
        <Button variant="link" onPress={() => navigation.goBack()}>
          <ButtonIcon as={ArrowLeft} color="white" />
        </Button>
        <Button variant="link" onPress={() => {}}>
          <ButtonIcon as={Share2} color="white" />
        </Button>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#270a39',
  },
});

export default ArtistHeader; 
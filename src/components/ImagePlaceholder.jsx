import React from 'react';
import {Box} from '@gluestack-ui/themed';
import {Image as ImageIcon} from 'lucide-react-native';

const ImagePlaceholder = ({width, height}) => (
  <Box
    width={width}
    height={height}
    backgroundColor="#270a39"
    borderRadius="$lg"
    justifyContent="center"
    alignItems="center">
    <ImageIcon size={24} color="rgba(255, 255, 255, 0.2)" />
  </Box>
);

export default ImagePlaceholder;

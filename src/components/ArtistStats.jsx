import React from 'react';
import {Pressable, VStack, HStack, Text} from '@gluestack-ui/themed';
import {Award, Film, Star} from 'lucide-react-native';

const StatCard = ({icon, value, label}) => (
  <Pressable
    flex={1}
    backgroundColor="#270a39"
    padding={16}
    borderRadius={16}
    borderWidth={1}
    borderColor="rgba(220, 63, 114, 0.1)">
    <VStack alignItems="center" space="xs">
      {icon}
      <Text color="white" fontSize={20} fontWeight="600">
        {value}
      </Text>
      <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
        {label}
      </Text>
    </VStack>
  </Pressable>
);

const ArtistStats = ({stats}) => {
  return (
    <HStack space="md">
      <StatCard
        icon={<Award size={24} color="#dc3f72" />}
        value={stats?.awards || 0}
        label="Awards"
      />
      <StatCard
        icon={<Star size={24} color="#dc3f72" />}
        value={stats?.nominations || 0}
        label="Nominations"
      />
      <StatCard
        icon={<Film size={24} color="#dc3f72" />}
        value={stats?.totalMovies || 0}
        label="Movies"
      />
    </HStack>
  );
};

export default ArtistStats; 
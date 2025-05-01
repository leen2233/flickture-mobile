import React from 'react';
import {VStack, HStack, Text} from '@gluestack-ui/themed';
import {
  MapPin,
  Calendar,
  Globe,
  Ruler,
  Briefcase,
  GraduationCap,
  Heart,
} from 'lucide-react-native';

const InfoItem = ({icon, text}) => (
  <HStack space="xs" alignItems="flex-start">
    {icon}
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
      {text}
    </Text>
  </HStack>
);

const ArtistPersonalInfo = ({artist}) => {
  return (
    <VStack
      space="md"
      backgroundColor="#151527"
      padding={16}
      borderRadius={16}
      borderWidth={1}
      borderColor="rgba(220, 63, 114, 0.1)">
      <Text color="white" fontSize={20} fontWeight="600">
        Personal Info
      </Text>
      <VStack space="md">
        {artist.birthPlace && (
          <InfoItem
            icon={<MapPin size={16} color="#dc3f72" />}
            text={`Born in ${artist.birthPlace}`}
          />
        )}
        {artist.birthDate && (
          <InfoItem
            icon={<Calendar size={16} color="#dc3f72" />}
            text={`Born on ${artist.birthDate}`}
          />
        )}
        {artist.nationality && (
          <InfoItem
            icon={<Globe size={16} color="#dc3f72" />}
            text={artist.nationality}
          />
        )}
        {artist.height && (
          <InfoItem
            icon={<Ruler size={16} color="#dc3f72" />}
            text={`Height: ${artist.height}`}
          />
        )}
        {artist.occupation && (
          <InfoItem
            icon={<Briefcase size={16} color="#dc3f72" />}
            text={artist.occupation.join(', ')}
          />
        )}
        {artist.education && (
          <InfoItem
            icon={<GraduationCap size={16} color="#dc3f72" />}
            text={artist.education}
          />
        )}
        {artist.spouseName && (
          <InfoItem
            icon={<Heart size={16} color="#dc3f72" />}
            text={`Married to ${artist.spouseName}`}
          />
        )}
      </VStack>
    </VStack>
  );
};

export default ArtistPersonalInfo;

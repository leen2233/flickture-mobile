import React from 'react';
import {
  Box,
  ScrollView,
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  Button,
  ButtonText,
  ButtonIcon,
} from '@gluestack-ui/themed';
import {ArrowLeft, Star} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

const RatingStars = ({rating}) => (
  <HStack space="xs">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={16}
        color={i <= rating ? '#dc3f72' : 'rgba(255, 255, 255, 0.3)'}
        fill={i <= rating ? '#dc3f72' : 'none'}
      />
    ))}
  </HStack>
);

const CommentItem = ({user, rating, comment, date}) => (
  <VStack space="sm" padding={16}>
    <HStack space="md" alignItems="center">
      <Avatar
        size="md"
        source={{uri: user.avatar}}
        borderColor="#dc3f72"
        borderWidth={2}
      />
      <VStack flex={1}>
        <Text color="white" fontSize={16} fontWeight="600">
          {user.username}
        </Text>
        <HStack space="md" alignItems="center">
          <RatingStars rating={rating} />
          <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
            {date}
          </Text>
        </HStack>
      </VStack>
    </HStack>
    <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
      {comment}
    </Text>
  </VStack>
);

const CommentsScreen = ({route}) => {
  const navigation = useNavigation();
  const {movieId} = route.params;

  // This would normally come from an API
  const movieComments = [
    {
      id: 1,
      user: {
        username: 'CinematicDreams',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      rating: 5,
      comment:
        'A masterpiece that pushes the boundaries of storytelling and visual effects.',
      date: '2024-03-15',
    },
    {
      id: 2,
      user: {
        username: 'FilmBuff42',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      rating: 4,
      comment: 'Incredible performances and a mind-bending plot.',
      date: '2024-03-14',
    },
    // Add more sample comments...
  ];

  return (
    <Box flex={1} backgroundColor="#040b1c">
      <HStack
        padding={16}
        paddingTop={Platform.OS === 'ios' ? 60 : 20}
        space="md"
        alignItems="center"
        backgroundColor="#270a39">
        <Button
          variant="link"
          onPress={() => navigation.goBack()}
          padding={0}
          margin={0}>
          <ButtonIcon as={ArrowLeft} color="white" />
        </Button>
        <Text color="white" fontSize={20} fontWeight="600">
          Comments & Reviews
        </Text>
      </HStack>

      <ScrollView>
        <VStack space="sm">
          {movieComments.map(comment => (
            <React.Fragment key={comment.id}>
              <CommentItem {...comment} />
              <Divider bg="rgba(255, 255, 255, 0.1)" />
            </React.Fragment>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  // Add any styles if needed
});

export default CommentsScreen; 
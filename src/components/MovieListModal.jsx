import React, {useMemo} from 'react';
import {Modal, View} from 'react-native';
import {
  Box,
  Text,
  Input,
  InputSlot,
  InputIcon,
  InputField,
  FlatList,
  HStack,
  VStack,
  Image,
  Pressable,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import {Search, ChevronRight} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';

const MovieListModal = ({data, title, onClose}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigation = useNavigation();

  const filteredData = useMemo(() => {
    return data.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '90%',
            maxHeight: '80%',
            backgroundColor: '#270a39',
            borderRadius: 16,
            padding: 24,
          }}>
          <Text
            color="white"
            fontSize={20}
            fontWeight="600"
            textAlign="center"
            marginBottom={16}>
            {title}
          </Text>

          <Box marginBottom={16}>
            <Input
              variant="outline"
              size="md"
              borderColor="rgba(255, 255, 255, 0.1)"
              backgroundColor="rgba(255, 255, 255, 0.05)">
              <InputSlot pl="$3">
                <InputIcon>
                  <Search size={20} color="rgba(255, 255, 255, 0.5)" />
                </InputIcon>
              </InputSlot>
              <InputField
                color="white"
                placeholder="Search movies..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>

          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  onClose();
                  navigation.navigate('MovieDetail', {movie: item});
                }}>
                <Box
                  width="100%"
                  backgroundColor="#270a39"
                  padding={16}
                  marginBottom={8}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.1)">
                  <HStack space="md" alignItems="center">
                    <Image
                      source={{uri: item.poster}}
                      alt={item.title}
                      style={{
                        width: 60,
                        height: 90,
                        borderRadius: 8,
                      }}
                    />
                    <VStack flex={1} space="xs">
                      <Text color="white" fontSize={16} fontWeight="600">
                        {item.title}
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                        {item.year}
                      </Text>
                      <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
                        Rating: {item.rating}/10
                      </Text>
                    </VStack>
                    <ChevronRight color="#dc3f72" size={20} />
                  </HStack>
                </Box>
              </Pressable>
            )}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            style={{
              flexGrow: 0,
            }}
          />
          <Button
            onPress={onClose}
            backgroundColor="#dc3f72"
            marginTop={16}
            paddingHorizontal={24}
            borderRadius={8}
            alignSelf="center">
            <ButtonText>Close</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default MovieListModal; 
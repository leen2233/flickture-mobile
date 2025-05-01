import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Image,
  Pressable,
  Input,
  InputField,
  InputIcon,
  Button,
  ButtonText,
  ButtonIcon,
} from '@gluestack-ui/themed';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {X, Plus, Search, Trash2, Loader} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import ImagePlaceholder from './ImagePlaceholder';
import api from '../lib/api';
import {BlurView} from '@react-native-community/blur';

const AddToListModal = ({movie, visible, onClose}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/lists/my_lists');
        // For each list, check if the movie exists in it
        const listsWithMovieStatus = await Promise.all(
          response.data.map(async list => {
            const movieCheck = await api.get(
              `/lists/${list.id}/check_movie/?tmdb_id=${movie.tmdb_id}&type=${movie.type}`,
            );
            return {
              ...list,
              hasMovie: movieCheck.data.exists,
            };
          }),
        );
        console.log('Lists', listsWithMovieStatus);
        setLists(listsWithMovieStatus);
      } catch (error) {
        console.error('Failed to fetch lists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (visible) {
      fetchLists();
    }
  }, [visible, movie.tmdb_id, movie.type]);

  const handleCreateList = () => {
    onClose();
    navigation.navigate('CreateList', {movie});
  };

  const handleAddToList = async listId => {
    try {
      setIsLoading(true);
      await api.post(`/lists/${listId}/add_movie/`, {
        tmdb_id: movie.tmdb_id,
        type: movie.type,
      });
      setLists(
        lists.map(list =>
          list.id === listId ? {...list, hasMovie: true} : list,
        ),
      );
    } catch (error) {
      console.error('Failed to add movie to list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromList = async listId => {
    try {
      setIsLoading(true);
      await api.post(`/lists/${listId}/remove_movie/`, {
        tmdb_id: movie.tmdb_id,
        type: movie.type,
      });
      setLists(
        lists.map(list =>
          list.id === listId ? {...list, hasMovie: false} : list,
        ),
      );
    } catch (error) {
      console.error('Failed to remove movie from list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLists = searchQuery
    ? lists.filter(list =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : lists;

  useEffect(() => {
    console.log('filtered lists', filteredLists);
  }, [filteredLists]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View blurType="dark" blurRadius={1} style={styles.modalContent}>
          {/* Header */}
          <HStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom={16}>
            <VStack>
              <Text color="white" fontSize={20} fontWeight="600">
                Add to List
              </Text>
              <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                {lists.length} {lists.length === 1 ? 'list' : 'lists'}
              </Text>
            </VStack>
            <TouchableOpacity onPress={onClose}>
              <Box
                padding={8}
                borderRadius={20}
                backgroundColor="rgba(255, 255, 255, 0.1)">
                <X size={20} color="rgba(255, 255, 255, 0.7)" />
              </Box>
            </TouchableOpacity>
          </HStack>

          {/* Search */}
          <Box marginBottom={16} borderRadius={20} padding={4}>
            <Input
              variant="unstyled"
              size="md"
              display="flex"
              alignItems="center"
              borderWidth={0.2}
              paddingLeft={10}
              borderRadius={20}>
              <InputIcon as={Search} color="white" marginLeft={8} />
              <InputField
                color="white"
                placeholder="Search your lists..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>

          {/* Create New List Button */}
          <Button
            onPress={handleCreateList}
            variant="outline"
            borderColor="#dc3f72"
            borderWidth={2}
            borderRadius={12}
            marginBottom={16}
            height={40}>
            <ButtonIcon as={Plus} color="#dc3f72" marginRight={8} />
            <ButtonText color="#dc3f72">Create New List</ButtonText>
          </Button>

          {/* Content */}
          <ScrollView style={styles.modalBody}>
            {isLoading && lists.length === 0 ? (
              <Box alignItems="center" padding={20}>
                <Loader className="spin" size={24} color="#dc3f72" />
                <Text color="rgba(255, 255, 255, 0.7)" marginTop={8}>
                  Loading your lists...
                </Text>
              </Box>
            ) : (
              <VStack space="md">
                {filteredLists.map(list => (
                  <Box
                    key={list.id}
                    // backgroundColor="#151527"
                    borderRadius={12}
                    padding={12}
                    borderWidth={1}
                    borderColor="rgba(255, 255, 255, 0.1)">
                    <HStack space="md" alignItems="center">
                      <Box
                        width={60}
                        height={90}
                        borderRadius={8}
                        overflow="hidden">
                        <Image
                          source={{uri: list.thumbnail || '/default-list.png'}}
                          alt={list.name}
                          width={60}
                          height={90}
                        />
                      </Box>
                      <VStack flex={1} space="xs">
                        <Text color="white" fontSize={16} fontWeight="600">
                          {list.name}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.5)" fontSize={14}>
                          {list.movies_count} movies
                        </Text>
                      </VStack>
                      <Button
                        variant={list.hasMovie ? 'outline' : 'solid'}
                        backgroundColor={
                          list.hasMovie ? 'transparent' : '#dc3f72'
                        }
                        borderColor={list.hasMovie ? '#f44336' : '#dc3f72'}
                        borderRadius={20}
                        height={40}
                        onPress={() =>
                          list.hasMovie
                            ? handleRemoveFromList(list.id)
                            : handleAddToList(list.id)
                        }>
                        <ButtonIcon
                          as={list.hasMovie ? Trash2 : Plus}
                          color={list.hasMovie ? '#f44336' : 'white'}
                          size={18}
                          marginRight={4}
                        />
                        <ButtonText
                          color={list.hasMovie ? '#f44336' : 'white'}
                          fontSize={14}>
                          {list.hasMovie ? 'Remove' : 'Add'}
                        </ButtonText>
                      </Button>
                    </HStack>
                  </Box>
                ))}

                {isLoading && (
                  <Box alignItems="center" padding={20}>
                    <Loader className="spin" size={24} color="#dc3f72" />
                  </Box>
                )}
              </VStack>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'rgba(30,30,31,255)',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
  },
  modalBody: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
  },
});

export default AddToListModal;

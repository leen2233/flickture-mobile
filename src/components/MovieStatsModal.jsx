import React, {useState, useEffect} from 'react';
import {Modal, VStack, ScrollView, Text, Button} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, BackHandler, View} from 'react-native';
import axiosClient from '../lib/api';
import MovieCard from './MovieCard';

const MovieStatsModal = ({isVisible, onClose, title, type, username}) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosClient.get(`/auth/user/${username}/movies/${type}/`);
        setMovies(response.data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchMovies();
    }
  }, [isVisible, username, type]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text color="white" fontSize={20} fontWeight="600">
            {title}
          </Text>
          <Button variant="link" onPress={onClose}>
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={24}>×</Text>
          </Button>
        </View>
        <ScrollView style={styles.modalBody}>
          {isLoading ? (
            <Text color="rgba(255, 255, 255, 0.7)" textAlign="center" marginTop={20}>
              Loading...
            </Text>
          ) : (
            <VStack space="md" padding={16}>
              {movies.map(item => (
                <MovieCard
                  key={item.movie.id}
                  movie={item.movie}
                  onPress={() =>
                    navigation.navigate('MovieDetail', {
                      tmdbId: item.movie.tmdb_id,
                      type: item.movie.type,
                    })
                  }
                />
              ))}
            </VStack>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#151527',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalBody: {
    flex: 1,
  },
});

export default MovieStatsModal;

import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import {Star} from 'lucide-react-native';

const RatingModal = ({visible, onClose, onSubmit}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({rating, comment});
    setRating(0);
    setComment('');
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Rate this movie</Text>
          <Text style={styles.subtitle}>
            Rating is optional, you can skip it
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}>
                <Star
                  size={32}
                  color={
                    star <= rating ? '#dc3f72' : 'rgba(255, 255, 255, 0.3)'
                  }
                  fill={star <= rating ? '#dc3f72' : 'transparent'}
                />
              </Pressable>
            ))}
          </View>

          {/* Comment Input */}
          <TextInput
            style={styles.commentInput}
            placeholder="Write your thoughts about the movie... (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}>
              <Text style={[styles.buttonText, styles.skipButtonText]}>
                Skip Rating
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#040b1c',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 8,
  },
  commentInput: {
    backgroundColor: '#151527',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc3f72',
  },
  submitButton: {
    backgroundColor: '#dc3f72',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  skipButtonText: {
    color: '#dc3f72',
  },
});

export default RatingModal;

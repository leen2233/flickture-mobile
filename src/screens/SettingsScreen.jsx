import React, {useEffect, useState} from 'react';
import {
  Box,
  ScrollView,
  Text,
  Pressable,
  HStack,
  Switch,
  VStack,
  Divider,
  Button,
  ButtonIcon,
} from '@gluestack-ui/themed';
import {
  Globe,
  Mail,
  Info,
  Lock,
  ChevronRight,
  Bell,
  Eye,
  ArrowLeft,
  Moon,
  LogOut,
} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Linking,
  Modal,
  View,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useToast} from '../context/ToastContext';
import api from '../lib/api';

const TouchableItem = ({onPress, children, style}) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          'rgba(220, 63, 114, 0.2)',
          false,
        )}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }
  return (
    <TouchableHighlight
      onPress={onPress}
      style={style}
      underlayColor="rgba(220, 63, 114, 0.1)">
      {children}
    </TouchableHighlight>
  );
};

const SettingItem = ({
  icon,
  title,
  onPress,
  value,
  type = 'navigate',
  disabled,
}) => (
  <TouchableItem onPress={onPress} style={styles.settingItem}>
    <HStack
      space="md"
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={16}>
      <HStack space="md" alignItems="center">
        {icon}
        <Text color={type === 'danger' ? '#ff4d4f' : 'white'} fontSize={16}>
          {title}
        </Text>
      </HStack>
      {type === 'navigate' && <ChevronRight size={20} color="white" />}
      {type === 'switch' && (
        <Switch
          size="md"
          value={value}
          onToggle={onPress}
          trackColor={{true: '#dc3f72', false: 'gray'}}
          isDisabled={disabled}
        />
      )}
      {type === 'select' && (
        <HStack space="sm" alignItems="center">
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={14}>
            {value}
          </Text>
          <ChevronRight size={16} color="rgba(255, 255, 255, 0.7)" />
        </HStack>
      )}
    </HStack>
  </TouchableItem>
);

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {showError} = useToast();
  const {user, updateUser, logout} = useAuth();

  useEffect(() => {
    if (user) {
      setIsPublic(user.is_public);
    }
  }, [user]);

  const handlePrivateToggle = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch('/auth/settings/', {
        is_public: !isPublic,
      });
      updateUser({...user, is_public: response.data.is_public});
    } catch (error) {
      console.error('Privacy toggle error:', error.response);
      showError(
        error.response?.data?.message || 'Failed to update privacy settings',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactPress = () => {
    Linking.openURL('mailto:support@flickture.com');
  };

  const handleAboutPress = () => {
    Linking.openURL('https://flickture.leen2233.me/about');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      showError('Failed to logout. Please try again.');
    }
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      <Box padding={16}>
        {/* Back Button and Title */}
        <HStack space="md" alignItems="center" marginBottom={24}>
          <Button variant="link" onPress={() => navigation.goBack()} p={0}>
            <ButtonIcon as={ArrowLeft} color="white" />
          </Button>
          <Text color="white" fontSize={24} fontWeight="600">
            Settings
          </Text>
        </HStack>

        <VStack space="xs">
          {/* Account Section */}
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={14}
            marginBottom={8}
            marginTop={16}>
            ACCOUNT
          </Text>
          <SettingItem
            icon={<Lock size={20} color="#dc3f72" />}
            title="Private Account"
            type="switch"
            value={!isPublic}
            onPress={handlePrivateToggle}
            disabled={isLoading}
          />
          <Divider bg="$trueGray800" />

          {/* Support Section */}
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={14}
            marginBottom={8}
            marginTop={16}>
            SUPPORT
          </Text>
          <SettingItem
            icon={<Mail size={20} color="#dc3f72" />}
            title="Contact Us"
            onPress={handleContactPress}
          />
          <SettingItem
            icon={<Info size={20} color="#dc3f72" />}
            title="About"
            onPress={handleAboutPress}
          />
          <Divider bg="$trueGray800" />

          {/* Logout Section */}
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={14}
            marginBottom={8}
            marginTop={16}>
            SESSION
          </Text>
          <SettingItem
            icon={<LogOut size={20} color="#ff4d4f" />}
            title="Logout"
            onPress={handleLogout}
            type="danger"
          />
        </VStack>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#040b1c',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  settingItem: {
    borderRadius: 12,
    marginHorizontal: -8,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  sheetItem: {
    borderRadius: 12,
    marginHorizontal: -8,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
});

export default SettingsScreen;

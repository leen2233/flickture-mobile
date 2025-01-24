import React, {useState} from 'react';
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

const TouchableItem = ({onPress, children, style}) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('rgba(220, 63, 114, 0.2)', false)}>
        <View style={style}>
          {children}
        </View>
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

const SettingItem = ({icon, title, onPress, value, type = 'navigate'}) => (
  <TouchableItem onPress={onPress} style={styles.settingItem}>
    <HStack
      space="md"
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={16}>
      <HStack space="md" alignItems="center">
        {icon}
        <Text color="white" fontSize={16}>
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

const languages = [
  {label: 'English', value: 'English'},
  {label: 'Spanish', value: 'Spanish'},
  {label: 'French', value: 'French'},
  {label: 'German', value: 'German'},
  {label: 'Chinese', value: 'Chinese'},
  {label: 'Japanese', value: 'Japanese'},
];

const themes = [
  {label: 'Dark', value: 'dark'},
  {label: 'Light', value: 'light'},
  {label: 'System', value: 'system'},
];

const CustomBottomSheet = ({isVisible, onClose, title, items, selectedValue, onSelect}) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="slide"
    onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.bottomSheet}>
        <Text color="white" fontSize={20} fontWeight="600" marginBottom={16}>
          {title}
        </Text>
        <VStack space="sm">
          {items.map(item => (
            <TouchableItem
              key={item.value}
              style={styles.sheetItem}
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}>
              <HStack
                space="md"
                alignItems="center"
                justifyContent="space-between"
                paddingVertical={12}>
                <Text color="white" fontSize={16}>
                  {item.label}
                </Text>
                {selectedValue === item.value && (
                  <Text color="#dc3f72">✓</Text>
                )}
              </HStack>
            </TouchableItem>
          ))}
        </VStack>
      </View>
    </View>
  </Modal>
);

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isPrivate, setIsPrivate] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showThemeSheet, setShowThemeSheet] = useState(false);

  const handleContactPress = () => {
    Linking.openURL('mailto:support@flickture.com');
  };

  const handleAboutPress = () => {
    Linking.openURL('https://flickture.com/about');
  };

  return (
    <ScrollView flex={1} backgroundColor="#040b1c">
      <Box padding={16}>
        {/* Back Button and Title */}
        <HStack space="md" alignItems="center" marginBottom={24}>
          <Button
            variant="link"
            onPress={() => navigation.goBack()}
            p={0}>
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
            value={isPrivate}
            onPress={() => setIsPrivate(!isPrivate)}
          />
          <SettingItem
            icon={<Eye size={20} color="#dc3f72" />}
            title="Show Activity Status"
            type="switch"
            value={showActivity}
            onPress={() => setShowActivity(!showActivity)}
          />
          <Divider bg="$trueGray800" />

          {/* Preferences Section */}
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={14}
            marginBottom={8}
            marginTop={16}>
            PREFERENCES
          </Text>
          <SettingItem
            icon={<Globe size={20} color="#dc3f72" />}
            title="Language"
            type="select"
            value={language}
            onPress={() => setShowLanguageSheet(true)}
          />
          <SettingItem
            icon={<Moon size={20} color="#dc3f72" />}
            title="Theme"
            type="select"
            value={theme}
            onPress={() => setShowThemeSheet(true)}
          />
          <SettingItem
            icon={<Bell size={20} color="#dc3f72" />}
            title="Notifications"
            type="switch"
            value={notificationsEnabled}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
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
        </VStack>
      </Box>

      {/* Language Selection Sheet */}
      <CustomBottomSheet
        isVisible={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
        title="Select Language"
        items={languages}
        selectedValue={language}
        onSelect={setLanguage}
      />

      {/* Theme Selection Sheet */}
      <CustomBottomSheet
        isVisible={showThemeSheet}
        onClose={() => setShowThemeSheet(false)}
        title="Select Theme"
        items={themes}
        selectedValue={theme}
        onSelect={setTheme}
      />
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
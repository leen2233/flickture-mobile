import React, {useState} from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Image,
  Pressable,
  ScrollView,
  Input,
  InputField,
  InputIcon,
} from '@gluestack-ui/themed';
import {Plus, Search, TrendingUp, Users, Bookmark} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import sampleData from '../data/sample.json';

// List item with hover effect and modern styling
const ListItem = ({list, onPress}) => (
  <Pressable
    onPress={onPress}
    style={({pressed}) => [
      {
        transform: [{scale: pressed ? 0.98 : 1}],
        opacity: pressed ? 0.9 : 1,
      },
    ]}>
    <HStack space="md" alignItems="center" marginBottom={16}>
      <Box width={80} height={80} borderRadius={12} overflow="hidden">
        <Image
          source={{uri: list.thumbnail}}
          alt={list.name}
          width="100%"
          height="100%"
          style={{opacity: 0.9}}
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height={40}
          background="linear-gradient(transparent, rgba(0,0,0,0.8))"
        />
      </Box>
      <VStack flex={1} space="xs">
        <Text color="white" fontSize={16} fontWeight="600">
          {list.name}
        </Text>
        <Text
          color="rgba(255, 255, 255, 0.7)"
          fontSize={14}
          numberOfLines={2}
          ellipsizeMode="tail">
          {list.description}
        </Text>
        <HStack space="sm" alignItems="center">
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
            {list.moviesCount} movies
          </Text>
          <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
            • by {list.creator}
          </Text>
          {list.likes && (
            <Text color="rgba(255, 255, 255, 0.7)" fontSize={12}>
              • {list.likes.toLocaleString()} likes
            </Text>
          )}
        </HStack>
      </VStack>
    </HStack>
  </Pressable>
);

// Section header component
const SectionHeader = ({title, action}) => (
  <HStack
    justifyContent="space-between"
    alignItems="center"
    marginBottom={16}
    marginTop={24}>
    <Text color="white" fontSize={20} fontWeight="600">
      {title}
    </Text>
    {action}
  </HStack>
);

const ListsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('featured');

  const tabs = [
    {id: 'featured', label: 'Featured', icon: TrendingUp},
    {id: 'myLists', label: 'My Lists', icon: Bookmark},
    {id: 'community', label: 'Community', icon: Users},
  ];

  const navigateToList = (listId, listName) => {
    navigation.navigate('ListDetails', {listId, listName});
  };

  return (
    <Box flex={1} backgroundColor="#040b1c">
      {/* Search Header */}
      <Box padding={16} paddingTop={32} backgroundColor="#270a39">
        <HStack space="md" alignItems="center" marginBottom={16}>
          <Input
            flex={1}
            height={40}
            backgroundColor="rgba(255,255,255,0.1)"
            borderRadius={20}
            borderWidth={0}
            display="flex"
            alignItems="center">
            <InputIcon
              as={Search}
              color="#dc3f72"
              marginLeft={12}
              height="100%"
              justifyContent="center"
            />
            <InputField
              color="white"
              placeholder="Search lists..."
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </Input>
          <Pressable
            onPress={() => navigation.navigate('CreateList')}
            backgroundColor="#dc3f72"
            width={40}
            height={40}
            borderRadius={20}
            justifyContent="center"
            alignItems="center">
            <Plus color="white" size={20} />
          </Pressable>
        </HStack>

        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="sm" paddingBottom={8}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  backgroundColor={
                    activeTab === tab.id ? '#dc3f72' : 'transparent'
                  }
                  borderRadius={20}
                  paddingHorizontal={16}
                  paddingVertical={8}
                  borderWidth={1}
                  borderColor={
                    activeTab === tab.id ? '#dc3f72' : 'rgba(255,255,255,0.2)'
                  }>
                  <HStack space="sm" alignItems="center">
                    <Icon size={16} color="white" />
                    <Text color="white" fontSize={14}>
                      {tab.label}
                    </Text>
                  </HStack>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </Box>

      <ScrollView flex={1}>
        <Box padding={16}>
          {activeTab === 'featured' && (
            <>
              {/* Trending Lists */}
              <SectionHeader
                title="Trending Lists"
                action={
                  <Text color="#dc3f72" fontSize={14}>
                    See all
                  </Text>
                }
              />
              <Box backgroundColor="#270a39" borderRadius={20} padding={16}>
                {sampleData.featured.trending.map(list => (
                  <ListItem
                    key={list.id}
                    list={list}
                    onPress={() => navigateToList(list.id, list.name)}
                  />
                ))}
              </Box>

              {/* Staff Picks */}
              <SectionHeader title="Staff Picks" />
              <Box backgroundColor="#270a39" borderRadius={20} padding={16}>
                {sampleData.featured.staffPicks.map(list => (
                  <ListItem
                    key={list.id}
                    list={list}
                    onPress={() => navigateToList(list.id, list.name)}
                  />
                ))}
              </Box>
            </>
          )}

          {activeTab === 'myLists' && (
            <Box backgroundColor="#270a39" borderRadius={20} padding={16}>
              {sampleData.user.lists.map(list => (
                <ListItem
                  key={list.id}
                  list={list}
                  onPress={() => navigateToList(list.id, list.name)}
                />
              ))}
            </Box>
          )}

          {activeTab === 'community' && (
            <>
              {/* Popular Lists */}
              <SectionHeader title="Popular in Community" />
              <Box backgroundColor="#270a39" borderRadius={20} padding={16}>
                {sampleData.community.popular.map(list => (
                  <ListItem
                    key={list.id}
                    list={list}
                    onPress={() => navigateToList(list.id, list.name)}
                  />
                ))}
              </Box>

              {/* Recent Lists */}
              <SectionHeader title="Recently Created" />
              <Box backgroundColor="#270a39" borderRadius={20} padding={16}>
                {sampleData.community.recent.map(list => (
                  <ListItem
                    key={list.id}
                    list={list}
                    onPress={() => navigateToList(list.id, list.name)}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ListsScreen;

import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions, TextInput, Image, TouchableOpacity } from 'react-native';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../../shared/components/RecipeCard';
import CategoryItem from '../../../shared/components/CategoryItem';
import FeatureCarousel from '../../../shared/components/FeatureCarousel';
import { Ionicons } from '@expo/vector-icons'; // Added for the search icon
import { useAuth } from '../../auth/AuthContext';
import { useHideOnScroll } from '../../../core/utils/TabContext';

const categories = [
  { name: 'All', image: require('../../../../assets/images/categories/all.jpg') },
  { name: 'Beef', image: require('../../../../assets/images/categories/beef.jpg') },
  { name: 'Chicken', image: require('../../../../assets/images/categories/chicken.jpg') },
  { name: 'Dessert', image: require('../../../../assets/images/categories/dessert.jpg') },
  { name: 'Lamb', image: require('../../../../assets/images/categories/lamb.jpg') },
  { name: 'Seafood', image: require('../../../../assets/images/categories/seafood.jpg') },
  { name: 'Pasta', image: require('../../../../assets/images/categories/pasta.jpg') },
  { name: 'Vegetarian', image: require('../../../../assets/images/categories/vegetarian.jpg') },
];

const { width } = Dimensions.get('window');

export default function MainFeed({ navigation }) {
  const { user } = useAuth();
  const { recipes } = useContext(RecipeContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Format recipes into rows of 2 for the FlatList
  const formatData = (dataList, numColumns) => {
    const formattedData = [];
    for (let i = 0; i < dataList.length; i += numColumns) {
      formattedData.push(dataList.slice(i, i + numColumns));
    }
    return formattedData;
  };

  const recipeRows = formatData(filteredRecipes, 2);

  // Construct flat list data
  const listData = [
    { type: 'header', id: 'header' },
    { type: 'sticky_section', id: 'sticky_section' },
    ...recipeRows.map((row, index) => ({ type: 'row', id: `row_${index}`, items: row }))
  ];

  if (filteredRecipes.length === 0) {
    listData.push({ type: 'empty', id: 'empty' });
  }

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Hello, {user?.displayName || 'Foodie'}! 👋</Text>
              <Text style={styles.title}>
                Make your own food, stay at <Text style={styles.highlight}>home</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.headerAvatar} />
              ) : (
                <Ionicons name="person-circle-outline" size={50} color="#fca311" />
              )}
            </TouchableOpacity>
          </View>
          <FeatureCarousel />
        </View>
      );
    }
    
    if (item.type === 'sticky_section') {
      return (
        <View style={styles.stickyContainer}>
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search recipes..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          <View style={styles.categoriesSection}>
            <View style={styles.categoryContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                {categories.map((cat, index) => (
                  <CategoryItem 
                    key={index}
                    category={cat}
                    isSelected={selectedCategory === cat.name}
                    onPress={() => setSelectedCategory(cat.name)}
                  />
                ))}
              </ScrollView>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>Featured Recipes</Text>
            </View>
          </View>
        </View>
      );
    }

    if (item.type === 'row') {
      return (
        <View style={[styles.listContainer, styles.row]}>
          {item.items.map(recipe => (
            <RecipeCard 
              key={recipe.id}
              recipe={recipe} 
              onPress={() => navigation.navigate('RecipeDetails', { recipe })}
              style={styles.cardHalfWidth}
            />
          ))}
          {item.items.length === 1 && <View style={styles.cardHalfWidth} />}
        </View>
      );
    }

    if (item.type === 'empty') {
      return (
        <Text style={styles.emptyText}>No recipes found.</Text>
      );
    }

    return null;
  };

  const { handleScroll } = useHideOnScroll();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={listData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // Make the search bar sticky!
        contentContainerStyle={styles.flatListContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fafafa' 
  },
  stickyContainer: {
    backgroundColor: '#fafafa',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  greeting: { 
    fontSize: 16, 
    color: '#888', 
    marginBottom: 4 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#333',
    lineHeight: 36,
  },
  highlight: { 
    color: '#fca311' 
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchSection: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
  categoriesSection: {
    paddingTop: 10,
  },
  categoryContainer: { 
    height: 110, 
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#333',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  cardHalfWidth: {
    width: (width - 56) / 2,
  }
});
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { RecipeContext } from '../RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import CategoryItem from '../components/CategoryItem';

const categories = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=150&q=80' },
  { name: 'Beef', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=150&q=80' },
  { name: 'Chicken', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=150&q=80' },
  { name: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=150&q=80' },
  { name: 'Lamb', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=150&q=80' },
  { name: 'Seafood', image: 'https://images.unsplash.com/photo-1615141982883-c7da0ead3447?auto=format&fit=crop&w=150&q=80' },
  { name: 'Pasta', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=150&q=80' },
  { name: 'Vegetarian', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80' },
];

const { width } = Dimensions.get('window');

export default function MainFeed({ navigation }) {
  const { recipes } = useContext(RecipeContext);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRecipes = selectedCategory === 'All' 
    ? recipes 
    : recipes.filter((r) => r.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Hello, Foodie! 👋</Text>
        <Text style={styles.title}>
          Make your own food, stay at <Text style={styles.highlight}>home</Text>
        </Text>
      </View>

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
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
              style={styles.cardHalfWidth}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fafafa' 
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
  categoryContainer: { 
    height: 110, 
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#333',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  cardHalfWidth: {
    width: (width - 56) / 2, // Account for padding and space between
  }
});
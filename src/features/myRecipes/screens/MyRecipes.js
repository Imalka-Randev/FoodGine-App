import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHideOnScroll } from '../../../core/utils/TabContext';

import MyRecipeCard from '../../../shared/components/MyRecipeCard';

export default function MyRecipes({ navigation }) {
  const { myRecipes, deleteMyRecipe } = useContext(RecipeContext);
  const { handleScroll } = useHideOnScroll();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My <Text style={styles.highlight}>Recipes</Text></Text>
      </View>

      {myRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes added yet.</Text>
          <Text style={styles.emptySubtext}>Create your own custom recipes!</Text>
        </View>
      ) : (
        <FlatList
          data={myRecipes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <MyRecipeCard 
              recipe={item}
              onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
              onEdit={() => navigation.navigate('Add Recipe', { recipe: item })}
              onDelete={() => deleteMyRecipe(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fafafa' 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#333',
    textAlign: 'center',
  },
  highlight: {
    color: '#fca311',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#555',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 30, // 30 on each side means width is width - 60 (same as carousel)
    paddingBottom: 80,
  },
});
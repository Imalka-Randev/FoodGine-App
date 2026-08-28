import React, { useContext, useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHideOnScroll } from '../../../core/utils/TabContext';

import MyRecipeCard from '../../../shared/components/MyRecipeCard';
import SkeletonCard from '../../../shared/components/SkeletonCard';

export default function MyRecipes({ navigation }) {
  const { myRecipes, deleteMyRecipe, loading } = useContext(RecipeContext);
  const { handleScroll, showTabBar } = useHideOnScroll();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (showTabBar) showTabBar();
    }, [showTabBar])
  );

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return myRecipes;
    return myRecipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [myRecipes, searchQuery]);

  const confirmDelete = (id, name) => {
    Alert.alert(
      "Delete Recipe",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMyRecipe(id) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My <Text style={styles.highlight}>Recipes</Text></Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search my recipes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.listContent}>
          <SkeletonCard height={150} />
          <SkeletonCard height={150} />
          <SkeletonCard height={150} />
        </View>
      ) : filteredRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{searchQuery ? "No recipes found." : "No recipes added yet."}</Text>
          {!searchQuery && <Text style={styles.emptySubtext}>Create your own custom recipes!</Text>}
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
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
              onDelete={() => confirmDelete(item.id, item.name)}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 28,
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
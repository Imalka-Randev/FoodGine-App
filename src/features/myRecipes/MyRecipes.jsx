import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyRecipeCard from '../../shared/components/MyRecipeCard';
import SkeletonCard from '../../shared/components/SkeletonCard';
import useMyRecipes from './useMyRecipes';

export default function MyRecipes({ navigation }) {
  const {
    loading,
    searchQuery, setSearchQuery,
    filteredRecipes,
    confirmDelete,
    handleScroll
  } = useMyRecipes();

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
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../../shared/components/RecipeCard';

export default function Favorites({ navigation }) {
  const { favorites } = useContext(RecipeContext);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>My Favorites</Text>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites added yet.</Text>
          <Text style={styles.emptySubtext}>Heart your favorite recipes and they'll appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onPress={() => navigation.navigate('RecipeDetails', { recipe: item })} 
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
    backgroundColor: '#fafafa',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
    paddingBottom: 20,
  }
});
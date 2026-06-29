import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RecipeContext } from '../RecipeContext';

export default function Favorites({ navigation }) {
  const { favorites } = useContext(RecipeContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorite Recipes</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites added yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}>
              <Image source={{ uri: item.image }} style={styles.imagePlaceholder} />
              <View style={styles.cardInfo}>
                <Text style={styles.recipeName}>{item.name}</Text>
                <Text style={styles.recipeCategory}>{item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  card: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginBottom: 15 },
  imagePlaceholder: { width: 80, height: 80, backgroundColor: '#ccc', borderRadius: 10 },
  cardInfo: { marginLeft: 15, justifyContent: 'center' },
  recipeName: { fontSize: 18, fontWeight: 'bold' },
  recipeCategory: { fontSize: 14, color: '#666', marginTop: 5 }
});
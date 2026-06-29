import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RecipeContext } from '../RecipeContext';

export default function MyFood({ navigation }) {
  const { myFood, deleteMyFood } = useContext(RecipeContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddRecipe')}>
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </TouchableOpacity>

      {myFood.length === 0 ? (
        <Text style={styles.emptyText}>No recipes added yet.</Text>
      ) : (
        <FlatList
          data={myFood}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}>
              <Image source={{ uri: item.image }} style={styles.imagePlaceholder} />
              <View style={styles.cardInfo}>
                <Text style={styles.recipeName}>{item.name}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('AddRecipe', { recipe: item })}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMyFood(item.id)}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
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
  addButton: { backgroundColor: '#fca311', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  card: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15 },
  imagePlaceholder: { height: 150, backgroundColor: '#ccc', borderRadius: 10, marginBottom: 10 },
  recipeName: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  editButton: { flex: 1, backgroundColor: '#48cae4', padding: 10, borderRadius: 5, marginRight: 5, alignItems: 'center' },
  deleteButton: { flex: 1, backgroundColor: '#ff4d4d', padding: 10, borderRadius: 5, marginLeft: 5, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold' }
});
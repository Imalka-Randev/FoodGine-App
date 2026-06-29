import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RecipeContext } from '../RecipeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RecipeDetails({ route }) {
  const { recipe } = route.params;
  const { toggleFavorite, favorites } = useContext(RecipeContext);
  const isFav = favorites.find((r) => r.id === recipe.id);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.imagePlaceholder} />
      
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.subtitle}>{recipe.category}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(recipe)} style={styles.favButton}>
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={28} color={isFav ? "red" : "gray"} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}><Text>{recipe.prepTime}</Text></View>
        <View style={styles.infoBox}><Text>{recipe.servings}</Text></View>
        <View style={styles.infoBox}><Text>{recipe.calories}</Text></View>
        <View style={styles.infoBox}><Text>{recipe.difficulty}</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map((ing, idx) => (
        <Text key={idx} style={styles.listItem}>• {ing}</Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{recipe.instructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagePlaceholder: { height: 250, backgroundColor: '#ccc' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  favButton: { marginTop: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-evenly', padding: 10 },
  infoBox: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8, alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 20, marginBottom: 10 },
  listItem: { paddingHorizontal: 20, paddingVertical: 5, fontSize: 16 },
  instructions: { paddingHorizontal: 20, fontSize: 16, paddingBottom: 30 }
});
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { RecipeContext } from '../RecipeContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { name: 'My Food', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=150&q=80' },
  { name: 'My Favorites', image: 'https://images.unsplash.com/photo-1522881116245-562b704c728e?auto=format&fit=crop&w=150&q=80' },
  { name: 'Beef', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=150&q=80' },
  { name: 'Chicken', image: 'https://images.unsplash.com/photo-1604543419996-52c67675718a?auto=format&fit=crop&w=150&q=80' },
  { name: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=150&q=80' },
  { name: 'Lamb', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=150&q=80' },
  { name: 'Miscellaneous', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80' },
  { name: 'Seafood', image: 'https://images.unsplash.com/photo-1615141982883-c7da0ead3447?auto=format&fit=crop&w=150&q=80' },
  { name: 'Pasta', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=150&q=80' },
  { name: 'Vegetarian', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80' },
];

export default function MainFeed({ navigation }) {
  const { recipes } = useContext(RecipeContext);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = (category) => {
    if (category === 'My Favorites') {
      navigation.navigate('Favorites');
    } else if (category === 'My Food') {
      navigation.navigate('MyFood');
    } else {
      setSelectedCategory(selectedCategory === category ? null : category);
    }
  };

  const filteredRecipes = selectedCategory ? recipes.filter((r) => r.category === selectedCategory) : recipes;

  return (
   
    <View style={styles.container}>
       <SafeAreaView>
      <Text style={styles.greeting}>Hello, User!</Text>
      <Text style={styles.title}>Make your own food, stay at</Text>
       <Text style={styles.hilight}>home</Text>
      
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat, index) => (
            <TouchableOpacity key={index} onPress={() => handleCategoryPress(cat.name)} style={styles.categoryItem}>
              <Image source={{ uri: cat.image }} style={styles.categoryCircle} />
              <Text>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Recipes</Text>
      
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}>
            <Image source={{ uri: item.image }} style={styles.imagePlaceholder} />
            <Text style={styles.recipeName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      </SafeAreaView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  greeting: { fontSize: 16, textAlign: 'right' },
  title: {textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  hilight: { textAlign: 'center', fontSize: 26, fontWeight: 'bold',color:'orange' },
  categoryContainer: { height: 80, marginBottom: 20,marginTop:16 },
  categoryItem: { alignItems: 'center', marginRight: 15 },
  categoryCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ddd', marginBottom: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  recipeCard: { flex: 1, margin: 5 },
  imagePlaceholder: { height: 150, width: '100%', backgroundColor: '#ccc', borderRadius: 10 },
  recipeName: { marginTop: 5, fontSize: 14, fontWeight: 'bold' }
});
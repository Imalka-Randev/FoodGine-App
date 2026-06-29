import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RecipeContext } from '../RecipeContext';

export default function AddRecipe({ route, navigation }) {
  const { addMyFood, editRecipe } = useContext(RecipeContext);
  const recipeToEdit = route.params?.recipe;

  const [name, setName] = useState(recipeToEdit ? recipeToEdit.name : '');
  const [ingredients, setIngredients] = useState(recipeToEdit ? recipeToEdit.ingredients.join(',') : '');
  const [instructions, setInstructions] = useState(recipeToEdit ? recipeToEdit.instructions : '');
  const [imageUri, setImageUri] = useState(recipeToEdit ? recipeToEdit.image : null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const recipeData = {
      id: recipeToEdit ? recipeToEdit.id : Math.random().toString(),
      name,
      category: recipeToEdit ? recipeToEdit.category : 'My Food',
      prepTime: recipeToEdit ? recipeToEdit.prepTime : 'N/A',
      servings: recipeToEdit ? recipeToEdit.servings : 'N/A',
      calories: recipeToEdit ? recipeToEdit.calories : 'N/A',
      difficulty: recipeToEdit ? recipeToEdit.difficulty : 'N/A',
      ingredients: ingredients.split(','),
      instructions,
      image: imageUri || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    };
    
    if (recipeToEdit) {
      editRecipe(recipeData);
    } else {
      addMyFood(recipeData);
    }
    navigation.goBack();
  };

  return (
    
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        {imageUri && imageUri !== 'placeholder_url' ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.uploadText}>Upload Image</Text>
        )}
      </TouchableOpacity>
      
      <TextInput style={styles.input} placeholder="Recipe Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Ingredients (comma separated)" value={ingredients} onChangeText={setIngredients} multiline />
      <TextInput style={styles.input} placeholder="Instructions" value={instructions} onChangeText={setInstructions} multiline />
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{recipeToEdit ? 'Update Recipe' : 'Save Recipe'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  imageUpload: { height: 150, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 20 },
  previewImage: { width: '100%', height: '100%', borderRadius: 10 },
  uploadText: { color: '#888', fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  saveButton: { backgroundColor: '#fca311', padding: 15, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
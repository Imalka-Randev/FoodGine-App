import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AddRecipe({ route, navigation }) {
  const { addMyFood, editRecipe } = useContext(RecipeContext);
  const recipeToEdit = route.params?.recipe;

  const [name, setName] = useState(recipeToEdit ? recipeToEdit.name : '');
  const [ingredients, setIngredients] = useState(recipeToEdit ? recipeToEdit.ingredients.join(', ') : '');
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
    if (!name || !ingredients || !instructions) {
      alert("Please fill out all fields.");
      return;
    }
    
    const recipeData = {
      id: recipeToEdit ? recipeToEdit.id : Math.random().toString(),
      name,
      category: recipeToEdit ? recipeToEdit.category : 'My Food',
      prepTime: recipeToEdit ? recipeToEdit.prepTime : 'N/A',
      servings: recipeToEdit ? recipeToEdit.servings : 'N/A',
      calories: recipeToEdit ? recipeToEdit.calories : 'N/A',
      difficulty: recipeToEdit ? recipeToEdit.difficulty : 'N/A',
      ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
      instructions,
      image: imageUri && imageUri !== 'placeholder_url' ? imageUri : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    };
    
    if (recipeToEdit) {
      editRecipe(recipeData);
    } else {
      addMyFood(recipeData);
    }
    
    if (recipeToEdit) {
      navigation.goBack();
    } else {
      navigation.navigate('My Food');
      // Reset form if it's a new addition
      setName('');
      setIngredients('');
      setInstructions('');
      setImageUri(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipeToEdit ? 'Edit Recipe' : 'Add Recipe'}</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage} activeOpacity={0.8}>
            {imageUri && imageUri !== 'placeholder_url' ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={32} color="rgba(255,255,255,0.8)" />
                </View>
              </>
            ) : (
              <View style={styles.imagePlaceholderContent}>
                <Ionicons name="image-outline" size={48} color="#aaa" />
                <Text style={styles.uploadText}>Tap to add cover image</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Delicious Pasta" 
              value={name} 
              onChangeText={setName} 
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingredients</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Tomatoes, Basil, Garlic (comma separated)" 
              value={ingredients} 
              onChangeText={setIngredients} 
              multiline 
              textAlignVertical="top"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructions</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="1. Boil water..." 
              value={instructions} 
              onChangeText={setInstructions} 
              multiline 
              textAlignVertical="top"
              placeholderTextColor="#aaa"
            />
          </View>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>{recipeToEdit ? 'Update Recipe' : 'Save Recipe'}</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageUpload: { 
    height: 200, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 16, 
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  previewImage: { 
    width: '100%', 
    height: '100%', 
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderContent: {
    alignItems: 'center',
  },
  uploadText: { 
    color: '#888', 
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: { 
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#eee', 
    padding: 16, 
    borderRadius: 12, 
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  textArea: {
    height: 120,
    paddingTop: 16, // to ensure top alignment looks good
  },
  saveButton: { 
    backgroundColor: '#fca311', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#fca311',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
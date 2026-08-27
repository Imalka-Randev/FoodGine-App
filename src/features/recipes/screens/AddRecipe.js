import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHideOnScroll } from '../../../core/utils/TabContext';

export default function AddRecipe({ route, navigation }) {
  const { addMyRecipe, editRecipe } = useContext(RecipeContext);
  const { handleScroll } = useHideOnScroll();
  const recipeToEdit = route.params?.recipe;

  const [name, setName] = useState(recipeToEdit ? recipeToEdit.name : '');
  const [prepTime, setPrepTime] = useState(recipeToEdit ? recipeToEdit.prepTime : '');
  const [servings, setServings] = useState(recipeToEdit ? recipeToEdit.servings : '');
  const [calories, setCalories] = useState(recipeToEdit ? recipeToEdit.calories : '');
  const [difficulty, setDifficulty] = useState(recipeToEdit ? recipeToEdit.difficulty : '');
  const [ingredients, setIngredients] = useState(recipeToEdit ? recipeToEdit.ingredients.join(', ') : '');
  const [instructions, setInstructions] = useState(recipeToEdit ? recipeToEdit.instructions : '');
  const [imageUri, setImageUri] = useState(recipeToEdit ? recipeToEdit.image : null);
  const [isPublic, setIsPublic] = useState(recipeToEdit ? recipeToEdit.isPublic : false);
  const [focusedInput, setFocusedInput] = useState(null);

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
      category: recipeToEdit ? recipeToEdit.category : 'My Recipes',
      prepTime: prepTime || 'N/A',
      servings: servings || 'N/A',
      calories: calories || 'N/A',
      difficulty: difficulty || 'N/A',
      ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
      instructions,
      isPublic, // Passed to Firebase
      image: imageUri && imageUri !== 'placeholder_url' ? imageUri : require('../../../../assets/images/fallbacks/default_recipe.jpg')
    };
    
    if (recipeToEdit) {
      editRecipe(recipeData);
    } else {
      addMyRecipe(recipeData);
    }
    
    if (recipeToEdit) {
      navigation.goBack();
    } else {
      navigation.navigate('My Recipes');
      setName('');
      setPrepTime('');
      setServings('');
      setCalories('');
      setDifficulty('');
      setIngredients('');
      setInstructions('');
      setImageUri(null);
      setIsPublic(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipeToEdit ? 'Edit' : 'Add'} <Text style={styles.highlight}>Recipe</Text></Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          
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
          
          <View style={styles.foodbyPromo}>
            <Ionicons name="sparkles" size={20} color="#fca311" style={{ marginRight: 8 }} />
            <Text style={styles.promoText}>
              Need a chef expert? <Text style={styles.promoHighlight} onPress={() => navigation.navigate('Foodby')}>Foodby</Text> here to help you!
            </Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Name</Text>
            <TextInput 
              style={[styles.input, focusedInput === 'name' && styles.inputFocused]} 
              placeholder="e.g. Delicious Pasta" 
              value={name} 
              onChangeText={setName} 
              placeholderTextColor="#aaa"
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Details</Text>
            <View style={styles.row}>
              <TextInput 
                style={[styles.input, styles.halfInput, focusedInput === 'prepTime' && styles.inputFocused]} 
                placeholder="Time (e.g. 20 Mins)" 
                value={prepTime} 
                onChangeText={setPrepTime} 
                placeholderTextColor="#aaa" 
                onFocus={() => setFocusedInput('prepTime')}
                onBlur={() => setFocusedInput(null)}
              />
              <TextInput 
                style={[styles.input, styles.halfInput, focusedInput === 'servings' && styles.inputFocused]} 
                placeholder="Servings (e.g. 2)" 
                value={servings} 
                onChangeText={setServings} 
                placeholderTextColor="#aaa" 
                onFocus={() => setFocusedInput('servings')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
              <TextInput 
                style={[styles.input, styles.halfInput, focusedInput === 'calories' && styles.inputFocused]} 
                placeholder="Calories (e.g. 300 Cal)" 
                value={calories} 
                onChangeText={setCalories} 
                placeholderTextColor="#aaa" 
                onFocus={() => setFocusedInput('calories')}
                onBlur={() => setFocusedInput(null)}
              />
              <TextInput 
                style={[styles.input, styles.halfInput, focusedInput === 'difficulty' && styles.inputFocused]} 
                placeholder="Level (e.g. Easy)" 
                value={difficulty} 
                onChangeText={setDifficulty} 
                placeholderTextColor="#aaa" 
                onFocus={() => setFocusedInput('difficulty')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingredients</Text>
            <TextInput 
              style={[styles.input, styles.textArea, focusedInput === 'ingredients' && styles.inputFocused]} 
              placeholder="Tomatoes, Basil, Garlic (comma separated)" 
              value={ingredients} 
              onChangeText={setIngredients} 
              multiline 
              textAlignVertical="top"
              placeholderTextColor="#aaa"
              onFocus={() => setFocusedInput('ingredients')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructions</Text>
            <TextInput 
              style={[styles.input, styles.textArea, focusedInput === 'instructions' && styles.inputFocused]} 
              placeholder="1. Boil water..." 
              value={instructions} 
              onChangeText={setInstructions} 
              multiline 
              textAlignVertical="top"
              placeholderTextColor="#aaa"
              onFocus={() => setFocusedInput('instructions')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Make Recipe Public?</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#767577', true: '#fca311' }}
              thumbColor={isPublic ? '#fff' : '#f4f3f4'}
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
    textAlign: 'center',
  },
  highlight: {
    color: '#fca311',
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
  inputFocused: {
    borderColor: '#fca311',
    borderWidth: 2,
  },
  foodbyPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8eb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ffe4b5',
  },
  promoText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  promoHighlight: {
    color: '#fca311',
    fontWeight: 'bold',
  },
  textArea: {
    height: 120,
    paddingTop: 16, // to ensure top alignment looks good
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  saveButton: { 
    backgroundColor: '#fca311', 
    padding: 15, 
    borderRadius: 16, 
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#fca311',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: "50%",
    alignSelf: "center",
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  }
});
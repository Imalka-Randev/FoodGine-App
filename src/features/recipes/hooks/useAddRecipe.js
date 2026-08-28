import { useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { useHideOnScroll } from '../../../core/utils/TabContext';

export default function useAddRecipe(route, navigation) {
  const { addMyRecipe, editRecipe } = useContext(RecipeContext);
  const { handleScroll } = useHideOnScroll();
  const recipeToEdit = route.params?.recipe;

  const [name, setName] = useState(recipeToEdit ? recipeToEdit.name : '');
  const [prepTime, setPrepTime] = useState(recipeToEdit ? recipeToEdit.prepTime : '');
  const [servings, setServings] = useState(recipeToEdit ? recipeToEdit.servings : '');
  const [calories, setCalories] = useState(recipeToEdit ? recipeToEdit.calories : '');
  const [difficulty, setDifficulty] = useState(recipeToEdit ? recipeToEdit.difficulty : '');
  const [ingredients, setIngredients] = useState(recipeToEdit && recipeToEdit.ingredients ? recipeToEdit.ingredients.join(', ') : '');
  const [instructions, setInstructions] = useState(recipeToEdit ? recipeToEdit.instructions : '');
  const [imageUri, setImageUri] = useState(recipeToEdit ? recipeToEdit.image : null);
  const [isPublic, setIsPublic] = useState(recipeToEdit ? recipeToEdit.isPublic : false);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    if (recipeToEdit) {
      setName(recipeToEdit.name || '');
      setPrepTime(recipeToEdit.prepTime !== 'N/A' ? recipeToEdit.prepTime : '');
      setServings(recipeToEdit.servings !== 'N/A' ? recipeToEdit.servings : '');
      setCalories(recipeToEdit.calories !== 'N/A' ? recipeToEdit.calories : '');
      setDifficulty(recipeToEdit.difficulty !== 'N/A' ? recipeToEdit.difficulty : '');
      setIngredients(recipeToEdit.ingredients ? recipeToEdit.ingredients.join(', ') : '');
      setInstructions(recipeToEdit.instructions || '');
      setImageUri(recipeToEdit.image || null);
      setIsPublic(recipeToEdit.isPublic || false);
      
      navigation.setOptions({
        title: 'Edit Recipe'
      });
    } else {
      setName('');
      setPrepTime('');
      setServings('');
      setCalories('');
      setDifficulty('');
      setIngredients('');
      setInstructions('');
      setImageUri(null);
      setIsPublic(false);

      navigation.setOptions({
        title: 'Add Recipe'
      });
    }
  }, [recipeToEdit, navigation]);

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes?",
      "Are you sure you want to discard your edits? Any unsaved changes will be lost.",
      [
        { text: "Keep Editing", style: "cancel" },
        { 
          text: "Discard", 
          style: "destructive", 
          onPress: () => {
            navigation.navigate('My Recipes');
            navigation.setParams({ recipe: undefined }); 
          }
        }
      ]
    );
  };

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
      Alert.alert("Missing Fields", "Please fill out all fields.");
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
      isPublic,
      image: imageUri && imageUri !== 'placeholder_url' ? imageUri : require('../../../../assets/images/fallbacks/default_recipe.jpg')
    };
    
    if (recipeToEdit) {
      editRecipe(recipeData);
    } else {
      addMyRecipe(recipeData);
    }
    
    if (recipeToEdit) {
      navigation.setParams({ recipe: undefined });
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

  return {
    name, setName,
    prepTime, setPrepTime,
    servings, setServings,
    calories, setCalories,
    difficulty, setDifficulty,
    ingredients, setIngredients,
    instructions, setInstructions,
    imageUri,
    isPublic, setIsPublic,
    focusedInput, setFocusedInput,
    recipeToEdit,
    handleScroll,
    handleCancel,
    pickImage,
    handleSave,
    navigation
  };
}

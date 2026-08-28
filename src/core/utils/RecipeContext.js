import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { recipeService } from '../../services/firebase/recipeService';
import { useAuth } from './AuthContext';
import { cacheImageLocally } from './cacheUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { defaultRecipes } from '../../data/defaultRecipes';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const { user } = useAuth(); // Get logged in user from Phase 2!
  const [recipes, setRecipes] = useState([]); // Global recipes
  const [myRecipes, setMyRecipes] = useState([]); // User's private/created recipes
  const [favorites, setFavorites] = useState([]); // Offline Saved recipes
  const [loading, setLoading] = useState(true); // Loading state for initial fetch

  const sanitizeRecipeImage = (recipe) => {
    // If it's a string, or it's a default built-in recipe, keep it as is
    if (typeof recipe.image === 'string' || recipe.id?.toString().startsWith('default-')) {
      return recipe;
    }
    // Otherwise, it's a corrupted local require() number fetched from DB, replace with fallback
    return { ...recipe, image: require('../../../assets/images/fallbacks/default_recipe.jpg') };
  };

  // Fetch data when user logs in or app starts
  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch Global Recipes from Cloud
      const globalData = await recipeService.getGlobalRecipes();
      if (globalData && globalData.length > 0) {
        const otherUsersRecipes = globalData
           .filter(r => r.userId !== user?.uid)
           .map(sanitizeRecipeImage);
        setRecipes([...defaultRecipes, ...otherUsersRecipes]);
      } else {
        setRecipes(defaultRecipes);
      }

      // 2. Fetch User Recipes (if logged in)
      if (user) {
        const userData = await recipeService.getUserRecipes(user.uid);
        setMyRecipes(userData.map(sanitizeRecipeImage));
      }

      // 3. Load Offline Favorites from Phone's Local Storage
      const savedFavs = await AsyncStorage.getItem('offline_favorites');
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        setFavorites(parsed.map(sanitizeRecipeImage));
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Save a global recipe to offline favorites
  const toggleFavorite = async (recipe) => {
    const isExist = favorites.find((r) => r.id === recipe.id);
    let updatedFavs;

    if (isExist) {
      // Remove from favorites
      updatedFavs = favorites.filter((r) => r.id !== recipe.id);
    } else {
      // Add to favorites AND cache the image locally for offline viewing!
      // (Using the cacheUtils we just built)
      const localImagePath = await cacheImageLocally(recipe.image, recipe.id);
      const offlineRecipe = { ...recipe, image: localImagePath }; // Swap web URL for local path
      updatedFavs = [...favorites, offlineRecipe];
    }

    setFavorites(updatedFavs);
    // Save the text data to the phone's local storage
    await AsyncStorage.setItem('offline_favorites', JSON.stringify(updatedFavs));
  };

  // Add a newly created or AI-generated recipe
  const addMyRecipe = async (recipeData) => {
    try {
      // Remove any local ID so it doesn't conflict with Firebase
      const { id, ...dataToUpload } = recipeData;

      // Save to Firebase (it handles offline queuing automatically!)
      const newId = await recipeService.addRecipe({
        ...dataToUpload,
        userId: user.uid,
        creatorName: user.displayName || user.email?.split('@')[0] || 'Foodie',
        isPublic: recipeData.isPublic || false // Default to private
      });

      const newRecipe = { ...dataToUpload, id: newId, userId: user.uid, creatorName: user.displayName || user.email?.split('@')[0] || 'Foodie' };
      setMyRecipes((prev) => [...prev, newRecipe]);
      
      // If they chose to make it public, add it to the global feed too (Actually, user asked NOT to show own recipes in global feed, so we shouldn't add it to setRecipes)
      // We removed it from global feed per user request.
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save recipe. Please try again.");
    }
  };

  const deleteMyRecipe = async (id) => {
    // 1. Save previous state for rollback
    const prevMyRecipes = [...myRecipes];
    const prevRecipes = [...recipes];
    const prevFavorites = [...favorites];

    // 2. Optimistic UI update
    setMyRecipes((prev) => prev.filter((r) => r.id !== id));
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    setFavorites((prev) => {
      const updatedFavs = prev.filter((r) => r.id !== id);
      AsyncStorage.setItem('offline_favorites', JSON.stringify(updatedFavs));
      return updatedFavs;
    });

    try {
      // 3. Network call
      await recipeService.deleteRecipe(id);
    } catch (error) {
      console.error("Error deleting recipe from context:", error);
      Alert.alert("Error", "Failed to delete recipe. Reverting changes.");
      // 4. Rollback
      setMyRecipes(prevMyRecipes);
      setRecipes(prevRecipes);
      setFavorites(prevFavorites);
      AsyncStorage.setItem('offline_favorites', JSON.stringify(prevFavorites));
    }
  };

  const editRecipe = async (updatedRecipe) => {
    try {
      await recipeService.updateRecipe(updatedRecipe.id, updatedRecipe);
      
      // Update MyRecipes list locally
      setMyRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? { ...r, ...updatedRecipe } : r));
      
      // Update Global list locally if it is public
      setRecipes(prev => {
        const exists = prev.find(r => r.id === updatedRecipe.id);
        if (updatedRecipe.isPublic) {
          if (exists) return prev.map(r => r.id === updatedRecipe.id ? { ...r, ...updatedRecipe } : r);
          else return [...prev, { ...updatedRecipe, userId: user.uid }];
        } else {
          if (exists) return prev.filter(r => r.id !== updatedRecipe.id); // It became private
          else return prev;
        }
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update recipe. Please try again.");
    }
  };

  return (
    <RecipeContext.Provider value={{ recipes, favorites, toggleFavorite, myRecipes, addMyRecipe, deleteMyRecipe, editRecipe, loading }}>
      {children}
    </RecipeContext.Provider>
  );
};
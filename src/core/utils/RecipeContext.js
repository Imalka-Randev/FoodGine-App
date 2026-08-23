import React, { createContext, useState, useEffect } from 'react';
import { recipeService } from '../../services/firebase/recipeService';
import { useAuth } from '../../features/auth/AuthContext';
import { cacheImageLocally } from './cacheUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const { user } = useAuth(); // Get logged in user from Phase 2!
  const [recipes, setRecipes] = useState([]); // Global recipes
  const [myFood, setMyFood] = useState([]); // User's private/created recipes
  const [favorites, setFavorites] = useState([]); // Offline Saved recipes

  // Fetch data when user logs in or app starts
  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch Global Recipes from Cloud
      const globalData = await recipeService.getGlobalRecipes();
      setRecipes(globalData);

      // 2. Fetch User Recipes (if logged in)
      if (user) {
        const userData = await recipeService.getUserRecipes(user.uid);
        setMyFood(userData);
      }

      // 3. Load Offline Favorites from Phone's Local Storage
      const savedFavs = await AsyncStorage.getItem('offline_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
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
  const addMyFood = async (recipeData) => {
    try {
      // Save to Firebase (it handles offline queuing automatically!)
      const newId = await recipeService.addRecipe({
        ...recipeData,
        userId: user.uid,
        isPublic: recipeData.isPublic || false // Default to private
      });

      const newRecipe = { id: newId, ...recipeData, userId: user.uid };
      setMyFood((prev) => [...prev, newRecipe]);
      
      // If they chose to make it public, add it to the global feed too
      if (recipeData.isPublic) {
         setRecipes((prev) => [...prev, newRecipe]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMyFood = (id) => {
    // Basic local delete for now
    setMyFood((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RecipeContext.Provider value={{ recipes, favorites, toggleFavorite, myFood, addMyFood, deleteMyFood }}>
      {children}
    </RecipeContext.Provider>
  );
};
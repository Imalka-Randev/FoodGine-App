import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { recipeService } from '../../services/firebase/recipeService';
import { useAuth } from '../../features/auth/AuthContext';
import { cacheImageLocally } from './cacheUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RecipeContext = createContext();

const DEFAULT_RECIPES = [
  {
    id: 'default-1',
    name: 'Spaghetti Bolognese',
    category: 'Pasta',
    prepTime: '45 Mins',
    servings: '4',
    calories: '600 Cal',
    difficulty: 'Easy',
    image: require('../../../assets/images/fallbacks/dummy1.jpg'),
    ingredients: ['Spaghetti', 'Minced Beef', 'Tomato Sauce', 'Onion', 'Garlic', 'Olive Oil', 'Parmesan'],
    instructions: '1. Boil pasta.\n2. Fry onions and garlic.\n3. Add beef and brown.\n4. Add tomato sauce and simmer.\n5. Serve over pasta with parmesan.',
    isPublic: true
  },
  {
    id: 'default-2',
    name: 'Grilled Salmon',
    category: 'Seafood',
    prepTime: '25 Mins',
    servings: '2',
    calories: '450 Cal',
    difficulty: 'Medium',
    image: require('../../../assets/images/fallbacks/dummy2.jpg'),
    ingredients: ['Salmon Fillet', 'Lemon', 'Olive Oil', 'Salt', 'Black Pepper', 'Asparagus'],
    instructions: '1. Preheat grill.\n2. Season salmon with oil, salt, and pepper.\n3. Grill for 6-8 mins per side.\n4. Serve with grilled asparagus and lemon.',
    isPublic: true
  },
  {
    id: 'default-3',
    name: 'Chicken Tikka Masala',
    category: 'Chicken',
    prepTime: '60 Mins',
    servings: '4',
    calories: '550 Cal',
    difficulty: 'Medium',
    image: require('../../../assets/images/fallbacks/dummy3.jpg'),
    ingredients: ['Chicken Breast', 'Yogurt', 'Tikka Masala Paste', 'Tomato Puree', 'Heavy Cream', 'Onion', 'Cilantro'],
    instructions: '1. Marinate chicken in yogurt and spices.\n2. Grill or bake chicken until cooked.\n3. Sauté onions, add masala paste and tomato puree.\n4. Stir in cream and simmer.\n5. Add chicken and garnish with cilantro.',
    isPublic: true
  },
  {
    id: 'default-4',
    name: 'Vegetable Stir Fry',
    category: 'Vegetarian',
    prepTime: '15 Mins',
    servings: '2',
    calories: '250 Cal',
    difficulty: 'Easy',
    image: require('../../../assets/images/fallbacks/dummy4.jpg'),
    ingredients: ['Broccoli', 'Bell Peppers', 'Carrots', 'Soy Sauce', 'Ginger', 'Garlic', 'Sesame Oil'],
    instructions: '1. Chop all vegetables.\n2. Heat sesame oil in a wok.\n3. Stir fry ginger and garlic, then add vegetables.\n4. Toss with soy sauce until tender-crisp.',
    isPublic: true
  }
];

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
        setRecipes([...DEFAULT_RECIPES, ...otherUsersRecipes]);
      } else {
        setRecipes(DEFAULT_RECIPES);
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
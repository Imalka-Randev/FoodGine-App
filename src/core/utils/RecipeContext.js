import React, { createContext, useState, useEffect } from 'react';
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

  // Fetch data when user logs in or app starts
  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch Global Recipes from Cloud
      const globalData = await recipeService.getGlobalRecipes();
      if (globalData && globalData.length > 0) {
        setRecipes(globalData);
      } else {
        setRecipes(DEFAULT_RECIPES);
      }

      // 2. Fetch User Recipes (if logged in)
      if (user) {
        const userData = await recipeService.getUserRecipes(user.uid);
        setMyRecipes(userData);
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
  const addMyRecipe = async (recipeData) => {
    try {
      // Save to Firebase (it handles offline queuing automatically!)
      const newId = await recipeService.addRecipe({
        ...recipeData,
        userId: user.uid,
        isPublic: recipeData.isPublic || false // Default to private
      });

      const newRecipe = { id: newId, ...recipeData, userId: user.uid };
      setMyRecipes((prev) => [...prev, newRecipe]);
      
      // If they chose to make it public, add it to the global feed too
      if (recipeData.isPublic) {
         setRecipes((prev) => [...prev, newRecipe]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMyRecipe = async (id) => {
    try {
      // Delete from Firestore
      await recipeService.deleteRecipe(id);
      
      // Delete locally from MyRecipes
      setMyRecipes((prev) => prev.filter((r) => r.id !== id));
      
      // Delete locally from Global feed if it was public
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      
      // Optionally remove from offline favorites if it exists there
      setFavorites((prev) => {
        const updatedFavs = prev.filter((r) => r.id !== id);
        AsyncStorage.setItem('offline_favorites', JSON.stringify(updatedFavs));
        return updatedFavs;
      });
    } catch (error) {
      console.error("Error deleting recipe from context:", error);
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
    }
  };

  return (
    <RecipeContext.Provider value={{ recipes, favorites, toggleFavorite, myRecipes, addMyRecipe, deleteMyRecipe, editRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};
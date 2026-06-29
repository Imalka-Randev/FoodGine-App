import React, { createContext, useState } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([
    { id: '1', name: 'Beef and Mustard Pie', category: 'Beef', prepTime: '35 Mins', servings: '03 Servings', calories: '103 Cal', difficulty: 'Medium', ingredients: ['1kg Beef', '2 tbs Plain Flour', '2 tbs Rapeseed Oil'], instructions: 'Step-by-step instructions here...', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80' },
    { id: '2', name: 'Beef and Oyster pie', category: 'Beef', prepTime: '40 Mins', servings: '04 Servings', calories: '150 Cal', difficulty: 'Hard', ingredients: ['1kg Beef', 'Oysters'], instructions: 'Step-by-step instructions here...', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80' }
  ]);
  const [favorites, setFavorites] = useState([]);
  const [myFood, setMyFood] = useState([]);

  const toggleFavorite = (recipe) => {
    setFavorites((prev) => 
      prev.find((r) => r.id === recipe.id) 
        ? prev.filter((r) => r.id !== recipe.id) 
        : [...prev, recipe]
    );
  };

  const addMyFood = (recipe) => {
    setMyFood((prev) => [...prev, recipe]);
    setRecipes((prev) => [...prev, recipe]);
  };

  const deleteMyFood = (id) => {
    setMyFood((prev) => prev.filter((r) => r.id !== id));
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const editRecipe = (updatedRecipe) => {
    setMyFood((prev) => prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)));
    setRecipes((prev) => prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)));
    setFavorites((prev) => prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)));
  };

  return (
    <RecipeContext.Provider value={{ recipes, favorites, toggleFavorite, myFood, addMyFood, deleteMyFood, editRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};
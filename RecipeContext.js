import React, { createContext, useState } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([
    { id: '1', name: 'Beef and Mustard Pie', category: 'Beef', prepTime: '35 Mins', servings: '03 Servings', calories: '103 Cal', difficulty: 'Medium', ingredients: ['1kg Beef', '2 tbs Plain Flour', '2 tbs Rapeseed Oil', 'Mustard', 'Onions'], instructions: '1. Preheat oven to 200C. \n2. Mix beef and flour. \n3. Heat oil and brown meat. \n4. Add mustard and onions, cook until soft. \n5. Cover with pastry and bake for 30 minutes.', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80' },
    { id: '2', name: 'Classic Beef Burger', category: 'Beef', prepTime: '20 Mins', servings: '02 Servings', calories: '450 Cal', difficulty: 'Easy', ingredients: ['500g Ground Beef', 'Burger Buns', 'Cheddar Cheese', 'Lettuce', 'Tomato'], instructions: '1. Form beef into patties. \n2. Grill for 5 minutes per side. \n3. Add cheese to melt. \n4. Toast buns and assemble.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
    { id: '3', name: 'Lemon Herb Chicken', category: 'Chicken', prepTime: '45 Mins', servings: '04 Servings', calories: '320 Cal', difficulty: 'Easy', ingredients: ['4 Chicken Breasts', 'Lemon Juice', 'Garlic', 'Rosemary', 'Olive Oil'], instructions: '1. Marinate chicken in lemon, garlic, rosemary, and oil. \n2. Bake at 200C for 30 minutes. \n3. Serve with roasted vegetables.', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80' },
    { id: '4', name: 'Creamy Mushroom Pasta', category: 'Pasta', prepTime: '25 Mins', servings: '02 Servings', calories: '550 Cal', difficulty: 'Medium', ingredients: ['200g Pasta', 'Mushrooms', 'Heavy Cream', 'Garlic', 'Parmesan'], instructions: '1. Boil pasta. \n2. Sauté garlic and mushrooms. \n3. Stir in cream and simmer. \n4. Toss with pasta and top with parmesan.', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80' },
    { id: '5', name: 'Grilled Salmon', category: 'Seafood', prepTime: '15 Mins', servings: '02 Servings', calories: '400 Cal', difficulty: 'Easy', ingredients: ['2 Salmon Fillets', 'Olive Oil', 'Lemon', 'Dill', 'Salt & Pepper'], instructions: '1. Season salmon. \n2. Grill for 4-5 minutes per side. \n3. Garnish with lemon and dill.', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80' },
    { id: '6', name: 'Chocolate Lava Cake', category: 'Dessert', prepTime: '30 Mins', servings: '04 Servings', calories: '600 Cal', difficulty: 'Hard', ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'], instructions: '1. Melt chocolate and butter. \n2. Whisk eggs and sugar. \n3. Fold in chocolate and flour. \n4. Bake at 200C for 12 minutes.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
    { id: '7', name: 'Spicy Lamb Chops', category: 'Lamb', prepTime: '35 Mins', servings: '03 Servings', calories: '480 Cal', difficulty: 'Medium', ingredients: ['6 Lamb Chops', 'Paprika', 'Cumin', 'Garlic', 'Yogurt'], instructions: '1. Marinate lamb in spices and yogurt. \n2. Grill or pan-sear for 4 mins per side. \n3. Let rest before serving.', image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?auto=format&fit=crop&w=800&q=80' },
    { id: '8', name: 'Avocado Toast', category: 'Vegetarian', prepTime: '10 Mins', servings: '01 Servings', calories: '250 Cal', difficulty: 'Easy', ingredients: ['Sourdough Bread', 'Avocado', 'Lemon Juice', 'Chili Flakes', 'Salt'], instructions: '1. Toast bread. \n2. Mash avocado with lemon. \n3. Spread on toast and top with chili flakes.', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80' },
    { id: 'm1', name: 'My Special Omelette', category: 'My Food', prepTime: '10 Mins', servings: '01 Servings', calories: '220 Cal', difficulty: 'Easy', ingredients: ['3 Eggs', 'Cheese', 'Spinach', 'Onion'], instructions: '1. Whisk eggs. \n2. Sauté onions and spinach. \n3. Pour eggs, add cheese, fold.', image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80' },
    { id: 'm2', name: 'Family Secret Curry', category: 'My Food', prepTime: '60 Mins', servings: '06 Servings', calories: '450 Cal', difficulty: 'Medium', ingredients: ['Chicken', 'Curry Paste', 'Coconut Milk', 'Potatoes', 'Carrots'], instructions: '1. Brown chicken. \n2. Add paste and coconut milk. \n3. Simmer with veggies for 40 mins.', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' }
  ]);
  const [favorites, setFavorites] = useState([]);
  const [myFood, setMyFood] = useState([
    { id: 'm1', name: 'My Special Omelette', category: 'My Food', prepTime: '10 Mins', servings: '01 Servings', calories: '220 Cal', difficulty: 'Easy', ingredients: ['3 Eggs', 'Cheese', 'Spinach', 'Onion'], instructions: '1. Whisk eggs. \n2. Sauté onions and spinach. \n3. Pour eggs, add cheese, fold.', image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80' },
    { id: 'm2', name: 'Family Secret Curry', category: 'My Food', prepTime: '60 Mins', servings: '06 Servings', calories: '450 Cal', difficulty: 'Medium', ingredients: ['Chicken', 'Curry Paste', 'Coconut Milk', 'Potatoes', 'Carrots'], instructions: '1. Brown chicken. \n2. Add paste and coconut milk. \n3. Simmer with veggies for 40 mins.', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' }
  ]);

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
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

const recipesCollection = collection(db, 'recipes');

export const recipeService = {
  // 1. Fetch Global/Public Recipes
  getGlobalRecipes: async () => {
    try {
      const q = query(recipesCollection, where("isPublic", "==", true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching global recipes:", error);
      return []; // Return empty array if offline and not cached yet
    }
  },

  // 2. Fetch a specific user's recipes (My Food)
  getUserRecipes: async (userId) => {
    try {
      const q = query(recipesCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return [];
    }
  },

  // 3. Add a New Recipe (Firestore handles offline syncing automatically!)
  addRecipe: async (recipeData) => {
    try {
      // recipeData expects: title, ingredients, instructions, userId, isPublic, imageUrl
      const docRef = await addDoc(recipesCollection, {
        ...recipeData,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error;
    }
  }
};
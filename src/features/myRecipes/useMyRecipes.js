import { useContext, useState, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RecipeContext } from '../../core/utils/RecipeContext';
import { useHideOnScroll } from '../../core/utils/TabContext';

export default function useMyRecipes() {
  const { myRecipes, deleteMyRecipe, loading } = useContext(RecipeContext);
  const { handleScroll, showTabBar } = useHideOnScroll();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (showTabBar) showTabBar();
    }, [showTabBar])
  );

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return myRecipes;
    return myRecipes.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [myRecipes, searchQuery]);

  const confirmDelete = (id, name) => {
    Alert.alert(
      "Delete Recipe",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMyRecipe(id) }
      ]
    );
  };

  return {
    loading,
    searchQuery, setSearchQuery,
    filteredRecipes,
    confirmDelete,
    handleScroll
  };
}

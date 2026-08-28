import { useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { useHideOnScroll } from '../../../core/utils/TabContext';

export default function useFavorites() {
  const { favorites, toggleFavorite } = useContext(RecipeContext);
  const { handleScroll, showTabBar } = useHideOnScroll();

  useFocusEffect(
    useCallback(() => {
      if (showTabBar) showTabBar();
    }, [showTabBar])
  );

  const handleRemove = (recipe) => {
    Alert.alert(
      "Remove Favorite",
      `Are you sure you want to remove "${recipe.name}" from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: () => toggleFavorite(recipe) 
        }
      ]
    );
  };

  return {
    favorites,
    handleScroll,
    handleRemove
  };
}

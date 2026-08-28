import { useContext } from 'react';
import { RecipeContext } from '../../../core/utils/RecipeContext';

export default function useRecipeDetails(route, navigation) {
  const { recipe } = route.params;
  const { toggleFavorite, favorites } = useContext(RecipeContext);
  
  const isFav = favorites.find((r) => r.id === recipe.id);

  return {
    recipe,
    isFav,
    toggleFavorite,
    navigation
  };
}

import { useContext, useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { useAuth } from '../../../core/utils/AuthContext';
import { useHideOnScroll } from '../../../core/utils/TabContext';

export default function useMainFeed() {
  const { user } = useAuth();
  const { recipes, loading } = useContext(RecipeContext);
  const { handleScroll, showTabBar } = useHideOnScroll();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (showTabBar) showTabBar();
    }, [showTabBar])
  );

  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const listData = useMemo(() => {
    const formatData = (dataList, numColumns) => {
      const formattedData = [];
      for (let i = 0; i < dataList.length; i += numColumns) {
        formattedData.push(dataList.slice(i, i + numColumns));
      }
      return formattedData;
    };

    const recipeRows = formatData(filteredRecipes, 2);

    const data = [
      { type: 'header', id: 'header' },
      { type: 'sticky_section', id: 'sticky_section' },
      ...recipeRows.map((row, index) => ({ type: 'row', id: `row_${index}`, items: row }))
    ];

    if (loading) {
      data.push({ type: 'loading', id: 'loading' });
    } else if (filteredRecipes.length === 0) {
      data.push({ type: 'empty', id: 'empty' });
    }
    
    return data;
  }, [filteredRecipes, loading]);

  return {
    user,
    listData,
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    handleScroll
  };
}

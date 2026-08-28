import React, { useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../../shared/components/RecipeCard';
import { useHideOnScroll } from '../../../core/utils/TabContext';

export default function Favorites({ navigation }) {
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.title}>My <Text style={styles.highlight}>Favorites</Text></Text>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites added yet.</Text>
          <Text style={styles.emptySubtext}>Heart your favorite recipes and they'll appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onPress={() => navigation.navigate('RecipeDetails', { recipe: item })}
              onHeartPress={() => handleRemove(item)}
              isFavorite={true}
              showStats={true}
              imageContainerStyle={{ height: 220 }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fafafa',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    color: '#fca311',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#555',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});
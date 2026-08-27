import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function RecipeCard({ recipe, onPress, renderActions, style }) {
  const imageSource = typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image;
  return (
    <TouchableOpacity style={[styles.cardContainer, style]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.title} numberOfLines={1}>{recipe.name}</Text>
        <Text style={styles.category}>{recipe.category}</Text>
        {renderActions && (
          <View style={styles.actionsContainer}>
            {renderActions()}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    height: 150, // <-- Adjust this value to change image height
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 16, // <-- Adjust this value to change image roundness
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16, // <-- Make sure this matches imageWrapper borderRadius
    resizeMode: 'cover',
  },
  infoWrapper: {
    backgroundColor: '#f5f5f5',
    marginTop: -16, // <-- Adjust this to change how much it tucks under the image
    paddingTop: 28, 
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16, // <-- Adjust this value for bottom corner roundness
    borderBottomRightRadius: 16, // <-- Adjust this value for bottom corner roundness
    zIndex: 1,
  },
  title: {
    fontSize: 18, // <-- Adjust this value to change Title text size
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  category: {
    fontSize: 14, // <-- Adjust this value to change Category text size
    color: '#666',
  },
  actionsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

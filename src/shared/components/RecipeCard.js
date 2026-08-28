import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeCard({ recipe, onPress, renderActions, onHeartPress, isFavorite = true, showStats = false, style, imageContainerStyle }) {
  const imageSource = typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image;
  return (
    <TouchableOpacity style={[styles.cardContainer, style]} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.imageWrapper, imageContainerStyle]}>
        <Image source={imageSource} style={styles.image} contentFit="cover" cachePolicy="disk" />
        {onHeartPress && (
          <TouchableOpacity style={styles.heartButton} onPress={onHeartPress}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#ff4d4d" : "#fff"} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.title} numberOfLines={1}>{recipe.name}</Text>
        <Text style={styles.category}>{recipe.creatorName ? `By ${recipe.creatorName}` : recipe.category}</Text>
        {showStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={14} color="#fca311" />
              <Text style={styles.statText}>{recipe.prepTime || 'N/A'}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={14} color="#fca311" />
              <Text style={styles.statText}>{recipe.servings || 'N/A'}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={14} color="#fca311" />
              <Text style={styles.statText}>{recipe.calories ? recipe.calories.replace(' Cal', '') : 'N/A'}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="stats-chart-outline" size={14} color="#fca311" />
              <Text style={styles.statText}>{recipe.difficulty || 'N/A'}</Text>
            </View>
          </View>
        )}
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
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 6,
    zIndex: 20,
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
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  }
});

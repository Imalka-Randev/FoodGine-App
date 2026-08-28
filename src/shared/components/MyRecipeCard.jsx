import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

export default function MyRecipeCard({ recipe, onPress, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const imageSource = typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image;

  return (
    <TouchableOpacity 
      style={styles.myRecipesCard} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.cardImage} contentFit="cover" cachePolicy="disk" />
        
        {/* Floating Action Buttons */}
        <View style={styles.floatingActions}>
          {showMenu && (
            <>
              <TouchableOpacity 
                style={[styles.circleBtn, { backgroundColor: '#1e90ff' }]} // Blue edit
                onPress={() => {
                  setShowMenu(false);
                  onEdit();
                }}
              >
                <Ionicons name="pencil" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.circleBtn, { backgroundColor: '#ff4d4d' }]} // Red delete
                onPress={() => {
                  setShowMenu(false);
                  onDelete();
                }}
              >
                <Ionicons name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity 
            style={[styles.circleBtn, { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 }]} 
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom Info Section (Beige) */}
      <View style={styles.infoSection}>
        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{recipe.name}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color="#faf7f7ff" />
            <Text style={styles.statText}>{recipe.prepTime || 'N/A'}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={14} color="#faf7f7ff" />
            <Text style={styles.statText}>{recipe.servings || 'N/A'}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={14} color="#faf7f7ff" />
            <Text style={styles.statText}>{recipe.calories ? recipe.calories.replace(' Cal', '') : 'N/A'}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="stats-chart-outline" size={14} color="#faf7f7ff" />
            <Text style={styles.statText}>{recipe.difficulty || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Custom MyRecipes Card Styles
  myRecipesCard: {
    backgroundColor: '#ffff', 
    borderRadius: 20,
    marginBottom: 20,
    height: 220, // Exactly FeatureCarousel active card height
    overflow: 'hidden',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d3d3d3ff', 
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  floatingActions: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    zIndex: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  infoSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75, 
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#f9ad21d4', // Transparent beige overlay
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#faf7f7ff',
    marginLeft: 4,
    fontWeight: '600',
  }
});

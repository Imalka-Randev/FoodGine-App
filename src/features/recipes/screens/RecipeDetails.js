import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RecipeDetails({ route, navigation }) {
  const { recipe } = route.params;
  const { toggleFavorite, favorites } = useContext(RecipeContext);
  const isFav = favorites.find((r) => r.id === recipe.id);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image} style={styles.image} contentFit="cover" cachePolicy="disk" />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(recipe)} style={styles.favButton}>
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={26} color={isFav ? "#ff4d4d" : "#333"} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{recipe.name}</Text>
            <Text style={styles.subtitle}>{recipe.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={24} color="#fca311" />
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{recipe.prepTime}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="people-outline" size={24} color="#fca311" />
              <Text style={styles.infoLabel}>Servings</Text>
              <Text style={styles.infoValue}>
                {recipe.servings && recipe.servings !== 'N/A' 
                  ? (recipe.servings.match(/\d+/) ? recipe.servings.match(/\d+/)[0] : recipe.servings)
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="flame-outline" size={24} color="#fca311" />
              <Text style={styles.infoLabel}>Calories</Text>
              <Text style={styles.infoValue}>{recipe.calories}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="stats-chart-outline" size={24} color="#fca311" />
              <Text style={styles.infoLabel}>Level</Text>
              <Text style={styles.infoValue}>{recipe.difficulty}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsCard}>
              {recipe.ingredients.map((ing, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsCard}>
              {recipe.instructions ? recipe.instructions.split('\n').filter(s => s.trim().length > 0).map((step, idx) => {
                const match = step.match(/^(\d+\.)\s*(.*)/);
                if (match) {
                  return (
                    <View key={idx} style={styles.instructionStepContainer}>
                      <Text style={styles.instructionNumber}>{match[1]}</Text>
                      <Text style={styles.instructionsText}>{match[2]}</Text>
                    </View>
                  );
                }
                return (
                  <View key={idx} style={styles.instructionStepContainer}>
                    <Text style={styles.instructionsText}>{step}</Text>
                  </View>
                );
              }) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fafafa' 
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: { 
    width: '100%', 
    height: '100%',
    backgroundColor: '#ccc' 
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favButton: { 
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contentContainer: {
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: { 
    paddingHorizontal: 24, 
    marginBottom: 24,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#333',
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#fca311', 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginBottom: 30,
  },
  infoBox: { 
    flex: 1,
    padding: 12, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#333',
    marginBottom: 16,
  },
  ingredientsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fca311',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: { 
    fontSize: 16, 
    color: '#444',
    flex: 1,
    lineHeight: 24,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  instructionStepContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fca311',
    marginRight: 8,
  },
  instructionsText: { 
    flex: 1,
    fontSize: 16, 
    color: '#444', 
    lineHeight: 24,
  }
});
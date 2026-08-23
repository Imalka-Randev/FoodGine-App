import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { aiService } from '../../../services/ai/aiService';
import { RecipeContext } from '../../../core/utils/RecipeContext';

export default function FoodbyScreen({ navigation }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiRecipe, setAiRecipe] = useState(null);
  
  const { addMyFood } = useContext(RecipeContext);

  const handleAskFoodby = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setAiRecipe(null); // Clear previous recipe
    try {
      const generatedData = await aiService.generateRecipe(prompt);
      setAiRecipe(generatedData);
    } catch (error) {
      Alert.alert("Oops!", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    if (!aiRecipe) return;
    
    // Format it to match our database structure
    const newRecipe = {
      name: aiRecipe.name,
      category: aiRecipe.category,
      prepTime: aiRecipe.prepTime,
      difficulty: aiRecipe.difficulty,
      calories: aiRecipe.calories,
      ingredients: aiRecipe.ingredients,
      instructions: aiRecipe.instructions,
      isPublic: false, // Save as private by default
      // Use a placeholder image for AI recipes until they take a photo
      image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80' 
    };

    addMyFood(newRecipe);
    Alert.alert("Success!", "Recipe saved to My Food!");
    setAiRecipe(null);
    setPrompt('');
    navigation.navigate('My Food'); // Jump to My Food tab to see it
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={28} color="#fca311" />
        <Text style={styles.title}>Foodby AI</Text>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.welcomeText}>
          Tell me what ingredients you have, how you're feeling, or your health goals, and I'll create a recipe for you!
        </Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fca311" />
            <Text style={styles.loadingText}>Foodby is thinking...</Text>
          </View>
        )}

        {/* Display the AI Recipe Result */}
        {aiRecipe && !loading && (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{aiRecipe.name}</Text>
            
            {/* Show Health Warning if AI generated one! */}
            {aiRecipe.warning && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color="#d62828" />
                <Text style={styles.warningText}>{aiRecipe.warning}</Text>
              </View>
            )}

            <Text style={styles.recipeInfo}>{aiRecipe.prepTime} • {aiRecipe.calories} • {aiRecipe.difficulty}</Text>
            
            <Text style={styles.subTitle}>Ingredients:</Text>
            {aiRecipe.ingredients?.map((ing, i) => (
              <Text key={i} style={styles.text}>• {ing}</Text>
            ))}

            <Text style={styles.subTitle}>Instructions:</Text>
            <Text style={styles.text}>{aiRecipe.instructions}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
              <Ionicons name="bookmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save to My Food</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g., I have chicken and tomatoes..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !prompt.trim() && { opacity: 0.5 }]} 
          onPress={handleAskFoodby}
          disabled={!prompt.trim() || loading}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  chatArea: { flex: 1, padding: 20 },
  welcomeText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  loadingContainer: { alignItems: 'center', marginTop: 40 },
  loadingText: { marginTop: 10, color: '#888', fontWeight: '600' },
  recipeCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  recipeTitle: { fontSize: 22, fontWeight: 'bold', color: '#14213d', marginBottom: 10 },
  warningBox: { flexDirection: 'row', backgroundColor: '#ffe5e5', padding: 10, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  warningText: { color: '#d62828', flex: 1, marginLeft: 10, fontWeight: '600' },
  recipeInfo: { color: '#fca311', fontWeight: 'bold', marginBottom: 15 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#333' },
  text: { fontSize: 15, color: '#555', lineHeight: 22 },
  saveButton: { flexDirection: 'row', backgroundColor: '#14213d', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12, maxHeight: 100, fontSize: 16 },
  sendButton: { backgroundColor: '#fca311', width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginBottom: 2 }
});
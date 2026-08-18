import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { RecipeContext } from '../RecipeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { Ionicons } from '@expo/vector-icons';

export default function MyFood({ navigation }) {
  const { myFood, deleteMyFood } = useContext(RecipeContext);

  const renderActions = (item) => (
    <>
      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddRecipe', { recipe: item })}>
        <Ionicons name="create-outline" size={20} color="#48cae4" />
        <Text style={[styles.actionText, { color: '#48cae4' }]}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => deleteMyFood(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
        <Text style={[styles.actionText, { color: '#ff4d4d' }]}>Delete</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Food</Text>
      </View>

      {myFood.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes added yet.</Text>
          <Text style={styles.emptySubtext}>Create your own custom recipes!</Text>
        </View>
      ) : (
        <FlatList
          data={myFood}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onPress={() => navigation.navigate('RecipeDetails', { recipe: item })} 
              renderActions={() => renderActions(item)}
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
    backgroundColor: '#fafafa' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#333',
  },
  addButton: { 
    flexDirection: 'row',
    backgroundColor: '#fca311', 
    paddingHorizontal: 16,
    paddingVertical: 10, 
    borderRadius: 24, 
    alignItems: 'center',
    shadowColor: '#fca311',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700',
    marginLeft: 4,
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
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  actionText: {
    fontWeight: '700',
    marginLeft: 6,
  }
});
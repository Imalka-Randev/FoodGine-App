import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RecipeProvider } from './RecipeContext';
import MainFeed from './screens/MainFeed';
import RecipeDetails from './screens/RecipeDetails';
import Favorites from './screens/Favorites';
import MyFood from './screens/MyFood';
import AddRecipe from './screens/AddRecipe';

const Stack = createStackNavigator();

export default function App() {
  return (
    <RecipeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainFeed">
          <Stack.Screen name="MainFeed" component={MainFeed} options={{ headerShown: false }} />
          <Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{ headerTitle: 'RecipeDetails' }} />
          <Stack.Screen name="Favorites" component={Favorites} options={{ headerTitle: 'My Favorites' }} />
          <Stack.Screen name="MyFood" component={MyFood} options={{ headerTitle: 'My Foods' }} />
          <Stack.Screen name="AddRecipe" component={AddRecipe} options={{ headerTitle: 'Add Recipe' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecipeProvider>
  );
}
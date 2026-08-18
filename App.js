import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RecipeProvider } from './RecipeContext';
import MainFeed from './screens/MainFeed';
import RecipeDetails from './screens/RecipeDetails';
import Favorites from './screens/Favorites';
import MyFood from './screens/MyFood';
import AddRecipe from './screens/AddRecipe';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'My Food') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Add Recipe') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fca311',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }
      })}
    >
      <Tab.Screen name="Home" component={MainFeed} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="My Food" component={MyFood} />
      <Tab.Screen name="Add Recipe" component={AddRecipe} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <RecipeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainTabs">
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="RecipeDetails" 
            component={RecipeDetails} 
            options={{ 
              headerTitle: 'Recipe Details',
              headerBackTitleVisible: false,
              headerTintColor: '#fca311',
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RecipeProvider>
  );
}
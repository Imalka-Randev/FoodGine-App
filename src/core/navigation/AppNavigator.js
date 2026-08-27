import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MainFeed from '../../features/recipes/screens/MainFeed';
import RecipeDetails from '../../features/recipes/screens/RecipeDetails';
import Favorites from '../../features/recipes/screens/Favorites';
import MyRecipes from '../../features/myRecipes/screens/MyRecipes';
import AddRecipe from '../../features/recipes/screens/AddRecipe';

import { useAuth } from '../../features/auth/AuthContext';
import { View, ActivityIndicator, Animated } from 'react-native';
import AuthNavigator from './AuthNavigator';
import ProfileScreen from '../../features/auth/screens/ProfileScreen';
import SettingsScreen from '../../features/auth/screens/SettingsScreen';

import FoodbyScreen from '../../features/assistant/screens/FoodbyScreen';
import { TabProvider, TabContext } from '../utils/TabContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { tabBarOffset } = useContext(TabContext);

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <Animated.View style={{ transform: [{ translateY: tabBarOffset }], position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <BottomTabBar {...props} />
        </Animated.View>
      )}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'My Recipes') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Add Recipe') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {  
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Foodby') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
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
          backgroundColor: '#fff', // Make sure background isn't transparent over content
        }
      })}
    >
      <Tab.Screen name="Home" component={MainFeed} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Add Recipe" component={AddRecipe} />
      <Tab.Screen name="My Recipes" component={MyRecipes} />
      <Tab.Screen name="Foodby" component={FoodbyScreen} />
    </Tab.Navigator>
  );
}


export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a spinner while Firebase is checking the user's login status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fca311" />
      </View>
    );
  }

  // The Magic Gateway: Conditionally render based on 'user' state
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // User is logged in -> Show main app
        <Stack.Screen name="MainApp">
          {() => (
            <TabProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                <Stack.Screen 
                  name="RecipeDetails" 
                  component={RecipeDetails} 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="Settings" 
                  component={SettingsScreen} 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="Profile" 
                  component={ProfileScreen} 
                  options={{ headerShown: false }} 
                />
              </Stack.Navigator>
            </TabProvider>
          )}
        </Stack.Screen>
      ) : (
        // User is NOT logged in -> Show login/signup
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

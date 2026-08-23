// src/core/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import SignupScreen from '../../features/auth/screens/SignupScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
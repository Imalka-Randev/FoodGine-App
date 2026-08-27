// App.js
import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/features/auth/AuthContext'; // Import this!
import { RecipeProvider } from './src/core/utils/RecipeContext';
import { ChatProvider } from './src/core/utils/ChatContext';
import AppNavigator from './src/core/navigation/AppNavigator';

LogBox.ignoreLogs(['InteractionManager has been deprecated']);

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('InteractionManager has been deprecated')) {
    return;
  }
  originalWarn(...args);
};

export default function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <ChatProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ChatProvider>
      </RecipeProvider>
    </AuthProvider>
  );
}
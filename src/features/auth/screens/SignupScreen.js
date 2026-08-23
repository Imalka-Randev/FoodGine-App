import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../services/firebase/firebaseConfig';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      // Creates a new user in Firebase Auth
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join FoodGine today</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 chars)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Reuse the exact same styles from LoginScreen here
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#14213d', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  button: {
    backgroundColor: '#fca311',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#fca311', textAlign: 'center', marginTop: 20, fontSize: 16 }
});
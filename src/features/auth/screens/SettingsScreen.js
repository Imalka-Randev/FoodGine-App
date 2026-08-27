import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function SettingsScreen({ navigation }) {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleUpdateName = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }
    setLoadingName(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      Alert.alert('Success', 'Display name updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoadingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please enter both current and new passwords');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    setLoadingPass(true);
    try {
      // Re-authenticate user first (industry standard requirement for sensitive operations)
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Now update the password
      await updatePassword(user, newPassword);
      
      Alert.alert('Success', 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        
        {/* Profile Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Settings</Text>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleUpdateName}
            disabled={loadingName}
          >
            {loadingName ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Name</Text>}
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Ionicons name={showCurrentPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.securityButton]} 
            onPress={handleUpdatePassword}
            disabled={loadingPass}
          >
            {loadingPass ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Change Password</Text>}
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 20 
  },
  backButton: { padding: 5 },
  title: { fontSize: 22, fontWeight: '700', color: '#333' },
  content: { paddingHorizontal: 20 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 12,
  },
  button: {
    backgroundColor: '#fca311',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  securityButton: {
    backgroundColor: '#d62828',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});

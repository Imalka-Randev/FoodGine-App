import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../../core/utils/AuthContext';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function useSettings() {
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
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
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

  return {
    displayName, setDisplayName,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    loadingName,
    loadingPass,
    showCurrentPassword, setShowCurrentPassword,
    showNewPassword, setShowNewPassword,
    handleUpdateName,
    handleUpdatePassword
  };
}

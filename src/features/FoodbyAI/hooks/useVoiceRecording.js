import { useState } from 'react';
import { Alert } from 'react-native';
import { useAudioRecorder, requestRecordingPermissionsAsync, RecordingPresets, setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system/legacy';

export default function useVoiceRecording(isOffline, onAudioReady) {
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const startRecording = async () => {
    try {
      if (isOffline) {
        Alert.alert("Offline", "You need internet to use voice chat.");
        return;
      }
      const perm = await requestRecordingPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert("Permission Required", "Please allow microphone access to use voice chat.");
        return;
      }
      
      // Stop any current speech
      Speech.stop();

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      audioRecorder.stop();
      
      // Give it a tiny delay to finish writing the file
      setTimeout(async () => {
        const uri = audioRecorder.uri;
        if (!uri) return;

        // Read audio as base64
        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Pass to callback
        onAudioReady(base64Audio);
      }, 300);

    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
}

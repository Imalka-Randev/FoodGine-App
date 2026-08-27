import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, FlatList, LayoutAnimation, UIManager, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { aiService } from '../../../services/ai/aiService';
import { RecipeContext } from '../../../core/utils/RecipeContext';
import { ChatContext } from '../../../core/utils/ChatContext';
import * as Network from 'expo-network';
import { useAudioRecorder, requestRecordingPermissionsAsync, RecordingPresets, setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system/legacy';
import { useHideOnScroll } from '../../../core/utils/TabContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FoodbyScreen({ navigation }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef();
  const { handleScroll, tabBarOffset } = useHideOnScroll();
  const insets = useSafeAreaInsets();

  const { addMyRecipe, myRecipes } = useContext(RecipeContext);
  const { chats, createChat, addMessageToChat, renameChat, deleteChat, setActiveRecipeForChat } = useContext(ChatContext);

  useEffect(() => {
    checkNetwork();
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats]);

  const checkNetwork = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsOffline(!networkState.isConnected);
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];
  const activeRecipe = activeChat ? activeChat.activeRecipe : null;

  // Check if current active recipe is already saved
  const isRecipeSaved = activeRecipe && myRecipes.some(r => r.name === activeRecipe.name);

  const toggleRecipeExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsRecipeExpanded(!isRecipeExpanded);
  };

  const handleNewChat = async () => {
    if (isOffline) {
      Alert.alert("Offline", "You need internet to start a new chat.");
      return;
    }
    const newChat = await createChat();
    setActiveChatId(newChat.id);
    setIsRecipeExpanded(false);
    setShowSidebar(false);
  };

  const showChatOptions = (id, currentTitle) => {
    Alert.alert(
      "Chat Options",
      "What would you like to do?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Rename", 
          onPress: () => {
            Alert.prompt(
              "Rename Chat",
              "Enter a new name for this conversation:",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Save", onPress: (newName) => {
                  if (newName && newName.trim()) renameChat(id, newName.trim());
                }}
              ],
              "plain-text",
              currentTitle
            );
          }
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await deleteChat(id);
            if (activeChatId === id) {
              const remaining = chats.filter(c => c.id !== id);
              setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
              setIsRecipeExpanded(false);
            }
          }
        }
      ]
    );
  };

  const handleAskFoodby = async (textToSubmit = prompt, isRetry = false, audioBase64 = null) => {
    const text = textToSubmit ? textToSubmit.trim() : (audioBase64 ? "🎙️ Voice Message" : "");
    if (!text && !audioBase64) return;
    if (isOffline) {
      Alert.alert("Offline", "You need internet to chat with Foodby.");
      return;
    }
    
    let currentChatId = activeChatId;
    if (!currentChatId) {
      const newChat = await createChat();
      currentChatId = newChat.id;
      setActiveChatId(currentChatId);
    }

    if (!isRetry) {
      const userMessage = { role: 'user', text: text, isAudio: !!audioBase64 };
      await addMessageToChat(currentChatId, userMessage);
    }
    
    const chatToUpdate = chats.find(c => c.id === currentChatId);
    if (chatToUpdate && chatToUpdate.title === 'New Chat') {
      renameChat(currentChatId, text.slice(0, 20) + '...');
    }

    if (!isRetry) {
      setPrompt('');
    }
    setLoading(true);

    try {
      const activeC = chats.find(c => c.id === currentChatId);
      const chatHistory = activeC ? activeC.messages : [];
      
      const responseText = await aiService.sendMessage(
        chatHistory, 
        audioBase64 ? null : text, 
        audioBase64
      );
      
      const parsedRecipe = aiService.parseRecipeFromText(responseText);
      const cleanMessage = aiService.cleanMessageText(responseText);
      
      // If voice message was sent, speak the response
      if (audioBase64) {
        Speech.speak(cleanMessage, { language: 'en', rate: 0.9, pitch: 1.0 });
      }
      
      if (parsedRecipe) {
        await setActiveRecipeForChat(currentChatId, parsedRecipe);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsRecipeExpanded(true);
        
        await addMessageToChat(currentChatId, { role: 'ai', text: cleanMessage, hasRecipeUpdate: true });
      } else {
        await addMessageToChat(currentChatId, { role: 'ai', text: cleanMessage });
      }
      
    } catch (error) {
      Alert.alert("Oops!", error.message);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

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

        // Send to AI
        handleAskFoodby(null, false, base64Audio);
      }, 300);

    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleEditRetry = (msgText) => {
    setPrompt(msgText);
    Alert.alert("Edit", "Message copied to input field. You can edit and send it again.");
  };

  const handleSaveRecipe = (aiRecipe) => {
    if (!aiRecipe || isRecipeSaved) return;
    Alert.alert(
      "Save Recipe",
      "Do you want to save this recipe as public or private?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Private", 
          onPress: () => saveRecipeAction(aiRecipe, false) 
        },
        { 
          text: "Public", 
          onPress: () => saveRecipeAction(aiRecipe, true) 
        }
      ]
    );
  };

  const saveRecipeAction = (aiRecipe, isPublic) => {
    const newRecipe = {
      name: aiRecipe.name,
      category: aiRecipe.category,
      prepTime: aiRecipe.prepTime,
      difficulty: aiRecipe.difficulty,
      calories: aiRecipe.calories,
      servings: aiRecipe.servings,
      ingredients: aiRecipe.ingredients,
      instructions: aiRecipe.instructions,
      isPublic: isPublic,
      image: require('../../../../assets/images/fallbacks/foodby_recipe.jpg') 
    };

    addMyRecipe(newRecipe);
    Alert.alert("Success!", "Recipe saved to My Recipes!");
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    const cleanText = isUser ? msg.text : aiService.cleanMessageText(msg.text);

    return (
      <View key={index} style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {cleanText.length > 0 && (
            <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>{cleanText}</Text>
          )}
          {msg.hasRecipeUpdate && (
            <View style={styles.recipeUpdateBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#38b000" />
              <Text style={styles.recipeUpdateText}>Recipe Updated</Text>
            </View>
          )}
        </View>

        {isUser && !msg.isAudio && (
          <View style={styles.userActionBar}>
            <TouchableOpacity onPress={() => handleEditRetry(msg.text)} style={styles.actionIcon}>
              <Ionicons name="pencil" size={16} color="#888" />
              <Text style={styles.actionText}>Edit / Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowSidebar(true)} style={styles.headerLeft}>
          <Ionicons name="menu" size={32} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Ionicons name="sparkles" size={24} color="#fca311" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Foodby <Text style={styles.highlight}>AI</Text></Text>
        </View>

        <View style={styles.headerRight}>
          {isOffline && <Text style={styles.offlineBadge}>Offline</Text>}
        </View>
      </View>

      {/* Pinned Active Recipe */}
      {activeRecipe && (
        <View style={[styles.pinnedRecipeContainer, isRecipeExpanded && { flex: 1, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
          <View style={styles.pinnedRecipeHeader}>
            <Ionicons name="restaurant" size={20} color="#14213d" />
            <Text style={styles.pinnedRecipeTitle} numberOfLines={1}>{activeRecipe.name}</Text>
            
            <TouchableOpacity 
              onPress={() => handleSaveRecipe(activeRecipe)} 
              style={[styles.pinnedSaveIcon, isRecipeSaved && { opacity: 0.7 }]}
              disabled={isRecipeSaved}
            >
              <Ionicons name={isRecipeSaved ? "bookmark" : "bookmark-outline"} size={20} color="#fca311" />
            </TouchableOpacity>
          </View>
          
          {!isRecipeExpanded && (
            <Text style={styles.pinnedRecipeInfo}>{activeRecipe.prepTime} • {activeRecipe.calories} • {activeRecipe.difficulty}{activeRecipe.servings ? ` • ${activeRecipe.servings}` : ''}</Text>
          )}
          
          {isRecipeExpanded && (
            <ScrollView style={styles.expandedRecipeContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.pinnedRecipeInfo}>{activeRecipe.prepTime} • {activeRecipe.calories} • {activeRecipe.difficulty}{activeRecipe.servings ? ` • ${activeRecipe.servings}` : ''}</Text>
              
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {activeRecipe.ingredients.map((ing, i) => (
                <Text key={i} style={styles.ingredientText}>• {ing}</Text>
              ))}
              
              <Text style={styles.sectionTitle}>Instructions</Text>
              {activeRecipe.instructions ? activeRecipe.instructions.split('\n').filter(s => s.trim().length > 0).map((step, idx) => {
                const match = step.match(/^(\d+\.)\s*(.*)/);
                if (match) {
                  return (
                    <View key={idx} style={styles.instructionStepContainer}>
                      <Text style={styles.instructionNumber}>{match[1]}</Text>
                      <Text style={styles.instructionText}>{match[2]}</Text>
                    </View>
                  );
                }
                return (
                  <View key={idx} style={styles.instructionStepContainer}>
                    <Text style={styles.instructionText}>{step}</Text>
                  </View>
                );
              }) : null}
              
              {activeRecipe.warning ? (
                <View style={styles.warningBox}>
                  <Ionicons name="warning" size={16} color="#d62828" />
                  <Text style={styles.warningText}>{activeRecipe.warning}</Text>
                </View>
              ) : null}
            </ScrollView>
          )}

          <TouchableOpacity onPress={toggleRecipeExpansion} style={styles.expandToggleBtn}>
            <Ionicons name={isRecipeExpanded ? "chevron-up" : "chevron-down"} size={24} color="#bbb" />
          </TouchableOpacity>
        </View>
      )}

      {/* Sidebar Modal */}
      <Modal visible={showSidebar} animationType="fade" transparent={true}>
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Chat History</Text>
              <TouchableOpacity onPress={() => setShowSidebar(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>
            
            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.historyItem]}
                  onPress={() => { setActiveChatId(item.id); setShowSidebar(false); setIsRecipeExpanded(false); }}
                >
                  <Ionicons name="chatbubble-outline" size={20} color={activeChatId === item.id ? "#fca311" : "#666"} />
                  <Text style={[styles.historyText, activeChatId === item.id && { color: "#fca311", fontWeight: 'bold' }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <TouchableOpacity onPress={() => showChatOptions(item.id, item.title)} style={{ padding: 5 }}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          </View>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowSidebar(false)} />
        </View>
      </Modal>

      <Animated.View style={{ flex: 1, paddingBottom: tabBarOffset.interpolate({ inputRange: [0, 100], outputRange: [49 + insets.bottom, 0], extrapolate: 'clamp' }) }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, display: isRecipeExpanded ? 'none' : 'flex' }}>
          <ScrollView 
            style={styles.chatArea} 
            contentContainerStyle={{ paddingBottom: 20 }}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.length === 0 ? (
              <Text style={styles.welcomeText}>
                Tell me what ingredients you have, how you're feeling, or ask for a recipe directly!
              </Text>
            ) : (
              messages.map((msg, idx) => renderMessage(msg, idx))
            )}

            {loading && (
              <View style={[styles.messageWrapper, styles.aiWrapper]}>
                <View style={[styles.messageBubble, styles.aiBubble]}>
                  <ActivityIndicator size="small" color="#fca311" />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={[styles.micButton, isRecording && styles.micButtonRecording]} 
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isOffline || loading}
            >
              <Ionicons name={isRecording ? "stop" : "mic"} size={22} color="#fff" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder={isOffline ? "Offline mode (reading only)" : "Message Foodby..."}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              editable={!isOffline}
            />
            <TouchableOpacity 
              style={[styles.sendButton, (!prompt.trim() || isOffline) && { opacity: 0.5 }]} 
              onPress={() => handleAskFoodby(prompt, false)}
              disabled={!prompt.trim() || loading || isOffline}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  headerLeft: { width: 60 },
  headerRight: { width: 60, alignItems: 'flex-end' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#333' },
  highlight: { color: '#fca311' },
  offlineBadge: { backgroundColor: '#d62828', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, fontSize: 10, fontWeight: 'bold', overflow: 'hidden' },
  
  // Pinned Recipe
  pinnedRecipeContainer: { backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 15, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ddd', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 3, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  pinnedRecipeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  pinnedRecipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#14213d', flex: 1, marginLeft: 8 },
  pinnedSaveIcon: { padding: 5, backgroundColor: '#fdf3e1', borderRadius: 20 },
  pinnedRecipeInfo: { color: '#fca311', fontWeight: 'bold', fontSize: 13, marginTop: 5 },
  
  expandedRecipeContent: { flex: 1, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#14213d', marginTop: 10, marginBottom: 5 },
  ingredientText: { fontSize: 14, color: '#444', marginBottom: 2, marginLeft: 5 },
  instructionStepContainer: { flexDirection: 'row', marginBottom: 12 },
  instructionNumber: { fontSize: 14, fontWeight: 'bold', color: '#fca311', marginRight: 6 },
  instructionText: { flex: 1, fontSize: 14, color: '#444', lineHeight: 22 },
  
  warningBox: { flexDirection: 'row', backgroundColor: '#ffe5e5', padding: 6, borderRadius: 6, marginTop: 15, alignItems: 'center' },
  warningText: { color: '#d62828', flex: 1, marginLeft: 6, fontWeight: '600', fontSize: 12 },
  expandToggleBtn: { alignItems: 'center', marginTop: 5 },

  // Sidebar styles
  sidebarOverlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebar: { width: '75%', backgroundColor: '#fff', padding: 20, paddingTop: 60 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sidebarTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  newChatButton: { flexDirection: 'row', backgroundColor: '#fca311', padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  newChatText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  historyText: { flex: 1, marginLeft: 10, fontSize: 16, color: '#444' },

  // Chat Area
  chatArea: { flex: 1, padding: 15 },
  welcomeText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 40, fontStyle: 'italic' },
  
  messageWrapper: { marginBottom: 15, width: '100%' },
  userWrapper: { alignItems: 'flex-end' },
  aiWrapper: { alignItems: 'flex-start' },
  
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 18 },
  userBubble: { backgroundColor: '#14213d', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#e9ecef', borderBottomLeftRadius: 4 },
  
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: '#333' },

  recipeUpdateBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, padding: 6, backgroundColor: '#d8f3dc', borderRadius: 8, alignSelf: 'flex-start' },
  recipeUpdateText: { fontSize: 12, color: '#2d6a4f', marginLeft: 4, fontWeight: 'bold' },

  userActionBar: { flexDirection: 'row', marginTop: 5, marginRight: 5 },
  actionIcon: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e9ecef', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  actionText: { fontSize: 12, color: '#888', marginLeft: 4, fontWeight: 'bold' },

  // Input
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  micButton: { backgroundColor: '#4361ee', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginBottom: 0 },
  micButtonRecording: { backgroundColor: '#d62828' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12, maxHeight: 100, fontSize: 16 },
  sendButton: { backgroundColor: '#fca311', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginBottom: 0 }
});
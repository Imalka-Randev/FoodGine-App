import { useState, useContext, useEffect, useRef } from 'react';
import { Alert, LayoutAnimation } from 'react-native';
import { aiService } from '../../../services/ai/aiService';
import { ChatContext } from '../../../core/utils/ChatContext';
import * as Network from 'expo-network';
import * as Speech from 'expo-speech';

export default function useFoodbyChat() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const scrollViewRef = useRef();

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
          onPress: () => {
            Alert.alert(
              "Delete Chat",
              "Are you sure you want to delete this chat?",
              [
                { text: "Cancel", style: "cancel" },
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

  const handleEditRetry = (msgText) => {
    setPrompt(msgText);
  };

  return {
    prompt,
    setPrompt,
    loading,
    isOffline,
    activeChatId,
    setActiveChatId,
    isRecipeExpanded,
    setIsRecipeExpanded,
    showSidebar,
    setShowSidebar,
    scrollViewRef,
    messages,
    activeRecipe,
    chats,
    toggleRecipeExpansion,
    handleNewChat,
    showChatOptions,
    handleAskFoodby,
    handleEditRetry
  };
}

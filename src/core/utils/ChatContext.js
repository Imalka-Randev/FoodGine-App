import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChatContext = createContext();

const CHAT_STORAGE_KEY = '@foodby_chats';

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats)).catch(e => {
        console.error("Failed to save chats to AsyncStorage", e);
      });
    }
  }, [chats, isLoaded]);

  const loadChats = async () => {
    try {
      const storedChats = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error("Failed to load chats from AsyncStorage", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const createChat = async () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      activeRecipe: null,
      updatedAt: Date.now(),
    };
    
    setChats(prevChats => [newChat, ...prevChats].slice(0, 20)); // Limit to 20 chats
    
    return newChat;
  };

  const addMessageToChat = async (chatId, message) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: Date.now(),
          };
        }
        return chat;
      }).sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  const updateChatMessages = async (chatId, newMessages) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: newMessages,
            updatedAt: Date.now(),
          };
        }
        return chat;
      }).sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  const setActiveRecipeForChat = async (chatId, recipe) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            activeRecipe: recipe,
            updatedAt: Date.now(),
          };
        }
        return chat;
      }).sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  const renameChat = async (chatId, newTitle) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, title: newTitle, updatedAt: Date.now() };
        }
        return chat;
      }).sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  const deleteChat = async (chatId) => {
    setChats(prevChats => {
      return prevChats.filter(chat => chat.id !== chatId);
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        createChat,
        addMessageToChat,
        updateChatMessages,
        setActiveRecipeForChat,
        renameChat,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

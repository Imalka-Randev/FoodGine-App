import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChatContext = createContext();

const CHAT_STORAGE_KEY = '@foodby_chats';

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const storedChats = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error("Failed to load chats from AsyncStorage", error);
    }
  };

  const updateStateAndStorage = (updaterFn) => {
    return new Promise((resolve) => {
      setChats(prevChats => {
        const newChats = updaterFn(prevChats);
        AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newChats))
          .then(() => resolve(newChats))
          .catch(e => {
             console.error("Failed to save to storage", e);
             resolve(newChats);
          });
        return newChats;
      });
    });
  };

  const createChat = async () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      activeRecipe: null,
      updatedAt: Date.now(),
    };
    
    await updateStateAndStorage(prevChats => {
      return [newChat, ...prevChats];
    });
    
    return newChat;
  };

  const addMessageToChat = async (chatId, message) => {
    await updateStateAndStorage(prevChats => {
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
    await updateStateAndStorage(prevChats => {
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
    await updateStateAndStorage(prevChats => {
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
    await updateStateAndStorage(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, title: newTitle, updatedAt: Date.now() };
        }
        return chat;
      }).sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  const deleteChat = async (chatId) => {
    await updateStateAndStorage(prevChats => {
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

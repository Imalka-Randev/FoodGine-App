# FoodGine 🍳

FoodGine is a modern, AI-powered React Native application designed to help you discover, save, and generate recipes. Built with clean architecture principles, it features seamless offline capabilities and an integrated multimodal culinary AI assistant.

## ✨ Features

- **"Foodby" Multimodal AI Assistant**: A smart culinary assistant powered by Google's Gemini 1.5 API. 
  - **Voice Integration**: Speak to the AI using your microphone (`expo-audio`). The app captures your voice and sends it directly to Gemini for multimodal processing.
  - **Text-to-Speech**: Foodby reads recipes and advice back to you aloud (`expo-speech`), creating a true hands-free kitchen experience.
- **Advanced Offline Capabilities**: 
  - Uses Firebase Cloud Firestore with offline persistence to queue database writes when disconnected.
  - Explicitly caches recipe images locally (via Expo FileSystem) when added to "Favorites" so they render instantly in airplane mode.
  - Graceful degradation: The app automatically detects network state (`expo-network`) and disables cloud-dependent UI elements while keeping offline features accessible.
- **User Authentication**: Secure Login and Signup flows powered by Firebase Auth.
- **Search & Filtering**: Instantly search for global recipes by name and filter by category.
- **My Food & Favorites**: Save AI-generated recipes or global recipes to your private, offline-accessible collection.

## 🏗️ Architecture (Feature-Sliced Design)

The app follows a modern, feature-based modular architecture to ensure scalability, with logic separated into custom React Hooks for clean UI components:

```text
src/
  ├── core/                 # App-wide config (Navigation, Theme, Contexts)
  ├── features/             # Feature-specific modules
  │   ├── FoodbyAI/         # AI UI, Voice Hooks, Chat Hooks
  │   ├── auth/             # Login, Signup, Profile
  │   ├── myRecipes/        # User's saved and created recipes
  │   └── recipes/          # Main Feed, Global recipes
  ├── services/             # External service integrations
  │   ├── ai/               # Gemini API connection
  │   └── firebase/         # Firebase Auth and Firestore configs
  └── shared/               # Reusable UI components
```

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo (SDK 56)
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Backend / Database**: Firebase (Auth, Cloud Firestore)
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **Native Modules**: `expo-audio`, `expo-speech`, `expo-network`, `expo-file-system`
- **Local Storage**: `@react-native-async-storage/async-storage`

## 🚀 Getting Started

### Prerequisites
- Node.js and Expo CLI
- Firebase Project configured for Auth & Firestore
- Google AI Studio API Key (Gemini)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd FoodGine
npm install --legacy-peer-deps
```

### 2. Environment Variables
Create a `.env` file in the root of the project:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the App
```bash
npx expo start -c
```

# FoodGine 🍳

FoodGine is a modern, AI-powered React Native application designed to help you discover, save, and generate recipes. Built with clean architecture principles, it features seamless offline capabilities and an integrated culinary AI assistant.

## ✨ Features

- **User Authentication**: Secure Login and Signup flows powered by Firebase Auth.
- **"Foodby" AI Assistant**: A smart culinary assistant powered by Google's Gemini 1.5 Flash API. It generates highly specific recipes based on your ingredients, mood, or health goals, and provides crucial health/safety warnings (e.g., avoiding dangerous cooking methods).
- **Advanced Offline Capabilities**: 
  - Uses Firebase Cloud Firestore with offline persistence. 
  - Creates and queues new recipes while offline, syncing automatically when the connection returns.
  - Explicitly caches recipe image files locally (via Expo FileSystem) when added to "Favorites" so they render perfectly in airplane mode.
- **Search & Filtering**: Instantly search for global recipes by name and filter them by categories (Beef, Chicken, Vegetarian, etc.).
- **My Food & Favorites**: Save AI-generated recipes or global recipes to your private collection.

## 🏗️ Architecture

The app follows a modern, feature-based modular architecture to ensure scalability and maintainability:

```text
src/
  ├── core/                 # App-wide configuration
  │   ├── navigation/       # React Navigation stack & tabs
  │   ├── theme/            # Styling and colors
  │   └── utils/            # Context API, offline cache utilities
  ├── features/             # Feature-specific modules
  │   ├── assistant/        # Foodby AI chat UI
  │   ├── auth/             # Login, Signup, Profile, AuthContext
  │   ├── myFood/           # User's saved and created recipes
  │   └── recipes/          # Main Feed, Recipe Details, Global recipes
  ├── services/             # External service integrations
  │   ├── ai/               # Gemini API connection and prompts
  │   └── firebase/         # Firebase initialization and Firestore services
  └── shared/               # Reusable UI components
      └── components/       # Buttons, RecipeCards, CategoryItems
```

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Backend / Database**: Firebase (Auth, Cloud Firestore)
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **Local Storage**: `@react-native-async-storage/async-storage`, `expo-file-system`

## 🚀 Getting Started

### Prerequisites

You will need to have Node.js and Expo CLI installed on your machine.
You will also need a Firebase Project and a Google AI Studio API Key.

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd FoodGine
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the project and add your keys:

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
npx expo start
```
Use the Expo Go app on your physical device, or run it on an iOS Simulator/Android Emulator.

## 📄 License
This project is licensed under the MIT License.

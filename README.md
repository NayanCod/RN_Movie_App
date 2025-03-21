# 📱 WatchSpot - React Native Expo App

A movie app built using React Native (Expo), powered by TMDB API and Gemini API.

**download the apk** -> [Downlaod](https://expo.dev/artifacts/eas/aNgCB6PMiVrMBcaVqJkfPM.apk) (don't worry, it's safe)

---

## ✅ Prerequisites

Before starting, make sure you have the following installed:

- **Node.js & npm**  
Download and install from [https://nodejs.org/](https://nodejs.org/)

- **Expo CLI (optional, required for building APK)**  
You can install it globally using:
```bash
npm install -g expo-cli
```

- **Expo Go app on your mobile (Android/iOS)**
**Download from**:
[Playstore](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_IN) 
[Appstore](https://apps.apple.com/us/app/expo-go/id982107779)

---

## 🚀 How to Setup Locally

### 1. Clone the repository
```bash
git clone https://github.com/NayanCod/RN_Movie_App.git
```
```bash
cd RN_Movie_App
```

### 2. Install project dependencies
```bash
npm install
```

### 3. Create a `.env` file in the root directory and paste the following:
```bash
EXPO_PUBLIC_MOVIE_API_KEY=
EXPO_PUBLIC_GEMINI_API_KEY=
```

### Get your API keys from here:
**- TMDB Movie API Key from: https://developer.themoviedb.org/docs/getting-started**


**- Gemini API Key from: https://aistudio.google.com/app/apikey**


### 4. Run the app locally
```bash
npx expo start
```

**Now scan the QR code shown in the terminal using your Expo Go app on mobile (Scan QR option).**


**Your App is now running on your expo go app**


### 📦 How to Build APK

### 1. Install Expo CLI globally (if not installed)
```bash
npm install -g expo-cli
```

### 2. Create an account on expo.dev if you don’t have one:
   **https://expo.dev**

### 3. Login to Expo from terminal
```bash
npx expo login
```

### 4. Initialize EAS build if not done
```bash
eas init
```
**After running above command it will modify your app.json and also created eas.json file**


**if eas.json not created then create it manually and paste the below code inside:**

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 5. Start building the APK
```bash
eas build -p android --profile preview
```

**During build, it will ask for Android application ID:**


***Example: com.yourname.watchspot***

**After successful build, you will get an APK download link in the terminal**


***You can also view and download it from your Expo dashboard: https://expo.dev/accounts***


## 🌎 Adding Environment Variables for Production Build
### 1. Go to your Expo dashboard: https://expo.dev/accounts

### 2. Navigate to your project and open Builds > Environment Variables.

### 3. Add:
EXPO_PUBLIC_MOVIE_API_KEY=<your_tmdb_api_key>
EXPO_PUBLIC_GEMINI_API_KEY=<your_gemini_api_key>

## ✅ That’s it!


**You can now share the APK file with others after the build is complete, and they can install it on their Android devices.**


***🎯 Happy building and coding! 🚀***











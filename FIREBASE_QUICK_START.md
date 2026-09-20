# 🚀 Firebase Quick Start Guide

Your Firebase project is configured! Follow these steps to get started:

## ✅ **Step 1: Create Environment File**

Create a `.env.local` file in your project root:

```bash
# Create the file
touch .env.local
```

Add the following content to `.env.local`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDSYoSIbA96SGhHkIyeSeAn_FFy3BX-UFY
VITE_FIREBASE_AUTH_DOMAIN=nextverse-ae7dd.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nextverse-ae7dd
VITE_FIREBASE_STORAGE_BUCKET=nextverse-ae7dd.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=335967648801
VITE_FIREBASE_APP_ID=1:335967648801:web:097e23431c015aa9bef760
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Emulator (Development)
VITE_FIREBASE_EMULATOR_AUTH_PORT=9099
VITE_FIREBASE_EMULATOR_FIRESTORE_PORT=8080
VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT=5001
VITE_FIREBASE_EMULATOR_STORAGE_PORT=9199
```

## ✅ **Step 2: Install Firebase CLI**

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase use nextverse-ae7dd
```

## ✅ **Step 3: Enable Firebase Services**

Go to [Firebase Console](https://console.firebase.google.com/project/nextverse-ae7dd):

### **Authentication**
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)
4. Enable **Phone** (optional)

### **Firestore Database**
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll update rules later)
4. Select a location (preferably close to your users)

### **Storage**
1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**

## ✅ **Step 4: Start Development**

```bash
# Install dependencies
npm install

# Start Firebase emulators (Terminal 1)
npm run firebase:emulators

# Start development server (Terminal 2)
npm run dev

# Seed initial data (Terminal 3)
npm run seed:all
```

## ✅ **Step 5: Access Firebase Emulator UI**

Open your browser and go to:
- **Firebase Emulator UI**: http://localhost:4000
- **Your App**: http://localhost:3000

## 🔧 **Troubleshooting**

### **If Firebase CLI is not installed:**
```bash
npm install -g firebase-tools
```

### **If you get authentication errors:**
```bash
firebase login
```

### **If emulators don't start:**
```bash
# Stop any running emulators
firebase emulators:stop

# Start emulators again
npm run firebase:emulators
```

### **If data doesn't load:**
1. Check if `.env.local` file exists and has correct values
2. Restart the development server
3. Check browser console for errors

## 📊 **Firebase Console**

Access your Firebase project at:
https://console.firebase.google.com/project/nextverse-ae7dd

## 🎯 **Next Steps**

1. **Test Authentication**: Try signing up/signing in
2. **View Data**: Check Firestore in Firebase Emulator UI
3. **Test Features**: Navigate through the app
4. **Deploy**: When ready, run `npm run firebase:deploy`

## 🆘 **Need Help?**

- Check the browser console for errors
- Verify environment variables are correct
- Ensure Firebase services are enabled
- Check Firebase Console for any issues

Your Firebase project is now ready to use! 🎉


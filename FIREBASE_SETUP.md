# Firebase Setup Guide for NEXTVERSE

This guide will help you set up Firebase with Firestore, Authentication, and API services for the NEXTVERSE application.

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase account and project created

### 2. Firebase Project Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create a project"
   - Enter project name: `nextverse-app`
   - Enable Google Analytics (optional)
   - Create project

2. **Enable Services**
   - **Authentication**: Go to Authentication > Sign-in method
     - Enable Email/Password
     - Enable Google
     - Enable Phone (optional)
   - **Firestore**: Go to Firestore Database > Create database
     - Start in test mode (we'll update rules later)
     - Choose location (preferably close to your users)
   - **Storage**: Go to Storage > Get started
     - Start in test mode
   - **Functions**: Go to Functions > Get started (optional)

3. **Get Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click "Add app" > Web app
   - Register app with name: `nextverse-web`
   - Copy the configuration object

### 3. Environment Configuration

1. **Create `.env.local` file**:
   ```bash
   cp env.example .env.local
   ```

2. **Update Firebase configuration** in `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### 4. Firebase CLI Setup

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize Firebase project**:
   ```bash
   npm run firebase:setup
   ```

3. **Start Firebase emulators** (for development):
   ```bash
   npm run firebase:emulators
   ```

### 5. Seed Initial Data

1. **Seed all data**:
   ```bash
   npm run seed:all
   ```

2. **Or seed specific collections**:
   ```bash
   npm run seed:interests
   npm run seed:courses
   npm run seed:exams
   npm run seed:colleges
   npm run seed:timeline
   npm run seed:scholarships
   npm run seed:jobs
   npm run seed:materials
   ```

## 📊 Firestore Collections

The application uses the following Firestore collections:

### Core Collections

- **`users`** - User profiles and authentication data
- **`educationData`** - User's education level specific data
- **`interests`** - Available interests by education level
- **`courses`** - Available courses by education level
- **`exams`** - Available exams by education level
- **`colleges`** - Available colleges by education level
- **`timeline`** - Timeline events by education level
- **`scholarships`** - Available scholarships by education level
- **`jobs`** - Available jobs by education level
- **`studyMaterials`** - Available study materials by education level

### User-specific Collections

- **`recommendations`** - User's personalized recommendations
- **`savedItems`** - User's saved items (courses, exams, colleges, etc.)

## 🔐 Security Rules

The Firestore security rules are configured in `firestore.rules`:

- **Users**: Can only access their own data
- **Public collections**: Read access for authenticated users, write access for admins
- **User-specific collections**: Users can only access their own data
- **Admin functions**: Only accessible with admin token

## 🛠️ Development Workflow

### 1. Start Development Environment

```bash
# Terminal 1: Start Firebase emulators
npm run firebase:emulators

# Terminal 2: Start development server
npm run dev
```

### 2. Firebase Emulator UI

Access the Firebase Emulator UI at: http://localhost:4000

- **Firestore**: View and edit collections
- **Authentication**: Manage users
- **Storage**: Manage files
- **Functions**: View function logs

### 3. Testing Authentication

1. Go to Authentication tab in Emulator UI
2. Add test users manually
3. Or use the authentication forms in the app

### 4. Testing Firestore

1. Go to Firestore tab in Emulator UI
2. View seeded data
3. Test CRUD operations
4. Verify security rules

## 🚀 Deployment

### 1. Deploy to Firebase

```bash
# Deploy Firestore rules and indexes
npm run firebase:deploy:rules

# Deploy Functions (if using)
npm run firebase:deploy:functions

# Deploy everything
npm run firebase:deploy
```

### 2. Production Configuration

1. **Update security rules** for production
2. **Configure authentication providers**
3. **Set up monitoring and alerts**
4. **Configure backup and recovery**

## 📱 API Usage

### 1. Authentication

```typescript
import { EmailAuth, GoogleAuth, UserProfileService } from '@/services/auth'

// Email/Password authentication
const result = await EmailAuth.signUp(email, password, displayName)
const result = await EmailAuth.signIn(email, password)

// Google authentication
const result = await GoogleAuth.signIn()

// User profile management
const profile = await UserProfileService.getUserProfile(uid)
await UserProfileService.updateUserProfile(uid, data)
```

### 2. Firestore Data

```typescript
import { useInterestsByLevel, useCoursesByLevel } from '@/hooks/useFirestoreData'

// Get interests by education level
const { data: interests, isLoading, error } = useInterestsByLevel('12th')

// Get courses by education level
const { data: courses, isLoading, error } = useCoursesByLevel('UG')
```

### 3. CRUD Operations

```typescript
import { useSaveItem, useRemoveSavedItem } from '@/hooks/useFirestoreData'

// Save an item
const saveItem = useSaveItem()
await saveItem.mutateAsync({
  uid: user.uid,
  type: 'course',
  itemId: 'course-id',
  itemData: courseData
})

// Remove saved item
const removeItem = useRemoveSavedItem()
await removeItem.mutateAsync('item-id')
```

## 🔧 Troubleshooting

### Common Issues

1. **Firebase CLI not found**
   ```bash
   npm install -g firebase-tools
   ```

2. **Authentication not working**
   - Check Firebase configuration in `.env.local`
   - Verify authentication providers are enabled
   - Check browser console for errors

3. **Firestore rules errors**
   - Test rules in Firebase Console > Firestore > Rules
   - Use Firebase Emulator for testing

4. **Data not loading**
   - Check network tab for API errors
   - Verify Firestore security rules
   - Check if data is seeded properly

### Debug Mode

Enable debug mode by setting:
```env
VITE_DEBUG=true
```

This will show detailed logs in the console.

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [React Query with Firebase](https://tanstack.com/query/latest/docs/react/guides/ssr)

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review Firebase Console for errors
3. Check browser console for client-side errors
4. Verify environment variables are correct
5. Ensure Firebase services are enabled

For additional help, refer to the Firebase documentation or create an issue in the project repository.

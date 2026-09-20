# NEXTVERSE Deployment Guide

This guide covers the complete deployment process for the NEXTVERSE application.

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Git repository set up

### 1. Environment Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd nextverse

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local
```

### 2. Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication, Firestore, and Hosting

2. **Get Firebase Config**
   - Go to Project Settings > General
   - Add a web app
   - Copy the config values

3. **Update .env.local**
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Firebase Services Setup

#### Authentication
```bash
# Enable authentication methods
firebase login
firebase use <your-project-id>
```

In Firebase Console:
- Go to Authentication > Sign-in method
- Enable Email/Password
- Enable Google (add OAuth client)
- Enable Phone (for OTP)

#### Firestore Database
```bash
# Deploy security rules
firebase deploy --only firestore:rules
```

#### Storage (Optional)
```bash
# Deploy storage rules
firebase deploy --only storage
```

### 4. Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Lint code
npm run lint

# Build for production
npm run build
```

### 5. Production Deployment

#### Option A: Firebase Hosting (Recommended)
```bash
# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

#### Option B: GitHub Actions (Automated)
1. Set up GitHub repository
2. Add Firebase secrets to GitHub:
   - `FIREBASE_SERVICE_ACCOUNT`
   - `FIREBASE_PROJECT_ID`
   - All environment variables
3. Push to main branch - automatic deployment

### 6. Post-Deployment Setup

#### Seed Data
```bash
# Upload seed data to Firestore
npm run seed:firestore
```

#### Domain Configuration
1. Go to Firebase Hosting
2. Add custom domain
3. Configure SSL certificate
4. Update DNS records

#### Analytics (Optional)
```bash
# Add Google Analytics
npm install @firebase/analytics
```

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics ID | No |
| `VITE_SENTRY_DSN` | Sentry error tracking | No |

### Firebase Security Rules

The application includes comprehensive security rules:

- **Users**: Can only access their own data
- **Public Catalogs**: Read-only for authenticated users
- **Admin Collections**: Protected from client access
- **Storage**: User-specific file access

### PWA Configuration

The app is configured as a Progressive Web App with:
- Service Worker for offline functionality
- App manifest for installation
- Background sync capabilities
- Push notification support

## 📊 Monitoring & Analytics

### Performance Monitoring
- Firebase Performance Monitoring
- Core Web Vitals tracking
- Lighthouse CI integration

### Error Tracking
- Firebase Crashlytics (optional)
- Sentry integration (optional)

### Analytics
- Firebase Analytics
- Google Analytics (optional)
- Custom event tracking

## 🔒 Security Considerations

### Data Protection
- All user data encrypted in transit
- Firestore security rules enforced
- No sensitive data in client code
- GDPR compliant data handling

### Authentication
- Multiple auth providers supported
- Secure token management
- Session timeout configuration
- Offline mode security

## 🚀 Scaling Considerations

### Performance
- CDN for static assets
- Image optimization
- Code splitting
- Lazy loading

### Database
- Firestore indexes configured
- Query optimization
- Caching strategies
- Offline synchronization

### Monitoring
- Real-time performance metrics
- Error rate monitoring
- User engagement tracking
- A/B testing capabilities

## 🛠️ Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor performance metrics
- Review security rules
- Backup user data

### Updates
- Feature flag management
- Gradual rollouts
- Rollback procedures
- User communication

## 📞 Support

For deployment issues:
- Check Firebase Console logs
- Review GitHub Actions logs
- Monitor application performance
- Contact support team

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

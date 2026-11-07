# HubEntertain Mobile (React Native + Expo)

A high-performance mobile application replica of `hub-entertain-web` built using React Native and Expo, optimized to run seamlessly in **Expo Go**.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Expo Go app installed on your Android (Google Play Store) or iOS (App Store) device.
- Ensure your backend (`hub-entertain-backend`) is running.

### 2. Configure API Endpoint
In `.env`, set `EXPO_PUBLIC_API_URL` to your computer's local IP address so your physical mobile device can reach the backend:
```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api
```
*(Example: `http://192.168.1.203:5000/api`)*

### 3. Run the App
Start the Expo development server:
```bash
npm start
```
or
```bash
npx expo start
```
Then:
- Scan the displayed QR code using the **Expo Go** app on Android (or Camera app on iOS).
- The app will load immediately on your mobile device!

---

## 🔒 Security Architecture (Anti-Data Leakage Implementation)

This mobile implementation implements comprehensive security measures to ensure no sensitive credentials or personal data leak from the device:

1. **Hardware-Backed Encrypted Storage (`expo-secure-store`)**:
   - Web browsers use `localStorage` which is unencrypted and vulnerable to extraction.
   - Standard React Native `AsyncStorage` stores data in plaintext SQLite/XML.
   - **HubEntertain Mobile uses `expo-secure-store`** exclusively for authentication tokens. Tokens are encrypted using **iOS Keychain** and **Android Keystore / EncryptedSharedPreferences** with `WHEN_UNLOCKED_THIS_DEVICE_ONLY` accessibility flags, preventing token extraction from device backups or locked screens.

2. **Zero Sensitive Data Logging**:
   - The API layer (`src/lib/api.js`) contains automated sanitizers that redact all `Authorization: Bearer <token>` headers, passwords, and sensitive keys from error reports and console outputs (`[REDACTED]`).
   - Network errors never print raw authorization headers or passwords.

3. **No Hardcoded Secrets**:
   - No backend secrets (`JWT_SECRET`, database URIs, admin credentials) exist anywhere in the mobile codebase.
   - Only public client configurations (`EXPO_PUBLIC_API_URL`) are loaded.

4. **Automatic Session Invalidation**:
   - When the backend returns a `401 Unauthorized` (token expired or revoked), the app immediately invokes `clearSecureToken()`, completely purging credentials from device hardware storage and resetting memory state.

5. **Input and Form Security**:
   - Password fields use `secureTextEntry={true}`, `autoCapitalize="none"`, `autoCorrect={false}`, and `textContentType="password"`.
   - Prevents operating system keyboard caching, auto-suggestions, and clipboard exposure.

---

## 📱 Features & Visual Fidelity to `hub-entertain-web`

- **Home Page**:
  - Hero banner with image, dark overlay gradient, `#1 Trending this week` badge, star rating, meta tags, synopsis, and "Watch Trailer" / "Explore movie" buttons.
  - Horizontal scrollable sections (Popular Movies, Trending TV Shows, Top Music Hits).
  - Responsive cards with poster image (2:3 or 1:1 for music), star rating badge, and floating play action button.
- **Category Page**:
  - Breadcrumb navigation (`Home > Category`).
  - Sort selection (`Top rated`, `Newest`, `A – Z`).
  - Interactive genre chip filter (`All`, `Action`, `Drama`, etc.).
  - 2-column mobile grid layout.
- **Search Screen & Live Search Popup**:
  - Global Search popup modal available anywhere via Navbar.
  - Real-time debounced search results with "Popular right now" fallbacks.
  - Category-grouped search results page.
- **Detail Page**:
  - Trailer player card with trailer duration and play controls.
  - Title, eyebrow tag, meta, and genre pills.
  - Favorite toggle (`♥ Favorited` / `♡ Add to Favorites`) and native Share integration.
  - Synopsis & full credits list (Director, Writers, Starring).
  - Community reviews list with star rating, user initials avatar, and time ago.
  - Interactive review form with 5-star picker and character counter.
  - User review management: Edit and Delete own reviews.
- **Authentication**:
  - Fully styled Login & Register screens with branding, custom input fields, eye password toggle, Remember Me switch, and client validation.


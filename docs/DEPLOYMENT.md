# 🚀 Bugora Production Deployment Checklist

Follow this checklist to ensure a smooth deployment on DigitalOcean App Platform.

## 1. DigitalOcean App Config
- **Source**: GitHub repo `Cyxzhar/bountyprep`
- **Region**: NYC/SGP/AMS (Choose closest to users)
- **Branch**: `main`
- **Plan**: Starter (Free for static sites)

## 2. Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment**: Node.js

## 3. Environment Variables (Critical)
Add these in the DO App dashboard -> Settings -> Components -> (Your App Name) -> Environment Variables:

| Key | Value Source |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase Console -> Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | `bugora-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `bugora-app` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `bugora-app.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Config |
| `VITE_FIREBASE_APP_ID` | From Firebase Config |
| `VITE_PERPLEXITY_API_KEY` | Your AI Tutor Key |

## 4. SPA Routing Fix (DigitalOcean)
To prevent 404s when refreshing on routes like `/home`:
1. In DO App dashboard, go to **Settings**.
2. Select your **Static Site** component.
3. Scroll down to **Catch-all** or **Error Document**.
4. Set the **Custom Error Document** to `/index.html`.
5. This tells DO to serve `index.html` for any route not found, allowing React Router to handle it.

## 5. Domain & SSL
1. Add `bugora.app` in the **Domains** section.
2. Update your DNS (Namecheap/GoDaddy) to point to the DO App URL.
3. SSL will be automatically provisioned by Let's Encrypt through DigitalOcean.

## 6. Firebase Production Security
Go to [Firebase Console](https://console.firebase.google.com/):
1. **Authentication** -> **Settings** -> **Authorized Domains**.
2. Add `bugora.app`
3. Add `www.bugora.app`
4. Add your unique `.ondigitalocean.app` subdomain.

---
**Done?** Once you push your next change to `main`, the app will automatically rebuild and deploy!

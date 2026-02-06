# 🚀 Bugora Production Deployment Checklist

Follow this checklist to ensure a smooth deployment on DigitalOcean App Platform.

## 1. DigitalOcean App Config
- **Source**: GitHub repo `Cyxzhar/bountyprep`
- **Region**: NYC/SGP/AMS (Choose closest to users)
- **Branch**: `main`
- **Plan**: Basic (Requires a "Web Service" component, not just "Static Site")

## 2. Build & Run Settings
- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: `8080`

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

## 4. SPA Routing (Inbuilt)
Because we are using a **Web Service** with `server.js`, you don't need to configure manual catch-alls in DigitalOcean. The Express server is already configured to serve `index.html` for any unknown routes, ensuring React Router works perfectly.

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

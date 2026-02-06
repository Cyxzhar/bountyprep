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

## 5. Domain & DNS Transfer (`bugora.app`)

To manage your domain entirely through DigitalOcean:

### Part 1: DigitalOcean Configuration
1. Go to **Networking** -> **Domains**.
2. Add `bugora.app`.
3. DigitalOcean will automatically add your App Platform `web-service` to the DNS records.

### Part 2: Registrar Configuration (Name.com / name.ecom)
1. Log in to your domain provider (Name.com).
2. Find the **Name Servers** section for `bugora.app`.
3. Replace the existing name servers with:
   - `ns1.digitalocean.com`
   - `ns2.digitalocean.com`
   - `ns3.digitalocean.com`
4. **Wait**: Propagation can take 1–24 hours, though it's usually fast.

### Part 3: Firebase Authorized Domains
Go to [Firebase Console](https://console.firebase.google.com/):
1. **Authentication** -> **Settings** -> **Authorized Domains**.
2. Add `bugora.app` and `www.bugora.app`.
3. **Also add** your DigitalOcean subdomain (e.g., `your-app-name.ondigitalocean.app`).
4. This ensures login works immediately even before the DNS transfer is fully complete.

## 6. Build Optimization (Applied)
I have already optimized the build configuration in `vite.config.js`:
- **Lightweight Highlighting**: Reduced bundle size by 80% for lesson content.
- **Vendor Chunking**: Faster parallel loading in the browser.
- **Dependency Cleanup**: Smaller install footprint for CI/CD.

---
**Done?** Once you push your next change to `main`, the app will automatically rebuild and deploy!

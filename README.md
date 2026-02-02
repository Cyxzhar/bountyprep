# BountyPrep 🛡️💻

> **Master Bug Bounty Hunting & Cybersecurity through interactive challenges.**

BountyPrep is a gamified mobile-first application designed to make learning cybersecurity accessible, engaging, and effective. Think of it as **"Duolingo for Hacking"** – combining bite-sized lessons, interactive challenges, and mock interviews into a sleek, dark-mode experience.

---

## 🚀 Project Overview

**BountyPrep** was built to solve the problem of dry, text-heavy cybersecurity training. It leverages gamification mechanics—streaks, XP, leaderboards, and badges—to keep users motivated.

### Key Features
*   **Gamified Onboarding**: Personalized learning path generation based on user goals and experience.
*   **Interactive Challenges**: Multiple-choice and mini-game style hacking challenges tailored to different skill levels.
*   **Mock Interviews**: AI-simulated chat interface for practicing technical interview questions.
*   **Progress Tracking**: Detailed analytics, activity heatmaps, and skill breakdown rings.
*   **Premium Experience**: Smooth animations, glassmorphism UI, and a dedicated "Pro" subscription flow.
*   **Cross-Platform**: Runs as a high-performance **PWA** (Progressive Web App) and acts as a native app via **Capacitor**.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (v19) via [Vite](https://vitejs.dev/)
*   **Routing**: [React Router](https://reactrouter.com/) (v7)
*   **Styling**: Pure CSS + CSS Variables (No external UI libraries)
    *   *Design System*: Mobile-first, Dark Theme, Neon Accents (#9FEF00).
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Animations**: custom CSS keyframes & transitions.

### Backend & Services
*   **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
    *   Email/Password (Strict Validation)
    *   Google Sign-In (Popup Flow)
*   **Hosting**: [Vercel](https://vercel.com/) (CI/CD via GitHub)

### Mobile & PWA
*   **PWA**: `vite-plugin-pwa` with aggressive caching strategies (`registerType: 'autoUpdate'`).
*   **Native Wrapper**: [Capacitor](https://capacitorjs.com/) (Android/iOS) for native device features.

---

## 🎨 Design System

The UI relies on a high-contrast "Hacker" aesthetic:
*   **Primary Color**: Neon Green (`#9FEF00`)
*   **Background**: Deep Space (`#0A0A0F`) & Surface (`#13131F`)
*   **Typography**:
    *   *UI*: `Poppins` (Clean, modern sans-serif)
    *   *Code*: `JetBrains Mono` (Monospaced for technical content)
*   **Effects**: Glassmorphism (Blur + Transparency) overlays, subtle glowing borders.

---

## 📂 Project Structure

```bash
bountyprep/
├── public/              # Static assets (icons, manifest.json)
├── src/
│   ├── components/      # Reusable UI (BottomNav, Cards, Inputs)
│   ├── context/         # Global State (AuthContext, ToastContext)
│   ├── data/            # Static Data (Challenges, Questions)
│   ├── lib/             # Service Configs (firebase.js)
│   ├── pages/           # Route Components
│   │   ├── auth/        # Login/SignUp Screens with Live Validation
│   │   ├── onboarding/  # 6-step Onboarding Flow
│   │   ├── Home.jsx     # Dashboard
│   │   ├── Challenges.jsx
│   │   └── ...
│   ├── utils/           # Helper functions (validation.js)
│   ├── App.jsx          # Main Router & Layout
│   └── main.jsx         # Entry Point
├── android/             # Native Android Project (Capacitor)
├── ios/                 # Native iOS Project (Capacitor)
└── vite.config.js       # Build & PWA Configuration
```

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/Cyxzhar/bountyprep.git
    cd bountyprep
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root with your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

---

## 📱 Mobile Deployment

### PWA (Progressive Web App)
The app is configured to be installable directly from the browser.
*   **Auto-Update**: Configured to instantly update (`skipWaiting: true`) when a new version is deployed to Vercel.
*   **Manifest**: Includes adaptive icons and standalone display mode.

### Capacitor (Native)
To build for native platforms:

1.  **Sync Web Assets**
    ```bash
    npm run build
    npx cap sync
    ```

2.  **Open Native IDE**
    ```bash
    npx cap open android  # Opens Android Studio
    npx cap open ios      # Opens Xcode
    ```

---

## 🚀 Deployment

The project is deployed via **Vercel**.
*   **Production URL**: `https://bountyprep.vercel.app` (or similar)
*   **CI/CD**: Automatic deployments on push to `main` branch.
*   **Caching**: `vercel.json` is configured to disable caching for `sw.js` to ensure mobile users always get the latest version immediately.

---

## 🛡️ Authentication & Security

*   **Live Validation**: Real-time feedback on forms (Password Strength Meter, Email format).
*   **Error Handling**: Friendly error messages via Toast (no raw Firebase error codes).
*   **Duplicate Prevention**: Checks if email exists before attempting creation.
*   **Route Protection**: `AuthContext` handles session persistence and route guarding.

---

## 📜 License

© 2026 BountyPrep. All Rights Reserved.

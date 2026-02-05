# Bugora - Project Documentation

> **Last Updated:** February 5, 2026
> **Domain:** bugora.app (purchased, not yet deployed)
> **Status:** Active Development (Pre-Launch)
> **Version:** 0.0.0

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What We're Building](#what-were-building)
3. [Current Status](#current-status)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Features Implemented](#features-implemented)
7. [Features In Progress](#features-in-progress)
8. [File Structure](#file-structure)
9. [Development Workflow](#development-workflow)
10. [Design System](#design-system)
11. [Deployment](#deployment)
12. [Known Issues](#known-issues)
13. [Roadmap](#roadmap)

---

## Project Overview

**Bugora** (formerly BountyPrep) is a gamified, mobile-first cybersecurity learning platform designed to make bug bounty hunting and ethical hacking accessible and engaging. Think of it as **"Duolingo for Hacking"** - combining bite-sized lessons, interactive challenges, mock interviews, and gamification mechanics into a sleek, dark-themed experience.

### Key Goals
- Make cybersecurity training accessible and fun
- Mobile-first experience (6.8B smartphone users globally)
- Gamification to maintain user engagement (streaks, XP, achievements)
- Affordable premium tier ($4.99/month vs $10-14/month competitors)
- Bootstrap-friendly ($20/month budget)

### Target Users
- Aspiring bug bounty hunters
- Cybersecurity students
- Self-learners interested in ethical hacking
- Interview prep candidates

---

## What We're Building

### Core Features
1. **Interactive Challenges** - Multiple-choice cybersecurity challenges covering SQL injection, XSS, CSRF, IDOR, etc.
2. **Structured Courses** - Guided learning paths with lessons, code examples, and videos
3. **AI Interview Coach** - Practice technical interviews with AI-powered mock interviewer
4. **Gamification System** - XP, levels, streaks, achievements, and progress tracking
5. **Premium Tier** - Unlock expert challenges and unlimited AI coaching

### Differentiators
- **Mobile-first**: HTB/THM are desktop-only
- **AI Coach**: Real-time interview practice (competitors don't have this)
- **Affordable**: $4.99/month vs $10-14/month
- **PWA + Native**: Works offline, installable, feels like a native app

---

## Current Status

### Development Timeline
- **Started:** Early February 2026
- **Recent Rebrand:** February 3-5, 2026 (BountyPrep → Bugora)
- **Target Launch:** TBD (preparing for free beta)

### What's Built ✅

#### 1. **Authentication System** (100% Complete)
- Firebase Auth integration
- Email/password with live validation
- Google Sign-In (OAuth popup flow)
- Forgot password functionality
- Session persistence
- Protected routes via AuthContext

#### 2. **UI/UX Design** (95% Complete)
- Sleek dark theme with neon lime accents (#9FEF00)
- Mobile-first responsive design
- Glassmorphism effects
- Smooth page transitions
- Custom animations
- Bottom navigation bar
- Professional onboarding flow (6 steps)

#### 3. **Onboarding Flow** (100% Complete)
- Welcome screen
- Goal selection
- Experience level assessment
- Daily commitment setup
- Personalized path analysis
- Paywall presentation

#### 4. **Gamification System** (80% Complete)
- XP calculation and leveling system
- Streak tracking (daily activity)
- Achievement system with 10+ achievements
- Progress visualization
- Activity heatmap
- Confetti animations on achievements

#### 5. **Challenge System** (70% Complete)
- Challenge listing and filtering by difficulty
- Interactive challenge detail pages
- Multiple-choice questions
- Answer submission and validation
- XP rewards
- Progress tracking
- **Content:** 25+ challenges across SQL injection, XSS, CSRF, IDOR, XXE, etc.

#### 6. **Course System** (60% Complete)
- Course catalog
- Course detail pages with lesson lists
- Lesson viewer with markdown support
- Video player integration
- Code syntax highlighting
- Progress tracking per course/lesson
- **Content:** 4 structured courses with 20+ lessons

#### 7. **AI Interview Coach** (50% Complete)
- Chat interface
- Perplexity AI integration
- Message persistence to Firestore
- Quota tracking (10 messages/day for free users)
- Session history
- Timer tracking

#### 8. **Profile & Progress** (75% Complete)
- User profile page with stats
- Activity heatmap (GitHub-style)
- Skill breakdown
- Achievement showcase
- Settings page
- Profile photo upload

#### 9. **Firestore Integration** (85% Complete)
- User profiles
- Challenge progress tracking
- Course/lesson completion tracking
- Achievement unlocking
- Streak updates
- Interview session storage
- Offline persistence with local cache

#### 10. **PWA & Mobile** (90% Complete)
- PWA manifest and service worker
- Installable on mobile devices
- Offline support
- Capacitor setup for Android/iOS
- Optimized for mobile performance

### What's Missing ❌

#### 1. **Monetization** (0% Complete)
- Payment integration (Gumroad/Stripe)
- Premium content locking
- Subscription management
- Waitlist implementation exists but not connected

#### 2. **Content Expansion** (Partial)
- Only 25 challenges (target: 50-100 for launch)
- Only 4 courses (target: 10+ courses)
- Limited AI interview scenarios

#### 3. **Admin Dashboard** (0% Complete)
- No CMS for content management
- Content added manually via JSON files
- Requires code deploy for new content

#### 4. **Social Features** (0% Complete)
- No leaderboards
- No friend system
- No sharing functionality

#### 5. **Analytics & Tracking** (20% Complete)
- Firebase Analytics configured
- No conversion tracking
- No user behavior analytics

#### 6. **Production Deployment** (0% Complete)
- Domain purchased (bugora.app) but not configured
- No production Firebase project
- No Vercel production deployment
- Still using test/dev environment

---

## Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Routing:** React Router DOM 7.13.0
- **Styling:** Pure CSS with CSS variables (no UI libraries)
- **Icons:** Lucide React 0.563.0
- **Markdown:** React Markdown 10.1.0
- **Animations:** Canvas Confetti 1.9.4 + custom CSS

### Backend & Services
- **Authentication:** Firebase Auth
- **Database:** Firestore with offline persistence
- **Storage:** Firebase Storage (profile photos)
- **AI:** Perplexity API (interview coach)
- **Hosting:** Vercel (planned)

### Mobile
- **PWA:** vite-plugin-pwa 1.2.0
- **Native Wrapper:** Capacitor 8.0.2 (Android/iOS ready)

### Development Tools
- **Linting:** ESLint 9.39.1
- **Package Manager:** npm
- **Version Control:** Git + GitHub

### Costs
- Firebase: $0 (free tier, 50K reads/day)
- Vercel: $0 (free tier, 100GB bandwidth)
- Perplexity API: ~$5-10/month (estimated)
- Domain: $12/year (~$1/month)
- **Total: ~$6-11/month** ✅ (well under $20 budget)

---

## Architecture

### Design Philosophy
Following **SCL (Simple, Complete, Lovable)** principles:
- **Simple:** Minimal infrastructure (React + Firebase only)
- **Complete:** Every feature works end-to-end
- **Lovable:** Premium UX despite bootstrap constraints

### Data Models

#### User Profile (`users/{userId}`)
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  xp: number,              // Total XP earned
  level: number,           // Calculated from XP
  streak: number,          // Days active consecutively
  lastActivityDate: Timestamp,
  totalCompleted: number,  // Challenges completed
  totalQuestionsAnswered: number,
  totalCorrectAnswers: number,
  accuracyRate: number,    // Percentage
  achievements: string[],  // Array of achievement IDs
  isPremium: boolean,
  onWaitlist: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Challenge Progress (`users/{userId}/challenges/{challengeId}`)
```javascript
{
  challengeId: string,
  answers: { [questionId]: number },  // User's selected answers
  completed: boolean,
  completedAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Course Progress (`users/{userId}/courses/{courseId}`)
```javascript
{
  courseId: string,
  completedLessons: string[],  // Array of lesson IDs
  lastLessonId: string,
  lastAccessedAt: Timestamp
}
```

#### Interview Sessions (`users/{userId}/interview_sessions/{sessionId}`)
```javascript
{
  id: string,
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
  elapsedTime: number,  // Seconds
  topic: string,        // Auto-generated from first message
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Security Rules
- Users can only read/write their own data
- Challenges collection is read-only for clients
- Admin writes via Firestore console or seed scripts

---

## Features Implemented

### 1. Authentication (`src/context/AuthContext.jsx`)
- Email/password signup with live validation
- Google OAuth sign-in
- Password strength meter
- Email format validation
- Duplicate email checking
- Session persistence
- Auto-redirect based on auth state

### 2. Gamification (`src/utils/gamification.js`, `src/utils/xp.js`)
- **XP System:**
  - Easy challenge: 50 XP
  - Medium: 100 XP
  - Hard: 150 XP
  - Expert: 200 XP
  - Leveling formula: `1000 * level^1.5`

- **Streak System:**
  - Increments daily on first activity
  - Breaks if user misses a day
  - Stored in user profile

- **Achievements:**
  - First Blood (complete 1 challenge)
  - 7-day streak
  - 30-day streak
  - 10 challenges completed
  - 50 challenges completed
  - SQL Master (5 SQLi challenges)
  - XSS Hunter (5 XSS challenges)
  - And more...

### 3. Challenges (`src/pages/Challenges.jsx`, `src/pages/ChallengeDetail.jsx`)
- Browse challenges by difficulty
- Visual indicators (difficulty badges, XP rewards)
- Multiple-choice questions with code snippets
- Immediate feedback on answers
- Detailed explanations
- XP awarded on correct answers
- Progress saved to Firestore
- **Content:** 25+ challenges covering:
  - SQL Injection
  - XSS (Reflected, Stored, DOM-based)
  - CSRF
  - IDOR
  - XXE
  - SSRF
  - Authentication bypasses

### 4. Courses (`src/pages/Courses.jsx`, `src/pages/CourseDetail.jsx`, `src/pages/Lesson.jsx`)
- Course catalog with progress indicators
- Lesson-by-lesson navigation
- Markdown content rendering
- Code syntax highlighting
- Video player support (YouTube embeds)
- Progress tracking
- XP rewards on lesson completion
- **Content:** 4 courses:
  1. Web Security Fundamentals
  2. Advanced Exploitation
  3. Mobile Security
  4. API Testing

### 5. Interview Coach (`src/pages/Interview.jsx`)
- AI-powered mock interview
- Perplexity API integration
- Real-time chat interface
- Session persistence
- Timer tracking
- Message history
- Quota system (10 msgs/day free)
- Multiple session support

### 6. Profile & Progress (`src/pages/Profile.jsx`, `src/pages/Progress.jsx`)
- Profile stats dashboard
- Activity heatmap (365-day view)
- Skill breakdown by category
- Achievement showcase
- Editable profile info
- Photo upload
- Settings management

### 7. Design System (`src/index.css`)
- **Colors:**
  - Primary: `#9FEF00` (Lime Green)
  - Background: `#0A0A0F` (Deep Space)
  - Surface: `#13131F`
  - Text: `#E5E5E5`, `#A0A0A0`
- **Typography:**
  - UI: Poppins (sans-serif)
  - Code: JetBrains Mono (monospace)
- **Effects:**
  - Glassmorphism (blur + transparency)
  - Subtle glow on interactive elements
  - Smooth transitions (200ms)
  - Hover states with scale transforms

---

## Features In Progress

### 1. Payment Integration
- **Options:** Gumroad (10 min setup) or Stripe (2 days setup)
- **Current Plan:** Start with Gumroad, switch to Stripe at $500 MRR
- **Implementation:** Manual premium activation for first 10 customers

### 2. Content Expansion
- **Challenges:** Need 25+ more challenges for launch
- **Courses:** Need 6+ more courses
- **AI Interview:** Need more scenario variety

### 3. Production Deployment
- Set up production Firebase project
- Configure custom domain (bugora.app)
- Deploy to Vercel production
- Set up Firebase Analytics
- Configure SEO metadata

---

## File Structure

```
bountyprep/
├── .claude/
│   ├── settings.local.json
│   └── CLAUDE.MD (this file)
├── public/
│   ├── icon.png
│   ├── logo.png
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx          # Mobile bottom navigation
│   │   ├── ToastContainer.jsx     # Toast notifications
│   │   ├── AchievementCard.jsx    # Achievement display
│   │   ├── AchievementUnlock.jsx  # Achievement popup
│   │   ├── PageTransition.jsx     # Route transitions
│   │   └── OnboardingProgress.jsx # Onboarding step indicator
│   ├── context/
│   │   ├── AuthContext.jsx        # Firebase Auth provider
│   │   ├── ToastContext.jsx       # Toast notification system
│   │   ├── AchievementContext.jsx # Achievement unlock system
│   │   ├── AnimationContext.jsx   # Animation preferences
│   │   └── SoundContext.jsx       # Sound effect system
│   ├── data/
│   │   ├── challenges.js          # 25+ challenge definitions
│   │   ├── courses.js             # 4 course definitions
│   │   └── achievements.js        # Achievement definitions
│   ├── hooks/
│   │   └── useTimer.js            # Timer hook for interview
│   ├── lib/
│   │   ├── firebase.js            # Firebase config
│   │   └── perplexity.js          # Perplexity AI client
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── Auth.css
│   │   ├── onboarding/
│   │   │   ├── Welcome.jsx
│   │   │   ├── GoalSelection.jsx
│   │   │   ├── ExperienceLevel.jsx
│   │   │   ├── DailyCommitment.jsx
│   │   │   ├── Analysis.jsx
│   │   │   ├── Paywall.jsx
│   │   │   ├── Onboarding.css
│   │   │   └── Paywall.css
│   │   ├── Splash.jsx             # App splash screen
│   │   ├── Home.jsx               # Main dashboard
│   │   ├── Challenges.jsx         # Challenge list
│   │   ├── ChallengeDetail.jsx    # Challenge detail
│   │   ├── Courses.jsx            # Course catalog
│   │   ├── CourseDetail.jsx       # Course detail
│   │   ├── Lesson.jsx             # Lesson viewer
│   │   ├── Interview.jsx          # AI interview coach
│   │   ├── Progress.jsx           # Progress dashboard
│   │   ├── Profile.jsx            # User profile
│   │   ├── Upgrade.jsx            # Upgrade/waitlist page
│   │   └── Settings.jsx           # App settings
│   ├── scripts/
│   │   └── seedChallenges.js      # Firestore data seeding
│   ├── utils/
│   │   ├── validation.js          # Form validation
│   │   ├── xp.js                  # XP calculation
│   │   ├── gamification.js        # Streak & achievements
│   │   ├── firestore.js           # Firestore helpers
│   │   ├── interviewQuota.js      # AI quota management
│   │   ├── imageCompression.js    # Photo upload helper
│   │   └── settings.js            # Settings management
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── android/                       # Capacitor Android project
├── ios/                            # Capacitor iOS project
├── .env                            # Environment variables (Firebase config)
├── .env.example                    # Example env file
├── .gitignore
├── capacitor.config.ts             # Capacitor configuration
├── firebase.json                   # Firebase hosting config
├── firestore.rules                 # Firestore security rules
├── firestore.indexes.json          # Firestore indexes
├── package.json
├── vite.config.js                  # Vite build config
├── index.html                      # HTML entry point
├── README.md                       # Project README
├── PROJECT_ANALYSIS.md             # Detailed project analysis
├── QUICK_START_GUIDE.md           # Quick start guide
└── STRATEGIC_ROADMAP.md           # Strategic roadmap
```

### Key File Descriptions

#### `/src/utils/firestore.js` (435 lines)
Core Firestore operations:
- `saveChallengeProgress()` - Save challenge answers
- `getChallengeProgress()` - Load challenge progress
- `updateUserStats()` - Update XP and stats
- `markChallengeCompleted()` - Mark challenge complete
- `updateStreak()` - Update daily streak
- `saveLessonProgress()` - Save lesson completion
- `getCourseProgress()` - Load course progress
- `saveInterviewSession()` - Save interview chat
- `refreshUserProfile()` - Reload user data
- `addToWaitlist()` - Add user to premium waitlist

#### `/src/utils/gamification.js` (92 lines)
Gamification logic:
- `calculateStreak()` - Determine new streak value
- `checkNewAchievements()` - Check achievement conditions
- `calculateNewStats()` - Update accuracy and stats

#### `/src/context/AuthContext.jsx`
Firebase Auth wrapper:
- User state management
- Sign up / sign in / sign out
- User profile creation in Firestore
- Session persistence
- Protected route logic

#### `/src/data/challenges.js` (987 lines)
Challenge content database:
- 25+ challenge objects
- Each with: title, description, difficulty, type, XP reward, questions
- Questions include: question text, code snippet, options, correct answer, explanation

#### `/src/data/courses.js` (305 lines)
Course content database:
- 4 course definitions
- Each with: title, description, lessons array
- Lessons include: title, content (markdown), code examples, XP reward

---

## Development Workflow

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add Firebase credentials

3. **Run dev server:**
   ```bash
   npm run dev
   ```
   - Accessible at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

### Mobile Development

1. **Sync Capacitor:**
   ```bash
   npm run build
   npx cap sync
   ```

2. **Open in native IDE:**
   ```bash
   npx cap open android  # Android Studio
   npx cap open ios      # Xcode (macOS only)
   ```

### Firestore Operations

1. **Deploy security rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Seed challenges to Firestore:**
   ```bash
   node src/scripts/seedChallenges.js
   ```

3. **Access Firestore console:**
   - https://console.firebase.google.com/

### Git Workflow

Recent commits show active development:
- Rebrand to Bugora (Feb 3-5)
- UI/UX overhaul
- Lesson system implementation
- Bug fixes and styling improvements

---

## Design System

### Color Palette
```css
--primary: #9FEF00;           /* Lime Green */
--primary-dark: #7BC700;
--background: #0A0A0F;         /* Deep Space */
--surface: #13131F;
--surface-hover: #1A1A2E;
--text-primary: #E5E5E5;
--text-secondary: #A0A0A0;
--border: rgba(159, 239, 0, 0.2);
--success: #00D9A3;
--error: #FF4757;
--warning: #FFA502;
```

### Typography
- **Headings:** Poppins, Bold, 24-32px
- **Body:** Poppins, Regular, 14-16px
- **Code:** JetBrains Mono, 14px
- **Small:** Poppins, Regular, 12px

### Spacing Scale
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 24px

### Shadows
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3);
--glow: 0 0 20px rgba(159, 239, 0, 0.3);
```

---

## Deployment

### Current Status
- **Development only** - Not yet deployed to production
- Domain purchased: **bugora.app** (not configured)
- Using Firebase dev project
- Testing on `localhost:5173`

### Deployment Plan

#### 1. Firebase Production Setup
- Create production Firebase project
- Update `.env` with production credentials
- Deploy Firestore rules
- Seed production data

#### 2. Vercel Deployment
- Connect GitHub repo to Vercel
- Set environment variables
- Enable auto-deploy on push to `main`
- Configure custom domain (bugora.app)

#### 3. Domain Configuration
- Point DNS to Vercel
- Enable SSL/HTTPS
- Configure redirects (www → apex)

#### 4. PWA Deployment
- Verify service worker registration
- Test offline functionality
- Test installation on iOS/Android
- Verify caching strategies

---

## Known Issues

### Critical
1. **No payment system** - Cannot monetize yet
2. **Manual content deployment** - No CMS, requires code deploy
3. **Not production deployed** - Still in development environment

### Medium Priority
1. **Limited content** - Need 2-3x more challenges and courses
2. **AI quota enforcement** - Need backend validation (currently client-side)
3. **No leaderboards** - Social features missing
4. **No email notifications** - Streak reminders not implemented

### Low Priority
1. **Profile customization limited** - Can't change username after signup
2. **No dark/light mode toggle** - Only dark mode
3. **No search functionality** - Can't search challenges or courses
4. **No bookmarks** - Can't save challenges for later

### Technical Debt
1. **Client-side answer validation** - Answers stored in JavaScript (users can cheat)
2. **No server-side XP validation** - XP calculation happens client-side
3. **Manual premium activation** - No webhook automation
4. **Hardcoded content** - Challenges/courses in JavaScript files, not Firestore

---

## Roadmap

### Phase 1: Pre-Launch (Current)
- [x] Rebrand to Bugora
- [x] Core UI/UX polish
- [x] Authentication system
- [x] Gamification system
- [x] Challenge system
- [x] Course system
- [x] AI interview coach
- [ ] Payment integration (Gumroad)
- [ ] Content expansion (50+ challenges, 10+ courses)
- [ ] Production deployment

### Phase 2: Launch (Week 1)
- [ ] Soft launch to friends/beta users
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Launch on Product Hunt
- [ ] Social media marketing
- **Success Metric:** 100 signups, 1 paying subscriber

### Phase 3: Growth (Month 1-3)
- [ ] Add 100+ challenges
- [ ] Add 20+ courses
- [ ] Implement leaderboards
- [ ] Email notifications
- [ ] Referral system
- [ ] Mobile app store releases (iOS/Android)
- **Success Metric:** 1,000 users, 50 paid subscribers ($225 MRR)

### Phase 4: Scale (Month 3-6)
- [ ] Build admin dashboard
- [ ] Server-side validation
- [ ] Advanced analytics
- [ ] Team features
- [ ] API access for developers
- [ ] Migrate to Stripe (if MRR > $500)
- **Success Metric:** 5,000 users, 300 subscribers ($1,350 MRR)

---

## Key Constraints & Trade-offs

### Bootstrap Budget ($20/month)
- **Accepted:** Client-side validation (users can cheat)
- **Accepted:** Manual premium activation (2-6 hour delay)
- **Accepted:** No admin dashboard (edit JSON files)
- **Accepted:** Limited AI coach (10 msgs/day free)
- **Accepted:** Gumroad fees (10% vs Stripe 2.9%)

### Solo Developer
- **Strength:** Fast execution, no coordination overhead
- **Challenge:** Content creation bottleneck
- **Strategy:** Use AI to assist content creation

### Mobile-First
- **Strength:** Underserved market (competitors are desktop-only)
- **Challenge:** Touch-friendly UI requires more design work
- **Strategy:** PWA + Capacitor for native feel

---

## Development Notes

### Git Status (Feb 5, 2026)
```
Modified:
- firestore.rules (security rules updates)
- src/pages/Profile.css (styling improvements)
- src/pages/Upgrade.jsx (waitlist functionality)
- src/pages/onboarding/Paywall.jsx (payment UI)
- src/utils/firestore.js (Firestore helpers)
```

### Recent Changes
- Rebranded from BountyPrep to Bugora
- Updated all assets (logo, icons, manifest)
- UI overhaul with modern cyber aesthetics
- Fixed lesson completion flow
- Improved challenge detail UI
- Enhanced gamification feedback

### Next Priorities
1. **Payment Integration** - Connect Gumroad/Stripe
2. **Content Creation** - Write 25+ more challenges
3. **Production Deploy** - Set up Vercel + custom domain
4. **Testing** - End-to-end user flow testing
5. **Marketing Prep** - Landing page, demo video, social media

---

## Contributing

Currently a **solo project** by Binod Acharya. Not accepting external contributions at this time.

---

## License

© 2026 Bugora. All Rights Reserved.

---

## Contact

- **Developer:** Binod Acharya
- **Domain:** bugora.app
- **Status:** Active Development

---

**Last Updated:** February 5, 2026
**Document Version:** 1.0.0
**Project Version:** 0.0.0 (Pre-Launch)

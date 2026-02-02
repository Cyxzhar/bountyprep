# BountyPrep Quick Start Guide (SCL Edition)
## Copy-Paste Your Way to Launch in 7 Days

**For:** Binod Acharya (Solo Developer)
**Goal:** Ship MVP by Sunday with minimal complexity
**Rule:** If you can copy-paste it, do it. If you can't, skip it for now.

---

## Pre-Flight Checklist (30 Minutes)

### 1. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore
firebase init firestore
# Select: Use an existing project → Choose your project
# Firestore rules: firestore.rules
# Firestore indexes: firestore.indexes.json
```

### 2. Environment Variables
Create `.env` file:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=sk-...  # Day 5 only
```

### 3. Install Dependencies
```bash
npm install firebase  # Already installed, just verify
```

---

## Day 1: Firestore Integration (8 Hours)

### Step 1: Security Rules (Copy-Paste to `firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);

      // User challenges subcollection
      match /challenges/{challengeId} {
        allow read, write: if isOwner(userId);
      }

      // User achievements subcollection
      match /achievements/{achievementId} {
        allow read: if isOwner(userId);
        allow write: if false;  // Client can't award achievements yet
      }

      // User quota subcollection (AI message limits)
      match /quota/{date} {
        allow read, write: if isOwner(userId);
      }
    }

    // Challenges collection (read-only for clients)
    match /challenges/{challengeId} {
      allow read: if isAuthenticated();
      allow write: if false;  // Admin only (via Firestore console)
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Step 2: Update AuthContext (Create User Profile on Signup)

**File:** `src/context/AuthContext.jsx`

Add these imports at the top:
```javascript
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
```

Replace the `signup` function:
```javascript
const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Firestore user profile
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,

      // Profile
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      title: 'Beginner',

      // Gamification
      streak: 0,
      lastActivityDate: null,

      // Stats
      totalCompleted: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      accuracyRate: 0,

      // Subscription
      isPremium: false,
      subscriptionType: null,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return userCredential;
  } catch (error) {
    throw error;
  }
};
```

Update `useEffect` to load user profile from Firestore:
```javascript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Load user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        setCurrentUser({ ...user, ...userDoc.data() });
      } else {
        setCurrentUser(user);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  });

  return unsubscribe;
}, []);
```

### Step 3: Seed Challenges to Firestore

**File:** `src/scripts/seedChallenges.js` (create this file)

```javascript
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { challenges } from '../data/challenges.js';

async function seedChallenges() {
  console.log('🌱 Seeding challenges to Firestore...');

  for (const challenge of challenges) {
    try {
      await setDoc(doc(db, 'challenges', challenge.id.toString()), {
        id: challenge.id.toString(),
        title: challenge.title,
        description: challenge.description,
        type: challenge.type,
        difficulty: challenge.difficulty,
        xpReward: challenge.xpReward,
        isPremium: challenge.isPremium || false,
        estimatedTimeMinutes: challenge.estimatedTime || 10,
        questions: challenge.questions,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ ${challenge.title}`);
    } catch (error) {
      console.error(`❌ Error seeding ${challenge.id}:`, error);
    }
  }

  console.log('✨ Done!');
  process.exit(0);
}

seedChallenges();
```

Run seed script:
```bash
node src/scripts/seedChallenges.js
```

**Test:** Open Firebase Console → Firestore Database → Should see 8 challenges

---

## Day 2: Challenge Progress Persistence (8 Hours)

### Step 1: Create XP Utility

**File:** `src/utils/xp.js` (create this file)

```javascript
export function calculateLevel(xp) {
  let level = 1;
  let xpRequired = 1000;

  while (xp >= xpRequired) {
    level++;
    xpRequired = Math.floor(1000 * Math.pow(level, 1.5));
  }

  return {
    level,
    xpToNextLevel: xpRequired - xp,
  };
}

export function awardXP(currentXP, xpToAdd) {
  const oldLevel = calculateLevel(currentXP).level;
  const newXP = currentXP + xpToAdd;
  const { level, xpToNextLevel } = calculateLevel(newXP);

  return {
    xp: newXP,
    level,
    xpToNextLevel,
    leveledUp: level > oldLevel,
  };
}

export function getTitleForLevel(level) {
  if (level >= 30) return 'Elite Hacker';
  if (level >= 20) return 'Vulnerability Hunter';
  if (level >= 15) return 'Exploit Developer';
  if (level >= 10) return 'Security Analyst';
  if (level >= 5) return 'Script Kiddie';
  return 'Beginner';
}
```

### Step 2: Update ChallengeDetail to Save Progress

**File:** `src/pages/ChallengeDetail.jsx`

Add imports:
```javascript
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { awardXP, getTitleForLevel } from '../utils/xp';
```

Replace component state and logic:
```javascript
function ChallengeDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load challenge and user progress
  useEffect(() => {
    loadData();
  }, [id, currentUser]);

  const loadData = async () => {
    try {
      // Load challenge from Firestore
      const challengeDoc = await getDoc(doc(db, 'challenges', id));
      if (!challengeDoc.exists()) {
        console.error('Challenge not found');
        return;
      }
      setChallenge({ id: challengeDoc.id, ...challengeDoc.data() });

      // Load user progress
      if (currentUser) {
        const progressDoc = await getDoc(
          doc(db, 'users', currentUser.uid, 'challenges', id)
        );

        if (progressDoc.exists()) {
          setUserProgress(progressDoc.data());
        } else {
          // Initialize progress
          const initialProgress = {
            challengeId: id,
            status: 'in_progress',
            currentQuestionIndex: 0,
            answers: {},
            correctAnswers: 0,
            totalQuestions: challengeDoc.data().questions.length,
            score: 0,
            attempts: 1,
            startedAt: serverTimestamp(),
            lastActivityAt: serverTimestamp(),
          };

          await setDoc(
            doc(db, 'users', currentUser.uid, 'challenges', id),
            initialProgress
          );

          setUserProgress(initialProgress);
        }
      }
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async (questionIndex, selectedOption) => {
    if (!currentUser) return;

    try {
      const isCorrect = selectedOption === challenge.questions[questionIndex].correctAnswer;

      // Update progress
      const updatedAnswers = {
        ...userProgress.answers,
        [`q${questionIndex}`]: selectedOption,
      };

      await updateDoc(
        doc(db, 'users', currentUser.uid, 'challenges', id),
        {
          answers: updatedAnswers,
          correctAnswers: isCorrect ? increment(1) : userProgress.correctAnswers,
          currentQuestionIndex: questionIndex + 1,
          lastActivityAt: serverTimestamp(),
        }
      );

      setUserProgress({
        ...userProgress,
        answers: updatedAnswers,
        correctAnswers: isCorrect ? userProgress.correctAnswers + 1 : userProgress.correctAnswers,
        currentQuestionIndex: questionIndex + 1,
      });

      // Show feedback
      if (isCorrect) {
        toast.success('Correct! 🎉');
      } else {
        toast.error('Incorrect. Try again!');
      }

    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  // Complete challenge and award XP
  const handleChallengeComplete = async () => {
    if (!currentUser) return;

    try {
      const score = Math.round(
        (userProgress.correctAnswers / userProgress.totalQuestions) * 100
      );

      // Mark challenge complete
      await updateDoc(
        doc(db, 'users', currentUser.uid, 'challenges', id),
        {
          status: 'completed',
          score,
          completedAt: serverTimestamp(),
        }
      );

      // Award XP
      const userData = await getDoc(doc(db, 'users', currentUser.uid));
      const { xp: currentXP, level: currentLevel } = userData.data();

      const { xp, level, xpToNextLevel, leveledUp } = awardXP(
        currentXP,
        challenge.xpReward
      );

      await updateDoc(doc(db, 'users', currentUser.uid), {
        xp,
        level,
        xpToNextLevel,
        title: getTitleForLevel(level),
        totalCompleted: increment(1),
        updatedAt: serverTimestamp(),
      });

      if (leveledUp) {
        toast.success(`Level up! You're now level ${level} 🎉`);
      } else {
        toast.success(`+${challenge.xpReward} XP earned! 🎉`);
      }

      navigate('/challenges');

    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  // Rest of component...
}
```

**Test:** Complete a challenge → Check Firestore → Progress should be saved

---

## Day 3: Content Creation (10 Hours)

### AI-Assisted Challenge Creation

**Prompt for ChatGPT/Claude:**
```
Create a cybersecurity challenge for bug bounty training:

Topic: [SQL Injection / XSS / CSRF / IDOR / etc.]
Difficulty: [easy / medium / hard]
Scenario: [Brief description of vulnerable application]

Include:
- Realistic scenario (2-3 sentences)
- Code snippet showing vulnerability
- 2-3 multiple choice questions
- Correct answer explanation (educational)
- Hint (without giving away answer)

Format as JSON matching this structure:
{
  "id": "unique-id",
  "title": "Challenge Title",
  "description": "Brief description",
  "type": "SQL Injection",
  "difficulty": "medium",
  "xpReward": 100,
  "isPremium": false,
  "estimatedTime": 10,
  "questions": [
    {
      "scenario": "...",
      "codeBlock": "...",
      "codeLanguage": "php",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1,
      "explanation": "...",
      "hint": "..."
    }
  ]
}
```

**Workflow:**
1. Generate 5 challenges with AI
2. Review for technical accuracy
3. Add to `src/data/challenges.js`
4. Test each challenge manually
5. Run `node src/scripts/seedChallenges.js`
6. Repeat until you have 30+ challenges

**Target:** 25 new challenges (35 total)

---

## Day 4: Streaks & Achievements (6 Hours)

### Step 1: Streak Utility

**File:** `src/utils/streak.js` (create this file)

```javascript
export function updateStreak(lastActivityDate, currentStreak) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (!lastActivityDate) return 1; // First time

  const lastActivity = lastActivityDate.toDate();
  const lastDate = new Date(
    lastActivity.getFullYear(),
    lastActivity.getMonth(),
    lastActivity.getDate()
  );

  if (lastDate.getTime() === yesterday.getTime()) {
    return currentStreak + 1; // Consecutive day
  } else if (lastDate.getTime() === today.getTime()) {
    return currentStreak; // Already counted today
  } else {
    return 1; // Streak broken
  }
}
```

### Step 2: Update Challenge Completion to Update Streak

In `ChallengeDetail.jsx`, update the `handleChallengeComplete` function:

```javascript
import { updateStreak } from '../utils/streak';

// Inside handleChallengeComplete, after awarding XP:
const newStreak = updateStreak(userData.data().lastActivityDate, userData.data().streak);

await updateDoc(doc(db, 'users', currentUser.uid), {
  streak: newStreak,
  lastActivityDate: serverTimestamp(),
  // ... other fields
});
```

**Test:** Complete challenge today → streak = 1. Complete tomorrow → streak = 2. Skip a day → resets to 1.

---

## Day 5: AI Interview Coach (8 Hours)

### Step 1: OpenAI Integration

**File:** `src/lib/openai.js` (create this file)

```javascript
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function sendChatMessage(messages, userId) {
  // Check quota
  const today = new Date().toISOString().split('T')[0];
  const quotaDoc = await getDoc(doc(db, `users/${userId}/quota/${today}`));
  const usedToday = quotaDoc.exists() ? quotaDoc.data().messagesUsed : 0;

  const userDoc = await getDoc(doc(db, 'users', userId));
  const isPremium = userDoc.data().isPremium || false;

  // Free: 10 messages/day, Premium: unlimited
  if (!isPremium && usedToday >= 10) {
    throw new Error('Daily limit reached. Upgrade to Premium for unlimited coaching.');
  }

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a cybersecurity interviewer. Ask technical questions about bug bounties, web vulnerabilities, and ethical hacking. Keep responses under 150 words.'
        },
        ...messages
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  const data = await response.json();

  // Update quota
  await setDoc(doc(db, `users/${userId}/quota/${today}`), {
    messagesUsed: usedToday + 1,
    date: today
  }, { merge: true });

  return data.choices[0].message.content;
}
```

### Step 2: Wire Up Interview Page

**File:** `src/pages/Interview.jsx`

Replace mock responses with real API calls:

```javascript
import { sendChatMessage } from '../lib/openai';

// Inside Interview component:
const handleSendMessage = async () => {
  if (!input.trim() || !currentUser) return;

  const userMessage = input.trim();
  setInput('');

  // Add user message to UI
  setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
  setIsLoading(true);

  try {
    // Call OpenAI API
    const aiResponse = await sendChatMessage(
      [...messages, { role: 'user', content: userMessage }],
      currentUser.uid
    );

    // Add AI response to UI
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Test:** Ask "What is SQL injection?" → Should get real AI response

---

## Day 6: Monetization (4 Hours)

### Step 1: Create Gumroad Product

1. Go to [gumroad.com](https://gumroad.com) → Sign up
2. Create Product → "BountyPrep Premium"
3. Pricing: $4.99/month (recurring)
4. Description: "Unlimited AI coaching + expert challenges"
5. Get permalink: `https://binodacharya.gumroad.com/l/bountyprep-premium`

### Step 2: Update Paywall Page

**File:** `src/pages/onboarding/Paywall.jsx`

Replace button with Gumroad link:

```javascript
<a
  href="https://binodacharya.gumroad.com/l/bountyprep-premium"
  className="gumroad-button btn-primary"
  data-gumroad-overlay-checkout="true"
>
  Subscribe for $4.99/month 🚀
</a>
```

Add Gumroad script to `index.html` (before closing `</body>`):
```html
<script src="https://gumroad.com/js/gumroad.js"></script>
```

### Step 3: Lock Premium Challenges

**File:** `src/pages/Challenges.jsx`

Add premium check to challenge cards:

```javascript
const ChallengeCard = ({ challenge }) => {
  const { currentUser } = useAuth();

  if (challenge.isPremium && !currentUser?.isPremium) {
    return (
      <div className="card card-locked">
        <Lock className="lock-icon" />
        <h3>{challenge.title}</h3>
        <p className="premium-badge">Premium Only</p>
        <Link to="/paywall" className="btn-ghost">
          Upgrade to Access
        </Link>
      </div>
    );
  }

  // Regular card...
};
```

### Step 4: Manual Premium Activation

When Gumroad emails you "New sale from john@example.com":

1. Open Firebase Console → Firestore → users collection
2. Find user by email
3. Edit document → Set `isPremium: true`
4. Email customer: "Your premium is activated! 🎉"

**Test:** Set your account to `isPremium: true` → Expert challenges unlock

---

## Day 7: Polish & Launch (8 Hours)

### Morning: Bug Fixes

```bash
# Test entire flow
# 1. Sign up with new email
# 2. Complete onboarding
# 3. Complete 1 challenge
# 4. Check progress persists (refresh page)
# 5. Click premium button (Gumroad loads)
# 6. Ask AI coach 10 questions (hit limit)
```

Fix any crashes, add loading states, test on mobile.

### Afternoon: Deploy

```bash
# Deploy to Vercel
git add .
git commit -m "Launch MVP v1.0"
git push origin main

# Vercel auto-deploys via GitHub integration
# Check: https://bountyprep.vercel.app
```

Set up custom domain (optional):
- Buy domain on Namecheap: bountyprep.com ($12/year)
- Add to Vercel: Settings → Domains → Add bountyprep.com
- Update DNS records (Vercel shows instructions)

### Evening: Launch Posts

**Twitter/X:**
```
I built BountyPrep in 7 days – a mobile-first bug bounty training app.

🎯 5-minute challenges
🤖 AI interview coach
📱 Works offline
💰 $4.99/month (vs $14 for competitors)

Try it free: [link]

#cybersecurity #bugbounty #buildinpublic
```

**Reddit (r/bugbounty):**
```
Title: I built a mobile-first alternative to HackTheBox/TryHackMe

Body:
Hey r/bugbounty! I just launched BountyPrep - a mobile app for learning bug bounty hunting.

Why I built it:
- HTB/THM are desktop-only (can't learn on the go)
- Expensive ($10-14/month)
- Steep learning curve

BountyPrep is different:
- Mobile-first PWA (works offline)
- 5-minute bite-sized challenges
- AI interview coach
- $4.99/month (or free tier with 3 challenges/day)

Built in 7 days solo. Would love your feedback!

[link]
```

**Product Hunt (Schedule for Tuesday 12:01am PST):**
- Title: "BountyPrep - Duolingo for Bug Bounty Hunting"
- Tagline: "Learn ethical hacking in 5-minute mobile sessions"
- Description: [Use Reddit post as base]
- Add screenshots + demo video

---

## Success Metrics (Week 1)

- [ ] 100 signups (validation)
- [ ] 20 Daily Active Users
- [ ] 1 paying subscriber ($4.99 = first revenue)
- [ ] 10+ positive feedback messages
- [ ] No critical bugs

---

## Emergency Contacts (If Stuck)

**Firebase Issues:**
- Check Firebase Console → Firestore → Rules tab
- Verify security rules deployed
- Check browser console for permission errors

**OpenAI API Errors:**
- Verify `VITE_OPENAI_API_KEY` in `.env`
- Check OpenAI usage limits: platform.openai.com/usage
- Free tier gives $5 credits (enough for ~1,000 messages)

**Deployment Issues:**
- Check Vercel build logs: vercel.com/dashboard
- Verify `.env` variables set in Vercel dashboard
- Rebuild: `vercel --prod`

---

## Post-Launch (Week 2+)

1. **Monitor Firebase Console** - Check DAU, retention
2. **Read User Feedback** - Twitter DMs, email
3. **Fix Critical Bugs** - Within 24 hours
4. **Add 5 Challenges/Week** - Based on user requests
5. **Iterate** - Small improvements daily

---

**Ship in 7 days. Iterate forever.**

---

_Quick Start Guide v1.0 | Developer: Binod Acharya | Date: 2026-02-02_

# Challenge System Architecture - Visual Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                    (React Components)                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ChallengeDetailNew.jsx                        │
│                     (Challenge Router)                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Detects challenge.challengeType                          │   │
│  │ Routes to appropriate component                          │   │
│  │ Handles completion callback                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└────┬──────────┬──────────┬──────────┬─────────────────────────┘
     │          │          │          │
     ▼          ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│Multiple │ │Coding  │ │  Lab   │ │Practical │
│ Choice  │ │Challenge│ │Challenge│ │Challenge │
└────┬────┘ └───┬────┘ └───┬────┘ └────┬─────┘
     │          │          │          │
     └──────────┴──────────┴──────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│              challengeValidation.js                              │
│                  (Validation Engine)                             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Coding     │  │     Lab      │  │  Practical   │          │
│  │ Validators   │  │  Validators  │  │  Validators  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data & State                                │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ challenges │  │  Firestore │  │     XP     │                │
│  │   .js      │  │   (Save)   │  │  System    │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Challenge Type Flow

### Multiple Choice Challenge

```
User Opens Challenge
        │
        ▼
┌─────────────────┐
│  Load Questions │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Display Q & A  │◄─────┐
└────────┬────────┘      │
         │               │
         ▼               │
    Select Option        │
         │               │
         ▼               │
┌─────────────────┐      │
│ Submit Answer   │      │
└────────┬────────┘      │
         │               │
         ▼               │
┌─────────────────┐      │
│Validate (Direct │      │
│  Comparison)    │      │
└────────┬────────┘      │
         │               │
    ┌────┴────┐          │
    │Correct? │          │
    └────┬────┘          │
         │               │
    ┌────┴─────┐         │
    │Yes     No│         │
    │          │         │
    ▼          ▼         │
Calculate   Show         │
   XP      Feedback      │
    │                    │
    ▼                    │
More Questions?──────────┘
    │No
    ▼
Complete!
```

### Coding Challenge

```
User Opens Challenge
        │
        ▼
┌─────────────────┐
│  Load Editor    │
│  + Starter Code │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Writes    │
│     Code        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Click "Run"     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Validation Engine      │
│  ┌───────────────────┐  │
│  │JavaScript?        │  │
│  │  → Execute Tests  │  │
│  │Python/Bash/PHP?   │  │
│  │  → Pattern Match  │  │
│  └───────────────────┘  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│ Display Results │
│  - Passed: X/Y  │
│  - Failed tests │
│  - Feedback     │
└────────┬────────┘
         │
    ┌────┴────┐
    │All Pass?│
    └────┬────┘
         │Yes
         ▼
┌─────────────────┐
│Calculate XP     │
│(with penalties) │
└────────┬────────┘
         │
         ▼
    Complete!
```

### Lab Challenge

```
User Opens Challenge
        │
        ▼
┌─────────────────┐
│   Load Lab      │
│  Environment    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Display Steps  │
│  & Instructions │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Explores  │
│   Lab + Hints   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Find Flag      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Submit Flag    │
└────────┬────────┘
         │
         ▼
┌───────────────────────┐
│  Validate Flag        │
│  1. Format Check      │
│  2. Value Check       │
│  3. Case Sensitivity  │
└────────┬──────────────┘
         │
    ┌────┴────┐
    │Correct? │
    └────┬────┘
         │Yes
         ▼
┌─────────────────┐
│Calculate XP     │
│(with hint       │
│ penalties)      │
└────────┬────────┘
         │
         ▼
    Complete!
```

### Practical Challenge

```
User Opens Challenge
        │
        ▼
┌─────────────────┐
│  Load Step 1    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Display Step   │
│  + Instructions │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  Render Input Type   │
│  ┌────────────────┐  │
│  │Multiple Choice │  │
│  │Text Input      │  │
│  │Payload Editor  │  │
│  │Command Input   │  │
│  └────────────────┘  │
└────────┬─────────────┘
         │
         ▼
┌─────────────────┐
│  User Submits   │
│     Answer      │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Validate Step        │
│ (Type-specific)      │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │Correct? │
    └────┬────┘
         │Yes
         ▼
┌─────────────────┐
│  Unlock Next    │
│     Step        │
└────────┬────────┘
         │
         ▼
    More Steps?───────┐
         │No          │
         ▼            │
┌─────────────────┐   │
│Calculate Total  │   │
│      XP         │   │
└────────┬────────┘   │
         │            │
         ▼            │
    Complete!         │
                      │
                      └─► Back to Step 1
```

## Validation System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   challengeValidation.js                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              CODING VALIDATORS                          │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                                                          │     │
│  │  validateJavaScriptCode(code, testCases)               │     │
│  │  ├─► Create sandboxed Function()                       │     │
│  │  ├─► Execute with test inputs                          │     │
│  │  ├─► Compare outputs                                   │     │
│  │  └─► Return results                                    │     │
│  │                                                          │     │
│  │  validatePythonCode(code, patterns)                    │     │
│  │  ├─► Check required patterns                           │     │
│  │  ├─► Check forbidden patterns                          │     │
│  │  ├─► Security validation                               │     │
│  │  └─► Return results                                    │     │
│  │                                                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                LAB VALIDATORS                           │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                                                          │     │
│  │  validateFlag(userFlag, correct, format)               │     │
│  │  ├─► Regex format check                                │     │
│  │  ├─► Exact match comparison                            │     │
│  │  ├─► Case sensitivity check                            │     │
│  │  └─► Return result + hints                             │     │
│  │                                                          │     │
│  │  validateLabSteps(completed, required)                 │     │
│  │  ├─► Compare arrays                                    │     │
│  │  ├─► Find missing steps                                │     │
│  │  └─► Return progress                                   │     │
│  │                                                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │             PRACTICAL VALIDATORS                        │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                                                          │     │
│  │  validatePracticalStep(stepId, answer, config)         │     │
│  │  ├─► Route by type:                                    │     │
│  │  │   ├─► text → validateTextAnswer()                   │     │
│  │  │   ├─► regex → validateRegexAnswer()                 │     │
│  │  │   ├─► multiple_choice → validateMultipleChoice()    │     │
│  │  │   ├─► command → validateCommand()                   │     │
│  │  │   └─► payload → validatePayload()                   │     │
│  │  └─► Return type-specific result                       │     │
│  │                                                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │           RESOURCE RECOMMENDATIONS                      │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                                                          │     │
│  │  getRecommendedResources(type, performance)            │     │
│  │  ├─► Match vulnerability type                          │     │
│  │  ├─► Select internal courses                           │     │
│  │  ├─► Select external links                             │     │
│  │  └─► Return curated list                               │     │
│  │                                                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                 HINT SYSTEM                             │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                                                          │     │
│  │  getProgressiveHint(level, hints)                      │     │
│  │  └─► Return hint at level                              │     │
│  │                                                          │     │
│  │  calculateHintPenalty(used, max)                       │     │
│  │  ├─► 15% penalty per hint                              │     │
│  │  ├─► Max 50% penalty                                   │     │
│  │  └─► Return multiplier                                 │     │
│  │                                                          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## XP Calculation Flow

```
Challenge Completed
        │
        ▼
┌─────────────────┐
│  Base XP from   │
│    Challenge    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Replay   │
└────────┬────────┘
         │
    ┌────┴─────┐
    │Replay?   │
    └────┬─────┘
         │
    ├────┴─────┐
   Yes        No
    │          │
    ▼          ▼
  XP = 0   Calculate
    │      Penalties
    │          │
    │          ▼
    │    ┌─────────────┐
    │    │ Hints Used? │
    │    └──────┬──────┘
    │           │
    │      ┌────┴────┐
    │     Yes       No
    │      │         │
    │      ▼         ▼
    │  Penalty    Full XP
    │  15%/hint   (1.0x)
    │  Max 50%       │
    │      │         │
    │      └────┬────┘
    │           │
    │           ▼
    │    ┌─────────────┐
    │    │  Final XP   │
    │    │  = Base *   │
    │    │  Multiplier │
    │    └──────┬──────┘
    │           │
    └───────────┴──────────┐
                           │
                           ▼
                   ┌──────────────┐
                   │   Save to    │
                   │  Firestore   │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Check Level  │
                   │   Up?        │
                   └──────┬───────┘
                          │
                     ┌────┴────┐
                    Yes       No
                     │         │
                     ▼         ▼
              Show Level   Show XP
               Up Toast    Gained
```

## Component Hierarchy

```
ChallengeDetailNew
├── Header
│   ├── Back Button
│   ├── Challenge Info (type, difficulty)
│   └── Controls
│       ├── Audio Toggle
│       └── Timer
│
├── Content
│   └── Challenge Component (type-specific)
│       │
│       ├─► MultipleChoiceChallenge
│       │   ├── Progress Bar
│       │   ├── Session XP
│       │   ├── Scenario Card
│       │   │   ├── Title
│       │   │   ├── Scenario Text
│       │   │   └── Code Block (optional)
│       │   ├── Question
│       │   │   ├── Question Text
│       │   │   └── Options List
│       │   ├── Hint Button/Box
│       │   ├── Result Box (after submit)
│       │   ├── Resources (after result)
│       │   └── Footer
│       │       └── Submit/Next Button
│       │
│       ├─► CodingChallenge
│       │   ├── Challenge Header
│       │   ├── Objective Card
│       │   ├── Scenario Text
│       │   ├── Code Editor
│       │   │   ├── Editor Header
│       │   │   └── Textarea
│       │   ├── Run Button
│       │   ├── Validation Results
│       │   │   ├── Status
│       │   │   └── Test Cases
│       │   ├── Hints Section
│       │   └── Resources
│       │
│       ├─► LabChallenge
│       │   ├── Challenge Header
│       │   ├── Objective Card
│       │   ├── Scenario Text
│       │   ├── Lab Environment
│       │   │   ├── Environment Info
│       │   │   ├── Tools Available
│       │   │   └── Iframe (optional)
│       │   ├── Steps Guide
│       │   │   └── Step Items
│       │   ├── Flag Submission
│       │   │   ├── Format Display
│       │   │   ├── Input Field
│       │   │   └── Submit Button
│       │   ├── Validation Result
│       │   ├── Hints Section
│       │   └── Resources
│       │
│       └─► PracticalChallenge
│           ├── Challenge Header
│           ├── Objective Card
│           ├── Scenario Text
│           ├── Progress Tracker
│           │   └── Step Indicators
│           ├── Current Step Card
│           │   ├── Step Header
│           │   ├── Description
│           │   ├── Input (type-specific)
│           │   ├── Submit Button
│           │   ├── Result (after submit)
│           │   └── Step Hints
│           ├── Navigation
│           │   ├── Previous Button
│           │   ├── Counter
│           │   └── Next Button
│           ├── Completion Banner
│           └── Resources
│
└── Completion Overlay (when done)
    ├── Success Message
    └── Redirect Notice
```

## Data Flow

```
┌──────────────┐
│ challenges.js│
│  (Static)    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Router     │
│ (URL param)  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ChallengeDetailNew│
│  Find by ID      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Load from       │
│  Firestore       │
│  (Progress)      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Render          │
│  Component       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  User            │
│  Interaction     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Validation      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Save Progress   │
│  to Firestore    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Update User XP  │
│  & Stats         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Check           │
│  Achievements    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Complete &      │
│  Navigate Back   │
└──────────────────┘
```

## File Dependencies

```
ChallengeDetailNew.jsx
├── React (hooks)
├── Router (navigation)
├── Context
│   ├── AuthContext
│   ├── ToastContext
│   ├── AchievementContext
│   └── SoundContext
├── Data
│   └── challenges.js
├── Utils
│   ├── firestore.js
│   ├── xp.js
│   └── useTimer hook
└── Components
    ├── MultipleChoiceChallenge.jsx
    │   ├── challengeValidation.js
    │   ├── xp.js
    │   ├── firestore.js
    │   └── ChallengeComponents.css
    │
    ├── CodingChallenge.jsx
    │   ├── challengeValidation.js
    │   └── ChallengeComponents.css
    │
    ├── LabChallenge.jsx
    │   ├── challengeValidation.js
    │   └── ChallengeComponents.css
    │
    └── PracticalChallenge.jsx
        ├── challengeValidation.js
        └── ChallengeComponents.css
```

## Validation Decision Tree

```
                    User Submits
                         │
                         ▼
                  What Type?
                    ╱    │    ╲
              ╱          │          ╲
         ╱               │               ╲
 Multiple Choice      Coding            Lab            Practical
        │                │                │                 │
        ▼                ▼                ▼                 ▼
    Compare         Language?        Format OK?       What Step Type?
    Index              ╱  ╲              │             ╱   │   │   ╲
        │         ╱        ╲             ▼         ╱      │   │      ╲
        ▼     JavaScript  Python     Match Value?  Text Regex MC Command
    Correct?      │         │            │         │    │    │      │
        │         ▼         ▼            ▼         ▼    ▼    ▼      ▼
        ▼     Execute   Pattern      Correct?   Exact Regex Direct Command
   Result    Tests      Match          │        Match Match Match  Validate
               │         │             │         │    │    │      │
               ▼         ▼             ▼         ▼    ▼    ▼      ▼
           Results   Results        Result    Result Result Result Result
               │         │             │         │    │    │      │
               └─────────┴─────────────┴─────────┴────┴────┴──────┘
                                       │
                                       ▼
                                 Return Result
                                   {success,
                                    feedback,
                                    details}
```

## State Management Flow

```
Challenge Component State
┌─────────────────────────────┐
│                             │
│  Local State:               │
│  ├─ User input              │
│  ├─ Validation results      │
│  ├─ Hints shown/used        │
│  ├─ Current step (if multi) │
│  └─ Session stats           │
│                             │
└──────────┬──────────────────┘
           │
           ▼
    User Interaction
           │
           ▼
    ┌──────────────┐
    │  Validation  │
    └──────┬───────┘
           │
           ▼
    Update Local State
           │
           ▼
    ┌──────────────┐
    │  On Success  │
    └──────┬───────┘
           │
           ▼
    Call onComplete()
           │
           ▼
┌──────────────────────────────┐
│  ChallengeDetailNew          │
│  (Parent Component)          │
│                              │
│  Handles:                    │
│  ├─ Firestore saves          │
│  ├─ XP updates               │
│  ├─ Achievement unlocks      │
│  ├─ Level up checks          │
│  └─ Navigation               │
└──────────────────────────────┘
```

---

## Legend

```
┌────┐
│Box │  = Component/Module
└────┘

  │     = Data flow down
  ▼

  ←     = Data flow left/return
  →

╱ ╲    = Decision point/Branch
  ▼
```

---

This visual guide should help you understand how all the pieces fit together!

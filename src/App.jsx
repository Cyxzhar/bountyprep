import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimationProvider } from './context/AnimationContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AchievementProvider } from './context/AchievementContext';
import { SoundProvider } from './context/SoundContext';
import { Loader2 } from 'lucide-react';

// Lazy load pages for performance
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Splash = lazy(() => import('./pages/Splash/Splash'));
const Welcome = lazy(() => import('./pages/onboarding/Welcome'));
const GoalSelection = lazy(() => import('./pages/onboarding/GoalSelection'));
const ExperienceLevel = lazy(() => import('./pages/onboarding/ExperienceLevel'));
const DailyCommitment = lazy(() => import('./pages/onboarding/DailyCommitment'));
const Analysis = lazy(() => import('./pages/onboarding/Analysis'));
const Paywall = lazy(() => import('./pages/onboarding/Paywall'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Upgrade = lazy(() => import('./pages/Upgrade/Upgrade'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Home = lazy(() => import('./pages/Home/Home'));
const Courses = lazy(() => import('./pages/Courses/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail/CourseDetail'));
const Lesson = lazy(() => import('./pages/Lesson/Lesson'));
const Challenges = lazy(() => import('./pages/Challenges/Challenges'));
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail/ChallengeDetailNew'));
const Interview = lazy(() => import('./pages/Interview/Interview'));
const Progress = lazy(() => import('./pages/Progress/Progress'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
// AdminSeeder removed for security — use Firebase Admin SDK for seeding
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Protected Layout Component
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Auth Router (responsive auth pages)
import { AuthLoginRouter, AuthSignUpRouter } from './components/auth/AuthRouter';

// Loading fallback
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F', color: '#9FEF00' }}>
    <Loader2 size={40} className="spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AnimationProvider>
        <AuthProvider>
          <ToastProvider>
            <AchievementProvider>
              <SoundProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/splash" element={<Splash />} />
                    <Route path="/onboarding/welcome" element={<Welcome />} />
                    <Route path="/onboarding/goal" element={<GoalSelection />} />
                    <Route path="/onboarding/experience" element={<ExperienceLevel />} />
                    <Route path="/onboarding/commitment" element={<DailyCommitment />} />
                    <Route path="/onboarding/analysis" element={<Analysis />} />
                    <Route path="/onboarding/paywall" element={<Paywall />} />
                    <Route path="/auth/signup" element={<AuthSignUpRouter />} />
                    <Route path="/auth/login" element={<AuthLoginRouter />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/course/:id" element={<CourseDetail />} /> {/* Public Preview */}

                    {/* Protected Routes */}
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                    <Route path="/course/:id/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
                    <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
                    <Route path="/challenge/:id" element={<ProtectedRoute><ChallengeDetail /></ProtectedRoute>} />
                    <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />

                    {/* Admin seeder removed for security */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </SoundProvider>
            </AchievementProvider>
          </ToastProvider>
        </AuthProvider>
      </AnimationProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimationProvider } from './context/AnimationContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AchievementProvider } from './context/AchievementContext';
import { SoundProvider } from './context/SoundContext';
import { Loader2 } from 'lucide-react';

// Lazy load pages for performance
const Splash = lazy(() => import('./pages/Splash'));
const Welcome = lazy(() => import('./pages/onboarding/Welcome'));
const GoalSelection = lazy(() => import('./pages/onboarding/GoalSelection'));
const ExperienceLevel = lazy(() => import('./pages/onboarding/ExperienceLevel'));
const DailyCommitment = lazy(() => import('./pages/onboarding/DailyCommitment'));
const Analysis = lazy(() => import('./pages/onboarding/Analysis'));
const Paywall = lazy(() => import('./pages/onboarding/Paywall'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const Login = lazy(() => import('./pages/auth/Login'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Upgrade = lazy(() => import('./pages/Upgrade'));
const Settings = lazy(() => import('./pages/Settings'));
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Challenges = lazy(() => import('./pages/Challenges'));
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetailNew'));
const Interview = lazy(() => import('./pages/Interview'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminSeeder = lazy(() => import('./pages/AdminSeeder'));

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
                    <Route path="/" element={<Splash />} />
                    <Route path="/onboarding/welcome" element={<Welcome />} />
                    <Route path="/onboarding/goal" element={<GoalSelection />} />
                    <Route path="/onboarding/experience" element={<ExperienceLevel />} />
                    <Route path="/onboarding/commitment" element={<DailyCommitment />} />
                    <Route path="/onboarding/analysis" element={<Analysis />} />
                    <Route path="/onboarding/paywall" element={<Paywall />} />
                    <Route path="/auth/signup" element={<SignUp />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/upgrade" element={<Upgrade />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/course/:id" element={<CourseDetail />} />
                    <Route path="/course/:id/lesson/:lessonId" element={<Lesson />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenge/:id" element={<ChallengeDetail />} />
                    <Route path="/interview" element={<Interview />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin-seed" element={<AdminSeeder />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
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

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimationProvider } from './context/AnimationContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Splash from './pages/Splash';
import Welcome from './pages/onboarding/Welcome';
import GoalSelection from './pages/onboarding/GoalSelection';
import ExperienceLevel from './pages/onboarding/ExperienceLevel';
import DailyCommitment from './pages/onboarding/DailyCommitment';
import Analysis from './pages/onboarding/Analysis';
import Paywall from './pages/onboarding/Paywall';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import Interview from './pages/Interview';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AnimationProvider>
        <AuthProvider>
          <ToastProvider>
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
              <Route path="/home" element={<Home />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenge/:id" element={<ChallengeDetail />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </AnimationProvider>
    </BrowserRouter>
  );
}

export default App;

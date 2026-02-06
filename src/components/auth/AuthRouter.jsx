import { Navigate } from 'react-router-dom';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import UnifiedAuth from './UnifiedAuth';
import Login from '../../pages/auth/Login';
import SignUp from '../../pages/auth/SignUp';

/**
 * Smart Auth Router Component
 * - Desktop (>=768px): Shows UnifiedAuth with sliding panels
 * - Mobile (<768px): Shows separate Login/SignUp pages
 */
export function AuthLoginRouter() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <UnifiedAuth />;
  }

  return <Login />;
}

export function AuthSignUpRouter() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <UnifiedAuth />;
  }

  return <SignUp />;
}

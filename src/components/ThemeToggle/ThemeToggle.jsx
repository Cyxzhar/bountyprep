import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

/**
 * Universal Theme Toggle Component
 * Works on landing page and inside the app
 */
export default function ThemeToggle({ className = '', showLabel = false }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={`theme-toggle ${className}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="theme-toggle-icon-wrapper">
                {theme === 'dark' ? (
                    <Sun size={20} className="theme-icon sun" />
                ) : (
                    <Moon size={20} className="theme-icon moon" />
                )}
            </div>
            {showLabel && (
                <span className="theme-toggle-label">
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </span>
            )}
        </button>
    );
}

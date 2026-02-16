import { useTheme } from '../../context/ThemeContext';
import './Logo.css';

export default function Logo({ size = 'md', className = '', style = {}, ...props }) {
    const { theme } = useTheme();

    return (
        <img
            src="/logo.svg"
            alt="Bugora Logo"
            className={`logo logo-${size} ${className}`}
            style={{
                filter: theme === 'light' ? 'invert(1) hue-rotate(180deg) saturate(1.5)' : 'none',
                transition: 'filter 0.3s ease',
                ...style
            }}
            {...props}
        />
    );
}

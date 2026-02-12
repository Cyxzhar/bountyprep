import {
    Trophy, Shield, Search, Globe, Lock, Terminal,
    FileText, Zap, BookOpen, Target, Server, Database
} from 'lucide-react';

const IconMap = {
    'Trophy': Trophy,
    'Shield': Shield,
    'Search': Search,
    'Globe': Globe,
    'Terminal': Terminal,
    'Lock': Lock,
    'FileText': FileText,
    'Zap': Zap,
    'BookOpen': BookOpen,
    'Target': Target,
    'Server': Server,
    'Database': Database
};

export const getIcon = (name) => {
    return IconMap[name] || Trophy;
};

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.bountyprep.app',
    appName: 'BountyPrep',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;

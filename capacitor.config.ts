
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9097506983164770846cd24f31880053',
  appName: 'site-sense-ai-survey',
  webDir: 'dist',
  server: {
    url: 'https://90975069-8316-4770-846c-d24f31880053.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;

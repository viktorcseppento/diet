import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.csepviktor.diet',
  appName: 'Diet',
  webDir: 'dist',
  server: {
    androidScheme: "http",
    cleartext: true
  }
};

export default config;

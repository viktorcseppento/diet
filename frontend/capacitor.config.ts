import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.csepviktor.diet',
  appName: 'Diet',
  webDir: 'dist',
  server: {
    androidScheme: "http",
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: "diet-release.jks",
      keystorePassword: "654321",
      keystoreAlias: "diet-release",
      keystoreAliasPassword: "654321"
    }
  }
};

export default config;

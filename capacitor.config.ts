import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.moneytracker.app',
  appName: 'Money Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#f8fafc',
  },
}

export default config

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.codingSvelte.app',
  appName: 'codingsvelte2',
  webDir: 'build',
  server: {
    url: 'http://192.168.8.110:5173', //     https://jonathan-unscribed-structurally.ngrok-free.dev
    cleartext: true
  }
};

export default config;

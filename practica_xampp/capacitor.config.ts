import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // appId distinto al de la versión Supabase, así las dos apps
  // pueden estar instaladas en el celular al mismo tiempo.
  appId: 'io.ionic.practicaxampp',
  appName: 'practica_xampp',
  webDir: 'www',
  server: {
    // XAMPP responde por http (sin "s"). Con esto el celular
    // sí deja que la app se conecte a http://IP-de-tu-PC/...
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;

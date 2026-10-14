// ------------------------------------------------------------
// supabase.ts   (va en src\app\supabase.ts)
// Conexión con Supabase. Las páginas importan "supabase" desde aquí.
// ------------------------------------------------------------
import { createClient } from '@supabase/supabase-js';

// Proyecto "gestion-alumnos".
// Esta es la llave PUBLISHABLE: está hecha para ir dentro de la app.
// NUNCA pongas aquí la secret key: la app va dentro del APK.
const SUPABASE_URL = 'https://hdawykxyhcgpyzrqztmi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZnBfFIkE2KI73VFdhso_DQ_cHOlVZa9';


// La app NO usa inicio de sesión de Supabase (solo lee carreras y llama a
// 3 funciones), así que se apaga lo de sesiones. Así el cliente no usa el
// almacenamiento ni los "locks" del navegador, que en el WebView de Android
// pueden dejar una petición esperando sin salir nunca hacia internet.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    lock: async (_nombre, _espera, accion) => await accion()
  }
});
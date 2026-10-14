// ------------------------------------------------------------
// sesion.service.ts   (va en src\app\servicios\sesion.service.ts)
// Guarda la sesión del usuario (token, nombre) y la IP del servidor
// XAMPP. Todas las páginas piden aquí la dirección de los PHP.
// ------------------------------------------------------------
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SesionService {

  // IP del servidor por defecto.
  // - En el navegador (ionic serve): 'localhost'
  // - En el celular: la IP de tu PC en la red (ej. 192.168.137.1).
  //   Se puede cambiar desde la pantalla de inicio de sesión.
  private ipPorDefecto = 'localhost';

  // Carpeta dentro de htdocs donde están los PHP
  private carpetaApi = 'api_ionic';

  // ---------- Servidor ----------

  obtenerIp(): string {
    return localStorage.getItem('ip_servidor') || this.ipPorDefecto;
  }

  guardarIp(ip: string) {
    localStorage.setItem('ip_servidor', ip.trim());
  }

  // Regresa la dirección completa de un archivo PHP.
  // Ejemplo: url('registro.php') -> http://localhost/api_ionic/registro.php
  url(archivo: string): string {
    return 'http://' + this.obtenerIp() + '/' + this.carpetaApi + '/' + archivo;
  }

  // ---------- Sesión ----------

  guardarSesion(token: string, usuario: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerToken(): string {
    return localStorage.getItem('token') || '';
  }

  obtenerUsuario(): any {
    const texto = localStorage.getItem('usuario');
    if (texto) {
      return JSON.parse(texto);
    }
    return null;
  }

  // Hay sesión si existe un token guardado
  haySesion(): boolean {
    return this.obtenerToken() !== '';
  }

  // Borra la sesión (la IP del servidor se queda guardada)
  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}

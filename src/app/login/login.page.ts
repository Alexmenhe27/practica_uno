// ------------------------------------------------------------
// login.page.ts   (va en src\app\login\login.page.ts)
// Pantalla de inicio de sesión (viene del proyecto "loginapp").
// Es la primera pantalla: sin iniciar sesión no se puede entrar
// a las demás.
// ------------------------------------------------------------
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [FormsModule, CommonModule, IonButton, IonHeader, IonInput, IonItem, IonContent, IonTitle, IonToolbar]
})
export class LoginPage {
  usuario = {
    correo: '',
    contra: ''
  };

  ipServidor: string = '';

  constructor(private http: HttpClient, private router: Router, private toastCtrl: ToastController, private sesion: SesionService) {
    // Muestra la última IP que se usó (o 'localhost')
    this.ipServidor = this.sesion.obtenerIp();
  }

  async login() {
    if (!this.ipServidor || this.ipServidor.trim() === '') {
      this.mostrarToast('Por favor, ingresa la IP del servidor');
      return;
    }

    if (this.usuario.correo.trim() === '' || this.usuario.contra === '') {
      this.mostrarToast('Por favor, llena los datos de usuario');
      return;
    }

    // Se guarda la IP para que las demás pantallas la usen
    this.sesion.guardarIp(this.ipServidor);
    const url = this.sesion.url('login.php');

    try {
      const res: any = await firstValueFrom(this.http.post(url, this.usuario));

      if (res.status === 'success') {
        this.sesion.guardarSesion(res.token, res.usuario);
        this.usuario.contra = '';
        this.mostrarToast('¡Bienvenido, ' + res.usuario.nombre + '!');
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.mostrarToast(res.mensaje);
      }
    } catch (err) {
      console.error('Error de login:', err);
      this.mostrarToast('Error al conectar con: ' + url);
    }
  }

  // Nuevo: abre Registrar Chango para crear una cuenta.
  // Se guarda la IP para que el registro use el mismo servidor.
  crearCuenta() {
    if (this.ipServidor && this.ipServidor.trim() !== '') {
      this.sesion.guardarIp(this.ipServidor);
    }
    this.router.navigate(['/registro']);
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}

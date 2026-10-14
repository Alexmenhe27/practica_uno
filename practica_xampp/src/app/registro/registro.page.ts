import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonItem, IonInput, IonList, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
     FormsModule, IonButton, IonButtons, IonItem, IonInput, IonList]
})
export class RegistroPage implements OnInit {
  usuario = {
    nombre: '', matricula: '', correo: '', contra: ''};

  constructor(private http: HttpClient, private router: Router, private alertController: AlertController, private sesion: SesionService) { }

  ngOnInit() {
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async guardarDatos() {
    // Validar que no vengan vacíos
    if (!this.usuario.nombre.trim() || !this.usuario.matricula.trim() || !this.usuario.correo.trim() || !this.usuario.contra) {
      await this.mostrarAlerta('Por favor, llena todos los campos');
      return; // Detiene la función y no envía la petición
    }

    // Enviar a XAMPP (registro.php). El token de la sesión se agrega solo.
    let respuesta: any;
    try {
      respuesta = await firstValueFrom(this.http.post(this.sesion.url('registro.php'), this.usuario));
    } catch (error: any) {
      console.log('Error de conexion', error);
      if (error.status !== 401) {
        await this.mostrarAlerta('Error de conexion con el servidor: ' + this.sesion.url('registro.php'));
      }
      return;
    }

    console.log('respuesta del servidor', respuesta);

    if (respuesta.status === 'success') {
      await this.mostrarAlerta(respuesta.mensaje);
      this.router.navigate(['/home']);
    } else if (respuesta.status === 'error') {
      await this.mostrarAlerta(respuesta.mensaje);
    }
  }
}
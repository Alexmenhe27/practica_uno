import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonList, IonSelect, IonSelectOption, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-gestion-carreras',
  templateUrl: './gestion-carreras.page.html',
  styleUrls: ['./gestion-carreras.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput, IonList, IonSelect, IonSelectOption]
})
export class GestionCarrerasPage {

  // Aquí se guardan los datos que el usuario escribe en el formulario
  carrera = {
    nombre: '',
    tipo: ''
  };

  constructor(private http: HttpClient, private router: Router, private alertController: AlertController, private sesion: SesionService) { }

  // Muestra una ventana con un mensaje
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Se ejecuta al presionar el botón "Guardar"
  async guardarDatos() {

    // 1. Revisar que no haya campos vacíos
    let hayVacios = false;

    if (this.carrera.nombre.trim() === '') {
      hayVacios = true;
    }
    if (!this.carrera.tipo) {
      hayVacios = true;
    }

    if (hayVacios) {
      await this.mostrarAlerta('Por favor, llena todos los campos');
      return; // Se detiene aquí y no se envía nada al servidor
    }

    // 2. Enviar los datos a XAMPP (gestion-carreras.php).
    //    Responde: { status: 'success' o 'error', mensaje: '...' }
    let respuesta: any;
    try {
      respuesta = await firstValueFrom(this.http.post(this.sesion.url('gestion-carreras.php'), this.carrera));
    } catch (error: any) {
      console.log('Error de conexion', error);
      if (error.status !== 401) { // 401 = sesión vencida, ya te regresa al login
        await this.mostrarAlerta('Error de conexion con el servidor: ' + this.sesion.url('gestion-carreras.php'));
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
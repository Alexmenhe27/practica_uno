import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonList, IonSelect, IonSelectOption, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-gestion-alumnos',
  templateUrl: './gestion-alumnos.page.html',
  styleUrls: ['./gestion-alumnos.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput, IonList, IonSelect, IonSelectOption]
})
export class GestionAlumnosPage {

  // Aquí se guardan los datos que el usuario escribe en el formulario
  alumno = {
    n_control: '',
    nombre: '',
    snombre: '',
    apat: '',
    amat: '',
    fecha_nac: '',
    genero: '',
    fk_caralu: ''
  };

  // Texto que se ve en el campo de fecha (formato DD/MM/AAAA)
  fechaTexto = '';

  // Carreras de la lista desplegable. Empieza vacía y se llena con las
  // carreras que hay en la base de datos (ver cargarCarreras)
  listaCarreras: any[] = [];

  constructor(private http: HttpClient, private router: Router, private alertController: AlertController, private cdr: ChangeDetectorRef, private sesion: SesionService) { }

  // Ionic ejecuta esta función cada vez que se entra a esta pantalla.
  // Así, si acabas de registrar una carrera nueva, aparece en la lista.
  ionViewWillEnter() {
    this.cargarCarreras();
  }

  // Pide a XAMPP la lista de carreras (listar-carreras.php)
  async cargarCarreras() {
    let respuesta: any;
    try {
      respuesta = await firstValueFrom(this.http.get(this.sesion.url('listar-carreras.php')));
    } catch (error: any) {
      console.log('Error al cargar las carreras', error);
      if (error.status !== 401) { // 401 = sesión vencida, ya te regresa al login
        await this.mostrarAlerta('No se pudieron cargar las carreras: ' + this.sesion.url('listar-carreras.php'));
      }
      return;
    }

    if (respuesta.status !== 'success') {
      await this.mostrarAlerta(respuesta.mensaje);
      return;
    }

    this.listaCarreras = respuesta.carreras;
    this.cdr.markForCheck(); // Le avisa a Angular que actualice la pantalla
  }

  // Se ejecuta cada vez que el usuario escribe en el campo de fecha.
  // Deja solo números, pone las diagonales (DD/MM/AAAA) y guarda la fecha
  // en el formato AAAA-MM-DD, que es el que necesita la base de datos.
  formatearFecha(evento: any) {
    const textoEscrito: string = evento.target.value || '';

    // 1. Quedarse solo con los números
    let soloNumeros = '';
    for (let i = 0; i < textoEscrito.length; i++) {
      const caracter = textoEscrito.charAt(i);
      if (caracter >= '0' && caracter <= '9') {
        soloNumeros = soloNumeros + caracter;
      }
    }

    // 2. Máximo 8 números (2 del día, 2 del mes y 4 del año)
    soloNumeros = soloNumeros.substring(0, 8);

    // 3. Poner una diagonal después del día y otra después del mes
    let fechaConFormato = '';
    for (let i = 0; i < soloNumeros.length; i++) {
      if (i === 2 || i === 4) {
        fechaConFormato = fechaConFormato + '/';
      }
      fechaConFormato = fechaConFormato + soloNumeros.charAt(i);
    }

    // 4. Mostrar en el campo el texto ya con formato
    this.fechaTexto = fechaConFormato;
    evento.target.value = fechaConFormato;

    // 5. Si la fecha está completa, se guarda como AAAA-MM-DD; si no, queda vacía
    if (fechaConFormato.length === 10) {
      const dia = fechaConFormato.substring(0, 2);
      const mes = fechaConFormato.substring(3, 5);
      const anio = fechaConFormato.substring(6, 10);
      this.alumno.fecha_nac = anio + '-' + mes + '-' + dia;
    } else {
      this.alumno.fecha_nac = '';
    }
  }

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

    // 0. Si escribió la fecha pero le faltan números
    if (this.fechaTexto !== '' && this.fechaTexto.length < 10) {
      await this.mostrarAlerta('La fecha debe tener el formato DD/MM/AAAA');
      return;
    }

    // 1. Revisar que no haya campos vacíos (el segundo nombre es opcional)
    let hayVacios = false;

    if (this.alumno.n_control.trim() === '') {
      hayVacios = true;
    }
    if (this.alumno.nombre.trim() === '') {
      hayVacios = true;
    }
    if (this.alumno.apat.trim() === '') {
      hayVacios = true;
    }
    if (this.alumno.amat.trim() === '') {
      hayVacios = true;
    }
    if (this.alumno.fecha_nac.trim() === '') {
      hayVacios = true;
    }
    if (this.alumno.genero.trim() === '') {
      hayVacios = true;
    }
    if (!this.alumno.fk_caralu) {
      hayVacios = true;
    }

    if (hayVacios) {
      await this.mostrarAlerta('Por favor, llena todos los campos');
      return; // Se detiene aquí y no se envía nada al servidor
    }

    // 2. Enviar los datos a XAMPP (gestion-alumnos.php).
    //    Responde: { status: 'success' o 'error', mensaje: '...' }
    let respuesta: any;
    try {
      respuesta = await firstValueFrom(this.http.post(this.sesion.url('gestion-alumnos.php'), this.alumno));
    } catch (error: any) {
      console.log('Error de conexion', error);
      if (error.status !== 401) { // 401 = sesión vencida, ya te regresa al login
        await this.mostrarAlerta('Error de conexion con el servidor: ' + this.sesion.url('gestion-alumnos.php'));
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
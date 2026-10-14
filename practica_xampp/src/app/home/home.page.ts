import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonImg} from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { SesionService } from '../servicios/sesion.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonImg],
})
export class HomePage {
  constructor(private http: HttpClient, private router: Router, private sesion: SesionService) {}

  // Nombre del usuario que inició sesión (se lee de la sesión guardada)
  get nombreUsuario(): string {
    const usuario = this.sesion.obtenerUsuario();
    return usuario ? usuario.nombre : '';
  }

  // Avisa al servidor (logout.php) que se cierra la sesión y regresa al login
  async cerrarSesion() {
    try {
      await firstValueFrom(this.http.post(this.sesion.url('logout.php'), {}));
    } catch (err) {
      // Aunque el servidor no conteste, la sesión se borra en la app
      console.log('No se pudo avisar al servidor', err);
    }
    this.sesion.cerrarSesion();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}

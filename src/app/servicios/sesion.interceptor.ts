// ------------------------------------------------------------
// sesion.interceptor.ts   (va en src\app\servicios\sesion.interceptor.ts)
// Se ejecuta en CADA petición que la app hace a los PHP:
//  1. Le agrega el token de la sesión en el encabezado "X-Token".
//  2. Si el PHP responde 401 (sesión no válida o vencida), borra la
//     sesión y regresa al login.
// ------------------------------------------------------------
import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SesionService } from './sesion.service';

export const sesionInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const sesion = inject(SesionService);
  const router = inject(Router);

  const token = sesion.obtenerToken();
  if (token !== '') {
    peticion = peticion.clone({ setHeaders: { 'X-Token': token } });
  }

  return siguiente(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        sesion.cerrarSesion();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

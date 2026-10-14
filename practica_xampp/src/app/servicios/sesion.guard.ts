// ------------------------------------------------------------
// sesion.guard.ts   (va en src\app\servicios\sesion.guard.ts)
// "Guardias" de las rutas:
//  - sesionGuard: si NO hay sesión, manda al login.
//  - loginGuard:  si YA hay sesión, el login manda directo a home.
// ------------------------------------------------------------
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from './sesion.service';

export const sesionGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);

  if (sesion.haySesion()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);

  if (sesion.haySesion()) {
    return router.createUrlTree(['/home']);
  }
  return true;
};

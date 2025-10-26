import {HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req).pipe(
    catchError((err) => {
      if (err?.status === 401){
        auth.logout();
        router.navigate(['/connexion']);
      }
      return throwError(() => err);
    })
  );
};

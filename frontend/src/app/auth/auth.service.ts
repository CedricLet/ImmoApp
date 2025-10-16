import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { API_URL } from '../constants';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError} from 'rxjs';

const TOKEN_KEY = 'jwt'; // unique key et centralise

@Injectable({ providedIn: 'root' })
export class AuthService {
  // état d'auth réactif (utile pour afficher/masquer des éléments du menu)
  private _isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(TOKEN_KEY));
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${API_URL}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.token);
          this._isLoggedIn$.next(true);
        }),
        catchError((err) => {
          // erreur propre (401 attendu coté back)
          this._isLoggedIn$.next(false);
          return throwError(() => err);
        })
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._isLoggedIn$.next(false);
    this.router.navigate(['/connexion']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_URL } from '../constants';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${API_URL}/login`, { email, password })
      .pipe(tap((res) => localStorage.setItem('jwt', res.token)));
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/connexion']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}

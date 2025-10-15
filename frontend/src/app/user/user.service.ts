import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_URL } from '../constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${API_URL}/user`);
  }
}

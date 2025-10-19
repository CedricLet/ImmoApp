import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Properties, Property } from './property';
import { API_URL } from '../constants';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  constructor(private http: HttpClient) {}

  getProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${API_URL}/property/info/${id}`);
  }

  getProperties(pageIndex: number = 0, search: string = '') {
    return this.http.get<{ content: Properties[]; totalElements: number }>(
      `${API_URL}/property/list`,
      {
        params: {
          page: pageIndex.toString(),
          search: search,
        },
      }
    );
  }
}

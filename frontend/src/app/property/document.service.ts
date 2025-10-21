import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL} from '../constants';
import {Document, DocumentCategory, DocumentListResponse, DocumentTag} from './document';

@Injectable({ providedIn: 'root'})
export class DocumentService {
  constructor(private http: HttpClient) {}

  listDocuments(opts: {
    page?: number;
    search?: string;
    documentCategory?: DocumentCategory | '';
    energyType?: string | '';
    tags?: string[];
    propertyId?: number;
  }): Observable<DocumentListResponse> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('search', opts.search ?? '')
      .set('documentCategory', (opts.documentCategory ?? '').toString())
      .set('energyType', opts.energyType ?? '')
      .set('tags', (opts.tags ?? []).join(','));

    if (opts.propertyId) params = params.set('propertyId', String(opts.propertyId));
    return this.http.get<DocumentListResponse>(`${API_URL}/document/list`, {params});
  }

  getAllTags(): Observable<DocumentTag[]> {
    return this.http.get<DocumentTag[]>(`${API_URL}/document/tags`);
  }

  uploadDocument(fd: FormData): Observable<Document> {
    return this.http.post<Document>(`${API_URL}/document/upload`, fd);
  }

  updateDocument(id: number, body: Partial<Document>): Observable<Document> {
    return this.http.put<Document>(`${API_URL}/document/${id}`, body);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/document/${id}`);
  }
}

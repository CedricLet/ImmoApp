import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL} from '../constants';
import {Document, DocumentCategory, DocumentListResponse, DocumentTag} from './document';
import {AiExtraction} from './ai-extraction';

@Injectable({ providedIn: 'root'})
export class DocumentService {
  constructor(private readonly http: HttpClient) {}

  listDocuments(opts: {
    page?: number;
    search?: string;
    documentCategory?: DocumentCategory | '';
    utilityType?: string | '';
    tags?: string[];
    propertyId?: number;
  }): Observable<DocumentListResponse> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('search', opts.search ?? '')
      .set('documentCategory', (opts.documentCategory ?? '').toString())
      .set('utilityType', opts.utilityType ?? '')
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

  previewDocument(fd: FormData) {
    return this.http.post<AiExtraction>(`${API_URL}/document/preview`, fd);
  }

  stage(fd: FormData) {
    return this.http.post<{
      tempId: string;
      originalFileName: string;
      mimeType: string;
      sizeBytes: number;
      ai: {
        documentCategory: string | null;
        utilityType: string | null;
        tags: string[];
        suggestedFileName: string | null;
      };
    }>(`${API_URL}/document/stage`, fd);
  }

  finalize(body: {
    tempId: string;
    category: string;
    utilityType?: string | null;
    tags?: string[];
    clientFileName?: string;
    propertyId?: number;
  }) {
    const params: any = {
      tempId: body.tempId,
      category: body.category,
    };
    if (body.utilityType) params.utilityType = body.utilityType;
    if (body.tags?.length) params.tags = body.tags.join(',');
    if (body.propertyId) params.propertyId = String(body.propertyId);
    if (body.clientFileName) params.clientFileName = body.clientFileName;

    return this.http.post<Document>(`${API_URL}/document/finalize`, null, { params });
  }

  discard(tempId: string) {
    return this.http.delete<void>(`${API_URL}/document/discard`, { params: { tempId }});
  }


}

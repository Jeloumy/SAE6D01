import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenCageService {
  private apiUrl = 'https://api.opencagedata.com/geocode/v1/json';

  constructor(private http: HttpClient) {}

  getGeolocation(query: string): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('key', '841e542e431e473a8ea1190a07f6b48e')
      .set('language', 'fr')
      .set('pretty', '1');

    return this.http.get<any>(this.apiUrl, { params });
  }
}

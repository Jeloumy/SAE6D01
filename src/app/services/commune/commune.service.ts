import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  constructor(private http: HttpClient) {}

  fetchCommunes(query: string): Observable<any> {
    const dataGouvApiUrl = `https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code&format=json&geometry=centre`;

    return this.http
      .get(dataGouvApiUrl)
      .pipe(map((response: any) => this.formatCommuneData(response)));
  }

  private formatCommuneData(response: any): { id: string; name: string }[] {
    if (response && response.length > 0) {
      return response.map((city: any) => ({
        id: city.code,
        name: city.nom,
      }));
    } else {
      return [];
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesLibreService {
  private apiUrl = 'https://acceslibre.beta.gouv.fr/api/erps';

  constructor(private http: HttpClient) { }

  getErp(filters: any, apiKey: string): Observable<any> {
    // Construire l'URL avec les filtres
    let params = new HttpParams();
    if (filters.quantity) params = params.set('page_size', filters.quantity);
    if (filters.enseigne) params = params.set('q', filters.enseigne);
    if (filters.ville) params = params.set('commune', filters.ville);
    if (filters.zone && filters.zone.length > 0) params = params.set('zone', filters.zone.join(','));
    if (filters.handicaps && filters.handicaps.length > 0) {
      filters.handicaps.forEach((equipment: string) => {
          params = params.append('equipments', equipment);
      });
    }

    // Construction des en-têtes de la requête avec la clé d'API
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key ${apiKey}`
    });

    console.log(params);

    return this.http.get<any>(this.apiUrl, { params: params, headers: headers });
  }

  getResultsByUrl(url: string, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Api-Key ${apiKey}`
    });
  
    return this.http.get<any>(url, { headers: headers });
  }
}